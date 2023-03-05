import { defer, type LoaderArgs } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { getUserTodos } from "~/models/user";

export async function loader({ params }: LoaderArgs) {
  const todos = getUserTodos(params.userId);

  return defer(
    {
      todos,
    },
    {
      headers: {
        "Cache-Control": "max-age=300, stale-while-revalidate=60",
      },
    }
  );
}

export default function UserTodosPage() {
  const { todos } = useLoaderData<typeof loader>();

  return (
    <Suspense fallback="loading...">
      <Await resolve={todos}>
        {(todos) => (
          <ul className="flex flex-col space-y-4">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center space-x-3 leading-normal"
              >
                <input
                  type="checkbox"
                  defaultChecked={todo.completed}
                  readOnly
                  disabled
                  className="h-4 w-4 rounded border-slate-700 bg-slate-600 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                />
                <span className="flex-grow">{todo.title}</span>
              </li>
            ))}
          </ul>
        )}
      </Await>
    </Suspense>
  );
}
