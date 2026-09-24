// Keep avatar uploads below typical proxy body limits, including multipart overhead.
const MAX_UPLOAD_BYTES = 400 * 1024;
const MAX_DIMENSION = 1024;

export async function prepareProfilePhoto(file) {
  if (!file || file.size <= MAX_UPLOAD_BYTES) return file;
  try {
    if (typeof createImageBitmap === 'function') {
      const bitmap = await createImageBitmap(file);
      try {
        const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(bitmap.width * scale));
        canvas.height = Math.max(1, Math.round(bitmap.height * scale));
        const context = canvas.getContext('2d');
        if (context) {
          context.fillStyle = '#ffffff';
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
          for (const quality of [0.85, 0.7, 0.55, 0.4]) {
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
            if (blob && blob.size <= MAX_UPLOAD_BYTES) {
              const name = file.name ? file.name.replace(/\.[^/.]+$/, '.jpg') : 'profile-photo.jpg';
              return new File([blob], name, { type: 'image/jpeg' });
            }
          }
        }
      } finally {
        bitmap.close?.();
      }
    }
  } catch (err) {
    console.warn('Image optimization skipped:', err);
  }
  return file;
}
