import React, { useState, useEffect } from 'react'

const defaultCenter = {
    lat: 19.0760, // Default Mumbai
    lng: 72.8777
}

const LiveTracking = ({ initialPosition }) => {
    const [currentPosition, setCurrentPosition] = useState(initialPosition || defaultCenter)

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords
                    setCurrentPosition({ lat: latitude, lng: longitude })
                },
                (err) => console.warn('Geolocation error:', err.message),
                { enableHighAccuracy: true }
            )

            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords
                    setCurrentPosition({ lat: latitude, lng: longitude })
                },
                (err) => console.warn('Geolocation watch error:', err.message),
                { enableHighAccuracy: true }
            )

            return () => navigator.geolocation.clearWatch(watchId)
        }
    }, [])

    const bboxOffset = 0.012
    const bbox = [
        currentPosition.lng - bboxOffset,
        currentPosition.lat - bboxOffset,
        currentPosition.lng + bboxOffset,
        currentPosition.lat + bboxOffset
    ].join(',')

    return (
        <div className='w-full h-full relative overflow-hidden bg-gray-900' style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Interactive Vector Map Embed */}
            <iframe
                title="Live Tracking Map"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${currentPosition.lat},${currentPosition.lng}`}
                className='w-full h-full border-0 filter brightness-95 contrast-105 pointer-events-auto'
            ></iframe>

            {/* Live Status Overlay */}
            <div className='absolute top-4 left-4 z-10 bg-black/80 backdrop-blur-md text-white text-xs px-3.5 py-1.5 rounded-full border border-emerald-500/40 flex items-center gap-2 shadow-lg pointer-events-none'>
                <span className='w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping'></span>
                <span className='font-bold text-emerald-400'>Live GPS Map Tracking</span>
            </div>

            {/* Recenter Button */}
            <button
                onClick={() => {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(pos => {
                            setCurrentPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude })
                        })
                    }
                }}
                className='absolute bottom-24 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-md text-gray-900 rounded-full flex items-center justify-center shadow-lg hover:bg-white active:scale-95 transition-all'
                title="Recenter Map"
            >
                <i className="ri-crosshair-2-line text-lg font-bold"></i>
            </button>
        </div>
    )
}

export default LiveTracking