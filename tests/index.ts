import { bodyTests } from "./body";
import { routerTests } from "./router";
import { serviceTests } from "./service";
import { staticFilesTests } from "./static-files";
import { acceptPathTests } from "./accept-path";

routerTests();
serviceTests();
bodyTests();
staticFilesTests();
acceptPathTests();
