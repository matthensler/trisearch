// TriSearch Intelligence — Anthropic API Proxy
// Deploy this as a Cloudflare Worker
// Set ANTHROPIC_API_KEY in your Worker's Environment Variables (Settings > Variables)

export default {
  async fetch(request, env) {

    // Only allow POST
    if (request.method === "OPTIONS") {
      return corsResponse(null, 204);
    }
    if (request.method !== "POST") {
      return corsResponse(JSON.stringify({ error: "Method not allowed" }), 405);
    }

    // Forward to Anthropic
    try {
      const body = await request.json();
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-beta": "web-search-2025-03-05"
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      return corsResponse(JSON.stringify(data), response.status);

    } catch (err) {
      return corsResponse(JSON.stringify({ error: err.message }), 500);
    }
  }
};

function corsResponse(body, status = 200) {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "https://trisearchintelligence.ai",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
