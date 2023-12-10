import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/server/auth";
import * as UserRepository from "~/server/repositories/user";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      {data.user !== null ? (
        <>
          <h1>Welcome {data.user.name}!</h1>
          <p>Email: {data.user.email}</p>
          {data.user.avatarUrl ? (
            <img
              src={data.user.avatarUrl}
              alt={data.user.name ?? "User's profile picture"}
            />
          ) : null}
          <Form method="post" action="/auth/google/logout">
            <button>Sign out</button>
          </Form>
          <h2>Wishlists</h2>
          <a href="/wishlist/create">Create a Wishlist</a>
          <br />
          <ul>
            {data.userWithWishlists?.userWishlistRoles.map((userWishlist) => (
              <li key={userWishlist.wishlistId}>
                <a href={`/wishlist/${userWishlist.wishlistId}`}>
                  {userWishlist.wishlist?.name ?? "Unknown"} (
                  {userWishlist.role})
                </a>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <h1>Welcome!</h1>
          <Form method="post" action="/auth/google">
            <button>Sign in with Google</button>
          </Form>
        </>
      )}
    </main>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);

  if (user === null) {
    return { user, userWithWishlists: null };
  }

  const userWithWishlists = await UserRepository.getWithWishlists(user.id);

  return { user, userWithWishlists };
}
