import { prepareProfilePhoto } from "../../features/workspace/prepareProfilePhoto";
import { profileImageUrl, resolveUserAvatar, setCachedAvatar, getCachedAvatar } from "../../features/workspace/profileImage";
import { isQuestionPost, isAnswerPost } from "../../config/postTypes.js";
import { Link } from "react-router-dom";
import { Sun, Moon, LockKeyhole, Palette, Settings2, Check, ArrowUpRight, Camera, Fingerprint, Mail, ShieldCheck, Sparkles, UserRound, CalendarDays, Save, Trophy, Eye, ThumbsUp, Loader2, Upload, HelpCircle, CheckCircle2, FileQuestion, PackageCheck } from "lucide-react";
import { useWorkspaceTranslation } from "@/locales/workspace/useWorkspaceTranslation";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useWorkspaceDataQuery,
  useWorkspaceSaveMutation,
} from "../../features/workspace/workspaceApi";
import { updateUser } from "../../features/auth/authSlice";
import { useTheme } from "../../context/ThemeContext";
import { message, rows } from "../../features/workspace/workspaceModel";
import { baseApi } from "../../store/api/baseApi";
import { Heading, QueryState } from "./WorkspaceUI";
function ProfileForm({ profile, refetchProfile }) {
  const { w } = useWorkspaceTranslation();
  const dispatch = useDispatch();
  // Read from Redux store — same source as the navbar — so both always stay in sync
  const authUser = useSelector((state) => state.auth.user);
  const [save, state] = useWorkspaceSaveMutation();
  const [feedback, setFeedback] = useState(null);
  const [photoFeedback, setPhotoFeedback] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [failedPhoto, setFailedPhoto] = useState(null);
  const [preparingPhoto, setPreparingPhoto] = useState(false);
  const fileInputRef = useRef(null);

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
      dispatch(baseApi.util.invalidateTags(["User"]));
      if (refetchProfile) await refetchProfile();
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
    event.target.value = "";
    if (!file) return;
    setPhotoFeedback(null);

    const isImage = file.type.startsWith("image/") || /\.(jpe?g|png|webp|gif|bmp)$/i.test(file.name);
    if (!isImage || file.size > 10 * 1024 * 1024) {
      setPhotoFeedback({
        ok: false,
        text: "Choose a JPG, PNG, or WebP photo under 10 MB.",
      });
      return;
    }

    // Convert to DataURL for instant local caching and persistent offline preview
    const dataUrl = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });

    setPreviewUrl(dataUrl);
    setFailedPhoto(null);
    setPreparingPhoto(true);

    try {
      // Step 1: Upload file to media storage via POST /upload/upload-single
      const uploadBody = new FormData();
      uploadBody.append("file", file);
      let uploadedFileName = null;

      try {
        const uploadRes = await save({
          resource: "image-upload",
          action: "create",
          body: uploadBody,
        }).unwrap();
        uploadedFileName =
          uploadRes?.name ||
          uploadRes?.data?.name ||
          uploadRes?.fileName ||
          uploadRes?.data?.fileName ||
          uploadRes?.uri ||
          uploadRes?.data?.uri ||
          uploadRes?.data?.url;
      } catch (uploadErr) {
        console.warn("POST /upload/upload-single failed:", uploadErr);
      }

      // Step 2: PUT /users/upload-image with the file (dedicated server profile image endpoint)
      try {
        const avatarBody = new FormData();
        avatarBody.append("file", file);
        const avatarRes = await save({
          resource: "avatar",
          action: "save",
          body: avatarBody,
        }).unwrap();
        if (!uploadedFileName) {
          uploadedFileName =
            avatarRes?.data?.profileImage ||
            avatarRes?.profileImage ||
            avatarRes?.data?.name ||
            avatarRes?.name ||
            avatarRes?.data?.fileName ||
            avatarRes?.fileName ||
            avatarRes?.data?.uri ||
            avatarRes?.uri;
        }
      } catch (avatarErr) {
        console.warn("PUT /users/upload-image failed:", avatarErr);
      }

      const cleanName = uploadedFileName
        ? uploadedFileName
            .replace(/^https?:\/\/[^/]+/i, "")
            .replace(/^\/__forum_api\/?/i, "")
            .replace(/^\/api\/v1\/?/i, "")
            .replace(/^\/?media\/?/i, "")
            .replace(/^\/+/, "")
        : null;

      // Step 3: Persist photo to Redux & localStorage so it is never lost on navigation
      setCachedAvatar(dataUrl, profile?.id || authUser?.id);
      dispatch(
        updateUser({
          avatar: dataUrl,
          profileImage: cleanName || dataUrl,
          photoURL: dataUrl,
        }),
      );

      // Step 4: Invalidate User cache & refetch profile from server
      dispatch(baseApi.util.invalidateTags(["User"]));
      if (refetchProfile) await refetchProfile();

      setPhotoFeedback({
        ok: true,
        text: "Profile photo updated.",
      });
    } catch (error) {
      setPhotoFeedback({
        ok: false,
        text: message(error),
      });
    } finally {
      setPreparingPhoto(false);
    }
  }

  const isUploading = state.isLoading || preparingPhoto;
  const cached = getCachedAvatar(profile?.id || authUser?.id);
  const userCandidate = {
    ...authUser,
    ...profile,
    profileImage: failedPhoto ? null : (profile?.profileImage || authUser?.profileImage),
    avatar: previewUrl || authUser?.avatar || cached || profile?.avatar,
  };
  const currentPhotoSrc = previewUrl || resolveUserAvatar(userCandidate);

  useEffect(() => {
    setFailedPhoto(null);
  }, [profile?.profileImage, authUser?.profileImage]);

  return (
    <section className="uw-card profile-editor">
      <div className="profile-banner">
        <span className="profile-eyebrow"><Sparkles size={14} /> {w("YOUR COMMUNITY IDENTITY")}</span>
        <div className="profile-banner-art" aria-hidden="true"><i /><i /><i /></div>
      </div>
      <div className="profile-identity">
        <div
          className="profile-avatar-wrap"
          onClick={() => !isUploading && fileInputRef.current?.click()}
          title={w("Click to change profile photo")}
        >
          {currentPhotoSrc ? (
            <img
              className="profile-avatar"
              src={currentPhotoSrc}
              alt={w("Your profile")}
              onError={() => {
                if (!failedPhoto) setFailedPhoto(true);
              }}
            />
          ) : (
            <span className="profile-avatar">
              {(profile.displayName || profile.name || "U").slice(0, 2).toUpperCase()}
            </span>
          )}
          {isUploading && (
            <div className="profile-avatar-loading">
              <Loader2 className="animate-spin" size={24} />
              <span>{w("Saving…")}</span>
            </div>
          )}
          <button
            type="button"
            className="profile-camera"
            aria-label={w("Change profile photo")}
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            <Camera size={17} />
          </button>
          <input
            ref={fileInputRef}
            className="profile-file-input"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/*"
            disabled={isUploading}
            onChange={upload}
          />
        </div>
        <div className="profile-identity-copy">
          <span className="profile-eyebrow">{w("MY PROFILE")}</span>
          <h2>{profile.displayName || w("Your profile")}</h2>
          <span className="profile-email"><Mail size={14} /> {profile.email}</span>
        </div>
        <Link className="profile-activity-link" to="/dashboard/activity">{w("My activity")} <ArrowUpRight size={16} /></Link>
      </div>

      <div className="profile-photo-note">
        <span>{w("Make it yours. Choose a JPG, PNG, or WebP photo under 5 MB.")}</span>
        <button
          type="button"
          className="profile-photo-btn"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={13} /> {isUploading ? w("Uploading…") : w("Change photo")}
        </button>
      </div>

      {photoFeedback && (
        <div className="profile-photo-feedback">
          <p
            role={photoFeedback.ok ? "status" : "alert"}
            className={photoFeedback.ok ? "uw-success" : "uw-error"}
          >
            {w(photoFeedback.text)}
          </p>
        </div>
      )}

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
function AccountSettings({ profile, refetchProfile }) {
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
      <div hidden={section !== "personal"}><ProfileForm key={profile.id} profile={profile} refetchProfile={refetchProfile} /></div>
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
  const authUser = useSelector((state) => state.auth.user);
  const profileQuery = useWorkspaceDataQuery({
    resource: "profile",
  });
  const forum = useWorkspaceDataQuery({
    resource: "my-posts",
  });
  const reportsQuery = useWorkspaceDataQuery({
    resource: "my-reports",
  });
  const apiProfile = profileQuery.data?.data ?? profileQuery.data;
  const profile = apiProfile
    ? {
        ...authUser,
        ...apiProfile,
        displayName:
          apiProfile.displayName ||
          authUser?.displayName ||
          authUser?.name ||
          "Member",
        email: apiProfile.email || authUser?.email,
        profileImage:
          apiProfile.profileImage ||
          apiProfile.avatar ||
          apiProfile.avatarUrl ||
          apiProfile.image ||
          apiProfile.photo ||
          apiProfile.imageUrl ||
          authUser?.profileImage ||
          authUser?.avatar ||
          authUser?.photoURL,
      }
    : authUser;

  const posts = rows(forum.data);
  const reports = rows(reportsQuery.data).filter(
    (item) => profile?.id != null && String(item.userId) === String(profile.id),
  );
  const questions = posts.filter((item) => isQuestionPost(item));
  const answers = posts.filter((item) => isAnswerPost(item));
  const count = (q, value) => (q.isError ? "—" : q.isLoading ? "…" : value);

  const stats = [
    {
      label: "Questions Asked",
      value: count(forum, questions.length),
      Icon: HelpCircle,
    },
    {
      label: "Answers Given",
      value: count(forum, answers.length),
      Icon: CheckCircle2,
    },
    {
      label: "Lost Reports",
      value: profile
        ? count(
            reportsQuery,
            reports.filter((item) => item.itemType?.toLowerCase() === "lost")
              .length,
          )
        : "—",
      Icon: FileQuestion,
    },
    {
      label: "Found Reports",
      value: profile
        ? count(
            reportsQuery,
            reports.filter((item) => item.itemType?.toLowerCase() === "found")
              .length,
          )
        : "—",
      Icon: PackageCheck,
    },
  ];

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
      <QueryState query={profileQuery}>
        {profile && (settings ? <AccountSettings profile={profile} refetchProfile={profileQuery.refetch} /> : (
          <div className="profile-layout">
            <div className="uw-stack">
              <ProfileForm key={profile.id || "profile"} profile={profile} refetchProfile={profileQuery.refetch} />
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
                {stats.map(({ Icon, label, value }) => (
                  <div className="profile-metric" key={label}>
                    <span>
                      <Icon size={16} />
                      {w(label)}
                    </span>
                    <strong>{value}</strong>
                  </div>
                ))}
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
