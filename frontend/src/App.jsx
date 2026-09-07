import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

// API Base URL from Environment Variable (Vite) with local fallback for laptop development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export default function App() {
  // Check if URL has student scan query params (?session_id=1&qr_token=xyz)
  const queryParams = new URLSearchParams(window.location.search);
  const scanSessionId = queryParams.get('session_id');
  const scanQrToken = queryParams.get('qr_token');

  // --- STUDENT SCANNER STATE ---
  const [studentForm, setStudentForm] = useState(null);
  const [studentResponses, setStudentResponses] = useState({});
  const [studentLoc, setStudentLoc] = useState(null);
  const [studentLocLoading, setStudentLocLoading] = useState(false);
  const [studentSubmitting, setStudentSubmitting] = useState(false);
  const [studentResult, setStudentResult] = useState(null);
  const [studentError, setStudentError] = useState('');

  // --- TEACHER PORTAL STATE ---
  const [token, setToken] = useState(localStorage.getItem('teacher_token') || '');
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  const [activeTab, setActiveTab] = useState('session');
  const [location, setLocation] = useState(null);
  const [locLoading, setLocLoading] = useState(false);
  const [classId, setClassId] = useState('CS101');
  const [radiusMeters, setRadiusMeters] = useState(30);

  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [pastSessions, setPastSessions] = useState([]);

  const [newTemplateName, setNewTemplateName] = useState('');
  const [builderFields, setBuilderFields] = useState([
    { label: 'Roll Number', type: 'text', required: true, is_unique_id: true, options: '' },
    { label: 'Student Name', type: 'text', required: true, is_unique_id: false, options: '' }
  ]);

  const [activeSession, setActiveSession] = useState(null);
  const [currentToken, setCurrentToken] = useState('');
  const [expiresIn, setExpiresIn] = useState(0);

  const getDeviceId = () => {
    let devId = localStorage.getItem('student_device_id');
    if (!devId) {
      devId = 'dev_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('student_device_id', devId);
    }
    return devId;
  };

  useEffect(() => {
    if (scanSessionId) {
      fetchPublicForm(scanSessionId);
    }
  }, [scanSessionId]);

  useEffect(() => {
    if (token && !scanSessionId) {
      fetchTemplates();
      fetchPastSessions();
    }
  }, [token, scanSessionId]);

  useEffect(() => {
    let interval = null;
    if (activeSession && activeSession.session_id) {
      fetchCurrentToken(activeSession.session_id);
      interval = setInterval(() => {
        fetchCurrentToken(activeSession.session_id);
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeSession]);

  // --- STUDENT HANDLERS ---

  const fetchPublicForm = async (sessId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/session/${sessId}/public-form`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Form not found');
      }
      setStudentForm(data);
      const initialResponses = {};
      data.form_fields.forEach((field) => {
        initialResponses[field.label] = '';
      });
      setStudentResponses(initialResponses);
    } catch (err) {
      setStudentError(err.message);
    }
  };

  const getStudentGPS = () => {
    setStudentLocLoading(true);
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your phone browser.');
      setStudentLocLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setStudentLoc({
          lat: pos.coords.latitude,
          long: pos.coords.longitude
        });
        setStudentLocLoading(false);
      },
      () => {
        alert('Location permission denied or unavailable. Please enable GPS location access.');
        setStudentLocLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setStudentError('');

    if (!studentLoc) {
      alert('Please click "📍 Allow & Grab My GPS Location" first!');
      return;
    }

    setStudentSubmitting(true);
    try {
      const payload = {
        session_id: parseInt(scanSessionId),
        qr_token: scanQrToken,
        lat: studentLoc.lat,
        long: studentLoc.long,
        device_id: getDeviceId(),
        responses: studentResponses
      };

      const res = await fetch(`${API_BASE_URL}/attendance/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Attendance submission failed.');
      }

      setStudentResult(data);
    } catch (err) {
      setStudentError(err.message);
    } finally {
      setStudentSubmitting(false);
    }
  };

  // --- TEACHER HANDLERS ---

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Login failed');
      }
      setToken(data.access_token);
      localStorage.setItem('teacher_token', data.access_token);
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    try {
      const res = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Signup failed');
      }
      setAuthSuccess('Teacher account created successfully! Please sign in.');
      setIsSignup(false);
      setPassword('');
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('teacher_token');
    setActiveSession(null);
  };

  const fetchTemplates = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/templates`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTemplates(data);
      }
    } catch (err) {
      console.error('Error fetching templates:', err);
    }
  };

  const fetchPastSessions = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/session/my-sessions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPastSessions(data);
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
    }
  };

  const downloadExcel = (sessionId, className) => {
    fetch(`${API_BASE_URL}/session/${sessionId}/export-excel`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to export Excel');
        return res.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Attendance_${className}_Session_${sessionId}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch((err) => alert(err.message));
  };

  const handleDeleteTemplate = async (templateId) => {
    if (!window.confirm('Delete this template?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/templates/${templateId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchTemplates();
      }
    } catch (err) {
      console.error('Error deleting template:', err);
    }
  };

  const handleAddField = () => {
    setBuilderFields([
      ...builderFields,
      { label: '', type: 'text', required: true, is_unique_id: false, options: '' }
    ]);
  };

  const handleRemoveField = (index) => {
    setBuilderFields(builderFields.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index, key, value) => {
    const updated = [...builderFields];
    updated[index][key] = value;
    setBuilderFields(updated);
  };

  const handleSaveNewTemplate = async (e) => {
    e.preventDefault();
    if (!newTemplateName.trim()) {
      alert('Please enter a template name!');
      return;
    }

    const formattedFields = builderFields.map((f) => ({
      label: f.label,
      type: f.type,
      required: f.required,
      is_unique_id: f.is_unique_id,
      options: f.type === 'dropdown' ? f.options.split(',').map((o) => o.trim()).filter(Boolean) : null
    }));

    try {
      const res = await fetch(`${API_BASE_URL}/templates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          template_name: newTemplateName,
          fields: formattedFields
        })
      });

      if (res.ok) {
        alert('Template saved successfully!');
        setNewTemplateName('');
        setBuilderFields([
          { label: 'Roll Number', type: 'text', required: true, is_unique_id: true, options: '' },
          { label: 'Student Name', type: 'text', required: true, is_unique_id: false, options: '' }
        ]);
        fetchTemplates();
        setActiveTab('session');
      } else {
        const data = await res.json();
        alert(data.detail || 'Failed to save template');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const getGPSLocation = () => {
    setLocLoading(true);
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by browser.');
      setLocLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          long: pos.coords.longitude
        });
        setLocLoading(false);
      },
      () => {
        alert('Could not grab location. Using default testing coordinates.');
        setLocation({ lat: 28.6139, long: 77.2090 });
        setLocLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleStartSession = async (e) => {
    e.preventDefault();
    if (!location) {
      alert('Please click "📍 Grab Current GPS Location" first!');
      return;
    }

    try {
      const payload = {
        class_id: classId,
        center_lat: location.lat,
        center_long: location.long,
        radius_meters: parseFloat(radiusMeters)
      };

      if (selectedTemplateId) {
        payload.template_id = parseInt(selectedTemplateId);
      }

      const res = await fetch(`${API_BASE_URL}/session/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to start session');
      }

      setActiveSession(data);
      fetchPastSessions();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEndSession = async () => {
    if (!activeSession) return;
    if (!window.confirm('End this attendance session?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/session/${activeSession.session_id}/end`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        alert('Attendance session ended successfully!');
        const currentId = activeSession.session_id;
        const currentClass = activeSession.class_id;
        setActiveSession(null);
        fetchPastSessions();
        if (window.confirm('Would you like to download the Excel sheet for this ended session now?')) {
          downloadExcel(currentId, currentClass);
        }
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const fetchCurrentToken = async (sessionId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/session/${sessionId}/current-token`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentToken(data.qr_token);
        setExpiresIn(data.expires_in_seconds);
      }
    } catch (err) {
      console.error('Error fetching token:', err);
    }
  };

  // --- VIEWS ---

  // VIEW A: PUBLIC STUDENT SCANNING VIEW
  if (scanSessionId) {
    if (studentResult) {
      return (
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 60, marginBottom: 10 }}>🎉</div>
          <h1 className="title" style={{ color: '#4ade80' }}>Attendance Marked!</h1>
          <p className="subtitle">Your attendance has been recorded successfully.</p>
          <div style={{ background: '#0f172a', padding: 20, borderRadius: 12, border: '1px solid #334155', marginTop: 20 }}>
            <div>Status: <strong style={{ color: '#4ade80' }}>{studentResult.status}</strong></div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>Record ID: #{studentResult.record_id}</div>
          </div>
        </div>
      );
    }

    return (
      <div className="container">
        <h1 className="title">Student Attendance Form</h1>
        <p className="subtitle">Scan verified • Session #{scanSessionId}</p>

        {studentError && <div className="alert-error">{studentError}</div>}

        {!studentForm ? (
          <div style={{ textAlign: 'center', padding: 30, color: '#94a3b8' }}>
            Loading attendance form...
          </div>
        ) : !studentForm.is_active ? (
          <div className="alert-error" style={{ textAlign: 'center' }}>
            🔴 This attendance session has ended. Submissions are closed.
          </div>
        ) : (
          <form onSubmit={handleStudentSubmit}>
            <div className="gps-box">
              <button
                type="button"
                onClick={getStudentGPS}
                className="btn"
                style={{ background: studentLoc ? '#16a34a' : '#0284c7', padding: '12px', fontSize: 14 }}
              >
                {studentLocLoading
                  ? 'Fetching Phone Location...'
                  : studentLoc
                  ? '✅ GPS Location Verified'
                  : '📍 Allow & Grab My GPS Location'}
              </button>
              {studentLoc && (
                <div className="gps-coords">
                  Location Captured (Lat: {studentLoc.lat.toFixed(4)}, Long: {studentLoc.long.toFixed(4)})
                </div>
              )}
            </div>

            {studentForm.form_fields.map((field, idx) => (
              <div key={idx} className="form-group">
                <label>
                  {field.label} {field.required ? '*' : ''} {field.is_unique_id ? '(Unique Roll No)' : ''}
                </label>
                {field.type === 'dropdown' ? (
                  <select
                    required={field.required}
                    value={studentResponses[field.label] || ''}
                    onChange={(e) => setStudentResponses({ ...studentResponses, [field.label]: e.target.value })}
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
                    onChange={(e) => setStudentResponses({ ...studentResponses, [field.label]: e.target.value })}
                  />
                )}
              </div>
            ))}

            <button type="submit" className="btn" disabled={studentSubmitting}>
              {studentSubmitting ? 'Submitting...' : '🚀 Submit Attendance'}
            </button>
          </form>
        )}
      </div>
    );
  }

  // VIEW 1: TEACHER LOGIN / SIGNUP FORM
  if (!token) {
    return (
      <div className="container">
        <h1 className="title">Teacher Attendance Portal</h1>
        <p className="subtitle">
          {isSignup ? 'Register a new Teacher account' : 'Sign in to start dynamic geofenced attendance sessions'}
        </p>

        {authError && <div className="alert-error">{authError}</div>}
        {authSuccess && (
          <div style={{ background: '#065f46', color: '#a7f3d0', padding: '12px 16px', borderRadius: 10, fontSize: 14, marginBottom: 20 }}>
            {authSuccess}
          </div>
        )}

        {isSignup ? (
          <form onSubmit={handleSignup}>
            <div className="form-group">
              <label>Teacher Username</label>
              <input
                type="text"
                required
                placeholder="e.g. prof_smith"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                required
                placeholder="prof.smith@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn">Register Account</button>

            <div style={{ textAlign: 'center', marginTop: 18, fontSize: 14, color: '#cbd5e1' }}>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => { setIsSignup(false); setAuthError(''); setAuthSuccess(''); }}
                style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontWeight: 600 }}
              >
                Sign In here
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Teacher Username</label>
              <input
                type="text"
                required
                placeholder="e.g. prof_smith"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn">Sign In</button>

            <div style={{ textAlign: 'center', marginTop: 18, fontSize: 14, color: '#cbd5e1' }}>
              New Teacher?{' '}
              <button
                type="button"
                onClick={() => { setIsSignup(true); setAuthError(''); setAuthSuccess(''); }}
                style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontWeight: 600 }}
              >
                Create an Account
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  // VIEW 3: LIVE ACTIVE SESSION & PROJECTION SCREEN
  if (activeSession) {
    // Dynamic QR scan URL using currently deployed domain (Vercel)
    const qrScanUrl = `${window.location.origin}/?session_id=${activeSession.session_id}&qr_token=${currentToken}`;

    return (
      <div className="container">
        <h1 className="title">Live Attendance Session</h1>
        <p className="subtitle">Project this screen live for students to scan QR</p>

        <div className="qr-card">
          <div style={{ color: '#38bdf8', fontWeight: 700, fontSize: 20 }}>
            Class: {activeSession.class_id}
          </div>
          <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>
            Geofence Radius: {activeSession.radius_meters}m
          </div>

          <div className="qr-wrapper">
            {currentToken ? (
              <QRCodeSVG
                value={qrScanUrl}
                size={230}
                level="H"
                includeMargin={true}
              />
            ) : (
              <div style={{ padding: 40, color: '#000' }}>Loading QR...</div>
            )}
          </div>

          <div>
            <span className="timer-badge">
              ⏱ Rotates in {expiresIn}s
            </span>
          </div>

          <div style={{ marginTop: 16, fontSize: 12, color: '#64748b', wordBreak: 'break-all' }}>
            Scannable Mobile URL: <code style={{ color: '#38bdf8' }}>{qrScanUrl}</code>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button
            onClick={() => downloadExcel(activeSession.session_id, activeSession.class_id)}
            className="btn"
            style={{ background: '#16a34a', flex: 1 }}
          >
            📥 Live Excel Sheet
          </button>
          <button
            onClick={handleEndSession}
            className="btn btn-danger"
            style={{ flex: 1 }}
          >
            🔴 End Session
          </button>
        </div>
      </div>
    );
  }

  // VIEW 2: TEACHER DASHBOARD
  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 className="title" style={{ textAlign: 'left' }}>Teacher Dashboard</h1>
          <p className="subtitle" style={{ textAlign: 'left', marginBottom: 0 }}>Create templates & start live attendance</p>
        </div>
        <button onClick={handleLogout} className="btn-secondary btn-sm">
          Logout
        </button>
      </div>

      <div className="nav-tabs">
        <button
          className={`tab-btn ${activeTab === 'session' ? 'active' : ''}`}
          onClick={() => setActiveTab('session')}
        >
          ⚡ Start Session
        </button>
        <button
          className={`tab-btn ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          📋 Form Templates ({templates.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => { setActiveTab('history'); fetchPastSessions(); }}
        >
          📊 History & Excel
        </button>
      </div>

      {activeTab === 'session' && (
        <div>
          <div className="gps-box">
            <button
              type="button"
              onClick={getGPSLocation}
              className="btn"
              style={{ background: '#0284c7', padding: '10px 16px', fontSize: 14 }}
            >
              {locLoading ? 'Fetching GPS Coordinates...' : '📍 Grab Current GPS Location'}
            </button>

            {location ? (
              <div className="gps-coords">
                Lat: {location.lat.toFixed(6)}, Long: {location.long.toFixed(6)}
              </div>
            ) : (
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 8 }}>
                Click button to capture classroom geofence center coordinates.
              </div>
            )}
          </div>

          <form onSubmit={handleStartSession}>
            <div className="form-group">
              <label>Class ID / Subject Name</label>
              <input
                type="text"
                required
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                placeholder="e.g. CS101-Lecture"
              />
            </div>

            <div className="form-group">
              <label>Geofence Radius (meters)</label>
              <input
                type="number"
                required
                value={radiusMeters}
                onChange={(e) => setRadiusMeters(e.target.value)}
                placeholder="30"
              />
            </div>

            <div className="form-group">
              <label>Select Attendance Form Template</label>
              <select
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
              >
                <option value="">-- Standard Default Form (Roll Number & Name) --</option>
                {templates.map((tpl) => (
                  <option key={tpl.id} value={tpl.id}>
                    📋 {tpl.template_name} ({tpl.fields.length} custom fields)
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn" style={{ marginTop: 10 }}>
              🚀 Start Attendance Session & Display QR
            </button>
          </form>
        </div>
      )}

      {activeTab === 'templates' && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, marginBottom: 12, color: '#cbd5e1' }}>Saved Form Templates</h3>
            {templates.length === 0 ? (
              <div style={{ padding: 16, background: '#0f172a', borderRadius: 10, color: '#94a3b8', fontSize: 13 }}>
                No saved templates yet. Create your first template below!
              </div>
            ) : (
              templates.map((tpl) => (
                <div key={tpl.id} className="template-card">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15, color: '#38bdf8' }}>
                      {tpl.template_name}
                    </div>
                    <div style={{ marginTop: 6 }}>
                      {tpl.fields.map((f, i) => (
                        <span key={i} className="field-badge">
                          {f.label} ({f.type}) {f.is_unique_id ? '🔑 Unique' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteTemplate(tpl.id)}
                    className="btn-danger btn-sm"
                    style={{ borderRadius: 6 }}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>

          <hr style={{ borderColor: '#334155', margin: '24px 0' }} />

          <form onSubmit={handleSaveNewTemplate}>
            <h3 style={{ fontSize: 16, marginBottom: 14, color: '#38bdf8' }}>➕ Build New Attendance Template</h3>

            <div className="form-group">
              <label>Template Name</label>
              <input
                type="text"
                required
                placeholder="e.g. CS 3rd Year Attendance"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 12, fontSize: 13, color: '#cbd5e1', fontWeight: 600 }}>
              Form Fields Builder:
            </div>

            {builderFields.map((field, idx) => (
              <div key={idx} className="field-creator-item">
                <div className="flex-row" style={{ marginBottom: 10 }}>
                  <div style={{ flex: 2 }}>
                    <label>Field Label</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Roll Number, Branch"
                      value={field.label}
                      onChange={(e) => handleFieldChange(idx, 'label', e.target.value)}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <label>Field Type</label>
                    <select
                      value={field.type}
                      onChange={(e) => handleFieldChange(idx, 'type', e.target.value)}
                    >
                      <option value="text">Text Input</option>
                      <option value="number">Number</option>
                      <option value="dropdown">Dropdown</option>
                    </select>
                  </div>
                </div>

                {field.type === 'dropdown' && (
                  <div className="form-group" style={{ marginBottom: 10 }}>
                    <label>Dropdown Options (comma-separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. CSE, ECE, ME, Civil"
                      value={field.options}
                      onChange={(e) => handleFieldChange(idx, 'options', e.target.value)}
                    />
                  </div>
                )}

                <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 8 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, textTransform: 'none', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      style={{ width: 'auto' }}
                      checked={field.is_unique_id}
                      onChange={(e) => handleFieldChange(idx, 'is_unique_id', e.target.checked)}
                    />
                    🔑 Is Unique Student ID (Roll No)?
                  </label>

                  {builderFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveField(idx)}
                      style={{ background: 'transparent', color: '#f87171', border: 'none', cursor: 'pointer', fontSize: 12 }}
                    >
                      Remove Field
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddField}
              className="btn-secondary"
              style={{ marginBottom: 20, fontSize: 13 }}
            >
              ➕ Add Another Field
            </button>

            <button type="submit" className="btn">
              💾 Save Form Template
            </button>
          </form>
        </div>
      )}

      {activeTab === 'history' && (
        <div>
          <h3 style={{ fontSize: 16, marginBottom: 14, color: '#cbd5e1' }}>Past Attendance Sessions</h3>
          {pastSessions.length === 0 ? (
            <div style={{ padding: 16, background: '#0f172a', borderRadius: 10, color: '#94a3b8', fontSize: 13 }}>
              No attendance sessions recorded yet. Start a session to view history!
            </div>
          ) : (
            pastSessions.map((sess) => (
              <div key={sess.session_id} className="template-card">
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15, color: '#38bdf8' }}>
                    Class: {sess.class_id} (Session #{sess.session_id})
                  </div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                    Status: {sess.is_active ? '🟢 ACTIVE LIVE' : '🔴 CLOSED'} | Radius: {sess.radius_meters}m
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                    Started: {new Date(sess.start_time).toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={() => downloadExcel(sess.session_id, sess.class_id)}
                  className="btn btn-sm"
                  style={{ background: '#16a34a', borderRadius: 8 }}
                >
                  📥 Export Excel (.xlsx)
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
