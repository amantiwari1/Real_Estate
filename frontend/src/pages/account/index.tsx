import { Button, Loader, Paper, Text } from "@mantine/core";
import React, { useEffect } from "react";
import { WalletState } from "~/gql/graphql";
import { useConnectWallet } from "~/hooks/useConnectWallet";
import Layout from "~/layouts/layout";
import { api } from "~/utils/api";
// @ts-ignore
import * as fcl from "@onflow/fcl";
import ConfigureWallet from "~/components/wallet/ConfigureWallet";
import { useRouter } from "next/router";

const AccountPage = () => {
  const {
    login,
    isAuth,
    user,
    logout,
    isLoading: isConnectLoading,
  } = useConnectWallet();
  const { mutateAsync, isLoading: isRegisterLoading } =
    api.nft.registerWallet.useMutation();

  const { data, refetch, isLoading } = api.nft.getWallet.useQuery(undefined, {
    enabled: isAuth ? true : false,
  });

  const { mutateAsync: mutateAsyncVerify } = api.nft.verifyWallet.useMutation();

  const router = useRouter();

  const onReadySigin = router.query.isSignin;

  const handleLogin = async () => {
    await login();
  };

  useEffect(() => {
    if (isAuth) {
      mutateAsync();
    } else {
      if (onReadySigin === "true") {
        handleLogin();
      }
    }
  }, [isAuth]);

  const handleVerify = async () => {
    const verificationCode = data?.walletByAddress?.verificationCode;
    const signedVerificationCode = await fcl.currentUser.signUserMessage(
      verificationCode
    );
    if (!signedVerificationCode) {
      return;
    }
    await mutateAsyncVerify({
      signedVerificationCode: signedVerificationCode,
    });
    await refetch();
  };

  return (
    <Layout>
      {/* Everything is good account */}
      <Paper bg="gray" p={40} className="flex justify-center">
        <div className="space-y-5">
          {isAuth && data?.walletByAddress?.state === WalletState.Ready && (
            <div className="flex items-center space-x-5 pr-5">
              <Text>You're all set up! Your wallet address is {user.addr}</Text>
            </div>
          )}

          {isLoading && <Loader />}

          {/* UNAUTH */}
          {isAuth &&
            data?.walletByAddress?.state === WalletState.Unverified && (
              <Button
                variant="gradient"
                loading={isConnectLoading || isRegisterLoading}
                onClick={handleVerify}
              >
                {`Verify wallet`}
              </Button>
            )}

          {/* UNAUTH */}
          {isAuth && data?.walletByAddress?.state === WalletState.Verified && (
            <ConfigureWallet refetch={refetch} />
          )}

          {/* UNAUTH */}
          {!isAuth && (
            <Button
              variant="gradient"
              loading={isConnectLoading || isRegisterLoading}
              onClick={handleLogin}
            >
              {`Sign In`}
            </Button>
          )}

          {/* AUTH WITH HELP LOGOUT */}
          {isAuth && (
            <Button
              loading={isConnectLoading}
              onClick={async () => {
                await logout();
              }}
            >
              Log out
            </Button>
          )}
        </div>
      </Paper>
    </Layout>
  );
};

export default AccountPage;
