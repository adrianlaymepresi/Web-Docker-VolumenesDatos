import type { ButtonHTMLAttributes, ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-text-inverse hover:bg-primary-strong shadow-sm",
  secondary: "bg-secondary text-text-inverse hover:bg-secondary-strong shadow-sm",
  outline: "border border-border bg-surface text-text hover:bg-surface-muted",
  ghost: "text-text-muted hover:bg-surface-muted hover:text-text",
  danger: "bg-danger text-text-inverse hover:opacity-90 shadow-sm",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-11 px-4 text-sm gap-2",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  disabled,
  className = "",
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={`inline-flex items-center justify-center rounded-xl font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {isLoading ? <LoaderCircle aria-hidden className="size-4 animate-spin" /> : icon}
      {children}
    </button>
  );
}

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  tone?: "neutral" | "primary" | "secondary" | "danger";
  children: ReactNode;
};

const toneClasses: Record<NonNullable<IconButtonProps["tone"]>, string> = {
  neutral: "text-text-muted hover:bg-surface-muted hover:text-text",
  primary: "text-primary hover:bg-primary-soft",
  secondary: "text-secondary hover:bg-secondary-soft",
  danger: "text-danger hover:bg-danger-soft",
};

export function IconButton({ label, tone = "neutral", className = "", children, type = "button", ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={`inline-flex size-9 items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${toneClasses[tone]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
