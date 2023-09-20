import { listenerTests } from "./listener";
import { responseTests } from "./response";
import { routerTests } from "./router";
import { serviceTests } from "./service";
import { staticFilesTests } from "./static-files";

routerTests();
serviceTests();
listenerTests();
responseTests();
staticFilesTests();
