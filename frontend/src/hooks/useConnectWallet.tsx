/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as fcl from "@onflow/fcl";
import { useCallback, useEffect, useState } from "react";
import { initFclConfig } from "~/config";
interface UserFlow {
  addr: string;
  cid: string;
  loggedIn: boolean;
}

export function useConnectWallet() {
  const [user, setUser] = useState<UserFlow>({
    addr: "",
    cid: "",
    loggedIn: false,
  });
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const signup = useCallback(async () => {
    setIsLoading(true);
    await fcl.signUp();
    setIsLoading(false);
  }, []);

  const login = useCallback(async () => {
    setIsLoading(true);
    await fcl.logIn();
    setIsLoading(false);
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    await fcl.unauthenticate();
    setIsLoading(false);
  }, []);

  async function handleUserUpdate() {
    setIsLoading(true);
    await initFclConfig();
    await fcl.currentUser().subscribe((user: UserFlow) => {
      console.log({ user });
      setUser(user);
      setIsAuth(user.loggedIn);
    });
    setIsLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    handleUserUpdate();
  }, []);

  return { isAuth, user, signup, login, logout, isLoading };
}
