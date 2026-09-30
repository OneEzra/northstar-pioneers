import { useEffect, useMemo, useState } from 'react';
import { useNostr } from '@nostrify/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { NostrEvent, NostrFilter } from '@nostrify/nostrify';

import { useCurrentUser } from '@/hooks/useCurrentUser';

import {
  events as backupEvents,
  resolveAll,
  selectBySlug,
  selectHorizon,
  selectNext,
  selectPast,
  selectPioneers,
  selectUpcoming,
  type MeetupEvent,
} from '@/data/events';
import {
  EVENT_TAG,
  KIND_APP_DATA,
  KIND_CALENDAR_EVENT,
  NSP_ADMIN_PUBKEYS,
  NSP_EVENT_RELAYS,
  PROGRAM_TAG,
  isNspAdmin,
  mergeEvents,
  publishedSlugs,
  type PublishedState,
} from '@/lib/nspNostr';

export const MEETUP_EVENTS_QUERY_KEY = ['nsp-meetup-events'] as const;

/** Current time, refreshed every minute so events roll over while a page is open. */
function useNow(intervalMs = 60_000): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

/** How long to wait for any one relay before giving up on it. */
const RELAY_TIMEOUT_MS = 6000;
/** After the first relay answers, how long to wait for other fast ones before showing results. */
const SETTLE_MS = 300;

/**
 * Raw Nostr records for all meetups.
 *
 * Each relay is asked separately, with its own timeout, so one slow relay,
 * or one that refuses part of a request, can't hold up or cut off the rest.
 * Results show as soon as the first relay answers (plus a short moment for
 * other fast ones); slower relays are merged in when they arrive, and the
 * newest version of each event always wins.
 *
 * Calendar events (public) and legacy program records are separate requests:
 * some relays refuse kind 30078 to anyone but its author.
 */
export function useMeetupNostrRecords() {
  const { nostr } = useNostr();
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();
  const me = user?.pubkey;
  const queryKey = [...MEETUP_EVENTS_QUERY_KEY, me ?? 'visitor'];

  return useQuery({
    queryKey,
    queryFn: (): Promise<NostrEvent[]> => {
      const requests: Promise<NostrEvent[]>[] = [];
      for (const url of NSP_EVENT_RELAYS) {
        const relay = nostr.relay(url);
        const ask = (filter: NostrFilter) =>
          relay.query([filter], { signal: AbortSignal.timeout(RELAY_TIMEOUT_MS) });
        requests.push(ask({ kinds: [KIND_CALENDAR_EVENT], authors: NSP_ADMIN_PUBKEYS, '#t': [EVENT_TAG], limit: 500 }));
        // Legacy program records: only an admin reading their own can get these
        // from strict relays, and only admins need them (to re-publish).
        if (me && isNspAdmin(me)) {
          requests.push(ask({ kinds: [KIND_APP_DATA], authors: [me], '#t': [PROGRAM_TAG], limit: 500 }));
        }
      }

      return new Promise<NostrEvent[]>((resolve, reject) => {
        const collected: NostrEvent[] = [];
        let done = false;
        let pending = requests.length;
        let answered = 0;
        const finish = () => {
          if (done) return;
          done = true;
          resolve([...collected]);
        };
        for (const request of requests) {
          request
            .then((events) => {
              answered++;
              if (done) {
                // Late relay: merge its records into what's already showing
                if (events.length) {
                  queryClient.setQueryData<NostrEvent[]>(queryKey, (old) => [...(old ?? []), ...events]);
                }
              } else {
                collected.push(...events);
                if (answered === 1) setTimeout(finish, SETTLE_MS);
              }
            })
            .catch(() => undefined)
            .finally(() => {
              pending--;
              if (pending === 0) {
                if (answered > 0) finish();
                else if (!done) reject(new Error('No relay answered'));
              }
            });
        }
      });
    },
    staleTime: 60_000,
    retry: 1,
  });
}

export interface MeetupEvents {
  /** Every event (including cancelled/rescheduled), resolved for display */
  all: MeetupEvent[];
  /** Active upcoming events, soonest first */
  upcoming: MeetupEvent[];
  /** The spotlight event */
  next: MeetupEvent | null;
  /** Upcoming events after the spotlight one */
  horizon: MeetupEvent[];
  /** Past events, newest first */
  past: MeetupEvent[];
  /** Events with a featured pioneer, newest first */
  pioneers: MeetupEvent[];
  bySlug: (slug: string) => MeetupEvent | undefined;
  /** True until the first Nostr response (or failure) */
  isLoading: boolean;
  /** Where the data came from */
  source: 'nostr' | 'backup';
  /** Event IDs that have a calendar event / program on Nostr */
  published: PublishedState;
  /** True when the Nostr lookup failed (the backup list is showing) */
  isError: boolean;
  refetch: () => void;
}

/**
 * THE single source for every event on the site.
 * Home, Events, detail pages, and stats all read from this hook.
 */
export function useMeetupEvents(): MeetupEvents {
  const now = useNow();
  const { data, isLoading, isError, refetch } = useMeetupNostrRecords();

  return useMemo(() => {
    const merged = mergeEvents(backupEvents, data ?? []);
    const all = resolveAll(merged, now);
    return {
      all,
      upcoming: selectUpcoming(all),
      next: selectNext(all),
      horizon: selectHorizon(all),
      past: selectPast(all),
      pioneers: selectPioneers(all),
      bySlug: (slug: string) => selectBySlug(all, slug),
      isLoading,
      source: data && data.length > 0 ? 'nostr' : 'backup',
      published: publishedSlugs(data ?? []),
      isError,
      refetch: () => void refetch(),
    };
  }, [data, isLoading, isError, refetch, now]);
}
