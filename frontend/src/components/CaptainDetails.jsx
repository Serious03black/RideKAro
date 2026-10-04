import React, { useContext, useState } from 'react'
import { CaptainDataContext } from '../context/CapatainContext'
import CaptainEarningsModal from './CaptainEarningsModal'

const CaptainDetails = () => {
    const { captain } = useContext(CaptainDataContext)
    const [earningsModalOpen, setEarningsModalOpen] = useState(false)

    return (
        <div style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Captain info + earnings button */}
            <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-3'>
                    <div className='h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg border-2 border-emerald-300 shadow-md'>
                        {captain?.fullname?.firstname?.[0]?.toUpperCase() || 'C'}
                    </div>
                    <div>
                        <h4 className='text-base font-bold capitalize text-white flex items-center gap-1.5'>
                            {captain?.fullname?.firstname} {captain?.fullname?.lastname}
                            <i className="ri-shield-check-fill text-emerald-400 text-sm"></i>
                        </h4>
                        <p className='text-xs text-emerald-400 font-mono capitalize'>
                            {captain?.vehicle?.vehicleType || 'Car'} · {captain?.vehicle?.plate || 'MH12AB1234'}
                        </p>
                    </div>
                </div>

                <div
                    onClick={() => setEarningsModalOpen(true)}
                    className='text-right bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 p-2.5 px-3 rounded-2xl cursor-pointer transition-all group'
                >
                    <h4 className='text-lg font-black text-emerald-400 group-hover:scale-105 transition-transform'>₹1,450.00</h4>
                    <p className='text-[10px] text-gray-300 font-semibold uppercase tracking-wider flex items-center justify-end gap-1'>
                        Today's Earnings <i className="ri-arrow-right-s-line text-emerald-400"></i>
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className='grid grid-cols-3 p-3.5 bg-gray-800/80 rounded-2xl gap-2 items-center border border-gray-800 text-white shadow-inner'>
                <div
                    onClick={() => setEarningsModalOpen(true)}
                    className='text-center cursor-pointer hover:opacity-80 transition-opacity'
                >
                    <i className="text-xl mb-0.5 text-emerald-400 ri-timer-2-line block"></i>
                    <h5 className='text-base font-extrabold text-white'>6.5</h5>
                    <p className='text-[10px] text-gray-400 font-medium uppercase'>Hrs Online</p>
                </div>

                <div
                    onClick={() => setEarningsModalOpen(true)}
                    className='text-center border-x border-gray-700/80 cursor-pointer hover:opacity-80 transition-opacity'
                >
                    <i className="text-xl mb-0.5 text-blue-400 ri-speed-up-line block"></i>
                    <h5 className='text-base font-extrabold text-white'>8</h5>
                    <p className='text-[10px] text-gray-400 font-medium uppercase'>Rides Done</p>
                </div>

                <div
                    onClick={() => setEarningsModalOpen(true)}
                    className='text-center cursor-pointer hover:opacity-80 transition-opacity'
                >
                    <i className="text-xl mb-0.5 text-amber-400 ri-star-fill block"></i>
                    <h5 className='text-base font-extrabold text-white'>4.9 ★</h5>
                    <p className='text-[10px] text-gray-400 font-medium uppercase'>Rating</p>
                </div>
            </div>

            {/* View Full History & Earnings Action Bar */}
            <button
                onClick={() => setEarningsModalOpen(true)}
                className='mt-3 w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white font-bold text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2'
            >
                <i className="ri-file-list-3-fill text-base"></i>
                View Daily & Monthly Earnings / Ride History
            </button>

            {/* Earnings Modal */}
            <CaptainEarningsModal
                isOpen={earningsModalOpen}
                onClose={() => setEarningsModalOpen(false)}
            />
        </div>
    )
}

export default CaptainDetails