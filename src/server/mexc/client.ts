import crypto from "crypto";

type MexcAuth = { apiKey: string; apiSecret: string };

const baseUrl = "https://api.mexc.com";

function sign(secret: string, payload: string) {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

function qsSorted(params: Record<string, string | number | boolean | undefined | null>) {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null);
  entries.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  return entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join("&");
}

export async function mexcSignedGet<T>(
  auth: MexcAuth,
  path: string,
  params: Record<string, string | number | boolean | undefined | null> = {}
): Promise<T> {
  const timestamp = String(Date.now());
  const query = qsSorted(params);
  const signature = sign(auth.apiSecret, `${auth.apiKey}${timestamp}${query}`);
  const url = query ? `${baseUrl}${path}?${query}` : `${baseUrl}${path}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ApiKey: auth.apiKey,
      "Request-Time": timestamp,
      Signature: signature,
      "Recv-Window": "5000",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`MEXC HTTP ${res.status}`);
  }

  return (await res.json()) as T;
}

export async function mexcPublicGet<T>(
  path: string,
  params: Record<string, string | number | boolean | undefined | null> = {}
): Promise<T> {
  const query = qsSorted(params);
  const url = query ? `${baseUrl}${path}?${query}` : `${baseUrl}${path}`;
  const res = await fetch(url, { method: "GET", cache: "no-store" });
  if (!res.ok) throw new Error(`MEXC HTTP ${res.status}`);
  return (await res.json()) as T;
}
