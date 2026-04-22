import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage.jsx";
import DocsPage from "./pages/docs/DocsPage.jsx";
import GuidePage from "./pages/docs/GuidePage.jsx";
import ChangelogPage from "./pages/changelog/ChangelogPage.jsx";
import PrivacyPage from "./pages/legal/PrivacyPage.jsx";
import TermsPage from "./pages/legal/TermsPage.jsx";
import SecurityPage from "./pages/legal/SecurityPage.jsx";
import ScrollToTop from "./components/common/ScrollToTop.jsx";
import AppSkeleton from "./components/common/AppSkeleton.jsx";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AppSkeleton>
            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/guide" element={<GuidePage />} />
            <Route path="/changelog" element={<ChangelogPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/security" element={<SecurityPage />} />
            </Routes>
          </AppSkeleton>
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

