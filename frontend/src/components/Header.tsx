import {
  ActionIcon,
  Avatar,
  Button,
  Header as HeaderMantine,
  TextInput,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useConnectWallet } from "~/hooks/useConnectWallet";
const Header = () => {
  const [isLoading, setIsLoading] = useState(false);
  const address = null;
  const router = useRouter();

  const { login } = useConnectWallet();

  return (
    <HeaderMantine height={60} p="xs">
      <div className="flex">
        <div className="flex w-[170px] justify-center">
          <div>{/* <img src={} className="h-10 w-auto" /> */}</div>
        </div>

        <div className="flex w-full justify-between">
          <TextInput
            rightSection={
              <ActionIcon>
                <IconSearch />
              </ActionIcon>
            }
            w={300}
            ml={100}
            placeholder="Search..."
            value={""}
            onChange={(e) => {}}
          />

          <div className="flex space-x-5 pr-5">
            <Button
              variant="gradient"
              loading={isLoading}
              onClick={async () => {
                if (address) {
                  router.push("/create-campaign");
                } else {
                  setIsLoading(true);
                  await login();
                  setIsLoading(false);
                }
              }}
            >
              {address ? `Create a Campaign` : `Sign In`}
            </Button>

            <Link href="/profile">
              <Avatar src={null} alt="it's me" radius="xl" />
            </Link>
          </div>
        </div>
      </div>
    </HeaderMantine>
  );
};

export default Header;
