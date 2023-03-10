import { json, type LoaderArgs } from "@remix-run/node";
import { Form, Outlet, useLoaderData } from "@remix-run/react";
import Sidebar from "~/components/Sidebar";
import { getSession } from "~/services/session.server";
import { authenticator, type AuthUser } from "~/services/auth.server";
import { ArrowRightIcon, Bars3CenterLeftIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import classNames from "classnames";

export async function loader({ request }: LoaderArgs) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const sesstion = await getSession(request.headers.get("Cookie"));

  return json({ user: sesstion.data["sessionKey"] as AuthUser });
}

export default function DashboardLayout() {
  const { user } = useLoaderData<typeof loader>();
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div
      className={classNames(
        "grid gap-x-4",
        { "grid-cols-[14rem_1fr]": showSidebar },
        { "grid-cols-1": !showSidebar }
      )}
    >
      <Sidebar open={showSidebar} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            className="rounded-full p-1.5 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:ring-offset-2 focus:ring-offset-slate-900"
            onClick={() => setShowSidebar((prev) => !prev)}
          >
            <Bars3CenterLeftIcon className="h-7 w-7" />
          </button>
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
