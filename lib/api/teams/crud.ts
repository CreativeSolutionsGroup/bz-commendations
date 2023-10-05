import { prisma } from "@/lib/api/db";
import {
  TimeRangeCommendations
} from "@/types/commendation";

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
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });
};

export const idToEmail = async (memberId: string) => {
  return (
    (
      await prisma.member.findFirst({
        where: {
          id: memberId,
        },
      })
    )?.email ?? ""
  );
};

export const getTimeRangeCommendations = async (dateRange: {
  createdAt: { gte: Date; lte: Date };
}): Promise<TimeRangeCommendations> => {
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
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  const recvMembers = await prisma.member.findMany({
    where: {
      commendations: {
        some: {},
      },
    },
    include: {
      commendations: {
        where: dateRange,
        select: { id: true },
      },
    },
    orderBy: {
      commendations: { _count: "desc" },
    },
  });

  const sendMembers = await prisma.member.findMany({
    where: {
      sentCommendations: {
        some: {},
      },
    },
    include: {
      sentCommendations: {
        where: dateRange,
        select: { id: true },
      },
    },
    orderBy: {
      sentCommendations: { _count: "desc" },
    },
  });

  return {
    teams: teams.map((current) => ({
      ...current,
      sentCommendations: current.members.reduce((prev, curr) => prev + curr.sentCommendations.length,
        0),
      commendations: current.members.reduce((prev, curr) => prev + curr.commendations.length,
        0),
    })),
    members: {
      sendMembers,
      recvMembers,
    },
  };
};

// Gets the commendations with all their information
export const getTeamCommendationsInRange = async (
  id: string,
  firstDate: Date,
  secondDate: Date
) => {
  // Get the commendations sent by all users of the team
  const sentComms = await prisma.commendation.findMany({
    where: {
      // AND case for created date and user team
      AND: [
        {
          createdAt: {
            gte: firstDate,
            lte: secondDate,
          },
        },
        {
          sender: { teams: { some: { id } } },
        },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      recipient: true,
      sender: true,
    },
  });

  // Get the commendations received by the team
  const recvComms = await prisma.commendation.findMany({
    where: {
      // And case for recipient and created date
      AND: [
        { createdAt: { gte: firstDate, lte: secondDate } },
        { recipient: { teams: { some: { id } } } },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      recipient: true,
      sender: true,
    },
  });

  // Return the list of commendations
  return { sentComms, recvComms };
};

export const getTeam = async (id: string) => {
  const team = await prisma.team.findFirst({
    where: {
      id,
    },
  });

  return team;
};
