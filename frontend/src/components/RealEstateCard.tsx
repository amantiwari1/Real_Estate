import { Card, Text } from "@mantine/core";
import Link from "next/link";
import React from "react";

interface RealEstateCard {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

const RealEstateCard = ({
  id,
  title,
  description,
  price,
  image,
}: RealEstateCard) => {
  return (
    <Link className="cursor-pointer" href={`/drops/${id}`}>
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
