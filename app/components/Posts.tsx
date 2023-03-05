import { Link } from "@remix-run/react";
import type { Post } from "~/types";

export function BlogPosts({ posts }: { posts: Post[] }) {
  return (
    <ul className="mt-4 space-y-3">
      {posts.map((post) => (
        <li key={post.id}>
          <Link
            to={`/posts/${post.id}`}
            className="block space-y-2 rounded-md p-4 hover:bg-slate-800/70"
          >
            <span className="text-2xl font-semibold leading-tight text-sky-500">
              {post.title}
            </span>
            <p className="text-sm text-slate-500">{post.body}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function BlogPostSkeleton() {
  return (
    <ul className="mt-2 space-y-3">
      {new Array(10).fill(0).map((_, index) => (
        <li
          key={index}
          className="block animate-pulse space-y-4 rounded-md px-4 py-5"
        >
          <p className="block h-6 w-3/4 rounded-md bg-slate-700"></p>

          <span className="block h-3 rounded-md bg-slate-800"></span>
          <span className="block h-3 w-2/4 rounded-md bg-slate-800"></span>
        </li>
      ))}
    </ul>
  );
}
