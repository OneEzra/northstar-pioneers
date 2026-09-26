import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSeoMeta } from '@unhead/react';
import { nip19 } from 'nostr-tools';
import { ArrowLeft, CalendarPlus, ExternalLink, RefreshCw, UploadCloud } from 'lucide-react';

import { SiteNav } from '@/components/SiteNav';
import { SiteFooter } from '@/components/SiteFooter';
import { LoginArea } from '@/components/auth/LoginArea';
import { EventDetailsForm } from '@/components/admin/EventDetailsForm';
import { ProgramEditor } from '@/components/admin/ProgramEditor';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useMeetupEvents, type MeetupEvents } from '@/hooks/useMeetupEvents';
import { useNspPublish } from '@/hooks/useNspPublish';
import { useToast } from '@/hooks/useToast';
import { formatEventDate, formatEventDateShort, type EventProgram, type MeetupEvent } from '@/data/events';
import {
  buildCalendarList,
  cleanProgram,
  eventToForm,
  formToCalendarFields,
  newEventForm,
  planReschedule,
  programOf,
  suggestSlug,
  takenSlugs,
  toCalendarFields,
  validateEventForm,
  type EventForm,
} from '@/lib/nspAdmin';
import { NSP_ADMIN_PUBKEY, buildCalendarEvent, buildProgramEvent, type EventTemplate } from '@/lib/nspNostr';

const EMPTY_PROGRAM: EventProgram = { topics: [] };

const hasProgram = (p: EventProgram) =>
  p.topics.length > 0 || !!p.builderDemo || !!p.photoUrl || !!p.attendees;

/** A sensible default date for a new event: 4 weeks after the last one. */
function nextDefaultDay(all: MeetupEvent[]): string {
  const latest = Math.max(Date.now(), ...all.map((e) => new Date(e.date).getTime()));
  const d = new Date(latest + 28 * 86400000);
  return d.toISOString().slice(0, 10);
}

// ─── Publishing helper ───────────────────────────────────────────

function usePublisher() {
  const publish = useNspPublish();
  const { toast } = useToast();
  const run = async (templates: EventTemplate[], success: string): Promise<boolean> => {
    try {
      const r = await publish.mutateAsync(templates);
      toast({ title: success, description: `Saved to ${r.minAccepted} of ${r.relayCount} relays.` });
      return true;
    } catch (err) {
      toast({
        title: "Couldn't save",
        description: err instanceof Error ? err.message : String(err),
        variant: 'destructive',
      });
      return false;
    }
  };
  return { run, isPending: publish.isPending };
}

// ─── Status badges ───────────────────────────────────────────────

function Pill({ children, tone = 'muted' }: { children: React.ReactNode; tone?: 'blue' | 'muted' | 'warn' | 'bad' }) {
  // Inline colors so they win over the .tag-pill brand defaults
  const tones: Record<string, React.CSSProperties> = {
    blue: {},
    muted: { color: 'var(--muted-foreground)', borderColor: 'var(--border)', background: 'transparent' },
    warn: { color: '#FBBF24', borderColor: 'rgba(251,191,36,0.5)', background: 'rgba(251,191,36,0.08)' },
    bad: { color: 'var(--destructive)', borderColor: 'var(--destructive)', background: 'transparent' },
  };
  return (
    <span className="tag-pill text-[10px]" style={tones[tone]}>
      {children}
    </span>
  );
}

function EventPills({ e, published }: { e: MeetupEvent; published: MeetupEvents['published'] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {e.state === 'cancelled' ? (
        <Pill tone="bad">Cancelled</Pill>
      ) : e.state === 'rescheduled' ? (
        <Pill tone="warn">Moved → {e.rescheduledTo}</Pill>
      ) : (
        <Pill tone={e.status === 'upcoming' ? 'blue' : 'muted'}>{e.status === 'upcoming' ? 'Upcoming' : 'Past'}</Pill>
      )}
      {!published.calendar.has(e.slug) && <Pill tone="warn">Not on Nostr yet</Pill>}
    </div>
  );
}

// ─── Event list ──────────────────────────────────────────────────

function EventList({ data, onEdit, onNew }: { data: MeetupEvents; onEdit: (slug: string) => void; onNew: () => void }) {
  const { run, isPending } = usePublisher();
  const [confirmMigrate, setConfirmMigrate] = useState(false);
  const ready = !data.isLoading && !data.isError;

  const upcoming = data.all.filter((e) => e.status === 'upcoming' && (e.state ?? 'active') === 'active');
  const past = data.all.filter((e) => e.status === 'past' || (e.state ?? 'active') !== 'active');
  const sortAsc = (a: MeetupEvent, b: MeetupEvent) => a.date.localeCompare(b.date);
  upcoming.sort(sortAsc);
  past.sort((a, b) => sortAsc(b, a));

  const unpublished = data.all.filter((e) => !data.published.calendar.has(e.slug));

  const migrate = async () => {
    const templates: EventTemplate[] = [];
    for (const e of unpublished) {
      templates.push(buildCalendarEvent(toCalendarFields(e)));
      const program = programOf(e);
      if (hasProgram(program) && !data.published.program.has(e.slug)) {
        templates.push(buildProgramEvent(e.slug, cleanProgram(program)));
      }
    }
    templates.push(buildCalendarList(data.all.map((e) => e.slug)));
    await run(templates, `Published ${unpublished.length} events to Nostr`);
    setConfirmMigrate(false);
  };

  const Row = ({ e }: { e: MeetupEvent }) => (
    <button
      type="button"
      onClick={() => onEdit(e.slug)}
      className="w-full text-left card-accent px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-card/80 transition-colors"
    >
      <div className="sm:w-28 shrink-0">
        <div className="text-sm font-bold text-foreground">{formatEventDateShort(e.date)}</div>
        <div className="text-xs text-muted-foreground">{new Date(e.date).getUTCFullYear()}</div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-foreground truncate">{e.title}</div>
        <div className="text-xs text-muted-foreground font-mono">/events/{e.slug}</div>
      </div>
      <div className="text-xs text-muted-foreground sm:w-48">
        <div>Pioneer: {e.builderDemo?.presenter ?? 'TBD'}</div>
        <div>Topics: {e.topics.length || 'TBD'}</div>
      </div>
      <EventPills e={e} published={data.published} />
    </button>
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={onNew} disabled={!ready}>
          <CalendarPlus className="size-4" /> New event
        </Button>
        <Button variant="outline" onClick={data.refetch}>
          <RefreshCw className="size-4" /> Refresh
        </Button>
        {data.isLoading && <span className="text-sm text-muted-foreground">Loading from Nostr…</span>}
        {data.isError && (
          <span className="text-sm text-destructive">
            Couldn't reach Nostr -- showing the backup list. New events are disabled until it loads.
          </span>
        )}
      </div>

      {ready && unpublished.length > 0 && (
        <div className="card-accent p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div>
            <div className="font-bold text-foreground">
              {unpublished.length} event{unpublished.length === 1 ? ' is' : 's are'} only in the site's backup file
            </div>
            <p className="text-sm text-muted-foreground">
              Publish them to Nostr so everything is managed here. The site looks the same afterward.
            </p>
          </div>
          <Button onClick={() => setConfirmMigrate(true)} disabled={isPending}>
            <UploadCloud className="size-4" /> Publish to Nostr
          </Button>
        </div>
      )}

      <section className="space-y-3">
        <div className="pioneer-label">Upcoming</div>
        {upcoming.length === 0 && <p className="text-sm text-muted-foreground">Nothing scheduled.</p>}
        {upcoming.map((e) => (
          <Row key={e.slug} e={e} />
        ))}
      </section>

      <section className="space-y-3">
        <div className="pioneer-label">Past, cancelled &amp; moved</div>
        {past.map((e) => (
          <Row key={e.slug} e={e} />
        ))}
      </section>

      <AlertDialog open={confirmMigrate} onOpenChange={setConfirmMigrate}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish {unpublished.length} events to Nostr?</AlertDialogTitle>
            <AlertDialogDescription>
              {unpublished.map((e) => e.slug).join(', ')} will be signed with your account and published,
              along with their pioneers and topics. You can edit any of them afterward.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Not now</AlertDialogCancel>
            <AlertDialogAction onClick={migrate} disabled={isPending}>
              {isPending ? 'Publishing…' : 'Publish'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Editor ──────────────────────────────────────────────────────

function EventEditor({
  data,
  slug,
  onDone,
  onOpen,
}: {
  data: MeetupEvents;
  slug: string | null;
  onDone: () => void;
  onOpen: (slug: string) => void;
}) {
  const existing = slug ? data.bySlug(slug) : undefined;
  const isNew = !existing;
  const taken = useMemo(() => takenSlugs(data.all), [data.all]);

  const [form, setForm] = useState<EventForm>(() =>
    existing ? eventToForm(existing) : newEventForm(nextDefaultDay(data.all), taken),
  );
  const [shortName, setShortName] = useState('');
  const [program, setProgram] = useState<EventProgram>(() => (existing ? programOf(existing) : EMPTY_PROGRAM));
  const [showErrors, setShowErrors] = useState(false);
  const [confirm, setConfirm] = useState<null | 'cancel' | 'restore'>(null);
  const [moving, setMoving] = useState(false);
  const [move, setMove] = useState({ day: form.day, startTime: form.startTime, endTime: form.endTime });
  const { run, isPending } = usePublisher();

  const errors = validateEventForm(form);
  const shownErrors = showErrors ? errors : {};
  const detailsDirty = !existing || JSON.stringify(eventToForm(existing)) !== JSON.stringify(form);
  const programDirty = JSON.stringify(cleanProgram(existing ? programOf(existing) : EMPTY_PROGRAM)) !== JSON.stringify(cleanProgram(program));

  const saveDetails = async () => {
    setShowErrors(true);
    if (Object.keys(errors).length) return;
    // Re-check the ID right before saving so a new event can never replace another one.
    const finalSlug = isNew ? suggestSlug(form.day, taken, shortName) : form.slug;
    const fields = formToCalendarFields({ ...form, slug: finalSlug }, existing);
    const templates = [buildCalendarEvent(fields)];
    if (isNew) templates.push(buildCalendarList([...data.all.map((e) => e.slug), finalSlug]));
    if (await run(templates, isNew ? 'Event created' : 'Event updated')) {
      if (isNew) onOpen(finalSlug);
    }
  };

  const saveProgram = async () => {
    if (!existing) return;
    const clean = cleanProgram(program);
    if (await run([buildProgramEvent(existing.slug, clean)], 'Program saved')) setProgram(clean);
  };

  const setState = async (state: 'active' | 'cancelled') => {
    if (!existing) return;
    const fields = { ...toCalendarFields(existing), state, rescheduledTo: undefined };
    await run([buildCalendarEvent(fields)], state === 'cancelled' ? 'Event cancelled' : 'Event restored');
    setConfirm(null);
  };

  const reschedule = async () => {
    if (!existing) return;
    const plan = planReschedule(existing, move.day, move.startTime, move.endTime, taken);
    const templates = [buildCalendarEvent(plan.next), buildCalendarEvent(plan.old)];
    const prog = cleanProgram(program);
    if (hasProgram(prog)) templates.push(buildProgramEvent(plan.next.slug, prog));
    templates.push(buildCalendarList([...data.all.map((e) => e.slug), plan.next.slug]));
    if (await run(templates, `Moved to ${formatEventDate(new Date(`${move.day}T12:00:00Z`).toISOString())}`)) {
      setMoving(false);
      onOpen(plan.next.slug);
    }
  };

  const moveErrors = validateEventForm({ ...form, slug: move.day, day: move.day, startTime: move.startTime, endTime: move.endTime });
  const canMove = !moveErrors.day && !moveErrors.startTime && !moveErrors.endTime && move.day !== form.day && !data.isError;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" onClick={onDone}>
          <ArrowLeft className="size-4" /> All events
        </Button>
        {existing && (
          <>
            <EventPills e={existing} published={data.published} />
            <Link
              to={`/events/${existing.slug}`}
              target="_blank"
              className="ml-auto inline-flex items-center gap-1.5 text-sm text-[#1E8EFF] hover:underline"
            >
              View on site <ExternalLink className="size-3.5" />
            </Link>
          </>
        )}
      </div>

      <h2 className="text-3xl font-extrabold text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
        {existing?.title ?? 'New event'}
      </h2>

      {existing?.state === 'rescheduled' && (
        <p className="text-sm text-amber-400">
          This event was moved to{' '}
          <button className="underline" onClick={() => onOpen(existing.rescheduledTo!)}>
            {existing.rescheduledTo}
          </button>
          . Its old link forwards there.
        </p>
      )}

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Event details</TabsTrigger>
          <TabsTrigger value="program" disabled={isNew}>
            Pioneer &amp; topics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="pt-6 space-y-6">
          <EventDetailsForm
            form={form}
            onChange={setForm}
            errors={shownErrors}
            isNew={isNew}
            shortName={shortName}
            onShortNameChange={setShortName}
            taken={taken}
          />
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border">
            <Button onClick={saveDetails} disabled={isPending || !detailsDirty || (isNew && data.isError)}>
              {isPending ? 'Saving…' : isNew ? 'Create event' : 'Save changes'}
            </Button>
            {isNew && <span className="text-xs text-muted-foreground">Add the pioneer and topics after creating it.</span>}
            {existing && existing.state !== 'rescheduled' && (
              <div className="ml-auto flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => setMoving(true)} disabled={isPending}>
                  Reschedule…
                </Button>
                {existing.state === 'cancelled' ? (
                  <Button variant="outline" onClick={() => setConfirm('restore')} disabled={isPending}>
                    Restore event
                  </Button>
                ) : (
                  <Button variant="outline" className="text-destructive" onClick={() => setConfirm('cancel')} disabled={isPending}>
                    Cancel event
                  </Button>
                )}
              </div>
            )}
          </div>
          {existing && detailsDirty && <p className="text-xs text-amber-400">Unsaved changes</p>}
        </TabsContent>

        <TabsContent value="program" className="pt-6 space-y-6">
          <ProgramEditor program={program} onChange={setProgram} />
          <div className="flex items-center gap-3 pt-2 border-t border-border">
            <Button onClick={saveProgram} disabled={isPending || !programDirty}>
              {isPending ? 'Saving…' : 'Save pioneer & topics'}
            </Button>
            {programDirty && <span className="text-xs text-amber-400">Unsaved changes</span>}
          </div>
        </TabsContent>
      </Tabs>

      {/* Cancel / restore */}
      <AlertDialog open={confirm !== null} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirm === 'cancel' ? 'Cancel this event?' : 'Restore this event?'}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirm === 'cancel'
                ? 'It leaves the home page and archive, its page shows "Cancelled", and the RSVP button is hidden. You can restore it later. Remember to cancel it on Meetup.com too.'
                : 'It goes back to normal on the site.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Back</AlertDialogCancel>
            <AlertDialogAction onClick={() => setState(confirm === 'cancel' ? 'cancelled' : 'active')}>
              {confirm === 'cancel' ? 'Cancel event' : 'Restore'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reschedule */}
      <AlertDialog open={moving} onOpenChange={setMoving}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reschedule</AlertDialogTitle>
            <AlertDialogDescription>
              Creates the event on the new date (with its pioneer and topics) and forwards the old link to it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="mv-day">New date</Label>
              <Input id="mv-day" type="date" value={move.day} onChange={(e) => setMove({ ...move, day: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mv-start">Start</Label>
              <Input id="mv-start" type="time" value={move.startTime} onChange={(e) => setMove({ ...move, startTime: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mv-end">End</Label>
              <Input id="mv-end" type="time" value={move.endTime} onChange={(e) => setMove({ ...move, endTime: e.target.value })} />
            </div>
          </div>
          {existing && canMove && (
            <p className="text-xs text-muted-foreground">
              New link: /events/{planReschedule(existing, move.day, move.startTime, move.endTime, taken).next.slug}. Update the date on Meetup.com too.
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Back</AlertDialogCancel>
            <AlertDialogAction onClick={reschedule} disabled={!canMove || isPending}>
              Move event
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────

const AdminPage = () => {
  useSeoMeta({ title: 'Admin — Northstar Pioneers', robots: 'noindex, nofollow' });
  const { user } = useCurrentUser();
  const data = useMeetupEvents();
  const [view, setView] = useState<{ mode: 'list' } | { mode: 'edit'; slug: string | null }>({ mode: 'list' });

  const isAdmin = user?.pubkey === NSP_ADMIN_PUBKEY;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div>
            <div className="pioneer-label mb-2">Organizer</div>
            <h1 className="font-black uppercase text-4xl text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Event <span className="text-[#1E8EFF]">Admin</span>
            </h1>
          </div>
          <LoginArea label="Sign in" />
        </div>

        {!user && (
          <div className="card-accent p-8 max-w-xl space-y-3">
            <h2 className="text-xl font-bold">Sign in with the organizer account</h2>
            <p className="text-sm text-muted-foreground">
              Use a Nostr browser extension (like Alby or nos2x) or a signer app so your private key never
              touches this site. Pasting a key works too, but it's stored in this browser.
            </p>
          </div>
        )}

        {user && !isAdmin && (
          <div className="card-accent p-8 max-w-xl space-y-3">
            <h2 className="text-xl font-bold">This isn't the organizer account</h2>
            <p className="text-sm text-muted-foreground">You're signed in as</p>
            <p className="font-mono text-xs break-all">{nip19.npubEncode(user.pubkey)}</p>
            <p className="text-sm text-muted-foreground">Only this account can manage events:</p>
            <p className="font-mono text-xs break-all">{nip19.npubEncode(NSP_ADMIN_PUBKEY)}</p>
          </div>
        )}

        {isAdmin &&
          (view.mode === 'list' ? (
            <EventList data={data} onEdit={(slug) => setView({ mode: 'edit', slug })} onNew={() => setView({ mode: 'edit', slug: null })} />
          ) : (
            <EventEditor
              key={view.slug ?? 'new'}
              data={data}
              slug={view.slug}
              onDone={() => setView({ mode: 'list' })}
              onOpen={(slug) => setView({ mode: 'edit', slug })}
            />
          ))}
      </div>
      <SiteFooter />
    </div>
  );
};

export default AdminPage;
