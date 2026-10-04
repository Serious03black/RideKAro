import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import axios from 'axios'

const UserLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { user, setUser } = useContext(UserDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const userData = { email, password }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData)
      if (response.status === 200) {
        const data = response.data
        setUser(data.user)
        localStorage.setItem('token', data.token)
        navigate('/home')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }

    setEmail('')
    setPassword('')
  }

  return (
    <div className='rk-auth-page'>
      <div className='rk-auth-bg' />
      <div className='rk-auth-overlay' />

      <div className='rk-auth-container'>
        {/* Back + Logo */}
        <div className='rk-auth-top'>
          <Link to='/' className='rk-back-btn'>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </Link>
          <div className='rk-auth-logo'>
            <div className='rk-auth-logo-icon'>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" fill="currentColor"/>
              </svg>
            </div>
            <span>RideKAro</span>
          </div>
        </div>

        {/* Card */}
        <div className='rk-auth-card'>
          <div className='rk-auth-card-header'>
            <h1 className='rk-auth-title'>Welcome back</h1>
            <p className='rk-auth-subtitle'>Sign in to continue your journey</p>
          </div>

          {error && (
            <div className='rk-error-banner'>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={submitHandler} className='rk-auth-form'>
            <div className='rk-form-group'>
              <label className='rk-label'>Email address</label>
              <div className='rk-input-wrap'>
                <svg className='rk-input-icon' width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='rk-input'
                  placeholder='you@example.com'
                />
              </div>
            </div>

            <div className='rk-form-group'>
              <label className='rk-label'>Password</label>
              <div className='rk-input-wrap'>
                <svg className='rk-input-icon' width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='rk-input'
                  placeholder='••••••••'
                />
              </div>
            </div>

            <button type='submit' className={`rk-submit-btn ${loading ? 'rk-submit-btn--loading' : ''}`} disabled={loading}>
              {loading ? <span className='rk-spinner'/> : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className='rk-auth-footer-text'>
            New to RideKAro? <Link to='/signup' className='rk-auth-link'>Create account</Link>
          </p>
        </div>

        {/* Captain switch */}
        <Link to='/captain-login' className='rk-switch-btn'>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg>
          Sign in as Captain instead
        </Link>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        .rk-auth-page {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
          background: #080b14;
          overflow: hidden;
        }

        .rk-auth-bg {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse at 20% 20%, rgba(59,130,246,0.12) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 80%, rgba(139,92,246,0.12) 0%, transparent 60%);
        }

        .rk-auth-overlay {
          position: absolute; inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        .rk-auth-container {
          position: relative; z-index: 2;
          width: 100%;
          max-width: 420px;
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-height: 100vh;
          justify-content: center;
        }

        .rk-auth-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .rk-back-btn {
          width: 38px; height: 38px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          transition: all 0.2s;
        }
        .rk-back-btn:hover { background: rgba(255,255,255,0.1); color: white; }

        .rk-auth-logo {
          display: flex; align-items: center; gap: 8px;
          color: white; font-size: 17px; font-weight: 700;
        }

        .rk-auth-logo-icon {
          width: 32px; height: 32px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: white;
        }

        .rk-auth-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 32px 28px;
          backdrop-filter: blur(20px);
        }

        .rk-auth-card-header { margin-bottom: 28px; }

        .rk-auth-title {
          font-size: 28px;
          font-weight: 800;
          color: white;
          margin: 0 0 6px;
          letter-spacing: -0.8px;
        }

        .rk-auth-subtitle {
          font-size: 14px;
          color: rgba(255,255,255,0.4);
          margin: 0;
        }

        .rk-error-banner {
          display: flex; align-items: center; gap: 8px;
          background: rgba(239,68,68,0.12);
          border: 1px solid rgba(239,68,68,0.25);
          color: #fca5a5;
          font-size: 13px;
          font-weight: 500;
          padding: 10px 14px;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .rk-auth-form { display: flex; flex-direction: column; gap: 18px; }

        .rk-form-group { display: flex; flex-direction: column; gap: 8px; }

        .rk-label {
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }

        .rk-input-wrap {
          position: relative;
          display: flex; align-items: center;
        }

        .rk-input-icon {
          position: absolute;
          left: 14px;
          color: rgba(255,255,255,0.3);
          pointer-events: none;
        }

        .rk-input {
          width: 100%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 13px 14px 13px 44px;
          color: white;
          font-size: 15px;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: all 0.2s;
          box-sizing: border-box;
        }
        .rk-input::placeholder { color: rgba(255,255,255,0.2); }
        .rk-input:focus {
          background: rgba(255,255,255,0.08);
          border-color: rgba(99,179,237,0.5);
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }

        .rk-submit-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 15px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          font-size: 15px;
          font-weight: 700;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          letter-spacing: -0.2px;
          box-shadow: 0 6px 24px rgba(59,130,246,0.4);
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
          margin-top: 6px;
          font-family: 'Inter', sans-serif;
        }
        .rk-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(59,130,246,0.5);
        }
        .rk-submit-btn:active:not(:disabled) { transform: translateY(0); }
        .rk-submit-btn--loading { opacity: 0.75; cursor: not-allowed; }

        .rk-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .rk-auth-footer-text {
          text-align: center;
          color: rgba(255,255,255,0.35);
          font-size: 13px;
          margin: 20px 0 0;
        }

        .rk-auth-link {
          color: #60a5fa;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }
        .rk-auth-link:hover { color: #93c5fd; }

        .rk-switch-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          color: rgba(255,255,255,0.55);
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .rk-switch-btn:hover {
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.85);
          border-color: rgba(255,255,255,0.15);
        }
      `}</style>
    </div>
  )
}

export default UserLogin