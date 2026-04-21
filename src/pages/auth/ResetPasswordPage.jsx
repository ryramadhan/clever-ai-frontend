import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../services/api.js";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid or expired reset link");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await resetPassword({ token, newPassword });
      setSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  // No token in URL
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-medium text-[var(--color-text-primary)] mb-4">
            Invalid Link
          </h1>
          <p className="text-[var(--color-text-secondary)] mb-6">
            This password reset link is invalid or has expired.
          </p>
          <Link
            to="/forgot-password"
            className="inline-block py-2 px-4 rounded-[var(--radius-md)] bg-[var(--color-white-100)] text-black font-medium hover:bg-[var(--color-white-80)] transition-colors"
          >
            Request new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 animate-fade-in">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-medium tracking-tight text-[var(--color-text-primary)]">
            New password
          </h1>
          <p className="mt-2 text-[var(--color-text-secondary)]">
            Enter your new password below
          </p>
        </div>

        {/* Success */}
        {success && (
          <div className="mb-4 p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)]">
            <p className="text-[var(--color-text-primary)] text-sm">
              Password reset successful! Redirecting to login...
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-[var(--radius-md)] bg-[var(--color-white-04)] border border-[var(--color-border-default)] text-[var(--color-text-primary)] text-sm">
            {error}
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5"
              >
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
              {loading ? "Resetting..." : "Reset password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
