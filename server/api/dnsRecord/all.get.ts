import { successResponse, failureResponse } from "@tools/responseProcess";
import type { DnsRecordResponse } from "@datatype/object";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const zoneId = query.zoneId;
    const apiKey = query.apiKey;

    if (!zoneId || !apiKey) {
      return failureResponse(
        event,
        400,
        "domain, zoneId and apiKey are required"
      );
    }

    const url = `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records?type=A`;

    // set the headers
    const headers = new Headers();
    headers.set("Authorization", `Bearer ${apiKey}`);
    headers.set("Content-Type", "application/json");

    const response = (await $fetch(url, {
      method: "GET",
      headers: headers,
    })) as DnsRecordResponse;

    return successResponse<DnsRecordResponse>(event, response);
  } catch (e) {
    console.error(e);
    return failureResponse(event, 500, "cannot get dns record");
  }
});
