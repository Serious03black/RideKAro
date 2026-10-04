import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Start = () => {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100)
  }, [])

  return (
    <div className='rk-landing'>
      {/* Animated background */}
      <div className='rk-bg'>
        <div className='rk-bg-gradient' />
        <div className='rk-bg-city' />
        <div className='rk-bg-overlay' />
      </div>

      {/* Floating particles */}
      <div className='rk-particles'>
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`rk-particle rk-particle-${i + 1}`} />
        ))}
      </div>

      {/* Content */}
      <div className={`rk-content ${loaded ? 'rk-content--visible' : ''}`}>

        {/* Header */}
        <header className='rk-header'>
          <div className='rk-logo'>
            <div className='rk-logo-icon'>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" fill="currentColor" opacity="0.9"/>
                <path d="M12 2v20M3 7l9 5 9-5" stroke="white" strokeWidth="1.5" strokeOpacity="0.5"/>
              </svg>
            </div>
            <span className='rk-logo-text'>RideKAro</span>
          </div>
          <Link to='/captain-login' className='rk-nav-btn'>Drive with us</Link>
        </header>

        {/* Hero */}
        <main className='rk-hero'>
          <div className='rk-hero-badge'>
            <span className='rk-badge-dot' />
            Now available in your city
          </div>

          <h1 className='rk-hero-title'>
            Your Ride,<br />
            <span className='rk-hero-gradient'>Your Way</span>
          </h1>

          <p className='rk-hero-subtitle'>
            Fast, safe, and affordable rides at your fingertips.<br />
            Get to your destination in style.
          </p>

          {/* Stats */}
          <div className='rk-stats'>
            <div className='rk-stat'>
              <span className='rk-stat-number'>50K+</span>
              <span className='rk-stat-label'>Happy Riders</span>
            </div>
            <div className='rk-stat-divider' />
            <div className='rk-stat'>
              <span className='rk-stat-number'>2K+</span>
              <span className='rk-stat-label'>Captains</span>
            </div>
            <div className='rk-stat-divider' />
            <div className='rk-stat'>
              <span className='rk-stat-number'>4.9★</span>
              <span className='rk-stat-label'>Avg Rating</span>
            </div>
          </div>
        </main>

        {/* Bottom card */}
        <div className='rk-bottom-card'>
          {/* Features */}
          <div className='rk-features'>
            <div className='rk-feature'>
              <div className='rk-feature-icon'>⚡</div>
              <span>Instant Booking</span>
            </div>
            <div className='rk-feature'>
              <div className='rk-feature-icon'>🛡️</div>
              <span>Safe Rides</span>
            </div>
            <div className='rk-feature'>
              <div className='rk-feature-icon'>💳</div>
              <span>Easy Payments</span>
            </div>
          </div>

          <Link to='/login' className='rk-cta-btn'>
            <span>Get Started</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>

          <p className='rk-bottom-text'>
            Are you a driver?{' '}
            <Link to='/captain-login' className='rk-link'>Join as Captain →</Link>
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        .rk-landing {
          position: relative;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }

        /* Background layers */
        .rk-bg { position: absolute; inset: 0; z-index: 0; }

        .rk-bg-gradient {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, #0a0a0f 0%, #0d1117 40%, #0a1628 70%, #050a14 100%);
        }

        .rk-bg-city {
          position: absolute; inset: 0;
          background-image: url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1544&auto=format&fit=crop');
          background-size: cover;
          background-position: center bottom;
          opacity: 0.18;
          filter: saturate(0.5);
        }

        .rk-bg-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(10,10,15,0.4) 0%,
            rgba(10,10,15,0.1) 40%,
            rgba(10,10,15,0.8) 75%,
            rgba(10,10,15,0.97) 100%
          );
        }

        /* Particles */
        .rk-particles { position: absolute; inset: 0; z-index: 1; overflow: hidden; }
        .rk-particle {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99,179,237,0.6), transparent);
          animation: float 8s ease-in-out infinite;
        }
        .rk-particle-1 { width: 300px; height: 300px; top: -100px; right: -80px; animation-delay: 0s; opacity: 0.15; }
        .rk-particle-2 { width: 200px; height: 200px; top: 30%; left: -60px; animation-delay: 2s; opacity: 0.1; background: radial-gradient(circle, rgba(167,139,250,0.6), transparent); }
        .rk-particle-3 { width: 150px; height: 150px; bottom: 30%; right: 10%; animation-delay: 4s; opacity: 0.12; }
        .rk-particle-4 { width: 80px; height: 80px; top: 20%; left: 30%; animation-delay: 1s; opacity: 0.2; background: radial-gradient(circle, rgba(251,191,36,0.5), transparent); }
        .rk-particle-5 { width: 60px; height: 60px; bottom: 40%; left: 20%; animation-delay: 3s; opacity: 0.15; background: radial-gradient(circle, rgba(167,139,250,0.5), transparent); }
        .rk-particle-6 { width: 120px; height: 120px; top: 50%; right: 30%; animation-delay: 5s; opacity: 0.1; }

        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }

        /* Content */
        .rk-content {
          position: relative; z-index: 2;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 0;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .rk-content--visible { opacity: 1; transform: translateY(0); }

        /* Header */
        .rk-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 28px;
        }

        .rk-logo { display: flex; align-items: center; gap: 10px; }

        .rk-logo-icon {
          width: 40px; height: 40px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          color: white;
          box-shadow: 0 4px 15px rgba(59,130,246,0.4);
        }

        .rk-logo-text {
          font-size: 22px;
          font-weight: 800;
          color: white;
          letter-spacing: -0.5px;
        }

        .rk-nav-btn {
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,0.8);
          padding: 8px 18px;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 50px;
          text-decoration: none;
          backdrop-filter: blur(10px);
          background: rgba(255,255,255,0.05);
          transition: all 0.3s ease;
        }
        .rk-nav-btn:hover {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.3);
          color: white;
        }

        /* Hero */
        .rk-hero { padding: 0 28px; flex: 1; display: flex; flex-direction: column; justify-content: center; }

        .rk-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(59,130,246,0.15);
          border: 1px solid rgba(59,130,246,0.3);
          color: #93c5fd;
          font-size: 12px;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 50px;
          margin-bottom: 20px;
          width: fit-content;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          animation: pulse-badge 3s ease-in-out infinite;
        }

        @keyframes pulse-badge {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.3); }
          50% { box-shadow: 0 0 0 8px rgba(59,130,246,0); }
        }

        .rk-badge-dot {
          width: 7px; height: 7px;
          background: #60a5fa;
          border-radius: 50%;
          animation: blink 1.5s ease-in-out infinite;
        }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

        .rk-hero-title {
          font-size: 56px;
          font-weight: 900;
          color: white;
          line-height: 1.05;
          margin: 0 0 16px;
          letter-spacing: -2px;
        }

        .rk-hero-gradient {
          background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .rk-hero-subtitle {
          font-size: 15px;
          color: rgba(255,255,255,0.5);
          line-height: 1.7;
          margin: 0 0 28px;
          font-weight: 400;
        }

        /* Stats */
        .rk-stats {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .rk-stat { display: flex; flex-direction: column; gap: 2px; }

        .rk-stat-number {
          font-size: 20px;
          font-weight: 800;
          color: white;
          letter-spacing: -0.5px;
        }

        .rk-stat-label {
          font-size: 11px;
          color: rgba(255,255,255,0.4);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .rk-stat-divider {
          width: 1px; height: 30px;
          background: rgba(255,255,255,0.12);
        }

        /* Bottom card */
        .rk-bottom-card {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(30px);
          border: 1px solid rgba(255,255,255,0.08);
          border-bottom: none;
          border-radius: 28px 28px 0 0;
          padding: 28px 28px 36px;
        }

        .rk-features {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
        }

        .rk-feature {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 12px 8px;
          transition: all 0.3s ease;
        }
        .rk-feature:hover {
          background: rgba(255,255,255,0.08);
          transform: translateY(-2px);
        }

        .rk-feature-icon { font-size: 22px; }

        .rk-feature span {
          font-size: 11px;
          color: rgba(255,255,255,0.55);
          font-weight: 500;
          text-align: center;
          line-height: 1.3;
        }

        /* CTA Button */
        .rk-cta-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
          font-size: 16px;
          font-weight: 700;
          border-radius: 16px;
          text-decoration: none;
          letter-spacing: -0.2px;
          box-shadow: 0 8px 30px rgba(59,130,246,0.4);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          margin-bottom: 16px;
        }
        .rk-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(59,130,246,0.55);
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
        }
        .rk-cta-btn:active { transform: translateY(0); }

        .rk-bottom-text {
          text-align: center;
          color: rgba(255,255,255,0.35);
          font-size: 13px;
          font-weight: 400;
          margin: 0;
        }

        .rk-link {
          color: #60a5fa;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }
        .rk-link:hover { color: #93c5fd; }
      `}</style>
    </div>
  )
}

export default Start