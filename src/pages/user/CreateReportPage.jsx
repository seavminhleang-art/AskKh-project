import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { UploadCloud, Send, X, Globe2, GraduationCap, ShieldCheck, MapPin, Image as ImageIcon, Loader2, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import { useWorkspaceTranslation } from "@/locales/workspace/useWorkspaceTranslation";
import { useWorkspaceDataQuery, useWorkspaceSaveMutation } from "../../features/workspace/workspaceApi";
import { rows, message } from "../../features/workspace/workspaceModel";
import { Heading } from "./WorkspaceUI";
const TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function ImagePreview({ file }) {
  const ref = useRef(null);
  useEffect(() => {
    const url = URL.createObjectURL(file);
    if (ref.current) ref.current.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);
  return <img ref={ref} alt={file.name} />;
}

export default function CreateReportPage() {
  const { w } = useWorkspaceTranslation();
  const [params] = useSearchParams();
  const [type, setType] = useState(params.get("type") === "found" ? "found" : "lost");
  const found = type === "found";
  const navigate = useNavigate();
  const categories = useWorkspaceDataQuery({ resource: "categories" });
  const locations = useWorkspaceDataQuery({ resource: "locations" });
  const [save] = useWorkspaceSaveMutation();
  const [photo, setPhoto] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [locationId, setLocationId] = useState("");
  const input = useRef(null);
  const uploaded = useRef(null);
  function selectFiles(files) {
    if (busy) return;
    if (files.length !== 1) {
      setError(w("Please select one image for your report."));
      setPhoto(null);
      uploaded.current = null;
      return;
    }
    const file = files[0];
    if (!TYPES.includes(file.type) || !file.size || file.size > 5 * 1024 * 1024) {
      setError(w("Choose a JPG, PNG, WebP, or GIF image under 5 MB."));
      setPhoto(null);
      uploaded.current = null;
      return;
    }
    setPhoto(file); uploaded.current = null; setError("");
  }
  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    const title = form.get("title").trim();
    const description = form.get("description").trim();
    const location = form.get("location").trim();
    const selectedLocationId = form.get("locationId");
    if (!title || !description || (!location && !selectedLocationId)) { setError(w("Enter an item name, description, and at least one location.")); return; }
    const photoUrlInput = form.get("photoUrl").trim();
    if (photoUrlInput && !/^https?:\/\//i.test(photoUrlInput)) { setError(w("Enter a valid photo URL starting with http:// or https://.")); return; }
    const extras = [[w("Brand / Model"), form.get("brand").trim()], [w("Color"), form.get("color").trim()]].filter(([, value]) => value);
    setError(""); setBusy(true);
    try {
      let photoUrl = photoUrlInput || null;
      if (photo) {
        if (uploaded.current?.file === photo) photoUrl = uploaded.current.uri;
        else {
          const upload = new FormData(); upload.append("file", photo);
          const result = await save({ resource: "image-upload", action: "create", body: upload }).unwrap();
          const uploadedFile = result?.data ?? result;
          photoUrl = uploadedFile?.uri ?? uploadedFile?.url ?? uploadedFile?.fileUrl;
          if (!photoUrl) throw new Error("Image upload did not return a URL. Please try again.");
          uploaded.current = { file: photo, uri: photoUrl };
        }
      }
      await save({ resource: "reports", action: "create", body: {
        itemType: type, title, description: [description, ...extras.map(([label, value]) => `${label}: ${value}`)].join("\n\n"),
        itemDate: form.get("itemDate"), scope: form.get("scope"), freeTextLocation: location || null,
        locationId: selectedLocationId ? Number(selectedLocationId) : null,
        categoryId: form.get("categoryId") ? Number(form.get("categoryId")) : null,
        hiddenDetail: form.get("hiddenDetail").trim() || null, photoUrl,
      } }).unwrap();
      toast.success(w("Your report was published."));
      navigate("/dashboard/lost-found");
    } catch (failure) { setError(message(failure)); }
    finally { setBusy(false); }
  }
  return <div className="uw-page cq-page cr-page">
    <Heading title={found ? w("Create Found Report") : w("Create Lost Report")} description={found ? w("Help a found item make its way back to its owner.") : w("Report your lost item to help others find it and increase the chance of returning it.")} />
    <form onSubmit={submit} aria-busy={busy}>
      {error && <div className="cq-error" role="alert">{error}</div>}
      <fieldset className="cq-layout" disabled={busy}>
        <div className="cq-main">
          <section className="cq-card cq-details">
            <div className="cr-section-heading"><h2>{w("Item Details")}</h2><div className="cr-type" role="group" aria-label={w("Report type")}>{["lost", "found"].map(value => <button type="button" key={value} aria-pressed={type === value} onClick={() => setType(value)}>{w(value === "lost" ? "Lost" : "Found")}</button>)}</div></div>
            <label htmlFor="cr-title">{w("Item Name / Title")}<span className="cq-required">*</span></label>
            <input name="title" id="cr-title" required maxLength={300} placeholder={w("e.g., Black wallet, iPhone 14, student ID card")} />
            <small>{w("Provide a short and clear name for your item.")}</small>
            <label htmlFor="cr-category">{w("Category")}</label>
            <select name="categoryId" id="cr-category" disabled={categories.isLoading || categories.isError}><option value="">{w("Select a category (optional)")}</option>{rows(categories.data).map(category => <option key={category.id} value={category.id}>{category.name || category.categoryName}</option>)}</select>
            {categories.isError && <p className="cr-query-error" role="alert">{message(categories.error)} <button type="button" onClick={categories.refetch}>{w("Retry")}</button></p>}
            <small>{w("Choose the category that best matches your item.")}</small>
            <label htmlFor="cr-description">{w("Description")}<span className="cq-required">*</span></label>
            <div className="cq-editor"><div className="cq-editor-toolbar"><span>{w("Item description")}</span><MapPin size={15} /></div><textarea name="description" id="cr-description" rows={6} required placeholder={w("Describe the item in detail…")} /></div>
            <small>{w("Include color, brand, model, and any visible features.")}</small>
            <div className="cr-fields">
              <label htmlFor="cr-date"><span>{found ? w("When was it found?") : w("When was it lost?")}<b className="cq-required">*</b></span><input type="date" name="itemDate" id="cr-date" required /><small>{w("Choose the date associated with this item.")}</small></label>
              <label htmlFor="cr-campus-location"><span>{w("Campus location")}</span><select name="locationId" id="cr-campus-location" value={locationId} onChange={event => setLocationId(event.target.value)} disabled={locations.isLoading || locations.isError}><option value="">{w("Choose a campus location (optional)")}</option>{rows(locations.data).map(location => <option key={location.id} value={location.id}>{[location.building, location.floor, location.room].filter(Boolean).join(", ")}</option>)}</select><small>{w("Select a campus location or enter a location below.")}</small></label>
              <label htmlFor="cr-location"><span>{found ? w("Where was it found?") : w("Where was it lost?")}<b className="cq-required">*</b></span><input name="location" id="cr-location" required={!locationId} placeholder={w("e.g., Library, Classroom 302, ISTAD cafeteria")} /><small>{w("Be specific about the location.")}</small></label>
            </div>
            {locations.isError && <p className="cr-query-error" role="alert">{message(locations.error)} <button type="button" onClick={locations.refetch}>{w("Retry")}</button></p>}
          </section>
          <section className="cq-card cr-help"><ShieldCheck size={23} /><div><h2>{w("Help the right person identify it")}</h2><p>{w("Keep passwords, phone numbers, and sensitive personal details out of your description. Use the identifying detail field for information an owner would know.")}</p></div></section>
          <div className="cq-actions"><button className="cq-submit" type="submit" disabled={busy}>{busy ? <><Loader2 size={16} className="animate-spin" />{w("Publishing…")}</> : <><Send size={15} />{found ? w("Submit Found Report") : w("Submit Lost Report")}<ArrowRight size={15} /></>}</button><Link to="/dashboard/lost-found">{w("Cancel")}</Link></div>
        </div>
        <aside className="cq-sidebar">
          <section className="cq-card"><h2>{w("Item Image")}</h2><small>{w("Add a photo of the item (optional).")}</small>
            <div className={`cq-dropzone ${dragging ? "is-dragging" : ""}`} onDragOver={event => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={event => { event.preventDefault(); setDragging(false); selectFiles(event.dataTransfer.files); }}>
              <UploadCloud size={30} /><span>{w("Drag & drop an image here or")} <button type="button" onClick={() => input.current?.click()}>{w("click to browse")}</button></span><small>{w("JPG, PNG, WebP, GIF · Up to 5 MB")}</small>
              <input ref={input} type="file" accept={TYPES.join(",")} hidden onChange={event => { if (event.target.files.length) selectFiles(event.target.files); event.target.value = ""; }} />
            </div>
            {photo && <div className="cr-photo"><ImagePreview file={photo} /><div><span>{photo.name}</span><button type="button" onClick={() => { setPhoto(null); uploaded.current = null; }} aria-label={w("Remove image")}><X size={16} /></button></div></div>}
            <label className="cr-photo-url" htmlFor="cr-photo-url">{w("Or enter a photo URL (optional)")}<span><ImageIcon size={16} /><input id="cr-photo-url" name="photoUrl" type="url" placeholder="https://example.com/item-photo.jpg" /></span></label>
          </section>
          <section className="cq-card cr-additional"><h2>{w("Additional Details")} <span>{w("Optional")}</span></h2>
            <label htmlFor="cr-brand">{w("Brand / Model")}</label><input name="brand" id="cr-brand" placeholder={w("e.g., Apple, Samsung, Nike")} />
            <label htmlFor="cr-color">{w("Color")}</label><input name="color" id="cr-color" placeholder={w("e.g., Black, blue, silver")} />
            <label htmlFor="cr-detail">{w("Identifying detail")}</label><textarea name="hiddenDetail" id="cr-detail" rows={3} placeholder={w("A detail only the owner would know")} />
          </section>
          <section className="cq-card"><h2>{w("Visibility")}</h2><small>{w("Who is this report for?")}</small>
            <label className="cr-visibility"><input type="radio" name="scope" value="istad" defaultChecked /><GraduationCap size={17} /><span><strong>{w("ISTAD")}</strong><small>{w("An item related to the ISTAD campus.")}</small></span></label>
            <label className="cr-visibility"><input type="radio" name="scope" value="public" /><Globe2 size={17} /><span><strong>{w("Public")}</strong><small>{w("Share with the wider community.")}</small></span></label>
          </section>
        </aside>
      </fieldset>
    </form>
  </div>;
}
