import { useMemo, useState } from "react";

export default function CopyButton({ text }) {
  const [status, setStatus] = useState("idle"); // idle | copied | error

  const label = useMemo(() => {
    if (status === "copied") return "Copied";
    if (status === "error") return "Failed";
    return "Copy";
  }, [status]);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(text || "");
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 1200);
    } catch {
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 1200);
    }
  }

  const baseClasses = "px-4 py-2 rounded-[10px] font-medium text-sm transition-all duration-200 ease border";
  const activeClasses = "bg-white/10 border-white/20 text-white hover:bg-white/15";
  const copiedClasses = "bg-green-500/20 border-green-500/30 text-green-400";
  const errorClasses = "bg-red-500/20 border-red-500/30 text-red-400";
  const disabledClasses = "opacity-40 cursor-not-allowed border-white/10 text-white/40";

  const classes = `${baseClasses} ${
    !text ? disabledClasses :
    status === "copied" ? copiedClasses :
    status === "error" ? errorClasses :
    activeClasses
  }`;

  return (
    <button
      type="button"
      className={classes}
      onClick={onCopy}
      disabled={!text}
    >
      {label}
    </button>
  );
}

