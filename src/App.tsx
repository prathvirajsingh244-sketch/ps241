import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import AssessmentPage from './pages/AssessmentPage';
import AssessmentResult from './pages/AssessmentResult';
import CareerDetails from './pages/CareerDetails';
import CareerDirectory from './pages/CareerDirectory';
import CareerVideos from './pages/CareerVideos';
import CounsellingChat from './pages/CounsellingChat';
import CounsellorQueue from './pages/CounsellorQueue';
import CounsellorRequest from './pages/CounsellorRequest';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import MeetingDetail from './pages/MeetingDetail';
import MyRequests from './pages/MyRequests';
import ProfilePage from './pages/ProfilePage';
import SignupPage from './pages/SignupPage';
import SkillJobMap from './pages/SkillJobMap';
import AdminCareers from './pages/admin/AdminCareers';
import AdminLocations from './pages/admin/AdminLocations';
import AdminOverview from './pages/admin/AdminOverview';
import AdminRequests from './pages/admin/AdminRequests';
import AdminSources from './pages/admin/AdminSources';
import AdminVideos from './pages/admin/AdminVideos';

function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/careers" element={<CareerDirectory />} />
        <Route path="/careers/:id" element={<CareerDetails />} />
        <Route path="/assessment" element={<AssessmentPage />} />
        <Route path="/assessment/result" element={<AssessmentResult />} />
        <Route path="/counselling" element={<CounsellingChat />} />
        <Route path="/map" element={<SkillJobMap />} />
        <Route path="/videos" element={<CareerVideos />} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/counsellor-request" element={<ProtectedRoute><CounsellorRequest /></ProtectedRoute>} />
        <Route path="/my-requests" element={<ProtectedRoute><MyRequests /></ProtectedRoute>} />
        <Route path="/meeting/:id" element={<ProtectedRoute><MeetingDetail /></ProtectedRoute>} />
        <Route path="/counsellor/requests" element={<ProtectedRoute allowedRoles={['counsellor', 'admin']}><CounsellorQueue /></ProtectedRoute>} />

        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminOverview /></ProtectedRoute>} />
        <Route path="/admin/careers" element={<ProtectedRoute allowedRoles={['admin']}><AdminCareers /></ProtectedRoute>} />
        <Route path="/admin/locations" element={<ProtectedRoute allowedRoles={['admin']}><AdminLocations /></ProtectedRoute>} />
        <Route path="/admin/sources" element={<ProtectedRoute allowedRoles={['admin']}><AdminSources /></ProtectedRoute>} />
        <Route path="/admin/videos" element={<ProtectedRoute allowedRoles={['admin']}><AdminVideos /></ProtectedRoute>} />
        <Route path="/admin/requests" element={<ProtectedRoute allowedRoles={['admin']}><AdminRequests /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}
