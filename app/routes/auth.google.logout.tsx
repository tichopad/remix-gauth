import { type ActionFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/server/auth";

export function action({ request }: ActionFunctionArgs) {
  return authenticator.logout(request, { redirectTo: "/" });
}
