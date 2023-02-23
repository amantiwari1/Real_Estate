import { Button, Paper, Text } from "@mantine/core";
import React, { useEffect } from "react";
import { WalletState } from "~/gql/graphql";
import { useConnectWallet } from "~/hooks/useConnectWallet";
import Layout from "~/layouts/layout";
import { api } from "~/utils/api";
// @ts-ignore
import * as fcl from "@onflow/fcl";
import { useFlowAccountConfiguration } from "~/hooks/useFlowAccountConfiguration";

interface ConfigureWalletProps {
  refetch: any;
}

const ConfigureWallet = ({ refetch }: ConfigureWalletProps) => {
  const { mutateAsync: mutateAsyncReady, isLoading: isLoadingReady } =
    api.nft.readyWallet.useMutation();

  const {
    configured,
    configure,
    isLoading: isFlowAccountConfigurationLoading,
  } = useFlowAccountConfiguration();

  useEffect(() => {
    if (!configured) {
      return;
    }
    handleReady();
  }, [configured]);

  const handleReady = async () => {
    await mutateAsyncReady();
    await refetch();
  };

  return (
    <Button
      variant="gradient"
      loading={isLoadingReady || isFlowAccountConfigurationLoading}
      onClick={configure}
    >
      {`Configure wallet`}
    </Button>
  );
};

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

  const { data, refetch } = api.nft.getWallet.useQuery(undefined, {
    enabled: isAuth,
  });

  const { mutateAsync: mutateAsyncVerify } = api.nft.verifyWallet.useMutation();

  const handleLogin = async () => {
    console.log("login");
    await login();
    await mutateAsync();
  };

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
