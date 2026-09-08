import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TeacherDashboard({
  teacherName = "Teacher",
  templates = [],
  pastSessions = [],
  activeSession = null,
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
  onNavigateTab,
  onNavigateHome,
  onDownloadExcel,
  onLogout
}) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showStartModal, setShowStartModal] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'templates') onNavigateTab?.('templates');
    else if (tab === 'live') onNavigateTab?.('live-session');
    else if (tab === 'dashboard' || tab === 'history') onNavigateTab?.('dashboard');
  };

  const handleSelectTemplateAndStart = (templateId) => {
    setSelectedTemplateId?.(templateId);
    setShowStartModal(true);
  };

  const filteredSessions = pastSessions.filter(s =>
    !searchFilter || (s.class_id && s.class_id.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  return (
    <div className="bg-slate-50 font-sans text-slate-800 antialiased min-h-screen flex flex-col selection:bg-orange-100 selection:text-orange-900">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <div
              className="flex items-center gap-2.5 cursor-pointer group"
              onClick={onNavigateHome}
              title="Return to Home Page"
            >
              <div className="w-9 h-9 rounded-xl bg-rq-navy flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
                <span className="text-rq-orange">R</span>Q
              </div>
              <span className="font-manrope font-extrabold text-xl text-rq-navy tracking-tight">
                Roll<span className="text-rq-orange">QR</span>
              </span>
            </div>

            {/* Nav Tabs */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-slate-100 text-rq-navy'
                    : 'text-slate-600 hover:text-rq-navy hover:bg-slate-50'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => handleNavClick('live')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'live'
                    ? 'bg-slate-100 text-rq-navy'
                    : 'text-slate-600 hover:text-rq-navy hover:bg-slate-50'
                }`}
              >
                {activeSession && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>}
                <span>Sessions</span>
              </button>
              <button
                onClick={() => handleNavClick('templates')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                  activeTab === 'templates'
                    ? 'bg-slate-100 text-rq-navy'
                    : 'text-slate-600 hover:text-rq-navy hover:bg-slate-50'
                }`}
              >
                Templates
              </button>
            </nav>
          </div>

          {/* Right Teacher Identity Profile & Logout */}
          <div className="flex items-center gap-4">
            <button
              onClick={onNavigateHome}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-rq-navy hover:bg-slate-100 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">west</span>
              <span className="hidden sm:inline">← Back to Home</span>
            </button>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-bold text-rq-navy leading-snug capitalize">
                  {teacherName}
                </span>
                <span className="text-xs text-slate-500 font-medium">Faculty Member</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-rq-navy text-white font-bold flex items-center justify-center text-sm shadow-sm ring-2 ring-orange-100">
                {teacherName.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={onLogout}
                title="Logout"
                className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-50 to-blue-50 rounded-full blur-3xl -z-0 pointer-events-none"></div>

          <div className="relative z-10 space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-rq-orange text-xs font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-rq-orange animate-ping"></span>
              <span>Faculty Operational Command</span>
            </div>
            <h1 className="font-manrope font-extrabold text-2xl sm:text-3xl text-rq-navy tracking-tight">
              {getGreeting()}, <span className="capitalize">{teacherName}</span> 👋
            </h1>
            <p className="text-slate-600 text-sm sm:text-base">
              Manage your classroom attendance in seconds. Select a template or start an instant QR session.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowStartModal(true)}
              className="px-6 py-3 rounded-xl bg-rq-orange hover:bg-orange-600 text-white font-manrope font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span>+ Start Attendance</span>
            </button>
          </div>
        </div>

        {/* Start Attendance Setup Modal */}
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
                  className="p-6 space-y-5"
                >
                  {/* Class Details */}
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

                  {/* Attendance Template Selector */}
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

                  {/* Geofence Radius */}
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

                  {/* GPS Capture Button */}
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

                  {/* Action Buttons */}
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

        {/* Section 1: Active Attendance Session */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-manrope font-bold text-lg text-rq-navy flex items-center gap-2">
              <span className="material-symbols-outlined text-rq-orange">sensors</span>
              <span>Active Attendance Session</span>
            </h2>
          </div>

          {activeSession ? (
            <div className="bg-white rounded-2xl border-2 border-emerald-500/40 shadow-md p-6 sm:p-8 relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs tracking-wider uppercase">
                      ● LIVE ATTENDANCE
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Session #{activeSession.session_id}</span>
                  </div>

                  <h3 className="font-manrope font-extrabold text-xl sm:text-2xl text-rq-navy">
                    {activeSession.class_id}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap">
                    <span className="flex items-center gap-1 font-medium">
                      <span className="material-symbols-outlined text-[16px] text-slate-400">location_on</span>
                      Geofence Radius: {activeSession.radius_meters}m
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-medium">
                      <span className="material-symbols-outlined text-[16px] text-slate-400">tune</span>
                      Preset: {selectedTemplateId ? templates.find(t => t.id == selectedTemplateId)?.template_name || 'Standard' : 'Standard'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={onEndSession}
                    className="px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 border border-red-200 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    End Attendance
                  </button>
                  <button
                    onClick={onOpenLiveSession}
                    className="px-6 py-2.5 rounded-xl bg-rq-orange hover:bg-orange-600 text-white font-manrope font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
                    <span>Open Live QR</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Rich Illustrated Empty State */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-10 text-center space-y-4 relative overflow-hidden">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 text-rq-orange mx-auto flex items-center justify-center shadow-inner">
                <span className="material-symbols-outlined text-[32px]">qr_code_scanner</span>
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h3 className="font-manrope font-extrabold text-xl text-rq-navy">Ready to take attendance?</h3>
                <p className="text-slate-500 text-sm">
                  Start a session to generate a dynamic, location-verified QR code for your class.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setShowStartModal(true)}
                  className="px-6 py-3 rounded-xl bg-rq-navy hover:bg-slate-800 text-white font-manrope font-bold text-sm shadow-md transition-all inline-flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span>+ Start Attendance</span>
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Section 2: Quick Actions (3 Visual Cards) */}
        <section className="space-y-4">
          <h2 className="font-manrope font-bold text-lg text-rq-navy flex items-center gap-2">
            <span className="material-symbols-outlined text-rq-orange">bolt</span>
            <span>Quick Actions</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Start Attendance */}
            <div
              onClick={() => setShowStartModal(true)}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-orange-200 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-rq-orange flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">play_circle</span>
                </div>
                <span className="material-symbols-outlined text-slate-300 group-hover:text-rq-orange group-hover:translate-x-1 transition-all">
                  arrow_forward
                </span>
              </div>
              <div>
                <h3 className="font-manrope font-extrabold text-base text-rq-navy">
                  Start Attendance
                </h3>
                <p className="text-slate-500 text-xs mt-1">
                  Generate a rolling QR code with campus geofencing for your live class.
                </p>
              </div>
            </div>

            {/* Card 2: Create Template */}
            <div
              onClick={() => handleNavClick('templates')}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-orange-200 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">post_add</span>
                </div>
                <span className="material-symbols-outlined text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all">
                  arrow_forward
                </span>
              </div>
              <div>
                <h3 className="font-manrope font-extrabold text-base text-rq-navy">
                  Create Template
                </h3>
                <p className="text-slate-500 text-xs mt-1">
                  Build custom attendance form presets with unique Roll Number fields.
                </p>
              </div>
            </div>

            {/* Card 3: View History */}
            <div
              onClick={() => {
                const el = document.getElementById('recent-history');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-orange-200 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">history</span>
                </div>
                <span className="material-symbols-outlined text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all">
                  arrow_forward
                </span>
              </div>
              <div>
                <h3 className="font-manrope font-extrabold text-base text-rq-navy">
                  View History
                </h3>
                <p className="text-slate-500 text-xs mt-1">
                  Inspect past class sessions and export attendance logs directly to Excel.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Recent Attendance Activity */}
        <section id="recent-history" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="font-manrope font-bold text-lg text-rq-navy flex items-center gap-2">
              <span className="material-symbols-outlined text-rq-orange">history_edu</span>
              <span>Recent Attendance Activity</span>
            </h2>

            {pastSessions && pastSessions.length > 0 && (
              <div className="relative max-w-xs w-full">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Filter sessions by class..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:border-rq-orange"
                />
              </div>
            )}
          </div>

          {filteredSessions && filteredSessions.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
              {filteredSessions.map((sess) => (
                <div
                  key={sess.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-rq-navy flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">table_view</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-manrope font-bold text-base text-rq-navy">
                          {sess.class_id}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            sess.is_active
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {sess.is_active ? 'LIVE' : 'ENDED'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                        <span>Session #{sess.id}</span>
                        <span>•</span>
                        <span>Geofence: {sess.radius_meters}m</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => onDownloadExcel?.(sess.id, sess.class_id)}
                      className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px] text-emerald-700">download</span>
                      <span>Download Excel</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Rich Illustrated Empty State for Recent Sessions */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">folder_off</span>
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="font-manrope font-extrabold text-lg text-rq-navy">No attendance sessions yet.</h3>
                <p className="text-slate-500 text-sm">
                  Start your first session to see attendance logs and exportable Excel reports here.
                </p>
              </div>
              <div>
                <button
                  onClick={() => setShowStartModal(true)}
                  className="px-6 py-2.5 rounded-xl bg-rq-orange hover:bg-orange-600 text-white font-manrope font-bold text-sm shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span>Start Attendance</span>
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
