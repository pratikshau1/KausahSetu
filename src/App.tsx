import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import SplashScreen from './components/SplashScreen';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';

// Seeker Pages
import SeekerDashboard from './pages/seeker/SeekerDashboard';
import SeekerProfile from './pages/seeker/SeekerProfile';
import JobListings from './pages/seeker/JobListings';
import JobDetails from './pages/seeker/JobDetails';
import MyApplications from './pages/seeker/MyApplications';
import Offers from './pages/seeker/Offers';

import SkillGapSuggestions from './pages/seeker/SkillGapSuggestions';
import SeekerRatingsPage from './pages/seeker/RatingsPage';

// Business Pages
import BusinessDashboard from './pages/business/BusinessDashboard';
import BusinessProfile from './pages/business/BusinessProfile';
import PostJob from './pages/business/PostJob';
import ManageJobs from './pages/business/ManageJobs';
import Applicants from './pages/business/Applicants';
import InterviewScheduling from './pages/business/InterviewScheduling';
import BusinessRatingsPage from './pages/business/RatingsPage';


function AppContent() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<AboutPage />} />

            {/* Job Seeker Protected Routes */}
            <Route path="/seeker" element={
              <ProtectedRoute allowedRoles={['Job Seeker']}>
                <SeekerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/seeker/profile" element={
              <ProtectedRoute allowedRoles={['Job Seeker']}>
                <SeekerProfile />
              </ProtectedRoute>
            } />
            <Route path="/seeker/jobs" element={
              <ProtectedRoute allowedRoles={['Job Seeker']}>
                <JobListings />
              </ProtectedRoute>
            } />
            <Route path="/seeker/jobs/:id" element={
              <ProtectedRoute allowedRoles={['Job Seeker']}>
                <JobDetails />
              </ProtectedRoute>
            } />
            <Route path="/seeker/applications" element={
              <ProtectedRoute allowedRoles={['Job Seeker']}>
                <MyApplications />
              </ProtectedRoute>
            } />
            <Route path="/seeker/offers" element={
              <ProtectedRoute allowedRoles={['Job Seeker']}>
                <Offers />
              </ProtectedRoute>
            } />

            <Route path="/seeker/guidance" element={
              <ProtectedRoute allowedRoles={['Job Seeker']}>
                <SkillGapSuggestions />
              </ProtectedRoute>
            } />
            <Route path="/seeker/ratings" element={
              <ProtectedRoute allowedRoles={['Job Seeker']}>
                <SeekerRatingsPage />
              </ProtectedRoute>
            } />

            {/* Business Protected Routes */}
            <Route path="/business" element={
              <ProtectedRoute allowedRoles={['Business']}>
                <BusinessDashboard />
              </ProtectedRoute>
            } />
            <Route path="/business/profile" element={
              <ProtectedRoute allowedRoles={['Business']}>
                <BusinessProfile />
              </ProtectedRoute>
            } />
            <Route path="/business/post" element={
              <ProtectedRoute allowedRoles={['Business']}>
                <PostJob />
              </ProtectedRoute>
            } />
            <Route path="/business/jobs" element={
              <ProtectedRoute allowedRoles={['Business']}>
                <ManageJobs />
              </ProtectedRoute>
            } />
            <Route path="/business/applicants" element={
              <ProtectedRoute allowedRoles={['Business']}>
                <Applicants />
              </ProtectedRoute>
            } />
            <Route path="/business/interviews/:appId" element={
              <ProtectedRoute allowedRoles={['Business']}>
                <InterviewScheduling />
              </ProtectedRoute>
            } />
            <Route path="/business/ratings" element={
              <ProtectedRoute allowedRoles={['Business']}>
                <BusinessRatingsPage />
              </ProtectedRoute>
            } />


            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
        {/* Floating Voice Assistant removed */}
      </BrowserRouter>
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
