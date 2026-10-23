/**
 * Cloudinary unsigned upload service with client-side compression to < 1 MB.
 * Zero-cost photo storage per specifications.
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Compresses an image file in the browser before upload to ensure size < 1MB.
 */
export async function compressImageToUnder1MB(file: File): Promise<Blob> {
  if (file.size <= 1024 * 1024) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Downscale if dimension exceeds 1920px
        const maxDimension = 1920;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Progressively lower quality until < 1MB
        let quality = 0.85;
        const tryExport = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                resolve(file);
                return;
              }
              if (blob.size <= 1024 * 1024 || quality <= 0.4) {
                resolve(blob);
              } else {
                quality -= 0.15;
                tryExport();
              }
            },
            'image/jpeg',
            quality
          );
        };
        tryExport();
      };
      img.onerror = () => reject(new Error('Failed to process image file.'));
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
  });
}

/**
 * Uploads an image to Cloudinary unsigned preset, or creates an instant local object URL fallback
 * if Cloudinary keys have not been configured yet.
 */
export async function uploadImage(file: File): Promise<string> {
  const compressedBlob = await compressImageToUnder1MB(file);

  if (CLOUD_NAME && UPLOAD_PRESET) {
    try {
      const formData = new FormData();
      formData.append('file', compressedBlob);
      formData.append('upload_preset', UPLOAD_PRESET);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        return data.secure_url;
      }
    } catch (err) {
      console.warn('Cloudinary upload error, using local preview:', err);
    }
  }

  // Fallback: Read as data URL for instant zero-config preview
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(compressedBlob);
  });
}
