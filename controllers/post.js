import { CreatePostDto, PostIdDto, UpdatePostDto } from "../dtos/PostDtos.js";
import { PostRepository } from "../repositories/post.js";

export function registerPostRoutes(fastify) {
  fastify.get("/posts", async function getPosts(request, reply) {
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 10;
    return await PostRepository.getPosts(page, limit);
  });

  // Un post spécifique
  fastify.get(
    "/posts/:id",
    {
      schema: {
        params: PostIdDto,
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      return PostRepository.getPost(id);
    }
  );

  // Créer un post
  fastify.post(
    "/posts",
    {
      preHandler: fastify.auth([fastify.authUser]),
      schema: {
        body: CreatePostDto,
      },
    },
    async (request, reply) => {
      const post = request.body;
      return PostRepository.createPost(post);
    }
  );

  // Modifier un post
  fastify.put(
    "/posts/:id",
    {
      preHandler: fastify.auth([fastify.authUser]),
      schema: {
        params: PostIdDto,
        body: UpdatePostDto,
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const post = request.body;
      return PostRepository.updatePost(id, post);
    }
  );

  // Supprimer un post
  fastify.delete(
    "/posts/:id",
    {
      preHandler: fastify.auth([fastify.authUser]),
      schema: {
        params: PostIdDto,
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      return PostRepository.deletePost(id);
    }
  );
}
