export async function revalidate(
  hostname: string, // hostname to be revalidated
  email: string, // the user page that needs to be revalidated
) {
  const urlPaths = ["/admin", `/me/${email}`];

  await Promise.all(
    urlPaths.map((urlPath) =>
      fetch(`${hostname}/api/revalidate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          urlPath,
        }),
      })
    )
  );
}