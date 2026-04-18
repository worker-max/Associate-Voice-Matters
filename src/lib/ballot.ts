import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { hashIdentifier } from "./identity";

const COOKIE = "avm_ballot";
const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Anonymous ballot cookie.
 *
 * Used for lightweight dedup on public pulse surveys so one browser can't
 * swing a bar on its own. The cookie stores a random UUID; the server hashes
 * it with the identity pepper before writing to SurveyResponse.ballotHash,
 * so the raw UUID never sits in the database.
 *
 * Not PII — no email, no identifier. A cleared cookie = a new ballot.
 */
export function readOrMintBallot(): { uuid: string; ballotHash: string; minted: boolean } {
  const store = cookies();
  const existing = store.get(COOKIE)?.value;
  if (existing) {
    return { uuid: existing, ballotHash: hashIdentifier(existing), minted: false };
  }
  const uuid = randomUUID();
  store.set(COOKIE, uuid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ONE_YEAR,
  });
  return { uuid, ballotHash: hashIdentifier(uuid), minted: true };
}

export function readBallot(): { ballotHash: string } | null {
  const existing = cookies().get(COOKIE)?.value;
  if (!existing) return null;
  return { ballotHash: hashIdentifier(existing) };
}
