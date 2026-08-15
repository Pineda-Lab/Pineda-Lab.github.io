import type { Locale } from "../i18n/utils";

interface Collaborator {
  name: string;
  role?: string;
  affiliation?: string;
  photo?: string;
}

interface Bioethics {
  approvalStatus: string;
  reviewingCommittees: string;
  protocolId: string;
  dataPrivacyStatement?: string;
}

interface SubprojectResource {
  name: string;
  link: string;
  description?: string;
}

interface SubprojectArticle {
  title: string;
  venue?: string;
  url?: string;
}

interface Subproject {
  title: string;
  status?: string;
  description?: string;
  resources?: SubprojectResource[];
  articles?: SubprojectArticle[];
}

interface Funding {
  source: string;
  program?: string;
}

interface ProjectInfo {
  name: string;
  title: string;
  logo?: string;
  abstract?: string;
  role?: string;
  collaborators?: Collaborator[];
  bioethics?: Bioethics;
  subprojects?: Subproject[];
  funding?: Funding;
}

export interface ProjectEntry extends ProjectInfo {
  slug: string;
}

// One file per project under src/data/projects/<slug>.yaml — globbed since
// the set of project files isn't known ahead of time.
const projectFiles = import.meta.glob<{ en: ProjectInfo; es: ProjectInfo }>("../data/projects/*.yaml", {
  eager: true,
});

function slugFromPath(path: string): string {
  return path.match(/\/projects\/([^/]+)\.yaml$/)![1];
}

export function getProjectSlugs(): string[] {
  return Object.keys(projectFiles).map(slugFromPath).sort();
}

export function getProjects(locale: Locale): ProjectEntry[] {
  return Object.entries(projectFiles)
    .map(([path, mod]) => ({ slug: slugFromPath(path), ...mod[locale] }))
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

export function getProject(locale: Locale, slug: string): ProjectEntry | undefined {
  return getProjects(locale).find((project) => project.slug === slug);
}
