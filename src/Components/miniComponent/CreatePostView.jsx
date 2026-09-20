import React, { useState } from "react";
import { Upload, X } from "lucide-react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useCreatePostMutation } from "../../features/posts/postApi";
import { useUploadSingleMutation } from "../../features/upload/uploadApi";
import { useGetTagsQuery } from "../../features/tags/tagApi";

const CreatePostView = ({ onAddPost, onCancel, darkMode: propDarkMode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const context = useOutletContext();
  const darkMode = propDarkMode ?? context?.darkMode ?? false;
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [createPost, { isLoading: isCreating }] = useCreatePostMutation();
  const [uploadSingle, { isLoading: isUploading }] = useUploadSingleMutation();
  const { data: availableTags } = useGetTagsQuery();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState(["react", "javascript"]);
  const [tagInput, setTagInput] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [formError, setFormError] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const formattedTag = tagInput.trim().replace(/^#/, "").toLowerCase();
    if (formattedTag && !tags.includes(formattedTag)) {
      setTags([...tags, formattedTag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImageFile(file);
      setCoverImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!isAuthenticated) {
      toast.info("Please log in to create a post");
      navigate("/login");
      return;
    }

    if (title.trim().length < 10) {
      setFormError("Title must be at least 10 characters long.");
      return;
    }

    if (content.trim().length < 20) {
      setFormError("Content body must be at least 20 characters long.");
      return;
    }

    try {
      let imageUrls = [];
      if (coverImageFile) {
        const formData = new FormData();
        formData.append("file", coverImageFile);
        const uploadRes = await uploadSingle(formData).unwrap();
        if (uploadRes?.uri) {
          imageUrls.push(uploadRes.uri);
        }
      }

      // Map tag strings to tagIds from API if available
      const matchedTagIds = [];
      if (Array.isArray(availableTags)) {
        tags.forEach((tagName) => {
          const found = availableTags.find(
            (at) => at.tagName?.toLowerCase() === tagName.toLowerCase(),
          );
          if (found?.id) matchedTagIds.push(found.id);
        });
      }

      const created = await createPost({
        title: title.trim(),
        body: content.trim(),
        postTypeId: 1, // Question
        tagIds: matchedTagIds,
        imageUrls,
      }).unwrap();

      toast.success("Question created successfully!");
      if (onAddPost) onAddPost(created);
    } catch (err) {
      console.error("Failed to create post:", err);
      const msg =
        err?.data?.message ||
        err?.error ||
        "Failed to create post. Please check required fields.";
      setFormError(msg);
      toast.error(msg);
    }
  };

  return (
    <div
      className={`min-w-0 flex-1 min-h-screen transition-colors duration-300 p-4 sm:p-6 space-y-6 ${
        darkMode ? "bg-zinc-950 text-slate-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <h1
        className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
      >
        {t("create.title")}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 xl:grid-cols-3 gap-6"
      >
        <div className="xl:col-span-2 space-y-6">
          {/* Details Section */}
          <div
            className={`rounded-2xl p-6 space-y-4 transition-colors ${
              darkMode ? "bg-zinc-900 text-slate-100" : "bg-white text-gray-800"
            }`}
          >
            <h3
              className={`font-bold text-lg ${darkMode ? "text-slate-200" : "text-gray-800"}`}
            >
              {t("create.blogDetails")}
            </h3>

            <div>
              <label
                className={`block text-base font-semibold mb-1 ${darkMode ? "text-slate-300" : "text-gray-700"}`}
              >
                {t("create.blogTitleLabel")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("create.blogTitleLabel")}
                className={`w-full rounded-xl px-3 py-2 text-base border focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors ${
                  darkMode
                    ? "bg-zinc-800/80 border-zinc-700 text-slate-100 placeholder-zinc-500"
                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
                }`}
                required
              />
            </div>

            <div>
              <label
                className={`block text-base font-semibold mb-1 ${darkMode ? "text-slate-300" : "text-gray-700"}`}
              >
                {t("create.contentLabel")}
              </label>
              <div
                className={`border rounded-xl overflow-hidden ${darkMode ? "border-zinc-700" : "border-gray-200"}`}
              >
                <textarea
                  rows="6"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={t("create.placeholderContent")}
                  className={`w-full p-3 text-base focus:outline-none transition-colors ${
                    darkMode
                      ? "bg-zinc-900 text-slate-100 placeholder-zinc-500"
                      : "bg-white text-gray-900 placeholder-gray-400"
                  }`}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div
            className={`rounded-2xl p-6 space-y-4 transition-colors ${
              darkMode ? "bg-zinc-900" : "bg-white"
            }`}
          >
            <h3
              className={`font-bold text-lg ${darkMode ? "text-slate-200" : "text-gray-800"}`}
            >
              {t("create.coverImage")}
            </h3>
            <label
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                darkMode
                  ? "border-zinc-700 hover:bg-zinc-800/50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              {coverImage ? (
                <img
                  src={coverImage}
                  alt="Cover Preview"
                  className="max-h-40 rounded-xl object-cover"
                />
              ) : (
                <>
                  <Upload
                    className={`w-8 h-8 mb-2 ${darkMode ? "text-zinc-500" : "text-gray-400"}`}
                  />
                  <span
                    className={`text-base font-semibold ${darkMode ? "text-slate-300" : "text-gray-700"}`}
                  >
                    {t("create.uploadFile")}
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {formError && (
            <div className="p-3 text-base rounded-xl bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/40">
              {formError}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              type="submit"
              disabled={isCreating || isUploading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-6 py-2 rounded-xl text-base transition-colors"
            >
              {isCreating || isUploading ? "Creating..." : t("create.addBlog")}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className={`font-medium px-6 py-2 rounded-xl text-base transition-colors border ${
                darkMode
                  ? "bg-red-950/40 text-red-400 hover:bg-red-900/50 border-red-900/30"
                  : "bg-red-50 text-red-500 hover:bg-red-100 border-transparent"
              }`}
            >
              {t("create.cancel")}
            </button>
          </div>
        </div>

        {/* Dynamic Tag Input Sidebar */}
        <div className="space-y-6">
          <div
            className={`rounded-2xl p-6 space-y-4 transition-colors ${
              darkMode ? "bg-zinc-900" : "bg-white"
            }`}
          >
            <h3
              className={`font-bold text-lg ${darkMode ? "text-slate-200" : "text-gray-800"}`}
            >
              {t("create.tags")}
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("create.tagsPlaceholder")}
                className={`min-w-0 flex-1 rounded-xl px-3 py-2 text-base border focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors ${
                  darkMode
                    ? "bg-zinc-800/80 border-zinc-700 text-slate-100 placeholder-zinc-500"
                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
                }`}
              />
              <button
                type="button"
                onClick={addTag}
                className="bg-blue-600 text-white text-base px-3 py-2 rounded-xl hover:bg-blue-700 transition-colors font-medium shrink-0"
              >
                {t("create.tags")}
              </button>
            </div>

            {/* Render Tag Chips */}
            <div className="flex flex-wrap gap-2 pt-2">
              {tags.map((tagItem, idx) => (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 text-base font-medium rounded-full border ${
                    darkMode
                      ? "bg-blue-950/50 text-blue-400 border-blue-900/50"
                      : "bg-blue-50 text-blue-600 border-blue-100"
                  }`}
                >
                  #{tagItem}
                  <button
                    type="button"
                    onClick={() => removeTag(tagItem)}
                    className={`transition-colors ${darkMode ? "hover:text-blue-200" : "hover:text-blue-800"}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePostView;
