export type ApiResult<T> = {
  ok: boolean;
  status: number;
  message: string;
  data?: T;
};

export async function api<T = unknown>(
  url: string,
  init?: RequestInit,
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    });
    const json = await res.json().catch(() => ({}));
    if (res.status === 401 && typeof window !== "undefined") {
      window.location.assign("/auth/login");
    }
    return {
      ok: res.ok,
      status: res.status,
      message: json.message ?? "",
      data: json.data,
    };
  } catch {
    return {
      ok: false,
      status: 0,
      message: "تعذر الاتصال بالخادم. حاول مرة أخرى.",
    };
  }
}
