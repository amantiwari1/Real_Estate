import { Button, Center, Title } from "@mantine/core";
import Link from "next/link";
import React from "react";

interface LandingCardProps {
  title: string;
  description: string;
  number: number;
  buttonText: string;
  href: string;
}

const LandingCard = ({
  title,
  description,
  number,
  buttonText,
  href,
}: LandingCardProps) => {
  return (
    <div className="h-full rounded-full border border-gray-600 bg-gray-900/40 p-12  text-center backdrop-blur-3xl backdrop-filter hover:border-gray-500">
      <Center>
        <div className="space-y-2">
          <p className="text-lg ">Step {number}</p>

          <Title order={3}>{title}</Title>
          <p className="text-gray-500">{description}</p>

          <Link href={href}>
            <Button
              variant="light"
              color="green"
              radius="xl"
              maw={240}
              w="100%"
              className="my-4"
            >
              {buttonText}
            </Button>
          </Link>
        </div>
      </Center>
    </div>
  );
};

export default LandingCard;
