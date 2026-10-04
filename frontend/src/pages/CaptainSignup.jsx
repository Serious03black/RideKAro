import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CapatainContext'
import axios from 'axios'

const CaptainSignup = () => {
  const navigate = useNavigate()
  const { captain, setCaptain } = React.useContext(CaptainDataContext)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [vehicleColor, setVehicleColor] = useState('')
  const [vehiclePlate, setVehiclePlate] = useState('')
  const [vehicleCapacity, setVehicleCapacity] = useState('')
  const [vehicleType, setVehicleType] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submitHandler = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const captainData = {
      fullname: { firstname: firstName, lastname: lastName },
      email,
      password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType: vehicleType   // must match: 'car' | 'motorcycle' | 'auto'
      }
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainData)
      if (response.status === 201) {
        const data = response.data
        setCaptain(data.captain)
        localStorage.setItem('token', data.token)
        navigate('/captain-home')
      }
    } catch (err) {
      const backendErrors = err.response?.data?.errors
      if (backendErrors?.length > 0) {
        setError(backendErrors.map(e => e.msg).join(' · '))
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }

    setEmail(''); setFirstName(''); setLastName(''); setPassword('')
    setVehicleColor(''); setVehiclePlate(''); setVehicleCapacity(''); setVehicleType('')
  }

  return (
    <div className='rk-auth-page rk-auth-page--captain'>
      <div className='rk-auth-bg' />
      <div className='rk-auth-overlay' />

      <div className='rk-auth-container rk-auth-container--wide'>
        {/* Header */}
        <div className='rk-auth-top'>
          <Link to='/' className='rk-back-btn'>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </Link>
          <div className='rk-auth-logo'>
            <div className='rk-auth-logo-icon rk-auth-logo-icon--captain'>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7v10l9 5 9-5V7L12 2z" fill="currentColor"/></svg>
            </div>
            <span>RideKAro</span>
          </div>
        </div>

        {/* Card */}
        <div className='rk-auth-card'>
          <div className='rk-captain-badge'>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg>
            Captain Registration
          </div>

          <div className='rk-auth-card-header'>
            <h1 className='rk-auth-title'>Join as Captain</h1>
            <p className='rk-auth-subtitle'>Start earning by giving rides today</p>
          </div>

          {error && (
            <div className='rk-error-banner'>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={submitHandler} className='rk-auth-form'>

            {/* Section: Personal Info */}
            <div className='rk-section-label'>Personal Information</div>

            <div className='rk-form-row'>
              <div className='rk-form-group'>
                <label className='rk-label'>First name</label>
                <div className='rk-input-wrap'>
                  <svg className='rk-input-icon' width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg>
                  <input required type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className='rk-input' placeholder='John' minLength={3}/>
                </div>
              </div>
              <div className='rk-form-group'>
                <label className='rk-label'>Last name</label>
                <div className='rk-input-wrap'>
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className='rk-input rk-input--no-icon' placeholder='Doe'/>
                </div>
              </div>
            </div>

            <div className='rk-form-group'>
              <label className='rk-label'>Email address</label>
              <div className='rk-input-wrap'>
                <svg className='rk-input-icon' width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className='rk-input' placeholder='captain@example.com'/>
              </div>
            </div>

            <div className='rk-form-group'>
              <label className='rk-label'>Password <span className='rk-hint'>(min 6 characters)</span></label>
              <div className='rk-input-wrap'>
                <svg className='rk-input-icon' width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className='rk-input' placeholder='••••••••' minLength={6}/>
              </div>
            </div>

            {/* Section: Vehicle Info */}
            <div className='rk-section-label rk-section-label--spaced'>Vehicle Information</div>

            <div className='rk-form-row'>
              <div className='rk-form-group'>
                <label className='rk-label'>Color</label>
                <div className='rk-input-wrap'>
                  <svg className='rk-input-icon' width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="10.5" r="2.5"/><circle cx="8.5" cy="7.5" r="2.5"/><circle cx="6.5" cy="12.5" r="2.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
                  <input required type="text" value={vehicleColor} onChange={(e) => setVehicleColor(e.target.value)} className='rk-input' placeholder='e.g. Black' minLength={3}/>
                </div>
              </div>
              <div className='rk-form-group'>
                <label className='rk-label'>Plate No.</label>
                <div className='rk-input-wrap'>
                  <input required type="text" value={vehiclePlate} onChange={(e) => setVehiclePlate(e.target.value)} className='rk-input rk-input--no-icon' placeholder='e.g. MH12AB1234' minLength={3}/>
                </div>
              </div>
            </div>

            <div className='rk-form-row'>
              <div className='rk-form-group'>
                <label className='rk-label'>Capacity</label>
                <div className='rk-input-wrap'>
                  <svg className='rk-input-icon' width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  <input required type="number" min={1} value={vehicleCapacity} onChange={(e) => setVehicleCapacity(e.target.value)} className='rk-input' placeholder='e.g. 4'/>
                </div>
              </div>
              <div className='rk-form-group'>
                <label className='rk-label'>Vehicle Type</label>
                <div className='rk-input-wrap'>
                  <svg className='rk-input-icon' width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                  {/* Values MUST match backend: 'car' | 'motorcycle' | 'auto' */}
                  <select required value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} className='rk-input rk-select'>
                    <option value="" disabled>Select type</option>
                    <option value="car">Car</option>
                    <option value="motorcycle">Motorcycle</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
              </div>
            </div>

            <button type='submit' className={`rk-submit-btn rk-submit-btn--captain ${loading ? 'rk-submit-btn--loading' : ''}`} disabled={loading}>
              {loading ? <span className='rk-spinner'/> : null}
              {loading ? 'Creating account...' : 'Create Captain Account'}
            </button>
          </form>

          <p className='rk-auth-footer-text'>
            Already registered? <Link to='/captain-login' className='rk-auth-link rk-auth-link--captain'>Sign in</Link>
          </p>
        </div>

        <Link to='/login' className='rk-switch-btn'>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Sign up as a Rider instead
        </Link>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        .rk-auth-page { position:relative;min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:'Inter',sans-serif;background:#080b14;overflow:hidden; }
        .rk-auth-page--captain .rk-auth-bg { background:radial-gradient(ellipse at 20% 20%,rgba(16,185,129,0.1) 0%,transparent 60%),radial-gradient(ellipse at 80% 80%,rgba(5,150,105,0.1) 0%,transparent 60%); }
        .rk-auth-bg { position:absolute;inset:0; }
        .rk-auth-overlay { position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,0.025) 1px,transparent 1px);background-size:28px 28px; }
        .rk-auth-container { position:relative;z-index:2;width:100%;max-width:480px;padding:24px 20px;display:flex;flex-direction:column;gap:16px;min-height:100vh;justify-content:center; }
        .rk-auth-top { display:flex;align-items:center;justify-content:space-between;margin-bottom:8px; }
        .rk-back-btn { width:38px;height:38px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:rgba(255,255,255,0.7);text-decoration:none;transition:all 0.2s; }
        .rk-back-btn:hover { background:rgba(255,255,255,0.1);color:white; }
        .rk-auth-logo { display:flex;align-items:center;gap:8px;color:white;font-size:17px;font-weight:700; }
        .rk-auth-logo-icon { width:32px;height:32px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);border-radius:8px;display:flex;align-items:center;justify-content:center;color:white; }
        .rk-auth-logo-icon--captain { background:linear-gradient(135deg,#10b981,#059669); }
        .rk-auth-card { background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:24px;padding:32px 28px;backdrop-filter:blur(20px); }
        .rk-captain-badge { display:inline-flex;align-items:center;gap:6px;background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.25);color:#6ee7b7;font-size:11px;font-weight:700;padding:5px 12px;border-radius:50px;margin-bottom:16px;text-transform:uppercase;letter-spacing:0.5px; }
        .rk-auth-card-header { margin-bottom:24px; }
        .rk-auth-title { font-size:26px;font-weight:800;color:white;margin:0 0 6px;letter-spacing:-0.8px; }
        .rk-auth-subtitle { font-size:14px;color:rgba(255,255,255,0.4);margin:0; }
        .rk-error-banner { display:flex;align-items:flex-start;gap:8px;background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.25);color:#fca5a5;font-size:13px;font-weight:500;padding:10px 14px;border-radius:12px;margin-bottom:20px;line-height:1.5; }
        .rk-auth-form { display:flex;flex-direction:column;gap:14px; }
        .rk-section-label { font-size:11px;font-weight:700;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:1px;padding-bottom:4px;border-bottom:1px solid rgba(255,255,255,0.06); }
        .rk-section-label--spaced { margin-top:6px; }
        .rk-form-row { display:flex;gap:12px; }
        .rk-form-row .rk-form-group { flex:1; }
        .rk-form-group { display:flex;flex-direction:column;gap:7px; }
        .rk-label { font-size:11px;font-weight:600;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:0.6px; }
        .rk-hint { font-weight:400;text-transform:none;letter-spacing:0;color:rgba(255,255,255,0.25); }
        .rk-input-wrap { position:relative;display:flex;align-items:center; }
        .rk-input-icon { position:absolute;left:12px;color:rgba(255,255,255,0.3);pointer-events:none;flex-shrink:0; }
        .rk-input { width:100%;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:11px;padding:11px 12px 11px 40px;color:white;font-size:14px;font-family:'Inter',sans-serif;outline:none;transition:all 0.2s;box-sizing:border-box; }
        .rk-input--no-icon { padding-left:12px; }
        .rk-input::placeholder { color:rgba(255,255,255,0.2); }
        .rk-input:focus { background:rgba(255,255,255,0.08);border-color:rgba(16,185,129,0.5);box-shadow:0 0 0 3px rgba(16,185,129,0.1); }
        .rk-select { appearance:none;cursor:pointer; }
        .rk-select option { background:#0d1117;color:white; }
        .rk-submit-btn { display:flex;align-items:center;justify-content:center;gap:8px;padding:14px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:white;font-size:15px;font-weight:700;border:none;border-radius:13px;cursor:pointer;box-shadow:0 6px 24px rgba(59,130,246,0.4);transition:all 0.3s cubic-bezier(0.16,1,0.3,1);margin-top:8px;font-family:'Inter',sans-serif; }
        .rk-submit-btn--captain { background:linear-gradient(135deg,#10b981,#059669);box-shadow:0 6px 24px rgba(16,185,129,0.4); }
        .rk-submit-btn--captain:hover:not(:disabled) { transform:translateY(-2px);box-shadow:0 10px 32px rgba(16,185,129,0.5); }
        .rk-submit-btn--loading { opacity:0.75;cursor:not-allowed; }
        .rk-spinner { width:16px;height:16px;border:2px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.6s linear infinite; }
        @keyframes spin { to { transform:rotate(360deg); } }
        .rk-auth-footer-text { text-align:center;color:rgba(255,255,255,0.35);font-size:13px;margin:18px 0 0; }
        .rk-auth-link { color:#60a5fa;text-decoration:none;font-weight:600; }
        .rk-auth-link--captain { color:#6ee7b7; }
        .rk-switch-btn { display:flex;align-items:center;justify-content:center;gap:8px;padding:14px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;color:rgba(255,255,255,0.55);font-size:14px;font-weight:600;text-decoration:none;transition:all 0.2s;font-family:'Inter',sans-serif; }
        .rk-switch-btn:hover { background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.85);border-color:rgba(255,255,255,0.15); }
      `}</style>
    </div>
  )
}

export default CaptainSignup