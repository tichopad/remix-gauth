import { Authenticator } from "remix-auth";
import { GoogleStrategy } from "remix-auth-google";
import { z } from "zod";
import { type User } from "~/server/db/schema";
import * as UserRepository from "~/server/repositories/user";
import { sessionStorage } from "~/server/session";

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
    prompt: "select_account",
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    const profileEmail = profile.emails?.[0].value;

    if (!profileEmail) {
      throw new Error("No email found in Google profile");
    }

    const user = await UserRepository.upsert({
      email: profileEmail,
      refreshToken,
      name: profile.displayName,
      accessToken,
      avatarUrl: profile.photos?.[0].value,
    });

    if (!user) {
      throw new Error("Failed to create user");
    }

    return user;
  }
);

authenticator.use(googleStrategy);
