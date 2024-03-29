import { HttpStatus } from "./types";

export const CONTINUE: HttpStatus = { code: 100, phrase: "Continue" };
export const SWITCHING_PROTOCOLS: HttpStatus = {
  code: 101,
  phrase: "Switching Protocols",
};
export const PROCESSING: HttpStatus = { code: 102, phrase: "Processin" };
export const OK: HttpStatus = { code: 200, phrase: "OK" };
export const CREATED: HttpStatus = { code: 201, phrase: "Created" };
export const ACCEPTED: HttpStatus = { code: 202, phrase: "Accepted" };
export const NON_AUTHORITATIVE_INFORMATION: HttpStatus = {
  code: 203,
  phrase: "Non Authoritative Information",
};
export const NO_CONTENT: HttpStatus = { code: 204, phrase: "No Content" };
export const RESET_CONTENT: HttpStatus = { code: 205, phrase: "Reset Content" };
export const PARTIAL_CONTENT: HttpStatus = {
  code: 206,
  phrase: "Partial Content",
};
export const MULTI_STATUS: HttpStatus = { code: 207, phrase: "Multi-Status" };
export const MULTIPLE_CHOICES: HttpStatus = {
  code: 300,
  phrase: "Multiple Choices",
};
export const MOVED_PERMANENTLY: HttpStatus = {
  code: 301,
  phrase: "Moved Permanently",
};
export const MOVED_TEMPORARILY: HttpStatus = {
  code: 302,
  phrase: "Moved Temporarily",
};
export const SEE_OTHER: HttpStatus = { code: 303, phrase: "See Other" };
export const NOT_MODIFIED: HttpStatus = { code: 304, phrase: "Not Modified" };
export const USE_PROXY: HttpStatus = { code: 305, phrase: "Use Proxy" };
export const TEMPORARY_REDIRECT: HttpStatus = {
  code: 307,
  phrase: "Temporary Redirect",
};
export const PERMANENT_REDIRECT: HttpStatus = {
  code: 308,
  phrase: "Permanent Redirect",
};
export const BAD_REQUEST: HttpStatus = { code: 400, phrase: "Bad Request" };
export const UNAUTHORIZED: HttpStatus = { code: 401, phrase: "Unauthorized" };
export const PAYMENT_REQUIRED: HttpStatus = {
  code: 402,
  phrase: "Payment Required",
};
export const FORBIDDEN: HttpStatus = { code: 403, phrase: "Forbidden" };
export const NOT_FOUND: HttpStatus = { code: 404, phrase: "Not Found" };
export const METHOD_NOT_ALLOWED: HttpStatus = {
  code: 405,
  phrase: "Method Not Allowed",
};
export const NOT_ACCEPTABLE: HttpStatus = {
  code: 406,
  phrase: "Not Acceptable",
};
export const PROXY_AUTHENTICATION_REQUIRED: HttpStatus = {
  code: 407,
  phrase: "Proxy Authentication Required",
};
export const REQUEST_TIMEOUT: HttpStatus = {
  code: 408,
  phrase: "Request Timeout",
};
export const CONFLICT: HttpStatus = { code: 409, phrase: "Conflict" };
export const GONE: HttpStatus = { code: 410, phrase: "Gone" };
export const LENGTH_REQUIRED: HttpStatus = {
  code: 411,
  phrase: "Length Required",
};
export const PRECONDITION_FAILED: HttpStatus = {
  code: 412,
  phrase: "Precondition Failed",
};
export const REQUEST_TOO_LONG: HttpStatus = {
  code: 413,
  phrase: "Request Entity Too Large",
};
export const REQUEST_URI_TOO_LONG: HttpStatus = {
  code: 414,
  phrase: "Request-URI Too Long",
};
export const UNSUPPORTED_MEDIA_TYPE: HttpStatus = {
  code: 415,
  phrase: "Unsupported Media Type",
};
export const REQUESTED_RANGE_NOT_SATISFIABLE: HttpStatus = {
  code: 416,
  phrase: "Requested Range Not Satisfiable",
};
export const EXPECTATION_FAILED: HttpStatus = {
  code: 417,
  phrase: "Expectation Failed",
};
export const IM_A_TEAPOT: HttpStatus = { code: 418, phrase: "I'm a teapot" };
export const INSUFFICIENT_SPACE_ON_RESOURCE: HttpStatus = {
  code: 419,
  phrase: "Insufficient Space on Resource",
};
export const METHOD_FAILURE: HttpStatus = {
  code: 420,
  phrase: "Method Failure",
};
export const MISDIRECTED_REQUEST: HttpStatus = {
  code: 421,
  phrase: "Misdirected Request",
};
export const UNPROCESSABLE_ENTITY: HttpStatus = {
  code: 422,
  phrase: "Unprocessable Entity",
};
export const LOCKED: HttpStatus = { code: 423, phrase: "Locked" };
export const FAILED_DEPENDENCY: HttpStatus = {
  code: 424,
  phrase: "Failed Dependency",
};
export const PRECONDITION_REQUIRED: HttpStatus = {
  code: 428,
  phrase: "Precondition Required",
};
export const TOO_MANY_REQUESTS: HttpStatus = {
  code: 429,
  phrase: "Too Many Requests",
};
export const REQUEST_HEADER_FIELDS_TOO_LARGE: HttpStatus = {
  code: 431,
  phrase: "Request Header Fields Too Large",
};
export const UNAVAILABLE_FOR_LEGAL_REASONS: HttpStatus = {
  code: 451,
  phrase: "Unavailable For Legal Reasons",
};
export const INTERNAL_SERVER_ERROR: HttpStatus = {
  code: 500,
  phrase: "Internal Server Error",
};
export const NOT_IMPLEMENTED: HttpStatus = {
  code: 501,
  phrase: "Not Implemented",
};
export const BAD_GATEWAY: HttpStatus = { code: 502, phrase: "Bad Gateway" };
export const SERVICE_UNAVAILABLE: HttpStatus = {
  code: 503,
  phrase: "Service Unavailable",
};
export const GATEWAY_TIMEOUT: HttpStatus = {
  code: 504,
  phrase: "Gateway Timeout",
};
export const HTTP_VERSION_NOT_SUPPORTED: HttpStatus = {
  code: 505,
  phrase: "HTTP Version Not Supported",
};
export const INSUFFICIENT_STORAGE: HttpStatus = {
  code: 507,
  phrase: "Insufficient Storage",
};
export const NETWORK_AUTHENTICATION_REQUIRED: HttpStatus = {
  code: 511,
  phrase: "Network Authentication Required",
};
