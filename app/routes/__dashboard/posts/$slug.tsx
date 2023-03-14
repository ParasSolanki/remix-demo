import { defer, type MetaFunction } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import type { Comment } from "~/types";
import { Await, Link, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";

import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { getPostDetailsBySlug } from "~/models/post.model";

export const meta: MetaFunction<Awaited<typeof loader>> = ({ data }) => {
  if (!data) {
    return {
      title: "Posts",
      description: "List of all available posts from jsonplaceholder API",
    };
  }

  return {
    title: data.post.title,
    description: data.post.content,
  };
};

export const loader = async ({ params }: LoaderArgs) => {
  const { data: post } = await getPostDetailsBySlug(params.slug!);

  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }

  return defer(
    {
      post,
    },
    {
      headers: {
        "Cache-Control": "max-age=60, stale-while-revalidate=120",
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

export default function PostDetailsPage() {
  const { post } = useLoaderData<typeof loader>();

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
            <>
              <article className="my-4">
                <h2 className="text-4xl font-bold capitalize text-sky-400">
                  {post.title}
                </h2>
                <p className="my-6 text-lg text-slate-400">{post.content}</p>
              </article>

              <div className="my-10">
                <h4 className="text-3xl font-bold text-slate-300">Comments</h4>

                {post.comments.length > 0 ? (
                  <ul className="mt-2 space-y-3">
                    {post.comments.map((comment) => (
                      <li
                        key={comment.createdAt}
                        className="block space-y-1 rounded-md py-2 px-4"
                      >
                        <span className="flex items-center justify-between">
                          <span className="text-xs">
                            by{" "}
                            {`${comment.author.firstName} ${comment.author.lastName}`}
                          </span>
                        </span>
                        <p className="text-sm text-slate-500">{comment.text}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div>
                    <p className="text-base font-medium text-slate-500">
                      No one has commented yet.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </Await>
      </Suspense>
      {/* <div className="my-10">
        <h4 className="text-3xl font-bold text-slate-300">Comments</h4>
        <Suspense fallback={<CommentsSkeleton />}>
          <Await resolve={comments}>
            {(comments) => <Comments comments={comments} />}
          </Await>
        </Suspense>
      </div> */}
    </section>
  );
}
