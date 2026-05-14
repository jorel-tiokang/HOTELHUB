import React from "react";

export default function Footer() {
  return (
    <footer className="backdrop-blur-md w-full bg-[var(--blue)]/20 py-3 px-6 border-t border-gray-200">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-4">
        <div className="flex items-center gap-3">
          
          <img
            src="/hotelhublogo.png"
            alt="HotelHub Logo"
            className="w-10 h-10 object-contain rounded-lg"
          />
          <div className="flex flex-col">
            
            <h1 className="text-[color:var(--blue)] font-black leading-none text-xl tracking-tight">
              HOTELHUB
            </h1>
            <span className="text-[0.8rem] text-gray-500 font-medium mt-1">
              Plateforme de réservation temps réel
            </span>
          </div>
        </div>

        <nav className="flex items-center text-sm font-medium text-gray-600">
          <div className="px-8 border-l border-gray-300">
            <a href="#" className="text-[#000] hover:text-[#26215c] transition-colors">
              Contact
            </a>
          </div>
          <div className="px-8 border-l border-gray-300">
            <a href="#" className="text-[#000] hover:text-[#26215c] transition-colors">
              Aide
            </a>
          </div>
          <div className="px-8 border-l border-gray-300"></div>
        </nav>

        <div className="flex flex-col items-end gap-1">
          <span className="text-[0.75rem] font-bold text-gray-800 mr-1">
            Rejoignez-nous
          </span>
          <div className="flex items-center gap-3">
            {/* Facebook */}
            <a href="#" className="text-blue-600 hover:opacity-80">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            {/* WhatsApp */}
            <a href="#" className="text-emerald-500 hover:opacity-80">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-7.6 8.38 8.38 0 0 1 3.8.9L22 2l-1.5 6.5Z" />
              </svg>
            </a>
            {/* Telegram (Bleu indigo comme sur ton image) */}
            <a href="#" className="text-[#3C3489] hover:opacity-80">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polyline points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </a>
            {/* TikTok */}
            <a href="#" className="text-black hover:opacity-80">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
