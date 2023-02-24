import { Loader, Title } from "@mantine/core";
import { useRouter } from "next/router";
import React from "react";
import { nftDocument } from "~/graphql";
import { useGraphQL } from "~/hooks/useGraphql";

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
  return (
    <div>
      {isLoading && <Loader />}
      <Title order={1}>{data?.nft?.model?.title}</Title>
    </div>
  );
};

export default CollectionID;
