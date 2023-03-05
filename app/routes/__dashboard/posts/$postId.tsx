import { defer, type MetaFunction } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import type { Comment } from "~/types";
import { Await, Link, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { getPost } from "~/models/post";
import { getPostComments } from "~/models/comments";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export const meta: MetaFunction<Awaited<typeof loader>> = ({ data }) => {
  if (!data) {
    return {
      title: "Posts",
      description: "List of all available posts from jsonplaceholder API",
    };
  }

  return {
    title: data.post.title,
    description: data.post.body,
  };
};

export const loader = async ({ params }: LoaderArgs) => {
  const post = await getPost(params.postId!);
  const comments = getPostComments(params.postId!);

  return defer(
    {
      post,
      comments,
    },
    {
      headers: {
        "Cache-Control": "max-age=180, stale-while-revalidate=30",
      },
    }
  );
};

function CommentsSkeleton() {
  return (
    <ul className="mt-2 space-y-3">
      {new Array(5).fill(0).map((_, index) => (
        <li
          key={index}
          className="block animate-pulse space-y-2 rounded-md py-2 px-4"
        >
          <span className="flex items-center justify-between">
            <span className="h-4 w-80 rounded-md bg-slate-700"></span>
            <span className="h-3 w-40 rounded-md bg-slate-600/80"></span>
          </span>
          <p className="h-3 rounded-md bg-slate-800"></p>
          <p className="h-3 w-3/4 rounded-md bg-slate-800"></p>
        </li>
      ))}
    </ul>
  );
}

function Comments({ comments }: { comments: Comment[] }) {
  return (
    <ul className="mt-2 space-y-3">
      {comments.map((comment) => (
        <li key={comment.id} className="block space-y-1 rounded-md py-2 px-4">
          <span className="flex items-center justify-between">
            <span className="text-base font-semibold text-slate-400">
              {comment.name}
            </span>
            <span className="text-xs">by {comment.email}</span>
          </span>
          <p className="text-sm text-slate-500">{comment.body}</p>
        </li>
      ))}
    </ul>
  );
}

export default function PostDetailsPage() {
  const { post, comments } = useLoaderData<typeof loader>();

  return (
    <section>
      <Link
        to="/posts"
        className="inline-flex items-center text-xl leading-normal hover:text-sky-600 hover:underline"
      >
        <ArrowLeftIcon className="mr-2 h-4 w-4" />
        Posts
      </Link>

      <Suspense fallback="loading...">
        <Await resolve={post}>
          {(post) => (
            <article className="my-4">
              <h2 className="text-4xl font-bold capitalize text-sky-400">
                {post.title}
              </h2>
              <p className="my-6 text-lg text-slate-400">{post.body}</p>
            </article>
          )}
        </Await>
      </Suspense>
      <div className="my-10">
        <h4 className="text-3xl font-bold text-slate-300">Comments</h4>
        <Suspense fallback={<CommentsSkeleton />}>
          <Await resolve={comments}>
            {(comments) => <Comments comments={comments} />}
          </Await>
        </Suspense>
      </div>
    </section>
  );
}
