/**
 * nostr.ts — global singleton instances for Wisp
 *
 * wss://relay.nostr.band is permanently banned — filtered from every relay
 * list before any connection is opened.
 */

import { EventStore } from "applesauce-core";
import { RelayPool } from "applesauce-relay";

// ─── Banned relays ────────────────────────────────────────────────────────────

const BANNED = [
  "wss://relay.nostr.band",
  "wss://relay.nostr.band/",
];

function normalize(url: string) {
  return url.replace(/\/$/, "").toLowerCase();
}

export function isBanned(url: string): boolean {
  const n = normalize(url);
  return BANNED.some((b) => normalize(b) === n);
}

/** Strip banned relays from any list */
export function filterRelays(relays: string[]): string[] {
  return relays.filter((r) => !isBanned(r));
}

// ─── Default bootstrap relays (no nostr.band) ────────────────────────────────

export const DEFAULT_RELAYS = filterRelays([
  "wss://relay.damus.io",
  "wss://nos.lol",
  "wss://relay.snort.social",
  "wss://nostr.wine",
  "wss://relay.primal.net",
]);

/** Lookup relays for NIP-65 and profile discovery */
export const LOOKUP_RELAYS = filterRelays([
  "wss://purplepag.es/",
  "wss://index.hzrd149.com/",
]);

// ─── Global singletons ────────────────────────────────────────────────────────

export const eventStore = new EventStore();
export const pool = new RelayPool();
