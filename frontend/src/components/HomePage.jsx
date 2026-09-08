import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────────
   ANIMATION HELPERS
───────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay } },
});

function InView({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-72px' });
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? 'show' : 'hidden'}
      variants={fadeUp(delay)} className={className}>
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'Home', href: '#' },
  {
    label: 'How it Works', href: '#how-it-works',
    dropdown: [
      { icon: 'qr_code_scanner', title: 'Start Session', desc: 'Open the dashboard and generate QR instantly.' },
      { icon: 'smartphone', title: 'Students Scan', desc: 'Students scan from any phone — no app needed.' },
      { icon: 'table_chart', title: 'Download Attendance', desc: 'Get a clean Excel file when session ends.' },
    ],
  },
  {
    label: 'Features', href: '#features',
    dropdown: [
      { icon: 'qr_code_2', title: 'QR Attendance', desc: 'Fast classroom attendance using rotating QR.' },
      { icon: 'bookmark', title: 'Smart Templates', desc: 'Reuse attendance forms across sessions.' },
      { icon: 'download', title: 'Excel Export', desc: 'Download records in one click.' },
      { icon: 'location_on', title: 'Location Verification', desc: 'Confirm students are physically present.' },
    ],
  },
  { label: 'For Teachers', href: '#teachers' },
  { label: 'For Students', href: '#students' },
];

function NavDropdown({ items }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.18 }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 bg-white border border-rq-gray2 rounded-2xl shadow-xl p-2 z-50"
    >
      {items.map((item) => (
        <a key={item.title} href="#" className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-rq-gray group transition-colors">
          <div className="w-8 h-8 rounded-lg bg-rq-orange-light flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-rq-orange/20 transition-colors">
            <span className="material-symbols-outlined text-[18px] text-rq-orange">{item.icon}</span>
          </div>
          <div>
            <div className="font-manrope text-sm font-semibold text-rq-navy">{item.title}</div>
            <div className="font-sans text-xs text-rq-muted mt-0.5 leading-relaxed">{item.desc}</div>
          </div>
        </a>
      ))}
    </motion.div>
  );
}

function Navbar({ onLogin, onSignup }) {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-rq-gray2' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-rq-navy flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px] text-rq-orange">qr_code_2</span>
          </div>
          <span className="font-manrope text-lg font-bold text-rq-navy tracking-tight">RollQR</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <div
              key={link.label}
              className="relative"
              onMouseEnter={() => setOpenMenu(link.label)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <a
                href={link.href}
                className={`flex items-center gap-1 font-sans text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                  openMenu === link.label
                    ? 'text-rq-orange bg-rq-orange-light'
                    : 'text-rq-navy/80 hover:text-rq-navy hover:bg-rq-gray'
                }`}
              >
                {link.label}
                {link.dropdown && (
                  <span className="material-symbols-outlined text-[14px] opacity-60">expand_more</span>
                )}
              </a>
              <AnimatePresence>
                {link.dropdown && openMenu === link.label && <NavDropdown items={link.dropdown} />}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* CTAs */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={onLogin}
            className="font-sans text-sm font-semibold text-rq-navy/80 hover:text-rq-navy px-4 py-2 rounded-lg hover:bg-rq-gray transition-colors"
          >
            Login
          </button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onSignup}
            className="font-manrope text-sm font-bold px-5 py-2.5 bg-rq-orange text-white rounded-xl shadow-sm hover:bg-rq-orange-mid transition-colors"
          >
            Start Attendance →
          </motion.button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 rounded-lg text-rq-navy hover:bg-rq-gray"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-white border-b border-rq-gray2 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((l) => (
                <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
                  className="font-sans text-sm font-medium text-rq-navy py-2 px-3 rounded-lg hover:bg-rq-gray">
                  {l.label}
                </a>
              ))}
              <div className="flex gap-3 mt-4 pt-4 border-t border-rq-gray2">
                <button onClick={onLogin} className="flex-1 py-2.5 rounded-xl border border-rq-gray2 text-sm font-semibold text-rq-navy">Login</button>
                <button onClick={onSignup} className="flex-1 py-2.5 rounded-xl bg-rq-orange text-white text-sm font-bold">Start Attendance</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* ─────────────────────────────────────────────
   HERO QR CARD VISUAL
───────────────────────────────────────────── */
function QRBlock() {
  // Deterministic QR pattern — static so it doesn't re-render
  const cells = [
    1,1,1,1,1,1,1,0,1,0,1,1,0,0,1,1,1,1,1,1,1,
    1,0,0,0,0,0,1,0,0,1,0,0,1,0,1,0,0,0,0,0,1,
    1,0,1,1,1,0,1,0,1,0,0,1,0,0,1,0,1,1,1,0,1,
    1,0,1,1,1,0,1,0,0,0,1,0,0,1,1,0,1,1,1,0,1,
    1,0,1,1,1,0,1,0,1,1,0,0,1,0,1,0,1,1,1,0,1,
    1,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,1,
    1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,
    0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,
    1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,0,1,0,1,1,0,
    0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,1,0,1,0,0,1,
    1,0,0,1,0,0,1,1,0,1,0,0,1,0,0,1,0,1,1,0,0,
    0,1,1,0,1,0,0,0,1,0,1,1,0,1,1,0,1,0,0,1,1,
    1,0,1,1,0,1,1,1,0,0,1,0,0,0,1,1,0,1,0,0,1,
    0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,1,0,1,1,0,
    1,1,1,1,1,1,1,0,0,0,1,0,0,1,1,0,1,0,0,1,1,
    1,0,0,0,0,0,1,0,1,1,0,1,1,0,0,1,0,1,0,0,1,
    1,0,1,1,1,0,1,0,0,0,1,0,0,0,1,0,1,0,1,1,0,
    1,0,1,1,1,0,1,1,1,0,0,1,0,1,0,1,0,1,0,0,1,
    1,0,1,1,1,0,1,0,0,1,1,0,1,0,1,0,1,0,0,1,0,
    1,0,0,0,0,0,1,0,1,0,0,1,0,0,0,1,0,1,1,0,1,
    1,1,1,1,1,1,1,0,0,1,1,0,1,1,1,0,1,0,0,1,0,
  ];

  return (
    <div className="w-full grid gap-[2px]" style={{ gridTemplateColumns: 'repeat(21, 1fr)' }}>
      {cells.map((v, i) => (
        <div key={i} className="aspect-square rounded-[1px]"
          style={{ background: v ? '#101828' : 'transparent' }} />
      ))}
    </div>
  );
}

function HeroVisual() {
  const floatIndicators = [
    { icon: 'check_circle', text: 'Attendance recorded', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', delay: 0 },
    { icon: 'person_add', text: '+1 Student', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', delay: 0.5 },
    { icon: 'location_on', text: 'Location verified', color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200', delay: 1 },
    { icon: 'download', text: 'Excel ready', color: 'text-rq-orange', bg: 'bg-rq-orange-light', border: 'border-orange-200', delay: 1.5 },
  ];

  return (
    <div className="relative w-full max-w-[380px] mx-auto lg:mx-0 lg:ml-auto">
      {/* floating chips */}
      {floatIndicators.map((item, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, i % 2 === 0 ? -6 : 6, 0] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: item.delay }}
          className={`absolute z-20 flex items-center gap-2 px-3 py-2 rounded-xl ${item.bg} border ${item.border} shadow-md text-xs font-semibold ${item.color} font-sans whitespace-nowrap`}
          style={{
            top: i === 0 ? '-12px' : i === 1 ? '22%' : i === 2 ? '62%' : undefined,
            bottom: i === 3 ? '-14px' : undefined,
            left: i === 0 ? '-16px' : i === 3 ? '-8px' : undefined,
            right: i === 1 ? '-20px' : i === 2 ? '-18px' : undefined,
          }}
        >
          <span className={`material-symbols-outlined text-[16px] ${item.color}`}>{item.icon}</span>
          {item.text}
        </motion.div>
      ))}

      {/* main QR card */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 bg-white rounded-3xl shadow-2xl border border-rq-gray2 overflow-hidden"
        style={{ boxShadow: '0 32px 64px -12px rgba(16,24,40,0.18), 0 0 0 1px rgba(16,24,40,0.06)' }}
      >
        {/* card header */}
        <div className="bg-rq-navy px-5 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rq-orange animate-pulse" />
              <span className="font-manrope text-xs font-bold text-rq-orange uppercase tracking-widest">Live Attendance</span>
            </div>
            <div className="font-manrope text-white font-bold text-base mt-1">KCCITM</div>
            <div className="font-sans text-rq-gray2/70 text-xs">CSE — 3rd Year</div>
          </div>
          <div className="text-right">
            <div className="font-manrope text-2xl font-extrabold text-white">42</div>
            <div className="font-sans text-rq-gray2/60 text-[11px]">students present</div>
          </div>
        </div>

        {/* QR body */}
        <div className="p-6 bg-white">
          <div className="w-full bg-rq-gray rounded-xl p-4">
            <QRBlock />
          </div>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="material-symbols-outlined text-[18px] text-rq-muted">smartphone</span>
            <span className="font-sans text-xs text-rq-muted font-medium">Scan to mark attendance</span>
          </div>
        </div>

        {/* card footer */}
        <div className="px-5 pb-4">
          <div className="w-full h-1 bg-rq-gray rounded-full overflow-hidden">
            <motion.div
              animate={{ width: ['0%', '68%'] }}
              transition={{ duration: 2.5, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-rq-orange to-rq-orange-mid rounded-full"
            />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="font-sans text-[11px] text-rq-muted">Session progress</span>
            <span className="font-sans text-[11px] font-semibold text-rq-navy">42/62</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   KCCITM MARQUEE STRIP
───────────────────────────────────────────── */
const MARQUEE_ITEMS = [
  { label: 'KCCITM', accent: true },
  { label: 'KCC Institute of Technology & Management', accent: false },
  { label: 'CSE Department', accent: false },
  { label: 'AI & ML', accent: false },
  { label: 'Classroom Attendance', accent: false },
  { label: 'Engineering', accent: false },
  { label: 'Faculty Portal', accent: false },
  { label: 'Smart Campus', accent: false },
];

function KCCITMStrip() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="py-14 bg-rq-gray overflow-hidden border-y border-rq-gray2">
      <InView>
        <p className="font-manrope text-center text-sm font-semibold text-rq-muted uppercase tracking-widest mb-8">
          Built for classrooms at
        </p>
      </InView>
      <div className="relative w-full overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-rq-gray to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-rq-gray to-transparent z-10 pointer-events-none" />
        <motion.div
          className="flex items-center gap-10 w-max"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        >
          {doubled.map((item, i) => (
            <div key={i} className="flex items-center gap-3 shrink-0 group cursor-default px-3">
              {item.accent && (
                <div className="w-8 h-8 rounded-lg bg-rq-red/10 flex items-center justify-center border border-rq-red/20">
                  <span className="material-symbols-outlined text-[16px] text-rq-red">school</span>
                </div>
              )}
              <span
                className={`font-manrope font-bold text-sm tracking-tight transition-colors duration-200 ${
                  item.accent
                    ? 'text-rq-red group-hover:text-rq-red/80'
                    : 'text-rq-navy/50 group-hover:text-rq-navy/80'
                }`}
              >
                {item.label}
              </span>
              <span className="text-rq-gray2 font-light select-none">·</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PROBLEM SECTION
───────────────────────────────────────────── */
const PROBLEMS = [
  {
    icon: 'pending_actions',
    title: 'Manual attendance',
    desc: "Calling names one by one wastes 10+ minutes every class. That's time neither teacher nor student gets back.",
    style: 'bg-white border border-rq-gray2',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
  },
  {
    icon: 'person_off',
    title: 'Proxy attendance',
    desc: 'A student answers "Present" for three friends. No system catches it. Attendance becomes meaningless.',
    style: 'bg-rq-navy text-white',
    iconBg: 'bg-white/10',
    iconColor: 'text-rq-orange',
    light: true,
  },
  {
    icon: 'description',
    title: 'Paper & spreadsheets',
    desc: 'Sheets get lost. Data entry takes hours. Finding who was absent three weeks ago is painful.',
    style: 'bg-rq-orange-light border border-orange-200',
    iconBg: 'bg-rq-orange/10',
    iconColor: 'text-rq-orange',
  },
];

/* ─────────────────────────────────────────────
   HOW IT WORKS
───────────────────────────────────────────── */
const STEPS = [
  {
    num: '01',
    icon: 'dashboard',
    title: 'Teacher starts a session',
    desc: 'Choose a saved template or create your attendance form. The QR is live in seconds.',
    sub: 'Dashboard → Template → Start',
  },
  {
    num: '02',
    icon: 'qr_code_scanner',
    title: 'Students scan',
    desc: 'Students open their phone camera, scan the classroom QR, and fill the short attendance form.',
    sub: 'Phone → QR → Submit',
  },
  {
    num: '03',
    icon: 'file_download',
    title: 'Attendance is ready',
    desc: 'End the session and instantly download a clean, complete Excel attendance sheet.',
    sub: 'End Session → Excel',
  },
];

/* ─────────────────────────────────────────────
   INTERACTIVE FEATURE TABS
───────────────────────────────────────────── */
const FEATURE_TABS = [
  {
    id: 'qr',
    label: 'QR Attendance',
    icon: 'qr_code_2',
    headline: 'One scan. Attendance marked.',
    body: 'Dynamic QR codes that rotate every session. Students scan, fill their details, done. No apps, no logins — just their phone camera.',
    visual: (
      <div className="flex flex-col items-center gap-4 p-8">
        <div className="w-40 h-40 bg-rq-gray rounded-2xl p-4 shadow-inner">
          <div className="w-full h-full grid grid-cols-7 gap-0.5">
            {Array.from({ length: 49 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-[1px]"
                style={{ background: Math.random() > 0.45 ? '#101828' : 'transparent' }} />
            ))}
          </div>
        </div>
        <span className="font-sans text-sm text-rq-muted">Scan to mark attendance</span>
      </div>
    ),
  },
  {
    id: 'templates',
    label: 'Templates',
    icon: 'bookmark',
    headline: 'Save once. Reuse forever.',
    body: 'Build a custom attendance form once — roll number, section, any field you need. Save it as a template and reuse it across all your classes.',
    visual: (
      <div className="p-6 flex flex-col gap-3">
        {['Roll Number *', 'Student Name *', 'Section'].map((field, i) => (
          <div key={i} className="bg-white border border-rq-gray2 rounded-xl px-4 py-3 flex items-center justify-between shadow-sm">
            <span className="font-sans text-sm text-rq-navy font-medium">{field}</span>
            <span className="font-sans text-xs text-rq-muted bg-rq-gray px-2 py-0.5 rounded">Text</span>
          </div>
        ))}
        <button className="w-full mt-1 py-2.5 rounded-xl border-2 border-dashed border-rq-orange/30 text-rq-orange text-sm font-semibold flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[16px]">add</span> Add Field
        </button>
      </div>
    ),
  },
  {
    id: 'location',
    label: 'Location',
    icon: 'location_on',
    headline: 'Verify presence, not just submission.',
    body: 'GPS geofencing ensures students are physically inside the classroom boundary before their attendance is accepted. No fake check-ins.',
    visual: (
      <div className="flex items-center justify-center p-8">
        <div className="relative w-48 h-48">
          <div className="absolute inset-0 rounded-full border-4 border-rq-orange/20 animate-ping" />
          <div className="absolute inset-4 rounded-full border-2 border-rq-orange/40" />
          <div className="absolute inset-8 rounded-full border-2 border-rq-orange/60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-rq-orange shadow-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[20px]">school</span>
            </div>
          </div>
          <div className="absolute top-6 right-4 w-5 h-5 rounded-full bg-emerald-500 shadow" />
          <div className="absolute bottom-8 left-6 w-4 h-4 rounded-full bg-emerald-500 shadow" />
          <div className="absolute top-1/2 right-1 w-4 h-4 rounded-full bg-emerald-400 shadow" />
        </div>
      </div>
    ),
  },
  {
    id: 'excel',
    label: 'Excel Export',
    icon: 'table_chart',
    headline: 'Your records, your format.',
    body: 'End the session and download a perfectly formatted Excel file — with roll numbers, names, status, and timestamps. Ready for any college system.',
    visual: (
      <div className="p-5">
        <div className="rounded-xl overflow-hidden border border-rq-gray2 shadow-sm">
          <div className="bg-rq-navy px-4 py-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-rq-orange">table_chart</span>
            <span className="font-sans text-xs font-semibold text-white">attendance_cse3_2025.xlsx</span>
          </div>
          <table className="w-full text-xs">
            <thead className="bg-rq-gray">
              <tr>{['#', 'Roll No', 'Name', 'Status'].map(h => (
                <th key={h} className="px-3 py-2 text-left font-semibold text-rq-muted">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="bg-white divide-y divide-rq-gray">
              {[['1','2024001','Aarav S.','Present'],['2','2024002','Bhuvi R.','Present'],['3','2024003','Chhavi P.','Absent']].map(r => (
                <tr key={r[0]}>
                  {r.map((c, ci) => (
                    <td key={ci} className={`px-3 py-2 ${ci===3 ? (c==='Present'?'text-emerald-600':'text-red-500') + ' font-semibold' : 'text-rq-navy'}`}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
];

function InteractiveFeatures() {
  const [active, setActive] = useState('qr');
  const tab = FEATURE_TABS.find(t => t.id === active);

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <InView>
          <p className="font-manrope text-sm font-semibold text-rq-orange uppercase tracking-widest mb-3">Features</p>
          <h2 className="font-manrope text-4xl lg:text-5xl font-extrabold text-rq-navy leading-tight mb-4">
            Everything you need.<br />
            <span className="text-rq-orange">Nothing you don't.</span>
          </h2>
          <p className="font-sans text-lg text-rq-muted max-w-xl">
            RollQR is focused on one job — making classroom attendance fast, honest, and effortless.
          </p>
        </InView>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* left: tabs + text */}
          <InView delay={0.1}>
            <div className="flex flex-col gap-4">
              {FEATURE_TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActive(t.id)}
                  className={`flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-200 border ${
                    active === t.id
                      ? 'bg-rq-navy border-rq-navy text-white shadow-lg'
                      : 'bg-white border-rq-gray2 text-rq-navy hover:border-rq-orange/40 hover:bg-rq-orange-light/30'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    active === t.id ? 'bg-rq-orange/20' : 'bg-rq-gray'
                  }`}>
                    <span className={`material-symbols-outlined text-[20px] ${active === t.id ? 'text-rq-orange' : 'text-rq-muted'}`}>{t.icon}</span>
                  </div>
                  <div>
                    <div className={`font-manrope font-bold text-sm ${active === t.id ? 'text-white' : 'text-rq-navy'}`}>{t.label}</div>
                    <AnimatePresence mode="wait">
                      {active === t.id && (
                        <motion.div
                          key={t.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <p className="font-sans text-xs text-white/70 mt-1 leading-relaxed">{t.body}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </button>
              ))}
            </div>
          </InView>

          {/* right: visual */}
          <InView delay={0.2}>
            <div className="bg-rq-gray rounded-3xl border border-rq-gray2 overflow-hidden min-h-[320px] flex flex-col">
              <div className="px-5 py-3 bg-white border-b border-rq-gray2 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <span className="font-sans text-xs text-rq-muted ml-2">{tab?.label}</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="flex-1 flex flex-col justify-center"
                >
                  {tab?.visual}
                </motion.div>
              </AnimatePresence>
            </div>
          </InView>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   TEACHER SECTION
───────────────────────────────────────────── */
function TeacherSection({ onSignup }) {
  return (
    <section id="teachers" className="py-24 bg-rq-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* left visual */}
        <InView>
          <div className="relative bg-white rounded-3xl border border-rq-gray2 shadow-xl p-6"
            style={{ boxShadow: '0 24px 48px -12px rgba(16,24,40,0.1)' }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="font-manrope font-bold text-rq-navy text-base">Start Session</div>
                <div className="font-sans text-xs text-rq-muted">Choose a template or create new</div>
              </div>
              <div className="w-3 h-3 rounded-full bg-rq-orange animate-pulse" />
            </div>
            <div className="flex flex-col gap-3">
              {['CSE 3rd Year — Daily', 'AI & ML Batch B', 'Lab Session Template'].map((tmpl, i) => (
                <div key={i} className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${i === 0 ? 'border-rq-orange bg-rq-orange-light' : 'border-rq-gray2 hover:border-rq-orange/40'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`material-symbols-outlined text-[18px] ${i === 0 ? 'text-rq-orange' : 'text-rq-muted'}`}>bookmark</span>
                    <span className="font-sans text-sm font-medium text-rq-navy">{tmpl}</span>
                  </div>
                  {i === 0 && <span className="font-sans text-xs font-semibold text-rq-orange bg-rq-orange/10 px-2 py-0.5 rounded-lg">Selected</span>}
                </div>
              ))}
            </div>
            <button className="w-full mt-5 py-3 bg-rq-navy text-white font-manrope font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow">
              <span className="material-symbols-outlined text-[18px] text-rq-orange">qr_code_2</span>
              Generate QR Attendance
            </button>
          </div>
        </InView>

        {/* right copy */}
        <InView delay={0.1}>
          <p className="font-manrope text-sm font-semibold text-rq-orange uppercase tracking-widest mb-3">For Teachers</p>
          <h2 className="font-manrope text-4xl font-extrabold text-rq-navy leading-tight mb-5">
            Start attendance<br />
            <span className="text-rq-orange">in seconds.</span>
          </h2>
          <p className="font-sans text-base text-rq-muted leading-relaxed mb-8">
            No setup. No spreadsheets. Open the dashboard, pick your class template, and your QR is live. Your students mark themselves.
          </p>
          <ul className="flex flex-col gap-3 mb-8">
            {['Choose a saved template', 'Generate QR instantly', 'Watch attendance count in real time', 'End session anytime', 'Download Excel in one click'].map(item => (
              <li key={item} className="flex items-center gap-3 font-sans text-sm text-rq-navy font-medium">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[14px] text-emerald-600">check</span>
                </div>
                {item}
              </li>
            ))}
          </ul>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onSignup}
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-rq-orange text-white font-manrope font-bold rounded-xl shadow"
          >
            Start Attendance →
          </motion.button>
        </InView>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   STUDENT SECTION
───────────────────────────────────────────── */
function StudentSection() {
  const steps = ['Scan QR Code', 'Enter your details', 'Attendance marked ✓'];
  return (
    <section id="students" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* left copy */}
        <InView>
          <p className="font-manrope text-sm font-semibold text-rq-orange uppercase tracking-widest mb-3">For Students</p>
          <h2 className="font-manrope text-4xl font-extrabold text-rq-navy leading-tight mb-5">
            Scan. Fill. Done.<br />
            <span className="text-rq-orange">That's literally it.</span>
          </h2>
          <p className="font-sans text-base text-rq-muted leading-relaxed mb-10">
            No app download. No account needed. Point your phone at the classroom QR, enter your roll number, and you're marked present.
          </p>
          <div className="flex flex-col gap-4">
            {steps.map((step, i) => (
              <InView key={step} delay={i * 0.1}>
                <div className="flex items-center gap-4">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-manrope font-extrabold text-sm ${
                    i === steps.length - 1 ? 'bg-emerald-500 text-white' : 'bg-rq-navy text-rq-orange'
                  }`}>
                    {i === steps.length - 1 ? '✓' : i + 1}
                  </div>
                  <div className="flex-1 h-px bg-rq-gray2" style={{ display: 'none' }} />
                  <span className="font-sans text-sm font-medium text-rq-navy">{step}</span>
                </div>
              </InView>
            ))}
          </div>
        </InView>

        {/* right: mock mobile form */}
        <InView delay={0.15}>
          <div className="flex justify-center lg:justify-end">
            <div className="w-72 bg-white rounded-3xl border border-rq-gray2 shadow-2xl overflow-hidden"
              style={{ boxShadow: '0 32px 64px -12px rgba(16,24,40,0.15)' }}>
              {/* status bar mock */}
              <div className="bg-rq-navy px-5 py-3 flex items-center justify-between">
                <span className="font-sans text-[11px] text-white/60">9:41 AM</span>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-white/60">signal_cellular_alt</span>
                  <span className="material-symbols-outlined text-[14px] text-white/60">battery_4_bar</span>
                </div>
              </div>
              <div className="p-5 bg-rq-cream">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-7 h-7 rounded-lg bg-rq-navy flex items-center justify-center">
                    <span className="material-symbols-outlined text-[14px] text-rq-orange">qr_code_2</span>
                  </div>
                  <span className="font-manrope font-bold text-rq-navy text-sm">RollQR</span>
                </div>
                <div className="font-manrope font-bold text-rq-navy text-base mb-1">Mark Attendance</div>
                <div className="font-sans text-xs text-rq-muted mb-5">CSE — 3rd Year · Session #47</div>
                {['Roll Number', 'Full Name'].map((label) => (
                  <div key={label} className="mb-3">
                    <div className="font-sans text-[11px] font-semibold text-rq-navy/70 uppercase tracking-wide mb-1">{label} *</div>
                    <div className="bg-white border border-rq-gray2 rounded-xl px-3 py-2.5 font-sans text-sm text-rq-muted">
                      {label === 'Roll Number' ? '2024001' : 'Aarav Sharma'}
                    </div>
                  </div>
                ))}
                <div className="w-full py-3 bg-rq-orange rounded-xl text-white font-manrope font-bold text-sm text-center mt-4">
                  Submit Attendance →
                </div>
              </div>
            </div>
          </div>
        </InView>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FINAL CTA
───────────────────────────────────────────── */
function FinalCTA({ onSignup, onLogin }) {
  return (
    <section className="py-24 px-6 lg:px-10 bg-rq-navy relative overflow-hidden">
      {/* subtle QR pattern bg */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 0h4v4H0zm6 0h4v4H6zm12 0h4v4h-4zm6 0h4v4h-4zM0 6h4v4H0zm18 0h4v4h-4zM0 12h4v4H0zm6 0h4v4H6zm12 0h4v4h-4zM0 18h4v4H0zm18 0h4v4h-4zM0 24h4v4H0zm6 0h4v4H6zm6 0h4v4h-4zm6 0h4v4h-4z\'/%3E%3C/g%3E%3C/svg%3E")',
        }}
      />
      <div className="absolute top-0 right-0 w-96 h-96 bg-rq-orange/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <InView>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-sans text-xs font-semibold text-white/80 tracking-wider">No setup required</span>
          </div>
          <h2 className="font-manrope text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-5">
            Ready to stop taking<br />
            attendance manually?
          </h2>
          <p className="font-sans text-lg text-white/60 mb-10">
            Create your first attendance session in seconds. No spreadsheets. No calling names. Just a QR.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={onSignup}
              className="inline-flex items-center gap-2 px-8 py-4 bg-rq-orange text-white font-manrope font-bold text-base rounded-xl shadow-lg hover:bg-rq-orange-mid transition-colors"
            >
              Start Attendance →
            </motion.button>
            <button
              onClick={onLogin}
              className="px-8 py-4 bg-white/10 border border-white/20 text-white font-sans font-semibold text-base rounded-xl hover:bg-white/15 transition-colors"
            >
              Login
            </button>
          </div>
        </InView>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-rq-navy border-t border-white/10 py-10 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-rq-orange/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px] text-rq-orange">qr_code_2</span>
            </div>
            <span className="font-manrope font-bold text-white text-base">RollQR</span>
          </div>
          <p className="font-sans text-sm text-white/40 max-w-xs">Simple attendance for modern classrooms.</p>
          <p className="font-sans text-xs text-white/25 mt-2">Built for KCCITM</p>
        </div>
        <nav className="flex flex-wrap gap-6">
          {['Home', 'How it Works', 'Features', 'Login'].map(link => (
            <a key={link} href="#" className="font-sans text-sm text-white/50 hover:text-white transition-colors">{link}</a>
          ))}
        </nav>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════ */
export default function HomePage({ onNavigateLogin, onNavigateSignup }) {
  const goLogin = onNavigateLogin || (() => {});
  const goSignup = onNavigateSignup || (() => {});

  return (
    <div className="w-full min-h-screen bg-white font-sans antialiased text-rq-navy overflow-x-hidden">
      {/* NAVBAR */}
      <Navbar onLogin={goLogin} onSignup={goSignup} />

      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center pt-20 pb-12 px-6 lg:px-10 bg-rq-cream overflow-hidden">
        {/* background texture — diagonal lines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: 'repeating-linear-gradient(-45deg, #101828 0, #101828 1px, transparent 0, transparent 50%)', backgroundSize: '12px 12px' }} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rq-orange/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* left 6 cols */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <motion.div variants={fadeUp(0.05)} initial="hidden" animate="show"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rq-orange/10 border border-rq-orange/20 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-rq-orange animate-pulse" />
              <span className="font-sans text-xs font-bold text-rq-orange uppercase tracking-widest">QR Classroom Attendance</span>
            </motion.div>

            <motion.h1 variants={fadeUp(0.1)} initial="hidden" animate="show"
              className="font-manrope text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.04] tracking-tight text-rq-navy mb-5">
              Attendance,<br />
              <span className="text-rq-orange">made ridiculously simple.</span>
            </motion.h1>

            <motion.p variants={fadeUp(0.2)} initial="hidden" animate="show"
              className="font-sans text-lg text-rq-muted leading-relaxed max-w-lg mb-8">
              Create a QR. Let your class scan it. Get attendance in seconds — no apps, no paper, no calling names.
            </motion.p>

            <motion.div variants={fadeUp(0.28)} initial="hidden" animate="show"
              className="flex flex-wrap gap-4 mb-10">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={goSignup}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-rq-orange text-white font-manrope font-bold text-base rounded-xl shadow-md hover:bg-rq-orange-mid transition-colors"
              >
                Start Attendance →
              </motion.button>
              <button onClick={goLogin}
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-rq-gray2 text-rq-navy font-sans font-semibold text-base rounded-xl hover:bg-white transition-colors">
                <span className="material-symbols-outlined text-[18px]">play_circle</span>
                See how it works
              </button>
            </motion.div>

            <motion.div variants={fadeUp(0.36)} initial="hidden" animate="show"
              className="flex flex-wrap gap-5 text-sm">
              {['No app download needed', 'Works on any phone', 'One dashboard for all classes'].map(t => (
                <span key={t} className="flex items-center gap-1.5 text-rq-muted font-sans">
                  <span className="material-symbols-outlined text-[15px] text-emerald-500">check_circle</span>
                  {t}
                </span>
              ))}
            </motion.div>
          </div>

          {/* right 6 cols */}
          <motion.div variants={fadeUp(0.15)} initial="hidden" animate="show"
            className="lg:col-span-6 flex justify-center lg:justify-end">
            <HeroVisual />
          </motion.div>
        </div>
      </section>

      {/* KCCITM STRIP */}
      <KCCITMStrip />

      {/* PROBLEM SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <InView>
            <p className="font-manrope text-sm font-semibold text-rq-orange uppercase tracking-widest mb-3 text-center">The Problem</p>
            <h2 className="font-manrope text-4xl lg:text-5xl font-extrabold text-rq-navy text-center leading-tight mb-14">
              Attendance shouldn't take 10 minutes.
            </h2>
          </InView>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROBLEMS.map((p, i) => {
              const ref = useRef(null);
              const inView = useInView(ref, { once: true, margin: '-60px' });
              return (
                <motion.div
                  key={p.title}
                  ref={ref}
                  initial={{ opacity: 0, y: 28 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className={`rounded-2xl p-7 flex flex-col gap-5 ${p.style}`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${p.iconBg}`}>
                    <span className={`material-symbols-outlined text-[24px] ${p.iconColor}`}>{p.icon}</span>
                  </div>
                  <div>
                    <h3 className={`font-manrope text-lg font-bold mb-2 ${p.light ? 'text-white' : 'text-rq-navy'}`}>{p.title}</h3>
                    <p className={`font-sans text-sm leading-relaxed ${p.light ? 'text-white/60' : 'text-rq-muted'}`}>{p.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-rq-gray">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <InView className="text-center mb-16">
            <p className="font-manrope text-sm font-semibold text-rq-orange uppercase tracking-widest mb-3">Simple by Design</p>
            <h2 className="font-manrope text-4xl lg:text-5xl font-extrabold text-rq-navy leading-tight">
              Three steps. That's it.
            </h2>
          </InView>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* connector */}
            <div className="hidden md:block absolute top-16 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: 'easeInOut', delay: 0.3 }}
                style={{ transformOrigin: 'left' }}
                className="h-full bg-gradient-to-r from-rq-orange/40 via-rq-orange to-rq-orange/40"
              />
            </div>

            {STEPS.map((step, i) => {
              const ref = useRef(null);
              const inView = useInView(ref, { once: true, margin: '-50px' });
              return (
                <motion.div
                  key={step.num}
                  ref={ref}
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: i * 0.15 }}
                  className="flex flex-col items-center text-center gap-5"
                >
                  <div className="relative">
                    <div className="w-32 h-32 rounded-2xl bg-white border border-rq-gray2 shadow-md flex flex-col items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-[40px] text-rq-navy">{step.icon}</span>
                    </div>
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-rq-orange text-white font-manrope font-extrabold text-sm flex items-center justify-center shadow">
                      {i + 1}
                    </div>
                  </div>
                  <div className="max-w-xs">
                    <div className="font-sans text-xs font-bold text-rq-orange tracking-widest uppercase mb-1">Step {step.num}</div>
                    <h3 className="font-manrope text-lg font-bold text-rq-navy mb-2">{step.title}</h3>
                    <p className="font-sans text-sm text-rq-muted leading-relaxed">{step.desc}</p>
                    <div className="mt-3 inline-block px-3 py-1 bg-rq-orange-light rounded-lg font-sans text-xs text-rq-orange font-semibold">
                      {step.sub}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INTERACTIVE FEATURES */}
      <InteractiveFeatures />

      {/* TEACHER */}
      <TeacherSection onSignup={goSignup} />

      {/* STUDENT */}
      <StudentSection />

      {/* FINAL CTA */}
      <FinalCTA onSignup={goSignup} onLogin={goLogin} />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
