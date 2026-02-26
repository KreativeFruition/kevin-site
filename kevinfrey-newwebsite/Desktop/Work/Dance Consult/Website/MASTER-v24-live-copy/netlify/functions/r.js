// netlify/functions/r.js
export default async (req) => {
  try {
    const url = new URL(req.url);
    const dest = url.searchParams.get("u");
    const campaign = url.searchParams.get("c") || "unknown";
    const uid = url.searchParams.get("uid") || "anon";

    if (!dest || !/^https?:\/\//i.test(dest)) {
      return new Response(JSON.stringify({ error: "invalid url" }), {
        status: 400, headers: { "Content-Type": "application/json" }
      });
    }

    const ip = req.headers.get("x-nf-client-connection-ip") || req.headers.get("x-forwarded-for") || "";
    const ua = req.headers.get("user-agent") || "";

    // Log the click to Netlify function logs
    console.log("[CLICK]", JSON.stringify({ campaign, uid, dest, ts: Date.now(), ip, ua }));

    return new Response(null, { status: 302, headers: { Location: dest } });
  } catch (e) {
    console.error("redirect error:", e);
    return new Response(JSON.stringify({ error: "server error" }), {
      status: 500, headers: { "Content-Type": "application/json" }
    });
  }
};
