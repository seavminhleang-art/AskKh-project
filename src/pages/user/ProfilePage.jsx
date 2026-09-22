import { Link } from "react-router-dom";
import { Sun, Moon, LockKeyhole, Palette, Settings2, Check, ArrowUpRight, Camera, Fingerprint, Mail, ShieldCheck, Sparkles, UserRound, CalendarDays, Save, Trophy, Eye, ThumbsUp } from "lucide-react";
import "./profile.css";
import { useWorkspaceTranslation } from "@/locales/workspace/useWorkspaceTranslation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  useWorkspaceDataQuery,
  useWorkspaceSaveMutation,
} from "../../features/workspace/workspaceApi";
import { updateUser } from "../../features/auth/authSlice";
import { useTheme } from "../../context/ThemeContext";
import { message } from "../../features/workspace/workspaceModel";
import { Heading, QueryState } from "./WorkspaceUI";
function ProfileForm({ profile }) {
  const { w } = useWorkspaceTranslation();
  const dispatch = useDispatch();
  const [save, state] = useWorkspaceSaveMutation();
  const [feedback, setFeedback] = useState(null);
  async function submit(event) {
    event.preventDefault();
    setFeedback(null);
    const data = new FormData(event.currentTarget);
    try {
      const username = data.get("username").trim();
      const bio = data.get("bio").trim();
      await save({
        resource: "profile",
        action: "save",
        body: {
          username,
          bio,
        },
      }).unwrap();
      dispatch(
        updateUser({
          displayName: username,
          bio,
        }),
      );
      setFeedback({
        ok: true,
        text: "Profile saved.",
      });
    } catch (error) {
      setFeedback({
        text: message(error),
      });
    }
  }
  async function upload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setFeedback(null);
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      setFeedback({
        text: "Choose a JPG, PNG, or WebP under 5 MB.",
      });
      return;
    }
    const body = new FormData();
    body.append("file", file);
    try {
      await save({
        resource: "avatar",
        action: "save",
        body,
      }).unwrap();
      setFeedback({
        ok: true,
        text: "Profile photo saved.",
      });
    } catch (error) {
      setFeedback({
        text: message(error),
      });
    }
  }
  return (
    <section className="uw-card profile-editor">
      <div className="profile-banner">
        <span className="profile-eyebrow"><Sparkles size={14} /> {w("YOUR COMMUNITY IDENTITY")}</span>
        <div className="profile-banner-art" aria-hidden="true"><i /><i /><i /></div>
      </div>
      <div className="profile-identity">
        <div className="profile-avatar-wrap">
          {profile.profileImage ? <img className="profile-avatar" src={profile.profileImage} alt={w("Your profile")} /> : <span className="profile-avatar">{(profile.displayName || "U").slice(0, 2).toUpperCase()}</span>}
          <label className="profile-camera" aria-label={w("Change profile photo")}>
            <Camera size={17} />
            <input className="profile-file-input" type="file" accept="image/jpeg,image/png,image/webp" disabled={state.isLoading} onChange={upload} />
          </label>
        </div>
        <div className="profile-identity-copy">
          <span className="profile-eyebrow">{w("MY PROFILE")}</span>
          <h2>{profile.displayName || w("Your profile")}</h2>
          <span className="profile-email"><Mail size={14} /> {profile.email}</span>
        </div>
        <Link className="profile-activity-link" to="/dashboard/activity">{w("My activity")} <ArrowUpRight size={16} /></Link>
      </div>
      <div className="profile-photo-note">{w("Make it yours. Choose a JPG, PNG, or WebP photo under 5 MB.")}</div>
      <form className="uw-form" onSubmit={submit} aria-busy={state.isLoading}>
        <div className="profile-section-heading"><span className="profile-icon"><UserRound size={19} /></span><div><h2>{w("Personal information")}</h2><span>{w("A little about the person behind the contributions.")}</span></div></div>
        {feedback && (
          <p
            role={feedback.ok ? "status" : "alert"}
            className={feedback.ok ? "uw-success" : "uw-error"}
          >
            {w(feedback.text)}
          </p>
        )}
        <div className="uw-fields">
          <label>
            {w("Display name")}
            <input
              name="username"
              required
              maxLength={100}
              autoComplete="nickname"
              placeholder={w("How should we call you?")}
              defaultValue={profile.displayName || ""}
            />
          </label>
          <label>
            {w("Email")}
            <input type="email" value={profile.email || ""} readOnly />
          </label>
        </div>
        <label>
          {w("Bio")}
          <textarea
            name="bio"
            rows={4}
            maxLength={1000}
            placeholder={w("Share your interests, what you are learning, or how you like to help.")}
            defaultValue={profile.bio || ""}
          />
        </label>
        <div className="uw-actions profile-save-bar">
          <button
            type="reset"
            className="uw-button secondary"
            disabled={state.isLoading}
          >
            {w("Reset")}
          </button>
          <button className="uw-button" disabled={state.isLoading}>
            <Save size={16} /> {state.isLoading ? w("Saving\u2026") : w("Save changes")}
          </button>
        </div>
      </form>
    </section>
  );
}
function PasswordForm() {
  const { w } = useWorkspaceTranslation();
  const [save, state] = useWorkspaceSaveMutation();
  const [feedback, setFeedback] = useState(null);
  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const body = Object.fromEntries(new FormData(form));
    setFeedback(null);
    if (body.newPassword !== body.confirmedNewPassword) {
      setFeedback({
        text: "New passwords must match.",
      });
      return;
    }
    try {
      await save({
        resource: "password",
        action: "save",
        body,
      }).unwrap();
      form.reset();
      setFeedback({
        ok: true,
        text: "Password updated.",
      });
    } catch (error) {
      setFeedback({
        text: message(error),
      });
    }
  }
  return (
    <form className="uw-card uw-form settings-password" onSubmit={submit} aria-busy={state.isLoading}>
      <div className="profile-section-heading"><span className="profile-icon"><LockKeyhole size={20} /></span><div><h2>{w("Password & security")}</h2><span>{w("Keep your account protected with a strong password.")}</span></div></div>
      <div className="settings-security-note"><ShieldCheck size={20} /><span>{w("Use at least 8 characters. Choose a password you do not use elsewhere.")}</span></div>
      {feedback && (
        <p
          role={feedback.ok ? "status" : "alert"}
          className={feedback.ok ? "uw-success" : "uw-error"}
        >
          {w(feedback.text)}
        </p>
      )}
      <label>
        {w("Current password")}
        <input
          name="oldPassword"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>
      <div className="uw-fields">
        <label>
          {w("New password")}
          <input
            name="newPassword"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </label>
        <label>
          {w("Confirm password")}
          <input
            name="confirmedNewPassword"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </label>
      </div>
      <div className="uw-actions">
        <button disabled={state.isLoading} className="uw-button">
          {state.isLoading ? w("Updating\u2026") : w("Update password")}
        </button>
      </div>
    </form>
  );
}
function AccountSettings({ profile }) {
  const { w } = useWorkspaceTranslation();
  const [section, setSection] = useState("personal");
  const { darkMode, setDarkMode } = useTheme();
  const sections = [["personal", "Personal information", "Your name, photo, and bio", UserRound], ["security", "Password & security", "Manage your password", LockKeyhole], ["appearance", "Appearance", "Make yourself at home", Palette]];
  return <div className="settings-layout">
    <aside className="settings-navigation">
      <div className="settings-account"><span className="profile-icon"><Settings2 size={22} /></span><div><strong>{w("Account preferences")}</strong><span>{profile.email}</span></div></div>
      <nav aria-label={w("Settings sections")}>
        {sections.map(([key, title, description, Icon]) => <button type="button" key={key} aria-current={section === key ? "page" : undefined} onClick={() => setSection(key)} className={section === key ? "is-selected" : ""}><Icon size={19} /><span><strong>{w(title)}</strong><small>{w(description)}</small></span><ArrowUpRight size={14} /></button>)}
      </nav>
      <Link className="settings-back" to="/dashboard/profile">{w("View my profile")} <ArrowUpRight size={15} /></Link>
      <div className="settings-nav-note"><ShieldCheck size={22} /><strong>{w("A space that is yours")}</strong><span>{w("Keep your details current and choose how your workspace looks.")}</span></div>
    </aside>
    <div className="settings-content">
      <div hidden={section !== "personal"}><ProfileForm key={profile.id} profile={profile} /></div>
      <div hidden={section !== "security"}><PasswordForm /></div>
      <div hidden={section !== "appearance"}>
        <section className="uw-card settings-appearance">
          <div className="profile-section-heading"><span className="profile-icon"><Palette size={20} /></span><div><h2>{w("Appearance")}</h2><span>{w("Choose the look that works for you.")}</span></div></div>
          <div className="settings-theme-options" role="group" aria-label={w("Color theme")}>
            {[[false, "Light", Sun], [true, "Dark", Moon]].map(([dark, label, Icon]) => <button type="button" key={label} aria-pressed={darkMode === dark} className={`settings-theme ${darkMode === dark ? "is-selected" : ""}`} onClick={() => setDarkMode(dark)}>
              <div className={`settings-theme-preview ${dark ? "preview-dark" : "preview-light"}`} aria-hidden="true"><div className="preview-nav"><i /><i /><i /></div><div className="preview-content"><i /><div><i /><i /></div><b /><b /><b /></div></div>
              <span className="settings-theme-label"><span><Icon size={17} />{w(label)}</span><span className="settings-theme-check">{darkMode === dark && <Check size={13} />}</span></span>
            </button>)}
          </div>
          <div className="settings-preference-note"><Check size={16} /><span>{w("Saved automatically on this device.")}</span></div>
        </section>
      </div>
    </div>
  </div>;
}

export default function ProfilePage({ settings = false }) {
  const { w } = useWorkspaceTranslation();
  const query = useWorkspaceDataQuery({
    resource: "profile",
  });
  const profile = query.data?.data ?? query.data;
  return (
    <div className="uw-page profile-page">
      <Heading
        title={settings ? w("Account settings") : w("My profile")}
        description={
          settings
            ? w("Manage your account and appearance.")
            : w("Your space to introduce yourself and make it yours.")
        }
      />
      <QueryState query={query}>
        {profile && (settings ? <AccountSettings profile={profile} /> : (
          <div className="profile-layout">
            <div className="uw-stack">
              <ProfileForm key={profile.id} profile={profile} />
            </div>
            <aside className="profile-sidebar">
              <section className="uw-card profile-summary">
                <div className="profile-section-heading"><span className="profile-icon"><Fingerprint size={20} /></span><h2>{w("At a glance")}</h2></div>
                <div className="profile-account-item"><Mail size={17} /><div><span>{w("Email address")}</span><strong>{profile.email || "—"}</strong></div></div>
                <div className="profile-account-item"><CalendarDays size={17} /><div><span>{w("Member since")}</span><strong>{profile.creationDate && !Number.isNaN(new Date(profile.creationDate).getTime()) ? new Date(profile.creationDate).toLocaleDateString(undefined, { month: "long", year: "numeric" }) : "—"}</strong></div></div>
                <div className="profile-account-item"><UserRound size={17} /><div><span>{w("Display name")}</span><strong>{profile.displayName || "—"}</strong></div></div>
              </section>
              <section className="uw-card profile-contributions">
                <div className="profile-section-heading"><span className="profile-icon"><Trophy size={19} /></span><h2>{w("Your impact")}</h2></div>
                {[[Trophy, "Reputation", profile.reputation], [Eye, "Profile views", profile.views], [ThumbsUp, "Upvotes", profile.upVotes]].map(([Icon, label, value]) => <div className="profile-metric" key={label}><span><Icon size={16} />{w(label)}</span><strong>{value == null ? "—" : Number(value).toLocaleString()}</strong></div>)}
                <Link to="/dashboard/activity">{w("Explore your activity")} <ArrowUpRight size={16} /></Link>
              </section>
              <section className="profile-security-card">
                <ShieldCheck size={26} />
                <h2>{w("Your account, your control")}</h2>
                <p>{w("Manage your password and choose the appearance that feels right for you.")}</p>
                <Link to="/dashboard/settings">{w("Account settings")} <ArrowUpRight size={16} /></Link>
              </section>
            </aside>
          </div>
        ))}
      </QueryState>
    </div>
  );
}
