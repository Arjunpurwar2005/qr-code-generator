import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LiveQRSession({
  activeSession,
  currentToken,
  expiresIn = 18,
  onEndSession,
  onDownloadExcel,
  onNavigateDashboard,
  onNavigateHome
}) {
  const [timerText, setTimerText] = useState(expiresIn || 18);
  const [isLocked, setIsLocked] = useState(false);
  const [showConfirmEndModal, setShowConfirmEndModal] = useState(false);
  const [sessionEndedState, setSessionEndedState] = useState(false);

  useEffect(() => {
    if (expiresIn) setTimerText(expiresIn);
  }, [expiresIn]);

  useEffect(() => {
    if (isLocked || sessionEndedState || !activeSession) return;
    const interval = setInterval(() => {
      setTimerText((prev) => {
        if (typeof prev === 'number' && prev <= 1) {
          return 20;
        }
        return typeof prev === 'number' ? prev - 1 : 20;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isLocked, sessionEndedState, activeSession]);

  const qrScanUrl = activeSession
    ? `${window.location.origin}/?session_id=${activeSession.session_id}&qr_token=${currentToken}`
    : `${window.location.origin}/?session_id=1&qr_token=demo`;

  const handleConfirmEndSession = () => {
    setShowConfirmEndModal(false);
    setIsLocked(true);
    setSessionEndedState(true);
    onEndSession?.();
  };

  const attendanceCount = activeSession?.attendances ? activeSession.attendances.length : null;

  return (
    <div className="bg-slate-900 font-sans text-slate-100 antialiased min-h-screen flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2.5 cursor-pointer group"
              onClick={onNavigateHome}
              title="Return to Home Page"
            >
              <div className="w-9 h-9 rounded-xl bg-rq-orange text-white font-bold text-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                RQ
              </div>
              <span className="font-manrope font-extrabold text-xl text-white tracking-tight">
                Roll<span className="text-rq-orange">QR</span>
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 pl-3 border-l border-slate-800">
              <span className={`w-2 h-2 rounded-full ${!activeSession ? 'bg-slate-500' : sessionEndedState ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`}></span>
              <span className="uppercase font-bold tracking-wider text-emerald-400">
                {!activeSession ? 'Session Portal' : sessionEndedState ? 'Session Ended' : 'Live Attendance Control'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="px-3.5 py-1.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">west</span>
              <span>Back to Home</span>
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

      {/* Main Control Room Body */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col items-center justify-center">
        {!activeSession && !sessionEndedState ? (
          /* SCENARIO A: No Active Attendance Session */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl bg-slate-950/80 rounded-3xl border border-slate-800 p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden"
          >
            <div className="w-20 h-20 rounded-full bg-slate-900 text-slate-400 border border-slate-800 mx-auto flex items-center justify-center text-4xl shadow-inner">
              <span className="material-symbols-outlined text-[36px]">sensors_off</span>
            </div>

            <div className="space-y-2">
              <h1 className="font-manrope font-extrabold text-2xl sm:text-3xl text-white">
                No active attendance session
              </h1>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                Create an attendance session and generate your QR code to manage it here.
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                onClick={onNavigateDashboard}
                className="px-6 py-3 rounded-2xl bg-rq-orange hover:bg-orange-600 text-white font-manrope font-bold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
                <span>Start Attendance</span>
              </button>
            </div>
          </motion.div>
        ) : sessionEndedState ? (
          /* SCENARIO C: Polished Completed State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl bg-slate-950/80 rounded-3xl border border-slate-800 p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center text-4xl shadow-inner">
              ✓
            </div>

            <div className="space-y-2">
              <h1 className="font-manrope font-extrabold text-3xl text-white">
                Attendance Completed
              </h1>
              <p className="text-slate-400 text-sm">
                Your attendance session has ended. Rolling tokens have been locked.
              </p>
            </div>

            {attendanceCount !== null && (
              <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 max-w-sm mx-auto">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Roster Total</div>
                <div className="text-2xl font-extrabold text-emerald-400 mt-1">
                  {attendanceCount} Students Present
                </div>
              </div>
            )}

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onDownloadExcel?.(activeSession?.session_id, activeSession?.class_id)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-rq-orange hover:bg-orange-600 text-white font-manrope font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                <span>Download Excel Report</span>
              </button>
              <button
                onClick={onNavigateDashboard}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-manrope font-semibold text-sm transition-all cursor-pointer"
              >
                Back to Dashboard
              </button>
            </div>
          </motion.div>
        ) : (
          /* SCENARIO B: Live Active QR Session Control Room */
          <div className="w-full bg-slate-950/60 rounded-3xl border border-slate-800 p-6 sm:p-10 shadow-2xl flex flex-col items-center text-center space-y-8 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rq-orange/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Live Header & Context */}
            <div className="space-y-2 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-manrope font-bold text-xs uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Attendance Live</span>
              </div>

              <h1 className="font-manrope font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                {activeSession ? activeSession.class_id : 'Class Attendance'}
              </h1>
              <p className="text-slate-400 text-sm">
                Students can scan the QR code below using their mobile camera.
              </p>
            </div>

            {/* Main Center Prominent QR Card */}
            <div className="relative z-10 bg-white p-6 sm:p-8 rounded-3xl shadow-2xl border-4 border-slate-800 flex flex-col items-center max-w-sm w-full">
              <div className="bg-white p-2 rounded-2xl">
                {currentToken ? (
                  <QRCodeSVG
                    value={qrScanUrl}
                    size={230}
                    level="H"
                    includeMargin={false}
                  />
                ) : (
                  <div className="w-56 h-56 flex items-center justify-center text-slate-400 font-bold text-sm">
                    Generating QR Reticle...
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 w-full text-center space-y-1">
                <p className="font-manrope font-bold text-base text-slate-900">
                  Scan to mark attendance
                </p>
                <div className="flex items-center justify-center gap-3 text-xs text-slate-500 font-medium pt-1">
                  <div className="relative w-10 h-10 flex items-center justify-center">
                    <svg className="w-10 h-10 transform -rotate-90">
                      <circle
                        cx="20"
                        cy="20"
                        r="16"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="text-slate-200"
                        fill="transparent"
                      />
                      <circle
                        cx="20"
                        cy="20"
                        r="16"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="text-rq-orange transition-all duration-1000 ease-linear"
                        fill="transparent"
                        strokeDasharray={100}
                        strokeDashoffset={100 - ((typeof timerText === 'number' ? timerText : 20) / 20) * 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute font-mono font-bold text-xs text-slate-900">
                      {timerText}s
                    </span>
                  </div>
                  <div className="text-left leading-tight">
                    <span className="block font-manrope font-bold text-xs text-slate-800">Dynamic Rolling Token</span>
                    <span className="block text-[11px] text-slate-500">Refreshes every ~18–20 sec</span>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Page Visual Story: 3 Mini Process Diagram Cards */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col items-center text-center space-y-1.5">
                <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-rq-orange flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
                </div>
                <div className="font-manrope font-bold text-xs uppercase tracking-wider text-slate-300">1. SCAN</div>
                <p className="text-[11px] text-slate-400">Student scans QR code with phone camera</p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col items-center text-center space-y-1.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[20px]">verified</span>
                </div>
                <div className="font-manrope font-bold text-xs uppercase tracking-wider text-slate-300">2. VERIFY</div>
                <p className="text-[11px] text-slate-400">GPS location &amp; token verified automatically</p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col items-center text-center space-y-1.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[20px]">task_alt</span>
                </div>
                <div className="font-manrope font-bold text-xs uppercase tracking-wider text-slate-300">3. RECORDED</div>
                <p className="text-[11px] text-slate-400">Attendance recorded instantly to class roster</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
              <button
                onClick={() => setShowConfirmEndModal(true)}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-manrope font-bold text-sm shadow-lg transition-all cursor-pointer"
              >
                End Attendance
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
        )}
      </main>

      {/* End Session Confirmation Modal */}
      <AnimatePresence>
        {showConfirmEndModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowConfirmEndModal(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-5 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">warning</span>
                </div>
                <div>
                  <h3 className="font-manrope font-bold text-lg text-white">End Attendance Session?</h3>
                  <p className="text-slate-400 text-xs mt-0.5">Students will no longer be able to scan or submit.</p>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <div>Class: <strong className="text-white">{activeSession?.class_id || 'Active Class'}</strong></div>
                <div>Status: <span className="text-emerald-400 font-semibold">Active Rolling QR</span></div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowConfirmEndModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmEndSession}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-manrope font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  End Attendance Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
