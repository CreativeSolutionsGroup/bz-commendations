import { Member, Team } from "@prisma/client";
import { prisma } from "../db";

export const getTeams = async () => {
    return await prisma.team.findMany({
        include: {
            members: {
                include: {
                    commendations: { select: { id: true } },
                    sentCommendations: { select: { id: true } }
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

export const getLastMonthCommendations = async () => {
    const lastMonth = new Date(Date.now());
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    if (lastMonth.getMonth() < 0) {
        lastMonth.setMonth(12);
    }
    lastMonth.setDate(1);
    lastMonth.setHours(0, 0, 0);

    const thisMonth = new Date(Date.now());
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0);

    const teams = await prisma
        .team
        .findMany({
            select: {
                members: {
                    select: {
                        sentCommendations: {
                            where: {
                                createdAt: {
                                    gte: lastMonth,
                                    lte: thisMonth
                                }
                            },
                            select: { id: true }
                        }
                    }
                }
            }, orderBy: { name: "asc" }
        });

    return teams.reduce((previous, current) => {
        previous += current.members.reduce((previousCommendationsCount, currentMember) => {
            return previousCommendationsCount + currentMember.sentCommendations.length;
        }, 0)
        return previous;
    }, 0);
}

export const getThisMonthCommendations = async () => {
    const thisMonth = new Date(Date.now());
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0);

    const teams = await prisma
        .team
        .findMany({
            select: {
                members: {
                    select: {
                        sentCommendations: {
                            where: {
                                createdAt: {
                                    gte: thisMonth
                                }
                            },
                            select: { id: true }
                        }
                    }
                }
            }, orderBy: { name: "asc" }
        });

    return teams.reduce((previous, current) => {
        previous += current.members.reduce((previousCommendationsCount, currentMember) => {
            return previousCommendationsCount + currentMember.sentCommendations.length;
        }, 0)
        return previous;
    }, 0);
}