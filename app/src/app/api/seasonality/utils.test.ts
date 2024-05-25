import { calculateSeasonality, formatDate, getWeekNumber } from "./utils";

describe("formatDate", () => {
  it("should format the date correctly for a typical date", () => {
    const date = new Date(Date.UTC(2023, 4, 24)); // May 24, 2023 in UTC
    expect(formatDate(date)).toBe("2023-05-24");
  });

  it("should pad single digit months and days with a leading zero", () => {
    const date = new Date(Date.UTC(2023, 0, 5)); // January 5, 2023 in UTC
    expect(formatDate(date)).toBe("2023-01-05");

    const date2 = new Date(Date.UTC(2023, 10, 9)); // November 9, 2023 in UTC
    expect(formatDate(date2)).toBe("2023-11-09");
  });

  it("should handle the end of the year correctly", () => {
    const date = new Date(Date.UTC(2023, 11, 31)); // December 31, 2023 in UTC
    expect(formatDate(date)).toBe("2023-12-31");
  });

  it("should handle the start of the year correctly", () => {
    const date = new Date(Date.UTC(2024, 0, 1)); // January 1, 2024 in UTC
    expect(formatDate(date)).toBe("2024-01-01");
  });
});

describe("getWeekNumber", () => {
  it("should return the correct week number", () => {
    const date = new Date(Date.UTC(2023, 0, 1)); // January 1, 2023 in UTC
    expect(getWeekNumber(date)).toBe(0);

    const date2 = new Date(Date.UTC(2023, 0, 8)); // January 8, 2023 in UTC
    expect(getWeekNumber(date2)).toBe(1);

    const date3 = new Date(Date.UTC(2023, 4, 24)); // May 24, 2023 in UTC
    expect(getWeekNumber(date3)).toBe(20);
  });

  it("should handle year transitions correctly", () => {
    const date = new Date(Date.UTC(2023, 11, 31)); // December 31, 2023 in UTC
    expect(getWeekNumber(date)).toBe(52);

    const date2 = new Date(Date.UTC(2024, 0, 1)); // January 1, 2024 in UTC
    expect(getWeekNumber(date2)).toBe(0);
  });
});
