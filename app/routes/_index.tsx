import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/server/auth";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      {user ? (
        <>
          <h1>Welcome {user.name}!</h1>
          <p>Email: {user.email}</p>
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name ?? "User's profile picture"}
            />
          ) : null}
          <Form method="post" action="/auth/google/logout">
            <button>Sign out</button>
          </Form>
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

  return { user };
}
