import { Alert, Button, Center, SimpleGrid, Text } from "@mantine/core";
import Link from "next/link";
import React from "react";
import CollectionCard from "~/components/CollectionCard";
import { Nft, NftBlockchainState } from "~/gql/graphql";
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
            <Text>Your collection is empty. Start Collecting!</Text>
            <Link href="/">
              <Button>Go to Drops</Button>
            </Link>
          </div>
        </Center>
      )}

      {nfts?.length > 1 && (
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
