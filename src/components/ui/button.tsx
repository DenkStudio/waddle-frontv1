import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

// Button configuration constants
const BUTTON_STYLES = {
  base: [
    "inline-flex items-center justify-center",
    "whitespace-nowrap rounded-full",
    "font-normal transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
  ].join(" "),

  variants: {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    blue: "bg-[hsl(var(--color-waddle-blue))] hover:bg-[hsl(var(--color-waddle-blue-hover))] text-white",
    black: "bg-[hsl(var(--color-apple))] hover:bg-neutral-800 text-white",
    gray: "bg-neutral-100 hover:bg-neutral-200 text-neutral-900",

    // ✨ New glossy neon gradient like your screenshot
    // inside BUTTON_STYLES.variants
    "gradient-blue": [
      // base surface (pill, white text, stronger weight)
      "relative isolate overflow-hidden text-white font-semibold rounded-[57.2195px]",
      "ring-1 ring-white/10",

      // Figma backgrounds (two radial layers) + blend-mode list
      "bg-[radial-gradient(36.82%_41.72%_at_49.73%_100%,rgba(80,157,255,0.45)_0%,rgba(80,157,255,0)_100%),radial-gradient(50.19%_67.5%_at_49.73%_50%,#1657FF_0%,#27009D_100%)]",
      "[background-blend-mode:plus-lighter,normal]",

      // Figma inset glows
      "shadow-[inset_0_0_9.4265px_rgba(136,192,255,0.5),inset_0_-2.35663px_3.7706px_rgba(255,255,255,0.1),inset_0_0_14.1398px_rgba(255,255,255,0.2),inset_0_9.4265px_28.2795px_rgba(255,255,255,0.24)]",

      // polish: subtle hover lift + smoothness
      "transition-[box-shadow,transform] duration-200",
      "hover:shadow-[inset_0_0_10px_rgba(136,192,255,0.6),inset_0_-3px_4px_rgba(255,255,255,0.12),inset_0_0_16px_rgba(255,255,255,0.25),inset_0_11px_30px_rgba(255,255,255,0.28)]",
      "active:translate-y-[1px]",
    ].join(" "),
  },

  sizes: {
    sm: "h-9 px-3 text-sm",
    default: "h-[var(--height-button-default)] px-4 py-4 w-full text-lg",
    lg: "h-[var(--height-button-lg)] px-8 text-lg",
    icon: "h-10 w-10 p-0",
  },
} as const;

const buttonVariants = cva(BUTTON_STYLES.base, {
  variants: {
    variant: BUTTON_STYLES.variants,
    size: BUTTON_STYLES.sizes,
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconOnly?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      leftIcon,
      rightIcon,
      iconOnly,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const buttonSize = iconOnly ? "icon" : size;
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size: buttonSize, className }))}
        ref={ref}
        {...props}
      >
        {leftIcon && !iconOnly && (
          <span className="mr-2 flex items-center shrink-0">{leftIcon}</span>
        )}

        {iconOnly ? (
          <span className="flex items-center justify-center">
            {leftIcon || rightIcon}
          </span>
        ) : (
          children
        )}

        {rightIcon && !iconOnly && (
          <span className="ml-2 flex items-center shrink-0">{rightIcon}</span>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
