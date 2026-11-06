import { useId } from "react";
import { useHydrated } from "@/lib/use-hydrated";
export function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: (props: {
    id: string;
    "aria-invalid": boolean;
    "aria-describedby": string | undefined;
    disabled: boolean;
  }) => React.ReactNode;
}) {
  const id = useId();
  const ready = useHydrated();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children({
        id,
        disabled: !ready,
        "aria-invalid": !!error,
        "aria-describedby": error || hint ? `${id}-help` : undefined,
      })}
      {(error || hint) && (
        <p id={`${id}-help`} className={error ? "field-error" : "field-hint"}>
          {error || hint}
        </p>
      )}
    </div>
  );
}
