import { NextResponse } from "next/server";
import { isBridgeEnabled } from "@/lib/bridge";

/**
 * Health check for the future TalkAIQ bridge.
 *
 * Safe to expose pre-launch — returns the bridge state without any associate
 * or employer data. Every other /api/external/* route is blocked by the
 * bridge guard (see src/lib/bridge.ts).
 */
export async function GET() {
  return NextResponse.json({
    service: "avm-bridge",
    enabled: isBridgeEnabled(),
    protocol: "api-only",
    consent: "required-per-associate",
    anchor: "npi-hash",
  });
}
