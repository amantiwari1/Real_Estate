/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Alert,
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
import { showNotification } from "@mantine/notifications";
import { FORM_ERROR } from "~/components/form/Form";
import { z } from "zod";
import RentalForm from "~/components/RentalForm";
import createListing from "cadence/transactions/list";
import createRental from "cadence/transactions/rental";
import LoanForm from "~/components/LoanForm";
import loanForm from "cadence/transactions/loan";
import { useConnectWallet } from "~/hooks/useConnectWallet";

const CreateRentFormValidation = z.object({
  amount: z.number(),
  deposit: z.number(),
  duration: z.number(),
});

const CreateLoanFormValidation = z.object({
  amount: z.number(),
  repayment: z.number(),
  duration: z.number(),
});

const CollectionID = () => {
  const { isAuth } = useConnectWallet();
  const router = useRouter();
  const id = router.query["id"]?.toString() as string;
  const { data, isLoading } = useGraphQL(
    nftDocument,
    {
      enabled: router.isReady,
    },
    {
      id: id,
    }
  );

  const [opened, setOpened] = useState(false);
  const [loanopened, setLoanopened] = useState(false);

  const blockchainid = Number(data?.nft?.blockchainId);

  if (!isAuth) {
    return (
      <Layout>
        <Alert color="red">You need to sign in to view this page</Alert>
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

              <Button onClick={() => setLoanopened(true)}>Loan</Button>
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
              // calculate the term = duration * 86400
              const term = String(values.duration * 86400.0001);
              console.log(term);
              const expiry = String(2592000.0001);
              console.log("values", values);
              await createRental(
                blockchainid,
                String(values.amount + 0.0001),
                String(values.deposit + 0.0001),
                term,
                expiry,
                undefined
              );

              showNotification({
                title: "Success",
                message: "NFT listed for rent",
                color: "green",
              });

              setOpened(false);
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

      <Modal
        opened={loanopened}
        onClose={() => setLoanopened(false)}
        title="Enter Details for taking Loan"
        centered
      >
        <LoanForm
          className="my-4"
          submitText="Loan NFT"
          schema={CreateLoanFormValidation}
          initialValues={{}}
          onSubmit={async (values) => {
            try {
              // calculate the term = duration * 86400
              const term = String(values.duration * 86400.0001);
              const interestRate = String(
                (values.repayment - values.amount) * 0.0001
              );
              console.log(term);
              const expiry = String(2592000.0001);
              console.log("values", values);
              await loanForm(
                blockchainid,
                String(values.amount + 0.0001),
                interestRate,
                term,
                true,
                expiry
              );

              showNotification({
                title: "Success",
                message: "NFT listed for loan",
                color: "green",
              });

              setLoanopened(false);
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
