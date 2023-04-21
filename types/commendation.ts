import { Team, Member, Commendation } from "@prisma/client";

export type TeamWithMembers = Team & { members: Array<Member> };
export type MemberWithTeams = Member & { teams: Array<Team> };


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

export type CommendationWithPeople = (Commendation & {
    sender: Member;
    recipient: Member;
});