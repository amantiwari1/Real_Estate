/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Center,
  Loader,
  Modal,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { nftDocument } from "~/graphql";
import { useGraphQL } from "~/hooks/useGraphql";
import Layout from "~/layouts/layout";
import createListing from "cadence/transactions/list";
import FlowEstateForm from "~/components/FlowEstateForm";
import { showNotification } from "@mantine/notifications";
import { FORM_ERROR } from "~/components/form/Form";
import { z } from "zod";
import RentalForm from "~/components/RentalForm";

const CreateRentFormValidation = z.object({
  amount: z.number(),
  deposit: z.number(),
  duration: z.number(),
});

const CollectionID = () => {
  const [opened, setOpened] = useState(false);

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

  const blockchainid = Number(data?.nft?.blockchainId);

  return (
    <Layout>
      <Center>
        <div className="grid grid-cols-2 gap-10">
          <div>
            <img
              src={data?.nft?.model?.content?.poster?.url}
              className="aspect-square h-full w-full rounded-md"
              alt={data?.nft?.model?.title as string}
            />
          </div>

          <div className="space-y-5">
            <Title>{data?.nft?.model?.title}</Title>

            <Text>
              {" "}
              {data?.nft?.model?.description} {data?.nft?.blockchainId}{" "}
            </Text>

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
            <div className="flex items-center justify-between">
              <Button
                onClick={async () => {
                  await createListing(
                    "RealEstate",
                    blockchainid,
                    1.75,
                    undefined,
                    undefined,
                    86400
                  )
                    .then((txid) => console.log("txid", txid))
                    .catch((err) => console.log("err", err));
                }}
              >
                List for Sale
              </Button>

              <Button onClick={() => setOpened(true)}>Rental</Button>
            </div>
          </div>
        </div>
      </Center>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Enter Details for rent"
        centered
      >
        <RentalForm
          className="my-4"
          submitText="Rent NFT"
          schema={CreateRentFormValidation}
          initialValues={{}}
          onSubmit={async (values) => {
            try {
              console.log("values", values);

              // TODO - Rent it
            } catch (error: any) {
              console.error(error);
              showNotification({
                title: "Something went wrong",
                message: "Failed to create campaign",
                color: "red",
              });
              return {
                [FORM_ERROR]: error.toString(),
              };
            }
          }}
        />
      </Modal>
    </Layout>
  );
};

export default CollectionID;
