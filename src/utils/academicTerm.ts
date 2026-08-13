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

function chronologicalKey(term: string): number {
  const { season, year } = parseTerm(term);
  return year * 2 + (season === "fall" ? 1 : 0);
}

export function sortTermsDescending(terms: string[]): string[] {
  return [...terms].sort((a, b) => chronologicalKey(b) - chronologicalKey(a));
}

// Term codes are stored as UNAM codes ("2027-1") but URLs use the human,
// locale-independent form ("fall-2026") since that's what the season/year
// badge on the page already shows.
export function termToSlug(term: string): string {
  const { season, year } = parseTerm(term);
  return `${season}-${year}`;
}

function termFromSlug(slug: string): string | null {
  const match = slug.match(/^(fall|spring)-(\d{4})$/);
  if (!match) return null;
  const [, season, yearStr] = match;
  const year = Number(yearStr);
  return season === "fall" ? `${year + 1}-1` : `${year}-2`;
}

export function courseTermSlug(courseSlug: string, term: string): string {
  return `${courseSlug}-${termToSlug(term)}`;
}

// The URL's term portion is always "(fall|spring)-YYYY", so matching that
// suffix reliably splits it off even though courseSlug itself may contain
// dashes (e.g. "digital-repositories").
export function splitCourseTermSlug(combined: string): { courseSlug: string; term: string } | null {
  const match = combined.match(/^(.+)-((?:fall|spring)-\d{4})$/);
  if (!match) return null;
  const term = termFromSlug(match[2]);
  if (!term) return null;
  return { courseSlug: match[1], term };
}
