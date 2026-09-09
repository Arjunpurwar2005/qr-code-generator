import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────────
   LEFT PANEL — Branded Visual Side
───────────────────────────────────────────── */
function BrandPanel({ mode }) {
  return (
    <div className="hidden lg:flex lg:w-[50%] flex-col justify-between bg-[#101820] dark:bg-[#0F1720] border-r border-slate-800 dark:border-[#2A3844] relative overflow-hidden p-12">
      {/* Subtle brand background glow */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#88BDF2]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-xs">
          <span className="material-symbols-outlined text-[20px] text-rq-orange">qr_code_2</span>
        </div>
        <span className="font-display text-xl font-bold text-white tracking-tight">Roll<span className="text-rq-orange">QR</span></span>
      </div>

      {/* Center content */}
      <div className="relative z-10 flex flex-col gap-6">
        <div>
          <h2 className="font-display text-4xl font-extrabold text-white leading-tight mb-3">
            {mode === 'login' ? (
              <>Welcome<br /><span className="text-[#88BDF2]">back.</span></>
            ) : (
              <>Set up your<br /><span className="text-[#88BDF2]">classroom.</span></>
            )}
          </h2>
          <p className="font-sans text-sm text-slate-400 leading-relaxed max-w-sm">
            {mode === 'login'
              ? 'Your attendance dashboard is a scan away. Log back in and your classes are ready.'
              : 'Create your teacher account. Your first attendance session is 60 seconds away.'}
          </p>
        </div>

        {/* Flat mock card */}
        <div className="bg-[#1A2530] border border-[#2A3844] rounded-2xl p-5 max-w-sm shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-display text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Live Verification</span>
              </div>
              <div className="font-display font-bold text-white text-sm">CS301 · Data Structures</div>
            </div>
            <div className="text-right">
              <div className="font-display font-extrabold text-[#88BDF2] text-2xl">42</div>
              <div className="font-sans text-slate-400 text-[11px]">present</div>
            </div>
          </div>

          <div className="bg-[#0F1720] rounded-xl p-3 mb-3 border border-[#2A3844]">
            <div className="grid gap-[2px]" style={{ gridTemplateColumns: 'repeat(14, 1fr)' }}>
              {[1,1,1,1,1,0,0,1,1,1,1,1,1,0,
                1,0,0,0,1,0,0,1,0,0,0,1,0,0,
                1,0,1,0,1,0,1,0,1,0,1,0,1,0,
                1,0,1,0,1,1,0,1,0,1,1,0,1,1,
                1,1,1,1,1,0,0,0,1,1,1,1,1,0,
                0,0,0,0,0,1,0,1,0,0,0,0,0,1,
                1,1,0,1,1,0,1,0,1,1,0,1,1,0].map((v, i) => (
                <div key={i} className="aspect-square rounded-[1px]"
                  style={{ background: v ? '#E8EDF2' : 'transparent' }} />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Rotating Token</span>
            <span className="text-[#88BDF2] font-medium">GPS Geofence</span>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="relative z-10">
        <p className="font-sans text-xs text-slate-500">Built for modern learning spaces</p>
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

  useEffect(() => {
    if (!googleClientId) return;

    let intervalId = null;
    const tryRenderGoogleButton = () => {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        const btnElem = googleSigninButtonRef?.current || document.getElementById('google-signin-button');
        if (btnElem) {
          try {
            btnElem.innerHTML = '';
            window.google.accounts.id.renderButton(btnElem, {
              theme: 'outline',
              size: 'large',
              width: 320
            });
            return true;
          } catch (e) {
            console.error('Google button render error:', e);
          }
        }
      }
      return false;
    };

    if (!tryRenderGoogleButton()) {
      intervalId = setInterval(() => {
        if (tryRenderGoogleButton()) {
          clearInterval(intervalId);
        }
      }, 250);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [googleClientId, googleSigninButtonRef, mode]);

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
    'w-full px-4 py-3 bg-slate-50 dark:bg-[#0F1720] border border-slate-300 dark:border-[#2A3844] rounded-xl font-sans text-sm text-slate-800 dark:text-[#E8EDF2] placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-rq-orange dark:focus:border-[#88BDF2] transition-colors duration-200';

  return (
    <div className="min-h-screen flex font-sans antialiased bg-white dark:bg-[#0F1720] text-slate-800 dark:text-[#E8EDF2]">
      {/* LEFT: Brand Panel */}
      <BrandPanel mode={mode} />

      {/* RIGHT: Form Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white dark:bg-[#0F1720] overflow-y-auto">
        <div className="w-full max-w-[400px]">
          {/* Mobile-only logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-rq-navy flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px] text-rq-orange">qr_code_2</span>
            </div>
            <span className="font-display text-lg font-bold text-rq-navy dark:text-white">Roll<span className="text-rq-orange">QR</span></span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="font-display text-3xl font-extrabold text-rq-navy dark:text-[#E8EDF2] mb-2">
              {mode === 'login' ? 'Teacher Login' : 'Create your account'}
            </h1>
            <p className="font-sans text-sm text-slate-600 dark:text-slate-400">
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

          {/* Conventional Restructured Form Flow (Req #4) */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* 1. Username Field */}
            <div>
              <label className="block font-display text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">
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

            {/* 2. Email Field (Signup mode) */}
            <AnimatePresence>
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <label className="block font-display text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">
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

            {/* 3. Password Field */}
            <div>
              <label className="block font-display text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPass ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* 4. Primary Sign In / Create Account Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-rq-orange hover:bg-orange-600 text-white font-display font-bold text-base rounded-xl shadow-md transition-all disabled:opacity-70 flex items-center justify-center gap-2 mt-1 cursor-pointer active:scale-95"
            >
              {submitting && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block animate-spin" />
              )}
              <span>{mode === 'login' ? 'Sign In' : 'Create Teacher Account'}</span>
            </button>

            {/* 5. Divider Line with 'or' */}
            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-slate-200 dark:bg-[#2A3844]" />
              <span className="font-sans text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-medium">or</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-[#2A3844]" />
            </div>

            {/* 6. Plain 'Sign in with Google' Secondary Button below divider */}
            <div className="w-full flex flex-col items-center">
              <div ref={googleSigninButtonRef} id="google-signin-button" className="w-full flex justify-center min-h-[44px]">
                {!googleClientId && (
                  <button
                    type="button"
                    onClick={() => alert('Google Sign-In requires VITE_GOOGLE_CLIENT_ID configuration on the server.')}
                    className="w-full py-3 px-4 rounded-xl border border-slate-300 dark:border-[#2A3844] bg-white dark:bg-[#1A2530] text-slate-700 dark:text-[#E8EDF2] font-display font-semibold text-sm flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-[#253240] transition-colors cursor-pointer"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Sign in with Google</span>
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* Toggle mode */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="font-sans text-xs text-slate-500 dark:text-slate-400 hover:text-rq-navy dark:hover:text-[#E8EDF2] transition-colors cursor-pointer"
            >
              {mode === 'login' ? (
                <>New teacher? <span className="text-rq-orange dark:text-[#88BDF2] font-bold hover:underline">Create account</span></>
              ) : (
                <>Already registered? <span className="text-rq-orange dark:text-[#88BDF2] font-bold hover:underline">Log in</span></>
              )}
            </button>
          </div>

          <div className="mt-8 text-center border-t border-slate-200 dark:border-[#2A3844] pt-5">
            <span className="font-sans text-xs text-slate-500 dark:text-slate-500">Teacher accounts only · JWT secured · Built for modern learning spaces</span>
          </div>
        </div>
      </div>
    </div>
  );
}
