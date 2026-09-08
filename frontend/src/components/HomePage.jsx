import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from 'framer-motion';

/* ─── animation presets ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = (delay = 0) => ({
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1], delay } },
});
const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, delay } },
});

function Section({ children, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      variants={fadeUp}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── scrolling ticker (replaces logo carousel) ─────────── */
const TICKER_ITEMS = [
  { icon: 'qr_code_2', label: 'HMAC QR Rotation' },
  { icon: 'location_on', label: 'GPS Geofencing' },
  { icon: 'fingerprint', label: '3-Layer Fraud Check' },
  { icon: 'table_chart', label: 'Excel Export' },
  { icon: 'lock', label: 'JWT Auth' },
  { icon: 'verified_user', label: 'Device Binding' },
  { icon: 'sync', label: 'Real-Time Telemetry' },
  { icon: 'school', label: 'Campus Ready' },
];

function Ticker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="relative w-full overflow-hidden py-5 bg-[#213342] border-y border-[#88BDF2]/20">
      <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-[#213342] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[#213342] to-transparent z-10 pointer-events-none" />
      <motion.div
        className="flex gap-10 w-max"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
      >
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center gap-2.5 shrink-0 text-[#88BDF2]/80 px-3">
            <span className="material-symbols-outlined text-[20px] text-[#88BDF2]">{item.icon}</span>
            <span className="font-sans text-sm font-semibold tracking-wide whitespace-nowrap">{item.label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── feature cards ─────────────────────────────────────── */
const FEATURES = [
  {
    icon: 'published_with_changes',
    title: 'Rotating QR Security',
    desc: 'Dynamic HMAC-SHA256 tokens regenerate every 15–30s — screenshots expire instantly, making proxy scanning impossible.',
    gradient: 'from-[#88BDF2]/20 to-[#384959]/10',
    accent: '#88BDF2',
  },
  {
    icon: 'location_searching',
    title: 'GPS Geofencing',
    desc: 'Silent device-side geofence confirms every student is physically inside the lecture hall before accepting a check-in.',
    gradient: 'from-[#6A89A7]/20 to-[#384959]/10',
    accent: '#BDDDFC',
  },
  {
    icon: 'table_chart',
    title: 'Instant Excel Reports',
    desc: 'One click exports a clean, gradebook-ready .xlsx with PRESENT / OUT_OF_BOUNDS / DUPLICATE flags for every record.',
    gradient: 'from-[#BDDDFC]/20 to-[#384959]/10',
    accent: '#6A89A7',
  },
];

function FeatureCard({ feature, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      variants={stagger(index * 0.12)}
      whileHover={{ y: -8, scale: 1.025 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className={`relative flex flex-col gap-5 p-7 rounded-2xl border border-[#88BDF2]/20 bg-gradient-to-br ${feature.gradient} backdrop-blur-sm cursor-default overflow-hidden group`}
    >
      {/* glow orb */}
      <div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"
        style={{ background: feature.accent }}
      />
      <div
        className="relative z-10 w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ background: `${feature.accent}22`, border: `1px solid ${feature.accent}44` }}
      >
        <span className="material-symbols-outlined text-[26px]" style={{ color: feature.accent }}>
          {feature.icon}
        </span>
      </div>
      <div className="relative z-10">
        <h3 className="font-headline text-xl font-bold text-white mb-2">{feature.title}</h3>
        <p className="font-sans text-sm text-[#BDDDFC]/70 leading-relaxed">{feature.desc}</p>
      </div>
    </motion.div>
  );
}

/* ─── how it works steps ─────────────────────────────────── */
const STEPS = [
  {
    num: '01',
    icon: 'add_circle',
    title: 'Teacher Starts Session',
    desc: 'One click captures the classroom GPS center and broadcasts a live, rotating QR token to the projector screen.',
  },
  {
    num: '02',
    icon: 'qr_code_scanner',
    title: 'Students Scan & Submit',
    desc: 'Students scan the QR with their phone, GPS is silently verified, and attendance is marked in under 3 seconds.',
  },
  {
    num: '03',
    icon: 'file_download',
    title: 'Download Attendance',
    desc: 'Session ends, attendance downloads as a clean Excel sheet — with fraud flags — ready for your gradebook.',
  },
];

/* ─── stats ─────────────────────────────────────────────── */
const STATS = [
  { value: '99.8%', label: 'Fraud Caught', sub: '3-layer verification' },
  { value: '15s', label: 'QR Rotation Speed', sub: 'HMAC-SHA256 rolling' },
  { value: '< 3s', label: 'Check-in Time', sub: 'per student, avg' },
  { value: '0', label: 'Proxy Passes', sub: 'zero tolerance policy' },
];

/* ─── hero parallax visual ───────────────────────────────── */
function HeroQRVisual() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <motion.div ref={ref} style={{ y }} className="relative w-full max-w-[420px] mx-auto select-none">
      {/* outer glow ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 rounded-3xl border border-[#88BDF2]/20 pointer-events-none"
      />
      {/* card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#213342] to-[#0f1e2b] border border-[#88BDF2]/30 shadow-[0_40px_80px_rgba(0,0,0,0.6)] p-8 flex flex-col items-center gap-6">
        {/* timer chip */}
        <div className="flex items-center gap-2 bg-[#88BDF2]/10 border border-[#88BDF2]/30 rounded-full px-4 py-1.5">
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-[#88BDF2]"
          />
          <span className="font-sans text-xs font-semibold text-[#88BDF2] tracking-wider">
            QR REFRESHES IN 15s
          </span>
        </div>

        {/* mock QR grid */}
        <div className="w-52 h-52 bg-white rounded-2xl p-4 shadow-inner">
          <div className="w-full h-full grid grid-cols-8 gap-0.5">
            {Array.from({ length: 64 }).map((_, i) => {
              const corner =
                (i < 9 && i % 8 < 3) ||
                (i < 9 && i % 8 > 4) ||
                (i >= 16 && i < 24 && i % 8 < 3) ||
                (i >= 16 && i < 24 && i % 8 > 4);
              const filled = corner || Math.random() > 0.5;
              return (
                <div
                  key={i}
                  className="rounded-[1px]"
                  style={{ background: filled ? '#213342' : 'transparent' }}
                />
              );
            })}
          </div>
        </div>

        {/* scan target animation */}
        <motion.div
          animate={{ scaleX: [1, 0.9, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#88BDF2] to-transparent rounded-full"
        />

        {/* security chips */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {['HMAC-SHA256', 'GPS ±2m', 'Device Bound'].map((chip) => (
            <span
              key={chip}
              className="font-sans text-[11px] font-bold px-3 py-1 rounded-full bg-[#384959] text-[#88BDF2] border border-[#88BDF2]/30 tracking-wider"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      {/* floating badge top-left */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-5 -left-6 bg-[#384959] border border-[#88BDF2]/40 rounded-xl px-4 py-2 shadow-xl flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-[18px] text-[#88BDF2]">verified_user</span>
        <div>
          <div className="font-sans text-[11px] font-bold text-[#88BDF2]">3-Layer Verified</div>
          <div className="font-sans text-[10px] text-[#6A89A7]">QR · GPS · Device</div>
        </div>
      </motion.div>

      {/* floating badge bottom-right */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        className="absolute -bottom-5 -right-4 bg-[#384959] border border-[#88BDF2]/40 rounded-xl px-4 py-2 shadow-xl flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-[18px] text-emerald-400">radar</span>
        <div>
          <div className="font-sans text-[11px] font-bold text-emerald-400">Geofence Active</div>
          <div className="font-sans text-[10px] text-[#6A89A7]">Radius 25m • Hall B</div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── animated counter ───────────────────────────────────── */
function Counter({ value, label, sub }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-1 text-center"
    >
      <span className="font-headline text-5xl lg:text-6xl font-extrabold bg-gradient-to-br from-[#88BDF2] to-[#BDDDFC] bg-clip-text text-transparent leading-none">
        {value}
      </span>
      <span className="font-sans text-base font-bold text-white mt-1">{label}</span>
      <span className="font-sans text-xs text-[#6A89A7]">{sub}</span>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  MAIN EXPORT                                              */
/* ══════════════════════════════════════════════════════════ */
export default function HomePage({ onNavigateLogin, onNavigateSignup }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#0f1e2b] text-white font-sans antialiased overflow-x-hidden">

      {/* ── NAV ─────────────────────────────────────────────── */}
      <motion.header
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0f1e2b]/95 backdrop-blur-xl shadow-[0_1px_0_rgba(136,189,242,0.12)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#88BDF2]/20 border border-[#88BDF2]/40 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px] text-[#88BDF2]">qr_code_2</span>
            </div>
            <span className="font-headline text-xl font-bold text-white tracking-tight">RollQR</span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {['Features', 'How it Works', 'Security', 'Pricing'].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/ /g, '-')}`}
                className="font-sans text-sm font-medium px-4 py-2 text-[#BDDDFC]/70 hover:text-white rounded-lg hover:bg-[#88BDF2]/10 transition-all"
              >
                {link}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onNavigateLogin}
              className="font-sans text-sm font-semibold px-4 py-2 text-[#88BDF2] rounded-lg hover:bg-[#88BDF2]/10 transition-all"
            >
              Log in
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 0 24px rgba(136,189,242,0.35)' }}
              whileTap={{ scale: 0.96 }}
              onClick={onNavigateSignup}
              className="font-sans text-sm font-semibold px-5 py-2 bg-[#88BDF2] text-[#213342] rounded-lg shadow-md transition-all"
            >
              Get Started Free
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-20 pb-16 px-6 lg:px-10 overflow-hidden bg-[#0f1e2b]">
        {/* bg orbs */}
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full bg-[#88BDF2]/6 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-[#384959]/60 blur-[90px] pointer-events-none" />
        {/* subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(136,189,242,1) 1px, transparent 1px), linear-gradient(to right, rgba(136,189,242,1) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-10 items-center">
          {/* left */}
          <div className="flex flex-col items-start">
            <motion.div
              variants={fadeIn(0.1)}
              initial="hidden"
              animate="show"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#88BDF2]/10 border border-[#88BDF2]/25 mb-7"
            >
              <motion.span
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-emerald-400"
              />
              <span className="font-sans text-xs font-bold text-[#88BDF2] tracking-widest uppercase">
                Anti-Proxy Attendance System
              </span>
            </motion.div>

            <motion.h1
              variants={stagger(0.15)}
              initial="hidden"
              animate="show"
              className="font-headline text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.06] tracking-tight text-white mb-6"
            >
              Attendance that{' '}
              <span className="bg-gradient-to-r from-[#88BDF2] via-[#BDDDFC] to-[#88BDF2] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                can't be faked.
              </span>
            </motion.h1>

            <motion.p
              variants={stagger(0.25)}
              initial="hidden"
              animate="show"
              className="font-sans text-lg text-[#BDDDFC]/70 leading-relaxed max-w-lg mb-10"
            >
              Rotating HMAC QR codes that expire every 15 seconds, combined with silent GPS geofencing — the world's most tamper-proof classroom attendance system.
            </motion.p>

            <motion.div
              variants={stagger(0.35)}
              initial="hidden"
              animate="show"
              className="flex flex-wrap gap-4 mb-12"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 32px rgba(136,189,242,0.4)' }}
                whileTap={{ scale: 0.96 }}
                onClick={onNavigateSignup}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#88BDF2] text-[#213342] font-headline font-bold text-base rounded-xl shadow-lg transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
                Start Free Session
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03, borderColor: 'rgba(136,189,242,0.6)' }}
                whileTap={{ scale: 0.97 }}
                onClick={onNavigateLogin}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-transparent border border-[#88BDF2]/30 text-[#BDDDFC] font-sans font-semibold text-base rounded-xl transition-all hover:bg-[#88BDF2]/8"
              >
                <span className="material-symbols-outlined text-[20px]">play_circle</span>
                See it in Action
              </motion.button>
            </motion.div>

            {/* trust row */}
            <motion.div
              variants={stagger(0.45)}
              initial="hidden"
              animate="show"
              className="flex flex-wrap gap-5 text-sm text-[#6A89A7]"
            >
              {[
                { icon: 'check_circle', label: 'No hardware required' },
                { icon: 'check_circle', label: 'Works on any phone' },
                { icon: 'check_circle', label: '60s setup per lecture' },
              ].map((item) => (
                <span key={item.label} className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-emerald-400">{item.icon}</span>
                  <span className="font-sans font-medium">{item.label}</span>
                </span>
              ))}
            </motion.div>
          </div>

          {/* right — parallax QR visual */}
          <motion.div
            variants={fadeIn(0.3)}
            initial="hidden"
            animate="show"
            className="flex justify-center lg:justify-end"
          >
            <HeroQRVisual />
          </motion.div>
        </div>

        {/* scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        >
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="material-symbols-outlined text-[24px] text-[#88BDF2]/40"
          >
            keyboard_arrow_down
          </motion.span>
        </motion.div>
      </section>

      {/* ── TICKER STRIP ─────────────────────────────────────── */}
      <Ticker />

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section id="features" className="py-28 px-6 lg:px-10 bg-[#0f1e2b]">
        <div className="max-w-7xl mx-auto">
          <Section className="text-center mb-16">
            <p className="font-sans text-xs font-bold text-[#88BDF2] tracking-[0.2em] uppercase mb-3">Core Technology</p>
            <h2 className="font-headline text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              Three pillars that make{' '}
              <span className="bg-gradient-to-r from-[#88BDF2] to-[#BDDDFC] bg-clip-text text-transparent">
                proxy impossible.
              </span>
            </h2>
            <p className="font-sans text-lg text-[#BDDDFC]/60 max-w-2xl mx-auto">
              Each layer independently blocks a different attack vector. Together they create an attendance system that is cryptographically, physically, and device-bound.
            </p>
          </Section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.title} feature={f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section id="how-it-works" className="py-28 px-6 lg:px-10 bg-[#0c1922]">
        <div className="max-w-7xl mx-auto">
          <Section className="text-center mb-16">
            <p className="font-sans text-xs font-bold text-[#88BDF2] tracking-[0.2em] uppercase mb-3">Simple by Design</p>
            <h2 className="font-headline text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              From projector to gradebook{' '}
              <span className="bg-gradient-to-r from-[#88BDF2] to-[#BDDDFC] bg-clip-text text-transparent">
                in 3 steps.
              </span>
            </h2>
            <p className="font-sans text-lg text-[#BDDDFC]/60 max-w-xl mx-auto">
              No apps to install. No clickers to buy. Just open the dashboard and start taking attendance — it really is that simple.
            </p>
          </Section>

          {/* steps */}
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* connector line on desktop */}
            <div className="hidden md:block absolute top-14 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-transparent via-[#88BDF2]/30 to-transparent" />

            {STEPS.map((step, i) => {
              const ref = useRef(null);
              const inView = useInView(ref, { once: true, margin: '-50px' });
              return (
                <motion.div
                  key={step.num}
                  ref={ref}
                  initial="hidden"
                  animate={inView ? 'show' : 'hidden'}
                  variants={stagger(i * 0.18)}
                  className="flex flex-col items-center text-center gap-5"
                >
                  <div className="relative">
                    <div className="w-28 h-28 rounded-2xl bg-[#213342] border border-[#88BDF2]/25 flex items-center justify-center shadow-[0_0_40px_rgba(136,189,242,0.12)]">
                      <span className="material-symbols-outlined text-[40px] text-[#88BDF2]">{step.icon}</span>
                    </div>
                    <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#88BDF2] text-[#213342] font-headline font-extrabold text-sm flex items-center justify-center shadow-lg">
                      {i + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-headline text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="font-sans text-sm text-[#BDDDFC]/60 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── STATS NUMBERS ────────────────────────────────────── */}
      <section className="py-28 px-6 lg:px-10 bg-gradient-to-b from-[#0c1922] to-[#0f1e2b]">
        <div className="max-w-7xl mx-auto">
          <Section className="text-center mb-16">
            <p className="font-sans text-xs font-bold text-[#88BDF2] tracking-[0.2em] uppercase mb-3">By the Numbers</p>
            <h2 className="font-headline text-4xl lg:text-5xl font-bold text-white leading-tight">
              Security metrics that{' '}
              <span className="bg-gradient-to-r from-[#88BDF2] to-[#BDDDFC] bg-clip-text text-transparent">
                speak for themselves.
              </span>
            </h2>
          </Section>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 divide-y-0 lg:divide-x lg:divide-[#88BDF2]/15">
            {STATS.map((s) => (
              <Counter key={s.label} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* ── SECURITY DETAIL SECTION ──────────────────────────── */}
      <section id="security" className="py-28 px-6 lg:px-10 bg-[#0f1e2b]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* left: visual telemetry mock */}
          <Section>
            <div className="bg-[#0c1922] border border-[#88BDF2]/20 rounded-2xl overflow-hidden shadow-2xl">
              {/* terminal header */}
              <div className="flex items-center justify-between px-5 py-3 bg-[#213342] border-b border-[#88BDF2]/15">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/70" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
                </div>
                <span className="font-sans text-xs font-mono text-[#6A89A7]">live-telemetry.log — Streaming</span>
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-emerald-400"
                />
              </div>
              {/* feed rows */}
              {[
                { initials: 'SK', name: 'Samantha Kuo', id: '2024-CS-049', time: '10:04:18', status: 'verified', dist: '4m' },
                { initials: 'MR', name: 'Marcus Ramirez', id: '2024-CS-112', time: '10:04:21', status: 'verified', dist: '7m' },
                { initials: 'AL', name: 'Alex Lindqvist', id: '2024-CS-203', time: '10:04:22', status: 'quarantined', dist: '1.8km' },
                { initials: 'PD', name: 'Priya Desai', id: '2024-CS-318', time: '10:04:25', status: 'verified', dist: '12m' },
              ].map((row, ri) => (
                <motion.div
                  key={row.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: ri * 0.15 + 0.3 }}
                  className={`flex items-center justify-between px-5 py-3 border-b border-[#88BDF2]/8 ${
                    row.status === 'quarantined' ? 'bg-red-950/20' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                        row.status === 'quarantined'
                          ? 'bg-red-900/50 text-red-300'
                          : 'bg-[#384959] text-[#88BDF2]'
                      }`}
                    >
                      {row.initials}
                    </div>
                    <div>
                      <div className="font-sans text-sm font-semibold text-white">{row.name}</div>
                      <div className="font-sans text-[11px] text-[#6A89A7] font-mono">{row.id}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-sans text-[11px] text-[#6A89A7] font-mono">{row.time}</span>
                    <span
                      className={`font-sans text-[11px] font-bold px-2.5 py-1 rounded-full ${
                        row.status === 'verified'
                          ? 'bg-emerald-900/50 text-emerald-400'
                          : 'bg-red-900/50 text-red-400'
                      }`}
                    >
                      {row.status === 'verified' ? `✓ ${row.dist}` : `⊘ ${row.dist} OUT`}
                    </span>
                  </div>
                </motion.div>
              ))}
              <div className="px-5 py-3 flex items-center justify-between">
                <span className="font-sans text-xs text-[#6A89A7]">43 checked in • 1 quarantined</span>
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="font-sans text-xs text-emerald-400 font-semibold"
                >
                  ● LIVE
                </motion.span>
              </div>
            </div>
          </Section>

          {/* right: text */}
          <Section className="flex flex-col gap-6">
            <p className="font-sans text-xs font-bold text-[#88BDF2] tracking-[0.2em] uppercase">Real-Time Intelligence</p>
            <h2 className="font-headline text-4xl font-bold text-white leading-tight">
              Watch every check-in <br />
              <span className="bg-gradient-to-r from-[#88BDF2] to-[#BDDDFC] bg-clip-text text-transparent">
                as it happens.
              </span>
            </h2>
            <p className="font-sans text-base text-[#BDDDFC]/60 leading-relaxed">
              The live telemetry stream gives you instant visibility into every check-in attempt. Verified students appear in green. Geofence failures, expired tokens, and duplicate device attempts are flagged and quarantined in real time — no manual review needed.
            </p>
            <div className="flex flex-col gap-3 mt-2">
              {[
                { icon: 'published_with_changes', label: 'Token expires in 15s — screenshots are worthless' },
                { icon: 'location_on', label: 'GPS verified silently in the background' },
                { icon: 'devices', label: 'Device ID binding blocks shared-phone attacks' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#88BDF2]/10 border border-[#88BDF2]/25 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px] text-[#88BDF2]">{item.icon}</span>
                  </div>
                  <span className="font-sans text-sm text-[#BDDDFC]/80 font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────── */}
      <section className="py-28 px-6 lg:px-10 bg-[#0c1922]">
        <div className="max-w-4xl mx-auto">
          <Section>
            <div className="relative rounded-3xl bg-gradient-to-br from-[#213342] via-[#1a2b3c] to-[#0f1e2b] border border-[#88BDF2]/25 p-14 text-center overflow-hidden shadow-2xl">
              {/* orbs */}
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[#88BDF2]/8 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-[#384959]/40 blur-2xl pointer-events-none" />

              <div className="relative z-10">
                <motion.span
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#88BDF2]/10 border border-[#88BDF2]/25 mb-6"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-sans text-xs font-bold text-[#88BDF2] tracking-widest uppercase">
                    Instant Setup • No Hardware Required
                  </span>
                </motion.span>

                <h2 className="font-headline text-4xl lg:text-5xl font-extrabold text-white mb-5 leading-tight">
                  Ready to reclaim{' '}
                  <span className="bg-gradient-to-r from-[#88BDF2] to-[#BDDDFC] bg-clip-text text-transparent">
                    15 minutes
                  </span>{' '}
                  of every lecture?
                </h2>
                <p className="font-sans text-lg text-[#BDDDFC]/60 max-w-xl mx-auto mb-10">
                  Start your first tamper-proof session in under 60 seconds. No signup friction, no setup headache — just open the dashboard and go.
                </p>

                <div className="flex flex-wrap gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.06, boxShadow: '0 0 36px rgba(136,189,242,0.45)' }}
                    whileTap={{ scale: 0.96 }}
                    onClick={onNavigateSignup}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#88BDF2] text-[#213342] font-headline font-bold text-lg rounded-xl shadow-lg transition-all"
                  >
                    Start Free Faculty Session
                    <span className="material-symbols-outlined text-[22px]">arrow_forward</span>
                  </motion.button>
                </div>

                <p className="mt-5 font-sans text-sm text-[#6A89A7]">
                  No credit card required • Free for faculty • Works on any campus Wi-Fi
                </p>
              </div>
            </div>
          </Section>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="bg-[#0c1922] border-t border-[#88BDF2]/12 pt-16 pb-8 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          {/* top row */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-14">
            {/* brand col */}
            <div className="md:col-span-2 flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#88BDF2]/20 border border-[#88BDF2]/40 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px] text-[#88BDF2]">qr_code_2</span>
                </div>
                <span className="font-headline text-xl font-bold text-white">RollQR</span>
              </div>
              <p className="font-sans text-sm text-[#6A89A7] leading-relaxed max-w-xs">
                Cryptographically-secured, geofenced classroom attendance built for modern college campuses. Eliminate proxy attendance forever.
              </p>
              <div className="flex items-center gap-3 mt-1">
                {['shield', 'verified_user', 'lock'].map((ic) => (
                  <div key={ic} className="w-9 h-9 rounded-lg bg-[#213342] border border-[#88BDF2]/15 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px] text-[#88BDF2]/60">{ic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* link columns */}
            {[
              {
                title: 'Product',
                links: ['How it Works', 'Feature Cards', 'Live Session', 'Template Builder', 'Attendance Export'],
              },
              {
                title: 'Security',
                links: ['HMAC QR Tokens', 'GPS Geofencing', 'Device Binding', '3-Layer Fraud Check', 'JWT Auth'],
              },
              {
                title: 'Resources',
                links: ['Documentation', 'API Reference', 'GitHub Repository', 'Changelog', 'Support'],
              },
            ].map((col) => (
              <div key={col.title} className="flex flex-col gap-3">
                <h4 className="font-sans text-xs font-bold text-[#88BDF2] uppercase tracking-widest">{col.title}</h4>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="font-sans text-sm text-[#6A89A7] hover:text-[#BDDDFC] transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* bottom bar */}
          <div className="pt-6 border-t border-[#88BDF2]/10 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="font-sans text-sm text-[#6A89A7]">
              © 2025 RollQR. Built with ❤️ for campuses that care about integrity.
            </p>
            <div className="flex items-center gap-6">
              {['Privacy Policy', 'Terms of Use', 'Campus IT Support'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="font-sans text-sm text-[#6A89A7] hover:text-[#BDDDFC] transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
