// DTO pour l'inscription
export const SignupDto = {
  type: "object",
  required: ["email", "password"],
  properties: {
    email: {
      type: "string",
      format: "email",
    },
    password: {
      type: "string",
      minLength: 8,
    },
  },
};

// DTO pour la connexion
export const LoginDto = {
  type: "object",
  required: ["email", "password"],
  properties: {
    email: {
      type: "string",
      format: "email",
    },
    password: {
      type: "string",
    },
  },
};

export class UserResponseDto {
  constructor(user) {
    this.id = user.id;
    this.email = user.email;
    this.username = user.username;
    this.createdAt = user.createdAt;
    // On n'inclut PAS le password !
  }
}
