import React, { useRef, useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CapatainContext'
import LiveTracking from '../components/LiveTracking'
import axios from 'axios'

const CaptainHome = () => {
    const [ridePopupPanel, setRidePopupPanel] = useState(false)
    const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false)
    const [isOnline, setIsOnline] = useState(true)
    const [showProfile, setShowProfile] = useState(false)
    const [captainLocation, setCaptainLocation] = useState(null)

    const ridePopupPanelRef = useRef(null)
    const confirmRidePopupPanelRef = useRef(null)
    const [ride, setRide] = useState(null)

    const navigate = useNavigate()
    const { socket } = useContext(SocketContext)
    const { captain } = useContext(CaptainDataContext)

    useEffect(() => {
        if (captain?._id) {
            socket.emit('join', {
                userId: captain._id,
                userType: 'captain'
            })
        }

        const updateLocation = () => {
            if (navigator.geolocation && isOnline && captain?._id) {
                navigator.geolocation.getCurrentPosition(position => {
                    const coords = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }
                    setCaptainLocation(coords)

                    socket.emit('update-location-captain', {
                        userId: captain._id,
                        location: {
                            ltd: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    })
                })
            }
        }

        const locationInterval = setInterval(updateLocation, 10000)
        updateLocation()

        return () => clearInterval(locationInterval)
    }, [captain, isOnline])

    socket.on('new-ride', (data) => {
        if (isOnline) {
            setRide(data)
            setRidePopupPanel(true)
        }
    })

    async function confirmRide() {
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {
                rideId: ride?._id,
                captainId: captain?._id,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            setRidePopupPanel(false)
            setConfirmRidePopupPanel(true)
        } catch (err) {
            console.error('Error confirming ride:', err)
        }
    }

    useGSAP(function () {
        if (ridePopupPanel) {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ridePopupPanel])

    useGSAP(function () {
        if (confirmRidePopupPanel) {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [confirmRidePopupPanel])

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/captain-login')
    }

    const rideStatus = confirmRidePopupPanel ? 'accepted' : ridePopupPanel ? 'searching' : null

    return (
        <div className='h-screen relative overflow-hidden bg-gray-900' style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Header Overlay */}
            <div className='fixed p-4 top-0 z-20 flex items-center justify-between w-screen bg-gradient-to-b from-black/80 to-transparent pointer-events-none'>
                <div className='pointer-events-auto flex items-center gap-2 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-emerald-500/30 text-white shadow-lg'>
                    <span className='w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping'></span>
                    <span className='font-bold text-xs uppercase tracking-wider text-emerald-400'>Captain Portal</span>
                </div>

                <div className='pointer-events-auto flex items-center gap-3'>
                    {/* Online Toggle Pill */}
                    <button
                        onClick={() => setIsOnline(!isOnline)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg ${
                            isOnline
                                ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                                : 'bg-gray-800 text-gray-300 border border-gray-700'
                        }`}
                    >
                        <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-white animate-pulse' : 'bg-gray-500'}`}></span>
                        {isOnline ? 'Online' : 'Offline'}
                    </button>

                    {/* Profile Button */}
                    <button
                        onClick={() => setShowProfile(true)}
                        className='w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-base border-2 border-white shadow-lg hover:bg-emerald-500 transition-colors capitalize'
                    >
                        {captain?.fullname?.firstname?.[0] || 'C'}
                    </button>
                </div>
            </div>

            {/* Embedded Live Map */}
            <div className='h-3/5 w-full relative z-0'>
                <LiveTracking
                    captainLocation={captainLocation}
                    rideStatus={rideStatus}
                    vehicleType={captain?.vehicle?.vehicleType || 'car'}
                />

                {!isOnline && (
                    <div className='absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center text-white p-6 text-center z-10'>
                        <i className="ri-moon-line text-4xl text-emerald-400 mb-2"></i>
                        <h3 className='text-xl font-bold'>You are currently Offline</h3>
                        <p className='text-xs text-gray-400 mt-1 max-w-xs'>Toggle to Online status to start receiving ride requests nearby.</p>
                        <button
                            onClick={() => setIsOnline(true)}
                            className='mt-4 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs rounded-xl shadow-lg transition-all'
                        >
                            Go Online Now
                        </button>
                    </div>
                )}
            </div>

            {/* Captain Stats & Vehicle Info */}
            <div className='h-2/5 p-5 bg-gray-900 text-white rounded-t-3xl shadow-2xl -mt-6 relative z-10 border-t border-gray-800'>
                <CaptainDetails />
            </div>

            {/* Ride Popup Drawer */}
            <div ref={ridePopupPanelRef} className='fixed w-full z-30 bottom-0 translate-y-full bg-white px-4 py-8 pt-10 rounded-t-3xl shadow-2xl'>
                <RidePopUp
                    ride={ride}
                    setRidePopupPanel={setRidePopupPanel}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    confirmRide={confirmRide}
                />
            </div>

            {/* Confirm Ride Popup Drawer */}
            <div ref={confirmRidePopupPanelRef} className='fixed w-full h-screen z-30 bottom-0 translate-y-full bg-white px-4 py-8 pt-10 rounded-t-3xl shadow-2xl overflow-y-auto'>
                <ConfirmRidePopUp
                    ride={ride}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    setRidePopupPanel={setRidePopupPanel}
                />
            </div>

            {/* Captain Profile Modal */}
            {showProfile && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4'>
                    <div className='w-full max-w-sm bg-gray-900 text-white rounded-3xl p-6 shadow-2xl border border-gray-800 space-y-5 animate-in zoom-in-95 duration-200'>
                        <div className='flex items-center justify-between border-b border-gray-800 pb-4'>
                            <div className='flex items-center gap-3'>
                                <div className='w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center font-bold text-lg text-white capitalize'>
                                    {captain?.fullname?.firstname?.[0] || 'C'}
                                </div>
                                <div>
                                    <h3 className='font-bold text-base capitalize'>
                                        {captain?.fullname?.firstname} {captain?.fullname?.lastname || ''}
                                    </h3>
                                    <p className='text-xs text-emerald-400 font-semibold'>Captain Account · 4.9★</p>
                                </div>
                            </div>
                            <button onClick={() => setShowProfile(false)} className='text-gray-400 hover:text-white text-xl'>
                                <i className="ri-close-line"></i>
                            </button>
                        </div>

                        {/* Vehicle details */}
                        <div className='p-4 bg-gray-800/60 rounded-2xl border border-gray-700 space-y-2 text-xs'>
                            <p className='text-gray-400 font-semibold uppercase tracking-wider text-[10px]'>Registered Vehicle</p>
                            <div className='flex justify-between items-center'>
                                <span className='font-bold text-sm text-yellow-400 font-mono'>{captain?.vehicle?.plate || 'MH12AB1234'}</span>
                                <span className='capitalize font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded'>{captain?.vehicle?.vehicleType || 'Car'}</span>
                            </div>
                            <p className='text-gray-300 capitalize'>Color: {captain?.vehicle?.color || 'Black'}</p>
                        </div>

                        {/* Stats summary */}
                        <div className='grid grid-cols-2 gap-2 text-center text-xs'>
                            <div className='p-3 bg-gray-800/40 rounded-xl border border-gray-800'>
                                <p className='text-gray-400 text-[10px] uppercase'>Capacity</p>
                                <p className='font-bold text-white text-sm'>{captain?.vehicle?.capacity || 4} seats</p>
                            </div>
                            <div className='p-3 bg-gray-800/40 rounded-xl border border-gray-800'>
                                <p className='text-gray-400 text-[10px] uppercase'>Status</p>
                                <p className='font-bold text-emerald-400 text-sm'>Active & Verified</p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className='w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-lg flex items-center justify-center gap-2'
                        >
                            <i className="ri-logout-box-r-line text-sm"></i>
                            Log Out Captain Account
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CaptainHome