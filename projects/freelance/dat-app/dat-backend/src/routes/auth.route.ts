import { zValidator } from "@hono/zod-validator";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { Hono } from "hono";

import { db } from "../db";
import { users } from "../db/schema";
import { setJWTCookie, signOut } from "../lib/helpers/auth-helper";
import { verifyAuth } from "../middlewares/auth.middleware";

const authSchema = createInsertSchema(users).pick({
  name: true,
  email: true,
  password: true,
});

export const authRouter = new Hono()
  .get("/me", verifyAuth, (c) => {
    return c.json(c.var.user);
  })
  .post("/register", zValidator("json", authSchema), async (c) => {
    const data = c.req.valid("json");
    const exisingUser = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    });
    if (exisingUser) {
      return c.json({ message: "Email already exists" }, 400);
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const [newUser] = await db
      .insert(users)
      .values({
        ...data,
        password: hashedPassword,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      });
    await setJWTCookie(c, newUser);
    return c.json(newUser);
  })
  .post(
    "/login",
    zValidator("json", authSchema.omit({ name: true })),
    async (c) => {
      const data = c.req.valid("json");
      const user = await db.query.users.findFirst({
        where: eq(users.email, data.email),
      });
      if (!user) {
        return c.json({ message: "Invalid email or password" }, 401);
      }
      const isPasswordCorrect = await bcrypt.compare(
        data.password,
        user.password
      );
      if (!isPasswordCorrect) {
        return c.json({ message: "Invalid email or password" }, 401);
      }
      await setJWTCookie(c, user);
      return c.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    }
  )
  .post("/logout", verifyAuth, async (c) => {
    await signOut(c, c.var.user);
    return c.json({ message: "Logged out" });
  });
