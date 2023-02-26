import { Badge, Card, Center, Text } from "@mantine/core";
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
      <div className="card h-full border border-gray-200 bg-white bg-opacity-60 bg-clip-padding shadow-lg hover:scale-105 sm:rounded-3xl sm:p-6">
        <div className="flex h-full flex-col justify-between">
          <Card.Section>
            <img
              src={image}
              alt={title}
              className="aspect-square h-full w-full rounded-md"
            />
          </Card.Section>

          {isDraft && (
            <Card.Section px={10} pt={10}>
              <Center>
                <Badge
                  variant="gradient"
                  gradient={{ from: "teal", to: "lime", deg: 105 }}
                >
                  {state && StatusMap[state]}
                </Badge>
              </Center>
            </Card.Section>
          )}

          <Card.Section p={10} className="text-center text-black">
            <Text weight={500}>{title}</Text>
            <Text size="sm" weight={400}>
              {description}
            </Text>
            Price: {price}
          </Card.Section>
        </div>
      </div>
    </Link>
  );
};

export default RealEstateCard;
