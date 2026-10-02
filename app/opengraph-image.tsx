import { ImageResponse } from "next/og";
export const runtime = "nodejs";
export const alt = "IWantToMove.ca — Moving doesn’t have to be a headache.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#f6f3eb",
        color: "#193f35",
        padding: "70px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", fontSize: 34 }}>IWantToMove.ca ↗</div>
      <div
        style={{
          display: "flex",
          fontSize: 78,
          maxWidth: 950,
          lineHeight: 1.05,
        }}
      >
        Moving Doesn’t Have to Be a Headache.
      </div>
      <div style={{ display: "flex", fontSize: 28 }}>
        Get a Free Moving Quote · 778-513-7503
      </div>
    </div>,
    size,
  );
}
