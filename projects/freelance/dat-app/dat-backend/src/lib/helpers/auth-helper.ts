import { eq } from "drizzle-orm";
import type { Context } from "hono";
import { deleteCookie, setSignedCookie } from "hono/cookie";
import * as jwt from "hono/jwt";

import { db } from "@/src/db";
import { refreshTokens, users } from "@/src/db/schema";

import { COOKIE_NAME, cookieOptions } from "../configs/cookie";
import { env } from "../configs/env";

export type TPayload = Pick<
  typeof users.$inferSelect,
  "id" | "email" | "role"
> & {};

const jwtExpiration = new Date(Date.now() + 60 * 60 * 24 * 1000);

export async function generateJWT(user: TPayload) {
  return await jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      exp: Math.floor(jwtExpiration.getTime() / 1000),
    },
    env.JWT_SECRET
  );
}

export async function setJWTCookie(c: Context, user: TPayload) {
  const jwt = await generateJWT(user);
  await db.delete(refreshTokens).where(eq(refreshTokens.userId, user.id));
  await db.insert(refreshTokens).values({
    token: jwt,
    userId: user.id,
    expiresAt: jwtExpiration,
  });
  await setSignedCookie(c, COOKIE_NAME, jwt, env.JWT_SECRET, cookieOptions);
}

export async function signOut(c: Context, user: TPayload) {
  await db.delete(refreshTokens).where(eq(refreshTokens.userId, user.id));
  deleteCookie(c, COOKIE_NAME, cookieOptions);
}
