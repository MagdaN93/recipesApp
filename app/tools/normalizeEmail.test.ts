import { describe, expect, it } from "vitest";
import { normalizeEmail } from "./normalizeEmail";

describe("normalizeEmail", () => {
    it("trims whitespace around the address", () => {
        expect(normalizeEmail("  jan@x.pl  ")).toBe("jan@x.pl");
    });

    it("lowercases the address", () => {
        expect(normalizeEmail("Jan@X.PL")).toBe("jan@x.pl");
    });

    it("trims and lowercases together", () => {
        expect(normalizeEmail("  Jan@X.pl ")).toBe("jan@x.pl");
    });

    it("keeps an empty string empty", () => {
        expect(normalizeEmail("")).toBe("");
    });
});
