import { deepStrictEqual } from "assert";
import { service } from "../src/service";
import { BAD_REQUEST, NOT_FOUND, OK, UNAUTHORIZED } from "../src/status";
import { Request, Response } from "../src/types";

export const serviceTests = async () => {
  {
    const testService = service({
      logger: () => {},
      endpoint: {
        accept: () => false,
        handle: () => ({ status: OK }),
      },
    });

    const payload = await testService.accept({} as any);
    const response = await testService.handle(payload as any);

    deepStrictEqual(
      response.status,
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

    const payload = await testService.accept({} as any);
    const response = await testService.handle(payload as any);

    deepStrictEqual(
      response.status,
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

    const payload = await testService.accept({} as any);
    const response = await testService.handle(payload as any);

    deepStrictEqual(
      response.status,
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

    const payload = await testService.accept({} as any);
    await testService.handle(payload as any);

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
