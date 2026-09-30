# Northstar Pioneers — Nostr event format

This site stores each meetup as a standard **NIP-52 time-based calendar event (kind 31923)**, extended with a few extra tags. No custom kinds are defined.

## Meetup: kind 31923

Published only by organizer accounts (see `NSP_ADMIN_PUBKEYS` in `src/lib/nspNostr.ts`); the site ignores the same kind from anyone else.

| Tag | Required | Meaning |
|---|---|---|
| `d` | yes | Event ID = meetup date, optionally with a short name: `2026-10-27`, `2026-10-27-workshop` |
| `title`, `start`, `end`, `start_tzid`, `end_tzid`, `D`, `location`, `summary` | NIP-52 | Standard calendar fields (times are unix seconds; timezone `America/Chicago`) |
| `a` | NIP-52 | `31924:<pubkey>:northstar-pioneers-meetups` — the calendar this event belongs to |
| `r` | — | Meetup.com RSVP link |
| `t` | yes | `northstarpioneers` (used to query), plus `ai`, `meetup` |
| `venue`, `address`, `city` | — | Venue name, street address, short city for date pills |
| `status` | yes | `active`, `cancelled`, or `rescheduled` |
| `rescheduled_to` | — | New event ID when `status` is `rescheduled`; the old URL forwards there |
| `alias` | — | Older URL IDs that redirect here (e.g. `2026-10`) |
| `nsp_program` | yes | JSON: `{ "v": 1, "topics": [...], "builderDemo": {...}, "photoUrl", "attendees" }` — featured pioneer, Socratic topics, links. Always present (an empty program is authoritative and clears an older pioneer). |

`content` repeats the summary so other NIP-52 apps show a readable description.

The program lives inside the public calendar event because some relays (e.g. relay.ditto.pub) treat kind 30078 app-data as private and only return it to its author.

## Calendar: kind 31924

`d` = `northstar-pioneers-meetups`, `title` = `Northstar Pioneers Meetups`, one `a` tag per meetup (`31923:<author>:<id>`), so calendar apps can follow the whole series.

## Legacy: kind 30078 program records

Before 2026-09-30, the program was a separate kind 30078 record (`d` = `northstarpioneers:program:<id>`, `t` = `northstarpioneers-program`, JSON in `content`). The site still reads these for signed-in admins, the most recent save wins between the two formats, and re-publishing an event from `/admin` moves the program into its calendar event. New ones are no longer created.

## Relays

Read and written: `relay.ditto.pub`, `nos.lol`, `offchain.pub`, `nostr.mom`, `relay.snort.social`, `relay.damus.io`. Each relay is queried separately with its own timeout, and results are merged; the newest version of each event ID wins.
