import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { palette, site } from "@/config/site";

// Generated once at build time from the real brand mark. No external services.
export const alt = "Renzik: AI call answering and follow-up for contractors";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Read at module scope (as the Next.js docs show) so the image prerenders at build time.
const mark = await readFile(join(process.cwd(), "public/brand/renzik-monogram.svg"));
const markSrc = `data:image/svg+xml;base64,${mark.toString("base64")}`;

export default async function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: palette.paper,
        color: palette.ink,
      }}
    >
      <img src={markSrc} width={120} height={120} alt="" />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, maxWidth: 960 }}>
          Stop losing jobs to voicemail.
        </div>
        <div style={{ fontSize: 34, marginTop: 28, color: palette.pine }}>
          {`${site.tradeName}: AI call answering and follow-up for contractors`}
        </div>
      </div>
    </div>,
    size,
  );
}
