import { defer, type LoaderArgs } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { getUserAlbums } from "~/models/user";

export async function loader({ params }: LoaderArgs) {
  const albums = getUserAlbums(params.userId!);

  return defer(
    {
      albums,
    },
    {
      headers: {
        "Cache-Control": "max-age=300, stale-while-revalidate=60",
      },
    }
  );
}

export default function UserAlbumsPage() {
  const { albums } = useLoaderData<typeof loader>();

  return (
    <Suspense fallback="loading...">
      <Await resolve={albums}>
        {(albums) => (
          <ul className="flex flex-col space-y-4">
            {albums.map((album) => (
              <li key={album.id}>{album.title}</li>
            ))}
          </ul>
        )}
      </Await>
    </Suspense>
  );
}
