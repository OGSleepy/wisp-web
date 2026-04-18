/**
 * keys.ts — key management for Wisp
 *
 * Uses nostr-tools (v2) which is a dep of applesauce-core.
 * Uses PrivateKeySigner.fromKey() from applesauce-signers.
 */

import { generateSecretKey, getPublicKey } from "nostr-tools/pure";
import { decode, nsecEncode, npubEncode } from "nostr-tools/nip19";
import { PrivateKeySigner } from "applesauce-signers";

export interface WispAccount {
  privkeyBytes: Uint8Array;
  privkeyHex: string;
  pubkeyHex: string;
  npub: string;
  nsec: string;
  signer: PrivateKeySigner;
}

// ─── Builders ─────────────────────────────────────────────────────────────────

function buildAccount(privkeyBytes: Uint8Array): WispAccount {
  const pubkeyHex = getPublicKey(privkeyBytes);
  const privkeyHex = bytesToHex(privkeyBytes);
  const npub = npubEncode(pubkeyHex);
  const nsec = nsecEncode(privkeyBytes);
  const signer = new PrivateKeySigner(privkeyBytes);
  return { privkeyBytes, privkeyHex, pubkeyHex, npub, nsec, signer };
}

export function generateAccount(): WispAccount {
  return buildAccount(generateSecretKey());
}

export function importFromNsec(nsec: string): WispAccount | null {
  try {
    const decoded = decode(nsec.trim());
    if (decoded.type !== "nsec") return null;
    return buildAccount(decoded.data as Uint8Array);
  } catch {
    return null;
  }
}

export function importFromHex(hex: string): WispAccount | null {
  try {
    if (!/^[0-9a-f]{64}$/i.test(hex)) return null;
    return buildAccount(hexToBytes(hex.toLowerCase()));
  } catch {
    return null;
  }
}

// ─── Persistence ─────────────────────────────────────────────────────────────

const STORAGE_KEY = "wisp_privkey_hex";

export function saveAccount(account: WispAccount): void {
  localStorage.setItem(STORAGE_KEY, account.privkeyHex);
}

export function loadAccount(): WispAccount | null {
  const hex = localStorage.getItem(STORAGE_KEY);
  if (!hex) return null;
  return importFromHex(hex);
}

export function clearAccount(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// ─── Display helpers ──────────────────────────────────────────────────────────

export function shortNpub(npub: string): string {
  if (npub.length <= 16) return npub;
  return `${npub.slice(0, 10)}…${npub.slice(-6)}`;
}

// ─── Utils ────────────────────────────────────────────────────────────────────

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBytes(hex: string): Uint8Array {
  const result = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    result[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return result;
}
