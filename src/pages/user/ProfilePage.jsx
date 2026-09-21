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
    <section className="uw-card">
      <div className="uw-cover" />
      <div className="uw-profile">
        {profile.profileImage ? (
          <img
            className="uw-avatar"
            src={profile.profileImage}
            alt={w("Your profile")}
          />
        ) : (
          <span className="uw-avatar">
            {profile.displayName?.slice(0, 2) || "U"}
          </span>
        )}
        <h2>{profile.displayName || w("Your profile")}</h2>
        <p className="uw-muted">{profile.email}</p>
      </div>
      <form className="uw-form" onSubmit={submit} aria-busy={state.isLoading}>
        <h2>{w("Personal information")}</h2>
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
            defaultValue={profile.bio || ""}
          />
        </label>
        <label>
          {w("Profile photo")}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={state.isLoading}
            onChange={upload}
          />
        </label>
        <div className="uw-actions">
          <button
            type="reset"
            className="uw-button secondary"
            disabled={state.isLoading}
          >
            {w("Reset")}
          </button>
          <button className="uw-button" disabled={state.isLoading}>
            {state.isLoading ? w("Saving\u2026") : w("Save changes")}
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
    <form className="uw-card uw-form" onSubmit={submit}>
      <h2>{w("Change password")}</h2>
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
export default function ProfilePage({ settings = false }) {
  const { w } = useWorkspaceTranslation();
  const query = useWorkspaceDataQuery({
    resource: "profile",
  });
  const { darkMode, toggleTheme } = useTheme();
  const profile = query.data?.data ?? query.data;
  return (
    <div className="uw-page">
      <Heading
        title={settings ? w("Settings") : w("Profile")}
        description={
          settings
            ? w("Manage your account and appearance.")
            : w("Your personal information and community profile.")
        }
      />
      <QueryState query={query}>
        {profile && (
          <div className="uw-columns">
            <div className="uw-stack">
              <ProfileForm key={profile.id} profile={profile} />
              {settings && (
                <>
                  <PasswordForm />
                  <section className="uw-card uw-form">
                    <h2>{w("Appearance")}</h2>
                    <label>
                      <span>{w("Dark mode")}</span>
                      <input
                        style={{
                          width: 20,
                        }}
                        type="checkbox"
                        checked={darkMode}
                        onChange={toggleTheme}
                      />
                    </label>
                    <p className="uw-muted">
                      {w("Your appearance preference is saved on this device.")}
                    </p>
                  </section>
                </>
              )}
            </div>
            <aside className="uw-card">
              <h2>{w("Your account")}</h2>
              <p className="uw-muted mt-3">{profile.email}</p>
              <p className="mt-4">
                {w(
                  "Keep your profile up to date so other members can recognize your contributions.",
                )}
              </p>
            </aside>
          </div>
        )}
      </QueryState>
    </div>
  );
}
