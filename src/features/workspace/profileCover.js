const STORAGE_PREFIX = "nexa_profile_cover_";
const MAX_DATA_URL_LENGTH = 850_000;

function storageKey(userKey) {
  if (!userKey) throw new Error("A user is required to save a cover.");
  return `${STORAGE_PREFIX}${userKey}`;
}

async function loadImage(file) {
  if (typeof createImageBitmap === "function") return createImageBitmap(file);

  const url = URL.createObjectURL(file);
  try {
    return await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("This image could not be opened."));
      image.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function prepareCoverDataUrl(file) {
  const image = await loadImage(file);
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Image editing is unavailable in this browser.");

    for (const maxDimension of [1600, 1200, 900]) {
      const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      for (const quality of [0.84, 0.7, 0.55, 0.4]) {
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        if (dataUrl.length <= MAX_DATA_URL_LENGTH) return dataUrl;
      }
    }

    throw new Error("This cover is too large to store in your browser.");
  } finally {
    image.close?.();
  }
}

export async function getProfileCover(userKey) {
  return window.localStorage.getItem(storageKey(userKey));
}

export async function saveProfileCover(userKey, file) {
  const dataUrl = await prepareCoverDataUrl(file);
  window.localStorage.setItem(storageKey(userKey), dataUrl);
  return dataUrl;
}

export async function removeProfileCover(userKey) {
  window.localStorage.removeItem(storageKey(userKey));
}
