"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import SingleSelect from "./SingleSelect";
import { COLUMNS, EDITABLE, CATEGORIES, TYPES, matchOption } from "./lib/option";

/** Largeurs par défaut (ajuste si besoin) */
const DEFAULT_WIDTHS = {
  "🧾 Libellé": 280,
  "💶 Montant TTC": 120,
  "📅 Date de paiement": 150,
  "📎 Facture": 120,
  "🏷️ Catégorie": 180,
  "📌 Type": 160,
  "⏳ Amortissement": 180,
  "🔁 Abonnement": 170,
  "🗓️ Durée": 110,
  "📅 Échéance": 150,
  "⏳ Jours restants": 130,
  "🗓️ Estimation Annuel": 160,
  "🔗 URL Gestion": 220,
  "🏁 Fin prévue": 150,
  "💸 Mensualité": 130,
  "📉 Cumulé à ce jour": 150,
};

export default function DepensesTable({ rows, onUpdate, onReorder }) {
  // Copie locale si on réordonne côté client
  const [localRows, setLocalRows] = useState(rows || []);
  useEffect(() => setLocalRows(rows || []), [rows]);

  // Largeurs des colonnes
  const [widths, setWidths] = useState(() => {
    const w = {};
    for (const col of COLUMNS) w[col] = DEFAULT_WIDTHS[col] ?? 160;
    return w;
  });

  // --- Redimensionnement (fix : listeners réellement attachés) ---
  const resizeRef = useRef({ col: null, startX: 0, startW: 0 });
  const [isResizing, setIsResizing] = useState(false);

  function startResize(e, col) {
    resizeRef.current = { col, startX: e.clientX, startW: widths[col] || 160 };
    setIsResizing(true);
    // évite sélection de texte pendant le drag
    e.preventDefault();
  }

  useEffect(() => {
    if (!isResizing) return;

    function onMove(e) {
      const { col, startX, startW } = resizeRef.current || {};
      if (!col) return;
      const dx = e.clientX - startX;
      setWidths((prev) => ({
        ...prev,
        [col]: Math.max(80, Math.min(640, (startW ?? 160) + dx)),
      }));
    }
    function onUp() {
      setIsResizing(false);
      resizeRef.current = { col: null, startX: 0, startW: 0 };
      document.body.style.cursor = "";
    }

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    document.body.style.cursor = "col-resize";

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.body.style.cursor = "";
    };
  }, [isResizing]);

  // Grille CSS (1ère col = poignée drag)
  const templateColumns = useMemo(() => {
    const px = ["32px"];
    for (const col of COLUMNS) px.push(`${widths[col]}px`);
    return px.join(" ");
  }, [widths]);

  // Drag & drop de lignes
  const dragIndex = useRef(-1);
  function handleDragStart(i) {
    dragIndex.current = i;
  }
  function handleDrop(i) {
    const from = dragIndex.current;
    const to = i;
    dragIndex.current = -1;
    if (from < 0 || to < 0 || from === to) return;

    const next = [...localRows];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setLocalRows(next);
    onReorder?.(from, to, next);
  }

  return (
 <div className="w-full overflow-x-auto">
  <div className="min-w-fit">
        {/* HEADER sticky (affichage des noms de colonnes) */}
<div
  className="sticky top-0 z-50 grid border-b border-zinc-200 bg-white shadow-sm"
  style={{ gridTemplateColumns: templateColumns }}
>
  {/* Colonne poignée (vide) */}
  <div className="h-11" />

  {COLUMNS.map((col) => (
    <div
      key={col}
      className="relative flex h-11 min-h-[44px] items-center gap-2 px-3
                 text-[13px] font-semibold leading-5 text-gray-900
                 select-none"
      role="columnheader"
      aria-label={col}
      title={col}
    >
      {col}

      {/* poignée de redimensionnement */}
      <div
        onMouseDown={(e) => startResize(e, col)}
        className="absolute right-0 top-0 h-full w-1 cursor-col-resize"
      >
        <div className="absolute -right-1 top-0 h-full w-3" />
      </div>
    </div>
  ))}
</div>
        {/* CORPS : lignes façon Airtable */}
        <div className="divide-y divide-zinc-100">
          {localRows.map((row, i) => (
            <div
              key={i}
              className="grid items-center hover:bg-zinc-50"
              style={{ gridTemplateColumns: templateColumns }}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(i)}
            >
              {/* Poignée drag (⋮⋮) */}
              <div className="flex h-10 items-center justify-center text-zinc-300">
                <span className="-mt-0.5 select-none text-lg leading-none">⋮⋮</span>
              </div>

              {COLUMNS.map((col) => {
                const val = row[col];

                // Catégorie
                if (col === "🏷️ Catégorie") {
                  const initial = matchOption(val, CATEGORIES)?.value ?? null;
                  return (
                    <div key={col} className="px-3 py-1">
                      <SingleSelect
                        className="w-full"
                        options={CATEGORIES}
                        value={initial}
                        onChange={(next) => onUpdate?.(i, col, next)}
                      />
                    </div>
                  );
                }

                // Type
                if (col === "📌 Type") {
                  const initial = matchOption(val, TYPES)?.value ?? null;
                  return (
                    <div key={col} className="px-3 py-1">
                      <SingleSelect
                        className="w-full"
                        options={TYPES}
                        value={initial}
                        onChange={(next) => onUpdate?.(i, col, next)}
                      />
                    </div>
                  );
                }

                // Inputs “flat” (édition inline)
                const editable = EDITABLE.has(col);
                return (
                  <div key={col} className="px-3 py-1">
                    <input
                      className={[
                        "h-9 w-full rounded-md border border-transparent bg-transparent px-2 text-[13px]",
                        "focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400/20",
                        editable ? "" : "opacity-60 cursor-not-allowed",
                      ].join(" ")}
                      disabled={!editable}
                      value={val ?? ""}
                      onChange={(e) => onUpdate?.(i, col, e.target.value)}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}