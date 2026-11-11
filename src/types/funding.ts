import type { SourceRef } from "./program";

/**
 * PROVISIONAL, FRONTEND-ONLY. The backend has no funding endpoint and no funding DTO, so these types are NOT a
 * backend contract and `scripts/check-contract.mjs` does not verify them. They exist only so the funding list
 * can be rendered and tested. When a funding API is designed, replace them with types mirrored from its DTOs.
 */
export type FundingKind =
  | "SCHOLARSHIP"
  | "FULL_WAIVER"
  | "PARTIAL_WAIVER"
  | "DISCOUNT"
  | "GRANT"
  | "STIPEND";

export interface FundingItem {
  name: string;
  kind: FundingKind;
  /** Intended to be the source's own description, including who is eligible. */
  summary: string;
  source: SourceRef;
}
