import {
  Button,
  Center,
  Loader,
  Paper,
  Stepper,
  Text,
  Title,
} from "@mantine/core";
import React, { useCallback, useEffect, useState } from "react";
import { WalletState } from "~/gql/graphql";
import { useConnectWallet } from "~/hooks/useConnectWallet";
import Layout from "~/layouts/layout";
import { api } from "~/utils/api";
import ConfigureWallet from "~/components/wallet/ConfigureWallet";
import { useRouter } from "next/router";
import RegisterWallet from "~/components/wallet/RegisterWallet";
import VerifyWallet from "~/components/wallet/VerifyWallet";

const AccountPage = () => {
  const {
    login,
    isAuth,
    user,
    isLoading: isConnectLoading,
  } = useConnectWallet();

  const { data, refetch, isLoading } = api.nft.getWallet.useQuery(undefined, {
    enabled: isAuth ? true : false,
  });

  const active = useCallback((): number => {
    if (!data?.walletByAddress && !data?.walletByAddress?.address) {
      return 0;
    }

    if (isAuth && data?.walletByAddress?.state === WalletState.Unverified) {
      return 1;
    }

    if (isAuth && data?.walletByAddress?.state === WalletState.Verified) {
      return 2;
    }

    if (isAuth && data?.walletByAddress?.state === WalletState.Ready) {
      return 3;
    }

    return 3;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.walletByAddress?.state, isAuth]);

  const router = useRouter();

  const onReadySigin = router.query.isSignin;

  const handleLogin = async () => {
    await login();
  };

  const handleEffect = async () => {
    if (!isAuth && onReadySigin === "true") {
      handleLogin();
    }
  };

  useEffect(() => {
    handleEffect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      {/* Everything is good account */}
      <Paper bg="gray" p={40} className="flex justify-center">
        <div className="space-y-5">
          <Center>
            <div>
              {isAuth && isLoading && <Loader />}
              {isAuth && (
                <Stepper active={active()} breakpoint="sm">
                  <Stepper.Step
                    label="First Step"
                    description="Link or create your wallet"
                    p={20}
                  >
                    <RegisterWallet refetch={refetch} />
                  </Stepper.Step>

                  <Stepper.Step
                    label="Second step"
                    description="Verify your wallet"
                    p={20}
                  >
                    {isAuth &&
                      data?.walletByAddress?.state ===
                        WalletState.Unverified && (
                        <VerifyWallet data={data} refetch={refetch} />
                      )}
                  </Stepper.Step>

                  <Stepper.Step
                    label="Final step"
                    description="Configure your wallet"
                    p={20}
                  >
                    <ConfigureWallet refetch={refetch} />
                  </Stepper.Step>

                  <Stepper.Completed>
                    {isAuth &&
                      data?.walletByAddress?.state === WalletState.Ready && (
                        <div className="flex items-center space-x-5 pr-5">
                          <Title my={20} order={2}>
                            You&apos;re all set up! Your wallet address is{" "}
                            {user.addr}
                          </Title>
                        </div>
                      )}
                  </Stepper.Completed>
                </Stepper>
              )}

              <Center my={20}>
                {data?.walletByAddress &&
                  data?.walletByAddress?.address &&
                  !isAuth && (
                    <div>
                      <Text my={20}>
                        Sign in to your wallet to continue create or purchase
                        NFT
                      </Text>
                      <Center>
                        <Button
                          size="xl"
                          variant="gradient"
                          loading={isConnectLoading}
                          onClick={handleLogin}
                        >
                          {`Sign In`}
                        </Button>
                      </Center>
                    </div>
                  )}
              </Center>
            </div>
          </Center>
        </div>
      </Paper>
    </Layout>
  );
};

export default AccountPage;
