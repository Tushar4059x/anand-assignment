import { useEffect, useRef, useState } from 'react';

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  formatter?: (v: number) => string;
}

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  decimals = 2,
  duration = 600,
  formatter,
}: AnimatedNumberProps) {
  const [displayed, setDisplayed] = useState(value);
  const startRef = useRef(value);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const from = prevValueRef.current;
    const to = value;
    prevValueRef.current = value;

    if (from === to) return;

    startRef.current = from;
    startTimeRef.current = null;

    const animate = (time: number) => {
      if (!startTimeRef.current) startTimeRef.current = time;
      const elapsed = time - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const current = from + (to - from) * easeOut(progress);
      setDisplayed(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayed(to);
      }
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  const display = formatter
    ? formatter(displayed)
    : `${prefix}${Math.abs(displayed).toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${suffix}`;

  return <span>{display}</span>;
}
