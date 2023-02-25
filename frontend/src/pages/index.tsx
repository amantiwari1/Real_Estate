import { Button, Center, Flex, Group } from "@mantine/core";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import LandingCard from "~/components/LandingCard";

const textgradient = `bg-gradient-to-r from-fuchsia-500 via-purple-500 to-rose-500 bg-clip-text text-transparent`;

const LandingCardData = [
  {
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsam consequuntur repellendus dolorem nemo dolores molestias perferendis est maxime officiis! Harum eligendi quam eos nesciunt maiores iste debitis, eaque perferendis id!",
    title: "Lorem ipsum dolor",
    buttonText: "Sign up",
    href: "/account?isSignin=true",
  },
  {
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsam consequuntur repellendus dolorem nemo dolores molestias perferendis est maxime officiis! Harum eligendi quam eos nesciunt maiores iste debitis, eaque perferendis id!",
    title: "Lorem ipsum dolor",
    buttonText: "Create",
    href: "/marketplace",
  },
  {
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsam consequuntur repellendus dolorem nemo dolores molestias perferendis est maxime officiis! Harum eligendi quam eos nesciunt maiores iste debitis, eaque perferendis id!",
    title: "Lorem ipsum dolor",
    buttonText: "Publish",
    href: "/drafts",
  },
];

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Flow Estate - Real Estate Platform</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <div className="h-screen bg-gradient-to-r from-cyan-600 to-green-500"> */}
      <div className="h-screen bg-gradient-to-r from-gray-700 via-slate-800 to-slate-900">
        <nav className=" w-full border-b-[1px] border-gray-700 bg-gray-900/40 bg-opacity-30 p-5 backdrop-blur-lg backdrop-filter">
          <div className="flex items-center justify-between">
            <p>Flow Estate logo</p>
            <div className="flex space-x-5">
              <Link href="/marketplace">
                <Button radius="xl" variant="light">
                  Explore
                </Button>
              </Link>
              <Link href="/account?isSignin=true">
                <Button radius="xl" variant="light">
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        </nav>
        <h1
          className={` p-10 text-center text-5xl  font-extrabold ${textgradient}`}
        >
          Unlock the Future of <br /> Real Estate Investment
        </h1>
        <Center>
          <Link href="/marketplace">
            <Button
              size="xl"
              variant="gradient"
              gradient={{ from: "blue", to: "green", deg: 105 }}
              radius="xl"
            >
              Explore Flow Estate Marketplace
            </Button>
          </Link>
        </Center>
        <Center px={50} pt={50}>
          <Group p={10} position="apart" maw={1300}>
            {LandingCardData.map((data, index) => (
              <LandingCard key={index} number={index + 1} {...data} />
            ))}
          </Group>
        </Center>
      </div>
    </>
  );
};

export default Home;
