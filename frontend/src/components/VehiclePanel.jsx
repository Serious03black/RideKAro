import React from 'react'

const vehicleImages = {
  car: 'https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg',
  motorcycle: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png',
  auto: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png',
}

const VehiclePanel = (props) => {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Drag handle */}
      <h5
        className='p-1 text-center w-full absolute top-0 left-0'
        onClick={() => props.setVehiclePanel(false)}
      >
        <i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className='text-2xl font-bold mb-5 mt-2'>Choose a Vehicle</h3>

      {/* Car */}
      <div
        onClick={() => { props.setConfirmRidePanel(true); props.selectVehicle('car') }}
        className='flex border-2 active:border-black hover:border-gray-400 mb-3 rounded-2xl w-full p-3 items-center justify-between cursor-pointer transition-all'
      >
        <img className='h-12 object-contain' src={vehicleImages.car} alt="Car" />
        <div className='ml-3 flex-1'>
          <h4 className='font-semibold text-base'>RideKAro Car <span className='font-normal text-sm text-gray-500'><i className="ri-user-3-fill"></i> 4</span></h4>
          <h5 className='text-sm text-gray-500'>2 mins away</h5>
          <p className='text-xs text-gray-400'>Affordable, compact rides</p>
        </div>
        <h2 className='text-lg font-bold'>₹{props.fare.car}</h2>
      </div>

      {/* Motorcycle — value must be 'motorcycle' to match backend */}
      <div
        onClick={() => { props.setConfirmRidePanel(true); props.selectVehicle('motorcycle') }}
        className='flex border-2 active:border-black hover:border-gray-400 mb-3 rounded-2xl w-full p-3 items-center justify-between cursor-pointer transition-all'
      >
        <img className='h-12 object-contain' src={vehicleImages.motorcycle} alt="Motorcycle" />
        <div className='ml-3 flex-1'>
          <h4 className='font-semibold text-base'>Moto <span className='font-normal text-sm text-gray-500'><i className="ri-user-3-fill"></i> 1</span></h4>
          <h5 className='text-sm text-gray-500'>3 mins away</h5>
          <p className='text-xs text-gray-400'>Affordable motorcycle rides</p>
        </div>
        {/* Backend fare key is 'motorcycle' */}
        <h2 className='text-lg font-bold'>₹{props.fare.motorcycle}</h2>
      </div>

      {/* Auto */}
      <div
        onClick={() => { props.setConfirmRidePanel(true); props.selectVehicle('auto') }}
        className='flex border-2 active:border-black hover:border-gray-400 mb-3 rounded-2xl w-full p-3 items-center justify-between cursor-pointer transition-all'
      >
        <img className='h-12 object-contain' src={vehicleImages.auto} alt="Auto" />
        <div className='ml-3 flex-1'>
          <h4 className='font-semibold text-base'>Auto <span className='font-normal text-sm text-gray-500'><i className="ri-user-3-fill"></i> 3</span></h4>
          <h5 className='text-sm text-gray-500'>3 mins away</h5>
          <p className='text-xs text-gray-400'>Affordable auto rides</p>
        </div>
        <h2 className='text-lg font-bold'>₹{props.fare.auto}</h2>
      </div>
    </div>
  )
}

export default VehiclePanel