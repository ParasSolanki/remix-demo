import { json, type LoaderArgs } from "@remix-run/node";
import { Form, Outlet, useLoaderData } from "@remix-run/react";
import Sidebar from "~/components/Sidebar";
import { getSession } from "~/services/session.server";
import { authenticator, type AuthUser } from "~/services/auth.server";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

export async function loader({ request }: LoaderArgs) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const sesstion = await getSession(request.headers.get("Cookie"));

  return json({ user: sesstion.data["sessionKey"] as AuthUser });
}

export default function DashboardLayout() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <div className="grid grid-cols-[14rem_1fr] gap-x-4">
      <Sidebar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-4 flex flex-row-reverse items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-medium capitalize text-slate-300">{`${user.firstName} ${user.lastName}`}</span>

            <Form method="post" action="/logout">
              <button
                type="submit"
                title="Logout"
                className="flex items-center justify-center"
              >
                <ArrowRightIcon className="h-5 w-5" />
              </button>
            </Form>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
