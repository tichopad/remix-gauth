import { type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "~/server/auth";
import * as WishlistRepository from "~/server/repositories/wishlist";

export default function WishlistDetail() {
  const data = useLoaderData<typeof loader>();

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <a href="/">Home</a>
      <h1>Wishlist: {data.wishlist?.name ?? "Unknown"}</h1>
      <p>Users:</p>
      <ul>
        {data.wishlist?.userWishlistRoles.map((userWishlist) => (
          <li key={userWishlist.userId}>
            {userWishlist.user?.name ?? "Unknown"} ({userWishlist.role})
          </li>
        ))}
      </ul>
    </main>
  );
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);

  const wishlistId = params.id;

  if (!wishlistId) {
    throw new Error("No wishlist id provided");
  }

  const wishlist = await WishlistRepository.getWithUsers(parseInt(wishlistId));

  return { user, wishlist };
}
