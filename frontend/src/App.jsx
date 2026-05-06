import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './Pages/Login';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import Projects from './Pages/Projects';
import Register from './Pages/Register';
import Features from './Pages/Features';
import Layout from './Components/Layout/Layout';
import TestCases from './Pages/TestCase';
import TestScripts from './Pages/TestScript';
import UserProfilePage from './Pages/UserProfile';
import UserVerificationPage from './Pages/UserVerification';
import ForgotPasswordPage from './Pages/ForgetPassword';
import { Toaster } from 'sonner';
import {useAuth} from './Context/AuthContext'

function RootRedirect() {
  const { isAuth, loading } = useAuth();
  if (loading) return null;
  return isAuth ? <Navigate to="/projects" replace /> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<UserVerificationPage />} />
          <Route path="/forget-password" element={<ForgotPasswordPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/projects" element={<Projects />} />
              <Route path="/user-profile" element={<UserProfilePage />} />
              <Route path="/projects/:projectId/features" element={<Features />} />
              <Route path="/projects/:projectId/features/:featureId/test-cases" element={<TestCases />} />
              <Route path="/projects/:projectId/features/:featureId/test-cases/:testcaseId/scripts" element={<TestScripts />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;