import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getServerSession } from 'next-auth';
import CommendationForm from "../components/CommendationForm";
import { readAllMembers } from '../lib/api/commendations';
import { authOptions } from './api/auth/[...nextauth]';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  const members = await readAllMembers(session?.user?.email ?? "");
  return {
    props: { members }
  }
}

export default function Home({ members }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <main>
        <CommendationForm members={members} />
      </main>
    </>
  )
}
