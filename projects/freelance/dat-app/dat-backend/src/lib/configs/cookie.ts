import { type CookieOptions } from "hono/utils/cookie";

export const COOKIE_NAME = "my_app_session";

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "Strict",
  maxAge: 60 * 60 * 24,
};
