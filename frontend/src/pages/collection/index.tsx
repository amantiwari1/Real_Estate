import { Alert, Button, Center, SimpleGrid, Text } from "@mantine/core";
import Link from "next/link";
import React from "react";
import CollectionCard from "~/components/CollectionCard";
import { type Nft, NftBlockchainState } from "~/gql/graphql";
import { nftsByWalletDocument } from "~/graphql";
import { useConnectWallet } from "~/hooks/useConnectWallet";
import { useGraphQL } from "~/hooks/useGraphql";
import Layout from "~/layouts/layout";

const CollectionPage = () => {
  const { user, isAuth } = useConnectWallet();

  const { data } = useGraphQL(
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
        <SimpleGrid cols={3}>
          {nfts
            .filter((nft) =>
              [
                NftBlockchainState.Transferred,
                NftBlockchainState.Transferring,
              ].includes(nft?.blockchainState as NftBlockchainState)
            )
            .map((nft) => (
              <CollectionCard nft={nft} key={nft?.id} />
            ))}
        </SimpleGrid>
      )}
    </Layout>
  );
};

export default CollectionPage;
