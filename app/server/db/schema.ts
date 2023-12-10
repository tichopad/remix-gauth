import { relations } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from "drizzle-orm/sqlite-core";

// -- Users --

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  name: text("name"),
  email: text("email").unique(),
  avatarUrl: text("avatar_url"),
  refreshToken: text("refresh_token"),
  accessToken: text("access_token"),
});

export const userRelations = relations(users, ({ many }) => ({
  userWishlistRoles: many(userWishlistRoles),
}));

export type User = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;

// -- User-Wishlist Roles --

export const userWishlistRoles = sqliteTable(
  "user_wishlist_roles",
  {
    userId: integer("user_id").references(() => users.id),
    wishlistId: integer("wishlist_id").references(() => wishlists.id),
    role: text("role"),
  },
  ({ userId, wishlistId, role }) => {
    return {
      // TODO: Force a single role instead? (might be easier than trying to dedupe query return values later)
      pk: primaryKey({ columns: [userId, wishlistId, role] }),
    };
  }
);

export const userWishlistRolesRelations = relations(
  userWishlistRoles,
  ({ one }) => ({
    user: one(users, {
      fields: [userWishlistRoles.userId],
      references: [users.id],
    }),
    wishlist: one(wishlists, {
      fields: [userWishlistRoles.wishlistId],
      references: [wishlists.id],
    }),
  })
);

export type UserWishlistRole = typeof userWishlistRoles.$inferSelect;
export type UserWishlistRoleInsert = typeof userWishlistRoles.$inferInsert;

// -- Wishlists --

export const wishlists = sqliteTable("wishlists", {
  id: integer("id").primaryKey(),
  name: text("name"),
  description: text("description"),
});

export const wishlistRelations = relations(wishlists, ({ many }) => ({
  userWishlistRoles: many(userWishlistRoles),
}));

export type Wishlist = typeof wishlists.$inferSelect;
export type WishlistInsert = typeof wishlists.$inferInsert;
