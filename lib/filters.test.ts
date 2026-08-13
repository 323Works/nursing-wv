import { describe, expect, it } from "vitest";
import { decodeCursor, encodeCursor, parseFilters } from "./filters";
import { DEFAULT_FILTERS } from "./constants";

describe("filter contract", () => {
  it("accepts the default request", () => expect(parseFilters(DEFAULT_FILTERS)).toEqual(DEFAULT_FILTERS));
  it("normalizes surrounding search whitespace", () => expect(parseFilters({ ...DEFAULT_FILTERS, search: "  Abbott  " }).search).toBe("Abbott"));
  it("rejects an unknown credential", () => expect(() => parseFilters({ ...DEFAULT_FILTERS, credentials: ["LPN"] })).toThrow());
  it("rejects oversized pages", () => expect(() => parseFilters({ ...DEFAULT_FILTERS, limit: 101 })).toThrow());
  it("round-trips cursors", () => {
    const cursor = { lastName: "ABBOTT", firstName: "ANDREA", licenseNumber: "115741", id: 41908 };
    expect(decodeCursor(encodeCursor(cursor))).toEqual(cursor);
  });
  it("rejects malformed cursors", () => expect(() => decodeCursor(Buffer.from("{}", "utf8").toString("base64url"))).toThrow());
});
