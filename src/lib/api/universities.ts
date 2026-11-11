import type { Page } from "@/types/api";
import type {
  UniversityDetail,
  UniversityQuery,
  UniversitySummary,
} from "@/types/university";
import { apiGet } from "./client";

export const listUniversities = (
  query: UniversityQuery = {},
  init?: RequestInit,
) =>
  apiGet<Page<UniversitySummary>>("/api/v1/universities", { ...query }, init);

export const getUniversity = (slug: string, init?: RequestInit) =>
  apiGet<UniversityDetail>(
    `/api/v1/universities/${encodeURIComponent(slug)}`,
    undefined,
    init,
  );
