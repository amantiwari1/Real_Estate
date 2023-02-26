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
      <div
        className="hover:scale-105 bg-white shadow-lg sm:rounded-3xl sm:p-6 bg-clip-padding bg-opacity-60 border border-gray-200 card h-full"
      >
        <Card.Section>
          <img src={image} alt={title} />
        </Card.Section>
        {isDraft && (
          <Card.Section px={10} pt={10}>
            <Badge>{state && StatusMap[state]}</Badge>
          </Card.Section>
        )}
        <Card.Section p={10} className="text-black text-center">
          <Text weight={500}>{title}</Text>
          <Text size="sm" weight={400}>
            {description}
          </Text>
          Price: {price}
        </Card.Section>
      </div>
    </Link>
  );
};

export default RealEstateCard;
