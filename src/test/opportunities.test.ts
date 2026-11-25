import { describe, expect, it } from "vitest";
import { daysUntil, isClosingSoon, profileCompletion } from "@/lib/opportunities";

const today = new Date(2026, 10, 25);
describe("deadline rules", () => {
  it("counts days until deadline", () => expect(daysUntil("2026-11-30", today)).toBe(5));
  it("flags deadlines within 7 days as closing soon", () => {
    expect(isClosingSoon("2026-12-02", today)).toBe(true);
    expect(isClosingSoon("2026-12-03", today)).toBe(false);
    expect(isClosingSoon("2026-11-24", today)).toBe(false);
  });
});
describe("profile completion", () => {
  it("is 0 for no profile and 100 when all fields filled", () => {
    expect(profileCompletion(null)).toBe(0);
    expect(profileCompletion({ full_name: "A", headline: "h", bio: "b", location: "l", education: "e", skills: ["x"], avatar_url: "u", phone: "p" })).toBe(100);
  });
});
