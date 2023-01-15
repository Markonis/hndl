import { IncomingMessage } from "http";

export type HttpStatus = {
  code: number;
  phrase: string;
}

export type Response = {
  status: HttpStatus;
  body?: any;
  headers?: Record<string, string>
}

export type Request = IncomingMessage & {
  url: string;
  method: string;
}

type Optional<T> = T | undefined;

export type Endpoint<T> = {
  accept: (request: Request) => Promise<Optional<T>> | Optional<T>;
  handle: (payload: NonNullable<T>) => Promise<Response> | Response;
}

export type ErrorHandler = (error: any) => Response | Promise<Response>;

export type Logger = (request: Request, response: Response) => void;
