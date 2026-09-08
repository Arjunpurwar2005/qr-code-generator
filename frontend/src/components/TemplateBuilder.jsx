import React, { useState } from 'react';

export default function TemplateBuilder({
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
  onNavigateDashboard
}) {
  return (
    <div className="bg-background font-body-md text-on-surface antialiased selection:bg-secondary-container selection:text-on-secondary-container min-h-screen flex flex-col">
      {/* Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(33,51,66,0.06)]">
        <div className="h-16 w-full px-gutter-desktop flex items-center justify-between gap-space-lg">
          <div className="flex items-center gap-space-md min-w-0">
            <div className="flex items-center gap-space-sm cursor-pointer" onClick={onNavigateDashboard}>
              <img
                alt="RollQR Logo"
                className="h-8 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1Up5pMusVf4t4LiJbIntWM6RZgmHsxHE3DjOhqFEp5IIw0C01vQufzVZM2O4MFHHr8r7a3QmrLwFcQq2hXXKqIFeKHG11Fu-uGOieIgqe5mD6yTB_ClIR_XeQyQWD0DhzjUnp9WbIReTzmYO_0BLus2I0hpdUDFMBGZBDirB8eg1NRzwSRHTnVarsZpMjcOpzq3nwYBir5GTSFTwaf43RFyrcWmwffIB5Fl-cySwdokIGXa998C4Z3bjfBs"
              />
              <span className="font-headline-sm text-headline-sm text-primary tracking-tight">RollQR</span>
            </div>
            <div className="hidden md:flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              <span className="px-space-xs py-space-2xs rounded bg-surface-container text-on-surface-variant uppercase tracking-wider">Template Studio</span>
            </div>
          </div>

          <div className="flex items-center gap-space-md">
            <button
              onClick={onNavigateDashboard}
              className="px-space-md py-space-xs rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-md transition-colors cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content Layout */}
      <main className="w-full pt-20 bg-background px-gutter-mobile md:px-gutter-desktop py-space-lg flex-1">
        <div className="max-w-5xl mx-auto flex flex-col space-y-space-xl">
          {/* Header Description */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-space-md border-b border-outline-variant/30">
            <div>
              <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm uppercase tracking-wider">
                <span className="text-secondary font-semibold">Custom Attendance Presets</span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight mt-space-2xs">
                Attendance Form Builder
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Design custom fields and roll verification structures for your classes.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            {/* Left: Template Builder Form */}
            <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl shadow-md p-space-lg border border-surface-container flex flex-col space-y-space-md">
              <h2 className="font-headline-md text-headline-md text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">edit_note</span>
                <span>Create New Template</span>
              </h2>

              <form onSubmit={onSaveTemplate} className="flex flex-col space-y-space-md">
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-1">
                    Template Name <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS301 Daily Attendance"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName?.(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-primary font-body-md focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-space-sm">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-primary uppercase tracking-wider">
                      Form Fields ({builderFields?.length || 0})
                    </label>
                    <button
                      type="button"
                      onClick={onAddField}
                      className="flex items-center gap-1 text-xs font-semibold text-secondary hover:text-primary transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">add_circle</span>
                      <span>Add Field</span>
                    </button>
                  </div>

                  {builderFields?.map((field, idx) => (
                    <div key={idx} className="bg-surface-container-low p-space-sm rounded-xl border border-outline-variant/40 space-y-2 relative">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-label-sm text-label-sm text-secondary font-bold">Field #{idx + 1}</span>
                        {builderFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => onRemoveField?.(idx)}
                            className="text-error hover:opacity-80 p-1 rounded-md cursor-pointer"
                            title="Remove Field"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <input
                            type="text"
                            required
                            placeholder="Field Label (e.g. Roll Number)"
                            value={field.label}
                            onChange={(e) => onFieldChange?.(idx, 'label', e.target.value)}
                            className="w-full px-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <select
                            value={field.type}
                            onChange={(e) => onFieldChange?.(idx, 'type', e.target.value)}
                            className="w-full px-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm"
                          >
                            <option value="text">Text Input</option>
                            <option value="number">Numeric Input</option>
                            <option value="dropdown">Dropdown Options</option>
                          </select>
                        </div>
                      </div>

                      {field.type === 'dropdown' && (
                        <div>
                          <input
                            type="text"
                            placeholder="Options separated by commas (e.g. Section A, Section B)"
                            value={field.options}
                            onChange={(e) => onFieldChange?.(idx, 'options', e.target.value)}
                            className="w-full px-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs"
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-4 pt-1 text-xs">
                        <label className="flex items-center gap-1.5 cursor-pointer text-on-surface-variant font-medium">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => onFieldChange?.(idx, 'required', e.target.checked)}
                            className="rounded border-outline-variant text-secondary"
                          />
                          <span>Required</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer text-on-surface-variant font-medium">
                          <input
                            type="checkbox"
                            checked={field.is_unique_id}
                            onChange={(e) => onFieldChange?.(idx, 'is_unique_id', e.target.checked)}
                            className="rounded border-outline-variant text-secondary"
                          />
                          <span>Unique ID / Roll No</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-secondary hover:bg-primary text-on-secondary font-headline-sm text-headline-sm rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Save Form Template
                </button>
              </form>
            </div>

            {/* Right: Saved Templates Directory */}
            <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl shadow-md p-space-lg border border-surface-container flex flex-col space-y-space-md">
              <h2 className="font-headline-md text-headline-md text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">folder_special</span>
                <span>Your Saved Templates</span>
              </h2>

              <div className="flex flex-col space-y-space-xs max-h-[500px] overflow-y-auto pr-1">
                {templates && templates.length > 0 ? (
                  templates.map((tmpl) => (
                    <div key={tmpl.id} className="p-space-sm rounded-xl bg-surface-container-low border border-outline-variant/40 flex items-center justify-between gap-3">
                      <div className="flex flex-col min-w-0">
                        <span className="font-label-md text-label-md text-primary font-bold truncate">{tmpl.template_name}</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {tmpl.fields?.map((f, fIdx) => (
                            <span key={fIdx} className="px-2 py-0.5 bg-surface-container text-secondary text-[11px] rounded font-semibold">
                              {f.label} {f.is_unique_id ? '(Unique)' : ''}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteTemplate?.(tmpl.id)}
                        className="p-1 text-error hover:bg-error-container/30 rounded-lg cursor-pointer shrink-0"
                        title="Delete Template"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-on-surface-variant font-body-sm">
                    No custom templates saved yet. Create one on the left!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
