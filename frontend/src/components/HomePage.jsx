import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────────
   NAVBAR (Floating Design)
───────────────────────────────────────────── */
function FloatingNavbar({
  token,
  teacherName,
  teacherPicture,
  onNavigateLogin,
  onNavigateSignup,
  onNavigateDashboard,
  onNavigateSessions,
  onNavigateTemplates,
  onLogout,
  onOpenStartModal
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 pointer-events-none px-4 sm:px-6 lg:px-8 pt-3 md:pt-4 max-w-7xl mx-auto">
      <div
        className={`pointer-events-auto rounded-2xl border transition-all duration-300 px-4 sm:px-6 flex items-center justify-between gap-4 ${
          scrolled
            ? 'bg-white/98 backdrop-blur-xl border-slate-300 shadow-md py-2.5'
            : 'bg-white/90 backdrop-blur-md border-slate-200/90 shadow-sm py-3.5'
        }`}
      >
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-rq-navy flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
            <span className="text-rq-orange">R</span>Q
          </div>
          <span className="font-manrope font-extrabold text-xl text-rq-navy tracking-tight">
            Roll<span className="text-rq-orange">QR</span>
          </span>
        </a>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-semibold text-slate-700 hover:text-rq-navy transition-colors">
            Home
          </a>
          <a href="#why-rollqr" className="text-sm font-semibold text-slate-700 hover:text-rq-navy transition-colors">
            Why RollQR?
          </a>
          <a href="#how-it-works" className="text-sm font-semibold text-slate-700 hover:text-rq-navy transition-colors">
            How It Works
          </a>
          <a href="#where-it-works" className="text-sm font-semibold text-slate-700 hover:text-rq-navy transition-colors">
            For Teachers
          </a>
        </nav>

        {/* Right Action Area */}
        <div className="flex items-center gap-3">
          {token ? (
            /* Logged-In Teacher Controls */
            <div className="flex items-center gap-3">
              <button
                onClick={onNavigateDashboard}
                className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-rq-navy text-xs font-bold transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">dashboard</span>
                <span>Dashboard</span>
              </button>

              <div className="flex items-center gap-2.5 border-l border-slate-200 pl-3">
                <div className="w-8 h-8 rounded-full bg-rq-navy text-white font-bold text-xs flex items-center justify-center shadow-xs overflow-hidden">
                  {teacherPicture ? (
                    <img
                      src={teacherPicture}
                      alt={teacherName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    teacherName ? teacherName.charAt(0).toUpperCase() : 'T'
                  )}
                </div>
                <span className="hidden lg:inline text-xs font-bold text-rq-navy capitalize">
                  {teacherName}
                </span>
                <button
                  onClick={onLogout}
                  title="Logout"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                </button>
              </div>
            </div>
          ) : (
            /* Logged-Out Controls */
            <div className="flex items-center gap-2.5">
              <button
                onClick={onNavigateLogin}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-rq-navy hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={onNavigateLogin}
                className="px-4 py-2 rounded-xl bg-rq-orange hover:bg-orange-600 text-white font-manrope font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95"
              >
                Start Attendance
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1.5 text-slate-600 hover:text-rq-navy"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="pointer-events-auto md:hidden mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl p-4 space-y-3"
          >
            <a
              href="#"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Home
            </a>
            <a
              href="#why-rollqr"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Why RollQR?
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              How It Works
            </a>
            <a
              href="#where-it-works"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              For Teachers
            </a>
            {token && (
              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                <button
                  onClick={() => { setMobileOpen(false); onNavigateDashboard(); }}
                  className="w-full py-2 bg-slate-100 text-rq-navy font-bold text-xs rounded-xl"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => { setMobileOpen(false); onLogout(); }}
                  className="w-full py-2 bg-red-50 text-red-600 font-bold text-xs rounded-xl"
                >
                  Logout
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ─────────────────────────────────────────────
   MAIN HOMEPAGE COMPONENT
───────────────────────────────────────────── */
export default function HomePage({
  token,
  teacherName = "Teacher",
  teacherPicture = null,
  activeSession,
  templates = [],
  location = null,
  locLoading = false,
  classId = "CS301",
  setClassId,
  radiusMeters = 30,
  setRadiusMeters,
  selectedTemplateId = "",
  setSelectedTemplateId,
  onGetGPSLocation,
  onStartSession,
  onEndSession,
  onOpenLiveSession,
  onNavigateDashboard,
  onNavigateSessions,
  onNavigateTemplates,
  onNavigateLogin,
  onNavigateSignup,
  onLogout
}) {
  const [showStartModal, setShowStartModal] = useState(false);

  return (
    <div className="bg-slate-50 font-sans text-slate-800 antialiased min-h-screen flex flex-col selection:bg-orange-100 selection:text-orange-900">
      {/* Floating Navbar */}
      <FloatingNavbar
        token={token}
        teacherName={teacherName}
        teacherPicture={teacherPicture}
        onNavigateLogin={onNavigateLogin}
        onNavigateSignup={onNavigateSignup}
        onNavigateDashboard={onNavigateDashboard}
        onNavigateSessions={onNavigateSessions}
        onNavigateTemplates={onNavigateTemplates}
        onLogout={onLogout}
        onOpenStartModal={() => setShowStartModal(true)}
      />

      {/* Start Attendance Setup Modal (Accessible directly from Home page when logged in) */}
      <AnimatePresence>
        {showStartModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-rq-navy/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowStartModal(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-rq-orange flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[22px]">qr_code_2</span>
                  </div>
                  <div>
                    <h3 className="font-manrope font-extrabold text-xl text-rq-navy">Start Attendance</h3>
                    <p className="text-slate-500 text-xs">Set up your class and generate a QR code.</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowStartModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onStartSession?.(e);
                  setShowStartModal(false);
                }}
                className="p-6 space-y-5 text-left"
              >
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Class / Subject Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={classId}
                    onChange={(e) => setClassId?.(e.target.value)}
                    placeholder="e.g. CS301 Data Structures & Algorithms"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-rq-orange focus:ring-2 focus:ring-orange-100 outline-none text-slate-800 text-sm font-medium"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Attendance Form Preset
                  </label>
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => setSelectedTemplateId?.(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-rq-orange focus:ring-2 focus:ring-orange-100 outline-none text-slate-800 text-sm font-medium bg-white"
                  >
                    <option value="">Standard Default Form (Roll Number, Student Name)</option>
                    {templates.map((tmpl) => (
                      <option key={tmpl.id} value={tmpl.id}>
                        {tmpl.template_name} ({tmpl.fields?.length || 2} fields)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Geofence Boundary Radius (Meters)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="5"
                      max="300"
                      value={radiusMeters}
                      onChange={(e) => setRadiusMeters?.(e.target.value)}
                      className="w-32 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-rq-orange focus:ring-2 focus:ring-orange-100 outline-none text-slate-800 text-sm font-medium"
                      required
                    />
                    <span className="text-xs text-slate-500 font-medium">
                      Allowed student radius from instructor GPS center
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onGetGPSLocation}
                    className={`w-full py-3 px-4 rounded-xl font-manrope font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                      location
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                        : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {location ? 'check_circle' : 'my_location'}
                    </span>
                    <span>
                      {locLoading
                        ? 'Capturing GPS Coordinates...'
                        : location
                        ? `GPS Verified (${location.lat.toFixed(4)}, ${location.long.toFixed(4)})`
                        : '📍 Capture GPS Center Location'}
                    </span>
                  </button>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowStartModal(false)}
                    className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-sm transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!location}
                    className="px-6 py-2.5 rounded-xl bg-rq-navy hover:bg-slate-800 text-white font-manrope font-bold text-sm shadow-md disabled:opacity-40 transition-all cursor-pointer"
                  >
                    Start Session &amp; Open Live QR
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative overflow-hidden">
        {/* Subtle Ambient Background Gradient */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-orange-100/60 to-blue-100/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {token ? (
              /* Personalized Teacher Hero Greeting */
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-rq-orange text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-rq-orange animate-ping"></span>
                  <span>Authenticated Faculty Portal</span>
                </div>
                <h1 className="font-manrope font-extrabold text-3xl sm:text-5xl text-rq-navy tracking-tight leading-tight">
                  Hello, <span className="capitalize text-rq-orange">{teacherName}</span> 👋
                </h1>
                <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  Ready to take attendance? Start a live QR session or access your workspace tools below.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <button
                    onClick={() => setShowStartModal(true)}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-rq-orange hover:bg-orange-600 text-white font-manrope font-bold text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[22px]">add</span>
                    <span>+ Start Attendance</span>
                  </button>
                  <button
                    onClick={onNavigateDashboard}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-rq-navy font-manrope font-bold text-base border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">dashboard</span>
                    <span>Go to Dashboard</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Public Visitor Hero */
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Smart Classroom Attendance</span>
                </div>
                <h1 className="font-manrope font-extrabold text-3xl sm:text-5xl text-rq-navy tracking-tight leading-tight">
                  Attendance, <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-rq-orange to-orange-500">
                    made ridiculously simple.
                  </span>
                </h1>
                <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  Fast, fraud-proof classroom attendance with dynamic rolling QR codes and GPS geofence verification. Built for colleges, schools &amp; institutes.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <button
                    onClick={onNavigateLogin}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-rq-orange hover:bg-orange-600 text-white font-manrope font-bold text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span>Start Attendance</span>
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </button>
                  <button
                    onClick={onNavigateLogin}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-rq-navy font-manrope font-bold text-base border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">login</span>
                    <span>Teacher Login</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Hero Right Visual Card (Product Representation WITHOUT fake stats) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xl relative overflow-hidden text-center space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-manrope font-bold text-xs uppercase tracking-wider text-rq-navy">
                    RollQR Scanner Node
                  </span>
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Live Verification
                </span>
              </div>

              {/* Product Visual Mockup */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-inner space-y-4 relative overflow-hidden">
                <div className="w-12 h-12 rounded-xl bg-rq-orange/20 text-rq-orange mx-auto flex items-center justify-center">
                  <span className="material-symbols-outlined text-[28px]">qr_code_2</span>
                </div>
                <div className="space-y-1">
                  <div className="font-manrope font-extrabold text-lg text-white">Scan to mark attendance</div>
                  <p className="text-slate-400 text-xs">Dynamic rolling QR token • GPS location active</p>
                </div>
                <div className="pt-2 flex items-center justify-center gap-2 text-xs text-emerald-400 font-semibold">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>Secure • Fast • Organized</span>
                </div>
              </div>

              <div className="text-xs text-slate-500 font-medium">
                No app install required for students. Works on any browser.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Why RollQR? (Replaces Old Problem Section) */}
      <section id="why-rollqr" className="py-16 md:py-24 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 text-rq-orange text-xs font-bold uppercase tracking-wider">
              <span>Why RollQR?</span>
            </div>
            <h2 className="font-manrope font-extrabold text-3xl sm:text-4xl text-rq-navy tracking-tight">
              Say goodbye to manual roll calls &amp; proxy attendance.
            </h2>
            <p className="text-slate-600 text-base">
              See how RollQR transforms traditional paper registers into instant digital records.
            </p>
          </div>

          {/* BEFORE vs WITH ROLLQR Visual Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left: BEFORE (Old Way) */}
            <div className="lg:col-span-5 bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 font-bold text-xs uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[14px]">history</span>
                  <span>BEFORE — Traditional Way</span>
                </div>
                <h3 className="font-manrope font-bold text-xl text-rq-navy">The Classroom Hassle</h3>
              </div>

              <div className="space-y-4 flex-1">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-1">
                  <div className="text-xs font-bold text-red-600 uppercase tracking-wider">01 — Proxy Attendance</div>
                  <p className="text-sm font-semibold text-slate-800">Students mark attendance for absent friends</p>
                  <p className="text-xs text-slate-500">No physical presence verification leading to inaccurate records.</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-1">
                  <div className="text-xs font-bold text-red-600 uppercase tracking-wider">02 — Manual Paperwork</div>
                  <p className="text-sm font-semibold text-slate-800">Maintaining physical attendance registers</p>
                  <p className="text-xs text-slate-500">Tedious manual data entry into spreadsheets after class.</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-1">
                  <div className="text-xs font-bold text-red-600 uppercase tracking-wider">03 — Time Loss</div>
                  <p className="text-sm font-semibold text-slate-800">Wasting 10+ minutes every lecture</p>
                  <p className="text-xs text-slate-500">Calling roll names one by one consumes valuable teaching time.</p>
                </div>
              </div>
            </div>

            {/* Center Transition Badge */}
            <div className="lg:col-span-2 flex flex-col items-center justify-center text-center py-4">
              <div className="w-14 h-14 rounded-2xl bg-rq-orange text-white flex items-center justify-center shadow-lg font-bold text-xl">
                <span className="material-symbols-outlined text-[28px]">east</span>
              </div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-rq-navy mt-2">
                The RollQR Upgrade
              </span>
            </div>

            {/* Right: WITH ROLLQR (Better Way) */}
            <div className="lg:col-span-5 bg-rq-navy text-white rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 flex flex-col justify-between shadow-xl">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs uppercase tracking-wider border border-emerald-500/30">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  <span>WITH ROLLQR — Modern Way</span>
                </div>
                <h3 className="font-manrope font-bold text-xl text-white">Automated &amp; Verified</h3>
              </div>

              <div className="space-y-4 flex-1">
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <div className="text-xs font-bold text-rq-orange uppercase tracking-wider">01 — QR Attendance</div>
                  <p className="text-sm font-semibold text-white">Generate dynamic classroom QR code</p>
                  <p className="text-xs text-slate-400">Students scan in seconds using any mobile phone camera.</p>
                </div>

                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <div className="text-xs font-bold text-rq-orange uppercase tracking-wider">02 — Geo Location Verification</div>
                  <p className="text-sm font-semibold text-white">Verify physical in-class presence</p>
                  <p className="text-xs text-slate-400">Configured geofence boundaries prevent proxy submissions from outside.</p>
                </div>

                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <div className="text-xs font-bold text-rq-orange uppercase tracking-wider">03 — Organized Records</div>
                  <p className="text-sm font-semibold text-white">1-Click Excel export</p>
                  <p className="text-xs text-slate-400">Attendance data is organized digitally and exportable instantly.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Logged-In Teacher Workspace Cards (Revealed ONLY when logged in) */}
      {token && (
        <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-rq-orange text-xs font-bold uppercase tracking-wider">
              <span>Your Attendance Workspace</span>
            </div>
            <h2 className="font-manrope font-extrabold text-2xl sm:text-3xl text-rq-navy tracking-tight">
              Select an application module
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* CARD 1 — Dashboard */}
            <div
              onClick={onNavigateDashboard}
              className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all cursor-pointer group flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 text-rq-orange flex items-center justify-center font-bold group-hover:scale-110 transition-transform shadow-inner">
                  <span className="material-symbols-outlined text-[30px]">grid_view</span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-manrope font-extrabold text-xl text-rq-navy">
                    Dashboard
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    View your attendance activity and manage your classroom sessions.
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-rq-orange font-manrope font-bold text-sm">
                <span>Open Dashboard</span>
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">east</span>
              </div>
            </div>

            {/* CARD 2 — Sessions */}
            <div
              onClick={onNavigateSessions}
              className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all cursor-pointer group flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform shadow-inner">
                  <span className="material-symbols-outlined text-[30px]">qr_code_scanner</span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-manrope font-extrabold text-xl text-rq-navy">
                    Sessions
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Manage your active and completed attendance sessions in real time.
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-blue-600 font-manrope font-bold text-sm">
                <span>Open Sessions</span>
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">east</span>
              </div>
            </div>

            {/* CARD 3 — Templates */}
            <div
              onClick={onNavigateTemplates}
              className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all cursor-pointer group flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform shadow-inner">
                  <span className="material-symbols-outlined text-[30px]">folder_special</span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-manrope font-extrabold text-xl text-rq-navy">
                    Templates
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Create and reuse attendance forms for different classes.
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-emerald-600 font-manrope font-bold text-sm">
                <span>Open Templates</span>
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">east</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Section 4: Where RollQR Works (Replaces "Built for Classrooms") */}
      <section id="where-it-works" className="py-16 md:py-24 bg-slate-100/70 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider">
              <span>Where RollQR Works</span>
            </div>
            <h2 className="font-manrope font-extrabold text-3xl sm:text-4xl text-rq-navy tracking-tight">
              Built for Every Learning Space
            </h2>
            <p className="text-slate-600 text-base">
              RollQR adapts to any physical layout or institutional requirement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Classroom */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-rq-orange flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]">school</span>
              </div>
              <h3 className="font-manrope font-bold text-lg text-rq-navy">Classrooms</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Daily lectures, regular subjects, and automated roll calls for any class size.
              </p>
            </div>

            {/* Card 2: Auditorium */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]">theater_comedy</span>
              </div>
              <h3 className="font-manrope font-bold text-lg text-rq-navy">Auditoriums</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Large capacity sessions, guest lectures, and batch-wide attendance tracking.
              </p>
            </div>

            {/* Card 3: Seminar */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]">groups</span>
              </div>
              <h3 className="font-manrope font-bold text-lg text-rq-navy">Seminars</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Workshops, academic seminars, and guest presentations with instant verification.
              </p>
            </div>

            {/* Card 4: Lab */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]">biotech</span>
              </div>
              <h3 className="font-manrope font-bold text-lg text-rq-navy">Practical Labs</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Computer labs, science experiments, and batch-based practical sessions.
              </p>
            </div>

            {/* Card 5: Training */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]">model_training</span>
              </div>
              <h3 className="font-manrope font-bold text-lg text-rq-navy">Training Centers</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Corporate, vocational, and skill-based technical training sessions.
              </p>
            </div>

            {/* Card 6: Events */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]">event</span>
              </div>
              <h3 className="font-manrope font-bold text-lg text-rq-navy">Campus Events</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Orientations, hackathons, college fests, and organized campus activities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: How It Works */}
      <section id="how-it-works" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 text-rq-orange text-xs font-bold uppercase tracking-wider">
              <span>How It Works</span>
            </div>
            <h2 className="font-manrope font-extrabold text-3xl sm:text-4xl text-rq-navy tracking-tight">
              Three simple steps to seamless attendance
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rq-navy text-white font-manrope font-bold flex items-center justify-center">
                1
              </div>
              <h3 className="font-manrope font-bold text-lg text-rq-navy">Teacher Starts Session</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Instructor selects a class template and captures classroom location to display a live QR code.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rq-orange text-white font-manrope font-bold flex items-center justify-center">
                2
              </div>
              <h3 className="font-manrope font-bold text-lg text-rq-navy">Students Scan &amp; Verify</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Students scan the rotating QR code with any mobile browser. GPS checks physical in-class presence.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-manrope font-bold flex items-center justify-center">
                3
              </div>
              <h3 className="font-manrope font-bold text-lg text-rq-navy">Download Excel Roster</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                When the lecture ends, attendance data is saved permanently and exportable to Excel with 1 click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-rq-navy text-white py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rq-orange text-white font-bold flex items-center justify-center text-sm">
              RQ
            </div>
            <span className="font-manrope font-extrabold text-lg tracking-tight">
              Roll<span className="text-rq-orange">QR</span>
            </span>
          </div>

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} RollQR Attendance Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
