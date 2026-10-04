const BUFFER_CAP = 40;

export type NetworkEntry = {
  at: string;
  method: string;
  url: string;
  status?: number;
  durationMs?: number;
};

let buffer: NetworkEntry[] = [];
let initialized = false;

const push = (entry: NetworkEntry) => {
  buffer.push(entry);
  if (buffer.length > BUFFER_CAP) {
    buffer.shift();
  }
};

const resolveUrl = (input: RequestInfo | URL): string => {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.href;
  return input.url;
};

export const initNetworkBuffer = () => {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  const originalFetch = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const method = (
      init?.method ||
      (input instanceof Request ? input.method : "GET")
    ).toUpperCase();
    const url = resolveUrl(input);
    const at = new Date().toISOString();
    const started = performance.now();
    try {
      const response = await originalFetch(input, init);
      push({
        at,
        method,
        url,
        status: response.status,
        durationMs: Math.round(performance.now() - started),
      });
      return response;
    } catch (err) {
      push({
        at,
        method,
        url,
        status: 0,
        durationMs: Math.round(performance.now() - started),
      });
      throw err;
    }
  };

  // apisauce/axios (useFetch) goes through XHR, not fetch.
  type XhrMeta = { method: string; url: string; at: string; started: number };
  const xhrProto = XMLHttpRequest.prototype;
  const originalOpen = xhrProto.open;
  const originalSend = xhrProto.send;

  xhrProto.open = function (
    this: XMLHttpRequest,
    method: string,
    url: string | URL,
    ...rest: unknown[]
  ) {
    (this as XMLHttpRequest & { __bugReport?: XhrMeta }).__bugReport = {
      method: String(method).toUpperCase(),
      url: String(url),
      at: "",
      started: 0,
    };
    return originalOpen.apply(
      this,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [method, url, ...(rest as any[])] as any
    );
  };

  xhrProto.send = function (this: XMLHttpRequest, ...args: unknown[]) {
    const meta = (this as XMLHttpRequest & { __bugReport?: XhrMeta }).__bugReport;
    if (meta) {
      meta.at = new Date().toISOString();
      meta.started = performance.now();
      this.addEventListener("loadend", () => {
        push({
          at: meta.at,
          method: meta.method,
          url: meta.url,
          status: this.status,
          durationMs: Math.round(performance.now() - meta.started),
        });
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return originalSend.apply(this, args as any);
  };
};

export const getNetworkBuffer = (): NetworkEntry[] => [...buffer];

export const formatNetworkBuffer = (): string =>
  getNetworkBuffer()
    .map((entry) => {
      const status = entry.status == null ? "-" : String(entry.status);
      const duration =
        entry.durationMs == null ? "-" : `${entry.durationMs}ms`;
      return `[${entry.at}] ${entry.method} ${status} ${duration} ${entry.url}`;
    })
    .join("\n");
