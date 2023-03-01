import { Center, Grid, Loader } from "@mantine/core";
import { type NextPage } from "next";
import Head from "next/head";
import RealEstateCard from "~/components/RealEstateCard";
import { NftBlockchainState, NftModelBlockchainState } from "~/gql/graphql";
import { nftModelsDocument } from "~/graphql";
import { useGraphQL } from "~/hooks/useGraphql";
import Layout from "~/layouts/layout";

const Home: NextPage = () => {
  const { data, isLoading } = useGraphQL(
    nftModelsDocument,
    {},
    {
      appId: process.env.NEXT_PUBLIC_CLIENT_ID,
    }
  );

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
    <>
      <Head>
        <title>Real Estate NFT</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout>
          {!isLoading && (
            <Grid className="card-container">
              {data?.nftModels?.items
                ?.filter(
                  (item) =>
                    item?.state === NftModelBlockchainState.Minted &&
                    item.nfts?.[0]?.blockchainState !==
                      NftBlockchainState.Transferred
                )
                .map((item) => (
                  <Grid.Col key={item?.id as string} span={3}>
                    <RealEstateCard
                      state={item?.state}
                      link={`/marketplace/${item?.id}`}
                      description={item?.description as string}
                      image={item?.content?.poster?.url}
                      price={item?.attributes?.price ?? 0.1}
                      title={item?.title as string}
                    />
                  </Grid.Col>
                ))}
            </Grid>
          )}
        </Layout>
      </main>
    </>
  );
};

export default Home;
