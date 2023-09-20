import { createServer } from "http";
import { listener } from "../listener";
import { service } from "../service";
import { staticFiles } from "../static-files";

const port = process.env.PORT || "3000";

const startServer = async () => {
  const endpoint = await staticFiles({
    dir: "src/example/static",
    dynamic: true,
  });
  const server = createServer(listener(service({ endpoint })));

  server.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
};

startServer();
