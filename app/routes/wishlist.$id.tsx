import { type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "~/server/auth";
import { db } from "~/server/db/client";
import { type UserWishlistRole, type User } from "~/server/db/schema";

export default function WishlistDetail() {
  const { wishlist, owner, myRole } = useLoaderData<typeof loader>();

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Wishlist: {wishlist.name}</h1>
      <p>Owner: {owner?.name}</p>
      <p>My role: {myRole?.role}</p>
    </main>
  );
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);

  const wishlistId = params.id;

  if (!wishlistId) {
    throw new Error("No wishlist id provided");
  }

  const wishlist = await db.query.wishlists.findFirst({
    where: (wishlists, { eq }) => eq(wishlists.id, parseInt(wishlistId)),
  });

  if (!wishlist) {
    throw new Error("Wishlist not found");
  }

  console.log("wishlist", wishlist);

  let owner: User | undefined;
  const ownerId = wishlist.ownerId;
  if (ownerId !== null) {
    owner = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, ownerId),
    });
  }

  let myRole: UserWishlistRole | undefined;
  const userId = user?.id;
  if (userId) {
    myRole = await db.query.userWishlistRoles.findFirst({
      where: (roles, { and, eq }) =>
        and(eq(roles.userId, userId), eq(roles.wishlistId, wishlist.id)),
    });
  }

  return { wishlist, owner, myRole };
}
