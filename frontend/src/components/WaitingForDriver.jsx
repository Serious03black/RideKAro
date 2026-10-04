import React from 'react'

const vehicleImages = {
  car: 'https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg',
  motorcycle: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png',
  auto: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png',
}

const WaitingForDriver = (props) => {
  const captain = props.ride?.captain
  const vehicleType = captain?.vehicle?.vehicleType || 'car'
  const vehicleImg = vehicleImages[vehicleType] || vehicleImages.car

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <h5
        className='p-1 text-center w-full absolute top-0 left-0 cursor-pointer'
        onClick={() => props.setWaitingForDriver(false)}
      >
        <i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i>
      </h5>

      <div className='flex items-center justify-between mt-3 mb-4'>
        <h3 className='text-2xl font-bold'>Captain is on the way</h3>
        <div className='bg-black text-white px-3 py-1.5 rounded-xl text-center shadow'>
          <p className='text-[10px] uppercase tracking-wider text-gray-400 font-semibold'>Share OTP</p>
          <p className='text-lg font-bold tracking-widest text-emerald-400 font-mono'>{props.ride?.otp || '----'}</p>
        </div>
      </div>

      {/* Driver & Vehicle info card */}
      <div className='flex items-center justify-between p-4 bg-gray-900 text-white rounded-2xl mb-4 shadow-md'>
        <div className='flex items-center gap-3'>
          <div className='w-12 h-12 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center text-emerald-400 text-xl font-bold capitalize'>
            {captain?.fullname?.firstname?.[0] || 'C'}
          </div>
          <div>
            <h4 className='font-semibold text-base capitalize'>
              {captain?.fullname?.firstname} {captain?.fullname?.lastname}
            </h4>
            <p className='text-xs text-emerald-400 font-medium capitalize flex items-center gap-1'>
              <i className="ri-shield-check-fill"></i> Verified Captain
            </p>
          </div>
        </div>
        <div className='text-right'>
          <p className='text-sm font-bold tracking-wider text-yellow-400 uppercase font-mono'>{captain?.vehicle?.plate || '—'}</p>
          <p className='text-xs text-gray-300 capitalize'>{captain?.vehicle?.color || ''} {captain?.vehicle?.vehicleType || ''}</p>
        </div>
      </div>

      {/* Route Details Card */}
      <div className='w-full rounded-2xl border border-gray-100 bg-gray-50 overflow-hidden mb-2'>
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
            <p className='text-xs text-gray-400 font-medium uppercase tracking-wide'>Destination</p>
            <p className='text-sm font-semibold text-gray-800 truncate'>{props.ride?.destination || '—'}</p>
          </div>
        </div>

        <div className='flex items-center gap-4 p-3'>
          <div className='w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0'>
            <i className="ri-money-rupee-circle-fill text-yellow-600 text-sm"></i>
          </div>
          <div>
            <p className='text-xs text-gray-400 font-medium uppercase tracking-wide'>Total Fare · Cash</p>
            <p className='text-base font-bold text-gray-900'>₹{props.ride?.fare ?? '—'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WaitingForDriver