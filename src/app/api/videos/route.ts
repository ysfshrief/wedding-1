import { createVideo, listVideos } from "@/lib/server/repo";
import { body, handle, ok, requireAdmin } from "@/lib/server/http";
import { LIMITS, text } from "@/lib/server/validate";

export const dynamic = "force-dynamic";

/** Public: approved photo links. `?all=1` (admin): every submission. */
export const GET = handle(async (req) => {
  if (req.nextUrl.searchParams.get("all") === "1") {
    requireAdmin(req);
    return ok(await listVideos());
  }
  return ok(await listVideos("approved"));
});

/** Public: guest submissions always start as pending. */
export const POST = handle(async (req) => {
  const data = await body(req);
  const name = text(data.name, LIMITS.name, { optional: true }) || "—";
  await createVideo(name, text(data.driveLink, LIMITS.link));
  return ok({ ok: true }, { status: 201 });
});
