import { Readable } from "stream";

export function readRaw(req: Readable) {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => {
        try {
            const data = Buffer.concat(chunks);
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
  })
}

export async function readJSON<T>(req: Readable) {
  const raw = await readRaw(req);
  return JSON.parse(raw.toString("utf-8")) as T;
}
