import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
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
    <div className="min-h-screen flex items-center justify-center px-4 animate-fade-in">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-medium tracking-tight text-[var(--color-text-primary)]">
            Create account
          </h1>
          <p className="mt-2 text-[var(--color-text-secondary)]">
            Start your journey today
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
              htmlFor="name"
              className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-strong)] transition-colors"
              placeholder="Your name"
            />
          </div>

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
              placeholder="Min 6 characters"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5"
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
              className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-strong)] transition-colors"
              placeholder="••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-[var(--radius-md)] bg-[var(--color-white-100)] text-black font-medium hover:bg-[var(--color-white-80)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create account"}
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
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google login failed")}
            theme="outline"
            size="large"
          />
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-[var(--color-text-secondary)] text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[var(--color-text-primary)] hover:underline"
          >
            Sign in
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
