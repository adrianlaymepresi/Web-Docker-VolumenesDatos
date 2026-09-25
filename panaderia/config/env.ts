export function getRequiredEnv(name: "DATABASE_URL" | "SESSION_SECRET") {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}
