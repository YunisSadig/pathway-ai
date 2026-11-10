import type { Page } from "@/types/api";
import type { Scholarship, ScholarshipQuery } from "@/types/scholarship";
import { apiGet } from "./client";

export const listScholarships = (query: ScholarshipQuery = {}) =>
  apiGet<Page<Scholarship>>("/api/scholarships", { ...query });

export const getScholarship = (slug: string) =>
  apiGet<Scholarship>(`/api/scholarships/${encodeURIComponent(slug)}`);
