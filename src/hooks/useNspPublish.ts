import { useNostr } from '@nostrify/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { NostrEvent } from '@nostrify/nostrify';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { MEETUP_EVENTS_QUERY_KEY } from '@/hooks/useMeetupEvents';
import { NSP_EVENT_RELAYS, isNspAdmin, type EventTemplate } from '@/lib/nspNostr';

export interface PublishResult {
  events: NostrEvent[];
  /** Fewest relays that accepted any one record */
  minAccepted: number;
  relayCount: number;
}

/**
 * Sign records with the organizer account and send each one to every
 * event relay. Succeeds if every record reached at least one relay.
 * Updates the site's event list immediately, without waiting for relays.
 */
export function useNspPublish() {
  const { nostr } = useNostr();
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (templates: EventTemplate[]): Promise<PublishResult> => {
      if (!user) throw new Error('Sign in first.');
      if (!isNspAdmin(user.pubkey)) throw new Error('This account is not an organizer account.');

      const signed: NostrEvent[] = [];
      let now = Math.floor(Date.now() / 1000);
      for (const t of templates) {
        // Each record gets a unique, increasing timestamp so the newest edit always wins.
        signed.push(await user.signer.signEvent({ ...t, created_at: now++ }));
      }

      let minAccepted = Infinity;
      for (const event of signed) {
        const results = await Promise.allSettled(
          NSP_EVENT_RELAYS.map((url) => nostr.relay(url).event(event, { signal: AbortSignal.timeout(8000) })),
        );
        const accepted = results.filter((r) => r.status === 'fulfilled').length;
        if (accepted === 0) {
          throw new Error('No relay accepted the update. Check your connection and try again.');
        }
        minAccepted = Math.min(minAccepted, accepted);
      }

      return { events: signed, minAccepted: signed.length ? minAccepted : 0, relayCount: NSP_EVENT_RELAYS.length };
    },
    onSuccess: ({ events }) => {
      queryClient.setQueryData<NostrEvent[]>(MEETUP_EVENTS_QUERY_KEY, (old) => [...(old ?? []), ...events]);
    },
  });
}
