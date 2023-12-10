import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { authenticator } from "~/server/auth";
import * as WishlistRepository from "~/server/repositories/wishlist";

export default function WishlistCreate() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Create a Wishlist</h1>
      <Form method="post">
        <label>
          Wishlist Name
          <input type="text" name="name" />
        </label>
        <button>Create</button>
      </Form>
    </main>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    throw new Error("Unauthorized");
  }

  const formData = await request.formData();
  const name = formData.get("name") as string | undefined;

  if (!name) {
    throw new Error("Name is required");
  }

  await WishlistRepository.create(user.id, { name });

  return redirect("/");
}
