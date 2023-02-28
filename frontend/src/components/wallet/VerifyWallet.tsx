/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Center, Text } from "@mantine/core";
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

const VerifyWallet = ({ refetch, data }: RegisterWalletProps) => {
  const { isLoading: isConnectLoading } = useConnectWallet();

  const { mutateAsync: mutateAsyncVerify, isLoading: isLoadingVerify } =
    api.nft.verifyWallet.useMutation();

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
      <Center>
        <Button
          size="xl"
          variant="gradient"
          loading={isConnectLoading || isLoadingVerify}
          onClick={handleVerify}
        >
          {`Verify wallet`}
        </Button>
      </Center>
    </div>
  );
};

export default VerifyWallet;
