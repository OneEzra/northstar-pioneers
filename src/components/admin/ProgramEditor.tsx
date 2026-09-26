import { useRef } from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2, Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/useToast';
import { useUploadFile } from '@/hooks/useUploadFile';
import type { EventProgram, Resource, ResourceType, Topic } from '@/data/events';
import { paragraphsToText, textToParagraphs } from '@/lib/nspAdmin';

type Demo = NonNullable<EventProgram['builderDemo']>;
const EMPTY_DEMO: Demo = { title: '', presenter: '', description: '' };
const RESOURCE_TYPES: ResourceType[] = ['link', 'slides', 'video', 'demo', 'speaker'];

function Small({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <Label htmlFor={htmlFor} className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
      {children}
    </Label>
  );
}

/** Upload an image to the app's media servers and hand back its URL. */
function UploadButton({ onUploaded, label = 'Upload' }: { onUploaded: (url: string) => void; label?: string }) {
  const input = useRef<HTMLInputElement>(null);
  const { mutateAsync, isPending } = useUploadFile();
  const { toast } = useToast();
  return (
    <>
      <input
        ref={input}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = '';
          if (!file) return;
          try {
            const tags = await mutateAsync(file);
            const url = tags.find(([name]) => name === 'url')?.[1] ?? tags[0]?.[1];
            if (url) onUploaded(url);
          } catch (err) {
            toast({ title: 'Upload failed', description: err instanceof Error ? err.message : String(err), variant: 'destructive' });
          }
        }}
      />
      <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={() => input.current?.click()}>
        <Upload className="size-3.5" /> {isPending ? 'Uploading…' : label}
      </Button>
    </>
  );
}

function ResourceRows({ value, onChange }: { value?: Resource[]; onChange: (list: Resource[]) => void }) {
  const list = value ?? [];
  const update = (i: number, patch: Partial<Resource>) => onChange(list.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  return (
    <div className="space-y-2">
      {list.map((r, i) => (
        <div key={i} className="grid grid-cols-[110px_1fr_2fr_auto] gap-2 items-center">
          <select
            aria-label="Link type"
            className="h-9 rounded-md border border-border bg-background px-2 text-sm"
            value={r.type}
            onChange={(e) => update(i, { type: e.target.value as ResourceType })}
          >
            {RESOURCE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <Input aria-label="Link label" placeholder="Label" value={r.label} onChange={(e) => update(i, { label: e.target.value })} />
          <Input aria-label="Link URL" placeholder="https://…" value={r.url} onChange={(e) => update(i, { url: e.target.value })} />
          <Button type="button" variant="ghost" size="icon" aria-label="Remove link" onClick={() => onChange(list.filter((_, j) => j !== i))}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...list, { type: 'link', label: '', url: '' }])}>
        <Plus className="size-3.5" /> Add link
      </Button>
    </div>
  );
}

function TopicEditor({
  topic,
  index,
  count,
  onChange,
  onRemove,
  onMove,
}: {
  topic: Topic;
  index: number;
  count: number;
  onChange: (t: Topic) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
}) {
  const set = (patch: Partial<Topic>) => onChange({ ...topic, ...patch });
  const id = `topic-${index}`;
  return (
    <div className="card-accent p-5 space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-[#1E8EFF] font-mono text-sm font-bold">{String(index + 1).padStart(2, '0')}</span>
        <Input aria-label="Topic title" placeholder="Topic title" value={topic.title} onChange={(e) => set({ title: e.target.value })} />
        <Button type="button" variant="ghost" size="icon" aria-label="Move up" disabled={index === 0} onClick={() => onMove(-1)}>
          <ArrowUp className="size-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" aria-label="Move down" disabled={index === count - 1} onClick={() => onMove(1)}>
          <ArrowDown className="size-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" aria-label="Remove topic" onClick={onRemove}>
          <Trash2 className="size-4" />
        </Button>
      </div>
      <div className="space-y-1.5">
        <Small htmlFor={`${id}-desc`}>Overview</Small>
        <Textarea id={`${id}-desc`} rows={2} value={topic.description ?? ''} onChange={(e) => set({ description: e.target.value })} />
      </div>
      <div className="space-y-1.5">
        <Small htmlFor={`${id}-more`}>Read more (blank line between paragraphs)</Small>
        <Textarea
          id={`${id}-more`}
          rows={4}
          value={paragraphsToText(topic.expandedContent)}
          onChange={(e) => set({ expandedContent: textToParagraphs(e.target.value) })}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_auto] gap-2 items-end">
        <div className="space-y-1.5">
          <Small htmlFor={`${id}-img`}>Image</Small>
          <Input id={`${id}-img`} placeholder="https://…" value={topic.expandedImageUrl ?? ''} onChange={(e) => set({ expandedImageUrl: e.target.value })} />
        </div>
        <Input aria-label="Image description" placeholder="Image description" value={topic.expandedImageAlt ?? ''} onChange={(e) => set({ expandedImageAlt: e.target.value })} />
        <UploadButton onUploaded={(url) => set({ expandedImageUrl: url })} />
      </div>
      <div className="space-y-1.5">
        <Small>Links</Small>
        <ResourceRows value={topic.resources} onChange={(resources) => set({ resources })} />
      </div>
    </div>
  );
}

export function ProgramEditor({ program, onChange }: { program: EventProgram; onChange: (p: EventProgram) => void }) {
  const demo = program.builderDemo ?? EMPTY_DEMO;
  const setDemo = (patch: Partial<Demo>) => onChange({ ...program, builderDemo: { ...demo, ...patch } });
  const setTopics = (topics: Topic[]) => onChange({ ...program, topics });
  const topics = program.topics;

  return (
    <div className="space-y-10">
      {/* Featured pioneer */}
      <section className="space-y-4">
        <div className="pioneer-label">Featured Pioneer</div>
        <p className="text-sm text-muted-foreground">Leave the name blank until you know who's presenting -- the site shows "TBD".</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Small htmlFor="p-name">Name</Small>
            <Input id="p-name" value={demo.presenter} onChange={(e) => setDemo({ presenter: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Small htmlFor="p-title">Demo title</Small>
            <Input id="p-title" value={demo.title} onChange={(e) => setDemo({ title: e.target.value })} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Small htmlFor="p-desc">What they'll show</Small>
          <Textarea id="p-desc" rows={3} value={demo.description} onChange={(e) => setDemo({ description: e.target.value })} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Small htmlFor="p-web">Website</Small>
            <Input id="p-web" placeholder="https://…" value={demo.presenterUrl ?? ''} onChange={(e) => setDemo({ presenterUrl: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Small htmlFor="p-li">LinkedIn</Small>
            <Input id="p-li" placeholder="https://www.linkedin.com/in/…" value={demo.presenterLinkedIn ?? ''} onChange={(e) => setDemo({ presenterLinkedIn: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Small htmlFor="p-tg">Telegram handle</Small>
            <Input id="p-tg" placeholder="username" value={demo.presenterTelegram ?? ''} onChange={(e) => setDemo({ presenterTelegram: e.target.value })} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Small>Slides &amp; links</Small>
          <ResourceRows value={demo.resources} onChange={(resources) => setDemo({ resources })} />
        </div>
      </section>

      {/* Topics */}
      <section className="space-y-4">
        <div className="pioneer-label">Socratic Topics</div>
        {topics.length === 0 && <p className="text-sm text-muted-foreground">No topics yet -- the site shows "Topics coming soon".</p>}
        {topics.map((t, i) => (
          <TopicEditor
            key={i}
            topic={t}
            index={i}
            count={topics.length}
            onChange={(nt) => setTopics(topics.map((x, j) => (j === i ? nt : x)))}
            onRemove={() => setTopics(topics.filter((_, j) => j !== i))}
            onMove={(dir) => {
              const next = [...topics];
              [next[i], next[i + dir]] = [next[i + dir], next[i]];
              setTopics(next);
            }}
          />
        ))}
        <Button type="button" variant="outline" onClick={() => setTopics([...topics, { title: '' }])}>
          <Plus className="size-4" /> Add topic
        </Button>
      </section>

      {/* After the event */}
      <section className="space-y-4">
        <div className="pioneer-label">After the Event</div>
        <div className="grid grid-cols-1 sm:grid-cols-[2fr_auto_1fr] gap-4 items-end">
          <div className="space-y-1.5">
            <Small htmlFor="photo">Event photo</Small>
            <Input id="photo" placeholder="https://…" value={program.photoUrl ?? ''} onChange={(e) => onChange({ ...program, photoUrl: e.target.value })} />
          </div>
          <UploadButton onUploaded={(url) => onChange({ ...program, photoUrl: url })} />
          <div className="space-y-1.5">
            <Small htmlFor="attendees">Attendees</Small>
            <Input
              id="attendees"
              type="number"
              min={0}
              value={program.attendees ?? ''}
              onChange={(e) => onChange({ ...program, attendees: e.target.value ? Number(e.target.value) : undefined })}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
