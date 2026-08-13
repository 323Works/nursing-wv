import { z } from "zod";
import { CREDENTIALS, type LicenseFilters } from "./types";

const filterSchema = z.object({
  search: z.string().trim().max(100).default(""),
  scope: z.enum(["all", "first", "last"]).default("all"),
  credentials: z.array(z.enum(CREDENTIALS)).max(CREDENTIALS.length).default([]),
  lapsed: z.enum(["all", "lapsed", "not_lapsed"]).default("all"),
  sort_by: z.enum(["name", "license"]).default("name"),
  sort_dir: z.enum(["asc", "desc"]).default("asc"),
  cursor: z.string().max(1000).nullable().default(null),
  limit: z.number().int().min(1).max(100).default(50),
});

export function parseFilters(value: unknown): LicenseFilters {
  return filterSchema.parse(value);
}

export interface CursorPayload { lastName: string; firstName: string; licenseNumber: string; id: number }

export function encodeCursor(cursor: CursorPayload) {
  return Buffer.from(JSON.stringify(cursor), "utf8").toString("base64url");
}

export function decodeCursor(value: string): CursorPayload {
  const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as Partial<CursorPayload>;
  if (typeof parsed.lastName !== "string" || typeof parsed.firstName !== "string" || typeof parsed.licenseNumber !== "string" || !Number.isInteger(parsed.id)) {
    throw new Error("Invalid cursor");
  }
  return parsed as CursorPayload;
}
