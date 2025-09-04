"use client";

import React from "react";
import Select, { components } from "react-select";

/** Retourne une classe tailwind de pill pastel selon couleur logique */
function colorToBadge(color) {
  switch (color) {
    case "green":
      return "bg-green-100 text-green-800";
    case "red":
      return "bg-red-100 text-red-800";
    case "amber":
      return "bg-amber-100 text-amber-800";
    case "blue":
      return "bg-blue-100 text-blue-800";
    case "slate":
      return "bg-slate-100 text-slate-800";
    case "purple":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-zinc-100 text-zinc-800";
  }
}

// Customisation de l'option (menu déroulant)
const CustomOption = (props) => {
  const { data } = props;
  return (
    <components.Option {...props}>
      <div
        className={[
          "flex items-center justify-center gap-2 rounded-full px-3 py-1 text-sm font-medium",
          colorToBadge(data.color),
        ].join(" ")}
      >
        <span className="text-base">{data.emoji}</span>
        <span className="whitespace-nowrap">{data.label}</span>
      </div>
    </components.Option>
  );
};

// Customisation de la valeur affichée (dans la cellule)
const CustomSingleValue = (props) => {
  const { data } = props;
  return (
    <components.SingleValue {...props}>
      <div
        className={[
          "flex items-center justify-center gap-2 rounded-full px-3 py-1 text-sm font-medium",
          colorToBadge(data.color),
        ].join(" ")}
        style={{ whiteSpace: "nowrap" }} // 🔑 force une seule ligne
      >
        <span className="text-base">{data.emoji}</span>
        <span>{data.label}</span>
      </div>
    </components.SingleValue>
  );
};

export default function SingleSelect({ options, value, onChange, placeholder, className }) {
  return (
    <Select
      options={options}
      value={options.find((o) => o.value === value) || null}
      onChange={(opt) => onChange(opt?.value ?? null)}
      placeholder={placeholder || ""}
      isSearchable={false}
      className={className}
      components={{
        Option: CustomOption,
        SingleValue: CustomSingleValue,
        IndicatorSeparator: () => null, // supprime la barre entre flèche et champ
      }}
      styles={{
        control: (base) => ({
          ...base,
          border: "none",
          boxShadow: "none",
          minHeight: "36px",
        }),
        valueContainer: (base) => ({
          ...base,
          padding: 0,
        }),
        dropdownIndicator: (base) => ({
          ...base,
          padding: "0 4px",
        }),
        menu: (base) => ({
          ...base,
          zIndex: 50,
        }),
      }}
    />
  );
}