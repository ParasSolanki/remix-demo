import type { Post } from "~/types";
import { wait } from "~/utils/wait";

export async function getPosts() {
  await wait(2000);
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  return (await res.json()) as Post[];
}

export async function getPost(postId: string) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}`
  );
  return (await res.json()) as Post;
}

export async function createPost(post: Omit<Post, "id">) {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify(post),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return (await res.json()) as Post;
}
