import { Avatar, Button, Header as HeaderMantine, Text } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useConnectWallet } from "~/hooks/useConnectWallet";
import { api } from "~/utils/api";
const Header = () => {
  const {
    login,
    isAuth,
    user,
    logout,
    isLoading: isConnectLoading,
  } = useConnectWallet();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  return (
    <HeaderMantine height={60} p="xs">
      <div className="flex">
        <div className="flex w-[170px] justify-center">
          <div>{/* <img src={} className="h-10 w-auto" /> */}</div>
        </div>

        <div className="flex w-full justify-between">
          <div> </div>

          <div className="flex space-x-5 pr-5">
            {isAuth && (
              <Link href="/account">
                <div className="flex items-center space-x-5 pr-5">
                  <Avatar src={null} alt="it's me" radius="xl" />
                  <Text>{user.addr}</Text>
                </div>
              </Link>
            )}

            {!isAuth && (
              <Button
                loading={isLoading || isConnectLoading}
                onClick={async () => {
                  setIsLoading(true);
                  await logout();
                  setIsLoading(false);
                }}
              >
                Log out
              </Button>
            )}
          </div>
        </div>
      </div>
    </HeaderMantine>
  );
};

export default Header;
