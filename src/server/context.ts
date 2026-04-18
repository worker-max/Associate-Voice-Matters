import { getServerSession } from "next-auth";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function createContext(opts: FetchCreateContextFnOptions) {
  const session = await getServerSession(authOptions);
  return {
    db,
    session,
    headers: opts.req.headers,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
