import { Card, Text } from "@mantine/core";
import Image from "next/image";
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
      <Card shadow="sm" p="lg" radius="md" withBorder>
        <Card.Section>
          <Image src={image} alt={title} />
        </Card.Section>
        <Card.Section>
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
