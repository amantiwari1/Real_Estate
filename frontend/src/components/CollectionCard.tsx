/* eslint-disable @next/next/no-img-element */
import { Card, Text } from "@mantine/core";
import Link from "next/link";
import React from "react";
import { type Nft } from "~/gql/graphql";

interface CollectionCardProps {
  nft: Nft;
}

const CollectionCard = ({ nft }: CollectionCardProps) => {
  return (
    <Link href={`/collection/${nft.id}`}>
      <Card shadow="sm" p="lg" radius="md" withBorder>
        <Card.Section>
          <img
            src={nft.model?.content?.poster?.url}
            alt={nft.model?.title as string}
          />
        </Card.Section>
        <Card.Section>
          <Text>{nft.model?.title}</Text>
        </Card.Section>
      </Card>
    </Link>
  );
};

export default CollectionCard;
