import { IncomingMessage } from "http";

export const json = <T>(req: IncomingMessage) => {
  return new Promise<T>((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(data));
      } catch (error) {
        reject(error);
      }
    });
  });
};
