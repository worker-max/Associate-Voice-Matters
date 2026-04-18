/**
 * TalkAIQ bridge guard (seed §9).
 *
 * Every /api/external/* handler MUST call `assertBridgeEnabled()` before doing
 * any work. At launch the bridge is disabled by default — TALKAIQ_BRIDGE_ENABLED
 * is "false" and any hit returns 503.
 */
export class BridgeDisabledError extends Error {
  status = 503 as const;
  constructor() {
    super("TalkAIQ bridge is not enabled at launch.");
  }
}

export class BridgeAuthError extends Error {
  status = 401 as const;
  constructor() {
    super("Invalid or missing TalkAIQ bridge credential.");
  }
}

export function isBridgeEnabled(): boolean {
  return process.env.TALKAIQ_BRIDGE_ENABLED === "true";
}

export function assertBridgeEnabled(): void {
  if (!isBridgeEnabled()) throw new BridgeDisabledError();
}

export function assertBridgeCredential(request: Request): void {
  const key = request.headers.get("x-talkaiq-bridge-key");
  const expected = process.env.TALKAIQ_BRIDGE_API_KEY;
  if (!expected || !key || key !== expected) throw new BridgeAuthError();
}
