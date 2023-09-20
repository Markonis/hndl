import { Endpoint } from "./types";

export const endpoint = <T>(def: Endpoint<T>): Endpoint<T> => def;

export const router = (...endpoints: Endpoint<any>[]): Endpoint<any> => {
  return {
    accept: async (message) => {
      for (const endpoint of endpoints) {
        const payload = await endpoint.accept(message);
        if (!payload) continue;
        return await endpoint.handle(payload);
      }
    },
    handle: (res) => res,
  };
};
