import { type H3Event, setResponseStatus } from "h3";
import type { Response, SuccessResponse } from "@datatype/object";
export function successResponse<Type extends SuccessResponse>(
  event: H3Event,
  data?: object,
  message?: string
): Type {
  setResponseStatus(event, 200);
  return {
    statusCode: 200,
    statusMessage: message || "Success",
    // if data is undefined, it will not be included in the response
    ...(data && { data }),
  } as Type;
}

// This function is used to handle a failure response
export function failureResponse(
  event: H3Event,
  statusCode: number = 400,
  message?: string
): Response {
  const errorMessages = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    500: "Internal Server Error",
  };

  if (message) {
    console.log(message);
  }

  setResponseStatus(event, statusCode);
  return {
    statusCode: statusCode,
    statusMessage:
      message || errorMessages[statusCode as keyof typeof errorMessages],
  };
}
