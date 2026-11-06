"use client";
import { Slot } from "@radix-ui/react-slot";
import { useHydrated } from "@/lib/use-hydrated";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
const buttonVariants = cva("button", {
  variants: {
    variant: {
      default: "button-primary",
      outline: "button-outline",
      ghost: "button-ghost",
      destructive: "button-destructive",
    },
    size: { default: "", small: "button-small", icon: "button-icon" },
  },
  defaultVariants: { variant: "default", size: "default" },
});
export function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  onClick,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";
  const ready = useHydrated();
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
      data-loading={loading || undefined}
      data-hydrating={!ready || undefined}
      disabled={asChild ? undefined : disabled || loading || !ready}
      aria-disabled={disabled || loading || undefined}
      aria-busy={loading || undefined}
      onClick={(e) => {
        if (disabled || loading) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        onClick?.(e);
      }}
    />
  );
}
