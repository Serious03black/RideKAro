import React, { useEffect, useRef, useState } from 'react'

const defaultLocation = { lat: 19.0760, lng: 72.8777 } // Mumbai Default

// Generate Rapido/Uber style nearby vehicles around center
const generateNearbyVehicles = (center) => {
  if (!center?.lat || !center?.lng) return []
  const offsets = [
    { dLat: 0.003, dLng: 0.004, type: 'car', heading: 45 },
    { dLat: -0.004, dLng: 0.003, type: 'moto', heading: 120 },
    { dLat: 0.005, dLng: -0.003, type: 'auto', heading: 210 },
    { dLat: -0.003, dLng: -0.005, type: 'car', heading: 300 },
    { dLat: 0.002, dLng: 0.006, type: 'moto', heading: 90 }
  ]

  return offsets.map((off, idx) => ({
    id: `nearby-${idx}`,
    lat: center.lat + off.dLat,
    lng: center.lng + off.dLng,
    type: off.type,
    heading: off.heading
  }))
}

const LiveTracking = ({
  riderLocation,
  captainLocation,
  pickupCoords,
  destinationCoords,
  rideStatus, // 'searching' | 'accepted' | 'ongoing' | null
  vehicleType = 'car'
}) => {
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef({})
  const routeLineRef = useRef(null)

  const [userPos, setUserPos] = useState(riderLocation || defaultLocation)
  const [nearbyVehicles, setNearbyVehicles] = useState([])

  // 1. Fetch live user geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          setUserPos(coords)
          setNearbyVehicles(generateNearbyVehicles(coords))
        },
        () => {
          setNearbyVehicles(generateNearbyVehicles(defaultLocation))
        },
        { enableHighAccuracy: true }
      )

      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          setUserPos(coords)
        },
        null,
        { enableHighAccuracy: true }
      )

      return () => navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  // 2. Initialize Leaflet Map with Clean OpenStreetMap / Esri Vector Tile Layer (Zero Watermarks)
  useEffect(() => {
    if (!mapContainerRef.current) return
    if (mapInstanceRef.current) return // already initialized

    const L = window.L
    if (!L) return

    const initialCenter = userPos.lat ? [userPos.lat, userPos.lng] : [defaultLocation.lat, defaultLocation.lng]

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 15,
      zoomControl: false,
      attributionControl: false
    })

    // Clean OpenStreetMap Tile Layer (100% Free, Zero Watermark Text)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: 'abc'
    }).addTo(map)

    // Add zoom control top right
    L.control.zoom({ position: 'topright' }).addTo(map)

    mapInstanceRef.current = map

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // 3. Render Markers & Routes based on Ride Status
  useEffect(() => {
    const map = mapInstanceRef.current
    const L = window.L
    if (!map || !L) return

    // Clear previous markers
    Object.values(markersRef.current).forEach((m) => map.removeLayer(m))
    markersRef.current = {}

    if (routeLineRef.current) {
      map.removeLayer(routeLineRef.current)
      routeLineRef.current = null
    }

    const currentRiderPos = riderLocation || userPos

    // Helper for custom HTML markers
    const createHtmlIcon = (html, size = [36, 36]) =>
      L.divIcon({
        html,
        className: 'custom-leaflet-marker',
        iconSize: size,
        iconAnchor: [size[0] / 2, size[1] / 2]
      })

    // A) RIDER MARKER (Always present)
    const riderHtml = `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-8 h-8 bg-blue-500/30 rounded-full animate-ping"></div>
        <div class="w-6 h-6 bg-blue-600 border-2 border-white rounded-full flex items-center justify-center shadow-lg text-white font-bold text-[10px]">
          <i class="ri-user-fill"></i>
        </div>
      </div>
    `
    const riderMarker = L.marker([currentRiderPos.lat, currentRiderPos.lng], {
      icon: createHtmlIcon(riderHtml)
    }).addTo(map)
    markersRef.current['rider'] = riderMarker

    // B) NEARBY VEHICLES (Rapido / Uber style during search/initial phase)
    if (!rideStatus || rideStatus === 'searching') {
      const vehiclesToRender = nearbyVehicles.length > 0 ? nearbyVehicles : generateNearbyVehicles(currentRiderPos)
      vehiclesToRender.forEach((v) => {
        const iconSymbol = v.type === 'moto' ? 'ri-motorbike-fill' : v.type === 'auto' ? 'ri-taxi-fill' : 'ri-car-fill'
        const vehicleHtml = `
          <div class="w-8 h-8 bg-black/90 text-amber-400 border-2 border-amber-400 rounded-full flex items-center justify-center shadow-xl transform transition-transform hover:scale-110">
            <i class="${iconSymbol} text-sm"></i>
          </div>
        `
        const vMarker = L.marker([v.lat, v.lng], {
          icon: createHtmlIcon(vehicleHtml, [32, 32])
        }).addTo(map)
        markersRef.current[v.id] = vMarker
      })

      map.panTo([currentRiderPos.lat, currentRiderPos.lng])
    }

    // C) RIDE ACCEPTED PHASE (Captain on the way to Rider's pickup)
    if (rideStatus === 'accepted' && captainLocation) {
      const capPos = captainLocation
      const pPos = pickupCoords || currentRiderPos

      // Captain Marker
      const captainHtml = `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-10 h-10 bg-emerald-500/30 rounded-full animate-pulse"></div>
          <div class="w-8 h-8 bg-emerald-600 text-white border-2 border-white rounded-full flex items-center justify-center shadow-xl font-bold text-sm">
            <i class="ri-steering-2-fill"></i>
          </div>
        </div>
      `
      const capMarker = L.marker([capPos.lat, capPos.lng], {
        icon: createHtmlIcon(captainHtml)
      }).addTo(map)
      markersRef.current['captain'] = capMarker

      // Pickup Marker
      const pickupHtml = `
        <div class="w-7 h-7 bg-emerald-500 text-white border-2 border-white rounded-full flex items-center justify-center shadow-lg font-bold text-xs">
          <i class="ri-map-pin-user-fill"></i>
        </div>
      `
      const pMarker = L.marker([pPos.lat, pPos.lng], {
        icon: createHtmlIcon(pickupHtml)
      }).addTo(map)
      markersRef.current['pickup'] = pMarker

      // Polyline route from Captain -> Pickup
      const routePoints = [
        [capPos.lat, capPos.lng],
        [pPos.lat, pPos.lng]
      ]
      const polyline = L.polyline(routePoints, {
        color: '#10b981',
        weight: 5,
        opacity: 0.8,
        dashArray: '8, 12'
      }).addTo(map)
      routeLineRef.current = polyline

      // Fit map bounds to show both captain & pickup
      const bounds = L.latLngBounds([
        [capPos.lat, capPos.lng],
        [pPos.lat, pPos.lng]
      ])
      map.fitBounds(bounds, { padding: [60, 60] })
    }

    // D) ONGOING RIDE PHASE (OTP Verified - Moving to Destination)
    if (rideStatus === 'ongoing') {
      const activeCapPos = captainLocation || currentRiderPos
      const destPos = destinationCoords || { lat: currentRiderPos.lat + 0.02, lng: currentRiderPos.lng + 0.02 }

      // Live Driver Marker
      const driverHtml = `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-10 h-10 bg-emerald-400/40 rounded-full animate-ping"></div>
          <div class="w-8 h-8 bg-emerald-500 text-white border-2 border-white rounded-full flex items-center justify-center shadow-2xl font-bold text-sm">
            <i class="ri-car-fill"></i>
          </div>
        </div>
      `
      const driverMarker = L.marker([activeCapPos.lat, activeCapPos.lng], {
        icon: createHtmlIcon(driverHtml)
      }).addTo(map)
      markersRef.current['driver'] = driverMarker

      // Destination Marker
      const destHtml = `
        <div class="w-8 h-8 bg-rose-600 text-white border-2 border-white rounded-full flex items-center justify-center shadow-xl font-bold text-sm">
          <i class="ri-flag-fill"></i>
        </div>
      `
      const destMarker = L.marker([destPos.lat, destPos.lng], {
        icon: createHtmlIcon(destHtml)
      }).addTo(map)
      markersRef.current['destination'] = destMarker

      // Route line from Driver/Pickup -> Destination
      const routePoints = [
        [activeCapPos.lat, activeCapPos.lng],
        [destPos.lat, destPos.lng]
      ]
      const polyline = L.polyline(routePoints, {
        color: '#059669',
        weight: 6,
        opacity: 0.9
      }).addTo(map)
      routeLineRef.current = polyline

      // Fit map bounds to show route
      const bounds = L.latLngBounds([
        [activeCapPos.lat, activeCapPos.lng],
        [destPos.lat, destPos.lng]
      ])
      map.fitBounds(bounds, { padding: [60, 60] })
    }
  }, [userPos, riderLocation, captainLocation, pickupCoords, destinationCoords, rideStatus, nearbyVehicles])

  const handleRecenter = () => {
    const map = mapInstanceRef.current
    if (map && userPos.lat) {
      map.setView([userPos.lat, userPos.lng], 15)
    }
  }

  return (
    <div className='w-full h-full relative overflow-hidden bg-gray-900' style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Leaflet Canvas Container */}
      <div ref={mapContainerRef} className='w-full h-full border-0 filter brightness-95 contrast-105 z-0' />

      {/* Floating GPS & Ride Status Badge */}
      <div className='absolute top-4 left-4 z-10 bg-black/80 backdrop-blur-md text-white text-xs px-3.5 py-1.5 rounded-full border border-emerald-500/40 flex items-center gap-2 shadow-lg pointer-events-none'>
        <span className='w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping'></span>
        <span className='font-bold text-emerald-400'>
          {rideStatus === 'accepted'
            ? 'Captain Approaching Pickup'
            : rideStatus === 'ongoing'
            ? 'Ride in Progress to Destination'
            : 'Live GPS & Nearby Drivers'}
        </span>
      </div>

      {/* Recenter Button */}
      <button
        onClick={handleRecenter}
        className='absolute bottom-24 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-md text-gray-900 rounded-full flex items-center justify-center shadow-lg hover:bg-white active:scale-95 transition-all'
        title="Recenter Map"
      >
        <i className="ri-crosshair-2-line text-lg font-bold"></i>
      </button>
    </div>
  )
}

export default LiveTracking