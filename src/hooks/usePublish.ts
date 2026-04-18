/**
 * usePublish — sign and broadcast Nostr events via applesauce-core v5
 *
 * EventFactory.create() builds the unsigned template.
 * EventFactory.sign() signs it using the signer in context.
 * pool.publish() broadcasts to relays (nostr.band always stripped).
 */

import { useCallback } from "react";
import { EventFactory } from "applesauce-core/event-factory";
import { NoteBlueprint, NoteReplyBlueprint, ReactionBlueprint, ShareBlueprint } from "applesauce-common/blueprints";
import type { NostrEvent } from "applesauce-core/helpers";
import { pool, DEFAULT_RELAYS, filterRelays } from "@/lib/nostr";
import { useAccount } from "@/lib/AccountContext";

export function usePublish() {
  const { account } = useAccount();

  const publish = useCallback(
    async (event: NostrEvent) => {
      const relays = filterRelays(DEFAULT_RELAYS);
      await pool.publish(relays, event);
    },
    [],
  );

  const publishNote = useCallback(
    async (content: string) => {
      if (!account) throw new Error("Not logged in");
      const factory = new EventFactory({ signer: account.signer });
      const draft = await factory.create(NoteBlueprint, content);
      const signed = await factory.sign(draft);
      await publish(signed);
      return signed;
    },
    [account, publish],
  );

  const publishReply = useCallback(
    async (parent: NostrEvent, content: string) => {
      if (!account) throw new Error("Not logged in");
      const factory = new EventFactory({ signer: account.signer });
      const draft = await factory.create(NoteReplyBlueprint, parent, content);
      const signed = await factory.sign(draft);
      await publish(signed);
      return signed;
    },
    [account, publish],
  );

  const publishReaction = useCallback(
    async (event: NostrEvent, emoji = "+") => {
      if (!account) throw new Error("Not logged in");
      const factory = new EventFactory({ signer: account.signer });
      const draft = await factory.create(ReactionBlueprint, event, emoji);
      const signed = await factory.sign(draft);
      await publish(signed);
      return signed;
    },
    [account, publish],
  );

  const publishRepost = useCallback(
    async (event: NostrEvent) => {
      if (!account) throw new Error("Not logged in");
      const factory = new EventFactory({ signer: account.signer });
      const draft = await factory.create(ShareBlueprint, event);
      const signed = await factory.sign(draft);
      await publish(signed);
      return signed;
    },
    [account, publish],
  );

  return { publish, publishNote, publishReply, publishReaction, publishRepost };
}
