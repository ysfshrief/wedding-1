import { createGalleryItem, listGallery } from "@/lib/server/repo";
import { body, handle, ok, requireAdmin } from "@/lib/server/http";
import { LIMITS, text } from "@/lib/server/validate";

export const dynamic = "force-dynamic";

export const GET = handle(async () => ok(await listGallery()));

export const POST = handle(async (req) => {
  requireAdmin(req);
  await createGalleryItem(text((await body(req)).driveLink, LIMITS.link));
  return ok({ ok: true }, { status: 201 });
});
