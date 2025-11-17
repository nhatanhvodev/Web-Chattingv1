import { authMiddleware } from "@clerk/nextjs";

// Configure Clerk middleware:
// - Add root and invite routes to publicRoutes so unauthenticated users can land there
// - Ignore static asset/file requests to prevent unnecessary auth redirects
export default authMiddleware({
  publicRoutes: ["/", "/invite/(.*)", "/api/uploadthing"],
  ignoredRoutes: ["/((?!api|trpc))(_next|.+\\..+)(.*)"]
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
  runtime: 'nodejs',
};
