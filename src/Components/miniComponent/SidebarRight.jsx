import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import enTranslations from '../locales/en.json';
import kmTranslations from '../locales/km.json';

const SidebarRight = ({ darkMode: propDarkMode, language = 'en' }) => {
  const context = useOutletContext();
  const darkMode = propDarkMode ?? context?.darkMode ?? false;
  const currentLang = language || context?.language || 'en';

  const t = currentLang === 'km' ? kmTranslations : enTranslations;

  const [followingIds, setFollowingIds] = useState([1, 2, 3, 4, 5]);

  const people = [
    { id: 1, name: 'Cheakching Lyheng', role: 'Java Developer', avatar: '../../src/assets/Website/Ly heng.jpg' },
    { id: 2, name: 'Sroeun Sothearith', role: 'Frontend Developer', avatar: '../../src/assets/Website/Rith.jpg' },
    { id: 3, name: 'Venthan Tharath', role: 'Frontend Developer', avatar: '../../src/assets/Website/Tharat.jpg' },
    { id: 4, name: 'Leang Seavminh', role: 'Java Developer', avatar: '../../src/assets/Website/Seav minh.jpg' },
    { id: 5, name: 'Neang Thana', role: 'Frontend Developer', avatar: '../../src/assets/Website/Thana.jpg' },
    { id: 6, name: 'Mom Lisa', role: 'Frontend Developer', avatar: '../../src/assets/Website/Lisa.jpg' },
    { id: 7, name: 'Cheat Chanmoniza', role: 'Frontend Developer', avatar: '../../src/assets/Website/Nisa.jpg' },
    { id: 8, name: 'Hor Tongan', role: 'Java Developer', avatar: '../../src/assets/Website/Tong An.jpg' }
  ];

  const toggleFollow = (id) => {
    setFollowingIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <aside className="w-full min-w-0 lg:col-start-2 xl:col-start-auto">
      <div className={`rounded-2xl p-4 transition-colors duration-300 ${
        darkMode ? "bg-zinc-900" : "bg-white"
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-bold text-sm ${darkMode ? "text-slate-200" : "text-gray-800"}`}>
            {t.sidebarRight.peopleYouKnow}
          </h3>
          <button className={`text-sm font-medium transition-colors hover:underline ${
            darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"
          }`}>
            {t.sidebarRight.viewAll}
          </button>
        </div>

        <div className="space-y-4">
          {people.map((person) => {
            const isFollowing = followingIds.includes(person.id);
            return (
              <div key={person.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={person.avatar} alt={person.name} className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <p className={`text-sm font-bold ${darkMode ? "text-slate-200" : "text-gray-800"}`}>
                      {person.name}
                    </p>
                    <p className={`text-sm ${darkMode ? "text-zinc-400" : "text-gray-400"}`}>
                      {person.role}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleFollow(person.id)}
                  className={`text-sm font-semibold flex-shrink-0 transition-colors ${
                    isFollowing 
                      ? darkMode 
                        ? 'text-blue-400 hover:text-blue-300' 
                        : 'text-blue-600 hover:text-blue-700' 
                      : darkMode 
                        ? 'text-zinc-400 hover:text-zinc-300' 
                        : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {isFollowing ? t.sidebarRight.following : t.sidebarRight.follow}
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