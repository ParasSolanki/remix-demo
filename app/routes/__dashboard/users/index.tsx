import { defer, type MetaFunction } from "@remix-run/node";
import { Await, Link, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { getUsers } from "~/models/user";
import type { User } from "~/types";

export const meta: MetaFunction = () => ({
  title: "Users",
  description: "List of all available users from jsonplaceholder API",
});

export const loader = async () => {
  const users = getUsers();
  return defer(
    { users },
    {
      headers: {
        "Cache-Control": "max-age=300, stale-while-revalidate=30",
      },
    }
  );
};

function UsersList({ users }: { users: User[] }) {
  return (
    <ul className="mt-4 space-y-3">
      {users.map((user) => (
        <li key={user.id}>
          <Link
            to={`/users/${user.id}`}
            className="block space-y-2 rounded-md p-4 hover:bg-slate-800/70"
          >
            <span className="text-2xl font-semibold leading-tight text-sky-500">
              {user.name}
            </span>
            <p className="text-sm text-slate-500">
              <strong>Email: </strong>
              {user.email}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function UsersSkeleton() {
  return (
    <ul className="mt-2 space-y-3">
      {new Array(5).fill(0).map((_, index) => (
        <li
          key={index}
          className="block animate-pulse space-y-4 rounded-md px-4 py-5"
        >
          <p className="block h-7 w-2/4 rounded-md bg-slate-700"></p>
          <span className="block h-3 w-1/4 rounded-md bg-slate-800"></span>
        </li>
      ))}
    </ul>
  );
}

export default function Index() {
  const { users } = useLoaderData<typeof loader>();

  return (
    <section>
      <h2 className="text-5xl font-bold text-white">Users</h2>

      <Suspense fallback={<UsersSkeleton />}>
        <Await resolve={users}>{(users) => <UsersList users={users} />}</Await>
      </Suspense>
    </section>
  );
}
