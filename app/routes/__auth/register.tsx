import {
  type ActionArgs,
  json,
  type LoaderArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Form, Link, useLoaderData, useTransition } from "@remix-run/react";
import {
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";
import SpinnerIcon from "~/components/SpinnerIcon";
import { authenticator } from "~/services/auth.server";
import { getSession } from "~/services/session.server";
import { useState } from "react";

export const meta: MetaFunction = () => ({
  title: "Register",
});

// Second, we need to export an action function, here we will use the
// `authenticator.authenticate method`
export async function action({ request, context }: ActionArgs) {
  // we call the method with the name of the strategy we want to use and the
  // request object, optionally we pass an object with the URLs we want the user
  // to be redirected to after a success or a failure
  return await authenticator.authenticate("register", request, {
    successRedirect: "/",
    failureRedirect: "/register",
    throwOnError: true,
    context,
  });
}

// Finally, we can export a loader function where we check if the user is
// authenticated with `authenticator.isAuthenticated` and redirect to the
// dashboard if it is or return null if it's not
export async function loader({ request }: LoaderArgs) {
  // If the user is already authenticated redirect to /dashboard directly
  await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });

  const session = await getSession(request.headers.get("Cookie"));

  const error = session.get("sessionErrorKey");
  return json({ error });
}

// First we create our UI with the form doing a POST and the inputs with the
// names we are going to use in the strategy
export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const data = useLoaderData<typeof loader>();
  const transition = useTransition();

  return (
    <>
      <h2 className="mb-4 text-4xl font-bold text-slate-300">Register</h2>

      <Form method="post" className="flex flex-col space-y-4">
        {data.error?.message && (
          <span className="text-red-500">{data.error?.message}</span>
        )}
        <div className="flex items-center space-x-4">
          <div className="w-6/12">
            <label htmlFor="firstname" className="font-medium">
              Firstname
            </label>
            <input
              id="firstname"
              type="text"
              name="firstname"
              className="mt-1 block w-full rounded-md border-2 border-slate-700 bg-slate-800/90 p-2 text-slate-200 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
            />
          </div>
          <div className="w-6/12">
            <label htmlFor="lastname" className="font-medium">
              Lastname
            </label>
            <input
              id="lastname"
              type="text"
              name="lastname"
              className="mt-1 block w-full rounded-md border-2 border-slate-700 bg-slate-800/90 p-2 text-slate-200 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            className="mt-1 block w-full rounded-md border-2 border-slate-700 bg-slate-800/90 p-2 text-slate-200 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="password" className="font-medium">
            Password
          </label>
          <div className="relative mt-1 overflow-hidden rounded-md border-2 border-slate-700 bg-slate-800/90 text-slate-200 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              className="block w-full border-none bg-inherit pr-9 text-base"
            />
            <button
              type="button"
              className="-z-1 absolute top-1/2 right-0 flex h-full w-9 -translate-y-1/2 items-center justify-center px-2 hover:bg-slate-700 focus:bg-slate-700 focus:outline-none"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <EyeIcon className="h-5 w-5" />
              ) : (
                <EyeSlashIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={transition.state === "submitting"}
          className="highlight-white/20 relative block w-full rounded-lg bg-sky-500 px-4 py-2 text-lg font-semibold text-white shadow-md hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:bg-sky-500/60 disabled:text-white/60"
        >
          <span className="absolute top-1/2 left-0 flex h-full w-10 -translate-y-1/2 items-center justify-center">
            <LockClosedIcon className="h-5 w-5 fill-white/50" />
          </span>
          Register
          {transition.state === "submitting" ? (
            <span className="absolute top-1/2 right-0 flex h-full w-10 -translate-y-1/2 items-center justify-center">
              <SpinnerIcon />
            </span>
          ) : null}
        </button>
      </Form>

      <p className="mt-4 text-base">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-sky-400 hover:underline">
          Login
        </Link>
      </p>
    </>
  );
}
