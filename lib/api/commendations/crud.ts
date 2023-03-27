import { prisma } from "@/lib/api/db";
import { Member } from "@prisma/client";

export const idToName = async (studentId: string) => {
  const student = await prisma.member.findFirst({ where: { id: studentId } });

  if (!student) {
    return "";
  }

  const { name } = student;

  return name as string;
}

export const emailToId = async (sender: string) => {
  const member = await prisma.member.findFirst({ where: { email: sender } });

  if (!member) {
    return;
  }

  const { id } = member;

  return id as string
}

export const createCommendation = async (sender: string, recipient: string, msg: string) => {
  return await prisma.commendation.create({
    data: {
      sender: {
        connect: {
          id: sender
        }
      },
      recipient: {
        connect: {
          id: recipient
        }
      },
      message: msg
    }
  });
}

export const readAllCommendations = async () => {
  return await prisma.commendation.findMany()
}

export const readAllMembers = async (currentUserEmail = "") => {
  return await prisma.member.findMany({
    where: {
      NOT: {
        email: currentUserEmail
      }
    },
    include: {
      teams: true
    },
    orderBy: {
      name: "asc"
    }
  })
}

export const updateMemberImageURL = async (image: string, id: string) => {
  return await prisma.member.update({
    data: {
      imageURL: image
    },
    where: {
      id
    }
  })
}

export const readUserCommendations = async (email: string) => {
  const user = await prisma.member.findFirst({
    select: {
      commendations: {
        select: {
          sender: {
            select: {
              name: true,
              imageURL: true
            }
          },
          message: true
        }
      }
    },
    where: {
      email
    }
  });
  return user?.commendations;
}

export const readUserSentCommendations = async (email: string) => {
  const user = await prisma.member.findFirst({
    select: {
      sentCommendations: {
        select: {
          recipient: {
            select: {
              name: true,
              imageURL: true
            }
          },
          message: true
        }
      }
    },
    where: {
      email
    }
  });
  return user?.sentCommendations;
}

export const getMemberTeamLeaders = async (teams: string[]) => {
  const m = await prisma.member.findMany({
    where: {
      teams: {
        some: {
          id: { in: teams }
        }
      }
    },
    include: {
      teams: {
        include: {
          teamLeaders: {
            include: {
              member: true
            }
          }
        }
      }
    }
  });

  // reduces `m` (all members that have team leaders)
  // to their team leaders Member objects.
  return m.reduce((curr, l) => {
    const leads: Array<Member> = l.teams.flatMap(t => t.teamLeaders.map(tl => tl.member));
    // array intersection
    const rem = leads.filter(l => !curr.map(c => c.id).includes(l.id));
    return [...curr, ...rem];
  }, [] as Array<Member>);
}

export const getMemberWithTeams = async (id: string) => {
  return await prisma.member.findFirst({
    where: {
      id
    },
    include: {
      teams: true
    }
  })
}

export const idIsMember = async (id: string) => {
  return !!await prisma.member.count({
    where: {
      id
    }
  });
}