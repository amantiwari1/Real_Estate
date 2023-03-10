import { Alert, Center, Grid, Title } from "@mantine/core";
import { type NextPage } from "next";
import Head from "next/head";
import RealEstateCard from "~/components/RealEstateCard";
import { nftModelsDocument } from "~/graphql";
import { useConnectWallet } from "~/hooks/useConnectWallet";
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

  const { user, isAuth } = useConnectWallet();

  const nftsModelWithAddress = data?.nftModels?.items?.filter(
    (item) => item?.attributes?.address === user.addr
  );

  if (!isAuth) {
    return (
      <Layout>
        <Alert color="red">
          You need to sign in to display your drafts NFT
        </Alert>
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
          {nftsModelWithAddress?.length === 0 && (
            <Center>
              <Title>You don&apos;t have any draft NFT</Title>
            </Center>
          )}

          {!isLoading && nftsModelWithAddress?.length ? (
            <div className="card-container h-full min-h-screen">
              <Grid className="p-5 py-6 sm:py-12">
                {nftsModelWithAddress?.map((item) => (
                  <Grid.Col key={item?.id as string} span={3}>
                    <RealEstateCard
                      isDraft
                      state={item?.state}
                      link={`/drafts/${item?.id}`}
                      description={item?.description as string}
                      image={item?.content?.poster?.url}
                      price={item?.attributes?.price ?? 0.1}
                      title={item?.title as string}
                    />
                  </Grid.Col>
                ))}
              </Grid>
            </div>
          ) : (
            ""
          )}
        </Layout>
      </main>
    </>
  );
};

export default Home;
