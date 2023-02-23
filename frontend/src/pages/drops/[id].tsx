import { Button, Text } from "@mantine/core";
import { useRouter } from "next/router";
import React from "react";
import { NftModelDocument } from "~/gql/graphql";
import { useGraphQL } from "~/hooks/useGraphql";
import Layout from "~/layouts/layout";
import { api } from "~/utils/api";

const IDPages = () => {
  const router = useRouter();
  const id = router.query["id"]?.toString();

  const { data } = useGraphQL(NftModelDocument, {
    id: id as string,
  });

  const { mutateAsync } = api.nft.checkoutWithDapperWallet.useMutation();

  const handleCheckout = () => {
    const checkout = mutateAsync({ id: data?.nftModel?.id as string });

    console.log({ checkout });
  };

  return (
    <Layout>
      <div>
        <Text>{data?.nftModel?.title}</Text>

        <Button onClick={handleCheckout}>Checkout</Button>
      </div>
    </Layout>
  );
};

export default IDPages;
