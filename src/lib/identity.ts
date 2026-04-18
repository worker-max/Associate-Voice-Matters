import { createHmac, createCipheriv, createDecipheriv, randomBytes } from "crypto";

/**
 * Identity bridge primitives (seed §4.2).
 *
 * PII NEVER lives next to aggregates. This module handles:
 *   - deterministic hashing of email / NPI for lookup (HMAC-SHA256 with a pepper)
 *   - AEAD encryption of plaintext PII (real name) with AES-256-GCM
 *
 * The pepper and key are environment-scoped and must be rotated via a
 * re-encryption migration — never in-place.
 */

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(
      `Missing required env var ${name}. See .env.example — identity bridge will not operate without it.`
    );
  }
  return v;
}

export function hashIdentifier(value: string): string {
  const pepper = requireEnv("IDENTITY_HASH_PEPPER");
  return createHmac("sha256", pepper).update(value.trim().toLowerCase()).digest("hex");
}

export function hashEmail(email: string): string {
  return hashIdentifier(email);
}

export function hashNpi(npi: string): string {
  return hashIdentifier(npi.replace(/\s+/g, ""));
}

const ALGO = "aes-256-gcm";

function key(): Buffer {
  const hex = requireEnv("IDENTITY_ENCRYPTION_KEY");
  const buf = Buffer.from(hex, "hex");
  if (buf.length !== 32) {
    throw new Error("IDENTITY_ENCRYPTION_KEY must be 32 bytes (64 hex chars).");
  }
  return buf;
}

export function encryptPII(plaintext: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGO, key(), iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64")}.${tag.toString("base64")}.${enc.toString("base64")}`;
}

export function decryptPII(blob: string): string {
  const [ivB64, tagB64, dataB64] = blob.split(".");
  if (!ivB64 || !tagB64 || !dataB64) {
    throw new Error("Malformed encrypted PII payload.");
  }
  const decipher = createDecipheriv(ALGO, key(), Buffer.from(ivB64, "base64"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));
  return Buffer.concat([
    decipher.update(Buffer.from(dataB64, "base64")),
    decipher.final(),
  ]).toString("utf8");
}

/**
 * Deterministic consent fingerprint. Written to IdentityUnlockEvent.consentHash
 * so we can prove what the associate agreed to — without storing the prompt
 * text next to their identity.
 */
export function consentFingerprint(parts: {
  associateId: string;
  reason: string;
  promptVersion: string;
  timestamp: string;
}): string {
  const pepper = requireEnv("IDENTITY_HASH_PEPPER");
  const payload = [parts.associateId, parts.reason, parts.promptVersion, parts.timestamp].join("|");
  return createHmac("sha256", pepper).update(payload).digest("hex");
}
