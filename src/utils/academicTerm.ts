/**
 * UNAM academic term codes are "YYYY-N": semester "1" (Aug–Dec) is labeled
 * with the year AFTER it starts, semester "2" (Jan–Jun) with the year it's
 * in. So "2027-1" is Fall 2026, and "2026-2" is Spring 2026.
 */
export type Season = "fall" | "spring";

export function parseTerm(term: string): { season: Season; year: number } {
  const [yearPart, semesterPart] = term.split("-");
  const year = Number(yearPart);
  const semester = Number(semesterPart);
  return semester === 1 ? { season: "fall", year: year - 1 } : { season: "spring", year };
}

export function getCurrentTerm(referenceDate: Date = new Date()): string {
  const month = referenceDate.getMonth() + 1;
  const year = referenceDate.getFullYear();
  // Jan–Jun: spring of this year. Jul–Dec: fall of this year (labeled with next year).
  return month <= 6 ? `${year}-2` : `${year + 1}-1`;
}

export function isCurrentTerm(term: string, referenceDate: Date = new Date()): boolean {
  return term === getCurrentTerm(referenceDate);
}
