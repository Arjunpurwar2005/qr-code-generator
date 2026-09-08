import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────────
   LEFT PANEL — Branded Visual Side
───────────────────────────────────────────── */
function BrandPanel({ mode }) {
  return (
    <div className="hidden lg:flex lg:w-[52%] flex-col justify-between bg-rq-navy relative overflow-hidden p-12">
      {/* background texture */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(-45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
          backgroundSize: '12px 12px',
        }}
      />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-rq-orange/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-rq-orange/5 rounded-full blur-3xl pointer-events-none" />

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-rq-orange/20 border border-rq-orange/30 flex items-center justify-center">
          <span className="material-symbols-outlined text-[20px] text-rq-orange">qr_code_2</span>
        </div>
        <span className="font-manrope text-xl font-bold text-white tracking-tight">RollQR</span>
      </div>

      {/* Center content */}
      <div className="relative z-10 flex flex-col gap-8">
        <div>
          <h2 className="font-manrope text-4xl font-extrabold text-white leading-tight mb-4">
            {mode === 'login' ? (
              <>Welcome<br /><span className="text-rq-orange">back.</span></>
            ) : (
              <>Set up your<br /><span className="text-rq-orange">classroom.</span></>
            )}
          </h2>
          <p className="font-sans text-base text-white/50 leading-relaxed max-w-sm">
            {mode === 'login'
              ? 'Your attendance dashboard is a scan away. Log back in and your classes are ready.'
              : 'Create your teacher account. Your first attendance session is 60 seconds away.'}
          </p>
        </div>

        {/* Mini product UI card */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="bg-white/8 border border-white/12 rounded-2xl p-5 backdrop-blur-sm max-w-sm"
        >
          {/* mock QR card header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-rq-orange animate-pulse" />
                <span className="font-sans text-[11px] font-bold text-rq-orange uppercase tracking-widest">Live Session</span>
              </div>
              <div className="font-manrope font-bold text-white text-sm">KCCITM · CSE 3rd Year</div>
            </div>
            <div className="text-right">
              <div className="font-manrope font-extrabold text-rq-orange text-2xl">42</div>
              <div className="font-sans text-white/40 text-[11px]">present</div>
            </div>
          </div>

          {/* QR mini */}
          <div className="bg-white rounded-xl p-3 mb-3">
            <div className="grid gap-[2px]" style={{ gridTemplateColumns: 'repeat(14, 1fr)' }}>
              {[1,1,1,1,1,0,0,1,1,1,1,1,1,0,
                1,0,0,0,1,0,0,1,0,0,0,1,0,0,
                1,0,1,0,1,0,1,0,1,0,1,0,1,0,
                1,0,1,0,1,1,0,1,0,1,1,0,1,1,
                1,1,1,1,1,0,0,0,1,1,1,1,1,0,
                0,0,0,0,0,1,0,1,0,0,0,0,0,1,
                1,1,0,1,1,0,1,0,1,1,0,1,1,0].map((v, i) => (
                <div key={i} className="aspect-square rounded-[1px]"
                  style={{ background: v ? '#101828' : 'transparent' }} />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-white/40 text-xs font-sans">
            <span className="material-symbols-outlined text-[14px]">smartphone</span>
            Scan to mark attendance
          </div>
        </motion.div>

        {/* Feature bullets */}
        <div className="flex flex-col gap-3">
          {[
            { icon: 'bolt', text: 'Generate QR in one click' },
            { icon: 'location_on', text: 'GPS-verified attendance' },
            { icon: 'download', text: 'Excel export instantly' },
          ].map(item => (
            <div key={item.text} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-rq-orange/15 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[15px] text-rq-orange">{item.icon}</span>
              </div>
              <span className="font-sans text-sm text-white/60">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* bottom */}
      <div className="relative z-10">
        <p className="font-sans text-xs text-white/25">Built for KCCITM · KCC Institute of Technology & Management</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function LoginSignup({
  onLogin,
  onSignup,
  authError,
  authSuccess,
  googleClientId,
  googleSigninButtonRef,
}) {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    if (mode === 'login') {
      await onLogin?.({ username, password });
    } else {
      await onSignup?.({ username, email, password });
    }
    setSubmitting(false);
  };

  const inputClass =
    'w-full px-4 py-3 bg-rq-gray border border-rq-gray2 rounded-xl font-sans text-sm text-rq-navy placeholder-rq-muted focus:outline-none focus:border-rq-orange focus:bg-white transition-all duration-200';

  return (
    <div className="min-h-screen flex font-sans antialiased">
      {/* LEFT: Brand Panel */}
      <BrandPanel mode={mode} />

      {/* RIGHT: Form Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white overflow-y-auto">
        <div className="w-full max-w-[400px]">
          {/* Mobile-only logo */}
          <div className="flex lg:hidden items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-rq-navy flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px] text-rq-orange">qr_code_2</span>
            </div>
            <span className="font-manrope text-lg font-bold text-rq-navy">RollQR</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="font-manrope text-3xl font-extrabold text-rq-navy mb-2">
              {mode === 'login' ? 'Teacher Login' : 'Create your account'}
            </h1>
            <p className="font-sans text-sm text-rq-muted">
              {mode === 'login'
                ? 'Welcome back. Enter your credentials to continue.'
                : 'Set up your teacher account and start your first session.'}
            </p>
          </div>

          {/* Alerts */}
          <AnimatePresence>
            {authError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl mb-5"
              >
                <span className="material-symbols-outlined text-[18px] text-red-500 mt-0.5 shrink-0">error</span>
                <span className="font-sans text-sm text-red-700">{authError}</span>
              </motion.div>
            )}
            {authSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-start gap-2.5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl mb-5"
              >
                <span className="material-symbols-outlined text-[18px] text-emerald-600 mt-0.5 shrink-0">check_circle</span>
                <span className="font-sans text-sm text-emerald-700">{authSuccess}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Google SSO */}
          {googleClientId && (
            <div className="mb-5">
              <div ref={googleSigninButtonRef} id="google-signin-button" className="w-full flex justify-center" />
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-rq-gray2" />
                <span className="font-sans text-xs text-rq-muted uppercase tracking-wider font-medium">or</span>
                <div className="flex-1 h-px bg-rq-gray2" />
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block font-manrope text-xs font-bold text-rq-navy uppercase tracking-wide mb-1.5">
                Username <span className="text-rq-orange">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. prof_sharma"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputClass}
              />
            </div>

            <AnimatePresence>
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <label className="block font-manrope text-xs font-bold text-rq-navy uppercase tracking-wide mb-1.5">
                    Email Address <span className="text-rq-orange">*</span>
                  </label>
                  <input
                    type="email"
                    required={mode === 'signup'}
                    placeholder="prof.sharma@kccitm.ac.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block font-manrope text-xs font-bold text-rq-navy uppercase tracking-wide mb-1.5">
                Password <span className="text-rq-orange">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass + ' pr-12'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-rq-muted hover:text-rq-navy transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPass ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: submitting ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 bg-rq-orange text-white font-manrope font-bold text-base rounded-xl shadow-md hover:bg-rq-orange-mid transition-colors disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
            >
              {submitting && (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  className="material-symbols-outlined text-[18px]"
                >
                  progress_activity
                </motion.span>
              )}
              {mode === 'login' ? 'Login →' : 'Create Account →'}
            </motion.button>
          </form>

          {/* Mode switcher */}
          <p className="mt-6 text-center font-sans text-sm text-rq-muted">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
              }}
              className="font-semibold text-rq-orange hover:underline transition-colors"
            >
              {mode === 'login' ? 'Create account' : 'Login'}
            </button>
          </p>

          {/* Trust note */}
          <div className="mt-8 pt-6 border-t border-rq-gray2 flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[18px] text-rq-muted">lock</span>
            <span className="font-sans text-xs text-rq-muted">Teacher accounts only · JWT secured · Built for KCCITM</span>
          </div>
        </div>
      </div>
    </div>
  );
}
