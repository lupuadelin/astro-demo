import { useEffect, useRef, useState, type CSSProperties } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/style.css";

type Variant = "hero" | "stack" | "compact";

interface Props {
  variant?: Variant;
  startLabel?: string;
  endLabel?: string;
  name?: string;
  align?: "left" | "right";
}

const brandStyle = {
  "--rdp-accent-color": "#6B7A5D",
  "--rdp-accent-background-color": "#E7E1D0",
  "--rdp-range_middle-background-color": "#E7E1D0",
  "--rdp-range_middle-color": "#1F1E1A",
  "--rdp-range_start-color": "#FFFFFF",
  "--rdp-range_end-color": "#FFFFFF",
  "--rdp-range_start-date-background-color": "#6B7A5D",
  "--rdp-range_end-date-background-color": "#6B7A5D",
  "--rdp-today-color": "#6B7A5D",
  "--rdp-day-height": "38px",
  "--rdp-day-width": "38px",
  "--rdp-day_button-height": "36px",
  "--rdp-day_button-width": "36px",
  "--rdp-day_button-border-radius": "999px",
  "--rdp-nav_button-height": "2rem",
  "--rdp-nav_button-width": "2rem",
  "--rdp-months-gap": "1.5rem",
  "--rdp-weekday-opacity": "0.65",
  fontFamily: '"Mulish", system-ui, sans-serif',
  color: "#1F1E1A",
} as CSSProperties;

function fmt(d?: Date) {
  return d ? format(d, "EEE d MMM") : "";
}

export default function DateRangePicker({
  variant = "hero",
  startLabel = "Check-in",
  endLabel = "Check-out",
  name,
  align = "left",
}: Props) {
  const [range, setRange] = useState<DateRange | undefined>();
  const [open, setOpen] = useState(false);
  const [months, setMonths] = useState(2);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () =>
      setMonths(window.matchMedia("(min-width: 720px)").matches ? 2 : 1);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  useEffect(() => {
    // react-day-picker v10 range mode: clicking the first date sets { from: d, to: d }
    // (a same-day range). Only auto-close when the user picks a real range (from ≠ to).
    if (
      range?.from &&
      range?.to &&
      range.from.getTime() !== range.to.getTime()
    ) {
      const t = setTimeout(() => setOpen(false), 250);
      return () => clearTimeout(t);
    }
  }, [range]);

  const triggerBase =
    "text-left rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-clay/40";

  let triggersEl: React.ReactNode;
  if (variant === "hero") {
    triggersEl = (
      <div className="flex flex-col md:flex-row gap-3 md:items-stretch flex-1">
        <TriggerCell
          label={startLabel}
          value={fmt(range?.from)}
          onClick={() => setOpen(true)}
          className={triggerBase + " flex-1 px-3 py-1 hover:bg-bone/60"}
          active={open}
        />
        <div className="hidden md:block w-px self-stretch bg-sand" />
        <TriggerCell
          label={endLabel}
          value={fmt(range?.to)}
          onClick={() => setOpen(true)}
          className={triggerBase + " flex-1 px-3 py-1 hover:bg-bone/60"}
          active={open}
        />
      </div>
    );
  } else if (variant === "stack") {
    triggersEl = (
      <div className="grid grid-cols-2 gap-3">
        <TriggerCell
          label={startLabel}
          value={fmt(range?.from)}
          onClick={() => setOpen(true)}
          className={
            triggerBase +
            " bg-bone border border-sand rounded-lg px-3 py-2 hover:border-clay " +
            (open ? "border-clay" : "")
          }
          active={open}
        />
        <TriggerCell
          label={endLabel}
          value={fmt(range?.to)}
          onClick={() => setOpen(true)}
          className={
            triggerBase +
            " bg-bone border border-sand rounded-lg px-3 py-2 hover:border-clay " +
            (open ? "border-clay" : "")
          }
          active={open}
        />
      </div>
    );
  } else {
    triggersEl = (
      <div className="grid grid-cols-2 gap-3">
        <TriggerCell
          label={startLabel}
          value={fmt(range?.from)}
          onClick={() => setOpen(true)}
          className={
            triggerBase +
            " bg-bone border border-sand rounded-lg px-4 py-3 hover:border-clay " +
            (open ? "border-clay" : "")
          }
          active={open}
        />
        <TriggerCell
          label={endLabel}
          value={fmt(range?.to)}
          onClick={() => setOpen(true)}
          className={
            triggerBase +
            " bg-bone border border-sand rounded-lg px-4 py-3 hover:border-clay " +
            (open ? "border-clay" : "")
          }
          active={open}
        />
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="relative flex-1 w-full">
      {triggersEl}
      {name && (
        <>
          <input
            type="hidden"
            name={`${name}From`}
            value={range?.from ? range.from.toISOString().slice(0, 10) : ""}
          />
          <input
            type="hidden"
            name={`${name}To`}
            value={range?.to ? range.to.toISOString().slice(0, 10) : ""}
          />
        </>
      )}

      {open && (
        <div
          className={
            "absolute top-full mt-2 z-50 bg-warm-white border border-sand rounded-2xl shadow-2xl p-4 md:p-5 " +
            (align === "right" ? "right-0" : "left-0")
          }
          role="dialog"
          aria-label="Choose dates"
        >
          <DayPicker
            mode="range"
            selected={range}
            onSelect={setRange}
            numberOfMonths={months}
            disabled={{ before: new Date() }}
            style={brandStyle}
            weekStartsOn={1}
            classNames={{
              caption_label: "font-serif text-lg font-medium",
              weekday:
                "text-[10px] uppercase tracking-[0.16em] text-muted-soft font-bold",
              nav_button:
                "bg-warm-white border border-sand rounded-full hover:border-clay text-espresso transition-colors",
            }}
          />
          <div className="mt-3 pt-3 border-t border-sand flex items-center justify-between gap-3">
            <div className="text-[11px] text-muted-soft">
              {range?.from && range?.to
                ? `${fmt(range.from)} → ${fmt(range.to)}`
                : range?.from
                  ? "Choose your check-out date"
                  : "Choose your check-in date"}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="text-xs font-bold text-muted-soft hover:text-espresso px-2 py-1"
                onClick={() => setRange(undefined)}
              >
                Clear
              </button>
              <button
                type="button"
                className="text-xs font-bold text-white bg-clay hover:bg-clay-hover rounded-full px-3 py-1.5"
                onClick={() => setOpen(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TriggerCell({
  label,
  value,
  onClick,
  className,
  active,
}: {
  label: string;
  value: string;
  onClick: () => void;
  className?: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
      aria-expanded={active}
    >
      <span className="block text-[11px] uppercase tracking-[0.18em] text-muted-soft font-bold mb-1">
        {label}
      </span>
      <span className="block text-espresso font-semibold text-sm truncate">
        {value || <span className="text-muted-soft font-normal">Add date</span>}
      </span>
    </button>
  );
}
