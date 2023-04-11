/**
 * Revalidates a given URL using Next ISR
 * @param hostname The host to revalidate
 * @param email The endpoint on `/me` to revalidate.
 */
export async function revalidate(hostname: string, email: string) {
  const urlPaths = ["/admin", `/me/${email}`];

  await Promise.all(urlPaths.map((urlPath) =>
    fetch(`${hostname}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        urlPath,
      }),
    })));
}