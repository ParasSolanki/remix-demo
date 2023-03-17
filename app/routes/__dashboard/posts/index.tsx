import { useRef, useState } from "react";
import classnames from "classnames";
import { type ActionArgs, json, type MetaFunction } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import * as Select from "@radix-ui/react-select";
import { createPost, postSchemas } from "~/models/post.model";
import { getPosts } from "~/models/post.model";
import { authenticator } from "~/services/auth.server";
import useAuthUser from "~/hooks/use-auth-user";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

export const meta: MetaFunction = () => ({
  title: "Posts",
  description: "List of all available posts",
});

export const loader = async () => {
  const posts = await getPosts();

  return json(
    { posts },
    {
      headers: {
        "Cache-Control": "max-age=60, stale-while-revalidate=120",
      },
    }
  );
};

export const action = async ({ request }: ActionArgs) => {
  await authenticator.isAuthenticated(request, { failureRedirect: "/" });

  const form = await request.formData();
  const action = form.get("action");

  if (typeof action !== "string" && !action) {
    return json(
      {
        okay: false,
        errors: { action: { message: "Action not defined" } },
      },
      { status: 400 }
    );
  }

  if (action === "create-post") {
    const result = postSchemas.CREATE.safeParse(Object.fromEntries(form));

    if (!result.success) {
      const formatedError = result.error.issues
        .map((issue) => ({
          [issue.path[0]]: { message: issue.message },
        }))
        .reduce((acc, issue) => Object.assign(acc, issue), {});

      return json({ okay: false, errors: formatedError }, { status: 400 });
    }

    const { error } = await createPost(result.data);

    if (error) {
      return json({ errors: error, okay: false } as const, { status: 400 });
    }

    return json({ okay: true } as const, { status: 201 });
  }

  return json({});
};

function NewPostForm(props: { onSuccess?: () => void }) {
  const user = useAuthUser();
  const formRef = useRef<HTMLFormElement>(null);
  const actionData = useActionData<typeof action>();

  const errors = actionData ? actionData.errors : {};
  const success = actionData ? actionData.okay === true : false;

  if (success && typeof props.onSuccess === "function") {
    formRef.current?.reset();
    props.onSuccess();
  }

  return (
    <Form
      ref={formRef}
      method="post"
      action="/posts"
      className="my-4 space-y-3"
    >
      <input type="hidden" name="authorId" value={user?.id} />
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-slate-300"
        >
          Title
        </label>
        <div className="mt-1">
          <input
            type="text"
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
            <span className="text-sm text-red-500">
              {errors?.title.message}
            </span>
          ) : null}
        </div>
      </div>
      <div>
        <label
          htmlFor="slug"
          className="block text-sm font-medium text-slate-300"
        >
          Slug
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="slug"
            name="slug"
            className={classnames(
              "mt-1 block w-full rounded-md border-2 border-slate-700 bg-slate-800/90 p-3 text-slate-200 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm",
              {
                "focus:border-red-500": errors?.slug,
              }
            )}
            placeholder="Post slug goes here..."
            defaultValue={""}
          />
          {errors?.slug ? (
            <span className="text-sm text-red-500">{errors?.slug.message}</span>
          ) : null}
        </div>
      </div>
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-slate-300"
        >
          Content
        </label>
        <div className="mt-1">
          <textarea
            id="content"
            name="content"
            rows={3}
            className={classnames(
              "mt-1 block w-full rounded-md border-2 border-slate-700 bg-slate-800/90 p-3 text-slate-200 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm",
              {
                "focus:border-red-500": errors?.content,
              }
            )}
            placeholder="Post content goes here..."
            defaultValue={""}
          />
          {errors?.content ? (
            <span className="text-sm text-red-500">
              {errors?.content.message}
            </span>
          ) : null}
        </div>
      </div>
      <button
        type="submit"
        name="action"
        value="create-post"
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
  const [postFilter, setPostsFilter] = useState("");

  const publishedPosts = posts.filter((post) => post.publishedAt);
  const unpublishedPosts = posts.filter((post) => !post.publishedAt);

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

      <div className="mt-4" id="container">
        <Select.Root
          value={postFilter}
          onValueChange={(val) => setPostsFilter(val)}
        >
          <Select.Trigger
            className="inline-flex h-9 w-28 items-center justify-between gap-[5px] rounded border-2 border-slate-700 bg-slate-800 px-3 text-sm leading-none text-slate-300 outline-none hover:bg-slate-800/50 focus:border-sky-400 focus:outline-none data-[placeholder]:text-slate-700 "
            aria-label="Posts filter"
          >
            <Select.Value placeholder="Select a Filter" />
            <Select.Icon className="flex h-full items-center">
              <ChevronDownIcon className="h-4 w-4" />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal className="w-full">
            <Select.Content
              className="w-28 rounded-sm bg-slate-800 py-1 shadow-md"
              position="popper"
              sideOffset={10}
            >
              <Select.Viewport>
                <Select.Group className="w-full">
                  <Select.Item
                    value="Published"
                    className="relative flex select-none items-center py-3 px-6 leading-none text-slate-300 hover:bg-slate-900 hover:text-slate-300 hover:outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-slate-900 data-[disabled]:text-slate-300/30 data-[highlighted]:text-sky-400 data-[highlighted]:outline-none"
                  >
                    <Select.ItemText>Published</Select.ItemText>
                    <Select.ItemIndicator className="absolute left-0 inline-flex w-6 items-center justify-center">
                      <CheckIcon className="h-4 w-4" />
                    </Select.ItemIndicator>
                  </Select.Item>
                  <Select.Item
                    value="Draft"
                    className="relative flex select-none items-center py-3 px-6 leading-none text-slate-300 hover:bg-slate-900 hover:text-slate-300 hover:outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-slate-900 data-[disabled]:text-slate-300/30 data-[highlighted]:text-sky-400 data-[highlighted]:outline-none"
                  >
                    <Select.ItemText>Draft</Select.ItemText>
                    <Select.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
                      <CheckIcon className="h-4 w-4" />
                    </Select.ItemIndicator>
                  </Select.Item>
                </Select.Group>
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>

      {isNewPostFormOpen && (
        <NewPostForm onSuccess={() => setIsNewPostFormOpen(false)} />
      )}

      <div className="mt-4 space-y-4">
        <div className="">
          <h5 className="mb-4 text-3xl font-semibold text-slate-300">
            Published Posts
          </h5>
          {publishedPosts.length > 0 ? (
            <ul className="space-y-3">
              {posts.map((post) => (
                <li key={post.id}>
                  <Link
                    to={`/posts/${post.slug}`}
                    className="block space-y-2 rounded-md p-4 hover:bg-slate-800/70"
                  >
                    <span className="text-2xl font-semibold leading-tight text-sky-500">
                      {post.title}
                    </span>
                    <p className="text-sm text-slate-500">{post.content}</p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-2">
              <p className="text-base font-medium">
                You have not published any posts yet!
              </p>
            </div>
          )}
        </div>
        <div className="">
          <h5 className="mb-4 text-3xl font-semibold text-slate-300">
            Unpublished Posts
          </h5>
          {unpublishedPosts.length > 0 ? (
            <ul className="space-y-3">
              {posts.map((post) => (
                <li
                  key={post.id}
                  className="block space-y-2 rounded-md p-4 hover:bg-slate-800/70"
                >
                  <span className="text-2xl font-semibold leading-tight text-sky-500">
                    {post.title}
                  </span>
                  <p className="text-sm text-slate-500">{post.content}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-2">
              <p className="text-base font-medium">
                You have not published any posts yet!
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
