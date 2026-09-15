import React, { useState } from 'react';
import { Search, PlusCircle, User, Bell, Menu, X, ShieldAlert, Heart, Compass } from 'lucide-react';

export default function Navbar({ onOpenPostModal, onOpenAuthModal, currentTab, setCurrentTab, searchQuery, setSearchQuery }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setCurrentTab('home')}
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  Ask & Found
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-full border border-amber-200">
                  KH
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Reconnecting Cambodia</p>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search lost IDs, phones, wallets, pets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-800 placeholder-slate-400 rounded-full border border-transparent focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setCurrentTab('home')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                currentTab === 'home' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentTab('explore')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                currentTab === 'explore' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-4 h-4" />
              Explore Items
            </button>
            <button
              onClick={() => setCurrentTab('about')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                currentTab === 'about' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              About Us
            </button>
          </nav>

          {/* Action Buttons (Desktop) */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenPostModal}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-full shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 transition-all transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              Report Item
            </button>

            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-2 px-4 py-2.5 text-slate-700 hover:bg-slate-100 rounded-full font-semibold text-sm transition-colors border border-slate-200"
            >
              <User className="w-4 h-4 text-slate-500" />
              Sign In
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenPostModal}
              className="p-2 bg-blue-600 text-white rounded-full shadow-md"
              title="Report Item"
            >
              <PlusCircle className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search lost or found items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 text-slate-800 placeholder-slate-400 rounded-full text-sm outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex flex-col gap-1 pt-2">
            <button
              onClick={() => { setCurrentTab('home'); setMobileMenuOpen(false); }}
              className={`px-4 py-2.5 rounded-xl font-medium text-left text-sm ${
                currentTab === 'home' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-700'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => { setCurrentTab('explore'); setMobileMenuOpen(false); }}
              className={`px-4 py-2.5 rounded-xl font-medium text-left text-sm ${
                currentTab === 'explore' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-700'
              }`}
            >
              Explore Items
            </button>
            <button
              onClick={() => { setCurrentTab('about'); setMobileMenuOpen(false); }}
              className={`px-4 py-2.5 rounded-xl font-medium text-left text-sm ${
                currentTab === 'about' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-700'
              }`}
            >
              About Us
            </button>
            <button
              onClick={() => { onOpenAuthModal(); setMobileMenuOpen(false); }}
              className="px-4 py-2.5 rounded-xl font-medium text-left text-sm text-slate-700 border border-slate-200 flex items-center justify-between"
            >
              <span>Sign In / Register</span>
              <User className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
