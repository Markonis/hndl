import { HttpStatus } from "./types";

type HttpErrorParams = {
  status: HttpStatus;
  options?: ErrorOptions;
  headers?: Record<string, string>;
  body?: any;
}

export class HttpError extends Error {
  status: HttpStatus;
  body?: any;
  headers?: Record<string, string>;

  constructor({ status, options, headers, body }: HttpErrorParams) {
    super(`Error ${status.code}`, options)
    this.headers = headers;
    this.status = status;
    this.body = body;
  }
}
