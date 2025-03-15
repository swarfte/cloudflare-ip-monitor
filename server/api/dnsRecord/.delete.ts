import { successResponse, failureResponse } from "@tools/responseProcess";
import type { DnsRecordResponse } from "@datatype/object";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Extract required fields
    const { zoneId, apiKey, recordId } = body;

    // Validate required fields
    if (!zoneId || !apiKey || !recordId) {
      return failureResponse(event, 400, "Missing required fields");
    }

    const url = `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records/${recordId}`;
    const headers = new Headers({
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    });

    const response = await $fetch<DnsRecordResponse>(url, {
      method: "DELETE",
      headers,
    });

    return successResponse<DnsRecordResponse>(event, response);
  } catch (e: any) {
    console.error("Cloudflare API Error:", e.message);
    return failureResponse(event, 500, "Failed to update DNS record");
  }
});
