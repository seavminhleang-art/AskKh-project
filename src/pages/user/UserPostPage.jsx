import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HelpCircle, Search, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useCreatePostMutation } from "../../features/posts/postApi";
import {
  useCreateReportMutation,
  useGetCategoriesQuery,
  useGetLocationsQuery,
} from "../../features/lostFound/lostFoundApi";
import { useUploadSingleMutation } from "../../features/upload/uploadApi";

export default function UserPostPage({ kind }) {
  const navigate = useNavigate();
  const isQuestion = kind === "question";

  const [createPost, { isLoading: isCreatingPost }] = useCreatePostMutation();
  const [createReport, { isLoading: isCreatingReport }] =
    useCreateReportMutation();
  const [uploadSingle, { isLoading: isUploading }] = useUploadSingleMutation();

  const { data: categories = [] } = useGetCategoriesQuery(undefined, {
    skip: isQuestion,
  });
  const { data: locations = [] } = useGetLocationsQuery(undefined, {
    skip: isQuestion,
  });

  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: "",
    type: "LOST",
    categoryId: "1",
    locationId: "1",
    image: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imageError, setImageError] = useState("");
  const [formError, setFormError] = useState("");

  const update = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

  const selectImage = (event) => {
    const file = event.target.files?.[0];
    setImageError("");
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5_000_000) {
      setImageError("Choose an image under 5 MB.");
      event.target.value = "";
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () =>
      setForm((current) => ({ ...current, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const submit = async (event) => {
    event.preventDefault();
    setFormError("");

    if (isQuestion) {
      if (form.title.trim().length < 10) {
        setFormError("Question title must be at least 10 characters long.");
        return;
      }
      if (form.description.trim().length < 20) {
        setFormError(
          "Question description must be at least 20 characters long.",
        );
        return;
      }

      try {
        await createPost({
          title: form.title.trim(),
          body: form.description.trim(),
          postTypeId: 1, // Question
          tagIds: [],
        }).unwrap();

        toast.success("Question published successfully!");
        navigate("/dashboard/questions");
      } catch (err) {
        console.error("Failed to create post:", err);
        const msg =
          err?.data?.message || err?.error || "Failed to create question.";
        setFormError(msg);
        toast.error(msg);
      }
    } else {
      if (!form.title.trim()) {
        setFormError("Item name is required.");
        return;
      }
      if (!form.description.trim()) {
        setFormError("Description is required.");
        return;
      }

      try {
        let uploadedImageUrls = [];
        if (selectedFile) {
          const formData = new FormData();
          formData.append("file", selectedFile);
          const uploadRes = await uploadSingle(formData).unwrap();
          const uri =
            uploadRes?.uri ||
            uploadRes?.url ||
            (typeof uploadRes === "string" ? uploadRes : null);
          if (uri) uploadedImageUrls.push(uri);
        }

        await createReport({
          type: form.type,
          title: form.title.trim(),
          description: form.description.trim(),
          categoryId: Number(form.categoryId) || 1,
          locationId: Number(form.locationId) || 1,
          eventDate: new Date().toISOString(),
          images: uploadedImageUrls,
        }).unwrap();

        toast.success("Report submitted successfully!");
        navigate("/dashboard/lost-found");
      } catch (err) {
        console.error("Failed to create report:", err);
        const msg =
          err?.data?.message || err?.error || "Failed to submit report.";
        setFormError(msg);
        toast.error(msg);
      }
    }
  };

  const isLoading = isCreatingPost || isCreatingReport || isUploading;
  const Icon = isQuestion ? HelpCircle : Search;
  const title = isQuestion ? "Ask a question" : "Report a lost or found item";

  return (
    <section className="mx-auto max-w-3xl">
      <div className="rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-900 p-6 text-white shadow-lg">
        <Icon className="mb-3 h-7 w-7" />
        <h1 className="text-2xl font-black">{title}</h1>
        <p className="mt-1 text-lg text-blue-100">
          Share information with the student and campus community in real time.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="mt-6 space-y-5 rounded-3xl bg-white p-6 dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800"
      >
        {!isQuestion && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="block text-lg font-semibold text-slate-700 dark:text-slate-300">
              Report type
              <select
                name="type"
                value={form.type}
                onChange={update}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-lg dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="LOST">I lost an item</option>
                <option value="FOUND">I found an item</option>
              </select>
            </label>

            <label className="block text-lg font-semibold text-slate-700 dark:text-slate-300">
              Category
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={update}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-lg dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                {Array.isArray(categories) &&
                  categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name || c.categoryName || `Category #${c.id}`}
                    </option>
                  ))}
                {(!categories || categories.length === 0) && (
                  <>
                    <option value="1">Electronics</option>
                    <option value="2">Bags & Backpacks</option>
                    <option value="3">Clothing</option>
                    <option value="4">Accessories</option>
                  </>
                )}
              </select>
            </label>

            <label className="block text-lg font-semibold text-slate-700 dark:text-slate-300">
              Location
              <select
                name="locationId"
                value={form.locationId}
                onChange={update}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-lg dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                {Array.isArray(locations) &&
                  locations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name || l.locationName || `Location #${l.id}`}
                    </option>
                  ))}
                {(!locations || locations.length === 0) && (
                  <>
                    <option value="1">Campus Main Building</option>
                    <option value="2">Campus Library</option>
                    <option value="3">IT Lab 302</option>
                  </>
                )}
              </select>
            </label>
          </div>
        )}

        <label className="block text-lg font-semibold text-slate-700 dark:text-slate-300">
          {isQuestion ? "Question title (min 10 characters)" : "Item name"}
          <input
            required
            name="title"
            value={form.title}
            onChange={update}
            placeholder={
              isQuestion
                ? "e.g. How do I configure Redux Toolkit with React 19?"
                : "e.g. Blue student ID card"
            }
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-lg dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </label>

        {!isQuestion && (
          <label className="block text-lg font-semibold text-slate-700 dark:text-slate-300">
            Photo{" "}
            <span className="font-normal text-slate-500">
              (optional, under 5 MB)
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={selectImage}
              className="mt-2 block w-full text-lg text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-base file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {imageError && (
              <p className="mt-1 text-base text-rose-600">{imageError}</p>
            )}
            {form.image && (
              <img
                src={form.image}
                alt="Selected item preview"
                className="mt-3 h-36 w-48 rounded-xl object-cover border border-slate-200"
              />
            )}
          </label>
        )}

        {isQuestion && (
          <label className="block text-lg font-semibold text-slate-700 dark:text-slate-300">
            Tags{" "}
            <span className="font-normal text-slate-500">
              (comma separated)
            </span>
            <input
              name="tags"
              value={form.tags}
              onChange={update}
              placeholder="react, javascript, api"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-lg dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </label>
        )}

        <label className="block text-lg font-semibold text-slate-700 dark:text-slate-300">
          Description {isQuestion && "(min 20 characters)"}
          <textarea
            required
            name="description"
            value={form.description}
            onChange={update}
            rows="6"
            placeholder="Add enough detail so classmates or campus staff can help."
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-lg dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </label>

        {formError && (
          <div className="p-3 text-base rounded-xl bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/40">
            {formError}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-xl px-4 py-2 text-lg font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-lg font-bold text-white hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            <span>Publish</span>
          </button>
        </div>
      </form>
    </section>
  );
}
