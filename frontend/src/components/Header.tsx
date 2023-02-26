import { Avatar, Button, Header as HeaderMantine, Text } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useConnectWallet } from "~/hooks/useConnectWallet";
const Header = () => {
  const {
    isAuth,
    user,
    logout,
    isLoading: isConnectLoading,
  } = useConnectWallet();

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <HeaderMantine height={60} p="xs">
      <div className="flex">
        <div className="flex w-[170px] items-center justify-center">
          <div>
            <Link href="/marketplace">
              <img src="/flowestate.svg" alt="logo" />
            </Link>
          </div>
        </div>

        <div className="flex w-full justify-between">
          <div> </div>

          <div className="flex space-x-5 pr-5">
            {isAuth && (
              <Link href="/account">
                <div className="flex items-center space-x-5 pr-1">
                  <Avatar src={null} alt="it's me" radius="xl" />
                  <Text>{user.addr}</Text>
                  <Button>My Account</Button>
                </div>
              </Link>
            )}

            {isAuth && (
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
            {!isAuth && (
              <Button
                loading={isLoading || isConnectLoading}
                onClick={async () => {
                  router.push("/account?isSignin=true");
                }}
              >
                Sign in
              </Button>
            )}
          </div>
        </div>
      </div>
    </HeaderMantine>
  );
};

export default Header;
