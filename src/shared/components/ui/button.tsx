import type { ButtonHTMLAttributes, ReactElement } from 'react'

import { cn } from '@/shared/lib/utils'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  readonly variant?: 'primary' | 'secondary'
}

export function Button(props: ButtonProps): ReactElement {
  const { className, variant = 'primary', type = 'button', ...rest } = props
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
        variant === 'primary'
          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
          : 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
        className
      )}
      {...rest}
    />
  )
}
