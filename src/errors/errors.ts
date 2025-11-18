import createError from "http-errors";
import { StatusCodes, getReasonPhrase } from "http-status-codes";

export interface ErrorParams {
  msg?: string;
  comingFrom?: string;
}

export function createException(statusCode: number, defaultMsg?: string) {
  return (params?: ErrorParams) =>
    createError(statusCode, params?.msg || defaultMsg || getReasonPhrase(statusCode), {
      comingFrom: params?.comingFrom,
      type: "operational",
    });
}

// Reusable exceptions
export const BadRequestException = createException(
  StatusCodes.BAD_REQUEST,
  "Bad Request"
);

export const UnauthorizedException = createException(
  StatusCodes.UNAUTHORIZED,
  "Unauthorized"
);

export const ForbiddenException = createException(
  StatusCodes.FORBIDDEN,
  "Forbidden"
);

export const NotFoundException = createException(
  StatusCodes.NOT_FOUND,
  "Not Found"
);

export const ConflictException = createException(
  StatusCodes.CONFLICT,
  "Conflict"
);

export const InternalServerException = createException(
  StatusCodes.INTERNAL_SERVER_ERROR,
  "Internal Server Error"
);

export const BadGatewayException = createException(
  StatusCodes.BAD_GATEWAY,
  "Bad Gateway"
);
