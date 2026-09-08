import React, { useState } from 'react';

export default function TeacherDashboard({
  teacherName = "Prof. Alan Davis",
  department = "Engineering Dept",
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
  onDownloadExcel,
  onLogout
}) {
  const [activeNavTab, setActiveNavTab] = useState('dashboard');
  const [showStartModal, setShowStartModal] = useState(false);

  const handleNavClick = (tab) => {
    setActiveNavTab(tab);
    if (onNavigateTab) onNavigateTab(tab);
  };

  return (
    <div className="bg-background font-body-md text-on-surface antialiased selection:bg-secondary-container selection:text-on-secondary-container min-h-screen flex flex-col">
      {/* Top Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(33,51,66,0.06)]">
        <div className="h-16 w-full px-gutter-desktop flex items-center justify-between gap-space-lg">
          <div className="flex items-center gap-space-md min-w-0">
            <div className="flex items-center gap-space-sm cursor-pointer" onClick={() => handleNavClick('dashboard')}>
              <img
                alt="RollQR Brand logo"
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
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`px-space-md py-space-xs font-label-lg text-label-lg transition-colors rounded-lg cursor-pointer ${
                activeNavTab === 'dashboard'
                  ? 'bg-secondary-container text-on-secondary-container font-label-lg'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => handleNavClick('live-session')}
              className={`px-space-md py-space-xs font-label-lg text-label-lg transition-colors rounded-lg cursor-pointer ${
                activeNavTab === 'live-session'
                  ? 'bg-secondary-container text-on-secondary-container font-label-lg'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              Live Session
            </button>
            <button
              onClick={() => handleNavClick('templates')}
              className={`px-space-md py-space-xs font-label-lg text-label-lg transition-colors rounded-lg cursor-pointer ${
                activeNavTab === 'templates'
                  ? 'bg-secondary-container text-on-secondary-container font-label-lg'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              Templates
            </button>
            <button
              onClick={() => handleNavClick('history')}
              className={`px-space-md py-space-xs font-label-lg text-label-lg transition-colors rounded-lg cursor-pointer ${
                activeNavTab === 'history'
                  ? 'bg-secondary-container text-on-secondary-container font-label-lg'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              History
            </button>
          </nav>

          <div className="flex items-center gap-space-md shrink-0">
            <button className="relative p-space-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors focus:outline-none cursor-pointer">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary ring-2 ring-surface"></span>
            </button>

            <div className="flex items-center gap-space-sm pl-space-xs">
              <div className="hidden sm:flex flex-col text-right leading-tight">
                <span className="font-label-md text-label-md text-primary">{teacherName}</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">{department}</span>
              </div>
              <button
                onClick={onLogout}
                title="Logout"
                className="w-8 h-8 rounded-full bg-secondary-container text-primary flex items-center justify-center font-bold hover:bg-error-container hover:text-error transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar (Desktop) */}
      <aside className="fixed left-0 top-16 bottom-0 w-64 bg-surface-container-lowest shadow-[0_1px_8px_rgba(33,51,66,0.04)] z-40 hidden md:flex flex-col justify-between p-space-md">
        <div className="flex flex-col gap-space-md">
          <div className="px-space-sm pt-space-xs">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Academic Hub</span>
          </div>
          <nav className="flex flex-col gap-space-2xs">
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-lg font-label-md text-label-md transition-colors w-full text-left cursor-pointer ${
                activeNavTab === 'dashboard'
                  ? 'bg-secondary-container text-on-secondary-container font-label-md'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">grid_view</span>
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => handleNavClick('live-session')}
              className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-lg font-label-md text-label-md transition-colors w-full text-left cursor-pointer ${
                activeNavTab === 'live-session'
                  ? 'bg-secondary-container text-on-secondary-container font-label-md'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
              <span>Live Session</span>
            </button>
            <button
              onClick={() => handleNavClick('templates')}
              className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-lg font-label-md text-label-md transition-colors w-full text-left cursor-pointer ${
                activeNavTab === 'templates'
                  ? 'bg-secondary-container text-on-secondary-container font-label-md'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">dataset</span>
              <span>Templates</span>
            </button>
            <button
              onClick={() => handleNavClick('history')}
              className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-lg font-label-md text-label-md transition-colors w-full text-left cursor-pointer ${
                activeNavTab === 'history'
                  ? 'bg-secondary-container text-on-secondary-container font-label-md'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">history</span>
              <span>History &amp; Logs</span>
            </button>
          </nav>
        </div>

        <div className="flex flex-col gap-space-2xs border-t border-surface-container pt-space-md">
          <div className="bg-surface-container-low rounded-xl p-space-sm flex items-center gap-space-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-primary">Dynamic Reticle</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Crypto Refresh: 5s</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content View Container */}
      <div className="md:pl-64 flex-1">
        <main className="w-full min-h-screen pt-16 bg-background px-gutter-mobile md:px-gutter-desktop py-space-lg">
          <div className="flex flex-col w-full space-y-space-xl">
            {/* Top Context Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
              <div>
                <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                  <span>Semester 2025</span>
                  <span>•</span>
                  <span className="text-secondary font-semibold">Live Operational Command</span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight mt-space-2xs">
                  Faculty Attendance Console
                </h1>
              </div>

              {/* Quick Actions Bar */}
              <div className="flex items-center gap-space-sm bg-surface-container-lowest p-space-xs rounded-xl shadow-sm flex-wrap">
                <button
                  onClick={() => setShowStartModal(!showStartModal)}
                  className="flex items-center gap-space-xs px-space-md py-space-xs rounded-lg bg-secondary-container text-on-secondary-container hover:bg-surface-container-high transition-all font-label-md text-label-md cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                  <span>Start Instant Session</span>
                </button>
                <button
                  onClick={() => handleNavClick('templates')}
                  className="flex items-center gap-space-xs px-space-md py-space-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all font-label-md text-label-md cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">folder_copy</span>
                  <span>Manage Templates</span>
                </button>
                <button
                  onClick={() => handleNavClick('history')}
                  className="flex items-center gap-space-xs px-space-md py-space-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all font-label-md text-label-md cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">file_download</span>
                  <span>Export Reports</span>
                </button>
              </div>
            </div>

            {/* Quick Start Session Modal / Collapsible Form */}
            {showStartModal && (
              <div className="bg-surface-container-lowest rounded-xl shadow-md p-space-lg border border-secondary-container animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-headline-md text-headline-md text-primary">Start New Attendance Session</h3>
                  <button onClick={() => setShowStartModal(false)} className="text-on-surface-variant hover:text-primary">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); onStartSession?.(e); setShowStartModal(false); }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">Class ID / Name</label>
                      <input
                        type="text"
                        value={classId}
                        onChange={(e) => setClassId?.(e.target.value)}
                        placeholder="e.g. CS301"
                        className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">Geofence Radius (Meters)</label>
                      <input
                        type="number"
                        value={radiusMeters}
                        onChange={(e) => setRadiusMeters?.(e.target.value)}
                        className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">Form Template</label>
                      <select
                        value={selectedTemplateId}
                        onChange={(e) => setSelectedTemplateId?.(e.target.value)}
                        className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg"
                      >
                        <option value="">-- Standard Default Form --</option>
                        {templates.map((tmpl) => (
                          <option key={tmpl.id} value={tmpl.id}>{tmpl.template_name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={onGetGPSLocation}
                      className={`px-4 py-2 rounded-lg font-label-md flex items-center gap-2 cursor-pointer ${
                        location ? 'bg-emerald-600 text-white' : 'bg-secondary-container text-on-secondary-container'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">location_on</span>
                      <span>{locLoading ? 'Capturing GPS...' : location ? `✅ Location Set (${location.lat.toFixed(4)}, ${location.long.toFixed(4)})` : '📍 Capture GPS Center'}</span>
                    </button>

                    <button
                      type="submit"
                      disabled={!location}
                      className="px-6 py-2 bg-primary text-on-primary rounded-lg font-headline-sm hover:bg-primary-container disabled:opacity-50 cursor-pointer ml-auto"
                    >
                      Launch Live Broadcast
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Main Section: Live Active Session Card & Saved Templates Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-stretch">
              {/* 1) Live Active Session Card */}
              <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl shadow-md p-space-lg flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -top-16 -right-16 w-56 h-56 bg-secondary-container/40 rounded-full blur-3xl pointer-events-none"></div>
                <div>
                  <div className="flex items-center justify-between gap-space-sm mb-space-md">
                    <div className="flex items-center gap-space-xs">
                      <span className="relative flex h-3 w-3">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${activeSession ? 'bg-[#137333]' : 'bg-amber-500'} opacity-75`}></span>
                        <span className={`relative inline-flex rounded-full h-3 w-3 ${activeSession ? 'bg-[#137333]' : 'bg-amber-500'}`}></span>
                      </span>
                      <span className={`font-label-sm text-label-sm uppercase tracking-wider ${activeSession ? 'text-[#137333] bg-[#E6F6ED]' : 'text-amber-800 bg-amber-100'} px-space-xs py-space-2xs rounded-full font-semibold`}>
                        {activeSession ? 'Live Ongoing Roll Call' : 'No Active Session'}
                      </span>
                    </div>
                    {activeSession && (
                      <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-space-sm py-space-2xs rounded-lg">
                        Session #{activeSession.session_id}
                      </span>
                    )}
                  </div>

                  <div className="mb-space-lg">
                    <div className="font-label-md text-label-md text-secondary font-semibold">Lecture Series • Hall B</div>
                    <h2 className="font-headline-md text-headline-md text-primary tracking-tight mt-space-2xs">
                      {activeSession ? activeSession.class_id : 'CS301 Data Structures & Algorithms'}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm mb-space-lg">
                    <div className="bg-surface-container-low p-space-sm rounded-lg">
                      <div className="flex items-center gap-space-2xs text-on-surface-variant mb-space-2xs">
                        <span className="material-symbols-outlined text-[16px] text-secondary">schedule</span>
                        <span className="font-label-sm text-label-sm">Session Status</span>
                      </div>
                      <div className="font-headline-sm text-headline-sm text-primary">
                        {activeSession ? 'Active' : 'Standby'}
                      </div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                        {activeSession ? 'Broadcasting live' : 'Ready to start'}
                      </div>
                    </div>

                    <div className="bg-surface-container-low p-space-sm rounded-lg">
                      <div className="flex items-center gap-space-2xs text-on-surface-variant mb-space-2xs">
                        <span className="material-symbols-outlined text-[16px] text-secondary">fmd_good</span>
                        <span className="font-label-sm text-label-sm">Geofence Radius</span>
                      </div>
                      <div className="font-headline-sm text-headline-sm text-primary">
                        {activeSession ? `${activeSession.radius_meters}m` : `${radiusMeters}m`}
                      </div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant truncate mt-0.5">
                        {location ? `GPS Verified` : `Auditorium Hall B`}
                      </div>
                    </div>

                    <div className="bg-surface-container-low p-space-sm rounded-lg">
                      <div className="flex items-center gap-space-2xs text-on-surface-variant mb-space-2xs">
                        <span className="material-symbols-outlined text-[16px] text-secondary">fact_check</span>
                        <span className="font-label-sm text-label-sm">Form Preset</span>
                      </div>
                      <div className="font-headline-sm text-headline-sm text-primary truncate">
                        {selectedTemplateId ? templates.find(t => t.id == selectedTemplateId)?.template_name || 'Standard' : 'Standard'}
                      </div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant truncate mt-0.5">Name, Roll No, Sec</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-md bg-surface-container-lowest">
                  <div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
                    <span className="material-symbols-outlined text-[18px] text-secondary">verified_user</span>
                    <span>Dynamic cryptographic reticle active</span>
                  </div>
                  <div className="flex items-center gap-space-sm">
                    {activeSession ? (
                      <>
                        <button
                          onClick={onEndSession}
                          className="px-space-md py-space-xs rounded-lg text-error hover:bg-error-container hover:text-on-error-container transition-colors font-label-md text-label-md cursor-pointer"
                        >
                          End Session
                        </button>
                        <button
                          onClick={onOpenLiveSession}
                          className="flex items-center gap-space-xs px-space-lg py-space-xs rounded-lg bg-[#88BDF2] hover:bg-[#6A89A7] text-[#384959] hover:text-white font-headline-sm text-headline-sm shadow-sm transition-all transform active:scale-95 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
                          <span>Open Live QR</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setShowStartModal(true)}
                        className="flex items-center gap-space-xs px-space-lg py-space-xs rounded-lg bg-primary hover:bg-primary-container text-on-primary font-headline-sm text-headline-sm shadow-sm transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                        <span>Start Session</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 2) Saved Templates Card */}
              <div className="lg:col-span-5 bg-gradient-to-br from-primary-container to-primary text-on-primary rounded-xl shadow-md p-space-lg flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#BDDDFC_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="absolute -right-12 -bottom-12 w-44 h-44 rounded-full bg-secondary-container/20 blur-2xl pointer-events-none"></div>

                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-space-sm mb-space-md">
                    <div className="flex items-center gap-space-xs">
                      <span className="p-space-xs rounded-lg bg-white/10 text-tertiary-fixed backdrop-blur-sm">
                        <span className="material-symbols-outlined text-[20px]">bookmark_manager</span>
                      </span>
                      <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-primary-container">
                        Attendance Profiles
                      </span>
                    </div>
                    <button
                      onClick={() => handleNavClick('templates')}
                      className="flex items-center gap-space-2xs px-space-sm py-space-xs rounded-lg bg-surface-container-lowest text-primary hover:bg-secondary-container font-label-md text-label-md transition-all shadow-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      <span>+ Create Template</span>
                    </button>
                  </div>

                  <div className="mt-space-sm">
                    <div className="font-display-hero text-display-hero font-extrabold tracking-tight text-white leading-none">
                      {templates.length || 4}
                    </div>
                    <div className="font-headline-sm text-headline-sm text-tertiary-fixed mt-space-2xs">
                      Saved Templates Ready for Deploy
                    </div>
                    <p className="font-body-sm text-body-sm text-on-primary-container mt-space-2xs max-w-sm">
                      Preconfigured geofences, rolling token frequency, and form validations ready for 1-click launch.
                    </p>
                  </div>

                  <div className="mt-space-lg flex flex-wrap gap-space-xs">
                    {templates.length > 0 ? (
                      templates.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => { setSelectedTemplateId?.(t.id); setShowStartModal(true); }}
                          className="flex items-center gap-space-xs bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md px-space-sm py-space-xs rounded-lg cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px] text-tertiary-fixed">school</span>
                          <span className="font-label-md text-label-md text-white">{t.template_name}</span>
                          <span className="text-on-primary-container font-body-sm text-body-sm">• {t.fields?.length || 2} fields</span>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="flex items-center gap-space-xs bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md px-space-sm py-space-xs rounded-lg cursor-pointer">
                          <span className="material-symbols-outlined text-[16px] text-tertiary-fixed">school</span>
                          <span className="font-label-md text-label-md text-white">CS301 Daily</span>
                          <span className="text-on-primary-container font-body-sm text-body-sm">• 45m / Hall B</span>
                        </div>
                        <div className="flex items-center gap-space-xs bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md px-space-sm py-space-xs rounded-lg cursor-pointer">
                          <span className="material-symbols-outlined text-[16px] text-tertiary-fixed">biotech</span>
                          <span className="font-label-md text-label-md text-white">Lab Batch B</span>
                          <span className="text-on-primary-container font-body-sm text-body-sm">• 120m / Lab 3</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="relative z-10 pt-space-md mt-space-md flex items-center justify-between text-on-primary-container font-body-sm text-body-sm">
                  <span>Default profile: CS301 Daily</span>
                  <button
                    onClick={() => handleNavClick('templates')}
                    className="text-secondary-fixed hover:underline flex items-center gap-1 font-label-md text-label-md cursor-pointer"
                  >
                    Configure Presets
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 3) Recent Attendance Activity List */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col space-y-space-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                <div>
                  <h3 className="font-headline-md text-headline-md text-primary tracking-tight">
                    Recent Attendance Activity
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Comprehensive real-time archival audit across past class runs with exportable registries.
                  </p>
                </div>
              </div>

              {/* Data Activity Rows */}
              <div className="flex flex-col space-y-space-xs">
                {pastSessions.length > 0 ? (
                  pastSessions.map((sess) => (
                    <div
                      key={sess.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-space-md rounded-xl bg-surface hover:bg-secondary-container/20 transition-all gap-space-md"
                    >
                      <div className="flex items-center gap-space-md min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0 font-headline-sm text-headline-sm">
                          <span className="material-symbols-outlined text-[22px]">code</span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-space-xs flex-wrap">
                            <span className="font-headline-sm text-headline-sm text-primary font-semibold truncate">{sess.class_id}</span>
                            <span className={`font-label-sm text-label-sm px-space-xs py-space-2xs rounded ${sess.is_active ? 'bg-amber-100 text-amber-800' : 'bg-[#E6F6ED] text-[#137333]'}`}>
                              {sess.is_active ? 'Active' : 'Completed'}
                            </span>
                          </div>
                          <div className="flex items-center gap-space-sm text-on-surface-variant font-body-sm text-body-sm mt-0.5 flex-wrap">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                              Session #{sess.id}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">place</span>
                              Geofence: {sess.radius_meters}m
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-space-lg shrink-0">
                        <div className="flex items-center gap-space-xs">
                          <button
                            onClick={() => onDownloadExcel?.(sess.id, sess.class_id)}
                            className="flex items-center gap-1 px-space-sm py-space-xs rounded-lg bg-surface-container text-primary hover:bg-secondary-container font-label-sm text-label-sm transition-colors cursor-pointer"
                            title="Download Excel"
                          >
                            <span className="material-symbols-outlined text-[16px] text-emerald-700">file_save</span>
                            <span>Excel</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-space-md rounded-xl bg-surface hover:bg-secondary-container/20 transition-all gap-space-md">
                      <div className="flex items-center gap-space-md min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0 font-headline-sm text-headline-sm">
                          <span className="material-symbols-outlined text-[22px]">code</span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-space-xs flex-wrap">
                            <span className="font-headline-sm text-headline-sm text-primary font-semibold truncate">CS301 Data Structures &amp; Algorithms</span>
                            <span className="font-label-sm text-label-sm px-space-xs py-space-2xs rounded bg-[#E6F6ED] text-[#137333]">Completed</span>
                          </div>
                          <div className="flex items-center gap-space-sm text-on-surface-variant font-body-sm text-body-sm mt-0.5 flex-wrap">
                            <span>May 22, 2025</span>
                            <span>•</span>
                            <span>Duration: 52 mins</span>
                            <span>•</span>
                            <span>Auditorium Hall B</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-space-lg shrink-0">
                        <div className="text-right"><div className="font-headline-sm text-headline-sm text-primary font-bold">58</div><div className="font-body-sm text-body-sm text-on-surface-variant">Checked In</div></div>
                        <div className="flex items-center gap-space-xs">
                          <button className="flex items-center gap-1 px-space-sm py-space-xs rounded-lg bg-surface-container text-primary hover:bg-secondary-container font-label-sm text-label-sm transition-colors cursor-pointer">
                            <span className="material-symbols-outlined text-[16px] text-emerald-700">file_save</span>
                            <span>Excel</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
