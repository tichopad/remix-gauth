import { createCookieSessionStorage } from "@remix-run/node";
import { z } from "zod";

const env = z
  .object({
    SESSION_SECRET: z.string(),
    NODE_ENV: z.string(),
  })
  .parse(process.env);

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    sameSite: "lax", // helps with CSRF
    path: "/", // add this so the cookie will work in all routes
    httpOnly: true, // security reasons
    secrets: [env.SESSION_SECRET],
    secure: env.NODE_ENV === "production", // enable in prod only
  },
});
