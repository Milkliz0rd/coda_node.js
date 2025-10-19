import { AuthRepository } from "../repositories/auth.js";
import JWT from "jsonwebtoken";

export function registerAuthMiddlewares(fastify) {
  // on ajoute à fastify(on décore) une nouvelle méthode appelée "authUser". On pourras l'utiliser de cette façons "fastify.authUser" sur nos routes qui auronts besoin d'un token pour être utilisée.
  fastify.decorate("authUser", async function (request, reply) {
    // On récupère le bearer dans le headers de la requête http. Cependant il arrive sous forme "bearer eyJhjdks..."
    const authHeader = request.headers["authorization"];
    if (!authHeader) {
      reply.code(401).send({ error: "Token not found" });
      return;
    }
    // On transforme le bearer afin d'enlever le préfixe "bearer" du token.
    const token = authHeader.replace("Bearer ", "");
    // On vérifie la signature du token avec notre secret. Si token valide, "JWT.verify()" nous retourne le payload (le contenu du token, comme { id: 5, iat: ... }).
    try {
      const payload = JWT.verify(token, process.env.JWT_SECRET);
      // On récupère l'user au complet dans notre BDD grâce à l'ID contenu dans le token.
      const user = await AuthRepository.getUserById(payload.id);
      //Si l'utilisateur n'existe pas/plus dans la BDD (peut-être supprimé entre temps), on renvoie une erreur 404.
      if (!user) {
        reply.code(404).send({ error: "User not found" });
        return;
      }
      // /!\ IMPORTANT /!\ On attache l'utilisateur à request.user car quand on va créer, modifier ou supprimer des postes, on veut que ça soit l'utilisateur authentifié qui soit relié aux actions.
      request.user = user;
    } catch (err) {
      reply.code(401).send({ error: "Invalid token" });
      return;
    }
  });
}
