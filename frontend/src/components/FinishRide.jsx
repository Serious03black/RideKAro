import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const FinishRide = (props) => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const user = props.ride?.user

  async function endRide() {
    try {
      setLoading(true)
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/end-ride`,
        { rideId: props.ride?._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      if (response.status === 200) {
        navigate('/captain-home')
      }
    } catch (err) {
      console.error('Error ending ride:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <h5
        className='p-1 text-center w-full absolute top-0 left-0 cursor-pointer'
        onClick={() => props.setFinishRidePanel(false)}
      >
        <i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className='text-2xl font-bold mb-4 mt-2'>Complete this Trip</h3>

      {/* Passenger Header */}
      <div className='flex items-center justify-between p-4 bg-gray-900 text-white rounded-2xl mb-4 shadow'>
        <div className='flex items-center gap-3'>
          <div className='w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center font-bold text-white text-xl capitalize'>
            {user?.fullname?.firstname?.[0] || 'U'}
          </div>
          <div>
            <h4 className='font-bold text-lg capitalize'>
              {user?.fullname?.firstname} {user?.fullname?.lastname}
            </h4>
            <p className='text-xs text-emerald-400 font-medium flex items-center gap-1'>
              <i className="ri-checkbox-circle-fill"></i> Arrived at destination
            </p>
          </div>
        </div>
        <div className='text-right'>
          <p className='text-xs text-gray-400 font-medium uppercase'>Collect Cash</p>
          <p className='text-xl font-extrabold text-emerald-400'>₹{props.ride?.fare ?? '—'}</p>
        </div>
      </div>

      {/* Route Details */}
      <div className='w-full rounded-2xl border border-gray-100 bg-gray-50 overflow-hidden mb-6'>
        <div className='flex items-center gap-4 p-3.5 border-b border-gray-200'>
          <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0'>
            <i className="ri-map-pin-user-fill text-green-600 text-sm"></i>
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-xs text-gray-400 font-medium uppercase tracking-wide'>Pickup Location</p>
            <p className='text-sm font-semibold text-gray-800 truncate'>{props.ride?.pickup || '—'}</p>
          </div>
        </div>

        <div className='flex items-center gap-4 p-3.5'>
          <div className='w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0'>
            <i className="ri-map-pin-2-fill text-red-500 text-sm"></i>
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-xs text-gray-400 font-medium uppercase tracking-wide'>Dropoff Location</p>
            <p className='text-sm font-semibold text-gray-800 truncate'>{props.ride?.destination || '—'}</p>
          </div>
        </div>
      </div>

      <button
        onClick={endRide}
        disabled={loading}
        className='w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2'
      >
        {loading ? (
          <i className="ri-loader-4-line animate-spin text-2xl"></i>
        ) : (
          <>
            <i className="ri-checkbox-circle-fill text-xl"></i>
            Finish Ride & Collect Payment
          </>
        )}
      </button>
    </div>
  )
}

export default FinishRide