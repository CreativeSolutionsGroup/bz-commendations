import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import CommendationForm from "../components/CommendationForm";
import { getTeams } from "../lib/api/teams";

export async function getStaticProps(context: GetStaticPropsContext) {
  const teams = await getTeams();

  return {
    props: { teams },
  };
}

export default function TeamCommendation({
  teams,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return <CommendationForm recipients={teams} teamTab />;
}
