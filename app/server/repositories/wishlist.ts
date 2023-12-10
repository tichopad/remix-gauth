import { eq } from "drizzle-orm";
import { db } from "../db/client";
import {
  userWishlistRoles,
  wishlists,
  type UserWishlistRole,
  type Wishlist,
  type WishlistInsert,
} from "../db/schema";

/**
 * Get wishlist by ID.
 */
export function get(id: Wishlist["id"]) {
  return db.query.wishlists.findFirst({
    where: eq(wishlists.id, id),
  });
}

/**
 * Create a new wishlist and its related user-wishlist role.
 */
export function create(
  ownerId: UserWishlistRole["userId"],
  values: WishlistInsert
) {
  return db.transaction(async (trx) => {
    const insertResult = await trx.insert(wishlists).values(values).returning();
    const wishlist = insertResult.at(0);

    if (!wishlist) {
      trx.rollback();
      return;
    }

    const role = await trx
      .insert(userWishlistRoles)
      .values({
        userId: ownerId,
        wishlistId: wishlist.id,
        role: "owner",
      })
      .returning();

    return { wishlist, role };
  });
}

/**
 * Get wishlist with its associated users.
 */
export function getWithUsers(id: Wishlist["id"]) {
  return db.query.wishlists.findFirst({
    where: eq(wishlists.id, id),
    with: {
      userWishlistRoles: {
        with: {
          user: true,
        },
      },
    },
  });
}
