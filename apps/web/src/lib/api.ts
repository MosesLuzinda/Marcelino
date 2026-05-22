const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function api<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<{ success: boolean; data?: T; error?: string; message?: string }> {
  const { token, ...fetchOptions } = options;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_URL}/api/v1${path}`, {
      ...fetchOptions,
      headers,
      credentials: "include",
    });
  } catch {
    throw new Error(
      `Cannot reach the API at ${API_URL}. Start it with: cd C:\\dev\\marcelino && pnpm --filter @marcelino/api dev`
    );
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok && !data.error) {
    return { success: false, error: data.message || `Request failed (${res.status})` };
  }
  return data;
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

export function setStoredToken(token: string) {
  localStorage.setItem("accessToken", token);
}

export function clearStoredToken() {
  localStorage.removeItem("accessToken");
}
