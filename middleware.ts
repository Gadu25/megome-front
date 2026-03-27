import { chain } from "./middlewares/chain";
import { withInitializeResponse } from "./middlewares/initializeResponse";
import { withAuth } from "./middlewares/withAuth";

export default chain([withInitializeResponse, withAuth]);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)", "/([\\w-]+)?/users/(.+)"],
}