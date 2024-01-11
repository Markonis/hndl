import { Readable } from "stream";
import { OK } from "./status";
import { Response } from "./types";

export const jsonRequest = <T>(req: Readable) => {
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

export const jsonResponse = (data: any): Response => {
  return {
    status: OK,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
};
