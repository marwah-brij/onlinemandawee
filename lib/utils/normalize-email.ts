export const normalizeEmailForAuth = (email: string) =>
  email
    .trim()
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .normalize("NFKC")
    .toLowerCase();
