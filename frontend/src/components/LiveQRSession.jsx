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
  const [timerText, setTimerText] = useState(expiresIn || 18);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (expiresIn) setTimerText(expiresIn);
  }, [expiresIn]);

  useEffect(() => {
    if (isLocked) return;
    const interval = setInterval(() => {
      setTimerText((prev) => {
        if (typeof prev === 'number' && prev <= 1) {
          return 20;
        }
        return typeof prev === 'number' ? prev - 1 : 20;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isLocked]);

  const qrScanUrl = activeSession
    ? `${window.location.origin}/?session_id=${activeSession.session_id}&qr_token=${currentToken}`
    : `${window.location.origin}/?session_id=1&qr_token=demo`;

  const handleEndClick = () => {
    if (window.confirm(`End attendance session for ${activeSession?.class_id || 'this class'}?`)) {
      setIsLocked(true);
      onEndSession?.();
    }
  };

  const attendanceCount = activeSession?.attendances ? activeSession.attendances.length : null;

  return (
    <div className="bg-slate-900 font-sans text-slate-100 antialiased min-h-screen flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={onNavigateDashboard}
            >
              <div className="w-9 h-9 rounded-xl bg-rq-orange text-white font-bold text-lg flex items-center justify-center shadow-md">
                RQ
              </div>
              <span className="font-manrope font-extrabold text-xl text-white tracking-tight">
                Roll<span className="text-rq-orange">QR</span>
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 pl-3 border-l border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="uppercase font-bold tracking-wider text-emerald-400">Live Session</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onDownloadExcel?.(activeSession?.session_id, activeSession?.class_id)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-emerald-400">download</span>
              <span>Download Excel</span>
            </button>
            <button
              onClick={onNavigateDashboard}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">dashboard</span>
              <span>Dashboard</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col items-center justify-center">
        <div className="w-full bg-slate-950/60 rounded-3xl border border-slate-800 p-8 sm:p-12 shadow-2xl flex flex-col items-center text-center space-y-8 relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rq-orange/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Live Header Info */}
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-manrope font-bold text-xs uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Attendance is Live</span>
            </div>

            <h1 className="font-manrope font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              {activeSession ? activeSession.class_id : 'Class Attendance'}
            </h1>

            {attendanceCount !== null && (
              <p className="text-slate-300 text-sm font-medium pt-1">
                <span className="font-bold text-rq-orange">{attendanceCount}</span> students have attended
              </p>
            )}
          </div>

          {/* QR Code Container */}
          <div className="relative z-10 bg-white p-6 sm:p-8 rounded-3xl shadow-2xl border-4 border-slate-800 flex flex-col items-center max-w-sm w-full">
            <div className="bg-white p-2 rounded-2xl">
              {currentToken ? (
                <QRCodeSVG
                  value={qrScanUrl}
                  size={240}
                  level="H"
                  includeMargin={false}
                />
              ) : (
                <div className="w-60 h-60 flex items-center justify-center text-slate-400 font-bold text-sm">
                  Generating QR Code...
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 w-full text-center space-y-1">
              <p className="font-manrope font-bold text-base text-slate-900">
                Scan to mark attendance
              </p>
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium">
                <span className="material-symbols-outlined text-[16px] text-rq-orange">sync</span>
                <span>QR refreshes in <strong className="text-slate-900 font-mono">{timerText}s</strong></span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
            <button
              onClick={handleEndClick}
              disabled={isLocked}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-manrope font-bold text-sm shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {isLocked ? 'Attendance Ended' : 'End Attendance'}
            </button>

            <button
              onClick={() => onDownloadExcel?.(activeSession?.session_id, activeSession?.class_id)}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-manrope font-bold text-sm border border-slate-700 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-emerald-400">table_view</span>
              <span>Download Excel</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
