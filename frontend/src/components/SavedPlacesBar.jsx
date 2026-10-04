import React from 'react'

const SavedPlacesBar = ({ onSelectPlace }) => {
  const quickPlaces = [
    { label: 'Home', address: 'Bandra West, Hill Road, Mumbai', icon: 'ri-home-4-fill', badgeColor: 'bg-blue-500' },
    { label: 'Work', address: 'BKC Financial Center, Tower B, Mumbai', icon: 'ri-briefcase-4-fill', badgeColor: 'bg-purple-500' },
    { label: 'Airport (T2)', address: 'CSM International Airport Terminal 2', icon: 'ri-plane-fill', badgeColor: 'bg-amber-500' },
    { label: 'Central Station', address: 'Mumbai Central Railway Station', icon: 'ri-train-fill', badgeColor: 'bg-emerald-500' }
  ]

  return (
    <div className='flex items-center gap-2 overflow-x-auto py-2 px-1 scrollbar-none' style={{ fontFamily: "'Inter', sans-serif" }}>
      {quickPlaces.map((place, idx) => (
        <button
          key={idx}
          onClick={() => onSelectPlace(place.address)}
          className='flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-200/80 active:scale-95 rounded-full text-xs font-semibold text-gray-700 whitespace-nowrap transition-all flex-shrink-0'
        >
          <span className={`w-4 h-4 ${place.badgeColor} text-white rounded-full flex items-center justify-center text-[10px]`}>
            <i className={place.icon}></i>
          </span>
          <span>{place.label}</span>
        </button>
      ))}
    </div>
  )
}

export default SavedPlacesBar
