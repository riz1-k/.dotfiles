import { eq } from "drizzle-orm";
import { getSignedCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";

import { db } from "../db";
import { refreshTokens } from "../db/schema";
import { COOKIE_NAME } from "../lib/configs/cookie";
import { env } from "../lib/configs/env";
import { signOut, type TPayload } from "../lib/helpers/auth-helper";

export const verifyAuth = createMiddleware<{
  Variables: {
    user: TPayload;
  };
}>(async (c, next) => {
  const token = await getSignedCookie(c, env.JWT_SECRET, COOKIE_NAME);
  if (!token) {
    return c.json({ message: "Unauthorized" }, 401);
  }
  const storedToken = await db.query.refreshTokens.findFirst({
    where: eq(refreshTokens.token, token),
    with: {
      user: {
        columns: {
          id: true,
          email: true,
          role: true,
        },
      },
    },
  });

  if (!storedToken) {
    return c.json({ message: "Refresh Token Not Found" }, 401);
  }

  if (new Date() > storedToken.expiresAt) {
    await signOut(c, storedToken.user);
    return c.json({ message: "Refresh Token Expired" }, 401);
  }

  c.set("user", storedToken.user);
  return next();
});
