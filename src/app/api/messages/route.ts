import { createMessage, listMessages } from "@/lib/server/repo";
import { body, handle, ok, requireAdmin } from "@/lib/server/http";
import { LIMITS, text } from "@/lib/server/validate";

export const dynamic = "force-dynamic";

/** Public: approved messages. `?all=1` (admin): every message. */
export const GET = handle(async (req) => {
  if (req.nextUrl.searchParams.get("all") === "1") {
    requireAdmin(req);
    return ok(await listMessages());
  }
  return ok(await listMessages("approved"));
});

/** Public: new messages always start as pending. */
export const POST = handle(async (req) => {
  const data = await body(req);
  await createMessage(
    text(data.name, LIMITS.name),
    text(data.message, LIMITS.message)
  );
  return ok({ ok: true }, { status: 201 });
});
