import { InferGetStaticPropsType } from 'next';
import { getServerSession } from 'next-auth';
import CommendationForm from "../components/CommendationForm";
import { readAllMembers } from '../lib/api/commendations';

export async function getStaticProps() {
  const members = await readAllMembers();

  return {
    props: { members },
    revalidate: 3600
  }
}

export default function Home({ members }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <main>
        <CommendationForm members={members} />
      </main>
    </>
  )
}
