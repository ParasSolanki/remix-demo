import { prisma } from "~/utils/prisma";
import bcrypt from "bcryptjs";

export async function login(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { password: true },
    });

    if (!user) throw new Error("User not found");

    if (!user.password) throw new Error("no password");

    const isMatch = await bcrypt.compare(password, user.password.hash);

    if (!isMatch) throw new Error("Invalid credentials");

    const { password: userPassword, ...userWithoutPassword } = user;

    return userWithoutPassword;
  } catch (e) {
    throw e;
  }
}

export async function register({
  firstName,
  lastName,
  email,
  password,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  try {
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) throw new Error("User already exists with this email");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: { create: { hash: hashedPassword } },
      },
    });

    return user;
  } catch (e) {
    throw e;
  }
}
