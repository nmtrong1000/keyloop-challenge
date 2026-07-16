export class DataAccessError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "DataAccessError";
    this.status = status;
  }
}

function getBaseUrl(): string {
  if (typeof window !== "undefined") return window.location.origin;
  return process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
}

async function parseErrorMessage(res: Response): Promise<string> {
  const body = (await res.json().catch(() => null)) as { message?: string } | null;
  return body?.message ?? res.statusText;
}

/** The only way any module's DAL talks to the mocked backend — fetch, error-parse, JSON-parse in one place. */
export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (typeof window !== "undefined") {
    const { workerReady } = await import("@/shared/mocks/browser");
    await workerReady;
  }

  const url = new URL(path, getBaseUrl());
  const res = await fetch(url.toString(), init);
  if (!res.ok) {
    throw new DataAccessError(await parseErrorMessage(res), res.status);
  }
  return (await res.json()) as T;
}
