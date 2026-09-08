import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function LiveQRSession({
  activeSession,
  currentToken,
  expiresIn = 18,
  onEndSession,
  onDownloadExcel,
  onNavigateDashboard
}) {
  const [checkedInNum, setCheckedInNum] = useState(43);
  const [timerText, setTimerText] = useState(expiresIn || 18);
  const [isPaused, setIsPaused] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (expiresIn) setTimerText(expiresIn);
  }, [expiresIn]);

  useEffect(() => {
    if (isPaused || isLocked) return;
    const interval = setInterval(() => {
      setTimerText((prev) => {
        if (typeof prev === 'number' && prev <= 1) {
          return 20;
        }
        return typeof prev === 'number' ? prev - 1 : 20;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, isLocked]);

  const qrScanUrl = activeSession
    ? `${window.location.origin}/?session_id=${activeSession.session_id}&qr_token=${currentToken}`
    : `${window.location.origin}/?session_id=1&qr_token=demo_token`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrScanUrl).catch(() => {});
    setCopyFeedback(true);
    setTimeout(() => {
      setCopyFeedback(false);
      setShowShareMenu(false);
    }, 1500);
  };

  const handleWhatsappShare = () => {
    const msg = encodeURIComponent(`RollQR Attendance Verification for ${activeSession?.class_id || 'CS301'}: Please check in at ${qrScanUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
    setShowShareMenu(false);
  };

  const handleLockSession = () => {
    if (window.confirm(`End attendance session for ${activeSession?.class_id || 'CS301'}? This will revoke active dynamic tokens.`)) {
      setIsLocked(true);
      onEndSession?.();
    }
  };

  return (
    <div className="bg-background font-body-md text-on-surface antialiased selection:bg-secondary-container selection:text-on-secondary-container min-h-screen flex flex-col">
      {/* Top Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(33,51,66,0.06)]">
        <div className="h-16 w-full px-gutter-desktop flex items-center justify-between gap-space-lg">
          <div className="flex items-center gap-space-md min-w-0">
            <div className="flex items-center gap-space-sm cursor-pointer" onClick={onNavigateDashboard}>
              <img
                alt="RollQR Logo"
                className="h-8 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1Up5pMusVf4t4LiJbIntWM6RZgmHsxHE3DjOhqFEp5IIw0C01vQufzVZM2O4MFHHr8r7a3QmrLwFcQq2hXXKqIFeKHG11Fu-uGOieIgqe5mD6yTB_ClIR_XeQyQWD0DhzjUnp9WbIReTzmYO_0BLus2I0hpdUDFMBGZBDirB8eg1NRzwSRHTnVarsZpMjcOpzq3nwYBir5GTSFTwaf43RFyrcWmwffIB5Fl-cySwdokIGXa998C4Z3bjfBs"
              />
              <span className="font-headline-sm text-headline-sm text-primary tracking-tight">RollQR</span>
            </div>
            <div className="hidden md:flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              <span className="px-space-xs py-space-2xs rounded bg-surface-container text-on-surface-variant uppercase tracking-wider">Faculty Portal</span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-space-xs">
            <button onClick={onNavigateDashboard} className="px-space-md py-space-xs text-on-surface-variant hover:bg-surface-container-high font-label-lg rounded-lg cursor-pointer">
              Dashboard
            </button>
            <button className="px-space-md py-space-xs bg-secondary-container text-on-secondary-container font-label-lg rounded-lg cursor-pointer">
              Live Session
            </button>
          </nav>

          <div className="flex items-center gap-space-md shrink-0">
            <button onClick={onNavigateDashboard} className="px-space-md py-space-xs rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-md transition-colors cursor-pointer flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Screen Layout */}
      <div className="w-full min-h-screen pt-16 bg-background px-gutter-mobile md:px-gutter-desktop py-space-lg flex-1">
        <div className="flex flex-col w-full">
          {/* Top Session Context & Live Attendance Bar */}
          <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-space-lg mb-space-lg bg-surface-container-lowest p-space-lg rounded-xl shadow-sm">
            <div className="flex flex-col gap-space-2xs min-w-0">
              <div className="flex items-center gap-space-xs">
                <span className="px-space-xs py-space-2xs rounded bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase tracking-wider">
                  Active Lecture
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Live Broadcast Window</span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight truncate">
                {activeSession ? activeSession.class_id : 'CS301 - Data Structures & Algorithms'}
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant">Prof. Alan Davis</p>
            </div>

            <div className="flex items-center gap-space-md shrink-0">
              <div className="flex items-center gap-space-sm bg-surface-container-low px-space-lg py-space-sm rounded-xl">
                <div className="relative flex items-center justify-center">
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 inline-block animate-ping opacity-75"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block absolute"></span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Live Attendance</span>
                  <span className="font-headline-md text-headline-md text-primary font-bold">
                    <span>{checkedInNum}</span> Checked In
                  </span>
                </div>
              </div>
              <div className="hidden sm:flex flex-col text-right pl-space-xs">
                <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">Protocol Security</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant font-mono">HMAC-SHA256 • TLS 1.3</span>
              </div>
            </div>
          </div>

          {/* Primary Layout: QR Centerpiece & Real-Time Telemetry Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            {/* Center Left (7 cols): Reticle & Rotating QR Pod */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center bg-surface-container-lowest rounded-xl p-space-xl shadow-sm relative overflow-hidden">
              <div className="w-full flex items-center justify-between gap-space-sm mb-space-lg">
                <div className="flex items-center gap-space-xs bg-surface-container px-space-sm py-space-2xs rounded-full">
                  <span className="material-symbols-outlined text-[18px] text-tertiary">near_me</span>
                  <span className="font-label-sm text-label-sm text-primary font-semibold">
                    Silent Geofence: {activeSession?.radius_meters || 25}m active
                  </span>
                </div>
                <div className="flex items-center gap-space-xs bg-surface-container px-space-sm py-space-2xs rounded-full">
                  <span className={`material-symbols-outlined text-[16px] text-secondary ${!isPaused && !isLocked ? 'animate-spin' : ''}`}>sync</span>
                  <span className="font-label-sm text-label-sm text-secondary">
                    Token Refresh: <span className="font-mono text-primary font-bold">{isLocked ? 'LOCKED' : `${timerText}s`}</span>
                  </span>
                </div>
              </div>

              {/* Live Dynamic QR Reticle Pod */}
              <div className="relative flex flex-col items-center justify-center p-space-xl bg-surface-container-low rounded-xl w-full max-w-md mx-auto aspect-square group shadow-sm">
                <div className="absolute inset-4 rounded-xl bg-secondary-container/20 -z-0 blur-xl"></div>
                <div className="relative z-10 w-full h-full max-w-[280px] max-h-[280px] bg-surface-container-lowest rounded-xl p-space-md flex items-center justify-center shadow-md">
                  <div className="absolute inset-x-3 top-3 h-0.5 bg-gradient-to-r from-transparent via-secondary-container to-transparent animate-pulse z-20"></div>

                  {/* Real Scannable QRCodeSVG */}
                  {currentToken ? (
                    <QRCodeSVG
                      value={qrScanUrl}
                      size={220}
                      level="H"
                      includeMargin={true}
                    />
                  ) : (
                    <div className="p-8 text-center text-primary font-bold font-mono">
                      Generating Reticle Hash...
                    </div>
                  )}
                </div>
                <span className="mt-space-md font-mono text-label-sm text-on-surface-variant tracking-wider truncate max-w-xs">
                  TOKEN: {currentToken ? currentToken.slice(0, 16) : 'e94a·8f20·bc01·771d'}
                </span>
              </div>

              {/* Action Panel Underneath QR Reticle */}
              <div className="w-full max-w-md mt-space-lg flex flex-col sm:flex-row items-center gap-space-sm justify-between">
                <div className="relative w-full sm:w-auto flex-1">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="w-full flex items-center justify-center gap-space-xs bg-secondary hover:bg-primary text-on-secondary px-space-md py-space-sm rounded-lg font-headline-sm text-headline-sm transition-all shadow-sm active:scale-95 cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">share</span>
                    <span>Share QR</span>
                    <span className="material-symbols-outlined text-[18px]">expand_more</span>
                  </button>

                  {showShareMenu && (
                    <div className="absolute left-0 bottom-full mb-space-xs w-full bg-surface-container-lowest rounded-xl shadow-xl p-space-xs z-30 flex flex-col gap-space-2xs">
                      <button
                        onClick={handleWhatsappShare}
                        className="flex items-center gap-space-sm px-space-md py-space-sm rounded-lg hover:bg-surface-container text-left transition-colors text-primary font-label-md text-label-md cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-emerald-600 text-[20px]">chat</span>
                        <div className="flex flex-col">
                          <span className="font-semibold">Share via WhatsApp</span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">Send attendance link directly</span>
                        </div>
                      </button>
                      <button
                        onClick={handleCopyLink}
                        className="flex items-center gap-space-sm px-space-md py-space-sm rounded-lg hover:bg-surface-container text-left transition-colors text-primary font-label-md text-label-md cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-secondary text-[20px]">content_copy</span>
                        <div className="flex flex-col">
                          <span className="font-semibold">{copyFeedback ? 'Copied to Clipboard!' : 'Copy Check-In Link'}</span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">One-click student direct link</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setTimerText(20)}
                  className="w-full sm:w-auto flex items-center justify-center gap-space-xs bg-surface-container hover:bg-surface-container-high text-primary px-space-md py-space-sm rounded-lg font-label-lg text-label-lg transition-colors cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">refresh</span>
                  <span>Regenerate Now</span>
                </button>
              </div>

              <div className="mt-space-md flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-[16px] text-tertiary">lock</span>
                <span>HMAC-SHA256 Rolling Token • Auto-Refresh</span>
              </div>
            </div>

            {/* Right Side (5 cols): Real-Time Telemetry Feed & Console Tray */}
            <div className="lg:col-span-5 flex flex-col gap-space-md">
              <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col">
                <div className="flex items-center justify-between pb-space-sm mb-space-md">
                  <div className="flex items-center gap-space-xs">
                    <span className="font-headline-sm text-headline-sm text-primary">Live Telemetry Feed</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-mono uppercase tracking-wider">Real-time sync</span>
                </div>

                <div className="flex flex-col gap-space-xs max-h-[380px] overflow-y-auto pr-space-2xs">
                  <div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
                    <div className="flex items-center gap-space-sm min-w-0">
                      <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center font-label-sm text-label-sm text-primary font-bold shrink-0">
                        SK
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-label-md text-label-md text-primary truncate">Samantha Kuo</span>
                        <span className="font-body-sm text-body-sm text-emerald-700 flex items-center gap-space-2xs">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          Verified 10:14:18 AM
                        </span>
                      </div>
                    </div>
                    <span className="font-label-sm text-label-sm px-space-xs py-space-2xs rounded bg-emerald-100 text-emerald-800 font-semibold shrink-0">0.8s • 4m</span>
                  </div>

                  <div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
                    <div className="flex items-center gap-space-sm min-w-0">
                      <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center font-label-sm text-label-sm text-primary font-bold shrink-0">
                        MR
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-label-md text-label-md text-primary truncate">Marcus Ramirez</span>
                        <span className="font-body-sm text-body-sm text-emerald-700 flex items-center gap-space-2xs">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          Verified 10:14:19 AM
                        </span>
                      </div>
                    </div>
                    <span className="font-label-sm text-label-sm px-space-xs py-space-2xs rounded bg-emerald-100 text-emerald-800 font-semibold shrink-0">1.1s • 7m</span>
                  </div>

                  <div className="flex items-center justify-between p-space-sm rounded-lg bg-red-50 hover:bg-red-100/70 transition-colors">
                    <div className="flex items-center gap-space-sm min-w-0">
                      <div className="w-8 h-8 rounded-full bg-error-container text-on-error-container flex items-center justify-center font-label-sm text-label-sm font-bold shrink-0">
                        AL
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-label-md text-label-md text-primary truncate">Alex Lindqvist</span>
                        <span className="font-body-sm text-body-sm text-error flex items-center gap-space-2xs font-medium">
                          <span className="material-symbols-outlined text-[14px]">fmd_bad</span>
                          Geofence Mismatch Quarantined
                        </span>
                      </div>
                    </div>
                    <span className="font-label-sm text-label-sm px-space-xs py-space-2xs rounded bg-error-container text-on-error-container font-semibold shrink-0">114m Out</span>
                  </div>
                </div>
              </div>

              {/* Instructor Controls Tray */}
              <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-sm">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Live Console Actions</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className={`flex items-center justify-center gap-space-xs px-space-md py-space-sm rounded-lg font-label-lg text-label-lg transition-colors cursor-pointer ${
                      isPaused ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container hover:bg-surface-container-high text-primary'
                    }`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">{isPaused ? 'play_circle' : 'pause_circle'}</span>
                    <span>{isPaused ? 'Resume QR' : 'Pause QR'}</span>
                  </button>

                  <button
                    onClick={() => onDownloadExcel?.(activeSession?.session_id || 1, activeSession?.class_id || 'CS301')}
                    className="flex items-center justify-center gap-space-xs bg-surface-container hover:bg-surface-container-high text-primary px-space-md py-space-sm rounded-lg font-label-lg text-label-lg transition-colors cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px] text-emerald-700">table_view</span>
                    <span>Download Excel (.xlsx)</span>
                  </button>
                </div>

                <button
                  onClick={handleLockSession}
                  disabled={isLocked}
                  className="w-full flex items-center justify-center gap-space-xs bg-error hover:opacity-90 text-on-error px-space-md py-space-sm rounded-lg font-headline-sm text-headline-sm transition-all shadow-sm active:scale-[0.99] cursor-pointer disabled:opacity-50"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">lock_clock</span>
                  <span>{isLocked ? 'Session Locked' : 'End Attendance & Lock'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
