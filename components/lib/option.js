// lib/options.js

/** ----- Colonnes de la Google Sheet (ordre exact) ----- */
export const COLUMNS = [
  "🧾 Libellé",
  "💶 Montant TTC",
  "📅 Date de paiement",
  "📎 Facture",
  "🏷️ Catégorie",
  "📌 Type",
  "⏳ Amortissement",
  "🔁 Abonnement",
  "🗓️ Durée",
  "📅 Échéance",
  "⏳ Jours restants",
  "🗓️ Estimation Annuel",
  "🔗 URL Gestion",
  "🏁 Fin prévue",
  "💸 Mensualité",
  "📉 Cumulé à ce jour",
];

/** ----- Colonnes éditables dans l’UI ----- */
export const EDITABLE = new Set([
  "🧾 Libellé",
  "💶 Montant TTC",
  "📅 Date de paiement",
  "📎 Facture",
  "🏷️ Catégorie",
  "📌 Type",
  "⏳ Amortissement",
  "🔁 Abonnement",
  "🗓️ Durée",
  "📅 Échéance",
  "🔗 URL Gestion",
  "🏁 Fin prévue",
  "💸 Mensualité",
]);

/** ----- Options (catégories, types, etc.) ----- */
export const CATEGORIES = [
  { value: "🅿️ Parking",     label: "🅿️ Parking",     color: "blue"},
  { value: "⛽️ Essence",     label: "⛽️ Essence",     color: "red" },
  { value: "⚙️ Software",     label: "⚙️ Software",     color: "amber" },
  { value: "🍽️ Repas",       label: "🍽️ Repas",       color: "yellow" },
  { value: "📦 Autre",        label: "📦 Autre",        color: "slate" },
  { value: "🗃️ Assets",       label: "🗃️ Assets",       color: "slate" },
  { value: "🤝🏼 Commission",  label: "🤝🏼 Commission",  color: "blue" },
  { value: "🏛️ URSSAF",      label: "🏛️ URSSAF",      color: "green" },
  { value: "🧰 Matériel",     label: "🧰 Matériel",     color: "slate" },
  { value: "🚗 Transport",    label: "🚗 Transport",    color: "red" },
  { value: "🛡️ Assurance",    label: "🛡️ Assurance",    color: "purple" },
];

export const TYPES = [
  { value: "📌 Type",          label: "📌 Type" },
  { value: "⏳ Amortissement", label: "⏳ Amortissement" },
  { value: "🔁 Abonnement",    label: "🔁 Abonnement" },
];

/** ----- Utilitaires d’affichage (pastilles colorées) ----- */
export function badgeByColor(color) {
  switch (color) {
    case "green":  return "bg-green-100 text-green-800";
    case "red":    return "bg-red-100 text-red-800";
    case "yellow": return "bg-amber-100 text-amber-800";
    case "blue":   return "bg-blue-100 text-blue-800";
    case "amber":  return "bg-amber-100 text-amber-800";
    case "purple": return "bg-purple-100 text-purple-800";
    case "slate":  return "bg-slate-100 text-slate-800";
    default:       return "bg-zinc-100 text-zinc-800";
  }
}

/** Tente de retrouver l’option à partir d’une valeur brute Sheet */
export function matchOption(raw, options) {
  if (raw == null) return null;
  const s = String(raw).trim();

  // valeur exacte
  let opt = options.find(o => o.value === s);
  if (opt) return opt;

  // label exact
  opt = options.find(o => o.label === s);
  if (opt) return opt;

  // "EMOJI label"
  opt = options.find(o => `${o.emoji ?? ""} ${o.label}`.trim() === s);
  if (opt) return opt;

  // insensible casse sur label
  opt = options.find(o => o.label?.toLowerCase?.() === s.toLowerCase());
  if (opt) return opt;

  return null;
}