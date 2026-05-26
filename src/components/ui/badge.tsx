import * as React from "react";

export interface BadgeProps extends React.ComponentPropsWithoutRef<"div"> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const baseStyles =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-slate-950 focus:ring-offset-2";

  const variants = {
    default:
      "border-transparent bg-slate-900 text-slate-50 shadow-sm hover:bg-slate-900/80 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/80",
    secondary:
      "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80",
    destructive:
      "border-transparent bg-rose-500 text-slate-50 shadow-sm hover:bg-rose-500/80",
    outline: "border-slate-200 text-slate-950",
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className || ""}`} {...props} />
  );
}
