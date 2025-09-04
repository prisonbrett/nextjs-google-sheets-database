// components/DateField.jsx
import React, { useMemo } from 'react';

function frToHtml(dateFr) {
  // "06/11/2025" -> "2025-11-06"
  if (!dateFr) return '';
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(dateFr.trim());
  if (!m) return '';
  const [ , d, M, y ] = m;
  return `${y}-${String(M).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}

function htmlToFr(dateHtml) {
  // "2025-11-06" -> "06/11/2025"
  if (!dateHtml) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateHtml);
  if (!m) return '';
  const [ , y, M, d ] = m;
  return `${d}/${M}/${y}`;
}

export default function DateField({
  value = '',        // attendu: "dd/mm/yyyy" (comme dans ta Sheet)
  onChange,
  className = '',
  disabled = false,
  placeholder = 'jj/mm/aaaa',
}) {
  const htmlValue = useMemo(() => frToHtml(value), [value]);

  return (
    <input
      type="date"
      className={`w-full bg-white border border-zinc-300 rounded px-2 py-1 text-sm
                  hover:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 ${className}`}
      value={htmlValue}
      onChange={(e) => onChange?.(htmlToFr(e.target.value))}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
}