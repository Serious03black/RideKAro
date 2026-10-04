import React from 'react'

const LocationSearchPanel = ({ suggestions = [], setVehiclePanel, setPanelOpen, setPickup, setDestination, activeField, onUseCurrentLocation }) => {

    const handleSuggestionClick = (suggestion) => {
        if (activeField === 'pickup') {
            setPickup(suggestion)
        } else if (activeField === 'destination') {
            setDestination(suggestion)
        }
    }

    return (
        <div className='py-2 space-y-2 max-h-[60vh] overflow-y-auto pr-1' style={{ fontFamily: "'Inter', sans-serif" }}>

            {/* Use Current Location 1-Tap Trigger */}
            {activeField === 'pickup' && (
                <div
                    onClick={() => {
                        if (onUseCurrentLocation) onUseCurrentLocation()
                    }}
                    className='flex items-center gap-3.5 p-3.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-2xl cursor-pointer transition-all duration-150 group shadow-sm mb-2'
                >
                    <div className='w-9 h-9 bg-emerald-600 text-white rounded-full flex items-center justify-center flex-shrink-0 shadow'>
                        <i className="ri-crosshair-2-line text-lg animate-pulse"></i>
                    </div>
                    <div className='flex-1 min-w-0'>
                        <h4 className='font-bold text-sm text-emerald-900 flex items-center gap-1.5'>
                            Use Current Location
                            <span className='px-2 py-0.5 bg-emerald-200 text-emerald-800 text-[10px] font-extrabold rounded-full uppercase'>Live GPS</span>
                        </h4>
                        <p className='text-xs text-emerald-700'>Automatically detect device GPS position</p>
                    </div>
                    <i className="ri-arrow-right-s-line text-emerald-600 text-lg group-hover:translate-x-0.5 transition-transform"></i>
                </div>
            )}

            {/* Suggestions list */}
            {suggestions && suggestions.length > 0 ? (
                suggestions.map((elem, idx) => (
                    <div
                        key={idx}
                        onClick={() => handleSuggestionClick(elem)}
                        className='flex items-center gap-3.5 p-3.5 bg-gray-50 hover:bg-gray-100 border border-gray-200/60 active:border-emerald-500 rounded-2xl cursor-pointer transition-all duration-150 group'
                    >
                        <div className='w-9 h-9 bg-gray-200 group-hover:bg-emerald-500 group-hover:text-white text-gray-600 rounded-full flex items-center justify-center flex-shrink-0 transition-colors'>
                            <i className="ri-map-pin-2-fill text-base"></i>
                        </div>
                        <div className='flex-1 min-w-0'>
                            <h4 className='font-semibold text-sm text-gray-800 truncate group-hover:text-emerald-700 transition-colors'>
                                {elem}
                            </h4>
                            <p className='text-xs text-gray-400'>Tap to select location</p>
                        </div>
                        <i className="ri-arrow-right-s-line text-gray-400 text-lg group-hover:translate-x-0.5 transition-transform"></i>
                    </div>
                ))
            ) : (
                <div className='p-4 text-center text-gray-400 text-sm'>
                    <i className="ri-map-pin-line text-2xl block mb-1"></i>
                    Type a location or select Current Location above
                </div>
            )}
        </div>
    )
}

export default LocationSearchPanel