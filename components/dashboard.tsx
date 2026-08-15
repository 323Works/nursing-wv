"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_FILTERS, NURSYS_URL, OFFICIAL_LOOKUP_URL } from "@/lib/constants";
import type { DashboardData, LicenseFilters, LicenseResponse, SortBy } from "@/lib/types";
import FilterPanel from "./filter-panel";
import Results from "./results";
import StatsCards from "./stats-cards";

export default function Dashboard({ dashboardData, initialResult }: { dashboardData: DashboardData; initialResult: LicenseResponse }) {
  const [filters, setFilters] = useState<LicenseFilters>(DEFAULT_FILTERS);
  const [result, setResult] = useState(initialResult);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([]);
  const firstRender = useRef(true);
  const controller = useRef<AbortController | null>(null);

  const fetchResults = useCallback(async (next: LicenseFilters) => {
    controller.current?.abort(); controller.current = new AbortController(); setLoading(true); setError(null);
    try {
      const response = await fetch("/api/licensees", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next), signal: controller.current.signal });
      const body = await response.json(); if (!response.ok) throw new Error(body.error || "Unable to load records"); setResult(body);
    } catch (reason) {
      if (reason instanceof DOMException && reason.name === "AbortError") return;
      setError(reason instanceof Error ? reason.message : "Unable to load records");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    const timer = window.setTimeout(() => void fetchResults(filters), 300);
    return () => { window.clearTimeout(timer); controller.current?.abort(); };
  }, [filters, fetchResults]);

  const changeFilters = (next: LicenseFilters) => { setCursorHistory([]); setFilters(next); };
  const update = (partial: Partial<LicenseFilters>) => changeFilters({ ...filters, ...partial, cursor: null });
  const sort = (sortBy: SortBy) => changeFilters({ ...filters, sort_by: sortBy, sort_dir: filters.sort_by === sortBy && filters.sort_dir === "asc" ? "desc" : "asc", cursor: null });
  const nextPage = () => { if (!result.next_cursor) return; setCursorHistory((history) => [...history, filters.cursor]); setFilters({ ...filters, cursor: result.next_cursor }); };
  const previousPage = () => { const cursor = cursorHistory.at(-1) ?? null; setCursorHistory((history) => history.slice(0, -1)); setFilters({ ...filters, cursor }); };

  return <main>
    <header className="site-header"><a href="https://323works.com" target="_blank" rel="noopener noreferrer"><Image src="/appworks-portfolio-icon.png" width={42} height={42} alt="323 Works" priority/></a><div><h1>WV Nursing Licensing Data</h1><p>West Virginia RN Board public records · June 25, 2025 roster snapshot</p></div><button type="button" onClick={() => (document.getElementById("about-dialog") as HTMLDialogElement)?.showModal()}>About</button></header>
    <StatsCards stats={dashboardData.stats}/>
    <div className="credential-summary" aria-label="Credential breakdown">{dashboardData.credentials.map((item) => <span key={item.credential}><strong>{item.credential}</strong>{item.count.toLocaleString()}</span>)}</div>
    <div className="content"><FilterPanel filters={filters} options={dashboardData.credentials} onUpdate={update} onReset={() => changeFilters(DEFAULT_FILTERS)}/>{error && <div className="error-banner" role="alert">{error}</div>}</div>
    <StatsCards stats={result.stats} filtered/>
    <div className="content"><Results result={result} loading={loading} page={cursorHistory.length + 1} hasPrevious={cursorHistory.length > 0} sortBy={filters.sort_by} sortDir={filters.sort_dir} onSort={sort} onPrevious={previousPage} onNext={nextPage}/></div>
    <footer>Public roster snapshot for informational use only. Verify current licensure with the WV RN Board before relying on a record.</footer>
    <dialog id="about-dialog" className="about-dialog"><form method="dialog"><button className="dialog-x" aria-label="Close">×</button></form><h2>About this dashboard</h2><p>This viewer organizes the West Virginia RN Board roster generated June 25, 2025. It contains 41,901 public license records and is not a live verification service.</p><h3>Prescriptive authority</h3><p>The lapsed marker reflects the Board’s June 30, 2025 prescriptive-authority report. It does not by itself mean the underlying RN or APRN license is lapsed.</p><h3>Verify before relying</h3><p>Use the <a href={OFFICIAL_LOOKUP_URL} target="_blank" rel="noopener noreferrer">WV RN Board lookup</a> or <a href={NURSYS_URL} target="_blank" rel="noopener noreferrer">Nursys QuickConfirm</a> for current status.</p><form method="dialog"><button className="dialog-close">Close</button></form></dialog>
  </main>;
}
