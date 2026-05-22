"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/store/auth";

export function usePortalApi<T>(path: string) {
  const { token } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token || !path) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api<T>(path, { token });
      if (!res.success) {
        setError(res.error || "Failed to load data");
        setData(null);
      } else {
        setData((res.data as T) ?? null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load data");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [path, token]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}
