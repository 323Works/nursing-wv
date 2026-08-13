import "server-only";
import { query } from "./db";
import { decodeCursor, encodeCursor } from "./filters";
import { OFFICIAL_LOOKUP_URL } from "./constants";
import type { Credential, DashboardData, LicenseFilters, LicenseResponse, Licensee } from "./types";

function placeholders(values: unknown[], startAt: number) {
  return values.map((_, index) => `$${startAt + index}`).join(", ");
}

function buildWhere(filters: LicenseFilters, includeCursor: boolean) {
  const conditions: string[] = [];
  const params: unknown[] = [];
  const add = (sql: string, ...values: unknown[]) => {
    let offset = params.length;
    conditions.push(sql.replace(/\?/g, () => `$${++offset}`));
    params.push(...values);
  };

  if (filters.search) {
    const term = `%${filters.search}%`;
    if (filters.scope === "first") add("first_name ILIKE ?", term);
    else if (filters.scope === "last") add("last_name ILIKE ?", term);
    else add("(first_name ILIKE ? OR last_name ILIKE ? OR name_raw ILIKE ? OR license_number ILIKE ?)", term, term, term, term);
  }
  if (filters.credentials.length) {
    conditions.push(`credential_code IN (${placeholders(filters.credentials, params.length + 1)})`);
    params.push(...filters.credentials);
  }
  if (filters.lapsed === "lapsed") conditions.push("prescriptive_authority_lapsed = TRUE");
  if (filters.lapsed === "not_lapsed") conditions.push("prescriptive_authority_lapsed = FALSE");

  if (includeCursor && filters.cursor) {
    const cursor = decodeCursor(filters.cursor);
    const op = filters.sort_dir === "asc" ? ">" : "<";
    if (filters.sort_by === "license") {
      add(`(license_number, id) ${op} (?, ?)`, cursor.licenseNumber, cursor.id);
    } else {
      add(`(last_name, first_name, license_number, id) ${op} (?, ?, ?, ?)`, cursor.lastName, cursor.firstName, cursor.licenseNumber, cursor.id);
    }
  }
  return { where: conditions.length ? conditions.join(" AND ") : "TRUE", params };
}

export async function getDashboardData(): Promise<DashboardData> {
  const [statsRows, credentialRows] = await Promise.all([
    query(`SELECT COUNT(*)::int AS total_records,
                  COUNT(DISTINCT license_number)::int AS distinct_licenses,
                  COUNT(*) FILTER (WHERE credential_code = 'RN')::int AS registered_nurses,
                  COUNT(*) FILTER (WHERE credential_code LIKE 'APRN-%')::int AS aprn_records,
                  COUNT(*) FILTER (WHERE prescriptive_authority_lapsed)::int AS lapsed_authority,
                  COUNT(DISTINCT credential_code)::int AS credential_types
             FROM nursing_licensees`),
    query("SELECT credential_code, COUNT(*)::int AS count FROM nursing_licensees GROUP BY credential_code ORDER BY count DESC, credential_code"),
  ]);
  const stats = statsRows[0];
  return {
    stats: {
      total_records: Number(stats.total_records), distinct_licenses: Number(stats.distinct_licenses),
      registered_nurses: Number(stats.registered_nurses), aprn_records: Number(stats.aprn_records),
      lapsed_authority: Number(stats.lapsed_authority), credential_types: Number(stats.credential_types),
    },
    credentials: credentialRows.map((row) => ({ credential: String(row.credential_code) as Credential, count: Number(row.count) })),
  };
}

export async function searchLicensees(filters: LicenseFilters): Promise<LicenseResponse> {
  const base = buildWhere(filters, false);
  const paged = buildWhere(filters, true);
  const direction = filters.sort_dir === "asc" ? "ASC" : "DESC";
  const order = filters.sort_by === "license" ? `license_number ${direction}, id ${direction}` : `last_name ${direction}, first_name ${direction}, license_number ${direction}, id ${direction}`;
  const listParams = [...paged.params, filters.limit + 1];
  const [statsRows, rows] = await Promise.all([
    query(`SELECT COUNT(*)::int AS count, COUNT(DISTINCT credential_code)::int AS credential_types,
                  COUNT(*) FILTER (WHERE prescriptive_authority_lapsed)::int AS lapsed_authority
             FROM nursing_licensees WHERE ${base.where}`, base.params),
    query(`SELECT id, license_number, credential_code, first_name, last_name, COALESCE(middle_names, '') AS middle_names,
                  name_raw, prescriptive_authority_lapsed, prescriptive_authority_expiration_date, COALESCE(location, '') AS location
             FROM nursing_licensees WHERE ${paged.where} ORDER BY ${order} LIMIT $${listParams.length}`, listParams),
  ]);
  const hasMore = rows.length > filters.limit;
  const visible = hasMore ? rows.slice(0, filters.limit) : rows;
  const licensees: Licensee[] = visible.map((row) => {
    const firstName = String(row.first_name); const lastName = String(row.last_name);
    return {
      id: Number(row.id), license_number: String(row.license_number), credential_code: String(row.credential_code) as Credential,
      first_name: firstName, last_name: lastName, middle_names: String(row.middle_names), name_raw: String(row.name_raw),
      prescriptive_authority_lapsed: Boolean(row.prescriptive_authority_lapsed),
      prescriptive_authority_expiration_date: row.prescriptive_authority_expiration_date ? new Date(String(row.prescriptive_authority_expiration_date)).toISOString().slice(0, 10) : null,
      location: String(row.location), official_url: OFFICIAL_LOOKUP_URL,
      google_url: `https://www.google.com/search?q=${encodeURIComponent(`${firstName} ${lastName} nurse West Virginia`)}`,
    };
  });
  const last = licensees.at(-1);
  const nextCursor = hasMore && last ? encodeCursor({ lastName: last.last_name, firstName: last.first_name, licenseNumber: last.license_number, id: last.id }) : null;
  const stats = statsRows[0];
  return { licensees, stats: { count: Number(stats.count), credential_types: Number(stats.credential_types), lapsed_authority: Number(stats.lapsed_authority) }, total_count: Number(stats.count), next_cursor: nextCursor };
}
