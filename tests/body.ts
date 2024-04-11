import { deepStrictEqual } from "assert";
import { Readable } from "stream";
import { readJSON } from "../src/body";

export const bodyTests = async () => {
  {
    const data = { hello: "World" };
    const request = new Readable({
      read() {
        this.push(Buffer.from(JSON.stringify(data)));
        this.push(null); // Signals the end of the stream
      },
    });

    const json = await readJSON(request);
    deepStrictEqual(json, data);
  }
};
