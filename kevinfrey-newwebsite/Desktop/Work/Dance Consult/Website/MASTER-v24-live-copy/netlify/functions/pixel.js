// netlify/functions/pixel.js

// 1x1 transparent PNG
const PNG_BYTES = Uint8Array.from([
  137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,1,0,0,0,1,8,6,0,0,0,31,21,196,137,
  0,0,0,10,73,68,65,84,120,156,99,0,1,0,0,5,0,1,13,10,44,10,0,0,0,0,73,69,78,68,174,66,96,130
]);

export default async (req) => {
  try {
    const url = new URL(req.url);
    const campaign = url.searchParams.get("c") || "unknown";
    const uid = url.searchParams.get("uid") || "anon";
    const ip = req.headers.get("x-nf-client-connection-ip") || req.headers.get("x-forwarded-for") || "";
    const ua = req.headers.get("user-agent") || "";

    // Log the open to Netlify function logs
    console.log("[OPEN]", JSON.stringify({ campaign, uid, ts: Date.now(), ip, ua }));

    return new Response(PNG_BYTES, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
        "Content-Length": String(PNG_BYTES.length),
      }
    });
  } catch (e) {
    console.error("pixel error:", e);
    return new Response(PNG_BYTES, {
      headers: { "Content-Type": "image/png", "Cache-Control": "no-store" }
    });
  }
};
