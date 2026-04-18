/**
 * useProfile — reactive profile metadata via applesauce-core v5 ProfileModel
 *
 * ProfileModel emits ProfileContent | undefined (from applesauce-core/helpers).
 * ProfileContent has typed fields: name, display_name, picture, about, etc.
 */

import { useEffect, useState } from "react";
import { Models } from "applesauce-core";
import type { ProfileContent } from "applesauce-core/helpers";
import type { Filter } from "applesauce-core/helpers";
import { eventStore, pool, LOOKUP_RELAYS, filterRelays } from "@/lib/nostr";
import { onlyEvents } from "applesauce-relay";
import { mapEventsToStore } from "applesauce-core";

export type { ProfileContent };

export function useProfile(pubkeyHex: string | undefined) {
  const [profile, setProfile] = useState<ProfileContent | null>(null);

  useEffect(() => {
    if (!pubkeyHex) return;

    const relays = filterRelays(LOOKUP_RELAYS);
    const filter: Filter = { kinds: [0], authors: [pubkeyHex], limit: 1 };

    // Fetch profile event and add it to the store
    const fetchSub = pool
      .subscription(relays, filter)
      .pipe(onlyEvents(), mapEventsToStore(eventStore))
      .subscribe();

    // Reactively subscribe to the parsed profile content
    const modelSub = eventStore
      .model(Models.ProfileModel, pubkeyHex)
      .subscribe((content) => {
        if (content) setProfile(content);
      });

    return () => {
      fetchSub.unsubscribe();
      modelSub.unsubscribe();
    };
  }, [pubkeyHex]);

  return profile;
}

/** Display name with fallback to shortened pubkey */
export function displayName(
  profile: ProfileContent | null,
  pubkeyHex: string,
): string {
  return profile?.display_name ?? profile?.name ?? `${pubkeyHex.slice(0, 8)}…`;
}
