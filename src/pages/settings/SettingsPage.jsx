import React, { useState } from "react";
import {
  User,
  Shield,
  Bell,
  Palette,
  Save,
  Camera,
  CheckCircle2,
  Lock,
  Smartphone,
  Globe,
  Sun,
  Moon,
} from "lucide-react";
import { sampleUserProfile } from "../../data/achievementData";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppStore";
import { toggleTheme, setTheme } from "../../store/slices/themeSlice";
import { useLanguage } from "../../context/LanguageContext";

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.theme?.mode || "light");
  const { language, setLanguage, t } = useLanguage();

  const [activeTab, setActiveTab] = useState("PROFILE");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [name, setName] = useState(sampleUserProfile.name);
  const [username, setUsername] = useState(sampleUserProfile.username);
  const [email, setEmail] = useState(sampleUserProfile.email);
  const [department, setDepartment] = useState(sampleUserProfile.department);
  const [bio, setBio] = useState(sampleUserProfile.bio);
  const [location, setLocation] = useState(sampleUserProfile.location);

  // Notification toggles
  const [emailAnswers, setEmailAnswers] = useState(true);
  const [matchAlerts, setMatchAlerts] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <header className="pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <h1 className="text-3xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {t("settings.title", "Settings")}
        </h1>
        <p className="text-lg sm:text-base text-slate-500 dark:text-slate-400 mt-1">
          {t(
            "settings.description",
            "Manage your personal scholar profile, notification preferences, security, and appearance.",
          )}
        </p>
      </header>

      {/* Success banner */}
      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-2.5 text-lg text-emerald-800 dark:text-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-[#16803C]" />
          <span>
            {t(
              "settings.savedSuccessfully",
              "Your settings have been saved successfully.",
            )}
          </span>
        </div>
      )}

      {/* Layout: Sidebar tabs + Main content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Tabs */}
        <nav aria-label="Settings Categories" className="space-y-1">
          {[
            {
              id: "PROFILE",
              label: t("settings.profile", "Profile Information"),
              icon: User,
            },
            {
              id: "SECURITY",
              label: t("settings.security", "Security & Password"),
              icon: Shield,
            },
            {
              id: "NOTIFICATIONS",
              label: t("settings.notifications", "Notifications"),
              icon: Bell,
            },
            {
              id: "APPEARANCE",
              label: t("settings.appearance", "Appearance & Theme"),
              icon: Palette,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-lg font-medium transition-colors cursor-pointer text-left ${
                  isActive
                    ? "bg-[#102A56] text-white font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Content Area */}
        <main className="md:col-span-3">
          {/* PROFILE TAB */}
          {activeTab === "PROFILE" && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Public Profile
                </h3>
                <p className="text-lg text-slate-500 dark:text-slate-400 mt-0.5">
                  This information will be displayed on your Q&A contributions
                  and lost & found reports.
                </p>
              </div>

              {/* Avatar Section */}
              <div className="flex items-center gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="relative">
                  <img
                    src={sampleUserProfile.avatar}
                    alt={sampleUserProfile.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm"
                  />
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#102A56] text-white hover:bg-[#102A56]/90 transition-colors shadow-2xs cursor-pointer"
                    title="Upload photo"
                  >
                    <Camera className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-1">
                  <div className="text-lg font-semibold text-slate-900 dark:text-white">
                    Profile Picture
                  </div>
                  <div className="text-[16px] text-slate-400">
                    PNG, JPG, or GIF up to 5MB.
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSave} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-lg font-semibold text-slate-900 dark:text-white">
                      {t("profile.fullName", "Full Name")}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-lg sm:text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-lg font-semibold text-slate-900 dark:text-white">
                      {t("profile.username", "Username")}
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-lg sm:text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-lg font-semibold text-slate-900 dark:text-white">
                      {t("profile.email", "University Email")}
                    </label>
                    <input
                      type="email"
                      disabled
                      value={email}
                      className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-lg sm:text-base text-slate-500 dark:text-slate-400 cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-lg font-semibold text-slate-900 dark:text-white">
                      {t("profile.department", "Department / Major")}
                    </label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-lg sm:text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">
                    {t("profile.bio", "Bio")}
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-lg sm:text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-y"
                  />
                </div>

                <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#102A56] hover:bg-[#102A56]/90 text-white rounded-lg text-lg font-semibold shadow-2xs transition-colors cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{t("profile.saveProfile", "Save Profile")}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === "SECURITY" && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {t("settings.security", "Security Credentials")}
                </h3>
                <p className="text-lg text-slate-500 dark:text-slate-400 mt-0.5">
                  Update your authentication password and manage active logins.
                </p>
              </div>

              <form
                onSubmit={handleSave}
                className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800"
              >
                <div className="space-y-1.5">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">
                    {t("settings.changePassword", "Current Password")}
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-lg sm:text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-lg font-semibold text-slate-900 dark:text-white">
                      {t("settings.changePassword", "New Password")}
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-lg sm:text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-lg font-semibold text-slate-900 dark:text-white">
                      {t("settings.changePassword", "Confirm New Password")}
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-lg sm:text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#102A56] hover:bg-[#102A56]/90 text-white rounded-lg text-lg font-semibold shadow-2xs transition-colors cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{t("settings.saveChanges", "Update Password")}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === "NOTIFICATIONS" && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Notification Preferences
                </h3>
                <p className="text-lg text-slate-500 dark:text-slate-400 mt-0.5">
                  Select which updates you want to receive directly via app
                  alerts or email.
                </p>
              </div>

              <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                {[
                  {
                    title: "New Forum Answers & Comments",
                    desc: "Get notified when someone responds to your questions or mentions you.",
                    state: emailAnswers,
                    setter: setEmailAnswers,
                  },
                  {
                    title: "Lost & Found Match Alerts",
                    desc: "Instant alert when an item matching your lost report is discovered.",
                    state: matchAlerts,
                    setter: setMatchAlerts,
                  },
                  {
                    title: "Security & Verification Notices",
                    desc: "Important status notifications on claimed campus property.",
                    state: securityAlerts,
                    setter: setSecurityAlerts,
                  },
                  {
                    title: "Weekly Community Digest",
                    desc: "Weekly wrap of trending questions, scholar achievements, and campus stats.",
                    state: weeklyDigest,
                    setter: setWeeklyDigest,
                  },
                ].map((item, idx) => (
                  <label
                    key={idx}
                    className="flex items-start justify-between gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <div className="space-y-0.5">
                      <span className="text-lg font-semibold text-slate-900 dark:text-white block">
                        {item.title}
                      </span>
                      <span className="text-[16px] text-slate-500 dark:text-slate-400 block">
                        {item.desc}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={item.state}
                      onChange={(e) => item.setter(e.target.checked)}
                      className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* APPEARANCE TAB */}
          {activeTab === "APPEARANCE" && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {t("settings.appearance", "Appearance & Display")}
                </h3>
                <p className="text-lg text-slate-500 dark:text-slate-400 mt-0.5">
                  {t(
                    "settings.appearanceDesc",
                    "Customize the interface theme mode and language preferences.",
                  )}
                </p>
              </div>

              <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="space-y-2">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">
                    {t("settings.interfaceTheme", "Interface Theme")}
                  </label>
                  <div className="grid grid-cols-2 gap-3 max-w-md">
                    <button
                      type="button"
                      onClick={() => dispatch(setTheme("light"))}
                      className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                        themeMode === "light"
                          ? "bg-blue-50 border-blue-400 text-blue-900 dark:bg-blue-950 dark:text-blue-200 shadow-2xs"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      <Sun className="w-5 h-5 text-amber-500" />
                      <div className="text-left">
                        <div className="text-lg font-bold">
                          {t("settings.light", "Light Mode")}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Clean whitesmoke style
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => dispatch(setTheme("dark"))}
                      className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                        themeMode === "dark"
                          ? "bg-blue-50 border-blue-400 text-blue-900 dark:bg-blue-950 dark:text-blue-200 shadow-2xs"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      <Moon className="w-5 h-5 text-indigo-400" />
                      <div className="text-left">
                        <div className="text-lg font-bold">
                          {t("settings.dark", "Dark Mode")}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Reduced eye strain
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-slate-400" />
                    {t("settings.displayLanguage", "Display Language")}
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full max-w-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-lg sm:text-base text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                  >
                    <option value="en">English (Google Sans)</option>
                    <option value="km">ភាសាខ្មែរ (Google Sans Khmer)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
