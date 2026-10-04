import React from 'react'

const RidePopUp = (props) => {
  const user = props.ride?.user

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <h5
        className='p-1 text-center w-full absolute top-0 left-0 cursor-pointer'
        onClick={() => props.setRidePopupPanel(false)}
      >
        <i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i>
      </h5>

      <div className='flex items-center justify-between mb-4 mt-2'>
        <h3 className='text-2xl font-bold'>New Ride Request</h3>
        <span className='px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full animate-pulse'>
          Live Request
        </span>
      </div>

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
            <p className='text-xs text-gray-400'>Cash Payment</p>
          </div>
        </div>
        <div className='text-right'>
          <span className='text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20'>
            2.2 km away
          </span>
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

        <div className='flex items-center gap-4 p-3 border-b border-gray-200'>
          <div className='w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0'>
            <i className="ri-map-pin-2-fill text-red-500 text-sm"></i>
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-xs text-gray-400 font-medium uppercase tracking-wide'>Dropoff Location</p>
            <p className='text-sm font-semibold text-gray-800 truncate'>{props.ride?.destination || '—'}</p>
          </div>
        </div>

        <div className='flex items-center gap-4 p-3'>
          <div className='w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0'>
            <i className="ri-money-rupee-circle-fill text-yellow-600 text-sm"></i>
          </div>
          <div>
            <p className='text-xs text-gray-400 font-medium uppercase tracking-wide'>Fare · Cash</p>
            <p className='text-lg font-bold text-gray-900'>₹{props.ride?.fare ?? '—'}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className='flex items-center gap-3'>
        <button
          onClick={() => {
            props.setRidePopupPanel(false)
          }}
          className='w-1/3 bg-gray-200 text-gray-700 font-semibold py-3.5 rounded-2xl hover:bg-gray-300 transition-colors'
        >
          Ignore
        </button>
        <button
          onClick={() => {
            props.setConfirmRidePopupPanel(true)
            props.confirmRide()
          }}
          className='w-2/3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-2xl shadow-lg active:scale-95 transition-all'
        >
          Accept Ride
        </button>
      </div>
    </div>
  )
}

export default RidePopUp