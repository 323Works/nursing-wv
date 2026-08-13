import type { LicenseFilters } from "./types";

export const DEFAULT_FILTERS: LicenseFilters = {
  search: "",
  scope: "all",
  credentials: [],
  lapsed: "all",
  sort_by: "name",
  sort_dir: "asc",
  cursor: null,
  limit: 50,
};

export const OFFICIAL_LOOKUP_URL = "https://wvrn.boardsofnursing.org/licenselookup/";
export const NURSYS_URL = "https://www.nursys.com/LQC/LQCTerms.aspx";
