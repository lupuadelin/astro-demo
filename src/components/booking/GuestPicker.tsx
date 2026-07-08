import { useEffect, useRef, useState } from 'react';

type Variant = 'inline' | 'field';

interface Props {
  variant?: Variant;
  maxTotal?: number;
  align?: 'left' | 'right';
  name?: string;
}

interface Group {
  key: 'adults' | 'children' | 'infants';
  label: string;
  sub: string;
  min: number;
  countsToTotal: boolean;
}

const groups: Group[] = [
  { key: 'adults', label: 'Adults', sub: '13 years or above', min: 1, countsToTotal: true },
  { key: 'children', label: 'Children', sub: 'Ages 2 – 12', min: 0, countsToTotal: true },
  { key: 'infants', label: 'Infants', sub: 'Under 2', min: 0, countsToTotal: false },
];

export default function GuestPicker({
  variant = 'field',
  maxTotal = 6,
  align = 'left',
  name,
}: Props) {
  const [counts, setCounts] = useState({ adults: 2, children: 0, infants: 0 });
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  const total = counts.adults + counts.children;
  const summary =
    total === 1 && counts.infants === 0
      ? '1 guest'
      : `${total} guest${total === 1 ? '' : 's'}${counts.infants > 0 ? ` · ${counts.infants} infant${counts.infants === 1 ? '' : 's'}` : ''}`;

  function step(key: Group['key'], delta: number) {
    setCounts((prev) => {
      const next = { ...prev, [key]: Math.max(0, prev[key] + delta) };
      const group = groups.find((g) => g.key === key)!;
      if (next[key] < group.min) next[key] = group.min;
      const nextTotal = next.adults + next.children;
      if (delta > 0 && nextTotal > maxTotal && group.countsToTotal) return prev;
      return next;
    });
  }

  const triggerClass =
    variant === 'inline'
      ? 'w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-clay/40 rounded-lg px-3 py-1 hover:bg-bone/60 transition-colors'
      : 'w-full text-left bg-bone border border-sand rounded-lg px-3 py-2 hover:border-clay transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-clay/40 ' +
        (open ? 'border-clay' : '');

  return (
    <div ref={wrapRef} className="relative flex-1 w-full">
      <button
        type="button"
        className={triggerClass}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <span className="block text-[11px] uppercase tracking-[0.18em] text-muted-soft font-bold mb-1">Guests</span>
        <span className="block text-espresso font-semibold text-sm truncate">{summary}</span>
      </button>

      {name && (
        <>
          <input type="hidden" name={`${name}Adults`} value={counts.adults} />
          <input type="hidden" name={`${name}Children`} value={counts.children} />
          <input type="hidden" name={`${name}Infants`} value={counts.infants} />
        </>
      )}

      {open && (
        <div
          className={
            'absolute top-full mt-2 z-50 w-[320px] bg-warm-white border border-sand rounded-2xl shadow-2xl p-5 ' +
            (align === 'right' ? 'right-0' : 'left-0')
          }
          role="dialog"
          aria-label="Choose guests"
        >
          <ul className="space-y-4">
            {groups.map((g) => {
              const value = counts[g.key];
              const atMin = value <= g.min;
              const atMax = g.countsToTotal && total >= maxTotal;
              return (
                <li key={g.key} className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-serif text-lg text-espresso">{g.label}</div>
                    <div className="text-xs text-muted-soft">{g.sub}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Stepper aria-label={`Decrease ${g.label}`} disabled={atMin} onClick={() => step(g.key, -1)}>
                      –
                    </Stepper>
                    <span className="w-6 text-center font-semibold text-sm tabular-nums">{value}</span>
                    <Stepper aria-label={`Increase ${g.label}`} disabled={atMax} onClick={() => step(g.key, +1)}>
                      +
                    </Stepper>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-5 pt-4 border-t border-sand flex items-center justify-between gap-3">
            <div className="text-[11px] text-muted-soft">
              Max {maxTotal} guests · infants stay free
            </div>
            <button
              type="button"
              className="text-xs font-bold text-white bg-clay hover:bg-clay-hover rounded-full px-3 py-1.5"
              onClick={() => setOpen(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Stepper({
  children,
  disabled,
  onClick,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-8 h-8 rounded-full border border-sand text-espresso font-bold text-lg leading-none flex items-center justify-center hover:border-clay hover:text-clay disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-sand disabled:hover:text-espresso transition-colors"
      {...rest}
    >
      {children}
    </button>
  );
}
