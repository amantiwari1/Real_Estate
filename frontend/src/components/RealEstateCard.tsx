import { Badge, Card, Text } from "@mantine/core";
import Link from "next/link";
import React from "react";
import { type NftModelBlockchainState } from "~/gql/graphql";

interface RealEstateCard {
  title: string;
  description: string;
  price: number;
  image: string;
  link: string;
  state: NftModelBlockchainState | undefined;
  isDraft?: boolean;
}

const StatusMap: Record<NftModelBlockchainState, string> = {
  MINTED: "Published",
  COMPLETED: "Sold",
  ERROR: "Error",
  MINTING: "Publishing",
  UNMINTED: "Unpublished",
};

const RealEstateCard = ({
  title,
  description,
  price,
  image,
  link,
  state,
  isDraft,
}: RealEstateCard) => {
  return (
    <Link className="cursor-pointer" href={link}>
      <Card
        className="hover:scale-105"
        shadow="sm"
        h="100%"
        p="lg"
        radius="md"
        withBorder
      >
        <Card.Section>
          <img src={image} alt={title} />
        </Card.Section>
        {isDraft && (
          <Card.Section px={10} pt={10}>
            <Badge>{state && StatusMap[state]}</Badge>
          </Card.Section>
        )}
        <Card.Section p={10}>
          <Text weight={500}>{title}</Text>
          <Text size="sm" weight={400}>
            {description}
          </Text>
          Price: {price}
        </Card.Section>
      </Card>
    </Link>
  );
};

export default RealEstateCard;
