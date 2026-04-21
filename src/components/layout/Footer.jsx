import { Link } from "react-router-dom";

export default function Footer({
  onChatClick,
  onHistoryClick,
  githubUrl = "https://github.com/ryramadhan/moodwrite-ai-frontend",
}) {

  const doormatNav = [
    {
      title: "Product",
      links: [
        { label: "Chat", to: "/", onClick: onChatClick },
        { label: "History", action: onHistoryClick },
        { label: "API", to: "/docs" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", to: "/guide" },
        { label: "Changelog", to: "/changelog" },
        { label: "GitHub", href: githubUrl, external: true },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy", to: "/privacy" },
        { label: "Terms", to: "/terms" },
        { label: "Security", to: "/security" },
      ],
    },
  ];

  const socialLinks = [
    { label: "X", href: "#" },
    { label: "IG", href: "#" },
    { label: "GH", href: "#" },
    { label: "LI", href: "#" },
  ];

  return (
    <footer className="py-10 px-4 sm:px-6 border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto">
        {/* Top Section - Newsletter */}
        <div className="mb-10 pb-8 border-b border-white/[0.04]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-white/80">
                Dapatkan update fitur terbaru
              </p>
              <p className="text-xs text-white/40 mt-1">
                Tips AI dan fitur baru untuk produktivitas kamu
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder="email@example.com"
                className="flex-1 sm:w-64 px-3 py-2 text-sm bg-white/[0.04] border border-white/[0.08] rounded-lg text-white/80 placeholder:text-white/30 focus:outline-none focus:border-white/[0.15]"
              />
              <button className="px-4 py-2 text-xs font-medium bg-white text-black rounded-lg hover:bg-white/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Main Content - Doormat Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-sm font-medium text-white/80 mb-3">
              Clever AI
            </p>
            <p className="text-xs text-white/40 leading-relaxed">
              AI Assistant untuk membantu kamu berkreasi dengan ide-ide menarik. Chat dengan AI secara real-time dengan streaming response.
            </p>
          </div>

          {/* Navigation Columns */}
          {doormatNav.map((section) => (
            <div key={section.title}>
              <p className="text-xs font-medium text-white/60 uppercase tracking-wider mb-3">
                {section.title}
              </p>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      // External link: use <a>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-white/40 hover:text-white/70 transition-colors duration-200 inline-flex items-center gap-1"
                      >
                        {link.label}
                        <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ) : link.to ? (
                      // Internal navigation: use <Link>
                      <Link
                        to={link.to}
                        onClick={link.onClick}
                        className="text-xs text-white/40 hover:text-white/70 transition-colors duration-200 inline-flex items-center gap-1"
                      >
                        {link.label}
                      </Link>
                    ) : link.action ? (
                      // Action (like toggle): use <button>
                      <button
                        onClick={link.action}
                        className="text-xs text-white/40 hover:text-white/70 transition-colors duration-200 inline-flex items-center gap-1 bg-transparent border-0 p-0 cursor-pointer"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <span className="text-xs text-white/30 inline-flex items-center gap-1">
                        {link.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section - Connect */}
        <div className="pt-6 border-t border-white/[0.04]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/40">Connect</span>
              <div className="flex gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-8 h-8 flex items-center justify-center text-xs font-medium text-white/50 bg-white/[0.04] border border-white/[0.06] rounded-full hover:text-white/80 hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-200"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Back to Top */}
            <Link
              to="/"
              onClick={() => {
                const mainContainer = document.querySelector('main .overflow-y-auto');
                const fallbackContainer = document.querySelector('.overflow-y-auto');
                const heroSection = document.querySelector('section');

                if (mainContainer) {
                  mainContainer.scrollTo({ top: 0, behavior: "smooth" });
                } else if (fallbackContainer) {
                  fallbackContainer.scrollTo({ top: 0, behavior: "smooth" });
                } else if (heroSection) {
                  heroSection.scrollIntoView({ behavior: "smooth" });
                } else {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors duration-200 group"
            >
              <span>Back to top</span>
              <svg
                className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
