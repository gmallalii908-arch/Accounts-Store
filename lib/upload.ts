import "server-only";

const ALLOWED_IMAGE = ["image/jpeg", "image/png", "image/webp"];
const DEFAULT_MAX = 5 * 1024 * 1024; // 5MB

/** يحول الصورة الـ MPUploaded إلى Base64 Data URL لتشتغل 100% على بيئات Vercel Serverless بدون أخطاء السيرفر */
export async function saveImage(
  file: File,
  _subdir: string,
  maxBytes = DEFAULT_MAX
): Promise<string> {
  if (!ALLOWED_IMAGE.includes(file.type)) {
    throw new Error("الصورة لازم تكون JPG أو PNG أو WEBP.");
  }
  if (file.size > maxBytes) {
    throw new Error("حجم الصورة كبير (الحد الأقصى 5 ميجا).");
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");
  const mimeType = file.type || "image/jpeg";
  return `data:${mimeType};base64,${base64}`;
}
