import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { GoogleLogin, googleLogout } from "@react-oauth/google";

// Detect mobile/tablet devices
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, googleAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setLoading(true);

    try {
      console.log("[Google Login] Token received, sending to backend...");
      const result = await googleAuth(credentialResponse.credential);
      console.log("[Google Login] Success:", result.user?.email);
      
      // Navigate to home after successful login
      navigate("/", { replace: true });
    } catch (err) {
      console.error("[Google Login] Error:", err);
      setError(err.message || "Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 animate-fade-in">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-medium tracking-tight text-[var(--color-text-primary)]">
            Welcome back
          </h1>
          <p className="mt-2 text-[var(--color-text-secondary)]">
            Sign in to continue
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-[var(--radius-md)] bg-[var(--color-white-04)] border border-[var(--color-border-default)] text-[var(--color-text-primary)] text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-strong)] transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-strong)] transition-colors"
              placeholder="••••••"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-[var(--color-text-secondary)]">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-[var(--color-border-default)] bg-[var(--color-bg-secondary)]"
              />
              Remember me
            </label>
            <Link
              to="/forgot-password"
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-[var(--radius-md)] bg-[var(--color-white-100)] text-black font-medium hover:bg-[var(--color-white-80)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--color-border-default)]"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[var(--color-bg-primary)] text-[var(--color-text-muted)]">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Login */}
        <div className="flex flex-col items-center gap-3">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google login failed")}
            theme="outline"
            size="large"
            useOneTap={!isMobile} // Disable One Tap on mobile (unsupported)
          />
          
          {/* Mobile notice - subtle */}
          {isMobile && (
            <p className="text-xs text-white/30 text-center max-w-xs">
              Jika Google Login tidak berfungsi di mobile, silakan daftar dengan Email/Password
            </p>
          )}
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-[var(--color-text-secondary)] text-sm">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-[var(--color-text-primary)] hover:underline"
          >
            Sign up
          </Link>
        </p>

        {/* Back to home */}
        <p className="mt-4 text-center">
          <Link
            to="/"
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] text-sm transition-colors"
          >
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
