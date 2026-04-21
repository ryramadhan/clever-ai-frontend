import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { GoogleLogin, googleLogout } from "@react-oauth/google";

// detect mobile/tablet devices
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

      navigate("/", { replace: true });
    } catch (err) {
      console.error("[Google Login] Error:", err);
      setError(err.message || "Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-8 animate-fade-in bg-[#0a0a0a]">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white/95">
            Clever AI
          </h1>
          <p className="mt-2 text-sm sm:text-base text-white/40">
            Sign in to continue
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white/60 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-white/[0.06] text-white/90 placeholder:text-white/25 focus:outline-none focus:border-white/[0.15] focus:bg-[#181818] transition-all duration-200"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white/60 mb-2"
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
              className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-white/[0.06] text-white/90 placeholder:text-white/25 focus:outline-none focus:border-white/[0.15] focus:bg-[#181818] transition-all duration-200"
              placeholder="••••••"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-white/40 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-white/[0.15] bg-[#141414] checked:bg-white/90 transition-colors"
              />
              <span className="text-white/50">Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-white/50 hover:text-white/80 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 mt-2 rounded-xl bg-white text-black font-medium text-sm hover:bg-white/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/[0.06]"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 bg-[#0a0a0a] text-xs text-white/30 uppercase tracking-wider">
              Or
            </span>
          </div>
        </div>

        {/* Google Login */}
        <div className="flex flex-col items-center gap-2">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google login failed")}
            theme="outline"
            size="large"
            useOneTap={!isMobile}
          />

          {isMobile && (
            <p className="text-xs text-white/25 text-center max-w-xs">
              Google Login may not work on some mobile browsers
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 space-y-3 text-center">
          <p className="text-sm text-white/40">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-white/70 hover:text-white font-medium transition-colors"
            >
              Sign up
            </Link>
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-white/30 hover:text-white/60 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
