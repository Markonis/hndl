import { endpoint, router } from "./endpoint";
import { HttpStatusCode } from "./status";
import { Endpoint, ErrorHandler, Logger, Request, Response } from "./types";

type ServiceProps = {
  endpoint: Endpoint<any>;
  errorHandler?: ErrorHandler;
  logger?: Logger;
}

export const service = ({
  endpoint: rootEndpoint,
  errorHandler = defaultErrorHandler,
  logger = defaultLogger
}: ServiceProps): Endpoint<Request> => {
  const serviceRouter = router(rootEndpoint, catchAllEndpoint);
  return endpoint({
    accept: request => request,
    handle: async request => {
      const response = await produceResponse(request, serviceRouter, errorHandler)
      logger(request, response);
      return response;
    },
  })
}

const produceResponse = async (request: Request, endpoint: Endpoint<any>, errorHandler: ErrorHandler = defaultErrorHandler) => {
  try {
    const payload = await endpoint.accept(request);
    return endpoint.handle(payload);
  } catch (error) {
    return await errorHandler(error)
  }
}

const catchAllEndpoint = endpoint({
  accept: () => true,
  handle: () => ({ status: HttpStatusCode.NOT_FOUND })
});


const defaultLogger = (request: Request, response: Response) => {
  console.log(`${response.status.code} ${request.method} ${request.url}`);
}

const defaultErrorHandler = (error: any): Response => {
  return {
    status: getErrorStatus(error),
    headers: error?.headers,
    body: error?.message ?? error.body,
  };
}

const getErrorStatus = (error: any) => {
  if (typeof error?.status?.code === "number" && typeof error?.status?.phrase === "string") return error.status;
  return HttpStatusCode.INTERNAL_SERVER_ERROR;
}
