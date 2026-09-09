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
              <div className="font-manrope font-bold text-white text-sm">CS301 · Data Structures</div>
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

          <div className="flex items-center justify-between text-white/50 text-xs">
            <span>Dynamic Token</span>
            <span className="text-emerald-400 font-medium">GPS Verified</span>
          </div>
        </motion.div>
      </div>

      {/* Footer info */}
      <div className="relative z-10 space-y-1">
        <p className="font-sans text-xs text-white/25">Built for modern learning spaces</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   RIGHT PANEL — Form Container
───────────────────────────────────────────── */
export default function LoginSignup({
  onLogin,
  onSignup,
  authError,
  authSuccess,
  googleClientId,
  googleSigninButtonRef
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
    'w-full px-4 py-3 bg-rq-gray dark:bg-slate-800 border border-rq-gray2 dark:border-slate-700 rounded-xl font-sans text-sm text-rq-navy dark:text-slate-100 placeholder-rq-muted dark:placeholder-slate-400 focus:outline-none focus:border-rq-orange focus:bg-white dark:focus:bg-slate-800 transition-all duration-200';

  return (
    <div className="min-h-screen flex font-sans antialiased bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      {/* LEFT: Brand Panel */}
      <BrandPanel mode={mode} />

      {/* RIGHT: Form Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white dark:bg-slate-950 overflow-y-auto">
        <div className="w-full max-w-[400px]">
          {/* Mobile-only logo */}
          <div className="flex lg:hidden items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-rq-navy flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px] text-rq-orange">qr_code_2</span>
            </div>
            <span className="font-manrope text-lg font-bold text-rq-navy dark:text-white">RollQR</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="font-manrope text-3xl font-extrabold text-rq-navy dark:text-white mb-2">
              {mode === 'login' ? 'Teacher Login' : 'Create your account'}
            </h1>
            <p className="font-sans text-sm text-rq-muted dark:text-slate-400">
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
                className="flex items-start gap-2.5 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl mb-5"
              >
                <span className="material-symbols-outlined text-[18px] text-red-500 mt-0.5 shrink-0">error</span>
                <span className="font-sans text-sm text-red-700 dark:text-red-300">{authError}</span>
              </motion.div>
            )}
            {authSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-start gap-2.5 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl mb-5"
              >
                <span className="material-symbols-outlined text-[18px] text-emerald-600 mt-0.5 shrink-0">check_circle</span>
                <span className="font-sans text-sm text-emerald-700 dark:text-emerald-300">{authSuccess}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Google SSO Container */}
          <div className="mb-5">
            <div ref={googleSigninButtonRef} id="google-signin-button" className="w-full flex justify-center min-h-[44px]">
              {!googleClientId && (
                <button
                  type="button"
                  onClick={() => alert('Google Sign-In requires VITE_GOOGLE_CLIENT_ID configuration on the server.')}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-manrope font-semibold text-sm flex items-center justify-center gap-3 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>
              )}
            </div>
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-rq-gray2 dark:bg-slate-800" />
              <span className="font-sans text-xs text-rq-muted dark:text-slate-400 uppercase tracking-wider font-medium">or</span>
              <div className="flex-1 h-px bg-rq-gray2 dark:bg-slate-800" />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block font-manrope text-xs font-bold text-rq-navy dark:text-slate-200 uppercase tracking-wide mb-1.5">
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
                  <label className="block font-manrope text-xs font-bold text-rq-navy dark:text-slate-200 uppercase tracking-wide mb-1.5">
                    Email Address <span className="text-rq-orange">*</span>
                  </label>
                  <input
                    type="email"
                    required={mode === 'signup'}
                    placeholder="prof.sharma@institution.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block font-manrope text-xs font-bold text-rq-navy dark:text-slate-200 uppercase tracking-wide mb-1.5">
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-rq-muted dark:text-slate-400 hover:text-rq-navy dark:hover:text-white transition-colors"
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
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block"
                />
              )}
              <span>{mode === 'login' ? 'Login to Dashboard' : 'Create Teacher Account'}</span>
            </motion.button>
          </form>

          {/* Toggle mode */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="font-sans text-xs text-rq-muted dark:text-slate-400 hover:text-rq-navy dark:hover:text-white transition-colors cursor-pointer"
            >
              {mode === 'login' ? (
                <>New teacher? <span className="text-rq-orange font-bold hover:underline">Create account</span></>
              ) : (
                <>Already registered? <span className="text-rq-orange font-bold hover:underline">Log in</span></>
              )}
            </button>
          </div>

          <div className="mt-8 text-center border-t border-rq-gray2 dark:border-slate-800 pt-5">
            <span className="font-sans text-xs text-rq-muted dark:text-slate-500">Teacher accounts only · JWT secured · Built for modern learning spaces</span>
          </div>
        </div>
      </div>
    </div>
  );
}
