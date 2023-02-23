import { Button } from "@mantine/core";
import React, { useEffect } from "react";
import { useFlowAccountConfiguration } from "~/hooks/useFlowAccountConfiguration";
import { api } from "~/utils/api";

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

export default ConfigureWallet;
