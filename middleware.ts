import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      const { pathname } = req.nextUrl;

      if (pathname === "/signin") {
        return true;
      }

      if (!token) {
        return false;
      }

      if (pathname === "/admin") {
        return token?.isAdmin ?? false;
      }

      if (pathname.includes("/me")) {
        return pathname.split("/").slice(-1)[0] === token.email;
      }

      // otherwise, if you were allowed to login, you're good.
      return !!token;
    },
  },
});

export const config = {
  matcher: ["/(.*)"],
};
