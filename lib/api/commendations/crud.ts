import { prisma } from "@/lib/api/db";
import { Member } from "@prisma/client";

/**
 * THIS FUNCTION DOES NOT APPEAR TO BE USED ANYWHERE WITHIN THE PROGRAM
 * 
 * This function returns the name of the student whose id is provided
 * @param studentId A string which represents the id associated with a student
 * @returns The name associated with the provided id as a string or an empty string if the id is not found
 */
export const idToName = async (studentId: string) => {
  const student = await prisma.member.findFirst({ where: { id: studentId } });

  if (!student) {
    return "";
  }

  const { name } = student;

  return name as string;
};


/**
 * This gets the id of the member whose email was provided
 * @param sender An email address of the person you want the id for. This it is a string
 * @returns The id of the member with the provided email address or nothing if no member is found
 */
export const emailToId = async (sender: string) => {
  const member = await prisma.member.findFirst({ where: { email: sender } });

  if (!member) {
    return;
  }

  const { id } = member;

  return id as string;
};


/**
 * 
 * @param sender 
 * @param recipient 
 * @param msg 
 * @returns 
 */
export const createCommendation = async (
  sender: string, recipient: string, msg: string
) => {
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
};


/**
 * This gets all of the Commendations that have been sent
 * @returns A list of all Commendations in `Commendation[]` format
 */
export const readAllCommendations = async () => {
  return await prisma.commendation.findMany();
};


/**
 * 
 * @param currentUserEmail 
 * @returns 
 */
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
  });
};


/**
 * 
 * @param image 
 * @param id 
 * @returns 
 */
export const updateMemberImageURL = async (image: string, id: string) => {
  return await prisma.member.update({
    data: {
      imageURL: image
    },
    where: {
      id
    }
  });
};


/**
 * 
 * @param email 
 * @returns 
 */
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
};


/**
 * 
 * @param email 
 * @returns 
 */
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
};


/**
 * The function name here is misleading.
 * This gets all of the team leaders for a given team.
 * @param teams A list of the teams that you want to get the team leaders for. This is an id.
 * @returns A list of the team leaders in `Member[]` format.
 */
export const getMemberTeamLeaders = async (teams: string[]) => {
  const teamLeaders = await prisma.teamLeaders.findMany({
    where: {
      team: {
        id: { in: teams }
      }
    },
    select: {
      member: true
    }
  });

  return teamLeaders.map(l => l.member);
};


/**
 * 
 * @param id 
 * @returns 
 */
export const getMemberWithTeams = async (id: string) => {
  return await prisma.member.findFirst({
    where: {
      id
    },
    include: {
      teams: true
    }
  });
};


/**
 * 
 * @param id 
 * @returns 
 */
export const idIsMember = async (id: string) => {
  return !!await prisma.member.count({
    where: {
      id
    }
  });
};


/**
 * 
 * @param id 
 * @returns 
 */
export const getMemberImage = async (id: string) => {
  const image = await prisma.member.findFirst({
    select: {
      imageURL: true
    },
    where: {
      id
    }
  });

  return image?.imageURL;
};