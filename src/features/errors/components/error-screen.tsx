import { type ReactElement, type ReactNode } from 'react'

type ErrorScreenProps = {
  readonly code: string
  readonly eyebrow: string
  readonly title: string
  readonly description: string
  readonly children?: ReactNode
}

/**
 * Full-screen error layout with a subtle grid and radial depth; supports light and dark themes.
 */
export function ErrorScreen({
  code,
  eyebrow,
  title,
  description,
  children
}: ErrorScreenProps): ReactElement {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16">
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,oklch(0.145_0_0/0.04)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.145_0_0/0.04)_1px,transparent_1px)] bg-size-[48px_48px] dark:bg-[linear-gradient(to_right,oklch(0.985_0_0/0.06)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.985_0_0/0.06)_1px,transparent_1px)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-[min(70vh,520px)] w-[min(90vw,720px)] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,oklch(0.205_0.04_250/0.12),transparent)] blur-3xl dark:bg-[radial-gradient(closest-side,oklch(0.488_0.15_250/0.18),transparent)]"
        aria-hidden
      />
      <div className="relative z-10 flex max-w-md flex-col items-center text-center">
        <p className="mb-3 text-xs font-medium tracking-wider text-muted-foreground">{eyebrow}</p>
        <p
          className="mb-2 font-mono text-[clamp(4.5rem,18vw,7.5rem)] leading-none font-bold tracking-tighter text-foreground tabular-nums"
          aria-hidden
        >
          {code}
        </p>
        <h1 className="text-balance text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          {title}
        </h1>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
          {description}
        </p>
        {children !== undefined && children !== null ? (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">{children}</div>
        ) : null}
      </div>
    </div>
  )
}
