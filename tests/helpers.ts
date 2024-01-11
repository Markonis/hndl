import { deepStrictEqual } from "assert";
import { jsonRequest, jsonResponse } from "../src/helpers";
import { OK } from "../src/status";
import { Readable } from "stream";

export const helpersTests = async () => {
  {
    const data = { hello: "World" };
    const request = new Readable({
      read() {
        this.push(Buffer.from(JSON.stringify(data)));
        this.push(null); // Signals the end of the stream
      },
    });

    const json = await jsonRequest(request);
    deepStrictEqual(json, data);
  }

  {
    const data = { hello: "World" };
    const response = jsonResponse(data);
    deepStrictEqual(response, {
      status: OK,
      headers: { "Content-Type": "application/json" },
      body: '{"hello":"World"}',
    });
  }
};
