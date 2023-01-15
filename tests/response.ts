import { deepStrictEqual } from "assert";
import { json } from "../src/response";
import { OK } from "../src/status";

export const responseTests = () => {

  {
    const data = { hello: "World" };
    const response = json(data);
    deepStrictEqual(
      response,
      {
        status: OK,
        headers: { "Content-Type": "application/json" },
        body: '{"hello":"World"}'
      }
    )
  }
}
