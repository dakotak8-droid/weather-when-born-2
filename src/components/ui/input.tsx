import * as React from "react";

export interface InputProps extends React.ComponentPropsWithoutRef<"input"> {}

export function Input({ className, type, ...props }: InputProps) {
  return (
    <input
      type={type}
      className={`flex h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 ${className || ""}`}
      {...props}
    />
  );
}
