import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  name: text("name"),
  email: text("email").unique(),
  avatarUrl: text("avatar_url"),
  refreshToken: text("refresh_token"),
  accessToken: text("access_token"),
});
export type User = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;

export const userWishlistRoles = sqliteTable(
  "user_wishlist_roles",
  {
    userId: integer("user_id").references(() => users.id),
    wishlistId: integer("wishlist_id").references(() => wishlists.id),
    role: text("role"),
  },
  ({ userId, wishlistId }) => {
    return {
      pk: primaryKey({ columns: [userId, wishlistId] }),
    };
  }
);
export type UserWishlistRole = typeof userWishlistRoles.$inferSelect;
export type UserWishlistRoleInsert = typeof userWishlistRoles.$inferInsert;

export const wishlists = sqliteTable("wishlists", {
  id: integer("id").primaryKey(),
  name: text("name"),
  description: text("description"),
  ownerId: integer("owner_id").references(() => users.id),
});
export type Wishlist = typeof wishlists.$inferSelect;
export type WishlistInsert = typeof wishlists.$inferInsert;
