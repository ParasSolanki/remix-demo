import classnames from "classnames";
import { Suspense, useState } from "react";
import {
  type ActionArgs,
  redirect,
  defer,
  json,
  type MetaFunction,
} from "@remix-run/node";
import { Await, Form, useActionData, useLoaderData } from "@remix-run/react";
import { createPost, getPosts } from "~/models/post";
import { BlogPosts, BlogPostSkeleton } from "~/components/Posts";

export const meta: MetaFunction = () => ({
  title: "Posts",
  description: "List of all available posts from jsonplaceholder API",
});

export const loader = async () => {
  const posts = getPosts();

  return defer(
    { posts },
    {
      headers: {
        "Cache-Control": "max-age=300, stale-while-revalidate=60",
      },
    }
  );
};

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();

  const title = form.get("title");
  const body = form.get("body");
  const errors = {} as { title?: string; body?: string };

  if (typeof title !== "string" || !title) {
    errors["title"] = "title is required";
  }

  if (typeof body !== "string" || !title) {
    errors["body"] = "body is required";
  }

  if (Object.keys(errors).length) {
    return json(errors, { status: 400 });
  }

  await createPost({
    title,
    body,
    userId: 1,
  });

  return redirect("/");
};

function NewPostForm() {
  const errors = useActionData<typeof action>();

  return (
    <Form method="post" className="my-4 space-y-3">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-slate-300"
        >
          Title
        </label>
        <div className="mt-1">
          <input
            type={"text"}
            id="title"
            name="title"
            className={classnames(
              "mt-1 block w-full rounded-md border-2 border-slate-700 bg-slate-800/90 p-3 text-slate-200 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm",
              {
                "focus:border-red-500": errors?.title,
              }
            )}
            placeholder="Post title goes here..."
            defaultValue={""}
          />
          {errors?.title ? (
            <span className="text-sm text-red-500">{errors.title}</span>
          ) : null}
        </div>
      </div>
      <div>
        <label
          htmlFor="body"
          className="block text-sm font-medium text-slate-300"
        >
          Body
        </label>
        <div className="mt-1">
          <textarea
            id="body"
            name="body"
            rows={3}
            className={classnames(
              "mt-1 block w-full rounded-md border-2 border-slate-700 bg-slate-800/90 p-3 text-slate-200 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm",
              {
                "focus:border-red-500": errors?.body,
              }
            )}
            placeholder="Post body goes here..."
            defaultValue={""}
          />
          {errors?.body ? (
            <span className="text-sm text-red-500">{errors.body}</span>
          ) : null}
        </div>
      </div>
      <button
        type="submit"
        className="highlight-white/20 flex w-full items-center justify-center rounded-lg border-2 border-sky-400 px-4 py-1.5 text-sm font-semibold text-sky-400 hover:bg-sky-400 hover:text-white focus:bg-sky-400 focus:text-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-900 sm:w-auto"
      >
        Add
      </button>
    </Form>
  );
}

export default function PostsPage() {
  const { posts } = useLoaderData<typeof loader>();
  const [isNewPostFormOpen, setIsNewPostFormOpen] = useState(false);

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-5xl font-bold text-white">Posts</h2>
        <button
          type="button"
          className="highlight-white/20 flex items-center justify-center rounded-lg bg-sky-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-900 "
          onClick={() => setIsNewPostFormOpen((prev) => !prev)}
        >
          {isNewPostFormOpen ? "Close" : "New"}
        </button>
      </div>

      {isNewPostFormOpen && <NewPostForm />}

      <Suspense fallback={<BlogPostSkeleton />}>
        <Await resolve={posts}>{(posts) => <BlogPosts posts={posts} />}</Await>
      </Suspense>
    </section>
  );
}
