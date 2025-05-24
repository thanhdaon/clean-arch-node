import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import z from "zod";
import { db } from "~/db/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "mysql" }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        validator: { input: z.enum(["employer", "employee"]), required: true },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
});
