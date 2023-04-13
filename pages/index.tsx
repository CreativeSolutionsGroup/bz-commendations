import { InferGetStaticPropsType } from "next";
import { readAllMembers } from "@/lib/api/commendations";
import CommendationForm from "@/components/CommendationForm";
import IndexAbsoluteElements from "@/components/IndexAbsoluteElements";

export async function getStaticProps() {
  const members = await readAllMembers();

  return {
    props: { members },
    revalidate: 60
  };
}

export default function Home({ members }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <CommendationForm recipients={members} />
    </>
  );
}
