import { Button, Center, Text } from "@mantine/core";
import React, { useEffect } from "react";
import { useFlowAccountConfiguration } from "~/hooks/useFlowAccountConfiguration";
import { api } from "~/utils/api";

interface ConfigureWalletProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configured]);

  const handleReady = async () => {
    await mutateAsyncReady();
    await refetch();
  };

  return (
    <div>
      <Text my={20}>
        Step 3 - Configure your wallet, it is getting close to complete your
        wallet
      </Text>

      <Center>
        <Button
          size="xl"
          variant="gradient"
          loading={isLoadingReady || isFlowAccountConfigurationLoading}
          onClick={configure}
        >
          {`Configure wallet`}
        </Button>
      </Center>
    </div>
  );
};

export default ConfigureWallet;
