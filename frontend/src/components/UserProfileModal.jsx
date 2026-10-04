import React, { useState, useContext } from 'react'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'

const UserProfileModal = ({ isOpen, onClose, onSelectSavedPlace, onOpenSOS }) => {
  const { user } = useContext(UserDataContext)
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile') // profile | history | safety | wallet

  if (!isOpen) return null

  const mockHistory = [
    { id: 1, pickup: 'Bandra Kurla Complex, Mumbai', destination: 'Airport Terminal 2, Mumbai', fare: '₹340', date: 'Yesterday, 4:15 PM', status: 'Completed', vehicle: 'RideKAro Go (Car)' },
    { id: 2, pickup: 'Lower Parel Station', destination: 'Juhu Beach, Mumbai', fare: '₹180', date: '02 Oct 2026, 8:30 PM', status: 'Completed', vehicle: 'RideKAro Auto' },
    { id: 3, pickup: 'Andheri Metro Station', destination: 'Infinity Mall, Malad', fare: '₹95', date: '28 Sep 2026, 1:10 PM', status: 'Completed', vehicle: 'RideKAro Moto' }
  ]

  const savedPlaces = [
    { label: 'Home', address: 'Bandra West, Hill Road, Mumbai', icon: 'ri-home-4-fill', color: 'bg-blue-100 text-blue-600' },
    { label: 'Work', address: 'BKC Financial Center, Tower B, Mumbai', icon: 'ri-briefcase-4-fill', color: 'bg-purple-100 text-purple-600' },
    { label: 'Gym', address: 'Gold Gym, Linking Road, Mumbai', icon: 'ri-heart-pulse-fill', color: 'bg-rose-100 text-rose-600' },
    { label: 'Airport', address: 'Chhatrapati Shivaji Maharaj Intl Airport (T2)', icon: 'ri-plane-fill', color: 'bg-amber-100 text-amber-600' }
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className='fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-300' style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Overlay click to close */}
      <div className='flex-1' onClick={onClose}></div>

      {/* Drawer */}
      <div className='w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300'>
        {/* Header */}
        <div className='bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white p-6 relative'>
          <button
            onClick={onClose}
            className='absolute top-5 right-5 w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors'
          >
            <i className="ri-close-line text-xl"></i>
          </button>

          <div className='flex items-center gap-4 mt-2'>
            <div className='w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center text-2xl font-bold border-2 border-emerald-300 shadow-lg capitalize'>
              {user?.fullname?.firstname?.[0] || 'U'}
            </div>
            <div>
              <h3 className='text-xl font-bold capitalize flex items-center gap-2'>
                {user?.fullname?.firstname} {user?.fullname?.lastname}
                <i className="ri-checkbox-circle-fill text-emerald-400 text-lg" title="Verified Customer"></i>
              </h3>
              <p className='text-xs text-gray-300 flex items-center gap-1 mt-0.5'>
                <i className="ri-mail-fill text-emerald-400"></i> {user?.email || 'customer@ridekaro.com'}
              </p>
              <div className='mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-full border border-emerald-500/30'>
                <i className="ri-shield-star-fill text-emerald-400"></i> Premium Passenger · 4.9★
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className='flex border-b border-gray-100 bg-gray-50 px-3 pt-2 text-xs font-semibold text-gray-500'>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2.5 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'profile' ? 'border-emerald-600 text-emerald-600 font-bold' : 'border-transparent hover:text-gray-800'
            }`}
          >
            <i className="ri-user-3-line text-sm"></i> Account
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2.5 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'history' ? 'border-emerald-600 text-emerald-600 font-bold' : 'border-transparent hover:text-gray-800'
            }`}
          >
            <i className="ri-history-line text-sm"></i> Rides
          </button>
          <button
            onClick={() => setActiveTab('safety')}
            className={`flex-1 py-2.5 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'safety' ? 'border-emerald-600 text-emerald-600 font-bold' : 'border-transparent hover:text-gray-800'
            }`}
          >
            <i className="ri-shield-user-line text-sm"></i> Safety
          </button>
        </div>

        {/* Tab Content */}
        <div className='flex-1 overflow-y-auto p-5 space-y-6'>

          {activeTab === 'profile' && (
            <>
              {/* Saved Locations Section */}
              <div>
                <div className='flex items-center justify-between mb-3'>
                  <h4 className='text-xs uppercase tracking-wider font-bold text-gray-400 flex items-center gap-1.5'>
                    <i className="ri-bookmark-3-fill text-emerald-500"></i> Saved Locations
                  </h4>
                  <span className='text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full'>1-Tap Booking</span>
                </div>

                <div className='grid grid-cols-2 gap-2.5'>
                  {savedPlaces.map((place, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        if (onSelectSavedPlace) onSelectSavedPlace(place.address)
                        onClose()
                      }}
                      className='p-3 bg-gray-50 border border-gray-200/80 hover:border-emerald-500 hover:bg-emerald-50/30 rounded-2xl cursor-pointer transition-all group'
                    >
                      <div className='flex items-center gap-2 mb-1'>
                        <div className={`w-7 h-7 ${place.color} rounded-lg flex items-center justify-center text-sm`}>
                          <i className={place.icon}></i>
                        </div>
                        <span className='font-bold text-sm text-gray-800 group-hover:text-emerald-700'>{place.label}</span>
                      </div>
                      <p className='text-xs text-gray-500 truncate'>{place.address}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Reliability & Safety Toolkit Banner */}
              <div className='p-4 rounded-2xl bg-gradient-to-br from-emerald-950 to-gray-900 text-white shadow-md relative overflow-hidden'>
                <div className='flex items-start justify-between relative z-10'>
                  <div>
                    <span className='px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full uppercase border border-emerald-500/30'>
                      RideKAro Guarantee
                    </span>
                    <h4 className='text-base font-bold mt-1.5 text-white'>100% Verified Captains</h4>
                    <p className='text-xs text-gray-300 mt-0.5 max-w-[220px]'>
                      Real-time GPS tracking, 24/7 SOS dispatch, and insured rides.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onClose()
                      if (onOpenSOS) onOpenSOS()
                    }}
                    className='bg-red-500 hover:bg-red-600 text-white p-3 rounded-2xl font-bold text-xs flex flex-col items-center gap-1 shadow-lg active:scale-95 transition-all'
                  >
                    <i className="ri-alarm-warning-fill text-lg"></i>
                    SOS Shield
                  </button>
                </div>
              </div>

              {/* Quick Settings */}
              <div className='space-y-2'>
                <h4 className='text-xs uppercase tracking-wider font-bold text-gray-400 mb-2'>Preferences</h4>

                <div className='flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100'>
                  <div className='flex items-center gap-3'>
                    <i className="ri-wallet-3-line text-lg text-emerald-600"></i>
                    <div>
                      <p className='text-sm font-semibold text-gray-800'>Default Payment</p>
                      <p className='text-xs text-gray-400'>Cash / UPI on Arrival</p>
                    </div>
                  </div>
                  <span className='text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg'>Cash</span>
                </div>

                <div className='flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100'>
                  <div className='flex items-center gap-3'>
                    <i className="ri-customer-service-2-line text-lg text-blue-600"></i>
                    <div>
                      <p className='text-sm font-semibold text-gray-800'>24/7 Customer Support</p>
                      <p className='text-xs text-gray-400'>Instant trip resolution & help</p>
                    </div>
                  </div>
                  <i className="ri-arrow-right-s-line text-gray-400 text-lg"></i>
                </div>
              </div>
            </>
          )}

          {activeTab === 'history' && (
            <div className='space-y-3'>
              <h4 className='text-xs uppercase tracking-wider font-bold text-gray-400 mb-1'>Recent Completed Trips</h4>
              {mockHistory.map((trip) => (
                <div key={trip.id} className='p-3.5 bg-gray-50 border border-gray-200/80 rounded-2xl space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className='text-xs font-semibold text-gray-500'>{trip.date}</span>
                    <span className='text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full'>
                      {trip.status}
                    </span>
                  </div>
                  <div className='space-y-1 text-xs text-gray-700'>
                    <p className='flex items-center gap-2 truncate'>
                      <i className="ri-record-circle-fill text-green-500"></i> {trip.pickup}
                    </p>
                    <p className='flex items-center gap-2 truncate'>
                      <i className="ri-map-pin-2-fill text-red-500"></i> {trip.destination}
                    </p>
                  </div>
                  <div className='pt-2 border-t border-gray-200 flex items-center justify-between text-xs'>
                    <span className='text-gray-500 font-medium'>{trip.vehicle}</span>
                    <span className='font-bold text-sm text-gray-900'>{trip.fare}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'safety' && (
            <div className='space-y-4'>
              <div className='p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 space-y-2'>
                <div className='flex items-center gap-2 font-bold text-sm text-red-800'>
                  <i className="ri-alarm-warning-fill text-lg"></i> Emergency SOS Trigger
                </div>
                <p className='text-xs leading-relaxed'>
                  Pressing SOS will immediately send your live GPS coordinates to emergency contacts and RideKAro 24/7 Safety Command Center.
                </p>
                <button
                  onClick={() => {
                    onClose()
                    if (onOpenSOS) onOpenSOS()
                  }}
                  className='w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow'
                >
                  Open SOS Toolkit Now
                </button>
              </div>

              <div className='space-y-2'>
                <h4 className='text-xs uppercase tracking-wider font-bold text-gray-400'>Safety Features</h4>

                <div className='p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3'>
                  <i className="ri-lock-2-line text-emerald-600 text-xl"></i>
                  <div>
                    <p className='text-xs font-bold text-gray-800'>4-Digit Ride Start OTP</p>
                    <p className='text-[11px] text-gray-500'>Captains cannot start trip without your unique OTP code.</p>
                  </div>
                </div>

                <div className='p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3'>
                  <i className="ri-radar-line text-emerald-600 text-xl"></i>
                  <div>
                    <p className='text-xs font-bold text-gray-800'>Live GPS Route Monitoring</p>
                    <p className='text-[11px] text-gray-500'>Unusual route deviations trigger an automatic safety call check.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Logout */}
        <div className='p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between'>
          <button
            onClick={handleLogout}
            className='w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-sm rounded-2xl transition-colors flex items-center justify-center gap-2'
          >
            <i className="ri-logout-box-r-line text-lg"></i>
            Log Out Account
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserProfileModal
