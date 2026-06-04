export const API_BASE =
  process.env.NODE_ENV === "production"
    ? "/cb/api"
    : "/api";