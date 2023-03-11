import { z } from "zod";
import { prisma } from "~/utils/prisma";

const createPostSchema = z.object({
  title: z.string().min(2, "Title must contain at least 2 character(s)"),
  slug: z.string().min(1, "Slug must contain at least 2 character(s)"),
  content: z.string().min(5, "Content must contain at least 2 character(s)"),
  authorId: z.string().cuid(),
});

export const postSchemas = {
  CREATE: createPostSchema,
};

export async function getPosts() {
  try {
    return await prisma.post.findMany({
      where: { publishedAt: null },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    throw e;
  }
}

export async function createPost(data: z.infer<typeof createPostSchema>) {
  try {
    const user = await prisma.user.findFirst({
      where: { id: data.authorId },
    });

    if (!user) return { data: undefined, error: "User does not exists" };

    const post = await prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        slug: data.slug,
        authorId: data.authorId,
      },
    });
    return { data: post, error: undefined };
  } catch (e) {
    throw { data: undefined, error: e };
  }
}
