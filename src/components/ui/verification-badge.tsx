import type { VerificationStatus } from "@/types/common";
import { StatusBadge } from "./status-badge";

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  return (
    <StatusBadge status={status === "verified" ? "verified" : "unknown"} />
  );
}
