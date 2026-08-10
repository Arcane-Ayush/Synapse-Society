import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Layout } from './layouts/Layout';
import { Home } from './pages/Home';
import { Activities } from './pages/Activities';
import { Projects } from './pages/Projects';
import { Nexus } from './pages/Nexus';
import { About } from './pages/About';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { HiddenPortal } from './pages/HiddenPortal';
import { Inauguration } from './pages/Inauguration';
import { AttendeePortal } from './event/AttendeePortal';
import { EventAdmin } from './event/EventAdmin';
import { StagePresentation } from './event/StagePresentation';
import { VolunteerPortal } from './event/VolunteerPortal';
import { EventAudio } from './event/EventAudio';
import { PageTransition } from './components/PageTransition';
import { AuthProvider } from './contexts/AuthContext';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/activities" element={<PageTransition><Activities /></PageTransition>} />
        <Route path="/projects" element={<PageTransition><Projects /></PageTransition>} />
        <Route path="/nexus" element={<PageTransition><Nexus /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
        <Route path="/hiddenportal" element={<PageTransition><HiddenPortal /></PageTransition>} />

        {/* Neural Nexus Live Event Attendee Portal (Printed QR Routes) */}
        <Route path="/ucn/app/event/launch" element={<PageTransition><AttendeePortal /></PageTransition>} />
        <Route path="/ucn/app/event/launch/state/components/exists/202608100001/users" element={<PageTransition><AttendeePortal /></PageTransition>} />
        <Route path="/ucn/app/event/launch/state/components/exists/202608100001/userslpha" element={<PageTransition><AttendeePortal /></PageTransition>} />
        <Route path="/users" element={<PageTransition><AttendeePortal /></PageTransition>} />

        {/* Neural Nexus Ground Crew & Volunteer Portal */}
        <Route path="/volunteer" element={<PageTransition><VolunteerPortal /></PageTransition>} />
        <Route path="/event_volunteer" element={<PageTransition><VolunteerPortal /></PageTransition>} />
        <Route path="/volunteers" element={<PageTransition><VolunteerPortal /></PageTransition>} />

        {/* Neural Nexus Live Event Admin Mission Control */}
        <Route path="/ucn/app/event/launch/state/components/exists/202608100001/event_admin" element={<PageTransition><EventAdmin /></PageTransition>} />
        <Route path="/event-admin" element={<PageTransition><EventAdmin /></PageTransition>} />

        {/* Neural Nexus Audio Mixer */}
        <Route path="/event-audio" element={<PageTransition><EventAudio /></PageTransition>} />

        {/* Neural Nexus Main Widescreen Stage & Presentation Screen */}
        <Route path="/stage" element={<PageTransition><StagePresentation /></PageTransition>} />
        <Route path="/presentation" element={<PageTransition><StagePresentation /></PageTransition>} />

        {/* Dignitary & Ceremonial Inauguration Routes */}
        <Route path="/inauguration" element={<PageTransition><Inauguration /></PageTransition>} />
        <Route path="/inauguration/:dignitary" element={<PageTransition><Inauguration /></PageTransition>} />
        <Route path="/hod" element={<PageTransition><Inauguration /></PageTransition>} />
        <Route path="/dean" element={<PageTransition><Inauguration /></PageTransition>} />
        <Route path="/provc" element={<PageTransition><Inauguration /></PageTransition>} />
        <Route path="/president" element={<PageTransition><Inauguration /></PageTransition>} />
        <Route path="/audience" element={<PageTransition><Inauguration /></PageTransition>} />
        <Route path="/synapse/admin/portal/2026/inauguration/:dignitary" element={<PageTransition><Inauguration /></PageTransition>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('synapse_theme') || 'dark';
    if (savedTheme === 'orange') {
      document.documentElement.setAttribute('data-theme', 'orange');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
