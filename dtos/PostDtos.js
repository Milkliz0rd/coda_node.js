// DTO pour créer un post
export const CreatePostDto = {
  type: "object",
  required: ["title", "content"],
  properties: {
    title: {
      type: "string",
      minLength: 1,
      maxLength: 80,
    },
    content: {
      type: "string",
      minLength: 3,
      maxLength: 500,
    },
  },
};

// DTO pour mettre à jour un post
export const UpdatePostDto = {
  type: "object",
  required: ["title", "content"],
  properties: {
    title: {
      type: "string",
      minLength: 1,
      maxLength: 80,
    },
    content: {
      type: "string",
      minLength: 3,
      maxLength: 500,
    },
  },
};

// DTO pour valider l'ID dans l'URL
export const PostIdDto = {
  type: "object",
  required: ["id"],
  properties: {
    id: {
      type: "integer",
      minimum: 1,
    },
  },
};
