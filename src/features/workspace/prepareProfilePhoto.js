// Keep avatar uploads below typical proxy body limits, including multipart overhead.
const MAX_UPLOAD_BYTES = 400 * 1024;
const MAX_DIMENSION = 1024;

export async function prepareProfilePhoto(file) {
  if (file.size <= MAX_UPLOAD_BYTES) return file;
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Unable to prepare this photo. Please choose a smaller image.');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    for (const quality of [0.85, 0.7, 0.55, 0.4]) {
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
      if (blob && blob.size <= MAX_UPLOAD_BYTES) {
        return new File([blob], 'profile-photo.jpg', { type: 'image/jpeg' });
      }
    }
    throw new Error('Unable to reduce this photo enough. Please choose a smaller image.');
  } finally {
    bitmap.close();
  }
}
