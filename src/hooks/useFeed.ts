/**
 * useFeed — subscribe to a timeline via applesauce-relay v5 + applesauce-core v5
 *
 * Operator chain:
 *   pool.subscription() → onlyEvents() → mapEventsToStore() (core) → mapEventsToTimeline() (core) → castTimelineStream() (common)
 *
 * nostr.band is always stripped from relay lists before any connection is made.
 */

import { useEffect, useState } from "react";
import { onlyEvents } from "applesauce-relay";
import { mapEventsToStore, mapEventsToTimeline } from "applesauce-core";
import { castTimelineStream } from "applesauce-common/observable";
import { Note } from "applesauce-common/casts";
import type { Filter } from "applesauce-core/helpers";
import { eventStore, pool, DEFAULT_RELAYS, filterRelays } from "@/lib/nostr";

export interface UseFeedOptions {
  /** Extra relay URLs (nostr.band always stripped) */
  relays?: string[];
  /** Filter to a specific author pubkey hex */
  author?: string;
  limit?: number;
}

export function useFeed({
  relays: extraRelays = [],
  author,
  limit = 30,
}: UseFeedOptions = {}) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const relays = filterRelays([...DEFAULT_RELAYS, ...extraRelays]);

    const filter: Filter = { kinds: [1], limit };
    if (author) filter.authors = [author];

    const sub = pool
      .subscription(relays, filter)
      .pipe(
        onlyEvents(),
        mapEventsToStore(eventStore),
        mapEventsToTimeline(),
        castTimelineStream(Note, eventStore),
      )
      .subscribe({
        next: (timeline) => {
          setNotes(timeline);
          setLoading(false);
        },
        error: (err) => {
          console.error("[useFeed] error", err);
          setLoading(false);
        },
      });

    return () => sub.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [author, limit, extraRelays.join(",")]);

  return { notes, loading };
}
