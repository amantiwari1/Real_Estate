/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Center, Text } from "@mantine/core";
import React, { useEffect } from "react";
import { useConnectWallet } from "~/hooks/useConnectWallet";
import { api } from "~/utils/api";

interface RegisterWalletProps {
  refetch: any;
}

const RegisterWallet = ({ refetch }: RegisterWalletProps) => {
  const {
    isAuth,
    user,
    login,
    isLoading: isConnectLoading,
  } = useConnectWallet();
  const { mutateAsync, isLoading: isRegisterLoading } =
    api.nft.registerWallet.useMutation();

  const handleEffect = async () => {
    if (isAuth && user.addr !== "") {
      try {
        await mutateAsync();
        await refetch();
      } catch (e) {
        console.log(e);
      }
    }
  };

  useEffect(() => {
    handleEffect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth, isConnectLoading, user.addr]);

  return (
    <div>
      <Center>
        <Button
          size="xl"
          variant="gradient"
          loading={isConnectLoading || isRegisterLoading}
          onClick={login}
        >
          {`Link or create your wallet`}
        </Button>
      </Center>
    </div>
  );
};

export default RegisterWallet;
