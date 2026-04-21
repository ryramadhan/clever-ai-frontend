import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { GoogleLogin } from "@react-oauth/google";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, googleAuth } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await register({ name, email, password });
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setLoading(true);

    try {
      await googleAuth(credentialResponse.credential);
      navigate("/");
    } catch (err) {
      setError(err.message || "Google login failed");
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
            Join Clever AI
          </h1>
          <p className="mt-2 text-sm sm:text-base text-white/40">
            Create an account to get started
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
              htmlFor="name"
              className="block text-sm font-medium text-white/60 mb-2"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-white/[0.06] text-white/90 placeholder:text-white/25 focus:outline-none focus:border-white/[0.15] focus:bg-[#181818] transition-all duration-200"
              placeholder="Your name"
            />
          </div>

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
              placeholder="Min 6 characters"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-white/60 mb-2"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-white/[0.06] text-white/90 placeholder:text-white/25 focus:outline-none focus:border-white/[0.15] focus:bg-[#181818] transition-all duration-200"
              placeholder="••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 mt-2 rounded-xl bg-white text-black font-medium text-sm hover:bg-white/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {loading ? "Creating account..." : "Create account"}
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
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google login failed")}
            theme="outline"
            size="large"
          />
        </div>

        {/* Footer */}
        <div className="mt-8 space-y-3 text-center">
          <p className="text-sm text-white/40">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-white/70 hover:text-white font-medium transition-colors"
            >
              Sign in
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
