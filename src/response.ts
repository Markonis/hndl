import { OK } from "./status";
import { Response } from "./types";

export const json = (data: any): Response => {
  return {
    status: OK,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }
}
