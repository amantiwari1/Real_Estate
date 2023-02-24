// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as fcl from "@onflow/fcl";
import { getCookie, setCookie } from "cookies-next";
import { addDays } from "date-fns";

const isServerSide = () => typeof window === "undefined";

export const fclCookieStorage = {
  can: !isServerSide(),
  get: async (key: string) => JSON.parse((getCookie(key) as string) ?? null),
  put: async (key: string, value: unknown) =>
    setCookie(key, JSON.stringify(value ?? null), {
      path: "/",
      expires: addDays(new Date(), 14),
    }),
};

const initFclConfig = async () => {
  await fcl
    .config({
      "app.detail.title": "real estate",
    })
    .put("accessNode.api", process.env.NEXT_PUBLIC_FLOW_ACCESS_API)
    .put("discovery.wallet", process.env.NEXT_PUBLIC_WALLET_API)
    .put("discovery.wallet.method", "POP/RPC")
    .put("fcl.storage", fclCookieStorage);
};

export { initFclConfig };
