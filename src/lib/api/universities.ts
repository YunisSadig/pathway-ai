import type { Page } from "@/types/api";
import type {
  DegreeProgram,
  University,
  UniversityQuery,
} from "@/types/university";
import { apiGet } from "./client";

export const listUniversities = (query: UniversityQuery = {}) =>
  apiGet<Page<University>>("/api/universities", { ...query });

export const getUniversity = (slug: string) =>
  apiGet<University>(`/api/universities/${encodeURIComponent(slug)}`);

export const listPrograms = (universityId: string) =>
  apiGet<DegreeProgram[]>(
    `/api/universities/${encodeURIComponent(universityId)}/programs`,
  );
