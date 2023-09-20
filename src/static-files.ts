import { endpoint } from "./endpoint"
import { readdir, readFile } from "fs/promises";
import { OK } from "./status";
import { join, extname } from "path";

type FileReader = (path: string) => Promise<string | Buffer>;
type ContentTypeResolver = (ext: string) => string | undefined;
type HeadersProvider = (path: string) => Record<string, string>;
type ValidPathsProvider = (path: string) => Promise<Set<string>>;

type Params = {
    dir: string;
    route?: string;
    dynamic?: boolean;
    validPathsProvider?: ValidPathsProvider;
    fileReader?: FileReader;
    contentTypeResolver?: ContentTypeResolver;
    headersProvider?: HeadersProvider;
}

export const staticFiles = async ({
    dir,
    route = "/",
    dynamic = false,
    validPathsProvider = defaultValidPathsProvider,
    fileReader = defaultFileReader(dynamic),
    contentTypeResolver = minimalContentTypeResolver,
    headersProvider = defaultHeadersProvider
}: Params) => {
    let validPaths: Set<string> | null = null;
    const prefixLength = route.endsWith("/") ? route.length : route.length + 1;

    return endpoint({
        accept: async (request) => {
            if (!request.url.startsWith(route)) {
                return;
            }

            if (dynamic || !validPaths) {
                validPaths = await validPathsProvider(dir);
            }
            
            const path = request.url.substring(prefixLength);
            return validPaths.has(path) && join(dir, path);
        },
        handle: async (path) => {
            const buffer = await fileReader(path);
            const contentType = contentTypeResolver(extname(path));
            return {
                status: OK,
                headers: { 
                    "Content-Type": contentType || "",
                    ...headersProvider(path)
                },
                body: buffer
            }
        }
    })
}

const defaultValidPathsProvider = (dir: string) =>
    readdir(dir).then(list => new Set(list));

const defaultFileReader = (dynamic: boolean): FileReader => {
    const cache: Record<string, string | Buffer | undefined> = {};
    return async (path) => {
        const buffer = (!dynamic && cache[path]) || await readFile(path);
        cache[path] = buffer;
        return buffer;
    }
}

const minimalContentTypeResolver: ContentTypeResolver = (ext) => {
    const mimeTypes = {
        jpeg: "image/jpeg",
        js: "application/javascript",
        svg: "image/svg+xml"
    }

    const mapping: Record<string, string | undefined> = {
        ".html": "text/html",
        ".jpg": mimeTypes.jpeg,
        ".jpeg": mimeTypes.jpeg,
        ".jpe": mimeTypes.jpeg,
        ".png": "image/png",
        ".svg": "image/svg",
        ".svgz": "image/svg",
        ".json": "application/json",
        ".js": mimeTypes.js,
        ".jsm": mimeTypes.js,
        ".css": "text/css"
    }

    return mapping[ext];
}

const defaultHeadersProvider: HeadersProvider = (path) => {
    return {};
}
