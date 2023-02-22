// @ts-ignore
import * as fcl from "@onflow/fcl";
import { useEffect, useState } from "react";
import { initFclConfig } from "~/config";

interface UserFlow {
  addr: string;
  cid: string;
  loggedIn: boolean;
}

interface ProviderFlow {
  is_required?: boolean;
  requires_install?: boolean;
  install_link?: string;
  login_link?: string;
}

interface OptionsFlow {
  service?: {
    providers?: ProviderFlow;
  };
  redir?: boolean;
}
export function useConnectWallet() {
  const [user, setUser] = useState<UserFlow>({
    addr: "",
    cid: "",
    loggedIn: false,
  });
  const [isAuth, setIsAuth] = useState<boolean>(false);

  const signup = (opts: OptionsFlow = {}) => fcl.signUp(opts);
  const login = (opts: OptionsFlow = {}) => fcl.logIn(opts);
  const logout = () => fcl.unauthenticate();

  useEffect(() => {
    initFclConfig();
    fcl.currentUser().subscribe(setUser);
    setIsAuth(user.loggedIn);
  }, []);

  return { isAuth, user, signup, login, logout };
}
