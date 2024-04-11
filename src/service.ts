import { IncomingMessage, ServerResponse } from "http";
import { Readable } from "stream";
import { endpoint, router } from "./endpoint";
import { INTERNAL_SERVER_ERROR, NOT_FOUND } from "./status";
import { Endpoint, ErrorHandler, Logger, Request, Response } from "./types";

type ServiceProps = {
  endpoint: Endpoint<any>;
  errorHandler?: ErrorHandler;
  logger?: Logger;
};

type Listener = (req: IncomingMessage, res: ServerResponse) => Promise<void>;

export const service = ({
  endpoint: rootEndpoint,
  errorHandler = defaultErrorHandler,
  logger = defaultLogger,
}: ServiceProps): Listener => {
  const serviceRouter = router(rootEndpoint, catchAllEndpoint);
  return async (request, serverResponse) => {
    let response: Response;
    try {
      response = await produceResponse(request as Request, serviceRouter);
      await writeResponse(response, serverResponse);
    } catch (error) {
      response = await errorHandler(error);
      await writeResponse(response, serverResponse);
    }
    logger(request as Request, response);
  }
};

const produceResponse = async (
  request: Request,
  endpoint: Endpoint<any>,
) => {
    const payload = await endpoint.accept(request);
    if (payload) {
      return await endpoint.handle(payload);
    } else {
      return {
        status: INTERNAL_SERVER_ERROR,
        body: "Endpoint did not produce a response",
        headers: { "Content-Type": "text/plain" },
      };
    }
};

const writeResponse = async (
  response: Response,
  serverResponse: ServerResponse,
) => {
  const { status, headers, body } = response;
  serverResponse.writeHead(status.code, status.phrase, headers);
  if (body instanceof Readable) {
    await writeStreamBody(body, serverResponse);
  } else {
    serverResponse.end(body);
  }
};

const writeStreamBody = (
  body: Readable,
  serverResponse: ServerResponse
) => {
  return new Promise((resolve, reject) => {
    body.on("error", reject);
    body.on("end", resolve);
    body.pipe(serverResponse);
  })
}

const catchAllEndpoint = endpoint({
  accept: () => true,
  handle: () => ({ status: NOT_FOUND }),
});

const defaultLogger = (request: Request, response: Response) => {
  console.log(`${response.status.code} ${request.method} ${request.url}`);
};

const defaultErrorHandler = (error: any): Response => {
  return {
    status: getErrorStatus(error),
    headers: error?.headers,
    body: error.body ?? error?.message,
  };
};

const getErrorStatus = (error: any) => {
  if (
    typeof error?.status?.code === "number" &&
    typeof error?.status?.phrase === "string"
  )
    return error.status;
  return INTERNAL_SERVER_ERROR;
};
