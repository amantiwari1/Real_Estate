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

  const [avoidLooping, setAvoidLooping] = React.useState(false);
  let avoudLoopingWidget = false;

  const { data, isLoading } = api.circle.createCheckoutSesstion.useQuery(
    {
      nftModelId: id as string,
    },
    {
      enabled: router.isReady,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const { mutateAsync, isLoading: isLoadingHandling } =
    api.circle.handlePaymentSuccess.useMutation({
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

  console.log("rendering more");

  return (
    <Layout>
      <Center>
        <div style={{ height: "800px", width: "800px" }}>
          <h1 className="my-5 text-center text-indigo-400">
            Pay with USDC using crypto or Credit Card (Circle)
          </h1>

          <div>
            {(isLoadingHandling || isLoading) && (
              <div className="h-[80vh]">
                <Center h="100%">
                  <Loader />
                </Center>
              </div>
            )}
          </div>

          <div className={isLoadingHandling || isLoading ? "hidden" : ""}>
            {router.isReady && !isLoading && (
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

                  console.log({
                    avoudLoopingWidget,
                    avoidLooping,
                    isLoadingHandling,
                  });

                  if (
                    !isLoadingHandling &&
                    !avoudLoopingWidget &&
                    !avoidLooping
                  ) {
                    console.log({ res1: res });
                    avoudLoopingWidget = true;
                    setAvoidLooping(true);
                    const data = await mutateAsync({
                      nftModelId: id as string,
                      paymentId: res.paymentId as string,
                    });

                    data.success && router.push(`/collection/${data.id}`);
                  }
                }}
              />
            )}
          </div>
        </div>
      </Center>
    </Layout>
  );
};

export default Checkout;
