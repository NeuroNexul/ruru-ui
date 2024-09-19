"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "@/utils/cn";
import { Spinner } from "./spinner";
import { motion } from "framer-motion";
import { useRuru } from "@/provider";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/85",
        secondary:
          "border-input border-[1.5px] bg-secondary/55 hover:bg-secondary",
        tertiary: "text-primary hover:bg-accent/75",
        error: "bg-[#d93036] hover:bg-[#ff6166]",
        warning: "bg-[#ff990a] text-primary-foreground hover:bg-[#d27504]",
      },
      size: {
        default: "h-9 px-4 py-2",
        small: "h-8 rounded-md px-3 text-xs",
        large: "h-10 rounded-md px-8",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      "prefix" | "suffix"
    >,
    VariantProps<typeof buttonVariants> {
  /**
   * Render as child component.
   * @default false
   * @type {boolean}
   *
   * @example
   * ```tsx
   * <Button asChild>Upload</Button>
   * ```
   */
  asChild?: boolean;
  /**
   * Element to render before the button text.
   * @type {React.ReactNode}
   * @default undefined
   *
   * @example
   * ```tsx
   * <Button prefix={<ArrowLeftIcon />}>Upload</Button>
   * ```
   */
  prefix?: React.ReactNode;
  /**
   * Element to render after the button text.
   * @type {React.ReactNode}
   * @default undefined
   *
   * @example
   * ```tsx
   * <Button suffix={<ArrowRightIcon />}>Upload</Button>
   * ```
   */
  suffix?: React.ReactNode;
  /**
   * Disable the button.
   * @type {boolean}
   * @default false
   *
   * @example
   * ```tsx
   * <Button disabled>Disabled</Button>
   * ```
   */
  disabled?: boolean;
  /**
   * Show loading spinner inside the button.
   * @type {boolean}
   * @default false
   *
   * @example
   * ```tsx
   * <Button loading>Loading</Button>
   * ```
   */
  loading?: boolean;
}
/**
 * A customizable button component with different variants and sizes.
 *
 * @param {string} className - Additional class names for the button.
 * @param {"default" | "secondary" | "tertiary" | "error" | "warning"} variant - Button style variant.
 * @param {"default" | "small" | "large" | "icon"} size - Button size variant.
 * @param {boolean} asChild - Render as child component.
 * @param {React.ReactNode} prefix - Element to render before the button text.
 * @param {React.ReactNode} suffix - Element to render after the button text.
 * @param {boolean} disabled - Disable the button.
 * @param {boolean} loading - Show loading spinner inside the button.
 * @param {React.Ref<HTMLButtonElement>} ref - Forwarded ref.
 *
 * @example
 * ```tsx
 * <Button variant="secondary" size="large" prefix={<ArrowLeftIcon />} suffix={<ArrowRightIcon />}>
 *   Click Me
 * </Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      prefix,
      suffix,
      disabled = false,
      loading = false,
      ...props
    },
    ref,
  ) => {
    const { animation } = useRuru();

    const Comp = asChild ? Slot : "button";

    const buttonContent = (
      <Comp
        className={cn(
          buttonVariants({
            variant: loading ? "secondary" : variant,
            size,
          }),
          className,
        )}
        ref={ref}
        disabled={disabled}
        {...props}
      >
        {loading ? <Spinner className="mr-2" /> : null}
        {prefix ? (
          <span className="mr-2 flex items-center justify-center">
            {prefix}
          </span>
        ) : null}
        {props.children}
        {suffix ? (
          <span className="ml-2 flex items-center justify-center">
            {suffix}
          </span>
        ) : null}
      </Comp>
    );

    return (
      <div className={cn(className, disabled && "cursor-not-allowed ")}>
        {animation ? (
          <motion.div whileTap={{ scale: 0.93 }}>{buttonContent}</motion.div>
        ) : (
          buttonContent
        )}
      </div>
    );
  },
);

Button.displayName = "Button";
