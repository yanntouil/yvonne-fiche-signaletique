import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 [&_svg]:w-4 [&_svg]:h-4",
        sm: "h-9 rounded-md [&_svg]:w-3 [&_svg]:h-3",
        lg: "h-11 rounded-md [&_svg]:w-5 [&_svg]:h-5",
      },
      icon: {
        true: "shrink-0",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      icon: false,
    },
    compoundVariants: [
      {
        size: "default",
        icon: true,
        className: "w-10 h-10",
      },
      {
        size: "default",
        icon: false,
        className: "px-4 py-2",
      },
      {
        size: "sm",
        icon: true,
        className: "w-9 h-9",
      },
      {
        size: "sm",
        icon: false,
        className: "px-3",
      },
      {
        size: "lg",
        icon: true,
        className: "w-11 h-11",
      },
      {
        size: "lg",
        icon: false,
        className: "px-8",
      },
    ],
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, icon = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className, icon }))} ref={ref} {...props} />
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
