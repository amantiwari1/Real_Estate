// @ts-ignore
import * as fcl from "@onflow/fcl";

const initFclConfig = () => {
  fcl
    .config({
      "app.detail.title": "real estate",
    })
    .put("accessNode.api", process.env.NEXT_PUBLIC_FLOW_ACCESS_API)
    .put("discovery.wallet", process.env.NEXT_PUBLIC_WALLET_API)
    .put("discovery.wallet.method", "POP/RPC");
};

export { initFclConfig };
