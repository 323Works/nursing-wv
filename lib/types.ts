export const CREDENTIALS = ["RN", "APRN-CNP", "APRN-CRNA", "DT", "TLHT-RN", "APRN-CNM", "APRN-CNS"] as const;
export type Credential = typeof CREDENTIALS[number];
export type SearchScope = "all" | "first" | "last";
export type LapsedFilter = "all" | "lapsed" | "not_lapsed";
export type SortBy = "name" | "license";
export type SortDir = "asc" | "desc";

export interface LicenseFilters {
  search: string;
  scope: SearchScope;
  credentials: Credential[];
  lapsed: LapsedFilter;
  sort_by: SortBy;
  sort_dir: SortDir;
  cursor: string | null;
  limit: number;
}

export interface DatasetStats {
  total_records: number;
  distinct_licenses: number;
  registered_nurses: number;
  aprn_records: number;
  lapsed_authority: number;
  credential_types: number;
}

export interface CredentialOption { credential: Credential; count: number }

export interface DashboardData {
  stats: DatasetStats;
  credentials: CredentialOption[];
}

export interface Licensee {
  id: number;
  license_number: string;
  credential_code: Credential;
  first_name: string;
  last_name: string;
  middle_names: string;
  name_raw: string;
  prescriptive_authority_lapsed: boolean;
  prescriptive_authority_expiration_date: string | null;
  location: string;
  official_url: string;
  google_url: string;
}

export interface FilteredStats {
  count: number;
  credential_types: number;
  lapsed_authority: number;
}

export interface LicenseResponse {
  licensees: Licensee[];
  stats: FilteredStats;
  total_count: number;
  next_cursor: string | null;
}
