import { defer, type LoaderArgs } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { BlogPosts } from "~/components/Posts";
import { getUserPosts } from "~/models/user";

export async function loader({ params }: LoaderArgs) {
  const posts = getUserPosts(params.userId!);

  return defer(
    {
      posts,
    },
    {
      headers: {
        "Cache-Control": "max-age=300, stale-while-revalidate=60",
      },
    }
  );
}

export default function UserPostsPage() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <Suspense fallback="loading...">
      <Await resolve={posts}>{(posts) => <BlogPosts posts={posts} />}</Await>
    </Suspense>
  );
}
