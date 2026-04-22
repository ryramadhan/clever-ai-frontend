import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";

const MIN_LOADING_TIME = 400;

export default function AppSkeleton({ children }) {
  const { loading, isAuthReady } = useAuth();
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    if (isAuthReady && !loading) {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, MIN_LOADING_TIME);
      return () => clearTimeout(timer);
    }
  }, [isAuthReady, loading]);

  if (showLoading) {
    return (
      <div className="h-screen w-full bg-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-white/[0.08]" />
          <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-t-white/60 animate-spin" />
        </div>
        <p className="mt-4 text-sm text-white/60 font-medium tracking-wide">Clever AI</p>
      </div>
    );
  }

  return children;
}
