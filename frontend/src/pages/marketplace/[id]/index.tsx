/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Center,
  Group,
  Loader,
  Table,
  Text,
  Title,
} from "@mantine/core";
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
import Link from "next/link";

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
      const checkout = await mutateAsync({
        id: data?.nftModel?.id as string,
        address: data?.nftModel?.attributes?.address,
      });

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
        <div className="grid grid-cols-2 gap-10">
          <div>
            <img
              src={data?.nftModel?.content?.poster?.url}
              className="aspect-square h-full w-full rounded-md"
              alt={data?.nftModel?.title as string}
            />
          </div>

          <div className="space-y-5">
            <Title>{data?.nftModel?.title}</Title>

            <Text> {data?.nftModel?.description}</Text>

            <Table>
              <tbody>
                <tr>
                  <td>Price</td>
                  <td>{data?.nftModel?.attributes?.price ?? 0.1}</td>
                </tr>
                <tr>
                  <td>Size (square footage) </td>
                  <td>{data?.nftModel?.attributes?.size ?? "N/A"}</td>
                </tr>
                <tr>
                  <td>Location </td>
                  <td>{data?.nftModel?.attributes?.location ?? "N/A"}</td>
                </tr>
                <tr>
                  <td>Age of the property </td>
                  <td>{data?.nftModel?.attributes?.age + " years" ?? "N/A"}</td>
                </tr>
                <tr>
                  <td>Number of BHK </td>
                  <td>{data?.nftModel?.attributes?.bhk + " BHK" ?? "N/A"}</td>
                </tr>
                <tr>
                  <td>Renovations/repairs </td>
                  <td>
                    {data?.nftModel?.attributes?.is_repair ? "Yes" : "No"}
                  </td>
                </tr>
              </tbody>
            </Table>

            <Group position="apart">
              {!claimable && (
                <Button
                  size="xl"
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
              <Link href={`/marketplace/${data?.nftModel?.id}/checkout`}>
                <Button size="xl">Circle Checkout</Button>
              </Link>

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
            </Group>
          </div>
        </div>
      </Center>
    </Layout>
  );
};

export default IDPages;
