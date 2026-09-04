/**
 * Client-side image compression utility.
 * Downscales images to max dimensions and compresses to JPEG Base64 data URL.
 * Keeps payloads lightweight (~10KB - 25KB) for instant database storage.
 */
export function compressImageFile(
  file: File,
  maxWidth = 400,
  maxHeight = 400,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("শুধুমাত্র ইমেজ ফাইল সিলেক্ট করুন (Only image files allowed)"));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Calculate aspect ratio
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }

          // Smooth rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);

          // Export as compressed JPEG
          const dataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(dataUrl);
        } catch (err) {
          // Fallback to original read result if canvas throws
          resolve(e.target?.result as string);
        }
      };

      img.onerror = () => {
        reject(new Error("ছবি লোড করতে ব্যর্থ হয়েছে"));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error("ফাইল পড়তে সমস্যা হয়েছে"));
    };

    reader.readAsDataURL(file);
  });
}
