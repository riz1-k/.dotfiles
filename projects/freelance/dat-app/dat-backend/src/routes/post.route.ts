import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { Hono } from "hono";

import { db } from "../db";
import { posts } from "../db/schema";
import { verifyAuth } from "../middlewares/auth.middleware";

const createPostSchema = createInsertSchema(posts);

export const postRouter = new Hono()
  .get("/", async (c) => {
    const posts = await db.query.posts.findMany();
    return c.json(posts);
  })
  .get("/:id", verifyAuth, async (c) => {
    const id = c.req.param("id");
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, parseInt(id)),
    });
    if (!post) {
      return c.json({ message: "Post not found" }, 404);
    }
    return c.json(post);
  })
  .post("/", zValidator("json", createPostSchema), verifyAuth, async (c) => {
    const data = c.req.valid("json");
    const user = c.var.user;
    const [newPost] = await db
      .insert(posts)
      .values({
        ...data,
        authorId: user.id,
      })
      .returning({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        authorId: posts.authorId,
      });
    return c.json(newPost);
  })
  .put("/:id", zValidator("json", createPostSchema), verifyAuth, async (c) => {
    const id = c.req.param("id");
    const data = c.req.valid("json");
    const user = c.var.user;
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, parseInt(id)),
    });
    if (!post) {
      return c.json({ message: "Post not found" }, 404);
    }
    if (post.authorId !== user.id) {
      return c.json({ message: "Unauthorized" }, 401);
    }
    const [updatedPost] = await db
      .update(posts)
      .set({
        ...data,
        authorId: user.id,
      })
      .where(eq(posts.id, parseInt(id)))
      .returning({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        authorId: posts.authorId,
      });
    return c.json(updatedPost);
  })
  .delete("/:id", verifyAuth, async (c) => {
    const id = c.req.param("id");
    const user = c.var.user;
    await db
      .delete(posts)
      .where(and(eq(posts.id, parseInt(id)), eq(posts.authorId, user.id)));
    return c.json({ message: "Post deleted" });
  });
