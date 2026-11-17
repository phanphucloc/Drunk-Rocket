/**
 * Drunk Rocket - Cloudflare Serverless Worker API
 * Architecture: 100% Free Tier ($0) - Cloudflare Workers + D1 SQLite
 * 
 * Endpoints:
 * - GET  /health
 * - GET  /api/leaderboard?type=daily|alltime&limit=10
 * - POST /api/score
 */

// Common CORS Headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Max-Age": "86400",
};

/**
 * Helper to generate JSON response with CORS
 */
function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders,
      ...extraHeaders,
    },
  });
}

/**
 * Anti-Cheat: Validate SHA-256 telemetry hash
 */
async function verifyClientHash(playerName, score, durationMs, clientHash, salt) {
  if (!clientHash || !salt) return true; // Optional check if salt/hash not enforced
  try {
    const text = `${playerName}:${score}:${durationMs}:${salt}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const calculatedHash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    return calculatedHash.toLowerCase() === clientHash.toLowerCase();
  } catch (err) {
    console.error("Hash verification error:", err);
    return false;
  }
}

export default {
  async fetch(request, env, ctx) {
    // 1. Handle CORS Preflight (OPTIONS)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // 2. Health Check
      if (path === "/" || path === "/health" || path === "/api/health") {
        return jsonResponse({
          status: "healthy (CI/CD v1.1.0-verified)",
          service: "Drunk Rocket Serverless Backend",
          timestamp: new Date().toISOString(),
          d1Connected: !!env.DB,
          tier: "Cloudflare 0d Free Tier",
        });
      }

      // 3. GET /api/leaderboard
      if (request.method === "GET" && path === "/api/leaderboard") {
        const type = url.searchParams.get("type") === "daily" ? "daily" : "alltime";
        const limitParam = parseInt(url.searchParams.get("limit") || "10", 10);
        const limit = Math.max(1, Math.min(limitParam, 100)); // Clamp 1 to 100

        // Fallback mock mode if D1 DB is not yet bound during early local development
        if (!env.DB) {
          return jsonResponse({
            success: true,
            warning: "D1 Database binding not detected. Returning mock leaderboard data.",
            type,
            count: 5,
            data: [
              { rank: 1, player_name: "ACE", score: 42, duration_ms: 55000, ip_country: "VN", created_at: new Date().toISOString() },
              { rank: 2, player_name: "FLY", score: 35, duration_ms: 46000, ip_country: "US", created_at: new Date().toISOString() },
              { rank: 3, player_name: "BOT", score: 28, duration_ms: 38000, ip_country: "JP", created_at: new Date().toISOString() },
              { rank: 4, player_name: "DRK", score: 20, duration_ms: 27000, ip_country: "SG", created_at: new Date().toISOString() },
              { rank: 5, player_name: "NEO", score: 15, duration_ms: 21000, ip_country: "DE", created_at: new Date().toISOString() },
            ],
          });
        }

        let query = "";
        let stmt;

        if (type === "daily") {
          // Top daily (past 24 hours)
          query = `
            SELECT player_name, score, duration_ms, ip_country, created_at 
            FROM scores 
            WHERE created_at >= datetime('now', '-24 hours')
            ORDER BY score DESC, duration_ms ASC, created_at ASC 
            LIMIT ?;
          `;
          stmt = env.DB.prepare(query).bind(limit);
        } else {
          // Top All-Time
          query = `
            SELECT player_name, score, duration_ms, ip_country, created_at 
            FROM scores 
            ORDER BY score DESC, duration_ms ASC, created_at ASC 
            LIMIT ?;
          `;
          stmt = env.DB.prepare(query).bind(limit);
        }

        const { results } = await stmt.all();

        // Add rank number (1-indexed)
        const rankedData = (results || []).map((row, index) => ({
          rank: index + 1,
          player_name: row.player_name,
          score: row.score,
          duration_ms: row.duration_ms,
          ip_country: row.ip_country || "XX",
          created_at: row.created_at,
        }));

        return jsonResponse({
          success: true,
          type,
          count: rankedData.length,
          data: rankedData,
        });
      }

      // 4. POST /api/score
      if (request.method === "POST" && path === "/api/score") {
        let body;
        try {
          body = await request.json();
        } catch {
          return jsonResponse({ success: false, error: "Invalid JSON body format" }, 400);
        }

        let { player_name, score, duration_ms, client_hash } = body || {};

        // Validation: player_name (Arcade 1-6 chars, alphanumeric)
        if (typeof player_name !== "string" || !player_name.trim()) {
          player_name = "AAA";
        }
        player_name = player_name.trim().toUpperCase().replace(/[^A-Z0-9_]/g, "").slice(0, 6);
        if (!player_name) {
          player_name = "AAA";
        }

        // Validation: score & duration_ms
        score = parseInt(score, 10);
        duration_ms = parseInt(duration_ms, 10);

        if (isNaN(score) || score < 0) {
          return jsonResponse({ success: false, error: "Invalid score value" }, 400);
        }
        if (isNaN(duration_ms) || duration_ms < 0) {
          return jsonResponse({ success: false, error: "Invalid duration value" }, 400);
        }

        // --- ANTI-CHEAT ENGINE (Task BE-02) ---
        // 1. Min duration check per score point
        // In Drunk Rocket, laser pillars appear sequentially with minimum interval (~0.8s - 1.2s)
        const minMsPerPoint = parseInt(env.MIN_MS_PER_POINT || "800", 10);
        if (score > 0) {
          const minimumExpectedDuration = score * minMsPerPoint;
          if (duration_ms < minimumExpectedDuration) {
            return jsonResponse(
              {
                success: false,
                error: "Anti-cheat rejected: Telemetry anomaly detected (unrealistic score-to-time ratio).",
                details: { score, duration_ms, minExpectedMs: minimumExpectedDuration },
              },
              403
            );
          }
        }

        // 2. Maximum reasonable limit cap (e.g. maximum theoretical arcade session)
        if (score > 9999) {
          return jsonResponse({ success: false, error: "Anti-cheat rejected: Score exceeds ceiling limit." }, 403);
        }

        // 3. Optional Hash verification if configured
        if (env.SCORE_SALT && client_hash) {
          const isValidHash = await verifyClientHash(player_name, score, duration_ms, client_hash, env.SCORE_SALT);
          if (!isValidHash) {
            return jsonResponse({ success: false, error: "Anti-cheat rejected: Invalid telemetry signature." }, 403);
          }
        }

        // Extract IP Country from Cloudflare header
        const ipCountry = request.cf?.country || "XX";

        // If D1 is not bound, return mock success
        if (!env.DB) {
          return jsonResponse({
            success: true,
            warning: "D1 Database binding not detected. Mock score recorded.",
            player_name,
            score,
            duration_ms,
            ip_country: ipCountry,
            rank: 1,
          });
        }

        // Insert into D1
        const insertStmt = env.DB.prepare(`
          INSERT INTO scores (player_name, score, duration_ms, client_hash, ip_country)
          VALUES (?, ?, ?, ?, ?);
        `).bind(player_name, score, duration_ms, client_hash || null, ipCountry);

        const insertResult = await insertStmt.run();

        // Calculate player rank
        const rankStmt = env.DB.prepare(`
          SELECT COUNT(*) as better_count FROM scores WHERE score > ?;
        `).bind(score);
        const rankResult = await rankStmt.first();
        const currentRank = (rankResult?.better_count || 0) + 1;

        return jsonResponse({
          success: true,
          message: "Score successfully submitted to Leaderboard",
          player_name,
          score,
          duration_ms,
          ip_country: ipCountry,
          rank: currentRank,
          inserted_id: insertResult.meta?.last_row_id || null,
        }, 201);
      }

      // 5. 404 Not Found
      return jsonResponse({ success: false, error: "Endpoint not found" }, 404);

    } catch (error) {
      console.error("Worker Execution Error:", error);
      return jsonResponse({
        success: false,
        error: "Internal Server Error",
        message: error.message || String(error),
      }, 500);
    }
  },
};
