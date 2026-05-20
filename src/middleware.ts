export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard", "/api/process", "/api/analyze", "/api/clips"],
};
