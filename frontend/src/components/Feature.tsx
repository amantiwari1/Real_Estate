import { Button } from "@mantine/core";

interface FeatureProps {
  title: string;
  description: string;
  buttonText: string;
  href: string;
}

const Feature = ({ title, description, buttonText, href }: FeatureProps) => {
  return (
    <div className="flex flex-col items-center space-y-6">
      <h2 className="text-3xl font-bold">{title}</h2>
      <p className="max-w-lg text-center text-gray-300">{description}</p>
      <Button
        component="a"
        href={href}
        radius="xl"
        variant="gradient"
        gradient={{ from: "blue", to: "green", deg: 105 }}
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default Feature;
