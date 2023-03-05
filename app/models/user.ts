import type { Album, Post, Todo, User } from "~/types";
import { wait } from "~/utils/wait";

export async function getUsers() {
  await wait(2000);
  const res = await fetch("https://jsonplaceholder.typicode.com/users");

  return (await res.json()) as User[];
}

export async function getUser(userId: string) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );

  return (await res.json()) as User;
}

export async function getUserPosts(userId: string) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/users/${userId}/posts`
  );

  return (await res.json()) as Post[];
}

export async function getUserTodos(userId: string) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/users/${userId}/todos`
  );

  return (await res.json()) as Todo[];
}

export async function getUserAlbums(userId: string) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/users/${userId}/albums`
  );

  return (await res.json()) as Album[];
}
