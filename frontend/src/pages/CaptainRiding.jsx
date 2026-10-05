import React, { useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import FinishRide from '../components/FinishRide'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import LiveTracking from '../components/LiveTracking'

const CaptainRiding = () => {
    const [finishRidePanel, setFinishRidePanel] = useState(false)
    const finishRidePanelRef = useRef(null)
    const location = useLocation()
    const rideData = location.state?.ride

    useGSAP(function () {
        if (finishRidePanel) {
            gsap.to(finishRidePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(finishRidePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [finishRidePanel])

    return (
        <div className='h-screen relative overflow-hidden bg-gray-900' style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Top Bar Navigation */}
            <div className='fixed p-4 top-0 z-20 flex items-center justify-between w-screen pointer-events-none'>
                <div className='pointer-events-auto bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-emerald-500/30 text-white flex items-center gap-2 shadow-lg'>
                    <span className='w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping'></span>
                    <span className='font-bold text-xs uppercase tracking-wider text-emerald-400'>On Trip with Passenger</span>
                </div>

                <Link to='/captain-home' className='pointer-events-auto h-10 w-10 bg-white/90 backdrop-blur-md text-gray-900 flex items-center justify-center rounded-full shadow-lg hover:bg-white transition-all'>
                    <i className="text-xl ri-home-5-line"></i>
                </Link>
            </div>

            {/* Embedded Live Map */}
            <div className='h-screen w-screen absolute inset-0 z-0'>
                <LiveTracking
                    rideStatus='ongoing'
                    vehicleType={rideData?.captain?.vehicle?.vehicleType || 'car'}
                />
            </div>

            {/* Bottom Complete Trip Trigger Card */}
            <div
                className='fixed bottom-0 left-0 w-full z-10 p-5 bg-gradient-to-t from-gray-950 via-gray-900 to-gray-900/90 text-white rounded-t-3xl border-t border-gray-800 shadow-2xl cursor-pointer'
                onClick={() => setFinishRidePanel(true)}
            >
                <div className='w-12 h-1 bg-gray-700 rounded-full mx-auto mb-3'></div>

                <div className='flex items-center justify-between'>
                    <div>
                        <span className='text-[10px] uppercase font-bold tracking-wider text-emerald-400'>Navigating to dropoff</span>
                        <h4 className='text-lg font-bold text-white truncate max-w-[220px]'>{rideData?.destination || 'Destination'}</h4>
                        <p className='text-xs text-gray-400'>Passenger: {rideData?.user?.fullname?.firstname} · ₹{rideData?.fare}</p>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setFinishRidePanel(true)
                        }}
                        className='bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-6 rounded-2xl text-xs shadow-lg active:scale-95 transition-all flex items-center gap-2'
                    >
                        <i className="ri-checkbox-circle-fill text-lg"></i>
                        Complete Trip
                    </button>
                </div>
            </div>

            {/* Finish Ride Drawer */}
            <div ref={finishRidePanelRef} className='fixed w-full z-30 bottom-0 translate-y-full bg-white px-4 py-8 pt-10 rounded-t-3xl shadow-2xl'>
                <FinishRide
                    ride={rideData}
                    setFinishRidePanel={setFinishRidePanel}
                />
            </div>
        </div>
    )
}

export default CaptainRiding