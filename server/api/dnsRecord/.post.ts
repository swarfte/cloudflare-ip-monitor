import { successResponse, failureResponse } from "@tools/responseProcess";
import type { DnsRecordResponse } from "@datatype/object";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Extract required fields
    const { name, zoneId, apiKey, content, type } = body;
    let { ttl, proxied } = body;

    // Validate mandatory fields
    if (!name || !zoneId || !apiKey || !content || !type) {
      return failureResponse(event, 400, "Missing required fields");
    }

    // Parse TTL with default handling
    ttl = Number(ttl) || 1; // Cloudflare's default TTL is 1 when proxied

    // Parse Proxied to boolean
    if (typeof proxied === "string") {
      proxied = proxied.toLowerCase() === "true";
    }
    proxied = Boolean(proxied);

    // Cloudflare-specific rules
    if (proxied) {
      ttl = 1; // TTL must be 1 when proxied
    } else {
      // Set default TTL for unproxied if not provided
      ttl = ttl || 60; // Cloudflare's default unproxied TTL
      // Validate allowed TTL values
      const allowedTTL = [
        1, 60, 120, 300, 600, 900, 1800, 3600, 7200, 18000, 43200, 86400,
      ];
      if (!allowedTTL.includes(ttl)) {
        return failureResponse(
          event,
          400,
          "Invalid TTL value for unproxied record"
        );
      }
    }

    const url = `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`;
    const headers = new Headers({
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    });

    const response = await $fetch<DnsRecordResponse>(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        type,
        name,
        content,
        ttl,
        proxied,
      }),
    });

    return successResponse<DnsRecordResponse>(event, response);
  } catch (e: any) {
    console.error("Cloudflare API Error:", e.message);
    return failureResponse(event, 500, "Failed to create DNS record");
  }
});
