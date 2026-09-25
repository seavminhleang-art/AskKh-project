import { formatMediaUrl } from "../workspace/profileImage.js";
// MediaResponse.uri is the URL accepted by PostRequest.imageUrls.
export async function uploadQuestionImages(files, uploadSingle, uploadMultiple) {
  if (!files.length) return [];
  const single = files.length === 1;
  const form = new FormData();
  files.forEach(file => form.append(single ? "file" : "files", file));
  const response = await (single ? uploadSingle(form) : uploadMultiple(form)).unwrap();
  const data = response?.data ?? response;
  const media = single ? [data] : data;
  if (!Array.isArray(media) || media.length !== files.length ||
      media.some(item => typeof item?.uri !== "string" || !/^https?:\/\/.+/.test(item.uri))) {
    throw new Error("Image upload did not return valid image URLs. Please try again.");
  }
  return media.map(item => formatMediaUrl(item.uri));
}
