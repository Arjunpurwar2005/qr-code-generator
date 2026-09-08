import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TemplateBuilder({
  teacherName = "Teacher",
  templates = [],
  newTemplateName,
  setNewTemplateName,
  builderFields,
  setBuilderFields,
  onAddField,
  onRemoveField,
  onFieldChange,
  onSaveTemplate,
  onDeleteTemplate,
  onNavigateDashboard,
  onLogout
}) {
  const [showBuilder, setShowBuilder] = useState(false);

  return (
    <div className="bg-slate-50 font-sans text-slate-800 antialiased min-h-screen flex flex-col selection:bg-orange-100 selection:text-orange-900">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div
              className="flex items-center gap-2.5 cursor-pointer group"
              onClick={onNavigateDashboard}
            >
              <div className="w-9 h-9 rounded-xl bg-rq-navy flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
                <span className="text-rq-orange">R</span>Q
              </div>
              <span className="font-manrope font-extrabold text-xl text-rq-navy tracking-tight">
                Roll<span className="text-rq-orange">QR</span>
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={onNavigateDashboard}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-rq-navy hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Dashboard
              </button>
              <button
                onClick={onNavigateDashboard}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-rq-navy hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Sessions
              </button>
              <button
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 text-rq-navy transition-colors cursor-pointer"
              >
                Templates
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onNavigateDashboard}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-sm transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span className="hidden sm:inline">Back to Dashboard</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="space-y-1">
            <h1 className="font-manrope font-extrabold text-2xl sm:text-3xl text-rq-navy tracking-tight">
              Attendance Templates
            </h1>
            <p className="text-slate-600 text-sm sm:text-base">
              Create reusable forms for your classes.
            </p>
          </div>

          <div>
            <button
              onClick={() => setShowBuilder(!showBuilder)}
              className="px-6 py-3 rounded-xl bg-rq-orange hover:bg-orange-600 text-white font-manrope font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">
                {showBuilder ? 'close' : 'add'}
              </span>
              <span>{showBuilder ? 'Close Builder' : '+ Create Template'}</span>
            </button>
          </div>
        </div>

        {/* Create Template Builder WITH Live Interactive Preview */}
        <AnimatePresence>
          {showBuilder && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-2xl border-2 border-rq-orange/30 shadow-lg p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h2 className="font-manrope font-extrabold text-xl text-rq-navy flex items-center gap-2">
                    <span className="material-symbols-outlined text-rq-orange">edit_note</span>
                    <span>Create Template</span>
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowBuilder(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Form Builder Inputs */}
                  <form
                    onSubmit={(e) => {
                      onSaveTemplate?.(e);
                      setShowBuilder(false);
                    }}
                    className="lg:col-span-7 space-y-6"
                  >
                    {/* Template Name Input */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Template Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. CS301 Daily Attendance"
                        value={newTemplateName}
                        onChange={(e) => setNewTemplateName?.(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-rq-orange focus:ring-2 focus:ring-orange-100 outline-none text-slate-800 text-sm font-medium"
                      />
                    </div>

                    {/* Attendance Fields List */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          Attendance Fields
                        </label>
                        <button
                          type="button"
                          onClick={onAddField}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-rq-navy font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">add</span>
                          <span>+ Add Field</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {builderFields?.map((field, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 relative"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-wider text-rq-navy">
                                Field #{idx + 1}
                              </span>
                              {builderFields.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => onRemoveField?.(idx)}
                                  className="text-red-500 hover:text-red-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-[16px]">delete</span>
                                  <span>Remove</span>
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <input
                                type="text"
                                required
                                placeholder="Field Label (e.g. Roll Number)"
                                value={field.label}
                                onChange={(e) => onFieldChange?.(idx, 'label', e.target.value)}
                                className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm outline-none focus:border-rq-orange"
                              />
                              <select
                                value={field.type}
                                onChange={(e) => onFieldChange?.(idx, 'type', e.target.value)}
                                className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm outline-none focus:border-rq-orange"
                              >
                                <option value="text">Text</option>
                                <option value="number">Number</option>
                                <option value="dropdown">Dropdown Options</option>
                              </select>
                            </div>

                            {field.type === 'dropdown' && (
                              <input
                                type="text"
                                placeholder="Options separated by commas (e.g. Section A, Section B)"
                                value={field.options}
                                onChange={(e) => onFieldChange?.(idx, 'options', e.target.value)}
                                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs outline-none focus:border-rq-orange"
                              />
                            )}

                            <div className="flex items-center gap-6 pt-1 text-xs text-slate-600">
                              <label className="flex items-center gap-2 cursor-pointer font-medium">
                                <input
                                  type="checkbox"
                                  checked={field.required}
                                  onChange={(e) => onFieldChange?.(idx, 'required', e.target.checked)}
                                  className="rounded text-rq-orange focus:ring-rq-orange"
                                />
                                <span>Required</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer font-medium">
                                <input
                                  type="checkbox"
                                  checked={field.is_unique_id}
                                  onChange={(e) => onFieldChange?.(idx, 'is_unique_id', e.target.checked)}
                                  className="rounded text-rq-orange focus:ring-rq-orange"
                                />
                                <span>Unique Roll Number</span>
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setShowBuilder(false)}
                        className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-sm transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-rq-navy hover:bg-slate-800 text-white font-manrope font-bold text-sm shadow-md transition-all cursor-pointer"
                      >
                        Save Template
                      </button>
                    </div>
                  </form>

                  {/* Right Column: LIVE INTERACTIVE PREVIEW */}
                  <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="font-manrope font-bold text-xs uppercase tracking-wider text-slate-300">
                          Live Student Form Preview
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded">
                        Mobile Mockup
                      </span>
                    </div>

                    <div className="bg-white text-slate-800 rounded-xl p-4 shadow-inner space-y-3">
                      <div className="border-b border-slate-100 pb-2">
                        <div className="text-[10px] font-bold uppercase text-rq-orange tracking-wider">
                          Mark Attendance
                        </div>
                        <div className="font-manrope font-bold text-sm text-rq-navy">
                          {newTemplateName || 'Template Preview'}
                        </div>
                      </div>

                      {builderFields?.map((f, fIdx) => (
                        <div key={fIdx} className="space-y-1">
                          <label className="block text-[10px] font-bold uppercase text-slate-600">
                            {f.label || `Field ${fIdx + 1}`} {f.required ? <span className="text-red-500">*</span> : ''}
                          </label>
                          {f.type === 'dropdown' ? (
                            <select disabled className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-slate-50 text-slate-400">
                              <option>-- Select {f.label || 'Option'} --</option>
                            </select>
                          ) : (
                            <input
                              disabled
                              type="text"
                              placeholder={`Enter ${f.label || 'value'}`}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-slate-50 text-slate-400"
                            />
                          )}
                        </div>
                      ))}

                      <div className="pt-2">
                        <button
                          disabled
                          className="w-full py-2 rounded-lg bg-rq-orange text-white font-manrope font-bold text-xs opacity-75 cursor-not-allowed"
                        >
                          Mark Attendance
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 text-center">
                      This is an interactive preview of how students will see the form when scanning your QR code.
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Saved Templates Grid */}
        <section className="space-y-4">
          <h2 className="font-manrope font-bold text-lg text-rq-navy flex items-center gap-2">
            <span className="material-symbols-outlined text-rq-orange">bookmark</span>
            <span>Saved Templates</span>
          </h2>

          {templates && templates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-200 transition-all p-6 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 text-rq-orange flex items-center justify-center font-bold shrink-0">
                        <span className="material-symbols-outlined text-[22px]">assignment</span>
                      </div>
                      <button
                        onClick={() => onDeleteTemplate?.(tmpl.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Template"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>

                    <div>
                      <h3 className="font-manrope font-bold text-lg text-rq-navy leading-snug">
                        {tmpl.template_name}
                      </h3>
                      <p className="text-slate-500 text-xs mt-0.5">
                        {tmpl.fields?.length || 0} fields configured
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {tmpl.fields?.map((f, fIdx) => (
                        <span
                          key={fIdx}
                          className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold"
                        >
                          {f.label} {f.required ? '*' : ''}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <button
                      onClick={onNavigateDashboard}
                      className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-rq-navy hover:text-white text-rq-navy font-manrope font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Use Template</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Rich Illustrated Empty State for Templates */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-10 text-center space-y-4 relative overflow-hidden">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 text-rq-orange mx-auto flex items-center justify-center shadow-inner">
                <span className="material-symbols-outlined text-[32px]">bookmark_add</span>
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h3 className="font-manrope font-extrabold text-xl text-rq-navy">Create your first attendance template</h3>
                <p className="text-slate-500 text-sm">
                  Save your class fields once and reuse them whenever you take attendance.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setShowBuilder(true)}
                  className="px-6 py-3 rounded-xl bg-rq-orange hover:bg-orange-600 text-white font-manrope font-bold text-sm shadow-md transition-all inline-flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span>+ Create Template</span>
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
