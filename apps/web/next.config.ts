import type { NextConfig } from "next";
import { copyFileSync } from "fs";
import { resolve } from "path";

// Copy pdfjs worker to public/ so it can be served as /pdf.worker.min.mjs
// This must stay in sync with the installed pdfjs-dist version.
try {
  copyFileSync(
    resolve(__dirname, "../../node_modules/pdfjs-dist/build/pdf.worker.min.mjs"),
    resolve(__dirname, "public/pdf.worker.min.mjs"),
  );
} catch {
  // Fallback: try local node_modules
  try {
    copyFileSync(
      resolve(__dirname, "node_modules/pdfjs-dist/build/pdf.worker.min.mjs"),
      resolve(__dirname, "public/pdf.worker.min.mjs"),
    );
  } catch {
    console.warn("⚠️  Could not copy pdfjs worker to public/. ManualCopy may be needed.");
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
};

export default nextConfig;
