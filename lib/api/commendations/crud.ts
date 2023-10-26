import { prisma } from "@/lib/api/db";

/**
 * THIS FUNCTION DOES NOT APPEAR TO BE USED ANYWHERE WITHIN THE PROGRAM
 * 
 * This function returns the name of the student whose id is provided
 * 
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
 * This function creates a record of a commendation
 * 
 * @param sender The id of the member that sent the commendation
 * @param recipient The id of the member who the commendation is being sent to 
 * @param msg This is the message that the sender wrote
 * @returns This function returns `Promise<Commendation>`
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
 * This function creates a record of a team commendation
 * 
 * @param sender The id of the member that sent the commendation
 * @param recipient The id of the team who the commendation is being sent to 
 * @param msg This is the message that the sender wrote
 * @returns This function returns `Promise<TeamCommendation>`
 */
export const createTeamCommendation = async (
  sender: string, recipient: string, msg: string
) => {
  return await prisma.teamCommendation.create({
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
 * This function gets all of the members except the current user
 * 
 * @param currentUserEmail This is the email address of the current session user
 * @returns A list of members and their teams in the form `(Member & { teams: Team[] })[]`
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
 * This function updates the profile picture of a given user
 * 
 * @param image This is the url of the profile picture of the user
 * @param id This is the id of the current user
 * @returns This function returns `Promise<Member>`
 */
export const updateMemberImageURL = async (image: string, id: string) => {
  const url = image.split("=");
  const hiResImage = url[0].concat("=s480-c");

  return await prisma.member.update({
    data: {
      imageURL: hiResImage
    },
    where: {
      id
    }
  });
};


/**
 * This function gets a list of the commendations sent to the user
 * 
 * @param email This is the email address of the current session user
 * @returns A list of commendations in the form `{message: string; sender: {name: string; imageURL: string | null; }; }[]`
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
          message: true,
          createdAt: true
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
 * This function gets a list of the commendations sent to the team
 * 
 * @param email This is the email address of the current session user
 * @returns A list of team commendations in the form `{message: string; sender: {name: string; imageURL: string | null; }; }[]`
 */
export const readTeamCommendations = async (email: string) => {
  const teams = await prisma.team.findMany({
    select: {
      teamCommendations: {
        select: {
          sender: {
            select: {
              name: true,
              imageURL: true
            }
          },
          message: true,
          createdAt: true
        }
      }
    },
    where: {
      members: {
        some: {
          email 
        }
      }
    }
  });
  return teams.flatMap(l => l.teamCommendations);
};

/**
 * This function gets a list of the commendations sent by the user
 * 
 * @param email This is the email address of the current session user
 * @returns A list of commendations in the form `{message: string; recipient: {name: string; imageURL: string | null; }; }[]`
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
          message: true,
          createdAt: true
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
 * This function gets a list of the commendations sent by the user
 * 
 * @param email This is the email address of the current session user
 * @returns A list of team commendations in the form `{message: string; recipient: {name: string; imageURL: string | null; }; }[]`
 */
export const readTeamSentCommendations = async (email: string) => {
  const user = await prisma.member.findFirst({
    select: {
      sentTeamCommendations: {
        select: {
          recipient: {
            select: {
              name: true,
              imageURL: true
            }
          },
          message: true,
          createdAt: true
        }
      }
    },
    where: {
      email
    }
  });
  return user?.sentTeamCommendations;
};

/**
 * The function name here is misleading.
 * This gets all of the team leaders for a given team.
 * 
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
 * The function gets a Member and all of the Teams that member is on
 * 
 * @param id The id of a member as a string
 * @returns An object in the form `(Member & {teams: Team[];})`
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
 * This function tests if a given id corresponds to any member 
 * 
 * @param id The id of a member as a string
 * @returns A boolean indicating the result of the test
 */
export const idIsMember = async (id: string) => {
  return !!await prisma.member.count({
    where: {
      id
    }
  });
};


/**
 * This function gets the profile picture for a given member
 * 
 * @param id The id of a member as a string
 * @returns A string that represents an image URL 
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