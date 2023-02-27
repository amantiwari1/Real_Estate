import { Button, Center, Loader, Paper, Text, Title } from "@mantine/core";
import React, { useEffect } from "react";
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
    logout,
    isLoading: isConnectLoading,
  } = useConnectWallet();

  const { data, refetch, isLoading } = api.nft.getWallet.useQuery(undefined, {
    enabled: isAuth ? true : false,
  });

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
              {isAuth && data?.walletByAddress?.state === WalletState.Ready && (
                <div className="flex items-center space-x-5 pr-5">
                  <Title order={2}>
                    You&apos;re all set up! Your wallet address is {user.addr}
                  </Title>
                </div>
              )}
              {isAuth && isLoading && <Loader />}

              <Center my={20}>
                {!data?.walletByAddress && !data?.walletByAddress?.address && (
                  <RegisterWallet refetch={refetch} />
                )}

                {/* UNAUTH */}
                {isAuth &&
                  data?.walletByAddress?.state === WalletState.Unverified && (
                    <VerifyWallet data={data} refetch={refetch} />
                  )}

                {/* UNAUTH */}
                {isAuth &&
                  data?.walletByAddress?.state === WalletState.Verified && (
                    <ConfigureWallet refetch={refetch} />
                  )}

                {/* UNAUTH */}
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
