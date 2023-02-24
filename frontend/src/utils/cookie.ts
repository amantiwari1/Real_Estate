import { getCookie } from "cookies-next";
import type { NextApiRequest, NextApiResponse } from "next";

export function getAddressFromCookie(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookieValue = getCookie("CURRENT_USER", { req, res });
  if (!cookieValue) {
    return "";
  }

  return JSON.parse(cookieValue.toString())?.addr as string;
}
