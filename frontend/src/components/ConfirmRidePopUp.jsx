import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ConfirmRidePopUp = (props) => {
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const user = props.ride?.user

  const submitHandler = async (e) => {
    e.preventDefault()
    if (!otp || otp.length < 4) {
      setError('Please enter a valid 4-digit OTP')
      return
    }

    try {
      setLoading(true)
      setError('')
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`, {
        params: {
          rideId: props.ride._id,
          otp: otp
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.status === 200) {
        props.setConfirmRidePopupPanel(false)
        props.setRidePopupPanel(false)
        navigate('/captain-riding', { state: { ride: props.ride } })
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please ask the passenger for the correct code.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <h5
        className='p-1 text-center w-full absolute top-0 left-0 cursor-pointer'
        onClick={() => props.setConfirmRidePopupPanel(false)}
      >
        <i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className='text-2xl font-bold mb-4 mt-2'>Confirm Ride & Enter OTP</h3>

      {/* Passenger Header */}
      <div className='flex items-center justify-between p-3.5 bg-gray-900 text-white rounded-2xl mb-4 shadow'>
        <div className='flex items-center gap-3'>
          <div className='w-11 h-11 bg-emerald-500 rounded-full flex items-center justify-center font-bold text-white text-lg capitalize'>
            {user?.fullname?.firstname?.[0] || 'U'}
          </div>
          <div>
            <h4 className='font-semibold text-base capitalize'>
              {user?.fullname?.firstname} {user?.fullname?.lastname}
            </h4>
            <p className='text-xs text-emerald-400 font-medium'>Ready for pickup</p>
          </div>
        </div>
        <div className='text-right'>
          <p className='text-base font-bold text-emerald-400'>₹{props.ride?.fare ?? '—'}</p>
        </div>
      </div>

      {/* Route Info */}
      <div className='w-full rounded-2xl border border-gray-100 bg-gray-50 overflow-hidden mb-4'>
        <div className='flex items-center gap-4 p-3 border-b border-gray-200'>
          <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0'>
            <i className="ri-map-pin-user-fill text-green-600 text-sm"></i>
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-xs text-gray-400 font-medium uppercase tracking-wide'>Pickup Location</p>
            <p className='text-sm font-semibold text-gray-800 truncate'>{props.ride?.pickup || '—'}</p>
          </div>
        </div>

        <div className='flex items-center gap-4 p-3'>
          <div className='w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0'>
            <i className="ri-map-pin-2-fill text-red-500 text-sm"></i>
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-xs text-gray-400 font-medium uppercase tracking-wide'>Dropoff Location</p>
            <p className='text-sm font-semibold text-gray-800 truncate'>{props.ride?.destination || '—'}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className='bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-xl text-xs font-semibold mb-3 flex items-center gap-2'>
          <i className="ri-error-warning-fill text-base"></i>
          <span>{error}</span>
        </div>
      )}

      {/* OTP Form */}
      <form onSubmit={submitHandler}>
        <div className='mb-4'>
          <label className='block text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1.5'>
            Passenger OTP Code
          </label>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            type="text"
            maxLength={6}
            className='bg-gray-100 border-2 border-gray-200 focus:border-emerald-500 focus:bg-white text-center tracking-[0.5em] font-mono text-2xl font-bold py-3.5 rounded-2xl w-full outline-none transition-all'
            placeholder='••••'
          />
        </div>

        <div className='flex gap-3'>
          <button
            type="button"
            onClick={() => {
              props.setConfirmRidePopupPanel(false)
              props.setRidePopupPanel(false)
            }}
            className='w-1/3 bg-red-50 text-red-600 border border-red-200 font-semibold py-3.5 rounded-2xl hover:bg-red-100 transition-colors'
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className='w-2/3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2'
          >
            {loading ? (
              <i className="ri-loader-4-line animate-spin text-xl"></i>
            ) : (
              <>
                <i className="ri-steering-2-fill text-lg"></i>
                Start Trip
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ConfirmRidePopUp