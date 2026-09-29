import { removeGalleryItem } from "@/lib/server/repo";
import { fail, handle, ok, requireAdmin } from "@/lib/server/http";
import { isUuid } from "@/lib/server/validate";

export const dynamic = "force-dynamic";

export const DELETE = handle(async (req, { params }) => {
  requireAdmin(req);
  const { id } = await params;
  if (!isUuid(id)) return fail(404, "Not found");
  await removeGalleryItem(id);
  return ok();
});
