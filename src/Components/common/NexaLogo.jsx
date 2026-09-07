import React from 'react';
import { Link } from 'react-router-dom';

export default function NexaLogo({ className = '' }) {
  return (
    <Link
      to="/"
      className={`inline-flex items-center select-none group shrink-0 ${className}`}
      aria-label="Nexa Home"
    >
      <svg
        width="186"
        height="38"
        viewBox="0 0 186 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[180px] sm:w-[186px] h-auto"
      >
        {/* Brand Icon Mark */}
        <rect
          x="1"
          y="1"
          width="36"
          height="36"
          rx="12"
          fill="url(#nexa_grad)"
          className="transition-transform group-hover:scale-105"
        />
        {/* Modern Stylized 'N' & Compass Star in Icon */}
        <path
          d="M12 26V12L20 22V12M20 22L26 26V12"
          stroke="white"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="26" cy="12" r="2.25" fill="#FDB022" />

        {/* Wordmark "Nexa" */}
        <text
          x="48"
          y="26"
          fill="currentColor"
          className="text-[#111827] dark:text-white font-black"
          style={{
            fontFamily: "'Google Sans', 'Product Sans', sans-serif",
            fontSize: '24px',
            fontWeight: '800',
            letterSpacing: '-0.03em',
          }}
        >
          Nexa
        </text>

        {/* Sub-brand pill badge "Ask & Found" */}
        <rect
          x="112"
          y="10"
          width="68"
          height="18"
          rx="9"
          fill="#EFF4FF"
          className="dark:fill-blue-950/70"
        />
        <text
          x="146"
          y="22.5"
          textAnchor="middle"
          fill="#155EEF"
          className="dark:text-blue-400 font-bold"
          style={{
            fontFamily: "'Google Sans', 'Product Sans', sans-serif",
            fontSize: '9px',
            fontWeight: '700',
            letterSpacing: '0.02em',
          }}
        >
          Ask & Found
        </text>

        <defs>
          <linearGradient
            id="nexa_grad"
            x1="1"
            y1="1"
            x2="37"
            y2="37"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#155EEF" />
            <stop offset="1" stopColor="#004EEB" />
          </linearGradient>
        </defs>
      </svg>
    </Link>
  );
}
