import { HttpStatusCode } from "./status";
import { Response } from "./types";

export const json = (data: any): Response => {
  return {
    status: HttpStatusCode.OK,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }
}
