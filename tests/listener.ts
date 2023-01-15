import { deepStrictEqual } from "assert";
import { listener } from "../src/listener";
import { INTERNAL_SERVER_ERROR, OK } from "../src/status";
import { Response } from "../src/types";

export const listenerTests = async () => {
  {
    const response: Response = {
      status: OK,
      headers: { "Content-Type": "text/plain" },
      body: "Hello World"
    }

    const testListener = listener({
      accept: () => true,
      handle: () => response
    });

    const actual = {
      status: { code: 0, phrase: "" },
      headers: {} as Record<string, string>,
      body: ""
    };

    const mockServerResponse = {
      writeHead: (code: number, phrase: string, headers: Record<string, string>) => {
        actual.status = { code, phrase };
        actual.headers = headers;
      },
      end: (body: any) => {
        actual.body = body;
      }
    }

    await testListener({} as any, mockServerResponse as any);
    deepStrictEqual(actual, response, "Listener should write the ServerResponse correctly")
  }

  {
    const testListener = listener({
      accept: () => false,
      handle: () => ({ status: OK })
    });

    const actual = {
      status: { code: 0, phrase: "" },
      headers: {} as Record<string, string>,
      body: ""
    };

    const mockServerResponse = {
      writeHead: (code: number, phrase: string, headers: Record<string, string>) => {
        actual.status = { code, phrase };
        actual.headers = headers;
      },
      end: (body: any) => {
        actual.body = body;
      }
    }

    await testListener({} as any, mockServerResponse as any);

    deepStrictEqual(
      actual,
      {
        status: INTERNAL_SERVER_ERROR,
        body: "Endpoint did not produce a response",
        headers: { "Content-Type": "text/plain" }
      },
      "The listener should respond with the correct error if the endpoint doesn't produce a response."
    )
  }
}
