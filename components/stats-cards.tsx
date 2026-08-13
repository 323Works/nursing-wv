import { BadgeCheck, KeyRound, ListChecks, Stethoscope, TriangleAlert } from "lucide-react";
import type { DatasetStats, FilteredStats } from "@/lib/types";

export default function StatsCards({ stats, filtered = false }: { stats: DatasetStats | FilteredStats; filtered?: boolean }) {
  const filteredStats = stats as FilteredStats;
  const cards = filtered ? [
    { label: "Matching records", value: filteredStats.count, icon: ListChecks },
    { label: "Credential types", value: filteredStats.credential_types, icon: BadgeCheck },
    { label: "Lapsed authority", value: filteredStats.lapsed_authority, icon: TriangleAlert },
  ] : [
    { label: "License records", value: (stats as DatasetStats).total_records, icon: ListChecks },
    { label: "Distinct licenses", value: (stats as DatasetStats).distinct_licenses, icon: KeyRound },
    { label: "Registered nurses", value: (stats as DatasetStats).registered_nurses, icon: BadgeCheck },
    { label: "APRN records", value: (stats as DatasetStats).aprn_records, icon: Stethoscope },
    { label: "Lapsed authority", value: (stats as DatasetStats).lapsed_authority, icon: TriangleAlert },
  ];
  return <section className={`stats-wrap ${filtered ? "filtered" : ""}`} aria-label={filtered ? "Filtered summary" : "Dataset summary"}>{cards.map(({ label, value, icon: Icon }) => <article className="stat-card" key={label}><Icon aria-hidden="true"/><strong>{value.toLocaleString()}</strong><span>{label}</span></article>)}</section>;
}
