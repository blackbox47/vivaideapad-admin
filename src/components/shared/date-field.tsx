import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { startOfDay } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent } from '@/components/ui/popover';
import {
  formatConceptDate,
  parseTypedConceptDate,
} from '@/utils/helpers/concept-date';

interface DateFieldProps {
  id: string;
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabledBefore?: Date;
}

export default function DateField({
  id,
  value,
  onChange,
  placeholder,
  disabledBefore,
}: DateFieldProps) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const isFocusedRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [popupWidth, setPopupWidth] = useState<number>();
  const [text, setText] = useState(() =>
    value ? formatConceptDate(value) : '',
  );

  useEffect(() => {
    if (isFocusedRef.current) return;
    if (fieldRef.current?.contains(document.activeElement)) return;
    setText(value ? formatConceptDate(value) : '');
  }, [value]);

  useLayoutEffect(() => {
    if (!open) return;
    const width = fieldRef.current?.getBoundingClientRect().width;
    if (width) {
      setPopupWidth(width);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (fieldRef.current?.contains(target)) return;
      if (target instanceof Element && target.closest('[data-slot="popover-content"]')) {
        return;
      }
      setOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  const isBlocked = (date: Date) =>
    Boolean(disabledBefore && date < startOfDay(disabledBefore));

  const commitText = (raw: string, formatOnSuccess: boolean): boolean => {
    const trimmed = raw.trim();
    if (!trimmed) {
      onChange(undefined);
      if (formatOnSuccess) {
        setText('');
      }
      return true;
    }

    const parsed = parseTypedConceptDate(trimmed);
    if (!parsed || isBlocked(parsed)) {
      return false;
    }

    onChange(parsed);
    if (formatOnSuccess) {
      setText(formatConceptDate(parsed));
    }
    return true;
  };

  return (
    <div ref={fieldRef} className="relative w-full">
      <Input
        id={id}
        value={text}
        placeholder={placeholder}
        autoComplete="off"
        className="pr-10"
        onFocus={() => {
          isFocusedRef.current = true;
        }}
        onChange={(event) => {
          const next = event.target.value;
          setText(next);
          commitText(next, false);
        }}
        onBlur={() => {
          isFocusedRef.current = false;
          const committed = commitText(text, true);
          if (!committed) {
            setText(value ? formatConceptDate(value) : '');
          }
        }}
      />
      <button
        type="button"
        aria-label="Open calendar"
        aria-expanded={open}
        aria-haspopup="dialog"
        className="absolute top-1/2 right-3 z-10 inline-flex size-4 -translate-y-1/2 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-muted-foreground hover:text-primary"
        onClick={() => setOpen((current) => !current)}
      >
        <CalendarIcon className="size-4" />
      </button>
      <Popover open={open}>
        <PopoverContent
          anchor={fieldRef}
          align="start"
          className="border border-border bg-card p-0"
          style={popupWidth ? { width: popupWidth } : undefined}
        >
          <Calendar
            mode="single"
            className="w-full"
            selected={value}
            onSelect={(date) => {
              onChange(date);
              setText(date ? formatConceptDate(date) : '');
              if (date) {
                setOpen(false);
              }
            }}
            disabled={disabledBefore ? { before: disabledBefore } : undefined}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
