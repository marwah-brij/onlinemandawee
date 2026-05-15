import { ZodType } from "zod";
import { AppError } from "@/lib/errors/app-error";
import { ERROR_CODE } from "@/lib/errors/error-codes";

const parseJsonText = (rawBody: string) => {
  try {
    return JSON.parse(rawBody);
  } catch {
    throw new AppError({
      code: ERROR_CODE.BAD_REQUEST,
      message: "Invalid JSON body",
      statusCode: 400,
    });
  }
};

export const parseBody = async <T>(request: Request, schema: ZodType<T>) => {
  const rawBody = await request.text();
  const body = parseJsonText(rawBody);
  return schema.parse(body);
};

export const parseOptionalBody = async <T>(
  request: Request,
  schema: ZodType<T>,
  fallback: T
) => {
  const rawBody = await request.text();

  if (!rawBody.trim()) {
    return schema.parse(fallback);
  }

  return schema.parse(parseJsonText(rawBody));
};

export const parseQuery = <T>(
  request: Request,
  schema: ZodType<T>
) => {
  const url = new URL(request.url);
  const query = Object.fromEntries(url.searchParams.entries());
  return schema.parse(query);
};

export const parseParams = <T>(
  params: unknown,
  schema: ZodType<T>
) => {
  return schema.parse(params);
};
