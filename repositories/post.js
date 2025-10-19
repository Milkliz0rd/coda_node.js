import { prisma } from "../services/db.js";

export const PostRepository = {
  //Tous les posts
  getPosts: async (page, limit) => {
    const posts = await prisma.post.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
    return posts;
  },
  //Un seul post
  getPost: async (id) => {
    const postById = await prisma.post.findFirst({
      where: {
        id: id,
      },
    });
    if (!postById) {
      throw new Error("Post not found");
    }
    return postById;
  },
  //Créer un post
  createPost: async (post) => {
    const newPost = await prisma.post.create({
      data: post,
    });
    return newPost;
  },
  //Maj un post
  updatePost: async (id, post) => {
    const oldpost = await prisma.post.findFirst({
      where: {
        id: id,
      },
    });
    if (!oldpost) {
      throw new Error("Post not found");
    }
    const newPost = await prisma.post.update({
      where: {
        id: id,
      },
      data: post,
    });
    return newPost;
  },
  //Supprimer un post
  deletePost: async (id) => {
    const deletePost = await prisma.post.delete({
      where: {
        id: id,
      },
    });
    return deletePost;
  },
};
