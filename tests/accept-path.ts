import { parsePathWithParams } from "../src/accept-path";
import { deepStrictEqual } from "assert";

export function acceptPathTests()
{
  { // MATCH: single slash
    const params = parsePathWithParams("/", "/");
    deepStrictEqual(params, {});
  }

  { // MATCH: simple path with no params
    const params = parsePathWithParams("/simple/path", "/simple/path");
    deepStrictEqual(params, {});
  }

  { // MATCH: simple path with no params with query string
    const params = parsePathWithParams("/simple/path?a=1", "/simple/path");
    deepStrictEqual(params, {});
  }

  { // FAIL: different at the end
    const params = parsePathWithParams("/simple/path/fail", "/simple/path");
    deepStrictEqual(params, undefined);
  }

  { // FAIL: different in the middle
    const params = parsePathWithParams("/simple/fail/path", "/simple/correct/path");
    deepStrictEqual(params, undefined);
  }

  { // MATCH: single param
    const params = parsePathWithParams("/hello/world", "/hello/:greeting");
    deepStrictEqual(params, { greeting: "world" });
  }

  { // MATCH: only one param
    const params = parsePathWithParams("hello", ":greeting");
    deepStrictEqual(params, { greeting: "hello" });
  }

  { // MATCH: single param with query string
    const params = parsePathWithParams("/hello/world?a=1", "/hello/:greeting");
    deepStrictEqual(params, { greeting: "world" });
  }

  { // MATCH: single param with trailing slash
    const params = parsePathWithParams("/hello/world/", "/hello/:greeting/");
    deepStrictEqual(params, { greeting: "world" });
  }

  { // FAIL: single param with trailing slash in URL only
    const params = parsePathWithParams("/hello/world/", "/hello/:greeting");
    deepStrictEqual(params, undefined);
  }

  { // FAIL: single param with trailing slash in pattern only
    const params = parsePathWithParams("/hello/world", "/hello/:greeting/");
    deepStrictEqual(params, undefined);
  }

  { // MATCH: 2 consecutive params
    const params = parsePathWithParams("/hello/world/hey", "/hello/:greeting/:second");
    deepStrictEqual(params, { greeting: "world", second: "hey" });
  }

  { // MATCH: 1 param containing ":"
    const params = parsePathWithParams("/hello/world", "/hello/:greeting:second");
    deepStrictEqual(params, { "greeting:second": "world" });
  }
}
