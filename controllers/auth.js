import { AuthRepository } from "../repositories/auth.js";
import { SignupDto, LoginDto, UserResponseDto } from "../dtos/AuthDtos.js";
import JWT from "jsonwebtoken";
import { createHash } from "crypto";

export function registerAuthRoutes(fastify) {
  fastify.post(
    "/signup",
    {
      schema: {
        body: SignupDto,
      },
    },
    async function signUp(request, reply) {
      const body = request.body;
      // créé un objet de hashage utilisant l'algorithme SHA-1 (fonction de hashage cryptographique)
      body.password = createHash("sha1")
        // Concatène le mdp en clair avec un "sel"(salt) secret stocké dans les variables d'environnement
        //Le sel est Le sel est une chaîne de caractères aléatoire qui rend le hash unique même si deux utilisateurs ont le même mot de passe
        //Ajoute une combinaison au processus de hashage
        .update(body.password + process.env.PASSWORD_SECRET_SALT)
        // finalaise le hashage et convertit le réultat en format Hexadécimal
        .digest("hex");
      const user = await AuthRepository.createUser(body);
      return new UserResponseDto(user);
    }
  );

  fastify.post(
    "/login",
    {
      schema: {
        body: LoginDto,
      },
    },
    async function login(request, reply) {
      const body = request.body;
      body.password = createHash("sha1")
        .update(body.password + process.env.PASSWORD_SECRET_SALT)
        .digest("hex");
      const user = await AuthRepository.getUserByCredentials(
        body.email,
        body.password
      );
      if (!user) {
        throw new Error("Invalid credentials");
      }
      // On crée le token
      user.token = JWT.sign({ id: user.id }, process.env.JWT_SECRET);
      const { password, ...UserResponse } = user;
      return UserResponse;
    }
  );
}
