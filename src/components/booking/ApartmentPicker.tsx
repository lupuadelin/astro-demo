import { useEffect, useRef, useState } from 'react';

export interface ApartmentOption {
  slug: string;
  name: string;
  type: string;
  size: string;
  guests: number;
  gradient: string;
}

interface Props {
  options: ApartmentOption[];
  name?: string;
  align?: 'left' | 'right';
  placeholder?: string;
  label?: string;
}

const OPEN_OPTION: ApartmentOption = {
  slug: '',
  name: 'Not sure yet',
  type: 'Show me what fits',
  size: '',
  guests: 0,
  gradient: 'linear-gradient(135deg,#DDD5C5,#6B7A5D)',
};

export default function ApartmentPicker({
  options,
  name = 'apartment',
  align = 'left',
  placeholder = 'Not sure yet',
  label = 'Apartment',
}: Props) {
  const [selected, setSelected] = useState<ApartmentOption>(OPEN_OPTION);
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

  const list: ApartmentOption[] = [OPEN_OPTION, ...options];

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        className={
          'w-full text-left bg-bone border border-sand rounded-lg px-4 py-3 hover:border-clay transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-clay/40 ' +
          (open ? 'border-clay' : '')
        }
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="block text-[11px] uppercase tracking-[0.18em] text-muted-soft font-bold mb-1">{label}</span>
        <span className="flex items-center gap-3">
          <span
            className="w-6 h-6 rounded-full flex-shrink-0"
            style={{ background: selected.gradient }}
            aria-hidden="true"
          />
          <span className="font-semibold text-sm text-espresso truncate">
            {selected.slug ? selected.name : placeholder}
          </span>
          <span className="ml-auto text-clay text-xs" aria-hidden="true">
            {open ? '▴' : '▾'}
          </span>
        </span>
      </button>

      <input type="hidden" name={name} value={selected.slug} />

      {open && (
        <ul
          role="listbox"
          className={
            'absolute top-full mt-2 z-50 w-full min-w-[280px] bg-warm-white border border-sand rounded-2xl shadow-2xl p-2 overflow-hidden ' +
            (align === 'right' ? 'right-0' : 'left-0')
          }
        >
          {list.map((opt) => {
            const active = opt.slug === selected.slug;
            return (
              <li key={opt.slug || '__any'}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  className={
                    'w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ' +
                    (active ? 'bg-cream' : 'hover:bg-cream')
                  }
                  onClick={() => {
                    setSelected(opt);
                    setOpen(false);
                  }}
                >
                  <span
                    className="w-10 h-10 rounded-lg flex-shrink-0"
                    style={{ background: opt.gradient }}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block font-serif text-lg text-espresso truncate">{opt.name}</span>
                    <span className="block text-[11px] text-muted-soft truncate">
                      {opt.slug ? `${opt.type}${opt.size ? ` · ${opt.size}` : ''}${opt.guests ? ` · ${opt.guests} guests` : ''}` : opt.type}
                    </span>
                  </span>
                  {active && <span className="text-clay text-sm">✓</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
