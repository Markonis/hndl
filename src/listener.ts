import { IncomingMessage, ServerResponse } from "http";
import { INTERNAL_SERVER_ERROR } from "./status";
import { Endpoint, Request, Response } from "./types";

export const listener = <T>(def: Endpoint<T>) => {
  return (req: IncomingMessage, res: ServerResponse) => {
    return acceptAndHandle(def, req as Request)
      .then(response => sendResponse(response, res));
  }
}

const acceptAndHandle = async <T>(def: Endpoint<T>, req: Request) => {
  const payload = await def.accept(req);
  return payload && await def.handle(payload);
}

const listenerErrorResponse: Response = {
  status: INTERNAL_SERVER_ERROR,
  body: "Endpoint did not produce a response",
  headers: { "Content-Type": "text/plain" }
}

const sendResponse = (response: Response | undefined, serverResponse: ServerResponse) => {
  const { status, headers, body } = response ? response : listenerErrorResponse;
  serverResponse.writeHead(status.code, status.phrase, headers);
  serverResponse.end(body);
}
