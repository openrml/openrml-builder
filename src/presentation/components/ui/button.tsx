import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../utils"

const buttonVariants = cva(
  "btn-hover inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[hsl(var(--color-primary))] text-[hsl(var(--color-primary-foreground))] hover:bg-[hsl(var(--color-primary-active))] focus-visible:ring-[hsl(var(--color-ring))]",
        destructive: "bg-[hsl(var(--color-destructive))] text-[hsl(var(--color-primary-foreground))] hover:bg-[hsl(var(--color-destructive-hover))] focus-visible:ring-[hsl(var(--color-destructive))]",
        outline: "border border-[hsl(var(--color-border))] bg-[hsl(var(--color-background))] text-[hsl(var(--color-foreground))] hover:bg-[hsl(var(--color-muted))] hover:text-[hsl(var(--color-foreground))] focus-visible:ring-[hsl(var(--color-ring))]",
        secondary: "bg-[hsl(var(--color-muted))] text-[hsl(var(--color-foreground))] hover:bg-[hsl(var(--color-accent))] focus-visible:ring-[hsl(var(--color-ring))]",
        ghost: "text-[hsl(var(--color-muted-foreground))] hover:bg-[hsl(var(--color-muted))] hover:text-[hsl(var(--color-foreground))] focus-visible:ring-[hsl(var(--color-ring))]",
        ghostDestructive: "text-[hsl(var(--color-destructive))] hover:bg-[hsl(var(--color-destructive))]/5 hover:text-[hsl(var(--color-destructive-hover))] focus-visible:ring-[hsl(var(--color-destructive))]",
        link: "text-[hsl(var(--color-primary))] underline-offset-4 hover:underline focus-visible:ring-[hsl(var(--color-ring))]",
        success: "bg-[hsl(var(--color-success))] text-[hsl(var(--color-primary-foreground))] hover:bg-[hsl(var(--color-success))]/90 focus-visible:ring-[hsl(var(--color-success))]",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-base",
        lg: "h-12 px-6 text-lg",
        icon: "h-10 w-10",
        iconSm: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }