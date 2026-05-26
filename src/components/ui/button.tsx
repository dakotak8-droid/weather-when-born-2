import * as React from "react";

export interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

export function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer active:scale-98 duration-100";

  const variants = {
    default: "bg-slate-900 text-slate-50 shadow-sm hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90",
    destructive: "bg-rose-600 text-slate-50 shadow-xs hover:bg-rose-600/90",
    outline: "border border-slate-200 bg-white shadow-xs hover:bg-slate-50 hover:text-slate-900",
    secondary: "bg-slate-100 text-slate-900 shadow-xs hover:bg-slate-100/80",
    ghost: "hover:bg-slate-100 hover:text-slate-900",
    link: "text-slate-900 underline-offset-4 hover:underline",
  };

  const sizes = {
    default: "h-11 px-6 py-2.5",
    sm: "h-9 rounded-xl px-3 text-xs",
    lg: "h-12 rounded-2xl px-8 text-base",
    icon: "h-11 w-11",
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ""}`;

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<any>;
    return React.cloneElement(child, {
      className: `${combinedClassName} ${child.props.className || ""}`,
      ...props,
      children: child.props.children,
    });
  }

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
}
