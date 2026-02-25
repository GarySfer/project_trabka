// ── Union types for HTTP status code categories ──
export type HttpStatusCategory = "1xx" | "2xx" | "3xx" | "4xx" | "5xx";

export type InformationalCode = 100 | 101 | 102 | 103;
export type SuccessCode = 200 | 201 | 202 | 203 | 204 | 206 | 207;
export type RedirectionCode = 300 | 301 | 302 | 303 | 304 | 307 | 308;
export type ClientErrorCode = 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 429 | 431 | 451;
export type ServerErrorCode = 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511;

// Union of all known codes
export type KnownHttpStatusCode =
  | InformationalCode
  | SuccessCode
  | RedirectionCode
  | ClientErrorCode
  | ServerErrorCode;

// ── Core interfaces ──
export interface HttpStatusInfo {
  code: number;
  description: string;
  category: HttpStatusCategory;
  imageUrl: string;
}

export interface SearchHistoryEntry {
  id: string;
  code: number;
  description: string;
  category: HttpStatusCategory;
  timestamp: Date;
}

// ── Intersection type: status info + search metadata ──
export type SearchResult = HttpStatusInfo & {
  searchedAt: Date;
  searchId: string;
};

// ── Chart data ──
export interface ChartDataPoint {
  category: HttpStatusCategory;
  count: number;
  fill: string;
}

// ── Built-in generics usage ──
export type PartialHttpStatus = Partial<HttpStatusInfo>;
export type RequiredHttpStatus = Required<HttpStatusInfo>;
export type ReadonlyHttpStatus = Readonly<HttpStatusInfo>;
export type HttpStatusPreview = Pick<HttpStatusInfo, "code" | "description">;
export type HttpStatusWithoutImage = Omit<HttpStatusInfo, "imageUrl">;
export type NonClientCategory = Exclude<HttpStatusCategory, "4xx" | "5xx">;
export type CategoryCountMap = Record<HttpStatusCategory, number>;

// ── Type predicate ──
export function isValidHttpStatusCode(value: unknown): value is number {
  if (typeof value !== "number") return false;
  return value >= 100 && value <= 599;
}

export function isClientError(code: number): code is ClientErrorCode {
  return code >= 400 && code < 500;
}

export function isServerError(code: number): code is ServerErrorCode {
  return code >= 500 && code < 600;
}

// ── Function overloads ──
export function getStatusCategory(code: number): HttpStatusCategory;
export function getStatusCategory(code: string): HttpStatusCategory;
export function getStatusCategory(code: number | string): HttpStatusCategory {
  const numCode = typeof code === "string" ? parseInt(code, 10) : code;
  if (numCode >= 100 && numCode < 200) return "1xx";
  if (numCode >= 200 && numCode < 300) return "2xx";
  if (numCode >= 300 && numCode < 400) return "3xx";
  if (numCode >= 400 && numCode < 500) return "4xx";
  return "5xx";
}

// ── Status code descriptions ──
export const HTTP_STATUS_DESCRIPTIONS: Record<number, string> = {
  100: "Continue",
  101: "Switching Protocols",
  102: "Processing",
  103: "Early Hints",
  200: "OK",
  201: "Created",
  202: "Accepted",
  203: "Non-Authoritative Information",
  204: "No Content",
  206: "Partial Content",
  207: "Multi-Status",
  300: "Multiple Choices",
  301: "Moved Permanently",
  302: "Found",
  303: "See Other",
  304: "Not Modified",
  307: "Temporary Redirect",
  308: "Permanent Redirect",
  400: "Bad Request",
  401: "Unauthorized",
  402: "Payment Required",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  406: "Not Acceptable",
  407: "Proxy Authentication Required",
  408: "Request Timeout",
  409: "Conflict",
  410: "Gone",
  411: "Length Required",
  413: "Payload Too Large",
  414: "URI Too Long",
  415: "Unsupported Media Type",
  416: "Range Not Satisfiable",
  417: "Expectation Failed",
  418: "I'm a Teapot",
  421: "Misdirected Request",
  422: "Unprocessable Entity",
  423: "Locked",
  424: "Failed Dependency",
  425: "Too Early",
  426: "Upgrade Required",
  429: "Too Many Requests",
  431: "Request Header Fields Too Large",
  451: "Unavailable For Legal Reasons",
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
  505: "HTTP Version Not Supported",
  506: "Variant Also Negotiates",
  507: "Insufficient Storage",
  508: "Loop Detected",
  510: "Not Extended",
  511: "Network Authentication Required",
};
