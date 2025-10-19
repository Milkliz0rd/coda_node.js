import { prisma } from "../services/db.js";

export const AuthRepository = {
  getUserByCredentials: async (email, password) => {
    const foundUser = await prisma.user.findFirst({
      where: {
        email: email,
        password: password,
      },
    });
    if (!foundUser) {
      throw new Error("User not Found");
    }
    return foundUser;
  },

  createUser: async (user) => {
    const newUser = await prisma.user.create({
      data: user,
    });
    return newUser;
  },

  getUserById: async (id) => {
    const userById = await prisma.user.findFirst({
      where: {
        id: id,
      },
    });
    return userById;
  },
};
