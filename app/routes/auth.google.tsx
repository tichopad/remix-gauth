import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { authenticator } from "~/server/auth";

export function loader(args: LoaderFunctionArgs) {
  return redirect("/");
}

export function action({ request }: ActionFunctionArgs) {
  return authenticator.authenticate("google", request);
}
