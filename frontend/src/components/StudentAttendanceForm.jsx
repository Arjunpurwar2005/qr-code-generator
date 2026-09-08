import React from 'react';
import { motion } from 'framer-motion';

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
  // --- SUCCESS VIEW ---
  if (studentResult) {
    return (
      <div className="bg-slate-50 font-sans text-slate-800 antialiased min-h-screen flex flex-col items-center justify-center p-4 selection:bg-orange-100 selection:text-orange-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-8 text-center space-y-6 relative overflow-hidden"
        >
          {/* Top Success Badge */}
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 border-4 border-emerald-100 mx-auto flex items-center justify-center text-4xl shadow-inner">
            ✓
          </div>

          <div className="space-y-2">
            <h1 className="font-manrope font-extrabold text-2xl text-rq-navy">
              Attendance Marked!
            </h1>
            <p className="text-slate-600 text-sm">
              Your attendance has been recorded successfully.
            </p>
          </div>

          {studentResult.record_id && (
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Confirmation Details
              </div>
              <div className="text-base font-bold text-emerald-700">
                Status: {studentResult.status || 'PRESENT'}
              </div>
              <div className="text-xs text-slate-500 font-mono">
                Record ID: #{studentResult.record_id}
              </div>
            </div>
          )}

          <div className="pt-2 text-xs text-slate-400">
            Powered by RollQR Classroom Verification
          </div>
        </motion.div>
      </div>
    );
  }

  // --- FORM VIEW ---
  return (
    <div className="bg-slate-50 font-sans text-slate-800 antialiased min-h-screen flex flex-col selection:bg-orange-100 selection:text-orange-900">
      {/* Mobile Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rq-navy text-white font-bold text-base flex items-center justify-center shadow-md">
              <span className="text-rq-orange">R</span>Q
            </div>
            <span className="font-manrope font-extrabold text-xl text-rq-navy tracking-tight">
              Roll<span className="text-rq-orange">QR</span>
            </span>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-orange-50 text-rq-orange text-xs font-bold border border-orange-200">
            Student Scan
          </span>
        </div>
      </header>

      {/* Main Student Container */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 py-6 flex flex-col space-y-6">
        {/* Class Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-rq-orange">
            Mark Attendance
          </div>
          <h1 className="font-manrope font-extrabold text-2xl text-rq-navy">
            {studentForm?.class_id || 'Class Attendance'}
          </h1>
          <p className="text-slate-500 text-sm">
            Enter your details to continue.
          </p>
        </div>

        {/* Error Notification */}
        {studentError && (
          <div className="rounded-2xl p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2.5">
            <span className="material-symbols-outlined text-red-600 text-[20px]">error</span>
            <span>{studentError}</span>
          </div>
        )}

        {/* Attendance Form */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-6">
          {!studentForm ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              Loading attendance form...
            </div>
          ) : studentForm.is_active === false ? (
            <div className="text-center py-8 text-red-600 font-bold text-sm">
              This attendance session has ended. Submissions are closed.
            </div>
          ) : (
            <form onSubmit={onSubmitStudentAttendance} className="space-y-5">
              {/* Location Capture Button */}
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={onGetStudentGPS}
                  className={`w-full py-3 rounded-xl font-manrope font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                    studentLoc
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                      : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {studentLoc ? 'check_circle' : 'my_location'}
                  </span>
                  <span>
                    {studentLocLoading
                      ? 'Fetching Location...'
                      : studentLoc
                      ? `GPS Verified (${studentLoc.lat.toFixed(4)}, ${studentLoc.long.toFixed(4)})`
                      : '📍 Allow & Grab My Location'}
                  </span>
                </button>
              </div>

              {/* Dynamic Backend Form Fields */}
              {studentForm.form_fields && studentForm.form_fields.length > 0 ? (
                studentForm.form_fields.map((field, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      {field.label} {field.required ? <span className="text-red-500">*</span> : ''}
                    </label>

                    {field.type === 'dropdown' ? (
                      <select
                        required={field.required}
                        value={studentResponses[field.label] || ''}
                        onChange={(e) => setStudentResponses?.({ ...studentResponses, [field.label]: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-rq-orange focus:ring-2 focus:ring-orange-100 outline-none text-slate-800 text-sm font-medium bg-white"
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
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-rq-orange focus:ring-2 focus:ring-orange-100 outline-none text-slate-800 text-sm font-medium"
                      />
                    )}
                  </div>
                ))
              ) : (
                /* Standard Fallback Fields */
                <>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Student Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={studentResponses['Student Name'] || ''}
                      onChange={(e) => setStudentResponses?.({ ...studentResponses, 'Student Name': e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-rq-orange focus:ring-2 focus:ring-orange-100 outline-none text-slate-800 text-sm font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Roll Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your roll number"
                      value={studentResponses['Roll Number'] || ''}
                      onChange={(e) => setStudentResponses?.({ ...studentResponses, 'Roll Number': e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-rq-orange focus:ring-2 focus:ring-orange-100 outline-none text-slate-800 text-sm font-medium"
                    />
                  </div>
                </>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={studentSubmitting}
                  className="w-full py-3.5 rounded-xl bg-rq-orange hover:bg-orange-600 active:scale-95 text-white font-manrope font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {studentSubmitting ? (
                    <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                  ) : (
                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  )}
                  <span>{studentSubmitting ? 'Submitting...' : 'Mark Attendance'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
