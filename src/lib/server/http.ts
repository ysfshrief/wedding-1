import { NextResponse, type NextRequest } from "next/server";
import { isAdmin } from "./auth";
import { DbUnavailable } from "./repo";
import { BadRequest } from "./validate";

type Ctx = { params: Promise<Record<string, string>> };
type Handler = (req: NextRequest, ctx: Ctx) => Promise<Response>;

export const ok = (data: unknown = { ok: true }, init?: ResponseInit) =>
  NextResponse.json(data, {
    ...init,
    headers: { "Cache-Control": "no-store", ...init?.headers },
  });

export const fail = (status: number, error: string) =>
  NextResponse.json(
    { error },
    { status, headers: { "Cache-Control": "no-store" } }
  );

class Unauthorized extends Error {}

export function requireAdmin(req: NextRequest) {
  if (!isAdmin(req)) throw new Unauthorized();
}

export async function body(req: NextRequest): Promise<Record<string, unknown>> {
  try {
    const data = await req.json();
    return data && typeof data === "object" ? data : {};
  } catch {
    throw new BadRequest("Invalid JSON");
  }
}

/** Maps thrown errors to JSON responses. */
export function handle(fn: Handler): Handler {
  return async (req, ctx) => {
    try {
      return await fn(req, ctx);
    } catch (err) {
      if (err instanceof Unauthorized) return fail(401, "Unauthorized");
      if (err instanceof BadRequest) return fail(400, err.message);
      if (err instanceof DbUnavailable) return fail(503, err.message);
      console.error(err);
      return fail(500, "Server error");
    }
  };
}
