import { staticFiles } from "../src/static-files";
import { strictEqual, deepStrictEqual } from "assert";
import { OK } from "../src/status";

const testFileContent = "Test file content";
const testContentType = "test/example";
const testHeaders = { "X-Test": "example" };
const testValidPaths = new Set(["example.txt", "index.html"]);

export const staticFilesTests = async () => {
  const endpoint = await staticFiles({
    dir: "./",
    route: "/route",
    validPathsProvider: () => Promise.resolve(testValidPaths),
    fileReader: () => Promise.resolve(testFileContent),
    contentTypeResolver: () => testContentType,
    headersProvider: () => testHeaders,
  });

  {
    const result = await endpoint.accept({ url: "/wrong" } as any);
    strictEqual(!result, true, "Should not accept wrong route");
  }

  {
    const result = await endpoint.accept({ url: "/route/other.txt" } as any);
    strictEqual(!result, true, "Should not accept invalid path");
  }

  {
    const result = await endpoint.accept({ url: "/route" } as any);
    strictEqual(result, "index.html", "Should rewrite to index.html");
  }

  {
    const request = { url: "/route/example.txt" } as any;
    const acceptResult = await endpoint.accept(request);
    strictEqual(acceptResult, "example.txt", "Should accept correct route");

    const handleResult = await endpoint.handle(acceptResult);
    deepStrictEqual(
      handleResult,
      {
        status: OK,
        body: testFileContent,
        headers: {
          "Content-Type": testContentType,
          ...testHeaders,
        },
      },
      "Should handle valid request correctly",
    );
  }
};
