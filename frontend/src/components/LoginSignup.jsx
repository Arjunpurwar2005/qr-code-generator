import React, { useState } from 'react';

export default function LoginSignup({
  onLogin,
  onSignup,
  authError,
  authSuccess,
  googleClientId,
  googleSigninButtonRef
}) {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

  return (
    <div className="bg-background font-body-md text-on-surface flex items-center justify-center min-h-screen p-space-md sm:p-space-xl relative overflow-hidden">
      {/* Background glowing blurred circles */}
      <div className="absolute -top-32 -left-28 w-96 h-96 rounded-full bg-secondary-container opacity-40 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-36 -right-24 w-[28rem] h-[28rem] rounded-full bg-surface-variant opacity-50 blur-3xl pointer-events-none"></div>

      <div className="relative w-full max-w-[490px] bg-surface-container-lowest rounded-xl shadow-xl transition-all duration-300 overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-secondary-container via-surface-tint to-primary-container"></div>
        <div className="p-space-lg sm:p-space-xl flex flex-col items-center text-center">
          <div className="relative mb-space-md group">
            <div className="absolute inset-0 rounded-xl bg-secondary-container blur-md opacity-40 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative w-14 h-14 bg-surface-container-low rounded-xl flex items-center justify-center shadow-sm">
              <img
                alt="RollQR Logo"
                className="w-10 h-10 object-contain rounded-md"
                src="https://lh3.googleusercontent.com/aida/AEtjO1Up5pMusVf4t4LiJbIntWM6RZgmHsxHE3DjOhqFEp5IIw0C01vQufzVZM2O4MFHHr8r7a3QmrLwFcQq2hXXKqIFeKHG11Fu-uGOieIgqe5mD6yTB_ClIR_XeQyQWD0DhzjUnp9WbIReTzmYO_0BLus2I0hpdUDFMBGZBDirB8eg1NRzwSRHTnVarsZpMjcOpzq3nwYBir5GTSFTwaf43RFyrcWmwffIB5Fl-cySwdokIGXa998C4Z3bjfBs"
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-primary font-label-sm uppercase tracking-wider mb-space-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            Enterprise Verification
          </div>

          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-space-2xs tracking-tight">
            Welcome to RollQR
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-[340px]">
            Smart, tamper-proof college attendance platform
          </p>

          {/* Mode Switcher Tabs */}
          <div className="w-full mt-space-lg mb-space-md p-1 bg-surface-container-low rounded-lg flex items-center justify-between relative shadow-sm">
            <button
              className={`relative z-10 w-1/2 py-2 text-center rounded-md font-label-lg text-label-lg transition-all duration-200 cursor-pointer ${
                mode === 'login'
                  ? 'bg-primary-container text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              onClick={() => setMode('login')}
              type="button"
            >
              Log In
            </button>
            <button
              className={`relative z-10 w-1/2 py-2 text-center rounded-md font-label-lg text-label-lg transition-all duration-200 cursor-pointer ${
                mode === 'signup'
                  ? 'bg-primary-container text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              onClick={() => setMode('signup')}
              type="button"
            >
              Sign Up
            </button>
          </div>

          <div className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-surface-container-low rounded-lg text-secondary mb-space-md">
            <span className="material-symbols-outlined text-body-lg">info</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant text-left leading-tight">
              {mode === 'login'
                ? 'Log in with your institutional account'
                : 'Create your account using your college email'}
            </p>
          </div>

          {/* Alert messages */}
          {authError && (
            <div className="w-full mb-space-md p-space-sm bg-error-container text-on-error-container rounded-xl text-left font-body-sm text-body-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-error">error</span>
              <span>{authError}</span>
            </div>
          )}
          {authSuccess && (
            <div className="w-full mb-space-md p-space-sm bg-emerald-100 text-emerald-800 rounded-xl text-left font-body-sm text-body-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600">check_circle</span>
              <span>{authSuccess}</span>
            </div>
          )}

          {/* Google SSO Render Target */}
          {googleClientId && (
            <div className="w-full mb-space-md flex flex-col items-center">
              <div ref={googleSigninButtonRef} id="google-signin-button" className="w-full flex justify-center"></div>
              <div className="w-full flex items-center my-3">
                <div className="flex-1 border-t border-outline-variant"></div>
                <span className="px-3 text-on-surface-variant text-xs uppercase font-semibold tracking-wider">or credentials</span>
                <div className="flex-1 border-t border-outline-variant"></div>
              </div>
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-space-sm text-left">
            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1">
                Username <span className="text-error">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. prof_smith"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface font-body-md focus:outline-none focus:border-primary transition-all"
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1">
                  Email Address <span className="text-error">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="prof.smith@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface font-body-md focus:outline-none focus:border-primary transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1">
                Password <span className="text-error">*</span>
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface font-body-md focus:outline-none focus:border-primary transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-space-xs py-3.5 px-4 bg-primary text-on-primary hover:bg-primary-container rounded-xl font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.985] transition-all duration-150 cursor-pointer disabled:opacity-75"
            >
              {submitting && <span className="material-symbols-outlined animate-spin text-body-lg">progress_activity</span>}
              <span className="font-headline-sm text-headline-sm font-semibold tracking-normal">
                {mode === 'login' ? 'Log In to Portal' : 'Register Account'}
              </span>
            </button>
          </form>

          {/* Institutional Note */}
          <div className="mt-space-lg w-full bg-surface-container rounded-xl p-space-sm flex items-start gap-3 text-left">
            <div className="p-1 rounded-lg bg-surface-container-lowest text-primary mt-0.5 shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-body-lg">domain</span>
            </div>
            <div className="flex-1">
              <p className="font-label-md text-label-md text-on-surface">Institutional Access Only</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                Sign in as Teacher using your authorized college domain (e.g., <span className="font-semibold text-secondary">@university.edu</span>).
              </p>
            </div>
          </div>

          <div className="w-full mt-space-lg pt-space-md flex flex-col items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-label-md text-primary">verified_user</span>
              <span>OAuth 2.0 Single Sign-On • Encrypted Session Token</span>
            </div>
            <div className="flex items-center gap-3 text-on-surface-variant font-body-sm text-body-sm mt-space-2xs">
              <a className="hover:text-primary underline decoration-outline-variant underline-offset-4 transition-colors" href="#">Terms of Service</a>
              <span>•</span>
              <a className="hover:text-primary underline decoration-outline-variant underline-offset-4 transition-colors" href="#">Privacy Notice</a>
              <span>•</span>
              <a className="hover:text-primary underline decoration-outline-variant underline-offset-4 transition-colors" href="#">Campus IT Support</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
