import { cn } from "@/lib/utils";

const control =
  "min-h-11 w-full rounded-lg border border-border-strong bg-surface px-3 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60";

export function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="font-semibold">
        {label}
      </label>
      {hint ? (
        <p id={`${htmlFor}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="text-sm font-medium text-danger"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function describedBy(id: string, hint?: string, error?: string) {
  return (
    [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
      .filter(Boolean)
      .join(" ") || undefined
  );
}

export function TextInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return <input {...props} className={cn(control, className)} />;
}

export function SelectInput({
  className,
  ...props
}: React.ComponentProps<"select">) {
  return <select {...props} className={cn(control, "pr-8", className)} />;
}

export function TextArea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea {...props} className={cn(control, "min-h-24 py-2", className)} />
  );
}

/** Selectable answer card: a real radio/checkbox, visually a card. */
export function ChoiceCard({
  type,
  name,
  checked,
  onChange,
  title,
  description,
}: {
  type: "radio" | "checkbox";
  name: string;
  checked: boolean;
  onChange: () => void;
  title: string;
  description?: string;
}) {
  return (
    <label
      className={cn(
        "flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
        checked
          ? "border-primary bg-selected"
          : "border-border bg-surface hover:bg-hover",
      )}
    >
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
        className="mt-1 size-4 shrink-0 accent-primary"
      />
      <span>
        <span className="block font-semibold">{title}</span>
        {description ? (
          <span className="block text-sm text-muted-foreground">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}
