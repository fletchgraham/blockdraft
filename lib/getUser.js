import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getUserFromCookies() {
  const theCookie = (await cookies()).get("blockdraft")?.value;
  if (!theCookie) {
    return null;
  } else {
    try {
      const decoded = jwt.verify(theCookie, process.env.JWTSECRET);
      return decoded;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
