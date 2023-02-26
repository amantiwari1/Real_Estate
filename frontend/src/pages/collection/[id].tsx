import { Center, Loader, Table, Text, Title } from "@mantine/core";
import { useRouter } from "next/router";
import React from "react";
import { nftDocument } from "~/graphql";
import { useGraphQL } from "~/hooks/useGraphql";
import Layout from "~/layouts/layout";

const CollectionID = () => {
  const router = useRouter();
  const id = router.query["id"]?.toString() as string;

  const { data, isLoading } = useGraphQL(
    nftDocument,
    {},
    {
      id: id,
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
    <Layout>
      <Center>
        <div className="grid grid-cols-2 gap-10">
          <div>
            <img
              src={data?.nft?.model?.content?.poster?.url}
              className="h-auto w-[400px]"
              alt={data?.nft?.model?.title as string}
            />
          </div>

          <div className="space-y-5">
            <Title>{data?.nft?.model?.title}</Title>

            <Text> {data?.nft?.model?.description}</Text>

            <Table>
              <tbody>
                <tr>
                  <td>Price</td>
                  <td>{data?.nft?.model?.attributes?.price ?? 0.1}</td>
                </tr>
                <tr>
                  <td>Size (square footage) </td>
                  <td>{data?.nft?.model?.attributes?.size ?? "N/A"}</td>
                </tr>
                <tr>
                  <td>Location </td>
                  <td>{data?.nft?.model?.attributes?.location ?? "N/A"}</td>
                </tr>
                <tr>
                  <td>Age of the property </td>
                  <td>
                    {data?.nft?.model?.attributes?.age + " years" ?? "N/A"}
                  </td>
                </tr>
                <tr>
                  <td>Number of BHK </td>
                  <td>{data?.nft?.model?.attributes?.bhk + " BHK" ?? "N/A"}</td>
                </tr>
                <tr>
                  <td>Renovations/repairs </td>
                  <td>
                    {data?.nft?.model?.attributes?.is_repair ? "Yes" : "No"}
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

export default CollectionID;
