import type { Comment } from "~/types";
import { wait } from "~/utils/wait";

export async function getPostComments(postId: string) {
  await wait(4000);
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
  );

  return (await res.json()) as Comment[];
}
