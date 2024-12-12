import { Hono } from "hono";
import { cors } from "hono/cors";
import { html } from "hono/html";
import { logger } from "hono/logger";

import { env } from "./lib/configs/env";
import { authRouter } from "./routes/auth.route";
import { postRouter } from "./routes/post.route";

const app = new Hono();

app.use("*", logger());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.get("/", (c) => {
  const port = env.PORT;
  return c.html(html`
    <html>
      <head>
        <title>Hono + Vite</title>
      </head>
      <body>
        <h1>Hello Hono + Vite</h1>
        <p>Listening on http://localhost:${port}</p>
      </body>
    </html>
  `);
});

export const apiRouter = app
  .basePath("/api")
  .route("/auth", authRouter)
  .route("/posts", postRouter);

export type AppType = typeof apiRouter;

export default {
  fetch: app.fetch,
  port: env.PORT,
};
