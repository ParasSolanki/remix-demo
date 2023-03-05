import * as Tabs from "@radix-ui/react-tabs";
import { Suspense } from "react";
import { defer, type MetaFunction, type LoaderArgs } from "@remix-run/node";
import {
  Await,
  Link,
  Outlet,
  useLoaderData,
  useLocation,
  useParams,
} from "@remix-run/react";
import { getUser } from "~/models/user";
import {
  ArrowLeftIcon,
  AtSymbolIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/solid";
import type { User } from "~/types";

export const meta: MetaFunction<Awaited<typeof loader>> = ({ data }) => {
  if (!data) {
    return {
      title: "Posts",
      description: "List of all available posts from jsonplaceholder API",
    };
  }

  return {
    title: data.user.name,
    description: `Email: ${data.user.email}`,
  };
};

export async function loader({ params }: LoaderArgs) {
  const user = await getUser(params.userId!);

  return defer(
    {
      user,
    },
    {
      headers: {
        "Cache-Control": "max-age=300, stale-while-revalidate=60",
      },
    }
  );
}

function UserDetails({ user }: { user: User }) {
  return (
    <div className="my-4">
      <h2 className="text-4xl font-bold capitalize leading-tight text-sky-400">
        {user.name}
      </h2>
      <div className="flex items-center">
        <AtSymbolIcon className="h-4 w-4 flex-shrink-0" />
        <span>{user.username}</span>
      </div>

      <div className="mt-8">
        <h4 className="text-lg font-medium capitalize text-slate-200">
          Details:
        </h4>
        <div className="mt-1 flex flex-wrap text-base text-slate-400">
          <div className="w-6/12 space-y-1">
            <div className="flex items-center">
              <EnvelopeIcon className="mr-1.5 h-4 w-4 flex-shrink-0" />
              <span>{user.email}</span>
            </div>

            <div className="flex items-center">
              <PhoneIcon className="mr-1.5 h-4 w-4 flex-shrink-0" />
              <span>{user.phone}</span>
            </div>

            <div className="flex items-center">
              <MapPinIcon className="mr-1.5 h-4 w-4 flex-shrink-0" />
              <span>
                {user.address.city}, {user.address.street},{" "}
                {user.address.zipcode}
              </span>
            </div>
          </div>
          <div className="w-6/12 space-y-1">
            <div className="flex items-center">
              <GlobeAltIcon className="mr-1.5 h-4 w-4 flex-shrink-0" />
              <a
                href={user.website}
                target="_blank"
                rel="noreferrer"
                className="hover:text-sky-400 hover:underline"
              >
                {user.website}
              </a>
            </div>
            <div className="flex items-center">
              <BuildingOfficeIcon className="mr-1.5 h-4 w-4 flex-shrink-0" />
              <span>{user.company.name}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const tabItems = [
  { name: "Posts", value: "posts" },
  { name: "Todos", value: "todos" },
  { name: "Albums", value: "albums" },
] as const;

function UserTabs({ userId }: { userId: User["id"] }) {
  const location = useLocation();
  const value = location.pathname.split("/")[3];

  return (
    <Tabs.Root defaultValue={value ?? "posts"} className="my-4">
      <Tabs.List aria-label="See user posts, todo">
        <ul className="mb-4 flex items-center space-x-6 border-b-2 border-slate-700 text-base font-bold">
          {tabItems.map((item) => (
            <li key={item.value}>
              <Tabs.Trigger value={item.value} asChild>
                <Link
                  to={`/users/${userId}/${item.value}`}
                  replace
                  className="py-4 hover:-mb-[2px] hover:border-b-2 focus:outline-none data-active:-mb-[2px] data-active:border-b-2 data-active:border-sky-400 data-active:text-sky-400 data-inactive:text-slate-400 data-inactive:hover:border-b-slate-500"
                >
                  {item.name}
                </Link>
              </Tabs.Trigger>
            </li>
          ))}
        </ul>
      </Tabs.List>
      <Tabs.Content value="posts">
        <Outlet />
      </Tabs.Content>
      <Tabs.Content value="todos">
        <Outlet />
      </Tabs.Content>
      <Tabs.Content value="albums">
        <Outlet />
      </Tabs.Content>
    </Tabs.Root>
  );
}

export default function UserPage() {
  const { user } = useLoaderData<typeof loader>();
  const params = useParams();

  let userId = params.userId ? Number(params.userId) : undefined;

  if (userId === undefined) {
    return "Data not found";
  }

  return (
    <section>
      <Link
        to="/users"
        className="inline-flex items-center text-xl leading-normal hover:text-sky-600 hover:underline"
      >
        <ArrowLeftIcon className="mr-2 h-4 w-4" />
        Users
      </Link>

      <Suspense fallback="loading..">
        <Await resolve={user}>{(user) => <UserDetails user={user} />}</Await>
      </Suspense>

      <UserTabs userId={userId} />
    </section>
  );
}
