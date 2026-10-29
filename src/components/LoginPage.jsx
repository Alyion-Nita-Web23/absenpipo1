import React, { useState } from 'react';
import { 
  Timer, 
  ShieldCheck, 
  AtSign, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Radio,
  CheckCircle2
} from 'lucide-react';

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('admin@loginrek.id');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Mohon masukkan email dan password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    // Simulate authentic authentication delay with smooth feedback
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 600);
  };

  return (
    <div className="login-page-container">
      {/* Left Promotional / Brand Showcase Panel */}
      <div className="login-hero-panel">
        <div className="hero-glow-sphere sphere-top"></div>
        <div className="hero-glow-sphere sphere-bottom"></div>

        <div className="login-hero-content">
          {/* Top Logo */}
          <div className="login-hero-header">
            <div className="brand-logo-icon-lg">
              <Timer className="icon-timer" size={28} />
            </div>
            <div className="brand-header-text">
              <span className="brand-header-title">Login Rek</span>
              <span className="brand-header-sub">HR PORTAL SYSTEM</span>
            </div>
          </div>

          {/* Main Hero Copy */}
          <div className="login-hero-body">
            <div className="hero-badge-pill">
              <ShieldCheck size={12} className="badge-shield-icon" />
              <span>SISTEM KEHADIRAN TERPUSAT</span>
            </div>

            <h2 className="hero-headline">
              Pantau kehadiran tim dalam satu layar.
            </h2>

            <p className="hero-description">
              Portal Administrasi HR &amp; Verifikasi Presensi Biometrik Real-time dengan validasi radius geofencing terintegrasi.
            </p>

            {/* Glassmorphism Status Card */}
            <div className="geofence-glass-card">
              <div className="glass-card-header">
                <div className="geofence-title">
                  <ShieldCheck size={18} className="icon-shield" />
                  <span>Status Geofence Kantor</span>
                </div>
                <div className="geofence-status-pill">
                  <CheckCircle2 size={13} className="status-badge-icon" />
                  <span>Tervalidasi Aktif</span>
                </div>
              </div>

              <div className="glass-card-metrics">
                <div className="metric-box">
                  <div className="metric-value">98.4%</div>
                  <div className="metric-label">Tepat Waktu</div>
                </div>

                <div className="metric-divider"></div>

                <div className="metric-box">
                  <div className="metric-value">1.420</div>
                  <div className="metric-label">Karyawan Masuk</div>
                </div>

                <div className="metric-divider"></div>

                <div className="metric-box">
                  <div className="metric-value">12 ms</div>
                  <div className="metric-label">Sinkronisasi</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer Info */}
          <div className="login-hero-footer">
            <span>Login Rek — Sistem Presensi Cerdas &amp; Terverifikasi</span>
            <span className="version-tag">v3.4.1 Enterprise</span>
          </div>
        </div>
      </div>

      {/* Right Form Card Panel */}
      <div className="login-form-panel">
        <div className="login-card">
          <div className="login-card-header">
            <h2 className="login-card-title">Masuk ke Dashboard</h2>
            <p className="login-card-subtitle">
              Silakan masukkan kredensial akun HR kamu untuk melanjutkan.
            </p>
          </div>

          {errorMsg && (
            <div className="login-alert-error">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="input-email" className="form-label">Email</label>
              <div className="input-with-icon">
                <AtSign className="input-left-icon" size={18} />
                <input
                  id="input-email"
                  type="email"
                  className="form-control"
                  placeholder="admin@loginrek.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="input-password" className="form-label">Password</label>
              <div className="input-with-icon">
                <Lock className="input-left-icon" size={18} />
                <input
                  id="input-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="btn-login-submit"
              className="btn-submit-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-spinner-row">
                  <span className="spinner"></span>
                  <span>Memproses...</span>
                </span>
              ) : (
                <>
                  <span>Masuk</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="login-card-footer">
            <p>
              Butuh bantuan akses HR?{' '}
              <a 
                href="#support" 
                onClick={(e) => {
                  e.preventDefault();
                  alert('Silakan hubungi IT Helpdesk di it-support@loginrek.id atau ext. 404.');
                }}
                className="link-support"
              >
                Hubungi Tim IT Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
