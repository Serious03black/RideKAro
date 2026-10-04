import React, { useState } from 'react'

const vehicleImages = {
  car: 'https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg',
  motorcycle: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png',
  auto: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png',
}

const LookingForDriver = (props) => {
  const [showFullPickup, setShowFullPickup] = useState(false)
  const [showFullDestination, setShowFullDestination] = useState(false)
  const vehicleImg = vehicleImages[props.vehicleType] || vehicleImages.car

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <h5
        className='p-1 text-center w-full absolute top-0 left-0 cursor-pointer'
        onClick={() => props.setVehicleFound(false)}
      >
        <i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className='text-2xl font-bold mb-4 mt-2'>Looking for a Driver</h3>

      {/* Pulsing indicator + image */}
      <div className='flex flex-col items-center justify-center my-3'>
        <div className='relative flex items-center justify-center'>
          <div className='absolute w-28 h-28 bg-emerald-100 rounded-full animate-ping opacity-75'></div>
          <img className='h-24 object-contain relative z-10' src={vehicleImg} alt="Vehicle" />
        </div>
        <p className='text-xs text-gray-400 font-medium mt-3 flex items-center gap-2'>
          <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse'></span>
          Connecting with nearby captains...
        </p>
      </div>

      {/* Details Card */}
      <div className='w-full rounded-2xl border border-gray-100 bg-gray-50 overflow-hidden mb-4 mt-4'>
        <div className='flex items-center gap-4 p-3 border-b border-gray-200'>
          <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0'>
            <i className="ri-map-pin-user-fill text-green-600 text-sm"></i>
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-xs text-gray-400 font-medium uppercase tracking-wide'>Pickup Location</p>
            <p
              className={`text-sm font-semibold text-gray-800 ${showFullPickup ? '' : 'truncate'} cursor-pointer`}
              onClick={() => setShowFullPickup(!showFullPickup)}
            >
              {props.pickup || '—'}
            </p>
          </div>
        </div>

        <div className='flex items-center gap-4 p-3 border-b border-gray-200'>
          <div className='w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0'>
            <i className="ri-map-pin-2-fill text-red-500 text-sm"></i>
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-xs text-gray-400 font-medium uppercase tracking-wide'>Destination</p>
            <p
              className={`text-sm font-semibold text-gray-800 ${showFullDestination ? '' : 'truncate'} cursor-pointer`}
              onClick={() => setShowFullDestination(!showFullDestination)}
            >
              {props.destination || '—'}
            </p>
          </div>
        </div>

        <div className='flex items-center gap-4 p-3'>
          <div className='w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0'>
            <i className="ri-money-rupee-circle-fill text-yellow-600 text-sm"></i>
          </div>
          <div>
            <p className='text-xs text-gray-400 font-medium uppercase tracking-wide'>Estimated Fare · Cash</p>
            <p className='text-base font-bold text-gray-900'>₹{props.fare?.[props.vehicleType] ?? '—'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LookingForDriver