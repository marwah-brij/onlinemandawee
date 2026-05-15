import type { ZodType } from "zod";

import { safeEqual } from "@/lib/utils/crypto";
import { AppError } from "@/lib/errors/app-error";
import { ERROR_CODE } from "@/lib/errors/error-codes";

export const parsePaymentWebhookInput = async <T>(
  request: Request,
  secret: string,
  schema: ZodType<T>
) => {
  const providedSecret = request.headers.get("x-webhook-secret");
  if (!providedSecret || !safeEqual(providedSecret, secret)) {
    throw new AppError({
      code: ERROR_CODE.UNAUTHORIZED,
      message: "Invalid webhook secret",
      statusCode: 401,
    });
  }

  const rawBody = await request.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    throw new AppError({
      code: ERROR_CODE.BAD_REQUEST,
      message: "Invalid webhook payload",
      statusCode: 400,
    });
  }

  return schema.parse(parsed);
};
