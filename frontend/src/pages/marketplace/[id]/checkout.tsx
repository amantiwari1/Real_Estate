import {
  CircleCheckout,
  type PaymentMethodType,
} from "@circle-fin/circle-widgets-sdk";
import { Center, Loader } from "@mantine/core";
import React from "react";
import Layout from "~/layouts/layout";
import { api } from "~/utils/api";
import "@circle-fin/circle-widgets-sdk/lib/dist/base.css";
import "@circle-fin/circle-widgets-sdk/lib/dist/components.css";
import "@circle-fin/circle-widgets-sdk/lib/dist/fonts.css";
import { useRouter } from "next/router";
import { showNotification } from "@mantine/notifications";

export interface PaymentSuccessResult {
  paymentId?: string;
  paymentIntentId?: string;
  redirectUrl?: string;
  paymentMethodType?: PaymentMethodType;
}

const Checkout = () => {
  const router = useRouter();
  const id = router.query["id"]?.toString();

  const { data, isLoading } = api.circle.createCheckoutSesstion.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    }
  );

  const { mutateAsync } = api.circle.handlePaymentSuccess.useMutation({
    onError: (error) => {
      showNotification({
        title: "Something went wrong",
        message: error.message,
      });
    },
  });

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
              showNotification({
                title: "Something went wrong",
                message: "Payment failed, Please try again later",
              });
              console.log(error);
            }}
            onPaymentSuccess={async (res: PaymentSuccessResult) => {
              console.log({ res });

              const data = await mutateAsync({
                nftModelId: id as string,
                paymentId: res.paymentId as string,
              });

              data.success && router.push(`/collection/${id}`);
            }}
          />
        </div>
      </Center>
    </Layout>
  );
};

export default Checkout;
