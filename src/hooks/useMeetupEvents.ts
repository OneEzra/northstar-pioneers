import { useEffect, useMemo, useState } from 'react';
import { useNostr } from '@nostrify/react';
import { useQuery } from '@tanstack/react-query';
import type { NostrEvent } from '@nostrify/nostrify';

import {
  events as backupEvents,
  resolveAll,
  selectBySlug,
  selectHorizon,
  selectNext,
  selectPast,
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
  mergeEvents,
  publishedSlugs,
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

/** Raw Nostr records for all meetups (calendar events + programs). */
export function useMeetupNostrRecords() {
  const { nostr } = useNostr();
  return useQuery({
    queryKey: MEETUP_EVENTS_QUERY_KEY,
    queryFn: async (): Promise<NostrEvent[]> => {
      const group = nostr.group(NSP_EVENT_RELAYS);
      return group.query(
        [
          { kinds: [KIND_CALENDAR_EVENT], authors: NSP_ADMIN_PUBKEYS, '#t': [EVENT_TAG], limit: 500 },
          { kinds: [KIND_APP_DATA], authors: NSP_ADMIN_PUBKEYS, '#t': [PROGRAM_TAG], limit: 500 },
        ],
        { signal: AbortSignal.timeout(8000) },
      );
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
  bySlug: (slug: string) => MeetupEvent | undefined;
  /** True until the first Nostr response (or failure) */
  isLoading: boolean;
  /** Where the data came from */
  source: 'nostr' | 'backup';
  /** Event IDs that have a calendar event / program on Nostr */
  published: { calendar: Set<string>; program: Set<string> };
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
      bySlug: (slug: string) => selectBySlug(all, slug),
      isLoading,
      source: data && data.length > 0 ? 'nostr' : 'backup',
      published: publishedSlugs(data ?? []),
      isError,
      refetch: () => void refetch(),
    };
  }, [data, isLoading, isError, refetch, now]);
}
