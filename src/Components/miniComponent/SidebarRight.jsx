import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import enTranslations from '../locales/en.json';
import kmTranslations from '../locales/km.json';

import lyhengAvatar from '../../assets/Website/Ly heng.jpg';
import rithAvatar from '../../assets/Website/Rith.JPG';
import tharatAvatar from '../../assets/Website/Tharat.jpg';
import seavminhAvatar from '../../assets/Website/Seav minh.JPG';
import thanaAvatar from '../../assets/Website/Thana.jpg';
import lisaAvatar from '../../assets/Website/Lisa.jpg';
import nisaAvatar from '../../assets/Website/Nisa.JPG';
import tonganAvatar from '../../assets/Website/Tong An.jpg';

const SidebarRight = ({ darkMode: propDarkMode, language = 'en' }) => {
  const context = useOutletContext();
  const darkMode = propDarkMode ?? context?.darkMode ?? false;
  const currentLang = language || context?.language || 'en';

  const t = currentLang === 'km' ? kmTranslations : enTranslations;
  const sidebarRightT = t?.sidebarRight || {
    peopleYouKnow: currentLang === 'km' ? 'មនុស្សដែលអ្នកអាចស្គាល់' : 'People You Know',
    viewAll: currentLang === 'km' ? 'មើលទាំងអស់' : 'View all',
    following: currentLang === 'km' ? 'កំពុងតាមដាន' : 'Following',
    follow: currentLang === 'km' ? 'តាមដាន' : 'Follow'
  };

  const [followingIds, setFollowingIds] = useState([1, 2, 3, 4, 5]);

  const people = [
    { id: 1, name: 'CheakChing LyHeng', role: 'Java Developer', avatar: lyhengAvatar },
    { id: 2, name: 'Sroeun Sothearith', role: 'Frontend Developer', avatar: rithAvatar },
    { id: 3, name: 'Venthan Tharath', role: 'Frontend Developer', avatar: tharatAvatar },
    { id: 4, name: 'Leang Seavminh', role: 'Java Developer', avatar: seavminhAvatar },
    { id: 5, name: 'Neang Thana', role: 'Frontend Developer', avatar: thanaAvatar },
    { id: 6, name: 'Mom Lisa', role: 'Frontend Developer', avatar: lisaAvatar },
    { id: 7, name: 'Cheat Chanmoniza', role: 'Frontend Developer', avatar: nisaAvatar },
    { id: 8, name: 'Tong An', role: 'Java Developer', avatar: tonganAvatar }
  ];

  const toggleFollow = (id) => {
    setFollowingIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <aside className="w-full lg:w-72 flex-shrink-0">
      <div className={`rounded-2xl p-4 border shadow-sm transition-colors duration-300 ${
        darkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100"
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-bold text-xs ${darkMode ? "text-slate-200" : "text-gray-800"}`}>
            {sidebarRightT.peopleYouKnow}
          </h3>
          <button className={`text-[11px] font-medium transition-colors hover:underline ${
            darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"
          }`}>
            {sidebarRightT.viewAll}
          </button>
        </div>

        <div className="space-y-4">
          {people.map((person) => {
            const isFollowing = followingIds.includes(person.id);
            return (
              <div key={person.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={person.avatar} alt={person.name} className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                  <div>
                    <p className={`text-xs font-bold ${darkMode ? "text-slate-200" : "text-gray-800"}`}>
                      {person.name}
                    </p>
                    <p className={`text-[10px] ${darkMode ? "text-zinc-400" : "text-gray-400"}`}>
                      {person.role}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleFollow(person.id)}
                  className={`text-[11px] font-semibold flex-shrink-0 transition-colors ${
                    isFollowing 
                      ? darkMode 
                        ? 'text-blue-400 hover:text-blue-300' 
                        : 'text-blue-600 hover:text-blue-700' 
                      : darkMode 
                        ? 'text-zinc-400 hover:text-zinc-300' 
                        : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {isFollowing ? sidebarRightT.following : sidebarRightT.follow}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default SidebarRight;