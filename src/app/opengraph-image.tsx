import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#000",
          color: "#fff",
          padding: "80px",
          fontFamily: "Space Grotesk, Arial, sans-serif",
        }}
      >
        <div style={{ fontSize: 20, letterSpacing: 8, textTransform: "uppercase", color: "#888" }}>
          Kevin Frey
        </div>
        <div>
          <div style={{ fontSize: 96, lineHeight: 1, fontWeight: 700 }}>
            Director & Creative Producer
          </div>
          <p style={{ fontSize: 28, marginTop: 24, color: "#b3b3b3", letterSpacing: 6, textTransform: "uppercase" }}>
            Vision. Movement. Execution at Scale.
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
