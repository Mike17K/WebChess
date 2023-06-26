import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()
prisma.$connect()



export async function profileTokenValidation({ profileId, token }) {
  const user = await findUser({
    where: { id: profileId },
    include: { accessTokens: { where: { token: token } } },
  });

  return user !== null;
}

export async function getProfile({ profileId, userMode }) {
  if (userMode === "OWNER") {
    const user = await prisma.user.findFirst({
      where: { id: profileId },
      include: { profile: true },
    });
    const response = { name: user.profile.profilename, email: user.profile.email, id: user.id, picture: user.profile.picture, authProvider: user.authProvider };
    return response;
  }
  return {};
}

export async function deleteToken(userId, token) {
  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      accessTokens: {
        deleteMany: [{ token: token }],
      },
    },
    include: {
      accessTokens: true,
    },
  })

  return result ? 200 : 400;
}

export async function setToken(userId, access_server_key, ttl) {
  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      accessTokens: {
        create: { token: access_server_key, expired: new Date(Date.now() + ttl) },
      },
    },
    include: {
      accessTokens: true,
    },
  });
  return result !== null;
}

export async function findUser(query) {
  const user = await prisma.user.findFirst(query);
  return user;
}

export async function createUser({ username, password, salt, authProvider }) {
  const user = await prisma.user.create({
    data: {
      username: username,
      password: password,
      salt: salt,
      authProvider: authProvider
    },
  });
  return user;
}

export async function createProfile({ profilename, userId }) {
  const profile = await prisma.profile.create({
    data: {
      profilename: profilename,
      user: {
        connect: { id: userId },
      },
    },
  });

  return profile;
}


