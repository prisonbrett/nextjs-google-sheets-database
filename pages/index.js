import React, { useEffect, useState } from "react";
import DepensesTable from "../components/DepensesTable";
import { CATEGORIES, TYPES } from "../components/lib/option";
export default function Home() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    (async () => {
      const r = await fetch("/api/depenses");
      const json = await r.json();
      setRows(json.rows || []);
    })();
  }, []);

  async function onUpdate(rowIndex, colKey, newValue) {
    // 1) Optimiste
    setRows((prev) => {
      const next = [...prev];
      next[rowIndex] = { ...next[rowIndex], [colKey]: newValue };
      return next;
    });

    // 2) Sauvegarde serveur
    await fetch("/api/depenses-update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rowIndex, colKey, value: newValue }),
    });
  }

  return (
    <main className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">💰 Dépenses — édition inline</h1>
      <DepensesTable rows={rows} onUpdate={onUpdate} />
    </main>
  );
}