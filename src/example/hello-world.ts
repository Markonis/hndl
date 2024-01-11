import { createServer } from "http";
import { acceptPath } from "../accept-path";
import { endpoint } from "../endpoint";
import { service } from "../service";
import { jsonResponse } from "../helpers";

const port = process.env.PORT || "3000";

const helloEndpoint = endpoint({
  accept: (req) =>
    acceptPath(req, {
      path: "/hello/:name",
      params: { name: (s) => s },
    }),
  handle: (payload) => {
    return jsonResponse({ hello: payload.name });
  },
});

const server = createServer(service({ endpoint: helloEndpoint }));

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
