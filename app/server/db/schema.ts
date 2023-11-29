import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: integer("id").primaryKey(),
    name: text("name"),
    email: text("email"),
    avatarUrl: text("avatar_url"),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
  },
  (users) => ({
    nameIdx: uniqueIndex("nameIdx").on(users.email),
  })
);

export type User = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;
