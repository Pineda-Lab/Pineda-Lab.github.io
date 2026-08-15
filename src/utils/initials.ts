// "Dr. Arturo López Pineda" -> "AP"; abbreviated titles ("Dr.", "Lic.", ...)
// are dropped so they don't end up contributing an initial themselves.
export function getInitials(name: string): string {
  const words = name
    .replace(/["'“”‘’]/g, "")
    .split(/\s+/)
    .filter((word) => word && !word.endsWith("."));
  if (words.length === 0) return "";
  const first = words[0][0];
  const last = words[words.length - 1][0];
  return (words.length > 1 ? first + last : first).toUpperCase();
}
