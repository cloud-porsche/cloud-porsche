/// Source: https://github.com/tkrotoff/fetch/blob/master/src/Http.ts

import { HttpError } from "@/http/http-error";
import router from "@/router";
import { useAppStore } from "@/stores/app";
import { useCurrentUser } from "vuefire";

/**
 * `Promise<`[`Response`](https://fetch.spec.whatwg.org/#response)`>` with added methods from [`Body`](https://fetch.spec.whatwg.org/#body-mixin).
 */
// https://github.com/microsoft/TypeScript/blob/v4.7.4/lib/lib.dom.d.ts#L2503-L2507
export type ResponsePromiseWithBodyMethods = Promise<Response> &
  Pick<Body, "arrayBuffer" | "blob" | "formData" | /*'json' |*/ "text"> & {
    // FIXME https://github.com/microsoft/TypeScript/issues/26188
    json(): Promise<unknown>;
  };

const arrayBufferMimeType = "*/*";
const blobMimeType = "*/*";
const formDataMimeType = "multipart/form-data";
export const jsonMimeType = "application/json";
const textMimeType = "text/*";

export function isJSONResponse(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";
  return contentType.includes(jsonMimeType);
}

function extendResponsePromiseWithBodyMethods(
  responsePromise: ResponsePromiseWithBodyMethods,
  headers: Headers,
) {
  function setAcceptHeader(mimeType: string) {
    headers.set("accept", headers.get("accept") ?? mimeType);
  }

  /* eslint-disable no-param-reassign */

  responsePromise.arrayBuffer = async () => {
    setAcceptHeader(arrayBufferMimeType);
    const response = await responsePromise;
    return response.arrayBuffer();
  };

  responsePromise.blob = async () => {
    setAcceptHeader(blobMimeType);
    const response = await responsePromise;
    return response.blob();
  };

  responsePromise.formData = async () => {
    setAcceptHeader(formDataMimeType);
    const response = await responsePromise;
    return response.formData();
  };

  responsePromise.json = async () => {
    setAcceptHeader(jsonMimeType);
    const response = await responsePromise;
    if (isJSONResponse(response)) {
      return response.json();
    }
    return response.text();
  };

  responsePromise.text = async () => {
    setAcceptHeader(textMimeType);
    const response = await responsePromise;
    return response.text();
  };

  /* eslint-enable no-param-reassign */
}

export type Init = Omit<RequestInit, "method" | "body">;

export type Config = { init: Init };

export const defaults: Config = {
  init: {},
};

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

// Can throw:
// - HttpError if !response.ok
// - TypeError if request blocked (DevTools or CORS) or network timeout (net::ERR_TIMED_OUT):
//   - Firefox 68: "TypeError: "NetworkError when attempting to fetch resource.""
//   - Chrome 76: "TypeError: Failed to fetch"
// - DOMException if request aborted
function request<T extends BodyInit>(
  input: RequestInfo | URL,
  headers: Headers,
  init: Omit<Init, "headers"> | undefined,
  method: Method,
  body?: T,
  api: "propertyManagement" | "parkingManagement" = "propertyManagement", // Standard: Property Management
) {
  // ADJUSTED PART
  // if input is not a full url, prepend the base url in env

  const api_url =
    api === "propertyManagement"
      ? useAppStore().api.propertyManagement
      : useAppStore().api.parkingManagement;
  if (
    typeof input === "string" &&
    api_url !== undefined &&
    api_url !== "undefined" &&
    !input.startsWith("http") &&
    !input.startsWith("ws")
  ) {
    input = `${api_url}${input.startsWith("/") ? input : `/${input}`}`;
  }

  async function _fetch() {
    // Have to wait for headers to be modified inside extendResponsePromiseWithBodyMethods
    await Promise.resolve();
    const token = await useCurrentUser().value?.getIdToken(true);
    const tenantId = (router.currentRoute.value.params as any)["tenantId"];

    if (tenantId && tenantId !== "free") {
      headers.set(
        "tenant-id",
        tenantId.includes(":") ? tenantId.split(":")[1] : tenantId,
      );
    }
    if (token) headers.set("authorization", token);
    const req = new Request(input, {
      ...defaults.init,
      ...init,
      headers,
      method,
      body,
    });

    const res = await fetch(req);

    if (!res.ok) throw new HttpError(req, res);

    return res;
  }

  const responsePromise = _fetch() as ResponsePromiseWithBodyMethods;
  extendResponsePromiseWithBodyMethods(responsePromise, headers);

  return responsePromise;
}

function getHeaders(init?: Init) {
  // We don't know if defaults.init.headers and init.headers are JSON or Headers instances
  // thus we have to make the conversion
  return new Headers({ ...defaults.init.headers, ...init?.headers });
}

function getJSONHeaders(init?: Init) {
  const headers = getHeaders(init);
  headers.set("content-type", jsonMimeType);
  return headers;
}

/**
 * Performs a HTTP `GET` request.
 */
export function get(
  input: RequestInfo | URL,
  init?: Init,
  api: "propertyManagement" | "parkingManagement" = "propertyManagement",
) {
  return request(input, getHeaders(init), init, "GET", undefined, api);
}

/**
 * Performs a HTTP `POST` request.
 *
 * @see {@link postJSON()}
 */
export function post<T extends BodyInit>(
  input: RequestInfo | URL,
  body?: T,
  init?: Init,
  api: "propertyManagement" | "parkingManagement" = "propertyManagement",
) {
  return request(input, getHeaders(init), init, "POST", body, api);
}

/**
 * Performs a HTTP `POST` request with a JSON body.
 *
 * @see {@link post()}
 */
// Should be named postJson or postJSON?
// - JS uses JSON.parse(), JSON.stringify(), toJSON()
// - Deno uses [JSON](https://github.com/denoland/deno/blob/v1.5.3/cli/dts/lib.webworker.d.ts#L387) and [Json](https://github.com/denoland/deno/blob/v1.5.3/cli/dts/lib.webworker.d.ts#L260)
//
// Record<string, unknown> is compatible with "type" not with "interface": "Index signature is missing in type 'MyInterface'"
// Best alternative is object, why? https://stackoverflow.com/a/58143592
export function postJSON<T extends object>(
  input: RequestInfo | URL,
  body: T,
  init?: Init,
  api: "propertyManagement" | "parkingManagement" = "propertyManagement",
) {
  return request(
    input,
    getJSONHeaders(init),
    init,
    "POST",
    JSON.stringify(body),
    api,
  );
}

// No need to have postFormData() and friends: the browser already sets the proper request content type
// Something like "content-type: multipart/form-data; boundary=----WebKitFormBoundaryl8VQ0sfwUpJEWna3"

/**
 * Performs a HTTP `PUT` request.
 *
 * @see {@link putJSON()}
 */
export function put<T extends BodyInit>(
  input: RequestInfo | URL,
  body?: T,
  init?: Init,
  api: "propertyManagement" | "parkingManagement" = "propertyManagement",
) {
  return request(input, getHeaders(init), init, "PUT", body, api);
}

/**
 * Performs a HTTP `PUT` request with a JSON body.
 *
 * @see {@link put()}
 */
export function putJSON<T extends object>(
  input: RequestInfo | URL,
  body: T,
  init?: Init,
  api: "propertyManagement" | "parkingManagement" = "propertyManagement",
) {
  return request(
    input,
    getJSONHeaders(init),
    init,
    "PUT",
    JSON.stringify(body),
    api,
  );
}

/**
 * Performs a HTTP `PATCH` request.
 *
 * @see {@link patchJSON()}
 */
export function patch<T extends BodyInit>(
  input: RequestInfo | URL,
  body?: T,
  init?: Init,
  api: "propertyManagement" | "parkingManagement" = "propertyManagement",
) {
  return request(input, getHeaders(init), init, "PATCH", body, api);
}

/**
 * Performs a HTTP `PATCH` request with a JSON body.
 *
 * @see {@link patch()}
 */
export function patchJSON<T extends object>(
  input: RequestInfo | URL,
  body: T,
  init?: Init,
  api: "propertyManagement" | "parkingManagement" = "propertyManagement",
) {
  return request(
    input,
    getJSONHeaders(init),
    init,
    "PATCH",
    JSON.stringify(body),
    api,
  );
}

/**
 * Performs a HTTP `DELETE` request.
 */
// Cannot be named delete :-/
export function del(
  input: RequestInfo | URL,
  init?: Init,
  api: "propertyManagement" | "parkingManagement" = "propertyManagement",
) {
  return request(input, getHeaders(init), init, "DELETE", undefined, api);
}
