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
import React, { useEffect } from "react";
import { useGraphQL } from "~/hooks/useGraphql";
import Layout from "~/layouts/layout";
import { api } from "~/utils/api";
// import { showNotification } from "@mantine/notifications";
import { useConnectWallet } from "~/hooks/useConnectWallet";
import {
  NftModelDocument,
  type TransferNftToUserMutation,
} from "~/gql/graphql";

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

  const { mutateAsync: mutateAsyncClaimNFT, isLoading: isLoadingClaimNFT } =
    api.nft.claim.useMutation();

  const handlePublish = async () => {
    try {
      const data = (await mutateAsyncClaimNFT({
        id: id as string,
      })) as TransferNftToUserMutation;

      data.transfer?.id && router.push(`/collection/${data.transfer?.id}`);
    } catch (error) {
      console.log(error);
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
        <div className="grid grid-cols-2 gap-10">
          <div>
            <img
              src={data?.nftModel?.content?.poster?.url}
              className="aspect-square h-full w-full rounded-md"
              alt={data?.nftModel?.title as string}
            />
          </div>

          <div className="space-y-5">
            <Group position="apart">
              <Button onClick={() => router.push(`/drafts/${id}/edit`)}>
                Edit
              </Button>

              <Button
                loading={isLoadingNftModel || isLoadingClaimNFT}
                onClick={handlePublish}
              >
                Publish
              </Button>
            </Group>
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
          </div>
        </div>
      </Center>
    </Layout>
  );
};

export default IDPages;
