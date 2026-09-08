import React from 'react';

export default function StudentAttendanceForm({
  scanSessionId,
  studentForm,
  studentResponses,
  setStudentResponses,
  studentLoc,
  studentLocLoading,
  studentSubmitting,
  studentResult,
  studentError,
  onGetStudentGPS,
  onSubmitStudentAttendance
}) {
  if (studentResult) {
    return (
      <div className="font-sans antialiased text-[#384959] min-h-screen flex flex-col items-center justify-center p-4" style={{ background: 'linear-gradient(180deg, #d8ebfd 0%, #eaf3fe 45%, #c8e2fb 100%)' }}>
        <div className="w-full max-w-[430px] rounded-2xl bg-white/90 border border-[#88BDF2] shadow-2xl p-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-3xl">
            🎉
          </div>
          <h1 className="font-headline text-2xl font-bold text-[#213342]">Attendance Marked!</h1>
          <p className="text-sm text-[#43474c]">Your attendance record has been verified and saved to the roster.</p>
          <div className="bg-[#f4f9ff] p-4 rounded-xl border border-[#88BDF2]/50 text-left space-y-1">
            <div className="text-xs text-[#42617d] font-bold uppercase">Verification Status</div>
            <div className="text-lg font-bold text-emerald-600">{studentResult.status || 'PRESENT'}</div>
            <div className="text-xs text-[#43474c] font-mono mt-1">Record ID: #{studentResult.record_id}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans antialiased text-[#384959] min-h-screen flex flex-col selection:bg-[#BDDDFC] selection:text-[#213342]" style={{ background: 'linear-gradient(180deg, #d8ebfd 0%, #eaf3fe 45%, #c8e2fb 100%)', backgroundAttachment: 'fixed' }}>
      {/* Ambient background blur */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-[260px] bg-gradient-to-b from-[#88BDF2]/40 via-[#BDDDFC]/20 to-transparent blur-2xl pointer-events-none -z-10"></div>
      <div className="fixed -bottom-10 right-0 w-64 h-64 bg-[#88BDF2]/30 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Mobile App Header */}
      <header className="w-full pt-safe sticky top-0 z-40 bg-[#d8ebfd]/85 backdrop-blur-md border-b border-[#88BDF2]/40 shadow-[0_2px_12px_rgba(56,73,89,0.04)]">
        <div className="max-w-[430px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl shadow-sm overflow-hidden flex items-center justify-center bg-[#384959] ring-1 ring-white/50">
              <img
                alt="RollQR Logo"
                className="w-6 h-6 object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1Up5pMusVf4t4LiJbIntWM6RZgmHsxHE3DjOhqFEp5IIw0C01vQufzVZM2O4MFHHr8r7a3QmrLwFcQq2hXXKqIFeKHG11Fu-uGOieIgqe5mD6yTB_ClIR_XeQyQWD0DhzjUnp9WbIReTzmYO_0BLus2I0hpdUDFMBGZBDirB8eg1NRzwSRHTnVarsZpMjcOpzq3nwYBir5GTSFTwaf43RFyrcWmwffIB5Fl-cySwdokIGXa998C4Z3bjfBs"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-headline font-bold text-lg text-[#384959] tracking-tight leading-none">RollQR</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#384959]/10 text-[#384959]">Live</span>
              </div>
              <span className="text-[11px] font-semibold text-[#42617d] tracking-wide mt-0.5">
                {studentForm?.class_id || 'CS301'} • Prof. Alan Davis
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/70 border border-[#88BDF2]/60 shadow-xs backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-bold text-[#384959] uppercase tracking-wider">Node Active</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#384959] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[430px] mx-auto px-4 pt-4 pb-6 flex flex-col space-y-4">
        {/* Session Meta Card */}
        <div className="relative overflow-hidden rounded-2xl bg-white/80 border border-[#88BDF2]/70 shadow-[0_4px_16px_rgba(56,73,89,0.06)] backdrop-blur-md p-4">
          <div className="absolute -right-8 -top-8 w-28 h-28 bg-[#BDDDFC]/50 rounded-full blur-xl pointer-events-none"></div>
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-[#42617d] text-xs font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px] text-blue-600">schedule</span>
                <span>Session #{scanSessionId || 1} • Room 402</span>
              </div>
              <h1 className="font-headline text-[22px] font-bold text-[#384959] leading-tight mt-1">
                {studentForm?.class_id || 'CS301 Data Structures & Algorithms'}
              </h1>
              <p className="text-xs text-[#43474c] mt-0.5 font-medium">Instructor: <span className="font-semibold text-[#213342]">Prof. Alan Davis</span></p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#e8f3fe] border border-[#88BDF2]/60 flex items-center justify-center text-[#2563eb] shadow-xs shrink-0 ml-2">
              <span className="material-symbols-outlined text-[22px]">how_to_reg</span>
            </div>
          </div>
          <div className="relative z-10 mt-3 pt-3 border-t border-[#88BDF2]/30 flex items-center justify-between text-xs text-[#42617d]">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-emerald-600">wifi_tethering</span>
              <span>In-Class Proximity Beacon #04</span>
            </span>
            <span className="font-semibold text-[#384959] bg-[#BDDDFC]/50 px-2 py-0.5 rounded-md border border-[#88BDF2]/40">Secured Entry</span>
          </div>
        </div>

        {/* Error Alert */}
        {studentError && (
          <div className="rounded-xl p-3 bg-red-100 border border-red-300 text-red-800 text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-red-600">error</span>
            <span>{studentError}</span>
          </div>
        )}

        {/* Form Card */}
        <section className="rounded-2xl bg-white border border-[#88BDF2] shadow-[0_8px_24px_rgba(56,73,89,0.08)] p-5 relative">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e8f3fe]">
            <div>
              <h2 className="font-headline font-bold text-lg text-[#384959]">Attendance Entry</h2>
              <p className="text-xs text-[#43474c] font-normal">Verify and confirm your student identity</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#e8f3fe] text-[#2563eb] border border-[#88BDF2]/50 tracking-wide">Single Roll</span>
          </div>

          {!studentForm ? (
            <div className="text-center py-6 text-xs text-[#42617d]">
              Loading attendance form fields...
            </div>
          ) : studentForm.is_active === false ? (
            <div className="text-center py-6 text-sm text-red-600 font-bold">
              🔴 This attendance session has ended. Submissions are closed.
            </div>
          ) : (
            <form onSubmit={onSubmitStudentAttendance} className="space-y-3.5">
              {/* GPS Grab Button */}
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={onGetStudentGPS}
                  className={`w-full py-3 rounded-xl font-headline text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                    studentLoc ? 'bg-emerald-600 text-white' : 'bg-[#2563eb] text-white hover:bg-[#1d4ed8]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                  <span>
                    {studentLocLoading
                      ? 'Fetching GPS Location...'
                      : studentLoc
                      ? `✅ GPS Verified (${studentLoc.lat.toFixed(4)}, ${studentLoc.long.toFixed(4)})`
                      : '📍 Allow & Grab My GPS Location'}
                  </span>
                </button>
              </div>

              {/* Form Fields mapping */}
              {studentForm.form_fields && studentForm.form_fields.length > 0 ? (
                studentForm.form_fields.map((field, idx) => (
                  <div key={idx} className="space-y-1">
                    <label className="block text-xs font-bold text-[#384959] uppercase tracking-wider">
                      {field.label} {field.required ? <span className="text-red-500">*</span> : ''} {field.is_unique_id ? '(Unique Roll No)' : ''}
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[19px] text-[#42617d] pointer-events-none">
                        {field.is_unique_id ? 'badge' : field.type === 'dropdown' ? 'groups' : 'person'}
                      </span>
                      {field.type === 'dropdown' ? (
                        <select
                          required={field.required}
                          value={studentResponses[field.label] || ''}
                          onChange={(e) => setStudentResponses?.({ ...studentResponses, [field.label]: e.target.value })}
                          className="w-full h-11 pl-10 pr-3 rounded-xl text-sm font-medium text-[#213342] bg-[#f4f9ff] border-1.5 border-[#88BDF2] focus:border-[#2563eb] outline-none"
                        >
                          <option value="">-- Select {field.label} --</option>
                          {(field.options || []).map((opt, oIdx) => (
                            <option key={oIdx} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type === 'number' ? 'number' : 'text'}
                          required={field.required}
                          placeholder={`Enter ${field.label}`}
                          value={studentResponses[field.label] || ''}
                          onChange={(e) => setStudentResponses?.({ ...studentResponses, [field.label]: e.target.value })}
                          className="w-full h-11 pl-10 pr-3 rounded-xl text-sm font-medium text-[#213342] bg-[#f4f9ff] border-1.5 border-[#88BDF2] focus:border-[#2563eb] outline-none"
                        />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                /* Fallback hardcoded fields matching reference static HTML */
                <>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#384959] uppercase tracking-wider">
                      Student Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[19px] text-[#42617d] pointer-events-none">person</span>
                      <input
                        type="text"
                        required
                        placeholder="Enter your full name"
                        value={studentResponses['Student Name'] || studentResponses['Student Full Name'] || ''}
                        onChange={(e) => setStudentResponses?.({ ...studentResponses, 'Student Name': e.target.value })}
                        className="w-full h-11 pl-10 pr-3 rounded-xl text-sm font-medium text-[#213342] bg-[#f4f9ff] border-1.5 border-[#88BDF2] outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#384959] uppercase tracking-wider">
                      University Roll Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[19px] text-[#42617d] pointer-events-none">badge</span>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 2024-CS-049"
                        value={studentResponses['Roll Number'] || ''}
                        onChange={(e) => setStudentResponses?.({ ...studentResponses, 'Roll Number': e.target.value })}
                        className="w-full h-11 pl-10 pr-3 rounded-xl text-sm font-semibold font-mono text-[#213342] bg-[#f4f9ff] border-1.5 border-[#88BDF2] outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={studentSubmitting}
                  className="w-full h-12 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] active:scale-[0.98] transition-all text-white font-headline font-bold text-base flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(37,99,235,0.35)] cursor-pointer disabled:opacity-50"
                >
                  {studentSubmitting ? (
                    <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                  ) : (
                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  )}
                  <span>{studentSubmitting ? 'Submitting...' : 'Submit Attendance'}</span>
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Security Banner */}
        <div className="rounded-xl p-3 bg-white/70 border border-[#88BDF2]/60 backdrop-blur-md shadow-xs flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#384959] text-white flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#384959]">Silent Geofence Active • Encrypted Token</span>
            <span className="text-[11px] text-[#43474c] leading-tight mt-0.5">Signed cryptographically with CS301 roster ledger. No proxy allowed.</span>
          </div>
        </div>
      </main>

      <footer className="w-full max-w-[430px] mx-auto px-4 pb-safe pt-2 text-center">
        <p className="text-[11px] font-medium text-[#42617d]/80">RollQR Institutional Node v2.4 • Campus Secure Network</p>
      </footer>
    </div>
  );
}
