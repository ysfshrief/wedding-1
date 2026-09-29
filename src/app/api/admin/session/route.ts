import {
  checkPassword,
  clearAdminCookie,
  isAdmin,
  setAdminCookie,
} from "@/lib/server/auth";
import { body, handle, ok } from "@/lib/server/http";

export const dynamic = "force-dynamic";

/** Whether the current browser holds a valid admin session. */
export const GET = handle(async (req) => ok({ admin: isAdmin(req) }));

/** Log in with the admin password (a wrong one yields `admin: false`). */
export const POST = handle(async (req) => {
  if (!checkPassword((await body(req)).password)) {
    return ok({ admin: false });
  }
  const res = ok({ admin: true });
  setAdminCookie(res);
  return res;
});

/** Log out. */
export const DELETE = handle(async () => {
  const res = ok({ admin: false });
  clearAdminCookie(res);
  return res;
});
