/** True when request should use in-memory demo data (no Postgres). */
export function isDevMock(userId: string): boolean {
  return userId.startsWith("dev-") || process.env.DEV_MOCK_AUTH === "true";
}
