import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { suggestSlug, type EventForm } from '@/lib/nspAdmin';
import { isMeetupEventUrl } from '@/lib/meetup';

interface Props {
  form: EventForm;
  onChange: (form: EventForm) => void;
  errors: Partial<Record<keyof EventForm, string>>;
  /** New events pick their ID from the date (+ optional short name) */
  isNew: boolean;
  shortName: string;
  onShortNameChange: (name: string) => void;
  taken: Set<string>;
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </Label>
      {children}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export function EventDetailsForm({ form, onChange, errors, isNew, shortName, onShortNameChange, taken }: Props) {
  const set = <K extends keyof EventForm>(key: K, value: EventForm[K]) => {
    const next = { ...form, [key]: value };
    if (isNew && key === 'day') next.slug = suggestSlug(String(value), taken, shortName);
    onChange(next);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field id="day" label="Date" error={errors.day}>
          <Input id="day" type="date" value={form.day} onChange={(e) => set('day', e.target.value)} />
        </Field>
        <Field id="start" label="Start (Central)" error={errors.startTime}>
          <Input id="start" type="time" value={form.startTime} onChange={(e) => set('startTime', e.target.value)} />
        </Field>
        <Field id="end" label="End (Central)" error={errors.endTime}>
          <Input id="end" type="time" value={form.endTime} onChange={(e) => set('endTime', e.target.value)} />
        </Field>
      </div>

      {isNew ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            id="shortname"
            label="Short name (optional)"
            hint="Only needed for a second event on the same day, e.g. workshop"
          >
            <Input
              id="shortname"
              value={shortName}
              placeholder="workshop"
              onChange={(e) => {
                onShortNameChange(e.target.value);
                onChange({ ...form, slug: suggestSlug(form.day, taken, e.target.value) });
              }}
            />
          </Field>
          <Field id="slug" label="Event ID / link" error={errors.slug} hint="Set automatically -- never reuses an existing ID">
            <div className="h-9 flex items-center px-3 rounded-md border border-border bg-muted/40 font-mono text-sm">
              /events/{form.slug}
            </div>
          </Field>
        </div>
      ) : (
        <Field id="slug" label="Event ID / link" hint="Fixed once published. To change the date, use Reschedule.">
          <div className="h-9 flex items-center px-3 rounded-md border border-border bg-muted/40 font-mono text-sm">
            /events/{form.slug}
          </div>
        </Field>
      )}

      <Field id="title" label="Title" error={errors.title}>
        <Input id="title" value={form.title} onChange={(e) => set('title', e.target.value)} />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field id="venue" label="Venue" error={errors.venue}>
          <Input id="venue" value={form.venue} onChange={(e) => set('venue', e.target.value)} />
        </Field>
        <div className="sm:col-span-2">
          <Field id="address" label="Address">
            <Input id="address" value={form.address} onChange={(e) => set('address', e.target.value)} />
          </Field>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field id="city" label="City (for the date pill)">
          <Input id="city" value={form.city} onChange={(e) => set('city', e.target.value)} />
        </Field>
        <div className="sm:col-span-2">
          <Field
            id="meetup"
            label="Meetup event link"
            error={errors.meetupUrl}
            hint={
              form.meetupUrl && !isMeetupEventUrl(form.meetupUrl)
                ? "This isn't a specific Meetup event page -- RSVP buttons will go to the group instead."
                : 'Create the event on Meetup first, then paste its link here. Until then, RSVP goes to the group page.'
            }
          >
            <Input
              id="meetup"
              type="url"
              value={form.meetupUrl}
              placeholder="https://www.meetup.com/northstar-pioneers/events/…"
              onChange={(e) => set('meetupUrl', e.target.value)}
            />
          </Field>
        </div>
      </div>

      <Field id="summary" label="Summary" hint="One or two sentences, shown on the event card and in Nostr calendar apps">
        <Textarea id="summary" rows={3} value={form.summary} onChange={(e) => set('summary', e.target.value)} />
      </Field>
    </div>
  );
}
