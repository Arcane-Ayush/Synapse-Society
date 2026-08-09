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
        <Route path="/ucn/app/event/launch/state/components/exists/202608100001/users" element={<PageTransition><HiddenPortal /></PageTransition>} />
        <Route path="/ucn/app/event/launch/state/components/exists/202608100001/userslpha" element={<PageTransition><HiddenPortal /></PageTransition>} />

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

