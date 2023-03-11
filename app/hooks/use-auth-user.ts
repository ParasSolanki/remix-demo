import { useRouteLoaderData } from "@remix-run/react";
import type { AuthUser } from "~/services/auth.server";

export default function useAuthUser() {
  const data = useRouteLoaderData("routes/__dashboard") as { user?: AuthUser };

  if (!data?.user) return undefined;

  return data.user;
}
