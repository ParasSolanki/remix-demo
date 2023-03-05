import { type ActionArgs, Response } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";

export async function action({ request }: ActionArgs) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // TODO: Here first also check whether user is logged in or not
  // then based on do logout..

  await authenticator.logout(request, { redirectTo: "/login" });
}
