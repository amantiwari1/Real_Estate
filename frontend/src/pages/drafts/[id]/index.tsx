/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Center, Group, Loader, Title } from "@mantine/core";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { NftModelDocument } from "~/gql/graphql";
import { useGraphQL } from "~/hooks/useGraphql";
import Layout from "~/layouts/layout";

import { showNotification } from "@mantine/notifications";
import { useConnectWallet } from "~/hooks/useConnectWallet";

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

  const handlePublish = async () => {
    try {
      // handle checkout
    } catch (error) {
      console.log({ error });

      showNotification({
        title: "Something went wrong",
        message: "Something went wrong, please try again later",
        color: "red",
      });
    }
  };

  const { isAuth, user, isLoading: isAuthLoading } = useConnectWallet();

  useEffect(() => {
    if (
      !isAuthLoading &&
      !isLoadingNftModel &&
      isAuth &&
      data?.nftModel?.attributes.address !== user.addr
    ) {
      router.push("/marketplace");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.addr, isAuth, isAuthLoading, isLoadingNftModel]);

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
            <Button loading={isLoadingNftModel} onClick={handlePublish}>
              Publish
            </Button>

            <Button onClick={() => router.push(`/drafts/${id}/edit`)}>
              Edit
            </Button>
          </Group>
        </div>
      </Center>
    </Layout>
  );
};

export default IDPages;
