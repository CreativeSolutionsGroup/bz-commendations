import { prisma } from "@/lib/api/db";

export const getMembersWithSentCommendations = async () => {
  return await prisma.member.findMany({
    where: {
      sentCommendations: {
        some: {}
      }
    },
    include: {
      sentCommendations: {
        select: {
          id: true
        }
      },
    }
  });
};

export const getMembersWithReceivedCommendations = async () => {
  return await prisma.member.findMany({
    where: {
      commendations: {
        some: {}
      }
    },
    include: {
      commendations: {
        select: {
          id: true
        }
      },
    }
  });
};