import { incrementVisits, readVisits } from "@/lib/server/repo";
import { handle, ok, requireAdmin } from "@/lib/server/http";

export const dynamic = "force-dynamic";

export const GET = handle(async (req) => {
  requireAdmin(req);
  return ok({ count: await readVisits() });
});

export const POST = handle(async () => {
  await incrementVisits();
  return ok();
});
