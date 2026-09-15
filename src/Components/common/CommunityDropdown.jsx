import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function CommunityDropdown({ isMobile = false, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const location = useLocation();

  const isCommunityActive =
    location.pathname.startsWith('/community') ||
    location.pathname.startsWith('/questions') ||
    location.pathname.startsWith('/lost-found');

  // Handle click outside for mobile or keyboard
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Desktop hover handlers
  const handleMouseEnter = () => {
    if (!isMobile) setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (!isMobile) setIsOpen(false);
  };

  // Click toggle (primarily for mobile)
  const handleClickToggle = (e) => {
    e.preventDefault();
    setIsOpen((prev) => !prev);
  };

  const handleItemClick = () => {
    setIsOpen(false);
    if (onNavigate) onNavigate();
  };

  if (isMobile) {
    return (
      <div className="w-full" ref={containerRef}>
        <button
          type="button"
          onClick={handleClickToggle}
          className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-[15px] font-medium transition-colors select-none ${
            isCommunityActive
              ? 'text-[#155EEF] font-semibold bg-blue-50/70 dark:bg-blue-950/40'
              : 'text-[#111827] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <span>Community</span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-[#155EEF]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#667085]" />
          )}
        </button>

        {isOpen && (
          <div className="pl-4 pr-2 py-1 space-y-1">
            <NavLink
              to="/community/questions"
              onClick={handleItemClick}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#F5F8FF] text-[#155EEF] font-semibold dark:bg-blue-950/50 dark:text-blue-400'
                    : 'text-[#475467] dark:text-slate-300 hover:bg-[#F5F8FF] hover:text-[#155EEF] dark:hover:bg-slate-800'
                }`
              }
            >
              Question & Answer
            </NavLink>
            <NavLink
              to="/community/lost-found"
              onClick={handleItemClick}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#F5F8FF] text-[#155EEF] font-semibold dark:bg-blue-950/50 dark:text-blue-400'
                    : 'text-[#475467] dark:text-slate-300 hover:bg-[#F5F8FF] hover:text-[#155EEF] dark:hover:bg-slate-800'
                }`
              }
            >
              Lost & Found Community
            </NavLink>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative inline-block"
    >
      {/* Community Navigation Trigger */}
      <button
        type="button"
        onClick={handleClickToggle}
        className={`flex items-center gap-1.5 px-3.5 py-2 text-[15px] font-medium transition-colors select-none cursor-pointer rounded-lg ${
          isCommunityActive || isOpen
            ? 'text-[#155EEF] font-semibold'
            : 'text-[#111827] dark:text-slate-200 hover:text-[#155EEF] dark:hover:text-blue-400'
        }`}
      >
        <span>Community</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 transition-transform duration-200 text-[#155EEF]" />
        ) : (
          <ChevronDown className="w-4 h-4 transition-transform duration-200 text-[#667085] dark:text-slate-400" />
        )}
      </button>

      {/* Invisible bridge to ensure mouse moving from trigger to menu never leaves container */}
      <div className="absolute top-full left-0 w-full h-2" />

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[230px] bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-2xl shadow-xl shadow-black/5 p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <NavLink
            to="/community/questions"
            onClick={handleItemClick}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-xl text-[14.5px] font-medium transition-colors ${
                isActive
                  ? 'bg-[#F5F8FF] text-[#155EEF] font-semibold dark:bg-blue-950/40 dark:text-blue-400'
                  : 'text-[#111827] dark:text-slate-200 hover:bg-[#F5F8FF] hover:text-[#155EEF] dark:hover:bg-blue-950/40 dark:hover:text-blue-400'
              }`
            }
          >
            Question & Answer
          </NavLink>

          <NavLink
            to="/community/lost-found"
            onClick={handleItemClick}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-xl text-[14.5px] font-medium transition-colors ${
                isActive
                  ? 'bg-[#F5F8FF] text-[#155EEF] font-semibold dark:bg-blue-950/40 dark:text-blue-400'
                  : 'text-[#111827] dark:text-slate-200 hover:bg-[#F5F8FF] hover:text-[#155EEF] dark:hover:bg-blue-950/40 dark:hover:text-blue-400'
              }`
            }
          >
            Lost & Found Community
          </NavLink>
        </div>
      )}
    </div>
  );
}
