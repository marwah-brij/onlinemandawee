export async function parseApiResponse<T>(res: Response): Promise<T> {
  const json = (await res.json()) as
    | { data: T }
    | { error?: { message?: string } };

  if (!res.ok) {
    const message =
      json && "error" in json && json.error?.message
        ? json.error.message
        : "Something went wrong";
    throw new Error(message);
  }

  if (!("data" in json)) {
    throw new Error("Invalid response");
  }

  return json.data;
}
