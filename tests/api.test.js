// tests/api.test.js
import { test, expect, beforeEach } from "vitest";
import { PrismaClient } from "../generated/prisma/index.js";
import Fastify from "fastify";
import { registerAuthRoutes } from "../controllers/auth.js";

const prisma = new PrismaClient();
let app;

beforeEach(async () => {
  app = Fastify({ logger: false });
  registerAuthRoutes(app);
  await app.ready();
  await prisma.user.deleteMany({});
});

test("POST /signup", async () => {
  const res = await app.inject({
    method: "POST",
    url: "/signup",
    payload: {
      email: "johndoe@gmail.com",
      password: "password123",
    },
  });

  const data = res.json();
  expect(res.statusCode).toBe(200);
  expect(data).toHaveProperty("id");
  expect(data.email).toBe("johndoe@gmail.com");
  expect(data).not.toHaveProperty("password");
});
