import { readSettings, writeSettings } from "@/lib/server/repo";
import { body, handle, ok, requireAdmin } from "@/lib/server/http";
import { sanitizeSettings } from "@/lib/server/validate";

export const dynamic = "force-dynamic";

export const GET = handle(async () => ok(await readSettings()));

export const PUT = handle(async (req) => {
  requireAdmin(req);
  const settings = sanitizeSettings(await body(req));
  await writeSettings(settings);
  return ok(settings);
});
