import { successResponse, failureResponse } from "@tools/responseProcess";
import type { DnsRecordResponse } from "@datatype/object";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Extract required fields
    const { name, zoneId, apiKey, content, type, recordId } = body;
    let { ttl, proxied } = body;

    // Validate required fields
    if (!name || !zoneId || !apiKey || !content || !type || !recordId) {
      return failureResponse(event, 400, "Missing required fields");
    }

    // Parse TTL
    ttl = Number(ttl);
    if (isNaN(ttl)) {
      return failureResponse(event, 400, "TTL must be a valid number");
    }

    // Parse Proxied to boolean
    if (typeof proxied === "string") {
      proxied = proxied.toLowerCase() === "true";
    } else if (typeof proxied !== "boolean") {
      return failureResponse(event, 400, "Proxied must be a boolean value");
    }

    // Cloudflare requires TTL=1 when proxied is true
    if (proxied) {
      ttl = 1;
    } else {
      // Validate allowed TTL values when not proxied
      const allowedTTL = [
        1, 60, 120, 300, 600, 900, 1800, 3600, 7200, 18000, 43200, 86400,
      ];
      if (!allowedTTL.includes(ttl)) {
        ttl = 60; // Default to 60 seconds if invalid
      }
    }

    const url = `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records/${recordId}`;
    const headers = new Headers({
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    });

    const response = await $fetch<DnsRecordResponse>(url, {
      method: "PUT",
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
    return failureResponse(event, 500, "Failed to update DNS record");
  }
});
