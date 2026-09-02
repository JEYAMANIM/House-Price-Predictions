// Linear Regression Model parameters (derived from House_price_model.pkl)
const INTERCEPT = 804482.9752200334;
const WEIGHTS = {
  area: 238.20232607412154,
  bedrooms: 212095.29864273898,
  bathrooms: 1213543.9599557458,
  guestroom: 322002.9169623861,
  basement: 170658.22915833484,
  hotwaterheating: 744489.2526136208,
  airconditioning: 996278.9861611756,
  parking: 212985.94582697816,
  prefarea: 686316.9219356399,
  "furnishingstatus_semi-furnished": -206544.60875471676,
  furnishingstatus_unfurnished: -539807.073576774
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Health check endpoint
    if (url.pathname === "/health") {
      return new Response(JSON.stringify({ status: "ok", model_loaded: true, platform: "cloudflare-worker" }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    // Prediction endpoint
    if (url.pathname === "/predict" && request.method === "POST") {
      try {
        const body = await request.json();

        let score = INTERCEPT;
        score += (Number(body.area) || 0) * WEIGHTS.area;
        score += (Number(body.bedrooms) || 0) * WEIGHTS.bedrooms;
        score += (Number(body.bathrooms) || 0) * WEIGHTS.bathrooms;
        score += (Number(body.guestroom) || 0) * WEIGHTS.guestroom;
        score += (Number(body.basement) || 0) * WEIGHTS.basement;
        score += (Number(body.hotwaterheating) || 0) * WEIGHTS.hotwaterheating;
        score += (Number(body.airconditioning) || 0) * WEIGHTS.airconditioning;
        score += (Number(body.parking) || 0) * WEIGHTS.parking;
        score += (Number(body.prefarea) || 0) * WEIGHTS.prefarea;
        score += (Number(body["furnishingstatus_semi-furnished"]) || Number(body.furnishingstatus_semi_furnished) || 0) * WEIGHTS["furnishingstatus_semi-furnished"];
        score += (Number(body.furnishingstatus_unfurnished) || 0) * WEIGHTS.furnishingstatus_unfurnished;

        const predicted_price = Math.round(score * 100) / 100;
        return new Response(JSON.stringify({ predicted_price }), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 400,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }
    }

    // Serve static assets via Cloudflare Workers Static Assets binding
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("Not found", { status: 404 });
  }
};
