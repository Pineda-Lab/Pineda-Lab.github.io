// Course folders under src/data/courses/<courseTermSlug>/ can hold real files
// (syllabus PDFs, slide decks, etc.) alongside their info.yaml/schedule.yaml.
// Vite's `?url` import turns each into a hashed, build-time-resolved URL —
// this glob picks up every such file so a course-term slug + filename can be
// resolved to a servable link without a per-file import statement.
const courseAssetUrls = import.meta.glob<string>("../data/courses/*/*.{pdf,ppt,pptx,doc,docx,zip,png,jpg,jpeg}", {
  eager: true,
  query: "?url",
  import: "default",
});

export function resolveCourseAsset(courseTermSlug: string, filename: string): string | null {
  if (!filename) return null;
  const entry = Object.entries(courseAssetUrls).find(([path]) => path.endsWith(`/${courseTermSlug}/${filename}`));
  return entry ? entry[1] : null;
}
