import type { User } from "@prisma/client";
import { Authenticator, AuthorizationError } from "remix-auth";
import { sessionStorage } from "~/services/session.server";
import { FormStrategy } from "remix-auth-form";
import { login, register } from "~/models/auth";

export type AuthUser = User;

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator<AuthUser>(sessionStorage, {
  sessionKey: "sessionKey",
  sessionErrorKey: "sessionErrorKey",
});

const loginStrategy = new FormStrategy(async ({ form }) => {
  let email = form.get("email") as string;
  let password = form.get("password") as string;

  // TODO: validate data properly check email, password

  if (!email) throw new AuthorizationError("Email is required");
  if (!password) throw new AuthorizationError("Password is required");

  let user = await login(email, password);

  return user;
});

const registerStrategy = new FormStrategy(async ({ form }) => {
  let firstName = form.get("firstname") as string;
  let lastName = form.get("lastname") as string;
  let email = form.get("email") as string;
  let password = form.get("password") as string;

  // TODO: validate data properly check email, password

  if (!firstName) throw new AuthorizationError("First name is required");
  if (!lastName) throw new AuthorizationError("Last name is required");
  if (!email) throw new AuthorizationError("Email is required");
  if (!password) throw new AuthorizationError("Password is required");

  let user = await register({ firstName, lastName, email, password });
  // the type of this user must match the type you pass to the Authenticator
  // the strategy will automatically inherit the type if you instantiate
  // directly inside the `use` method
  return user;
});

// Tell the Authenticator to use the form strategy
authenticator.use(loginStrategy, "login").use(registerStrategy, "register");
