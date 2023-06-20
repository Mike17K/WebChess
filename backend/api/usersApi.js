import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()
prisma.$connect()



export async function profileTokenValidation({profileId,token}){
    const user = await findUser({
        where: { id: profileId },
        include: { accessTokens: { where: { token: token } } },
      });
      
    return user !== null;
}

export async function getProfile({profileId,userMode}){
    if(userMode==="OWNER"){
        const user = await prisma.user.findFirst({
            where: { id: profileId }
          });
        const response = {name:user.name,email:user.email,id:user.id,picture:user.picture,authProvider:user.authProvider};
        return response;
    }
    return {};
}

export async function deleteToken(userId,token){
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

    return result?200:400;
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
    return result!==null;
  }
  
export async function findUser(query) {
    const user = await prisma.user.findFirst(query);
    return user;
  }
