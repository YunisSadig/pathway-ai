/** Shared building blocks for API contracts. */

export type DegreeLevel = "bachelor" | "master" | "doctorate";

/**
 * Whether a record has been checked against its official source.
 * Anything not explicitly "verified" must be presented as unverified.
 */
export type VerificationStatus = "verified" | "unverified";

/** Provenance every institutional fact should carry. */
export interface SourceInfo {
  /** Official page the information was taken from. */
  sourceUrl: string;
  /** ISO 8601 date (YYYY-MM-DD) the source was last checked. */
  checkedAt: string;
  verification: VerificationStatus;
}

export interface Money {
  /** Amount in the currency's major unit. */
  amount: number;
  /** ISO 4217 currency code. */
  currency: string;
}
