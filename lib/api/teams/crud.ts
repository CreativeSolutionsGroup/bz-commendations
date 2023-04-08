import { Member, Team } from "@prisma/client";
import { prisma } from "../db";

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
    })
}

export const idToEmail = async (memberId: string) => {
    return (await prisma.member.findFirst({
        where: {
            id: memberId
        }
    }))?.email ?? "";
}

export type TimeRangeCommendations = {
    teams: {
        sentCommendations: number;
        commendations: number;
        id: string;
        name: string;
        imageURL: string | null;
        members: (Member & {
            commendations: {
                id: string;
            }[];
            sentCommendations: {
                id: string;
            }[];
        })[];
    }[],
    members: {
        sendMembers: (Member & {
            sentCommendations: {
                id: string;
            }[];
        })[];
        recvMembers: (Member & {
            commendations: {
                id: string;
            }[];
        })[];
    }
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
            commendations: {
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
            commendations: { _count: "desc" },
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
}