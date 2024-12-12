import { env } from "./src/lib/configs/env";

export default {
  schema: "src/db/schema/index.ts",
  dialect: "sqlite",
  driver: "turso",
  out: "src/db/migrations",
  dbCredentials: {
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
  tablesFilter: ["my_app_*"],
};
