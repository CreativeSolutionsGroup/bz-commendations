import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      const { pathname, searchParams } = req.nextUrl;

      if (pathname === "/signin") {
        return true;
      }

      if (pathname === "/admin") {
        return token?.isAdmin ?? false;
      }

      if (pathname.includes("/me")) {
        const email = searchParams.get("email");
        // fix for #107
        if (email == null) return true;
        return email === token?.email;
      }

      // otherwise, if you were allowed to login, you're good.
      return !!token;
    },
  },
});

export const config = {
  matcher: ["/(.*)"],
};
