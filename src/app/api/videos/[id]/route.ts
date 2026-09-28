import { removeVideo, updateVideoStatus } from "@/lib/server/repo";
import { body, fail, handle, ok, requireAdmin } from "@/lib/server/http";
import { isUuid, parseStatus } from "@/lib/server/validate";

export const dynamic = "force-dynamic";

export const PATCH = handle(async (req, { params }) => {
  requireAdmin(req);
  const { id } = await params;
  if (!isUuid(id)) return fail(404, "Not found");
  await updateVideoStatus(id, parseStatus((await body(req)).status));
  return ok();
});

export const DELETE = handle(async (req, { params }) => {
  requireAdmin(req);
  const { id } = await params;
  if (!isUuid(id)) return fail(404, "Not found");
  await removeVideo(id);
  return ok();
});
