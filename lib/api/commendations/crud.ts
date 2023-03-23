import { prisma } from "@/lib/api/db";

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

export const getMemberTeamLeaders = async (teams: string[]) => {
  return await prisma.member.findMany({
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
          TeamLeaders: {
            distinct: "id",
            include: {
              Member: true
            }
          }
        }
      }
    }
  });
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
