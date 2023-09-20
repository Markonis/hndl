import { IncomingMessage } from "http";

export type HttpStatus = {
  code: number;
  phrase: string;
};

export type Response = {
  status: HttpStatus;
  body?: any;
  headers?: Record<string, string>;
};

export type Request = IncomingMessage & {
  url: string;
  method: string;
};

export type Falsy = null | undefined | false | 0 | "";
export type AcceptResult<T> = T | Falsy;

export type Endpoint<T> = {
  accept: (request: Request) => Promise<AcceptResult<T>> | AcceptResult<T>;
  handle: (payload: Exclude<T, Falsy>) => Promise<Response> | Response;
};

export type ErrorHandler = (error: any) => Response | Promise<Response>;

export type Logger = (request: Request, response: Response) => void;
