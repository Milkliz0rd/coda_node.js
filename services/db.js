import { PrismaClient } from "../generated/prisma/index.js";

//Connect to db using .env config
let client = new PrismaClient();
console.log("[DEBUG] connected to db");

//Returns a PrismClient instance that is cached
export const prisma = client;
