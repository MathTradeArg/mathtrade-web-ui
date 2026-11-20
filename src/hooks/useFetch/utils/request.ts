// The minimal client surface the dispatcher needs (the apisauce instance).
type HttpClient = {
  get: (url: string, params?: unknown, config?: unknown) => Promise<any>;
  post: (url: string, data?: unknown, config?: unknown) => Promise<any>;
  put: (url: string, data?: unknown, config?: unknown) => Promise<any>;
  patch: (url: string, data?: unknown, config?: unknown) => Promise<any>;
  delete: (url: string, params?: unknown) => Promise<any>;
};

export const dispatchRequest = (
  client: HttpClient,
  { method, pathRequest, params }: { method?: string; pathRequest?: string; params?: unknown }
) => {
  // Default JSON Content-Type makes axios serialize FormData to JSON (files
  // become {}). Clear it so the browser sets multipart with the boundary.
  const config =
    typeof FormData !== "undefined" && params instanceof FormData
      ? { headers: { "Content-Type": undefined } }
      : undefined;

  switch (method) {
    case "POST":
      return client.post(pathRequest || "", params, config);
    case "PUT":
      return client.put(pathRequest || "", params, config);
    case "PATCH":
      return client.patch(pathRequest || "", params, config);
    case "DELETE":
      return client.delete(pathRequest || "", params);
    default:
      return client.get(pathRequest || "", params);
  }
};
