import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Check, 
  Building2, 
  Plus, 
  Minus, 
  Crosshair,
  Camera, 
  MapPin, 
  Clock, 
  X, 
  Navigation,
  MapPinOff,
  ShieldCheck,
  Compass
} from 'lucide-react';

// Helper to parse time string like "08.08" or "08:08" to minutes from midnight
function parseTimeToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string' || timeStr === '—') return null;
  const match = timeStr.match(/(\d{1,2})[.:](\d{2})/);
  if (!match) return null;
  const h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  if (isNaN(h) || isNaN(m)) return null;
  return h * 60 + m;
}

export default function AttendanceDetailPage({ record, onBack }) {
  const [zoom, setZoom] = useState(1);

  if (!record) return null;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.15, 1.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.15, 0.8));
  const handleResetZoom = () => setZoom(1);

  // Check if check-in data exists (not empty, not dash)
  const hasCheckIn = Boolean(
    record.checkInTime && 
    record.checkInTime !== '—' && 
    String(record.checkInTime).trim() !== ''
  );

  // Default work schedule (e.g. 08.00 WIB)
  const defaultScheduleStr = '08.00 WIB';
  const scheduleDisplay = record.schedule
    ? (record.schedule.startsWith('Jadwal') ? record.schedule : `Jadwal : ${record.schedule}`)
    : `Jadwal : ${defaultScheduleStr}`;

  // Automatically calculate late minutes and status if check-in time is available
  const { status, lateMinutes, isLate, isOnTime } = useMemo(() => {
    if (!hasCheckIn) {
      return {
        status: record.status || 'Belum Hadir',
        lateMinutes: 0,
        isLate: false,
        isOnTime: false
      };
    }

    const checkInMin = parseTimeToMinutes(record.checkInTime);
    const scheduleMin = parseTimeToMinutes(record.schedule || defaultScheduleStr);

    let calculatedStatus = record.status;
    let calculatedLate = Number(record.lateMinutes) || 0;

    if (checkInMin !== null && scheduleMin !== null) {
      const diff = checkInMin - scheduleMin;
      if (diff > 0) {
        calculatedStatus = 'Terlambat';
        calculatedLate = calculatedLate > 0 ? calculatedLate : diff;
      } else {
        calculatedStatus = 'Tepat Waktu';
        calculatedLate = 0;
      }
    }

    return {
      status: calculatedStatus,
      lateMinutes: calculatedLate,
      isLate: calculatedStatus === 'Terlambat',
      isOnTime: calculatedStatus === 'Tepat Waktu'
    };
  }, [hasCheckIn, record.checkInTime, record.schedule, record.status, record.lateMinutes]);

  // Format department display
  const displayDepartment = record.department
    ? (record.department.toLowerCase().startsWith('divisi') ? record.department : `Divisi ${record.department}`)
    : '—';

  // Format NIK & Role
  const displayNik = record.nik || '—';
  const displayRole = record.role || '—';

  // Avatar fallback
  const avatarImg = record.avatar || '/avatars/admin.jpg';

  // Distance string
  const hasDistance = Boolean(record.distance && record.distance !== '—' && String(record.distance).trim() !== '');
  const distanceText = hasDistance ? record.distance : '12m';

  return (
    <div className="attendance-detail-view">
      {/* Back Button */}
      <button 
        type="button" 
        className="btn-back-link" 
        onClick={onBack}
        id="btn-back-to-attendance"
      >
        <ArrowLeft size={16} />
        <span>Kembali ke Riwayat Absensi</span>
      </button>

      {/* Page Title & Subtitle */}
      <div className="detail-header-block">
        <h1 className="page-title detail-page-title">Detail Presensi Karyawan</h1>
        <p className="page-subtitle detail-page-subtitle">
          Rincian catatan jam kehadiran, verifikasi swafoto, dan validasi lokasi GPS harian.
        </p>
      </div>

      {/* Summary Card: Employee Profile + Check-in Time */}
      <div className="attendance-summary-card">
        <div className="summary-left-profile">
          <div className="summary-avatar-wrapper">
            <img 
              src={avatarImg} 
              alt={record.name} 
              className="summary-avatar-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/avatars/admin.jpg';
              }}
            />
            {hasCheckIn && (
              <div className="summary-avatar-badge" title="Terverifikasi">
                <Check size={11} strokeWidth={3} />
              </div>
            )}
          </div>

          <div className="summary-info-col">
            <div className="summary-name-row">
              <h2 className="summary-employee-name">{record.name}</h2>
              {isLate ? (
                <span className="summary-status-pill pill-late">
                  <Clock size={12} strokeWidth={2.5} className="status-pill-icon" />
                  <span>Terlambat {lateMinutes ? `${lateMinutes} mnt` : ''}</span>
                </span>
              ) : isOnTime ? (
                <span className="summary-status-pill pill-ontime">
                  <Check size={12} strokeWidth={2.5} className="status-pill-icon" />
                  <span>Tepat Waktu</span>
                </span>
              ) : (
                <span className="summary-status-pill pill-neutral">
                  <X size={12} strokeWidth={2.5} className="status-pill-icon" />
                  <span>{status}</span>
                </span>
              )}
            </div>

            <p className="summary-meta-line">
              <span>NIK: <strong>{displayNik}</strong></span>
              <span className="meta-divider">/</span>
              <span>{displayDepartment}</span>
              <span className="meta-divider">/</span>
              <span>{displayRole}</span>
            </p>
          </div>
        </div>

        {/* Jam Masuk Box */}
        <div className={`summary-checkin-box ${!hasCheckIn ? 'is-empty' : ''}`}>
          <span className="checkin-box-caption">JAM MASUK</span>
          <div className="checkin-box-time">
            {hasCheckIn ? (
              <>
                <span className="time-main">{record.checkInTime}</span>
                <span className="time-tz">{record.timezone || 'WIB'}</span>
              </>
            ) : (
              <span className="time-main time-empty">—</span>
            )}
          </div>
          <span className="checkin-box-schedule">{scheduleDisplay}</span>
        </div>
      </div>

      {/* 2 Columns Lower Grid */}
      <div className="attendance-detail-grid">
        {/* Left: Swafoto Card */}
        <div className="detail-panel-card">
          <div className="detail-panel-header">
            <Camera size={18} className="panel-header-icon text-teal" />
            <h3 className="detail-panel-title">Swafoto Masuk (Selfie Check-in)</h3>
          </div>

          <div className="selfie-frame-wrapper">
            {hasCheckIn && record.selfieUrl ? (
              <img 
                src={record.selfieUrl} 
                alt={`Swafoto Presensi ${record.name}`} 
                className="selfie-checkin-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="selfie-empty-state">
                <div className="empty-state-icon-circle">
                  <Camera size={30} />
                </div>
                <h4 className="empty-state-title">Belum Ada Swafoto</h4>
                <p className="empty-state-desc">
                  Foto swafoto otomatis tersimpan dan ditampilkan setelah karyawan melakukan presensi masuk.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Geofence & Location Card (Versi Biasa / Offline Vector Map Batam) */}
        <div className="detail-panel-card">
          <div className="detail-panel-header">
            <MapPin size={18} className="panel-header-icon text-teal" />
            <h3 className="detail-panel-title">Validasi Lokasi &amp; Geofence</h3>
          </div>
          <p className="detail-panel-desc">
            Pemetaan posisi saat tombol presensi ditekan oleh karyawan.
          </p>

          <div className="geofence-map-viewport">
            <div 
              className="geofence-map-content"
              style={{ transform: `scale(${zoom})` }}
            >
              {/* Map Topology Vector Layer (Topologi Wilayah & Pesisir Batam) */}
              <svg className="map-topology-layer" viewBox="0 0 500 400" preserveAspectRatio="none">
                <defs>
                  <pattern id="grid-dots" width="36" height="36" patternUnits="userSpaceOnUse">
                    <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="3 3" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-dots)" />
                {/* Batam Shoreline & Artery Road Paths */}
                <path d="M -20 130 Q 130 80 270 150 T 520 100" fill="none" stroke="#94a3b8" strokeWidth="14" opacity="0.22" />
                <path d="M 90 -20 Q 150 160 170 420" fill="none" stroke="#94a3b8" strokeWidth="9" opacity="0.2" />
                <path d="M 250 -20 Q 320 180 440 420" fill="none" stroke="#94a3b8" strokeWidth="12" opacity="0.18" />
                <path d="M -20 290 Q 190 240 360 320 T 520 280" fill="none" stroke="#94a3b8" strokeWidth="8" opacity="0.16" />
              </svg>

              {/* Batam Landmarks & Districts */}
              <div className="map-landmark landmark-northeast-batam">
                <span className="district-title">NONGSA &amp; NORTHEAST BATAM</span>
                <span className="landmark-badge-pill">Nongsa Digital Park</span>
              </div>

              <div className="map-landmark landmark-west-batam">
                <span className="district-title">NAGOYA &amp; HARBOUR BAY</span>
                <span className="landmark-badge-pill">Grand Batam Mall</span>
              </div>

              <div className="map-landmark landmark-south-batam">
                <span className="district-title">MUKAKUNING &amp; SOUTH BATAM</span>
                <span className="landmark-badge-pill">Batamindo Industrial</span>
              </div>

              <div className="floating-landmark landmark-megamall">
                <span className="landmark-badge-pill">Mega Mall Batam Centre</span>
              </div>

              <div className="floating-landmark landmark-engkuputri">
                <span className="landmark-badge-pill">Alun-Alun Engku Putri</span>
              </div>

              {/* Concentric Geofence Radar Rings & Markers */}
              <div className="geofence-radar-anchor">
                <div className="geofence-ring ring-outer"></div>
                <div className="geofence-ring ring-mid"></div>
                <div className="geofence-ring ring-inner"></div>

                {/* Office Center Marker (Kantor Pusat Batam) */}
                <div className="map-center-point">
                  <div className="map-bubble bubble-office">
                    <Building2 size={12} className="bubble-icon" />
                    <span>Kantor Pusat Batam</span>
                  </div>
                  <div className="center-target-pin">
                    <MapPin size={16} className="office-pin-icon" />
                  </div>
                </div>

                {/* Bentuk Absen Karyawan: Muncul jika sudah ada data presensi masuk */}
                {hasCheckIn ? (
                  <div className="employee-location-pin">
                    <div className="map-bubble bubble-employee">
                      <Navigation size={11} className="bubble-nav-icon" />
                      <span>{record.name} ({distanceText})</span>
                    </div>
                    <div className="emp-map-pin-marker">
                      <div className="emp-pin-pulse-wave"></div>
                      <MapPin size={20} className="emp-pin-icon" />
                    </div>
                  </div>
                ) : (
                  <div className="map-empty-state-badge">
                    <MapPinOff size={13} className="badge-icon-muted" />
                    <span>Presensi Belum Tercatat</span>
                  </div>
                )}
              </div>
            </div>

            {/* Geofence Validation Badge (Muncul saat bentuk absen valid) */}
            {hasCheckIn && (
              <div className="map-geofence-status-tag">
                <ShieldCheck size={14} className="text-emerald" />
                <span>Geofence Batam: <strong>{distanceText}</strong> (Valid &lt;100m)</span>
              </div>
            )}

            {/* Map Floating Zoom / Pan Controls */}
            <div className="map-floating-controls">
              <button 
                type="button" 
                className="map-control-btn" 
                onClick={handleZoomIn}
                title="Perbesar Tampilan Peta"
                aria-label="Perbesar"
              >
                <Plus size={15} />
              </button>
              <div className="map-ctrl-divider"></div>
              <button 
                type="button" 
                className="map-control-btn" 
                onClick={handleZoomOut}
                title="Perkecil Tampilan Peta"
                aria-label="Perkecil"
              >
                <Minus size={15} />
              </button>
              <div className="map-ctrl-divider"></div>
              <button 
                type="button" 
                className="map-control-btn" 
                onClick={handleResetZoom}
                title="Pusatkan ke Batam Center"
                aria-label="Pusatkan"
              >
                <Crosshair size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
