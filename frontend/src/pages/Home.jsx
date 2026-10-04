import React, { useEffect, useRef, useState, useContext } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import axios from 'axios'
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel'
import VehiclePanel from '../components/VehiclePanel'
import ConfirmRide from '../components/ConfirmRide'
import LookingForDriver from '../components/LookingForDriver'
import WaitingForDriver from '../components/WaitingForDriver'
import UserProfileModal from '../components/UserProfileModal'
import EmergencySOSModal from '../components/EmergencySOSModal'
import SavedPlacesBar from '../components/SavedPlacesBar'
import { SocketContext } from '../context/SocketContext'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import LiveTracking from '../components/LiveTracking'

const Home = () => {
    const [pickup, setPickup] = useState('')
    const [destination, setDestination] = useState('')
    const [panelOpen, setPanelOpen] = useState(false)
    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const vehicleFoundRef = useRef(null)
    const waitingForDriverRef = useRef(null)
    const panelRef = useRef(null)
    const panelCloseRef = useRef(null)
    const [vehiclePanel, setVehiclePanel] = useState(false)
    const [confirmRidePanel, setConfirmRidePanel] = useState(false)
    const [vehicleFound, setVehicleFound] = useState(false)
    const [waitingForDriver, setWaitingForDriver] = useState(false)
    const [pickupSuggestions, setPickupSuggestions] = useState([])
    const [destinationSuggestions, setDestinationSuggestions] = useState([])
    const [activeField, setActiveField] = useState(null)
    const [fare, setFare] = useState({})
    const [vehicleType, setVehicleType] = useState(null)
    const [ride, setRide] = useState(null)
    const [locatingUser, setLocatingUser] = useState(false)

    // Modals state
    const [profileOpen, setProfileOpen] = useState(false)
    const [sosOpen, setSosOpen] = useState(false)

    const navigate = useNavigate()
    const { socket } = useContext(SocketContext)
    const { user } = useContext(UserDataContext)

    useEffect(() => {
        if (user?._id) {
            socket.emit("join", { userType: "user", userId: user._id })
        }
    }, [user])

    socket.on('ride-confirmed', ride => {
        setVehicleFound(false)
        setWaitingForDriver(true)
        setRide(ride)
    })

    socket.on('ride-started', ride => {
        setWaitingForDriver(false)
        navigate('/riding', { state: { ride } })
    })

    const handlePickupChange = async (e) => {
        setPickup(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setPickupSuggestions(response.data)
        } catch (err) {
            console.error('Error fetching pickup suggestions:', err.message)
        }
    }

    const handleDestinationChange = async (e) => {
        setDestination(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setDestinationSuggestions(response.data)
        } catch (err) {
            console.error('Error fetching destination suggestions:', err.message)
        }
    }

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser')
            return
        }

        setLocatingUser(true)
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords
                setPickup(`Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`)
                setLocatingUser(false)
            },
            (err) => {
                console.warn('Geolocation error:', err.message)
                setPickup('Current Location (Bandra West, Mumbai)')
                setLocatingUser(false)
            },
            { enableHighAccuracy: true }
        )
    }

    const submitHandler = (e) => {
        e.preventDefault()
    }

    useGSAP(function () {
        if (panelOpen) {
            gsap.to(panelRef.current, {
                height: '70%',
                padding: 24
            })
            gsap.to(panelCloseRef.current, {
                opacity: 1
            })
        } else {
            gsap.to(panelRef.current, {
                height: '0%',
                padding: 0
            })
            gsap.to(panelCloseRef.current, {
                opacity: 0
            })
        }
    }, [panelOpen])

    useGSAP(function () {
        if (vehiclePanel) {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [vehiclePanel])

    useGSAP(function () {
        if (confirmRidePanel) {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [confirmRidePanel])

    useGSAP(function () {
        if (vehicleFound) {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [vehicleFound])

    useGSAP(function () {
        if (waitingForDriver) {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [waitingForDriver])

    async function findTrip() {
        if (!pickup || !destination) return
        setVehiclePanel(true)
        setPanelOpen(false)

        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
                params: { pickup, destination },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setFare(response.data)
        } catch (err) {
            console.error('Error fetching fare:', err)
        }
    }

    async function createRide() {
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
                pickup,
                destination,
                vehicleType
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
        } catch (err) {
            console.error('Error creating ride:', err)
        }
    }

    const handleSelectSavedPlace = (address) => {
        setDestination(address)
        setPanelOpen(true)
        setActiveField('destination')
    }

    return (
        <div className='h-screen relative overflow-hidden' style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Header overlay */}
            <div className='absolute left-0 top-0 w-full z-20 p-4 flex items-center justify-between pointer-events-none'>
                <div className='pointer-events-auto flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-gray-100'>
                    <div className='w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-black text-sm'>
                        RK
                    </div>
                    <span className='font-extrabold text-sm tracking-tight text-gray-900 pr-1'>RideKAro</span>
                </div>

                <div className='pointer-events-auto flex items-center gap-2'>
                    {/* SOS Shield button */}
                    <button
                        onClick={() => setSosOpen(true)}
                        className='bg-red-500 hover:bg-red-600 active:scale-95 text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg flex items-center gap-1.5 transition-all'
                        title="Emergency SOS Safety Shield"
                    >
                        <i className="ri-alarm-warning-fill text-sm"></i>
                        <span>SOS</span>
                    </button>

                    {/* Profile avatar button */}
                    <button
                        onClick={() => setProfileOpen(true)}
                        className='w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-base border-2 border-white shadow-lg hover:bg-emerald-600 transition-colors capitalize'
                        title="User Account & Profile"
                    >
                        {user?.fullname?.firstname?.[0] || <i className="ri-user-3-fill"></i>}
                    </button>
                </div>
            </div>

            {/* Live Map background */}
            <div className='h-screen w-screen'>
                <LiveTracking />
            </div>

            {/* Bottom Search & Booking Panel */}
            <div className='flex flex-col justify-end h-screen absolute top-0 w-full z-10 pointer-events-none'>
                <div className='p-5 bg-white relative rounded-t-3xl shadow-2xl pointer-events-auto border-t border-gray-100'>
                    <h5 ref={panelCloseRef} onClick={() => setPanelOpen(false)} className='absolute opacity-0 right-6 top-5 text-2xl cursor-pointer text-gray-400 hover:text-black'>
                        <i className="ri-arrow-down-wide-line"></i>
                    </h5>

                    <div className='flex items-center justify-between mb-2'>
                        <h4 className='text-xl font-extrabold text-gray-900'>Find a Ride</h4>
                        <span className='text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1'>
                            <i className="ri-shield-check-fill"></i> Live GPS Active
                        </span>
                    </div>

                    {/* Quick Saved Places Pills */}
                    <SavedPlacesBar onSelectPlace={handleSelectSavedPlace} />

                    {/* Form */}
                    <form className='relative py-2 space-y-3' onSubmit={submitHandler}>
                        <div className="line absolute h-12 w-0.5 top-[38%] left-4 bg-gray-800 rounded-full z-10"></div>
                        <div className='relative flex items-center'>
                            <input
                                onClick={() => {
                                    setPanelOpen(true)
                                    setActiveField('pickup')
                                }}
                                value={pickup}
                                onChange={handlePickupChange}
                                className='bg-gray-100 focus:bg-white focus:border-emerald-500 border border-transparent pl-11 pr-28 py-3 text-sm font-semibold rounded-2xl w-full outline-none transition-all'
                                type="text"
                                placeholder='Enter pickup location'
                            />
                            <button
                                type="button"
                                onClick={handleUseCurrentLocation}
                                className='absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1 transition-all active:scale-95'
                                title="Detect Current GPS Location"
                            >
                                {locatingUser ? (
                                    <i className="ri-loader-4-line animate-spin text-sm"></i>
                                ) : (
                                    <i className="ri-crosshair-2-line text-sm text-emerald-600"></i>
                                )}
                                <span>Live GPS</span>
                            </button>
                        </div>

                        <div className='relative'>
                            <input
                                onClick={() => {
                                    setPanelOpen(true)
                                    setActiveField('destination')
                                }}
                                value={destination}
                                onChange={handleDestinationChange}
                                className='bg-gray-100 focus:bg-white focus:border-emerald-500 border border-transparent pl-11 pr-4 py-3 text-sm font-semibold rounded-2xl w-full outline-none transition-all'
                                type="text"
                                placeholder='Where to?'
                            />
                        </div>
                    </form>

                    <button
                        onClick={findTrip}
                        disabled={!pickup || !destination}
                        className='bg-black hover:bg-gray-800 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl mt-2 w-full text-base shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2'
                    >
                        <i className="ri-search-line"></i>
                        Find Available Rides
                    </button>
                </div>

                <div ref={panelRef} className='bg-white h-0 overflow-hidden pointer-events-auto'>
                    <LocationSearchPanel
                        suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
                        setPanelOpen={setPanelOpen}
                        setVehiclePanel={setVehiclePanel}
                        setPickup={setPickup}
                        setDestination={setDestination}
                        activeField={activeField}
                        onUseCurrentLocation={handleUseCurrentLocation}
                    />
                </div>
            </div>

            {/* Vehicle Selection Drawer */}
            <div ref={vehiclePanelRef} className='fixed w-full z-30 bottom-0 translate-y-full bg-white px-4 py-6 pt-10 rounded-t-3xl shadow-2xl'>
                <VehiclePanel
                    selectVehicle={setVehicleType}
                    fare={fare}
                    setConfirmRidePanel={setConfirmRidePanel}
                    setVehiclePanel={setVehiclePanel}
                />
            </div>

            {/* Confirm Ride Drawer */}
            <div ref={confirmRidePanelRef} className='fixed w-full z-30 bottom-0 translate-y-full bg-white px-4 py-6 pt-10 rounded-t-3xl shadow-2xl'>
                <ConfirmRide
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setConfirmRidePanel={setConfirmRidePanel}
                    setVehicleFound={setVehicleFound}
                />
            </div>

            {/* Looking for Driver Drawer */}
            <div ref={vehicleFoundRef} className='fixed w-full z-30 bottom-0 translate-y-full bg-white px-4 py-6 pt-10 rounded-t-3xl shadow-2xl'>
                <LookingForDriver
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setVehicleFound={setVehicleFound}
                />
            </div>

            {/* Waiting for Driver Drawer */}
            <div ref={waitingForDriverRef} className='fixed w-full z-30 bottom-0 bg-white px-4 py-6 pt-10 rounded-t-3xl shadow-2xl'>
                <WaitingForDriver
                    ride={ride}
                    setVehicleFound={setVehicleFound}
                    setWaitingForDriver={setWaitingForDriver}
                    waitingForDriver={waitingForDriver}
                />
            </div>

            {/* User Profile Drawer Modal */}
            <UserProfileModal
                isOpen={profileOpen}
                onClose={() => setProfileOpen(false)}
                onSelectSavedPlace={handleSelectSavedPlace}
                onOpenSOS={() => setSosOpen(true)}
            />

            {/* Emergency SOS Modal */}
            <EmergencySOSModal
                isOpen={sosOpen}
                onClose={() => setSosOpen(false)}
                currentRide={ride}
            />
        </div>
    )
}

export default Home