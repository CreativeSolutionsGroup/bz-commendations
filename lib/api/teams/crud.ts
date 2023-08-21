import { CommendationWithPeople, TimeRangeCommendations } from "@/types/commendation";
import { prisma } from "@/lib/api/db";

export const getTeams = async () => {
  return await prisma.team.findMany({
    include: {
      members: {
        include: {
          commendations: {
            select: { id: true },
            orderBy: { createdAt: "asc" },
          },
          sentCommendations: {
            select: { id: true },
            orderBy: { createdAt: "asc" },
          }
        }
      }
    },
    orderBy: { name: "asc" }
  });
};

export const idToEmail = async (memberId: string) => {
  return (await prisma.member.findFirst({
    where: {
      id: memberId
    }
  }))?.email ?? "";
};

export const getTimeRangeCommendations = async (dateRange: { createdAt: { gte: Date, lte: Date } }): Promise<TimeRangeCommendations> => {
  const teams = await prisma.team.findMany({
    include: {
      members: {
        include: {
          sentCommendations: {
            where: dateRange,
            select: { id: true },
          },
          commendations: {
            where: dateRange,
            select: { id: true },
          }
        }
      },
    },
    orderBy: { name: "asc" },
  });

  const recvMembers = await prisma.member.findMany({
    where: {
      commendations: {
        some: {}
      }
    },
    include: {
      commendations: {
        where: dateRange,
        select: { id: true },
      },
    },
    orderBy: {
      commendations: { _count: "desc" },
    }
  });

  const sendMembers = await prisma.member.findMany({
    where: {
      sentCommendations: {
        some: {}
      }
    },
    include: {
      sentCommendations: {
        where: dateRange,
        select: { id: true },
      },
    },
    orderBy: {
      sentCommendations: { _count: "desc" },
    }
  });

  return {
    teams: teams.map((current) => ({
      ...current,
      sentCommendations: current.members.reduce((prev, curr) => prev + curr.sentCommendations.length, 0),
      commendations: current.members.reduce((prev, curr) => prev + curr.commendations.length, 0),
    })),
    members: {
      sendMembers,
      recvMembers,
    }
  };
};

export const getTeamCommendations = async (id: string) => {
  const team = await prisma.team.findFirst({
    where: {
      id
    }, 
    include: {
      members: {
        include: {
          sentCommendations: {
            include: {
              sender: true,
              recipient: true
            }
          },
          commendations: {
            include: {
              sender: true,
              recipient: true
            }
          }
        }
      }
    }
  });

  if (team) {
    return {
      recvComms: team.members.reduce((prev, curr) => prev.concat(curr.commendations), [] as Array<CommendationWithPeople>).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
      sentComms: team.members.reduce((prev, curr) => prev.concat(curr.sentCommendations), [] as Array<CommendationWithPeople>).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    };
  }
  return {
    recvComms: [],
    sentComms: []
  };
};

export const getTeam = async (id: string) => {
  const team = await prisma.team.findFirst({
    where: {
      id
    }
  });
  
  return team;
};