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
  /** Relays that refused at least one record, with their reason */
  refused: { relay: string; reason: string }[];
}

const shortRelay = (url: string) => url.replace(/^wss:\/\//, '').replace(/\/$/, '');

const dTag = (tags: string[][]) => tags.find(([n]) => n === 'd')?.[1] ?? '';

/**
 * Timestamp for a new version of a record: now, but always later than any
 * version already known. Relays keep only the newest version of an
 * addressable record and break ties by event ID, so an edit saved within
 * seconds of the last save must never reuse (or undercut) its timestamp.
 */
export function nextCreatedAt(template: EventTemplate, known: NostrEvent[], now: number): number {
  const d = dTag(template.tags);
  const latest = known
    .filter((e) => e.kind === template.kind && dTag(e.tags) === d)
    .reduce((max, e) => Math.max(max, e.created_at), 0);
  return Math.max(now, latest + 1);
}

/**
 * Sign records with the signed-in admin account and send each one to every
 * event relay. Succeeds if every record reached at least one relay; reports
 * which relays refused and why. Updates the site's event list immediately.
 */
export function useNspPublish() {
  const { nostr } = useNostr();
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (templates: EventTemplate[]): Promise<PublishResult> => {
      if (!user) throw new Error('Sign in first.');
      if (!isNspAdmin(user.pubkey)) throw new Error('This account is not an organizer account.');

      const known = queryClient
        .getQueriesData<NostrEvent[]>({ queryKey: MEETUP_EVENTS_QUERY_KEY })
        .flatMap(([, data]) => data ?? []);
      const signed: NostrEvent[] = [];
      let now = Math.floor(Date.now() / 1000);
      for (const t of templates) {
        // Unique, increasing timestamps, later than every known version, so the newest edit always wins.
        const created_at = nextCreatedAt(t, known, now);
        signed.push(await user.signer.signEvent({ ...t, created_at }));
        now = created_at + 1;
      }

      let minAccepted = Infinity;
      const refused = new Map<string, string>();
      for (const event of signed) {
        const results = await Promise.allSettled(
          NSP_EVENT_RELAYS.map((url) => nostr.relay(url).event(event, { signal: AbortSignal.timeout(8000) })),
        );
        let accepted = 0;
        results.forEach((r, i) => {
          if (r.status === 'fulfilled') accepted++;
          else {
            const reason = r.reason instanceof Error ? r.reason.message : String(r.reason);
            refused.set(shortRelay(NSP_EVENT_RELAYS[i]), reason);
          }
        });
        if (accepted === 0) {
          throw new Error('No relay accepted the update. Check your connection and try again.');
        }
        minAccepted = Math.min(minAccepted, accepted);
      }

      return {
        events: signed,
        minAccepted: signed.length ? minAccepted : 0,
        relayCount: NSP_EVENT_RELAYS.length,
        refused: [...refused].map(([relay, reason]) => ({ relay, reason })),
      };
    },
    onSuccess: ({ events }) => {
      queryClient.setQueriesData<NostrEvent[]>({ queryKey: MEETUP_EVENTS_QUERY_KEY }, (old) => [
        ...(old ?? []),
        ...events,
      ]);
    },
  });
}
