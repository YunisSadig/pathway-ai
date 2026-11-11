import type { Page } from "@/types/api";
import type {
  ProgramDetail,
  ProgramListItem,
  ProgramQuery,
} from "@/types/program";
import { apiGet } from "./client";

export const listPrograms = (query: ProgramQuery = {}, init?: RequestInit) =>
  apiGet<Page<ProgramListItem>>("/api/v1/programs", { ...query }, init);

export const getProgram = (identifier: string, init?: RequestInit) =>
  apiGet<ProgramDetail>(
    `/api/v1/programs/${encodeURIComponent(identifier)}`,
    undefined,
    init,
  );
