import { Filter, RotateCcw, Search } from "lucide-react";
import type { CredentialOption, LicenseFilters } from "@/lib/types";

export default function FilterPanel({ filters, options, onUpdate, onReset }: { filters: LicenseFilters; options: CredentialOption[]; onUpdate: (partial: Partial<LicenseFilters>) => void; onReset: () => void }) {
  const toggleCredential = (credential: CredentialOption["credential"]) => onUpdate({ credentials: filters.credentials.includes(credential) ? filters.credentials.filter((item) => item !== credential) : [...filters.credentials, credential] });
  return <section className="panel filters-panel">
    <div className="section-title"><Filter aria-hidden="true"/><h2>Search &amp; filters</h2></div>
    <div className="search-grid">
      <label className="field-group"><span className="field-label">Name or license number</span><span className="input-with-icon"><Search aria-hidden="true"/><input value={filters.search} maxLength={100} placeholder="Search names or license number…" onChange={(event) => onUpdate({ search: event.target.value })}/></span></label>
      <label className="field-group"><span className="field-label">Name scope</span><select value={filters.scope} onChange={(event) => onUpdate({ scope: event.target.value as LicenseFilters["scope"] })}><option value="all">All fields + license #</option><option value="first">First name only</option><option value="last">Last name only</option></select></label>
      <label className="field-group"><span className="field-label">Prescriptive authority</span><select value={filters.lapsed} onChange={(event) => onUpdate({ lapsed: event.target.value as LicenseFilters["lapsed"] })}><option value="all">All records</option><option value="lapsed">Flagged lapsed</option><option value="not_lapsed">Not flagged lapsed</option></select></label>
    </div>
    <fieldset className="credential-field"><legend className="field-label">Credentials</legend><div className="credential-options">{options.map((option) => <label key={option.credential} className={filters.credentials.includes(option.credential) ? "selected" : ""}><input type="checkbox" checked={filters.credentials.includes(option.credential)} onChange={() => toggleCredential(option.credential)}/><span>{option.credential}</span><small>{option.count.toLocaleString()}</small></label>)}</div></fieldset>
    <button className="reset-button" onClick={onReset}><RotateCcw aria-hidden="true"/>Clear filters</button>
  </section>;
}
