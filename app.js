process.env.DATABASE_URL = process.env.MYSQL_ADDON_URI;

// on Importe le framework
import Fastify from "fastify";
import { registerPostRoutes } from "./controllers/post.js";
import { registerAuthRoutes } from "./controllers/auth.js";
import FastifyCors from "@fastify/cors";
import fastifyAuth from "@fastify/auth";
import { registerAuthMiddlewares } from "./middlewares/auth.js";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";

const logger = {
  transport: {
    target: "pino-pretty",
    options: {
      translateTime: "HH:MM:ss Z",
      ignore: "pid.hostname",
      singleLine: true,
      colorize: true,
    },
  },
};

//on l'initialise avec des options
const fastify = Fastify({ logger });

// Enregistrer le plugin CORS
fastify.register(FastifyCors, {
  origin: process.env.NODE_ENV == "production" ? "example.com" : "*", // Autoriser toutes les origines (à modifier selon vos besoins)
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Définir les méthodes autorisées
});

// Enregistrer le plugin d'authentification
await fastify.register(fastifyAuth);

// On déclare le plugin Swagger pour la documentation
await fastify.register(fastifySwagger, {
  openapi: {
    components: {
      securitySchemes: {
        token: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
  },
});

await fastify.register(fastifySwaggerUi, {
  routePrefix: "/documentation",
  uiConfig: {
    docExpansion: "list",
  },
});

//On déclare notre première route
fastify.get("/", async function handler(request, reply) {
  return { hello: "world" };
});

//ajout avant de lancer le serveur
registerAuthMiddlewares(fastify);
registerPostRoutes(fastify);
registerAuthRoutes(fastify);

// Et on lance le serveur !
try {
  await fastify.listen({
    port: process.env.PORT || 3000,
    host: process.env.HOST || "localhost",
  });
  await fastify.ready();
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
