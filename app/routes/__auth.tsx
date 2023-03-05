import { Outlet } from "@remix-run/react";

export default function AuthLayout() {
  return (
    <main className="flex h-screen items-center">
      <div className="fixed top-0 left-0 -z-10 h-full w-full" tabIndex={-1}>
        <div className="absolute -top-1 -left-1 h-36 w-36 bg-sky-400/20 blur-xl saturate-150"></div>

        <div className="absolute top-1/2 left-3/4 h-80 w-96 scale-150 rounded-full bg-sky-400/10 bg-gradient-to-r from-indigo-600/20 via-purple-700/10 blur-2xl saturate-100"></div>
      </div>
      <Outlet />
    </main>
  );
}
