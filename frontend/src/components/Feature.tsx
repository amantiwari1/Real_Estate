import { Button, Center, ThemeIcon } from "@mantine/core";
import { type TablerIconsProps } from "@tabler/icons-react";

interface FeatureProps {
  title: string;
  description: string;
  buttonText: string;
  href: string;
  Icon: (props: TablerIconsProps) => JSX.Element;
}

const Feature = ({
  title,
  description,
  buttonText,
  href,
  Icon,
}: FeatureProps) => {
  return (
    <div className="flex h-full flex-col justify-between space-y-5 text-center">
      <Center>
        <ThemeIcon
          size={50}
          radius="md"
          variant="gradient"
          gradient={{ deg: 133, from: "green", to: "cyan" }}
        >
          <Icon stroke={2} size={30} />
        </ThemeIcon>
      </Center>

      <h2 className="text-xl font-bold">{title}</h2>
      <p className="max-w-lg text-center text-sm text-gray-300">
        {description}
      </p>
      <div>
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
    </div>
  );
};

export default Feature;
