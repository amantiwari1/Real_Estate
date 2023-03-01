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
      "app.detail.icon": "https://user-images.githubusercontent.com/95926324/221815593-505a9b8a-f696-4d41-8040-effbd127247f.png",
    })
    .put("accessNode.api", process.env.NEXT_PUBLIC_FLOW_ACCESS_API)
    .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")
    .put("discovery.authn.include", ["0x82ec283f88a62e65"])

    // .put("discovery.wallet.method", "POP/RPC")
    // use Blocto testnet wallet
    // .put("challenge.handshake", "https://flow-wallet-testnet.blocto.app/authn")
    // .put("challenge.wallet", "https://flow-wallet-testnet.blocto.app/authn")
    // .put("discovery.wallet.method", "EXT/RPC")
    // .put(
    //   "discovery.wallet",
    //   "chrome-extension://hpclkefagolihohboafpheddmmgdffjm/popup.html"
    // )
    // .put("discovery.wallet", process.env.NEXT_PUBLIC_WALLET_API)
    // .put("discovery.wallet.method", "POP/RPC")
    .put("fcl.storage", fclCookieStorage);
};

export { initFclConfig };
