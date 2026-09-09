import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────────
   DYNAMIC TYPING GREETING COMPONENT
───────────────────────────────────────────── */
function TypingGreeting({ teacherName }) {
  const fullText = `Hello, ${teacherName}`;
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeout;
    if (isTyping) {
      if (displayedText.length < fullText.length) {
        timeout = setTimeout(() => {
          setDisplayedText(fullText.slice(0, displayedText.length + 1));
        }, 75);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, 3200);
      }
    } else {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, displayedText.length - 1));
        }, 35);
      } else {
        setIsTyping(true);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayedText, isTyping, fullText]);

  return (
    <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-rq-navy dark:text-white tracking-tight leading-tight min-h-[52px]">
      <span>{displayedText}</span>
      <span className="inline-block w-[3px] h-[32px] sm:h-[42px] bg-rq-orange ml-1.5 align-middle animate-pulse"></span>
    </h1>
  );
}

/* ─────────────────────────────────────────────
   NAVBAR COMPONENT (Smooth Section Navigation)
───────────────────────────────────────────── */
function FloatingNavbar({
  token,
  teacherName,
  teacherPicture,
  onNavigateLogin,
  onNavigateDashboard,
  onLogout,
  theme,
  onToggleTheme
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    setMobileOpen(false);
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 pointer-events-none px-4 sm:px-6 lg:px-8 pt-3 md:pt-4 max-w-7xl mx-auto">
      <div
        className={`pointer-events-auto rounded-2xl border transition-all duration-300 px-4 sm:px-6 flex items-center justify-between gap-4 ${
          scrolled
            ? 'bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl border-slate-300 dark:border-slate-800 shadow-md py-2.5'
            : 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-slate-200/90 dark:border-slate-800/90 shadow-md dark:shadow-black/20 py-3.5'
        }`}
      >
        {/* Brand Logo */}
        <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-rq-navy dark:bg-slate-800 flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform border border-slate-700/50">
            <span className="text-rq-orange">R</span>Q
          </div>
          <span className="font-display font-extrabold text-xl text-rq-navy dark:text-white tracking-tight">
            Roll<span className="text-rq-orange">QR</span>
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-rq-orange dark:hover:text-rq-orange transition-colors">
            Home
          </a>
          <a href="#why-rollqr" onClick={(e) => handleSmoothScroll(e, 'why-rollqr')} className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-rq-orange dark:hover:text-rq-orange transition-colors">
            Why RollQR?
          </a>
          <a href="#where-it-works" onClick={(e) => handleSmoothScroll(e, 'where-it-works')} className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-rq-orange dark:hover:text-rq-orange transition-colors">
            Learning Spaces
          </a>
          <a href="#how-it-works" onClick={(e) => handleSmoothScroll(e, 'how-it-works')} className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-rq-orange dark:hover:text-rq-orange transition-colors">
            How It Works
          </a>
          <a href="#contact-us" onClick={(e) => handleSmoothScroll(e, 'contact-us')} className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-rq-orange dark:hover:text-rq-orange transition-colors">
            Contact
          </a>
        </nav>

        {/* Right Action Area */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {token ? (
            /* Logged-In Teacher Controls */
            <div className="flex items-center gap-3">
              <button
                onClick={onNavigateDashboard}
                className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-rq-navy dark:text-slate-100 text-xs font-bold transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">dashboard</span>
                <span>Dashboard</span>
              </button>

              <div className="flex items-center gap-2.5 border-l border-slate-200 dark:border-slate-800 pl-3">
                <div className="w-8 h-8 rounded-full bg-rq-navy dark:bg-slate-800 text-white font-bold text-xs flex items-center justify-center shadow-xs ring-2 ring-orange-400/30 overflow-hidden">
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
                <span className="hidden lg:inline text-xs font-bold text-rq-navy dark:text-slate-100 capitalize">
                  {teacherName}
                </span>
                <button
                  onClick={onLogout}
                  title="Logout"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
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
                className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-rq-navy dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={onNavigateLogin}
                className="px-4 py-2 rounded-xl bg-rq-orange hover:bg-orange-600 text-white font-display font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                <span>Start Attendance</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1.5 text-slate-600 dark:text-slate-300 hover:text-rq-navy dark:hover:text-white"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="pointer-events-auto md:hidden mt-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-4 space-y-3"
          >
            <a href="#" onClick={(e) => { e.preventDefault(); setMobileOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
              Home
            </a>
            <a href="#why-rollqr" onClick={(e) => handleSmoothScroll(e, 'why-rollqr')} className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
              Why RollQR?
            </a>
            <a href="#where-it-works" onClick={(e) => handleSmoothScroll(e, 'where-it-works')} className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
              Learning Spaces
            </a>
            <a href="#how-it-works" onClick={(e) => handleSmoothScroll(e, 'how-it-works')} className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
              How It Works
            </a>
            <a href="#contact-us" onClick={(e) => handleSmoothScroll(e, 'contact-us')} className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
              Contact
            </a>
            {token && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                <button
                  onClick={() => { setMobileOpen(false); onNavigateDashboard(); }}
                  className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-rq-navy dark:text-white font-bold text-xs rounded-xl"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => { setMobileOpen(false); onLogout(); }}
                  className="w-full py-2 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold text-xs rounded-xl"
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
   LEARNING SPACES MARQUEE DATA
───────────────────────────────────────────── */
const LEARNING_SPACES = [
  {
    title: 'Modern Classrooms',
    subtitle: 'Daily Lectures',
    description: 'Instant roll calls for regular subjects, daily lectures, and structured classes.',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    badge: 'Core Academic'
  },
  {
    title: 'Seminars & Workshops',
    subtitle: 'Interactive Sessions',
    description: 'Verify attendance for guest lectures, academic workshops, and expert sessions.',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    badge: 'Interactive'
  },
  {
    title: 'Practical & Computer Labs',
    subtitle: 'Batch Testing',
    description: 'Geofenced laboratory attendance for practical experiments and coding sessions.',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    badge: 'Practical'
  },
  {
    title: 'Auditoriums & Halls',
    subtitle: 'Mass Attendance',
    description: 'Rapid attendance verification for large auditorium gatherings and joint classes.',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
    badge: 'Large Scale'
  },
  {
    title: 'Lecture Theaters',
    subtitle: 'University Courses',
    description: 'Tiered seating attendance tracking with rotation security against photo sharing.',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
    badge: 'University'
  },
  {
    title: 'Campus Events',
    subtitle: 'Orientations & Fests',
    description: 'Seamless student check-ins for campus orientations, hackathons, and activities.',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80',
    badge: 'Events'
  }
];

/* ─────────────────────────────────────────────
   RESTORED ORIGINAL 3-STEP HOW IT WORKS DATA & DIAGRAMS (Req #4)
───────────────────────────────────────────── */
const HOW_IT_WORKS_3STEPS = [
  {
    step: 'STEP 01',
    title: 'Teacher creates / selects a template',
    description: 'Faculty configures the subject name, geofence radius, and picks a custom form template or standard roll preset.',
    badge: '01 · Setup',
    diagram: (
      <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 space-y-2.5 shadow-inner">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rq-orange">Class Setup</span>
          <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">Radius: 30m</span>
        </div>
        <div className="space-y-1.5 text-left text-xs">
          <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 font-mono text-[11px] text-slate-200">
            CS301 Data Structures
          </div>
          <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-[11px] text-slate-300 flex items-center justify-between">
            <span>Roll Number, Student Name</span>
            <span className="text-rq-orange text-[10px]">Preset</span>
          </div>
        </div>
      </div>
    )
  },
  {
    step: 'STEP 02',
    title: 'Students scan the QR code',
    description: 'A dynamic rolling QR code displays on screen, refreshing every 30 seconds. Students scan using any smartphone camera.',
    badge: '02 · Live Scan',
    diagram: (
      <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 space-y-2.5 shadow-inner">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Rotating HMAC Token</span>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded font-mono">⏱ 30s</span>
        </div>
        <div className="flex items-center justify-center gap-3 py-1">
          <div className="w-14 h-14 bg-white p-1 rounded-xl shadow-md flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[24px]">qr_code_2</span>
            </div>
          </div>
          <div className="text-left text-[11px] space-y-0.5">
            <div className="text-white font-bold">No App Install</div>
            <div className="text-slate-400">Instant camera scan</div>
            <div className="text-emerald-400 text-[10px] font-semibold">📍 GPS Geofence Check</div>
          </div>
        </div>
      </div>
    )
  },
  {
    step: 'STEP 03',
    title: 'Attendance completed / Excel ready',
    description: '3-layer security checks location, device ID, and unique Roll No. Teacher locks the session and exports the Excel roster.',
    badge: '03 · Export',
    diagram: (
      <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 space-y-2.5 shadow-inner">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Live Roster</span>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">42 Present</span>
        </div>
        <div className="space-y-1.5 text-left text-xs">
          <div className="flex items-center justify-between text-[11px] bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700">
            <span className="font-mono text-slate-300">CS202401 · Rahul S.</span>
            <span className="text-emerald-400 font-bold text-[10px]">PRESENT</span>
          </div>
          <div className="bg-emerald-600 text-white text-[11px] font-bold py-1.5 rounded-lg flex items-center justify-center gap-1.5 shadow-sm">
            <span className="material-symbols-outlined text-[14px]">download</span>
            <span>Download Attendance.xlsx</span>
          </div>
        </div>
      </div>
    )
  }
];

/* ─────────────────────────────────────────────
   MAIN HOMEPAGE COMPONENT
───────────────────────────────────────────── */
export default function HomePage({
  token,
  teacherName = "Teacher",
  teacherPicture = null,
  activeSession = null,
  pastSessions = [],
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
  onLogout,
  theme = 'light',
  onToggleTheme
}) {
  const [showStartModal, setShowStartModal] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSuccess, setContactSuccess] = useState(false);

  // Check if session links should be visible
  const hasSessions = Boolean(activeSession || (pastSessions && pastSessions.length > 0));

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSuccess(true);
    setContactForm({ name: '', email: '', message: '' });
    setTimeout(() => setContactSuccess(false), 5000);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 antialiased min-h-screen flex flex-col selection:bg-orange-100 dark:selection:bg-orange-950 selection:text-orange-900 dark:selection:text-orange-200 transition-colors duration-300">
      {/* Floating Navbar */}
      <FloatingNavbar
        token={token}
        teacherName={teacherName}
        teacherPicture={teacherPicture}
        onNavigateLogin={onNavigateLogin}
        onNavigateDashboard={onNavigateDashboard}
        onLogout={onLogout}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      {/* Start Attendance Setup Modal */}
      <AnimatePresence>
        {showStartModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-rq-navy/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowStartModal(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-rq-orange flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[22px]">qr_code_2</span>
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-xl text-rq-navy dark:text-white">Start Attendance</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">Set up your class and generate a rotating QR code.</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowStartModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Class / Subject Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={classId}
                    onChange={(e) => setClassId?.(e.target.value)}
                    placeholder="e.g. CS301 Data Structures & Algorithms"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-rq-orange focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-950 outline-none text-slate-800 dark:text-slate-100 text-sm font-medium"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Attendance Form Preset
                  </label>
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => setSelectedTemplateId?.(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:border-rq-orange focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-950 outline-none text-slate-800 dark:text-slate-100 text-sm font-medium bg-white dark:bg-slate-800"
                  >
                    <option value="">Standard Form (Roll Number, Student Name)</option>
                    {templates.map((tmpl) => (
                      <option key={tmpl.id} value={tmpl.id}>
                        {tmpl.template_name} ({tmpl.fields?.length || 2} fields)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Geofence Boundary Radius (Meters)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="5"
                      max="300"
                      value={radiusMeters}
                      onChange={(e) => setRadiusMeters?.(e.target.value)}
                      className="w-32 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-rq-orange focus:ring-2 focus:ring-orange-100 outline-none text-slate-800 dark:text-slate-100 text-sm font-medium"
                      required
                    />
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Allowed student radius from instructor GPS center
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onGetGPSLocation}
                    className={`w-full py-3 px-4 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                      location
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
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

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowStartModal(false)}
                    className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!location}
                    className="px-6 py-2.5 rounded-xl bg-rq-navy dark:bg-rq-orange hover:bg-slate-800 dark:hover:bg-orange-600 text-white font-display font-bold text-sm shadow-md disabled:opacity-40 transition-all cursor-pointer"
                  >
                    Start Session &amp; Open QR
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative overflow-hidden">
        {/* Ambient Gradient */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-orange-100/60 dark:from-orange-950/20 to-blue-100/40 dark:to-slate-900/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {token ? (
              /* Personalized Teacher Hero Greeting */
              <div className="space-y-4">
                <TypingGreeting teacherName={teacherName} />
                <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  Attendance, without the hassle. Start a live QR session or manage your workspace tools below.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <button
                    onClick={() => setShowStartModal(true)}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-rq-orange hover:bg-orange-600 text-white font-display font-bold text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    <span>Start Attendance</span>
                  </button>
                  <button
                    onClick={onNavigateDashboard}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-rq-navy dark:text-white font-display font-bold text-base border border-slate-200 dark:border-slate-800 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">dashboard</span>
                    <span>Go to Dashboard</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Public Visitor Hero */
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Smart Classroom Attendance</span>
                </div>
                <h1 className="font-display font-extrabold text-4xl sm:text-6xl text-rq-navy dark:text-white tracking-tight leading-[1.1]">
                  Attendance, <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-rq-orange via-orange-500 to-amber-500">
                    without the hassle.
                  </span>
                </h1>
                <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  Fast, fraud-proof classroom attendance powered by dynamic rolling QR codes and GPS geofence verification. Built for modern learning spaces.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <button
                    onClick={onNavigateLogin}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-rq-orange hover:bg-orange-600 text-white font-display font-bold text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span>Start Attendance</span>
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </button>
                  <button
                    onClick={onNavigateLogin}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-rq-navy dark:text-white font-display font-bold text-base border border-slate-200 dark:border-slate-800 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">login</span>
                    <span>Teacher Login</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Hero Right Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 p-6 sm:p-8 shadow-xl dark:shadow-black/40 relative overflow-hidden text-center space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-display font-bold text-xs uppercase tracking-wider text-rq-navy dark:text-slate-200">
                    RollQR Live Verification
                  </span>
                </div>
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Active Security
                </span>
              </div>

              <div className="bg-slate-900 dark:bg-slate-950 text-white rounded-2xl p-6 shadow-inner space-y-4 border border-slate-800 relative overflow-hidden">
                <div className="w-12 h-12 rounded-xl bg-rq-orange/20 text-rq-orange mx-auto flex items-center justify-center">
                  <span className="material-symbols-outlined text-[28px]">qr_code_2</span>
                </div>
                <div className="space-y-1">
                  <div className="font-display font-extrabold text-lg text-white">Scan to mark attendance</div>
                  <p className="text-slate-400 text-xs">Dynamic HMAC Token • Geofence Verified</p>
                </div>
                <div className="pt-2 flex items-center justify-center gap-2 text-xs text-emerald-400 font-semibold">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>Zero Proxy • 1-Click Excel</span>
                </div>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                No app installation required for students. Works on any browser.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why RollQR Section */}
      <section id="why-rollqr" className="py-16 md:py-24 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 text-rq-orange text-xs font-bold uppercase tracking-wider">
              <span>Why RollQR?</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-rq-navy dark:text-white tracking-tight">
              Say goodbye to manual roll calls &amp; proxy attendance.
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base">
              See how RollQR transforms traditional paper registers into instant digital records.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* BEFORE */}
            <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 flex flex-col justify-between shadow-xs">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 font-bold text-xs uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[14px]">history</span>
                  <span>BEFORE — Traditional Registers</span>
                </div>
                <h3 className="font-display font-bold text-xl text-rq-navy dark:text-white">The Classroom Hassle</h3>
              </div>

              <div className="space-y-4 flex-1">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-xs">
                  <div className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">01 — Proxy Attendance</div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Absent students get marked by friends</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">No physical presence verification leading to inaccurate attendance logs.</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-xs">
                  <div className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">02 — Paperwork Burden</div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Maintaining physical attendance registers</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Tedious manual data re-entry into Excel sheets after every lecture.</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-xs">
                  <div className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">03 — Lost Teaching Time</div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Wasting 10–15 minutes per session</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Calling roll names individually consumes valuable class time.</p>
                </div>
              </div>
            </div>

            {/* Upgrade Badge */}
            <div className="lg:col-span-2 flex flex-col items-center justify-center text-center py-4">
              <div className="w-14 h-14 rounded-2xl bg-rq-orange text-white flex items-center justify-center shadow-lg font-bold text-xl">
                <span className="material-symbols-outlined text-[28px]">east</span>
              </div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-rq-navy dark:text-white mt-2">
                The RollQR Upgrade
              </span>
            </div>

            {/* WITH ROLLQR */}
            <div className="lg:col-span-5 bg-rq-navy dark:bg-slate-950 text-white rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 flex flex-col justify-between shadow-xl">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs uppercase tracking-wider border border-emerald-500/30">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  <span>WITH ROLLQR — Modern Way</span>
                </div>
                <h3 className="font-display font-bold text-xl text-white">Automated &amp; Verified</h3>
              </div>

              <div className="space-y-4 flex-1">
                <div className="bg-slate-900 dark:bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <div className="text-xs font-bold text-rq-orange uppercase tracking-wider">01 — Dynamic QR Token</div>
                  <p className="text-sm font-semibold text-white">Rotating HMAC-SHA256 QR code</p>
                  <p className="text-xs text-slate-400">Token changes every 30s. WhatsApp screenshot forwards expire immediately.</p>
                </div>

                <div className="bg-slate-900 dark:bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <div className="text-xs font-bold text-rq-orange uppercase tracking-wider">02 — Geofence Verification</div>
                  <p className="text-sm font-semibold text-white">Haversine GPS radius check</p>
                  <p className="text-xs text-slate-400">Confirms student is physically inside the classroom boundary.</p>
                </div>

                <div className="bg-slate-900 dark:bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <div className="text-xs font-bold text-rq-orange uppercase tracking-wider">03 — Instant Reports</div>
                  <p className="text-sm font-semibold text-white">1-Click Excel export</p>
                  <p className="text-xs text-slate-400">Clean spreadsheet downloaded instantly with timestamped records.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logged-In Teacher Workspace Modules */}
      {token && (
        <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 text-rq-orange text-xs font-bold uppercase tracking-wider">
              <span>Your Workspace</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-rq-navy dark:text-white tracking-tight">
              Select an application module
            </h2>
          </div>

          <div className={`grid grid-cols-1 ${hasSessions ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
            {/* Dashboard */}
            <div
              onClick={onNavigateDashboard}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-xl hover:border-orange-300 dark:hover:border-orange-500/50 transition-all cursor-pointer group flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/50 text-rq-orange flex items-center justify-center font-bold group-hover:scale-110 transition-transform shadow-inner">
                  <span className="material-symbols-outlined text-[30px]">grid_view</span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-extrabold text-xl text-rq-navy dark:text-white">Dashboard</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    View your attendance activity, past history, and quick launch setup.
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-rq-orange font-display font-bold text-sm">
                <span>Open Dashboard</span>
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">east</span>
              </div>
            </div>

            {/* Sessions (Shown ONLY when activeSession or pastSessions exist) */}
            {hasSessions && (
              <div
                onClick={onNavigateSessions}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-xl hover:border-orange-300 dark:hover:border-orange-500/50 transition-all cursor-pointer group flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform shadow-inner">
                    <span className="material-symbols-outlined text-[30px]">qr_code_scanner</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display font-extrabold text-xl text-rq-navy dark:text-white">Active Session</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      Manage ongoing attendance session and display the live rotating QR.
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-blue-600 dark:text-blue-400 font-display font-bold text-sm">
                  <span>Open Session Screen</span>
                  <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">east</span>
                </div>
              </div>
            )}

            {/* Templates */}
            <div
              onClick={onNavigateTemplates}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-xl hover:border-orange-300 dark:hover:border-orange-500/50 transition-all cursor-pointer group flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform shadow-inner">
                  <span className="material-symbols-outlined text-[30px]">folder_special</span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-extrabold text-xl text-rq-navy dark:text-white">Form Templates</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    Create reusable attendance forms for your various classes.
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-display font-bold text-sm">
                <span>Open Templates</span>
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">east</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Built for Learning Spaces — Continuous Visual Marquee Showcase */}
      <section id="where-it-works" className="py-16 md:py-24 bg-slate-100/80 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-center">
          <div className="max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold uppercase tracking-wider">
              <span>Learning Spaces</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-rq-navy dark:text-white tracking-tight">
              Built for Every Learning Space
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base">
              RollQR seamlessly adapts to any physical environment or lecture setup.
            </p>
          </div>

          {/* Marquee Track Container */}
          <div className="relative w-full overflow-hidden pt-4 pb-6">
            <div className="animate-marquee gap-6 flex">
              {[...LEARNING_SPACES, ...LEARNING_SPACES].map((item, idx) => (
                <div
                  key={idx}
                  className="w-[300px] sm:w-[360px] shrink-0 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden text-left flex flex-col group"
                >
                  <div className="h-44 w-full relative overflow-hidden bg-slate-200 dark:bg-slate-800">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3 bg-rq-navy/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-slate-700/50">
                      {item.badge}
                    </div>
                  </div>
                  <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-rq-orange">
                        {item.subtitle}
                      </div>
                      <h3 className="font-display font-extrabold text-xl text-rq-navy dark:text-white">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RESTORED ORIGINAL 3-STEP "HOW ROLLQR WORKS" SECTION (Req #4) */}
      <section id="how-it-works" className="py-16 md:py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 text-rq-orange text-xs font-bold uppercase tracking-wider">
              <span>3 Simple Steps</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-rq-navy dark:text-white tracking-tight">
              How RollQR Works
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base">
              A clean 3-step workflow with visual diagrams designed for instant classroom attendance.
            </p>
          </div>

          {/* 3 Step Visual Diagram Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS_3STEPS.map((stepItem, idx) => (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm hover:shadow-md hover:border-orange-300 dark:hover:border-orange-500/50 transition-all flex flex-col justify-between relative"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-rq-orange/15 text-rq-orange font-display font-extrabold text-xs tracking-wider">
                      {stepItem.step}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      {stepItem.badge}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-xl text-rq-navy dark:text-white leading-snug">
                    {stepItem.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {stepItem.description}
                  </p>
                </div>

                {/* Visual Diagram Element */}
                <div className="pt-2">
                  {stepItem.diagram}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Temporary Contact Us Form */}
      <section id="contact-us" className="py-16 md:py-20 bg-slate-100/70 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 text-rq-orange text-xs font-bold uppercase tracking-wider">
              <span>Get In Touch</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl text-rq-navy dark:text-white tracking-tight">
              Have a Question or Feedback?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
              Send us your inquiry and we'll get back to you shortly.
            </p>
          </div>

          <form onSubmit={handleContactSubmit} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-left">
            {contactSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>Thanks! Your message has been received.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs outline-none focus:border-rq-orange"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Email</label>
                <input
                  type="email"
                  required
                  placeholder="you@institution.edu"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs outline-none focus:border-rq-orange"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Message / Query</label>
              <textarea
                rows={3}
                required
                placeholder="How can we help you?"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs outline-none focus:border-rq-orange"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-rq-navy dark:bg-rq-orange hover:bg-slate-800 dark:hover:bg-orange-600 text-white font-display font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer WITH Integrated Compact Profile/About Cards (Req #1) */}
      <footer className="bg-rq-navy dark:bg-slate-950 text-white py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Integrated Compact About Us Subsection */}
          <div id="about-rollqr" className="border-b border-slate-800 pb-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="font-display font-bold text-xs uppercase tracking-widest text-slate-400">
                About Us — Meet the People Behind RollQR
              </h3>
              <span className="text-xs text-slate-500">Handcrafted for modern learning spaces</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Profile Card 1 */}
              <div className="bg-slate-900/90 dark:bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 text-left shadow-md">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rq-orange to-amber-500 text-white font-display font-extrabold text-lg flex items-center justify-center shrink-0 shadow-md">
                  AP
                </div>
                <div className="space-y-1 overflow-hidden">
                  <h4 className="font-display font-bold text-base text-white">Arjun Purwar</h4>
                  <div className="text-[11px] font-bold text-rq-orange uppercase tracking-wider">Full Stack &amp; Core Architect</div>
                  <p className="text-xs text-slate-400 leading-snug">Designed RollQR's rolling token algorithm, geofence engine &amp; backend architecture.</p>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-rq-orange transition-colors pt-1">
                    <span className="material-symbols-outlined text-[14px]">link</span>
                    <span>LinkedIn Profile</span>
                  </a>
                </div>
              </div>

              {/* Profile Card 2 */}
              <div className="bg-slate-900/90 dark:bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 text-left shadow-md">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rq-navy to-slate-800 text-white font-display font-extrabold text-lg flex items-center justify-center shrink-0 shadow-md border border-slate-700">
                  S
                </div>
                <div className="space-y-1 overflow-hidden">
                  <h4 className="font-display font-bold text-base text-white">Sagar</h4>
                  <div className="text-[11px] font-bold text-rq-orange uppercase tracking-wider">Frontend &amp; Systems Engineer</div>
                  <p className="text-xs text-slate-400 leading-snug">Built RollQR's responsive design system, theme modes, scanning UI &amp; faculty controls.</p>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-rq-orange transition-colors pt-1">
                    <span className="material-symbols-outlined text-[14px]">link</span>
                    <span>LinkedIn Profile</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rq-orange text-white font-bold flex items-center justify-center text-sm">
                RQ
              </div>
              <span className="font-display font-extrabold text-lg tracking-tight">
                Roll<span className="text-rq-orange">QR</span>
              </span>
            </div>

            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} RollQR Attendance Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
