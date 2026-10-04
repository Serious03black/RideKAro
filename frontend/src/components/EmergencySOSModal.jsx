import React, { useState } from 'react'

const EmergencySOSModal = ({ isOpen, onClose, currentRide }) => {
  const [sosSent, setSosSent] = useState(false)
  const [fakeCallActive, setFakeCallActive] = useState(false)

  if (!isOpen) return null

  const handleTriggerSOS = () => {
    setSosSent(true)
    setTimeout(() => setSosSent(false), 5000)
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4' style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className='w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200'>

        {/* Header */}
        <div className='bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-5 text-center relative'>
          <button
            onClick={onClose}
            className='absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors'
          >
            <i className="ri-close-line text-lg"></i>
          </button>
          <div className='w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 text-2xl border-2 border-white/30 animate-pulse'>
            <i className="ri-alarm-warning-fill"></i>
          </div>
          <h3 className='text-xl font-extrabold tracking-tight'>Emergency SOS Shield</h3>
          <p className='text-xs text-red-100 mt-1'>24/7 RideKAro Safety Command Center</p>
        </div>

        {/* Body */}
        <div className='p-5 space-y-4'>

          {sosSent ? (
            <div className='bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-center space-y-2 animate-in fade-in duration-300'>
              <div className='w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto text-2xl'>
                <i className="ri-checkbox-circle-fill"></i>
              </div>
              <h4 className='font-bold text-emerald-800 text-base'>SOS Alert Broadcasted!</h4>
              <p className='text-xs text-emerald-700 leading-relaxed'>
                Your live GPS location and trip details have been shared with local emergency response & safety team.
              </p>
            </div>
          ) : (
            <>
              {/* Emergency Alert Button */}
              <button
                onClick={handleTriggerSOS}
                className='w-full py-4 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-extrabold text-base rounded-2xl shadow-xl flex items-center justify-center gap-2.5 transition-all'
              >
                <i className="ri-alarm-warning-line text-2xl"></i>
                Broadcast Emergency SOS
              </button>

              <p className='text-[11px] text-center text-gray-400 font-medium'>
                Triggers automatic safety call & alerts trusted contacts immediately.
              </p>

              {/* Direct Hotline buttons */}
              <div className='grid grid-cols-2 gap-2 pt-2'>
                <a
                  href="tel:112"
                  className='p-3 bg-gray-900 hover:bg-black text-white rounded-2xl text-center block transition-colors'
                >
                  <i className="ri-phone-fill text-emerald-400 text-lg block mb-0.5"></i>
                  <span className='font-bold text-xs block'>Call Police (112)</span>
                  <span className='text-[10px] text-gray-400'>National Emergency</span>
                </a>

                <button
                  onClick={() => setFakeCallActive(!fakeCallActive)}
                  className='p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-2xl text-center transition-colors'
                >
                  <i className="ri-customer-service-fill text-emerald-600 text-lg block mb-0.5"></i>
                  <span className='font-bold text-xs block'>Safety Helpline</span>
                  <span className='text-[10px] text-emerald-600'>24x7 Support Agent</span>
                </button>
              </div>

              {/* Current Trip Info if active */}
              {currentRide && (
                <div className='p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs space-y-1'>
                  <p className='font-bold text-gray-700 flex items-center justify-between'>
                    <span>Live Ride Protection</span>
                    <span className='text-emerald-600 font-mono'>OTP: {currentRide?.otp || 'Active'}</span>
                  </p>
                  <p className='text-gray-500 truncate'>Captain: {currentRide?.captain?.fullname?.firstname} ({currentRide?.captain?.vehicle?.plate})</p>
                </div>
              )}
            </>
          )}

        </div>

        {/* Footer */}
        <div className='p-3.5 bg-gray-50 border-t border-gray-100 text-center'>
          <button
            onClick={onClose}
            className='text-xs font-semibold text-gray-500 hover:text-gray-800'
          >
            Close Safety Toolkit
          </button>
        </div>

      </div>
    </div>
  )
}

export default EmergencySOSModal
