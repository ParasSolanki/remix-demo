import classNames from "classnames";
import { useState } from "react";
import { json, type LoaderArgs } from "@remix-run/node";
import { Outlet, useFetcher, useLoaderData } from "@remix-run/react";
import { getSession } from "~/services/session.server";
import { authenticator, type AuthUser } from "~/services/auth.server";
import { ChevronRightIcon } from "lucide-react";
import * as DropdownMenu from "~/components/ui/DropdownMenu";
import Sidebar from "~/components/Sidebar";

export async function loader({ request }: LoaderArgs) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const sesstion = await getSession(request.headers.get("Cookie"));

  return json({ user: sesstion.data["sessionKey"] as AuthUser });
}

function UserDetails({ user }: { user: AuthUser }) {
  const fetcher = useFetcher();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="User dropdown options"
          className="capitalize"
        >
          {`${user.firstName} ${user.lastName}`}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" className="w-48">
          <DropdownMenu.Item className="rounded-md p-2 hover:text-slate-300">
            Dashboard
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item
            asChild
            className="rounded-md p-2"
            onClick={() =>
              fetcher.submit(null, { method: "post", action: "/logout" })
            }
          >
            <button
              type="button"
              title="Logout"
              className="flex w-full cursor-pointer items-center justify-between hover:text-slate-300"
            >
              Logout
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
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
            {/* <MenuIcon className="h-7 w-7" /> */}
          </button>
          <div className="flex items-center space-x-3">
            <UserDetails user={user} />
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
