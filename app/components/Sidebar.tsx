import { Link, useLocation } from "@remix-run/react";
import classNames from "classnames";

const sidebarItems = [
  {
    name: "Posts",
    href: "/posts",
  },
  {
    name: "Users",
    href: "/users",
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sticky top-0 h-screen w-full bg-slate-800/50 shadow-2xl">
      <nav>
        <ul className="flex flex-col space-y-2 p-4">
          {sidebarItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={classNames(
                  "block rounded-md p-2 text-base hover:bg-slate-700 focus:bg-sky-400 focus:text-white focus:outline-none",
                  {
                    "bg-sky-600 font-medium text-slate-200":
                      location.pathname === item.href,
                    "text-slate-100": location.pathname !== item.href,
                  }
                )}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
