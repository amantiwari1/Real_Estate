import { CircleCheckout } from "@circle-fin/circle-widgets-sdk";
import { Center, Loader } from "@mantine/core";
import React from "react";
import Layout from "~/layouts/layout";
import { api } from "~/utils/api";
import "@circle-fin/circle-widgets-sdk/lib/dist/base.css";
import "@circle-fin/circle-widgets-sdk/lib/dist/components.css";
import "@circle-fin/circle-widgets-sdk/lib/dist/fonts.css";
// import { useRouter } from "next/router";

const Checkout = () => {
  // const router = useRouter();
  // const id = router.query["id"]?.toString();

  const { data, isLoading } = api.circle.createCheckoutSesstion.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) {
    return (
      <Layout>
        <Center h="100%">
          <Loader />
        </Center>
      </Layout>
    );
  }

  return (
    <Layout>
      <Center>
        <div style={{ height: "800px", width: "800px" }}>
          <CircleCheckout
            sessionId={data?.id as string}
            environment="sandbox"
            clientKey={data?.clientToken as string}
            onError={(error) => {
              console.log(error);
            }}
            onPaymentSuccess={(res) => {
              console.log(res);
            }}
          />
        </div>
      </Center>
    </Layout>
  );
};

export default Checkout;
