import { Alert, Button, Center, Loader, SimpleGrid, Text } from "@mantine/core";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import RealEstateCard from "~/components/RealEstateCard";
import { type Nft, NftBlockchainState } from "~/gql/graphql";
import { nftsByWalletDocument } from "~/graphql";
import { useConnectWallet } from "~/hooks/useConnectWallet";
import { useGraphQL } from "~/hooks/useGraphql";
import Layout from "~/layouts/layout";
import { useRouter } from 'next/router';


const CollectionPage = () => {
  const { isAuth } = useConnectWallet();

  const router = useRouter();
  const { id } = router.query;

  const [domainOwner, setDomainOwner] = useState(null);
  console.log('domain owner is',domainOwner);
  const { data, isLoading } = useGraphQL(
    nftsByWalletDocument,
    {
      enabled: isAuth ? true : false,
    },
    {
      address: domainOwner,
    }
  );

  const nfts = data?.nftsByWallet?.items as Nft[];

  useEffect(() => {
    async function getDomainDetails(): Promise<any> {
      const apiUrl = `https://testnet.flowns.org/api/data/domain/${id}`;
      const response = await fetch(apiUrl);
      const flowndata = await response.json();
      console.log(flowndata.owner);
      setDomainOwner(flowndata.owner);
    }

    if (data && router.query.id) {
      getDomainDetails();
    }
  }, [data, id, router.query.id]);

  if (!isAuth) {
    return (
      <Layout>
        <Alert color="red">You need to sign in to see others collection</Alert>
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
              The owner doesn&apos;t own any Flow Estate yet
            </Text>
            <Link href="/">
              <Button className="my-6">Checkout the Market</Button>
            </Link>
          </div>
        </Center>
      )}


      {nfts?.length > 0 && (
        <SimpleGrid cols={4}>
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
        </SimpleGrid>
      )}
    </Layout>
  );
};

export default CollectionPage;
