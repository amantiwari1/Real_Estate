/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@mantine/core";
import React, { useEffect } from "react";
import { useConnectWallet } from "~/hooks/useConnectWallet";
import { api } from "~/utils/api";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as fcl from "@onflow/fcl";
import { type WalletByAddressQuery } from "~/gql/graphql";

interface RegisterWalletProps {
  refetch: any;
  data: WalletByAddressQuery;
}

const RegisterWallet = ({ refetch, data }: RegisterWalletProps) => {
  const { isAuth, user, isLoading: isConnectLoading } = useConnectWallet();
  const { mutateAsync, isLoading: isRegisterLoading } =
    api.nft.registerWallet.useMutation();

  const { mutateAsync: mutateAsyncVerify, isLoading: isLoadingVerify } =
    api.nft.verifyWallet.useMutation();

  const handleEffect = async () => {
    if (isAuth && user.addr !== "") {
      try {
        await mutateAsync();
      } catch (e) {
        console.log(e);
      }
    }
  };

  useEffect(() => {
    handleEffect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth, isConnectLoading, user.addr]);

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
    <div>
      <Button
        variant="gradient"
        loading={isConnectLoading || isRegisterLoading || isLoadingVerify}
        onClick={handleVerify}
      >
        {`Verify wallet`}
      </Button>
    </div>
  );
};

export default RegisterWallet;