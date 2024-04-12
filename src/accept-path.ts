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

export function acceptPath<T extends PathParamParsersMap>(
  request: Request,
  def: AcceptPathDef<T>,
) {
  const [path] = request.url.split("?");
  const paramsData = parsePathWithParams(path, def.path);
  if (!paramsData) return;

  const params = {} as Params<T>;
  for (const key in def.params) {
    params[key] = def.params[key](paramsData[key]);
  }

  return params;
};

export function parsePathWithParams(url: string, pattern: string) {
  const data: Record<string, string> = {};

  let urlIndex = 0;
  let patternIndex = 0;

  while (true) {
    if (pattern[patternIndex] === ":") {
      // Start of param
      patternIndex++;
      let paramName = "";
      let paramValue = "";

      // Consume param name
      while (pattern[patternIndex] !== "/" && patternIndex <= pattern.length - 1) {
        paramName += pattern[patternIndex++];
      }

      // Consume param value
      while (url[urlIndex] !== "/" && url[urlIndex] !== "?" && urlIndex <= url.length - 1) {
        paramValue += url[urlIndex++];
      }

      if (paramName.length && paramValue.length) {
        data[paramName] = paramValue;
      }
    }

    const urlEnd = urlIndex === url.length || url[urlIndex] === "?";
    const patternEnd = patternIndex === pattern.length;

    if (urlEnd && patternEnd) {
      return data;
    } else if (urlEnd !== patternEnd) {
      // The length of pattern and url is different
      return;
    }

    if (url[urlIndex] !== pattern[patternIndex]) {
      // We are not parsing params and pattern and url are different
      // means it's not a match
      return;
    }

    urlIndex++;
    patternIndex++;
  }
}
