import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import HomePage from './components/HomePage';
import LoginSignup from './components/LoginSignup';
import TeacherDashboard from './components/TeacherDashboard';
import LiveQRSession from './components/LiveQRSession';
import TemplateBuilder from './components/TemplateBuilder';
import StudentAttendanceForm from './components/StudentAttendanceForm';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function MainApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const scanSessionId = searchParams.get('session_id');
  const scanQrToken = searchParams.get('qr_token');

  // --- STUDENT SCANNER STATE ---
  const [studentForm, setStudentForm] = useState(null);
  const [studentResponses, setStudentResponses] = useState({});
  const [studentLoc, setStudentLoc] = useState(null);
  const [studentLocLoading, setStudentLocLoading] = useState(false);
  const [studentSubmitting, setStudentSubmitting] = useState(false);
  const [studentResult, setStudentResult] = useState(null);
  const [studentError, setStudentError] = useState('');

  // --- THEME STATE (LIGHT / NIGHT MODE) ---
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('rollqr_theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('rollqr_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // --- TEACHER PORTAL STATE ---
  const [token, setToken] = useState(localStorage.getItem('teacher_token') || '');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  const [teacherLoc, setTeacherLoc] = useState(null);
  const [teacherLocLoading, setTeacherLocLoading] = useState(false);
  const [classId, setClassId] = useState('CS301');
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

  const googleSigninButtonRef = useRef(null);

  const getTeacherName = () => {
    if (!token) return 'Teacher';
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return payload.sub || 'Teacher';
    } catch (e) {
      return 'Teacher';
    }
  };

  const getDeviceId = () => {
    let devId = localStorage.getItem('student_device_id');
    if (!devId) {
      devId = 'dev_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('student_device_id', devId);
    }
    return devId;
  };

  // 1. Fetch public form if URL contains session_id
  useEffect(() => {
    if (scanSessionId) {
      fetchPublicForm(scanSessionId);
    }
  }, [scanSessionId]);

  // 2. Fetch teacher data on token update
  useEffect(() => {
    if (token && !scanSessionId) {
      fetchTemplates();
      fetchPastSessions();
    }
  }, [token, scanSessionId]);

  // 3. Poll active session token
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

  // --- API HANDLERS: STUDENT ---

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

  // --- API HANDLERS: TEACHER AUTH ---

  const handleLogin = async ({ username, password }) => {
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
      navigate('/');
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleSignup = async ({ username, email, password }) => {
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
      setAuthSuccess('Teacher account created successfully! Please log in.');
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('teacher_token');
    setActiveSession(null);
    navigate('/');
  };

  const handleGoogleCredentialResponse = async (response) => {
    setAuthError('');
    setAuthSuccess('');
    try {
      const res = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token: response.credential })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Google sign-in failed');
      }
      setToken(data.access_token);
      localStorage.setItem('teacher_token', data.access_token);
      navigate('/');
    } catch (err) {
      setAuthError(err.message);
    }
  };

  useEffect(() => {
    if (!token && GOOGLE_CLIENT_ID && window.google && location.pathname === '/login') {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredentialResponse
      });
      const btnDiv = document.getElementById('google-signin-button');
      if (btnDiv) {
        btnDiv.innerHTML = '';
        window.google.accounts.id.renderButton(btnDiv, {
          theme: 'outline',
          size: 'large',
          width: 320
        });
      }
    }
  }, [token, location.pathname]);

  // --- API HANDLERS: TEACHER DASHBOARD & SESSIONS ---

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
        a.download = `Attendance_${className || 'Session'}_${sessionId}.xlsx`;
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
        navigate('/dashboard');
      } else {
        const data = await res.json();
        alert(data.detail || 'Failed to save template');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const getGPSLocation = () => {
    setTeacherLocLoading(true);
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by browser.');
      setTeacherLocLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setTeacherLoc({
          lat: pos.coords.latitude,
          long: pos.coords.longitude
        });
        setTeacherLocLoading(false);
      },
      () => {
        alert('Could not grab location. Using default testing coordinates.');
        setTeacherLoc({ lat: 28.6139, long: 77.2090 });
        setTeacherLocLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleStartSession = async (e) => {
    if (e) e.preventDefault();
    if (!teacherLoc) {
      alert('Please click "📍 Capture GPS Center" first!');
      return;
    }

    try {
      const payload = {
        class_id: classId,
        center_lat: teacherLoc.lat,
        center_long: teacherLoc.long,
        radius_meters: parseFloat(radiusMeters),
        teacher_lat: teacherLoc.lat,
        teacher_long: teacherLoc.long
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
      navigate('/live');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEndSession = async () => {
    if (!activeSession) return;

    try {
      const res = await fetch(`${API_BASE_URL}/session/${activeSession.session_id}/end`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const currentId = activeSession.session_id;
        const currentClass = activeSession.class_id;
        setActiveSession(null);
        fetchPastSessions();
        if (window.confirm('Would you like to download the Excel sheet for this ended session now?')) {
          downloadExcel(currentId, currentClass);
        }
        navigate('/dashboard');
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

  // If scanSessionId is present in URL, force Student Attendance view
  if (scanSessionId) {
    return (
      <StudentAttendanceForm
        scanSessionId={scanSessionId}
        studentForm={studentForm}
        studentResponses={studentResponses}
        setStudentResponses={setStudentResponses}
        studentLoc={studentLoc}
        studentLocLoading={studentLocLoading}
        studentSubmitting={studentSubmitting}
        studentResult={studentResult}
        studentError={studentError}
        onGetStudentGPS={getStudentGPS}
        onSubmitStudentAttendance={handleStudentSubmit}
      />
    );
  }

  // Application Routes with Smooth Page Transitions
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="min-h-screen"
      >
        <Routes location={location}>
          <Route
            path="/"
            element={
              <HomePage
                token={token}
                teacherName={getTeacherName()}
                activeSession={activeSession}
                pastSessions={pastSessions}
                templates={templates}
                location={teacherLoc}
                locLoading={teacherLocLoading}
                classId={classId}
                setClassId={setClassId}
                radiusMeters={radiusMeters}
                setRadiusMeters={setRadiusMeters}
                selectedTemplateId={selectedTemplateId}
                setSelectedTemplateId={setSelectedTemplateId}
                onGetGPSLocation={getGPSLocation}
                onStartSession={handleStartSession}
                onEndSession={handleEndSession}
                onOpenLiveSession={() => navigate('/live')}
                onNavigateDashboard={() => navigate('/dashboard')}
                onNavigateSessions={() => navigate('/live')}
                onNavigateTemplates={() => navigate('/templates')}
                onNavigateLogin={() => navigate(token ? '/' : '/login')}
                onNavigateSignup={() => navigate('/login')}
                onLogout={handleLogout}
                theme={theme}
                onToggleTheme={toggleTheme}
              />
            }
          />
          <Route
            path="/login"
            element={
              <LoginSignup
                onLogin={handleLogin}
                onSignup={handleSignup}
                authError={authError}
                authSuccess={authSuccess}
                googleClientId={GOOGLE_CLIENT_ID}
                googleSigninButtonRef={googleSigninButtonRef}
                theme={theme}
                onToggleTheme={toggleTheme}
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              token ? (
                <TeacherDashboard
                  teacherName={getTeacherName()}
                  templates={templates}
                  pastSessions={pastSessions}
                  activeSession={activeSession}
                  location={teacherLoc}
                  locLoading={teacherLocLoading}
                  classId={classId}
                  setClassId={setClassId}
                  radiusMeters={radiusMeters}
                  setRadiusMeters={setRadiusMeters}
                  selectedTemplateId={selectedTemplateId}
                  setSelectedTemplateId={setSelectedTemplateId}
                  onGetGPSLocation={getGPSLocation}
                  onStartSession={handleStartSession}
                  onEndSession={handleEndSession}
                  onOpenLiveSession={() => navigate('/live')}
                  onNavigateTab={(tab) => {
                    if (tab === 'templates') navigate('/templates');
                    else if (tab === 'live-session') navigate('/live');
                    else if (tab === 'history' || tab === 'dashboard') navigate('/dashboard');
                  }}
                  onNavigateHome={() => navigate('/')}
                  onDownloadExcel={downloadExcel}
                  onLogout={handleLogout}
                  theme={theme}
                  onToggleTheme={toggleTheme}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/live"
            element={
              token ? (
                activeSession ? (
                  <LiveQRSession
                    activeSession={activeSession}
                    currentToken={currentToken}
                    expiresIn={expiresIn}
                    onEndSession={handleEndSession}
                    onDownloadExcel={downloadExcel}
                    onNavigateDashboard={() => navigate('/dashboard')}
                    onNavigateHome={() => navigate('/')}
                    theme={theme}
                    onToggleTheme={toggleTheme}
                  />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/templates"
            element={
              token ? (
                <TemplateBuilder
                  teacherName={getTeacherName()}
                  templates={templates}
                  newTemplateName={newTemplateName}
                  setNewTemplateName={setNewTemplateName}
                  builderFields={builderFields}
                  setBuilderFields={setBuilderFields}
                  onAddField={handleAddField}
                  onRemoveField={handleRemoveField}
                  onFieldChange={handleFieldChange}
                  onSaveTemplate={handleSaveNewTemplate}
                  onDeleteTemplate={handleDeleteTemplate}
                  onNavigateDashboard={() => navigate('/dashboard')}
                  onNavigateHome={() => navigate('/')}
                  onLogout={handleLogout}
                  theme={theme}
                  onToggleTheme={toggleTheme}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/scan"
            element={
              <StudentAttendanceForm
                scanSessionId={scanSessionId}
                studentForm={studentForm}
                studentResponses={studentResponses}
                setStudentResponses={setStudentResponses}
                studentLoc={studentLoc}
                studentLocLoading={studentLocLoading}
                studentSubmitting={studentSubmitting}
                studentResult={studentResult}
                studentError={studentError}
                onGetStudentGPS={getStudentGPS}
                onSubmitStudentAttendance={handleStudentSubmit}
                theme={theme}
                onToggleTheme={toggleTheme}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}
