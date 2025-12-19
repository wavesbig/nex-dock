/**
 * 通用 Fetch 包装器，处理 JSON 解析和错误
 */
export async function http<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.message ||
        errorBody.error ||
        `Request failed with status ${res.status}`
    );
  }
  return res.json() as Promise<T>;
}
