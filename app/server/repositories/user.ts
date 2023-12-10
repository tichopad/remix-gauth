import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { users, type User, type UserInsert } from "../db/schema";

/**
 * Get a user by their ID.
 */
export function get(id: User["id"]) {
  return db.query.users.findFirst({
    where: eq(users.id, id),
  });
}

/**
 * Insert a new user.
 */
export async function upsert(values: UserInsert) {
  const results = await db
    .insert(users)
    .values(values)
    .onConflictDoUpdate({ target: users.email, set: values })
    .returning();

  return results.at(0);
}

/**
 * Get user with their wishlists.
 */
export function getWithWishlists(id: User["id"]) {
  return db.query.users.findFirst({
    where: eq(users.id, id),
    with: {
      userWishlistRoles: {
        with: {
          wishlist: true,
        },
      },
    },
  });
}
