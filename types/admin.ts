import { Member, Team } from "@prisma/client";

export type MembersWithCommendations = {
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
};

export type TeamsList = (Team & {
    members: (Member & {
      commendations: {
        id: string;
      }[];
      sentCommendations: {
        id: string;
      }[];
    })[];
  })[];