import { Authenticator } from "remix-auth";
import { GoogleStrategy } from "remix-auth-google";
import { users, type User, type UserInsert } from "~/server/db/schema";
import { sessionStorage } from "~/server/session";
import { db } from "./db/client";
import { z } from "zod";

const env = z
  .object({
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GOOGLE_CALLBACK_URL: z.string(),
  })
  .parse(process.env);

export const authenticator = new Authenticator<User>(sessionStorage);

const googleStrategy = new GoogleStrategy(
  {
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackURL: env.GOOGLE_CALLBACK_URL,
    accessType: "offline",
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    const profileEmail = profile.emails?.[0].value;

    if (!profileEmail) {
      throw new Error("No email found in Google profile");
    }

    const newUserValues: UserInsert = {
      email: profileEmail,
      refreshToken,
      name: profile.displayName,
      accessToken,
      avatarUrl: profile.photos?.[0].value,
    };

    const [user] = await db
      .insert(users)
      .values(newUserValues)
      .onConflictDoUpdate({ target: users.email, set: newUserValues })
      .returning();

    return user;
  }
);

authenticator.use(googleStrategy);
