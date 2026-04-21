import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../services/api.js";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to send reset email");
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
            Reset password
          </h1>
          <p className="mt-2 text-[var(--color-text-secondary)]">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {/* Success */}
        {success && (
          <div className="mb-4 p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)]">
            <p className="text-[var(--color-text-primary)] text-sm">
              If an account exists with this email, you will receive password reset instructions shortly.
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-[var(--radius-md)] bg-[var(--color-white-100)] text-black font-medium hover:bg-[var(--color-white-80)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}

        {/* Footer */}
        <p className="mt-8 text-center text-[var(--color-text-secondary)] text-sm">
          Remember your password?{" "}
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
