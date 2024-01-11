import { deepStrictEqual } from "assert";
import { service } from "../src/service";
import { BAD_REQUEST, NOT_FOUND, OK, UNAUTHORIZED } from "../src/status";
import { Request, Response } from "../src/types";
import { Readable } from "stream";

const createMockResponse = () => {
  const result: any = {};
  return {
    response: () => result as Response,
    writeHead: (
      code: number,
      phrase: string,
      headers: Record<string, string>,
    ) => {
      result.status = { code, phrase };
      result.headers = headers;
    },
    end: (body: any) => {
      result.body = body;
    },
  };
};

export const serviceTests = async () => {
  {
    const body = "Hello World";

    const testService = service({
      logger: () => {},
      endpoint: {
        accept: () => true,
        handle: () => ({ status: OK, body }),
      },
    });

    const serverResponse = createMockResponse();
    await testService({} as any, serverResponse as any);

    deepStrictEqual(
      serverResponse.response().body,
      body,
      "Service should write body data correctly",
    );
  }

  {
    const response = {
      status: OK,
      body: new Readable({
        read() {
          this.push(Buffer.from("Hello World"));
          this.push(null); // Signals the end of the stream
        },
      }),
    };

    const testService = service({
      logger: () => {},
      endpoint: {
        accept: () => true,
        handle: () => response,
      },
    });

    let actualPipedTo: any = null;
    (response.body as any).pipe = (writable: any) => {
      actualPipedTo = writable;
    };

    const serverResponse = createMockResponse();
    await testService({} as any, serverResponse as any);

    deepStrictEqual(
      actualPipedTo,
      serverResponse,
      "Service should pipe body stream correctly",
    );
  }

  {
    const testService = service({
      logger: () => {},
      endpoint: {
        accept: () => false,
        handle: () => ({ status: OK }),
      },
    });

    const serverResponse = createMockResponse();
    await testService({} as any, serverResponse as any);

    deepStrictEqual(
      serverResponse.response().status,
      NOT_FOUND,
      "Service should return 404 if endpoint doesn't accept",
    );
  }

  {
    const testService = service({
      logger: () => {},
      endpoint: {
        accept: () => false,
        handle: () => ({ status: OK }),
      },
    });

    const serverResponse = createMockResponse();
    await testService({} as any, serverResponse as any);

    deepStrictEqual(
      serverResponse.response().status,
      NOT_FOUND,
      "Service should return 404 if endpoint doesn't accept",
    );
  }

  {
    const testService = service({
      logger: () => {},
      endpoint: {
        accept: () => {
          throw { status: BAD_REQUEST };
        },
        handle: () => ({ status: OK }),
      },
    });

    const serverResponse = createMockResponse();
    await testService({} as any, serverResponse as any);

    deepStrictEqual(
      serverResponse.response().status,
      BAD_REQUEST,
      "Service should return correctly when an error is thrown in accept",
    );
  }

  {
    const testService = service({
      logger: () => {},
      endpoint: {
        accept: () => true,
        handle: () => {
          throw { status: UNAUTHORIZED };
        },
      },
    });

    const serverResponse = createMockResponse();
    await testService({} as any, serverResponse as any);

    deepStrictEqual(
      serverResponse.response().status,
      UNAUTHORIZED,
      "Service should return correctly when an error is thrown in handle",
    );
  }

  {
    const request: Request = {} as any;
    const response: Response = { status: OK };

    let loggedRequest: Request | undefined;
    let loggedResponse: Response | undefined;

    const testService = service({
      logger: (req, res) => {
        loggedRequest = req;
        loggedResponse = res;
      },
      endpoint: {
        accept: () => true,
        handle: () => response,
      },
    });

    const serverResponse = createMockResponse();
    await testService({} as any, serverResponse as any);

    deepStrictEqual(
      loggedRequest,
      request,
      "Service should log the request correctly",
    );
    deepStrictEqual(
      loggedResponse,
      response,
      "Service should log the response correctly",
    );
  }
};
