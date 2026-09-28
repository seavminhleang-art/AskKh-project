import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import enTranslations from "../locales/en.json";
import kmTranslations from "../locales/km.json";

import lyhengPhoto from "@/assets/Team/cheakching_lyheng.jpg";
import sothearithPhoto from "@/assets/Team/sroeun_sothearith.JPG";
import tharathPhoto from "@/assets/Team/venthan_tharath.jpg";
import seavminhPhoto from "@/assets/Team/leang_seavminh.JPG";
import thanaPhoto from "@/assets/Team/neang_thana.jpg";
import lisaPhoto from "@/assets/Team/mom_lisa.jpg";
import monizaPhoto from "@/assets/Team/cheat_chanmoniza.jpg";
import tonganPhoto from "@/assets/Team/hor_tongan.jpg";

const SidebarRight = ({ darkMode: propDarkMode, language = "en" }) => {
  const context = useOutletContext();
  const darkMode = propDarkMode ?? context?.darkMode ?? false;
  const currentLang = language || context?.language || "en";

  const t = currentLang === "km" ? kmTranslations : enTranslations;

  const [followingIds, setFollowingIds] = useState([1, 2, 3, 4, 5]);

  const people = [
    {
      id: 1,
      name: "Cheakching Lyheng",
      role: "Java Developer",
      avatar: lyhengPhoto,
    },
    {
      id: 2,
      name: "Sroeun Sothearith",
      role: "Frontend Developer",
      avatar: sothearithPhoto,
    },
    {
      id: 3,
      name: "Venthan Tharath",
      role: "Frontend Developer",
      avatar: tharathPhoto,
    },
    {
      id: 4,
      name: "Leang Seavminh",
      role: "Java Developer",
      avatar: seavminhPhoto,
    },
    {
      id: 5,
      name: "Neang Thana",
      role: "Frontend Developer",
      avatar: thanaPhoto,
    },
    {
      id: 6,
      name: "Mom Lisa",
      role: "Frontend Developer",
      avatar: lisaPhoto,
    },
    {
      id: 7,
      name: "Cheat Chanmoniza",
      role: "Frontend Developer",
      avatar: monizaPhoto,
    },
    {
      id: 8,
      name: "Hor Tongan",
      role: "Java Developer",
      avatar: tonganPhoto,
    },
  ];

  const toggleFollow = (id) => {
    setFollowingIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <aside className="w-full min-w-0 lg:col-start-2 xl:col-start-auto lg:sticky lg:top-24 lg:self-start">
      <div
        className={`rounded-2xl p-4 transition-colors duration-300 ${
          darkMode ? "bg-zinc-900" : "bg-white"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className={`font-bold text-lg ${darkMode ? "text-slate-200" : "text-gray-800"}`}
          >
            {t.sidebarRight.peopleYouKnow}
          </h3>
          <button
            className={`text-lg font-medium transition-colors hover:underline ${
              darkMode
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-600 hover:text-blue-700"
            }`}
          >
            {t.sidebarRight.viewAll}
          </button>
        </div>

        <div className="space-y-4">
          {people.map((person) => {
            const isFollowing = followingIds.includes(person.id);
            return (
              <div
                key={person.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={person.avatar}
                    alt={person.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <p
                      className={`text-lg font-bold ${darkMode ? "text-slate-200" : "text-gray-800"}`}
                    >
                      {person.name}
                    </p>
                    <p
                      className={`text-lg ${darkMode ? "text-zinc-400" : "text-gray-400"}`}
                    >
                      {person.role}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleFollow(person.id)}
                  className={`text-lg font-semibold flex-shrink-0 transition-colors ${
                    isFollowing
                      ? darkMode
                        ? "text-blue-400 hover:text-blue-300"
                        : "text-blue-600 hover:text-blue-700"
                      : darkMode
                        ? "text-zinc-400 hover:text-zinc-300"
                        : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {isFollowing
                    ? t.sidebarRight.following
                    : t.sidebarRight.follow}
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
