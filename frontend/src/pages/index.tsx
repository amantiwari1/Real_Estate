import { Button, Center, Flex, Group } from "@mantine/core";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import LandingCard from "~/components/LandingCard";
import logo from "../assets/logo.png";

const textgradient = `bg-gradient-to-r from-fuchsia-500 via-purple-500 to-rose-500 bg-clip-text text-transparent`;

const LandingCardData = [
  {
    description:
      "Simply sign up with your email and you are ready to go. No need to create a wallet or install any wallet.",
    title: "Walletless onboarding",
    buttonText: "Sign up",
    href: "/account?isSignin=true",
  },
  {
    description:
      "Draft your Property NFT and add all the details you want to show to your buyers. You can also add a video and images to your NFT.",
    title: "Create your first draft nft",
    buttonText: "Create",
    href: "/marketplace",
  },
  {
    description:
      "When you are ready to publish your NFT, you can publish it on the marketplace by minting it.",
    title: "Publish your NFT on the marketplace",
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
          Unlock the Future of <br /> Real Estate with FlowEstate
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
          <div className="grid grid-cols-3  gap-5">
            {LandingCardData.map((data, index) => (
              <LandingCard key={index} number={index + 1} {...data} />
            ))}
          </div>
        </Center>
      </div>
    </>
  );
};

export default Home;
