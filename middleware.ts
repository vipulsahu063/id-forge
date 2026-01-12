import { default as middleware } from "next-auth/middleware";

export { middleware };  // Named export that Next.js 16 recognizes

export const config = {
  matcher: [
    "/admin/:path*",
    "/station/add-officer/:path*",
  ]
};
