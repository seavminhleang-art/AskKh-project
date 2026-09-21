import { useWorkspaceTranslation } from "@/locales/workspace/useWorkspaceTranslation";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  useWorkspaceDataQuery,
  useWorkspaceSaveMutation,
} from "../../features/workspace/workspaceApi";
import { rows, message } from "../../features/workspace/workspaceModel";
import { Heading, QueryState } from "./WorkspaceUI";
export default function UserPostPage({ kind }) {
  const { w } = useWorkspaceTranslation();
  const question = kind === "question";
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tags = useWorkspaceDataQuery({
    resource: question ? "tags" : "categories",
  });
  const [save, state] = useWorkspaceSaveMutation();
  const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      let body;
      if (question) {
        body = {
          title: form.get("title").trim(),
          body: form.get("description").trim(),
          postTypeId: 1,
          tagIds: form.getAll("tagIds").map(Number),
          imageUrls: [],
          codeSnippet: form.get("codeSnippet") || null,
          codeLanguage: form.get("codeSnippet")
            ? form.get("codeLanguage")
            : null,
        };
        if (body.title.length < 10 || body.body.length < 20)
          throw new Error(
            "Use at least 10 characters for the title and 20 for the description.",
          );
        const image = form.get("image");
        if (image?.size) {
          if (
            !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
              image.type,
            ) ||
            image.size > 5 * 1024 * 1024
          )
            throw new Error("Choose an image under 5 MB.");
          const multipart = new FormData();
          multipart.append(
            "post",
            new Blob([JSON.stringify(body)], {
              type: "application/json",
            }),
          );
          multipart.append("images", image);
          await save({
            resource: "post-images",
            action: "create",
            body: multipart,
          }).unwrap();
        } else
          await save({
            resource: "posts",
            action: "create",
            body,
          }).unwrap();
      } else {
        body = {
          title: form.get("title").trim(),
          description: form.get("description").trim(),
          itemType: form.get("itemType"),
          itemDate: form.get("itemDate"),
          scope: form.get("scope"),
          freeTextLocation: form.get("location").trim(),
          categoryId: form.get("categoryId")
            ? Number(form.get("categoryId"))
            : null,
          hiddenDetail: form.get("hiddenDetail") || null,
          photoUrl: form.get("photoUrl") || null,
        };
        await save({
          resource: "reports",
          action: "create",
          body,
        }).unwrap();
      }
      navigate(`/dashboard/${question ? "questions" : "lost-found"}`);
    } catch (error) {
      setError(message(error));
    }
  }
  return (
    <div className="uw-page">
      <Heading
        title={question ? w("Ask a Question") : w("Report an item")}
        description={
          question
            ? w("Share your question with the community and get help.")
            : w("Help a lost item find its way back to its owner.")
        }
      />
      <form
        className="uw-columns uw-form"
        onSubmit={submit}
        aria-busy={state.isLoading}
      >
        <section className="uw-card uw-form">
          <h2>{question ? w("Question details") : w("Item details")}</h2>
          {error && (
            <p role="alert" className="uw-error">
              {w(error)}
            </p>
          )}
          <label>
            {question ? w("Question title") : w("Item name")}
            <input
              name="title"
              required
              minLength={question ? 10 : 1}
              maxLength={300}
              placeholder={
                question
                  ? w("What would you like help with?")
                  : w("Describe the item")
              }
            />
          </label>
          {!question && (
            <div className="uw-fields">
              <label>
                {w("Report type")}
                <select
                  name="itemType"
                  defaultValue={
                    searchParams.get("type") === "found" ? "found" : "lost"
                  }
                >
                  <option value="lost">{w("Lost")}</option>
                  <option value="found">{w("Found")}</option>
                </select>
              </label>
              <label>
                {w("Date")}
                <input name="itemDate" type="date" required />
              </label>
              <label>
                {w("Location")}
                <input name="location" required />
              </label>
              <label>
                {w("Scope")}
                <select name="scope">
                  <option value="istad">ISTAD</option>
                  <option value="public">{w("Public")}</option>
                </select>
              </label>
            </div>
          )}
          <label>
            {w("Description")}
            <textarea
              name="description"
              rows={9}
              required
              minLength={question ? 20 : 1}
              placeholder={w(
                "Include details that will help others understand.",
              )}
            />
          </label>
          {question ? (
            <>
              <label>
                {w("Code snippet (optional)")}
                <textarea
                  name="codeSnippet"
                  rows={5}
                  maxLength={20000}
                  spellCheck={false}
                />
              </label>
              <label>
                {w("Code language")}
                <select name="codeLanguage">
                  <option>javascript</option>
                  <option>typescript</option>
                  <option>python</option>
                  <option>java</option>
                  <option>html</option>
                  <option>css</option>
                  <option>sql</option>
                  <option>text</option>
                </select>
              </label>
              <label>
                {w("Attach an image (optional, up to 5 MB)")}
                <input
                  type="file"
                  name="image"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                />
              </label>
            </>
          ) : (
            <>
              <label>
                {w("Identifying detail")}
                <textarea
                  name="hiddenDetail"
                  rows={3}
                  placeholder={w("A detail the owner would know")}
                />
              </label>
              <label>
                {w("Photo URL (optional)")}
                <input
                  name="photoUrl"
                  type="url"
                  placeholder="https://…"
                  pattern="https?://.+"
                />
              </label>
            </>
          )}
          <div className="uw-actions">
            <Link
              className="uw-button secondary"
              to={`/dashboard/${question ? "questions" : "lost-found"}`}
            >
              {w("Cancel")}
            </Link>
            <button className="uw-button" disabled={state.isLoading}>
              {state.isLoading
                ? w("Publishing\u2026")
                : question
                  ? w("Post question")
                  : w("Publish report")}
            </button>
          </div>
        </section>
        <aside className="uw-stack">
          <section className="uw-card uw-form">
            <h2>{question ? w("Tags") : w("Category")}</h2>
            <QueryState query={tags}>
              {question ? (
                rows(tags.data).map((tag) => (
                  <label
                    key={tag.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <input
                      style={{
                        width: 18,
                      }}
                      type="checkbox"
                      name="tagIds"
                      value={tag.id}
                    />
                    {tag.tagName}
                  </label>
                ))
              ) : (
                <label>
                  {w("Choose a category")}
                  <select name="categoryId">
                    <option value="">{w("Uncategorized")}</option>
                    {rows(tags.data).map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name || item.categoryName}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </QueryState>
          </section>
          <section className="uw-card">
            <h2>{w("Before you publish")}</h2>
            <p className="uw-muted mt-3">
              {w(
                "Use a clear title, include relevant details, and avoid sharing private contact information.",
              )}
            </p>
          </section>
        </aside>
      </form>
    </div>
  );
}
