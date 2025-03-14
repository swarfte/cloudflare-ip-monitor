import { successResponse, failureResponse } from "@tools/responseProcess";
import type { IpResponse } from "@datatype/object";

export default defineEventHandler(async (event) => {
  try {
    const response = (await $fetch("https://api.ipify.org?format=json")) as {
      ip: string;
    };
    const ip = response.ip;
    return successResponse<IpResponse>(event, { ip });
  } catch (e) {
    console.error(e);
    return failureResponse(event, 500, "cannot get current ip");
  }
});
