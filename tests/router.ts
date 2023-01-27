import { deepStrictEqual } from "assert";
import { router } from "../src/endpoint";
import { HttpStatusCode } from "../src/status";

export const routerTests = async () => {
  {
    const testRouter = router(
      {
        accept: () => false,
        handle: () => ({ status: HttpStatusCode.OK })
      },
      {
        accept: () => true,
        handle: () => ({ status: HttpStatusCode.BAD_REQUEST })
      },
      {
        accept: () => true,
        handle: () => ({ status: HttpStatusCode.MOVED_TEMPORARILY })
      }
    )

    const response = await testRouter.handle(await testRouter.accept({} as any));
    deepStrictEqual(response.status, HttpStatusCode.BAD_REQUEST, "Router should choose the first endpoint that accepts");
  }

  {
    const truthyPayload = "Truthy payload"
    let handledPayload = "";

    const testRouter = router(
      {
        accept: () => false,
        handle: () => ({ status: HttpStatusCode.MOVED_TEMPORARILY })
      },
      {
        accept: () => truthyPayload,
        handle: payload => {
          handledPayload = payload;
          return { status: HttpStatusCode.OK }
        }
      },
      {
        accept: () => true,
        handle: () => ({ status: HttpStatusCode.BAD_REQUEST })
      }
    )

    const response = await testRouter.handle(await testRouter.accept({} as any));

    deepStrictEqual(response.status, HttpStatusCode.OK, "Router should accept any truthy value");
    deepStrictEqual(handledPayload, truthyPayload, "Router should pass the correct payload to handle")
  }
}
