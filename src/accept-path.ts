import { Request } from "./types";

type PathParamParser = (value: string) => any;
type PathParamParsersMap = Record<string, PathParamParser>;

type AcceptPathDef<T extends PathParamParsersMap> = {
  path: string;
  params: T;
};

type Params<T extends PathParamParsersMap> = {
  [k in keyof T]: ReturnType<T[k]>;
};

export const acceptPath = <T extends PathParamParsersMap>(
  request: Request,
  def: AcceptPathDef<T>,
) => {
  const [path] = request.url.split("?");
  const paramsData = getPathParamsData(path, def.path);
  if (!paramsData) return;

  const params = {} as Params<T>;
  for (const key in def.params) {
    params[key] = def.params[key](paramsData[key]);
  }

  return params;
};

const getPathParamsData = (path: string, pattern: string) => {
  const data: Record<string, string> = {};

  const patternParts = pattern.split("/").filter((p) => p);
  const pathParts = path.split("/").filter((p) => p);
  if (pathParts.length !== patternParts.length) return;

  for (let index = 0; index < pathParts.length; index++) {
    const patternPart = patternParts[index];
    const pathPart = pathParts[index];
    if (patternPart.startsWith(":")) {
      data[patternPart.slice(1)] = pathPart;
    } else if (patternPart !== pathPart) {
      return;
    }
  }

  return data;
};
