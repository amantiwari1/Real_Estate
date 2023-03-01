import { Alert, Button, Center, Loader, Text } from "@mantine/core";
import Link from "next/link";
import React from "react";
import RealEstateCard from "~/components/RealEstateCard";
import { type Nft, NftBlockchainState } from "~/gql/graphql";
import { nftsByWalletDocument } from "~/graphql";
import { useConnectWallet } from "~/hooks/useConnectWallet";
import { useGraphQL } from "~/hooks/useGraphql";
import Layout from "~/layouts/layout";

const CollectionPage = () => {
  const { user, isAuth } = useConnectWallet();

  const { data, isLoading } = useGraphQL(
    nftsByWalletDocument,
    {
      enabled: isAuth ? true : false,
    },
    {
      address: user?.addr,
    }
  );

  const nfts = data?.nftsByWallet?.items as Nft[];

  if (!isAuth) {
    return (
      <Layout>
        <Alert color="red">You need to sign in to display a collection</Alert>
      </Layout>
    );
  }

  if (isLoading) {
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
      {!nfts?.length && (
        <Center>
          <div>
            <Text className="text-center">
              You don&apos;t own any Flow Estate yet
            </Text>
            <Link href="/">
              <Button className="my-6">Checkout the Market</Button>
            </Link>
          </div>
        </Center>
      )}

      {nfts?.length > 0 && (
        <div className="grid gap-5 md:grid-cols-4">
          {nfts
            .filter((nft) =>
              [
                NftBlockchainState.Transferred,
                NftBlockchainState.Transferring,
              ].includes(nft?.blockchainState as NftBlockchainState)
            )
            .map((nft) => (
              <RealEstateCard
                title={nft?.model?.title as string}
                image={nft?.model?.content?.poster?.url}
                description={nft?.model?.description as string}
                link={`/collection/${nft?.id}`}
                price={nft?.model?.attributes?.price ?? 0.1}
                state={nft?.model?.state}
                key={nft?.id}
              />
            ))}
        </div>
      )}
    </Layout>
  );
};

export default CollectionPage;
