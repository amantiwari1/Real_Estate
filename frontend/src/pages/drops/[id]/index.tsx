/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Center, Group, Loader, Text, Title } from "@mantine/core";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import {
  NftModelDocument,
  type TransferNftToUserMutation,
} from "~/gql/graphql";
import { useGraphQL } from "~/hooks/useGraphql";
import Layout from "~/layouts/layout";
import { api } from "~/utils/api";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as fcl from "@onflow/fcl";
import { showNotification } from "@mantine/notifications";

interface checkoutWithDapperWalletProps {
  __typename?: "CheckoutWithDapperWalletResponse";
  cadence: string;
  brand: string;
  expiry: string;
  nftId: string;
  nftDatabaseId: string;
  nftTypeRef: string;
  price: string;
  registryAddress: string;
  setId: string;
  templateId: string;
  signerAddress: string;
  signerKeyId: number;
}

const IDPages = () => {
  const router = useRouter();
  const id = router.query["id"]?.toString();

  const { data, isLoading: isLoadingNftModel } = useGraphQL(
    NftModelDocument,
    {},
    {
      id: id as string,
    }
  );

  const claimable = data?.nftModel?.attributes?.claimable ?? false;
  const { mutateAsync, isLoading } =
    api.nft.checkoutWithDapperWallet.useMutation();

  const {
    mutateAsync: mutateAsyncSignTransaction,
    isLoading: isLoadingSignTransaction,
  } = api.nft.SignTransactionForDapperWallet.useMutation();

  const {
    mutateAsync: mutateAsyncCompleteCheckoutWith,
    isLoading: isLoadingCompleteCheckoutWith,
  } = api.nft.CompleteCheckoutWithDapperWallet.useMutation();

  const signTransaction = useCallback(async (transaction: string) => {
    const response = await mutateAsyncSignTransaction({ transaction });
    return response.signTransactionForDapperWallet;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { mutateAsync: mutateAsyncClaimNFT, isLoading: isLoadingClaimNFT } =
    api.nft.claim.useMutation();

  const handleClaim = async () => {
    try {
      const data = (await mutateAsyncClaimNFT({
        id: id as string,
      })) as TransferNftToUserMutation;

      data.transfer?.id && router.push(`/collection/${data.transfer?.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckout = async () => {
    try {
      const checkout = await mutateAsync({ id: data?.nftModel?.id as string });

      const {
        cadence,
        registryAddress,
        brand,
        nftId,
        nftTypeRef,
        nftDatabaseId,
        setId,
        templateId,
        price,
        expiry,
        signerKeyId,
        signerAddress,
      } = checkout.checkoutWithDapperWallet as checkoutWithDapperWalletProps;

      const tx = await fcl.mutate({
        cadence,
        args: (arg: any, t: any) => [
          arg(process.env.NEXT_PUBLIC_MERCHANT_ACCOUNT_ADDRESS, t.Address),
          arg(registryAddress, t.Address),
          arg(brand, t.String),
          arg(nftId, t.Optional(t.UInt64)),
          arg(nftTypeRef, t.String),
          arg(setId, t.Optional(t.Int)),
          arg(templateId, t.Optional(t.Int)),
          arg(price, t.UFix64),
          arg(expiry, t.UInt64),
        ],
        authorizations: [
          async (account: any) => ({
            ...account,
            addr: signerAddress,
            tempId: `${signerAddress}-${signerKeyId}`,
            keyId: signerKeyId,
            signingFunction: async (signable: any) => {
              return {
                keyId: signerKeyId,
                addr: signerAddress,
                signature: await signTransaction(signable.message),
              };
            },
          }),
          fcl.authz,
        ],
        limit: 9999,
      });

      await fcl.tx(tx).onceSealed();

      const completeCheckout = await mutateAsyncCompleteCheckoutWith({
        transactionId: tx,
        nftDatabaseId,
      });

      const nft = completeCheckout.completeCheckoutWithDapperWallet;

      await router.push(`/collection/${nft?.id}`);
    } catch (error) {
      console.log({ error });

      showNotification({
        title: "Something went wrong",
        message: "Something went wrong, please try again later",
        color: "red",
      });
    }
  };

  if (isLoadingNftModel) {
    return (
      <Layout>
        <Center h="100%">
          <Loader />
        </Center>
      </Layout>
    );
  }

  return (
    <Layout>
      <Center>
        <div>
          <img
            src={data?.nftModel?.content?.poster?.url}
            className="h-auto w-[400px]"
            alt={data?.nftModel?.title as string}
          />
          <Title align="center" my={20}>
            {data?.nftModel?.title}
          </Title>

          <Group position="apart">
            {!claimable && (
              <Button
                loading={
                  isLoading ||
                  isLoadingSignTransaction ||
                  isLoadingCompleteCheckoutWith ||
                  isLoadingNftModel
                }
                onClick={handleCheckout}
              >
                Checkout
              </Button>
            )}

            {claimable && (
              <Button
                loading={
                  isLoading ||
                  isLoadingSignTransaction ||
                  isLoadingCompleteCheckoutWith ||
                  isLoadingClaimNFT ||
                  isLoadingNftModel
                }
                onClick={handleClaim}
              >
                Claim This NFT
              </Button>
            )}

            <Button onClick={() => router.push(`/marketplace/${id}/edit`)}>
              Edit
            </Button>
          </Group>
        </div>
      </Center>
    </Layout>
  );
};

export default IDPages;
