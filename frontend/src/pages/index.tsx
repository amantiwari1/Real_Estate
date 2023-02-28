import { Button, Center } from "@mantine/core";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import LandingCard from "~/components/LandingCard";
import Feature from "~/components/Feature";
import { IconLock, IconShoppingCart, IconUser } from "@tabler/icons-react";

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

const featureData = [
  {
    title: "Decentralized Marketplace",
    description:
      "FlowEstate is a decentralized platform that allows you to buy, sell, and trade real estate properties as NFTs.",
    buttonText: "Learn more",
    href: "/marketplace",
    Icon: IconShoppingCart,
  },
  {
    title: "Secure Transactions",
    description:
      "By using blockchain technology, FlowEstate ensures that your transactions are secure, transparent, and immutable.",
    buttonText: "How it works",
    href: "/marketplace",
    Icon: IconLock,
  },
  {
    title: "Easy Onboarding",
    description:
      "Simply sign up with your email and you are ready to go. No need to create a wallet or install any wallet.",
    buttonText: "Get started",
    href: "/account?isSignin=true",
    Icon: IconUser,
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
      <div className=" h-full bg-gradient-to-r from-gray-700 via-slate-800 to-slate-900">
        <nav className=" w-full border-b-[1px] border-gray-700 bg-gray-900/40 bg-opacity-30 p-5 backdrop-blur-lg backdrop-filter">
          <div className="flex items-center justify-between">
            <p>
              <img src="/flowestate.svg" alt="logo" />
            </p>
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
        <div className="">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center py-20">
              <h1
                className={`text-center text-5xl font-extrabold ${textgradient}`}
              >
                Unlock the Future of <br /> Real Estate with FlowEstate
              </h1>
              <p className="mt-10 max-w-2xl text-center text-gray-300">
                FlowEstate is a decentralized platform that allows you to buy,
                sell, and trade real estate properties as NFTs. With FlowEstate,
                you can create a Property NFT by adding all the necessary
                details, including images and videos, and sell it to the highest
                bidder. By using blockchain technology, FlowEstate ensures that
                your transactions are secure, transparent, and immutable.
              </p>
            </div>
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
            <Center my={40}>
              <div className="grid max-w-6xl grid-cols-3 gap-5">
                {LandingCardData.map((data, index) => (
                  <LandingCard key={index} number={index + 1} {...data} />
                ))}
              </div>
            </Center>
            <div className=" py-20">
              <div className="container mx-auto px-4">
                <h2 className="mb-16 text-center text-4xl font-bold text-white">
                  Features
                </h2>
                <div className="grid  gap-10 md:grid-cols-3">
                  {featureData.map((data, index) => (
                    <Feature key={index} {...data} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between border-t-[1px] border-gray-700 bg-gray-900/40 p-5 text-sm text-gray-300">
            <p>&copy; 2023 Flow Estate. All rights reserved.</p>
            <div className="flex items-center space-x-3">
              <Link href="#" legacyBehavior>
                <a className="text-gray-300 hover:text-gray-100">
                  Terms of Service
                </a>
              </Link>
              <Link href="#" legacyBehavior>
                <a className="text-gray-300 hover:text-gray-100">
                  Privacy Policy
                </a>
              </Link>
              <Link href="#" legacyBehavior>
                <a className="text-gray-300 hover:text-gray-100">Contact Us</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
