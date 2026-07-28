import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Layout } from './layouts/Layout';
import { Home } from './pages/Home';
import { Activities } from './pages/Activities';
import { Projects } from './pages/Projects';
import { Nexus } from './pages/Nexus';
import { About } from './pages/About';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
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
      </Routes>
    </AnimatePresence>
  );
}

function App() {
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
