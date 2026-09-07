import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Mail, Phone, Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Nexa <span className="text-blue-400 font-extrabold text-sm">Campus</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Empowering the ISTAD community with academic peer Q&A and an intelligent campus lost & found recovery network.
            </p>
            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Institute of Science and Technology Advanced Development (ISTAD), Phnom Penh</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>support@nexa.istad.edu.kh</span>
              </div>
            </div>
          </div>

          {/* Q&A / Knowledge Hub */}
          <div className="space-y-3">
            <h4 className="text-xs font-black tracking-wider uppercase text-white">
              Tech Forum & Q&A
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/questions" className="hover:text-blue-400 transition-colors">
                  All Questions
                </Link>
              </li>
              <li>
                <Link to="/questions?category=web-dev" className="hover:text-blue-400 transition-colors">
                  Web Development
                </Link>
              </li>
              <li>
                <Link to="/questions?category=spring-java" className="hover:text-blue-400 transition-colors">
                  Spring Boot & Java
                </Link>
              </li>
              <li>
                <Link to="/questions?category=mobile-dev" className="hover:text-blue-400 transition-colors">
                  Mobile Development
                </Link>
              </li>
              <li>
                <Link to="/ask" className="hover:text-blue-400 transition-colors">
                  Post a Question
                </Link>
              </li>
            </ul>
          </div>

          {/* Lost & Found */}
          <div className="space-y-3">
            <h4 className="text-xs font-black tracking-wider uppercase text-white">
              Recovery Hub
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/lost-found" className="hover:text-emerald-400 transition-colors">
                  Campus Explorer
                </Link>
              </li>
              <li>
                <Link to="/lost-found?type=lost" className="hover:text-emerald-400 transition-colors">
                  Reported Lost Items
                </Link>
              </li>
              <li>
                <Link to="/lost-found?type=found" className="hover:text-emerald-400 transition-colors">
                  Turned In / Found Items
                </Link>
              </li>
              <li>
                <Link to="/matches" className="hover:text-emerald-400 transition-colors">
                  Smart Match Engine
                </Link>
              </li>
              <li>
                <Link to="/claims" className="hover:text-emerald-400 transition-colors">
                  Ownership Verification
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & Safety */}
          <div className="space-y-3">
            <h4 className="text-xs font-black tracking-wider uppercase text-white">
              Community & Safety
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/community" className="hover:text-white transition-colors">
                  Campus Guidelines
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="hover:text-white transition-colors">
                  Honor Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/achievements" className="hover:text-white transition-colors">
                  Badges & Rewards
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About ISTAD Initiative
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright and status */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Nexa Ask & Found. ISTAD Academic Capstone Platform.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              All Campus Nodes Operational
            </span>
            <span className="text-slate-700">•</span>
            <span>English / ភាសាខ្មែរ</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
