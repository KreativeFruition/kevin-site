import type { ButtonHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  asChild?: boolean
}

export const GradientButton = ({ children, className, ...props }: GradientButtonProps) => (
  <button
    className={clsx(
      'gradient-btn focus-ring relative inline-flex items-center justify-center px-0.5 py-0.5',
      className,
    )}
    {...props}
  >
    <span className="px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.18em]">
      {children}
    </span>
  </button>
)
