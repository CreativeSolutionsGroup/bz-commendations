import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import CommendationForm from "../components/CommendationForm";
import { getTeams } from "../lib/api/teams";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const teams = await getTeams();

  return {
    props: { teams }
  };
}

export default function TeamCommendation({ teams }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <CommendationForm recipients={teams} teamTab />
    </>
  );
}