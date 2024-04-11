import { Readable } from "stream";

export function readRaw(req: Readable) {
  return new Promise<string>((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      try {
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  })
}

export async function readJSON<T>(req: Readable) {
  const raw = await readRaw(req);
  return JSON.parse(raw) as T;
}
