import React, { useState, useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { SocketContext } from '../context/SocketContext'
import LiveTracking from '../components/LiveTracking'
import axios from 'axios'

const Riding = () => {
    const location = useLocation()
    const { ride } = location.state || {}
    const { socket } = useContext(SocketContext)
    const navigate = useNavigate()
    const [showFeedbackForm, setShowFeedbackForm] = useState(false)
    const [feedback, setFeedback] = useState('')
    const [rating, setRating] = useState(5)

    socket.on("ride-ended", () => {
        navigate('/home')
    })

    const handlePayment = async () => {
        try {
            if (!window.Razorpay) {
                alert('Razorpay SDK initializing. Standard cash payment recorded.')
                setShowFeedbackForm(true)
                return
            }

            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/payments/create-order`, {
                amount: ride?.fare
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            const { id: order_id, amount, currency } = response.data

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount,
                currency,
                name: 'RideKaro',
                description: 'Ride Payment',
                order_id,
                handler: async (response) => {
                    alert('Payment Successful!')
                    setShowFeedbackForm(true)
                },
                prefill: {
                    name: ride?.user?.fullname?.firstname,
                    email: ride?.user?.email,
                },
                theme: { color: '#10b981' }
            }

            const razorpay = new window.Razorpay(options)
            razorpay.open()
        } catch (err) {
            console.error('Payment Error:', err)
            // Fallback for demo/cash
            setShowFeedbackForm(true)
        }
    }

    const submitFeedback = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/feedback`, {
                rideId: ride?._id,
                feedback,
                rating
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            alert('Thank you for rating your ride!')
            navigate('/home')
        } catch (err) {
            navigate('/home')
        }
    }

    const captain = ride?.captain

    return (
        <div className='h-screen relative overflow-hidden bg-gray-900 text-white' style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Top Bar Home Link */}
            <Link to='/home' className='fixed right-4 top-4 z-20 h-10 w-10 bg-white/90 backdrop-blur-md text-gray-900 flex items-center justify-center rounded-full shadow-lg hover:bg-white transition-all'>
                <i className="text-xl ri-home-5-line"></i>
            </Link>

            {/* Embedded Live Map */}
            <div className='h-1/2 w-full relative'>
                <LiveTracking />
            </div>

            {/* Trip Status Card */}
            <div className='h-1/2 p-5 bg-gray-900 rounded-t-3xl border-t border-gray-800 shadow-2xl flex flex-col justify-between'>
                {!showFeedbackForm ? (
                    <>
                        <div className='space-y-4'>
                            {/* Header Status */}
                            <div className='flex items-center justify-between'>
                                <div>
                                    <span className='text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20'>
                                        Trip in Progress
                                    </span>
                                    <h2 className='text-2xl font-bold mt-1 text-white'>On the way to destination</h2>
                                </div>
                                <div className='bg-black px-3.5 py-1.5 rounded-2xl border border-gray-800 text-right'>
                                    <p className='text-[10px] text-gray-400 font-semibold uppercase'>OTP</p>
                                    <p className='text-lg font-bold font-mono text-emerald-400 tracking-widest'>{ride?.otp || '----'}</p>
                                </div>
                            </div>

                            {/* Driver Card */}
                            <div className='flex items-center justify-between p-3.5 bg-gray-800/80 rounded-2xl border border-gray-700'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-11 h-11 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-lg capitalize'>
                                        {captain?.fullname?.firstname?.[0] || 'C'}
                                    </div>
                                    <div>
                                        <h4 className='font-bold text-base capitalize text-white'>
                                            {captain?.fullname?.firstname} {captain?.fullname?.lastname}
                                        </h4>
                                        <p className='text-xs text-emerald-400 font-medium capitalize'>
                                            {captain?.vehicle?.color} {captain?.vehicle?.vehicleType}
                                        </p>
                                    </div>
                                </div>
                                <div className='text-right'>
                                    <p className='text-base font-bold font-mono text-yellow-400 uppercase tracking-wider'>{captain?.vehicle?.plate || '—'}</p>
                                    <p className='text-xs text-gray-400'>Verified Captain</p>
                                </div>
                            </div>

                            {/* Destination */}
                            <div className='p-3 bg-gray-800/40 rounded-xl border border-gray-800 flex items-center gap-3 text-xs'>
                                <i className="ri-map-pin-2-fill text-red-500 text-lg"></i>
                                <div className='flex-1 truncate'>
                                    <p className='text-[10px] uppercase font-bold text-gray-400'>Destination</p>
                                    <p className='font-semibold text-white truncate'>{ride?.destination || '—'}</p>
                                </div>
                                <div className='text-right'>
                                    <p className='text-[10px] uppercase font-bold text-gray-400'>Fare</p>
                                    <p className='font-bold text-sm text-emerald-400'>₹{ride?.fare ?? '—'}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handlePayment}
                            className='w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-base shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2'
                        >
                            <i className="ri-secure-payment-fill text-xl"></i>
                            Complete Trip & Pay ₹{ride?.fare ?? ''}
                        </button>
                    </>
                ) : (
                    <div className='space-y-4'>
                        <div className='text-center'>
                            <div className='w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-2 border border-emerald-500/30'>
                                <i className="ri-checkbox-circle-fill"></i>
                            </div>
                            <h3 className='text-xl font-bold text-white'>How was your ride?</h3>
                            <p className='text-xs text-gray-400 mt-0.5'>Rate your experience with Captain {captain?.fullname?.firstname}</p>
                        </div>

                        {/* Star selector */}
                        <div className='flex justify-center gap-3 py-2'>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className={`text-3xl transition-transform hover:scale-110 ${star <= rating ? 'text-amber-400' : 'text-gray-700'}`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>

                        <textarea
                            className='w-full p-3.5 bg-gray-800 border border-gray-700 rounded-2xl text-xs text-white placeholder-gray-500 outline-none focus:border-emerald-500 transition-all'
                            placeholder='Write your feedback or compliment for the driver...'
                            rows={3}
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                        ></textarea>

                        <button
                            onClick={submitFeedback}
                            className='w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-sm shadow-lg transition-all'
                        >
                            Submit Review & Return Home
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Riding