import { cn } from '@/shared/lib/utils'
import { type ReactNode, useEffect, useRef } from 'react'

type ParallaxBackgroundProps = {
  readonly className?: string
  readonly children?: ReactNode
}

function ParallaxBackground({ className, children }: ParallaxBackgroundProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const maybeRoot = rootRef.current
    if (maybeRoot === null) {
      return
    }
    const host: HTMLDivElement = maybeRoot
    let frameId: number | null = null
    let latestClientX = 0
    let latestClientY = 0
    function updateCssVariables() {
      frameId = null
      const rect: DOMRect = host.getBoundingClientRect()
      const normalizedX = rect.width > 0 ? (latestClientX - rect.left) / rect.width : 0.5
      const normalizedY = rect.height > 0 ? (latestClientY - rect.top) / rect.height : 0.5
      const clampedX = Math.min(1, Math.max(0, normalizedX))
      const clampedY = Math.min(1, Math.max(0, normalizedY))
      host.style.setProperty('--parallax-x', String(clampedX))
      host.style.setProperty('--parallax-y', String(clampedY))
    }
    function onPointerMove(event: PointerEvent) {
      latestClientX = event.clientX
      latestClientY = event.clientY
      if (frameId !== null) {
        return
      }
      frameId = window.requestAnimationFrame(updateCssVariables)
    }
    function onPointerLeave() {
      host.style.setProperty('--parallax-x', '0.5')
      host.style.setProperty('--parallax-y', '0.5')
    }
    host.style.setProperty('--parallax-x', '0.5')
    host.style.setProperty('--parallax-y', '0.5')
    host.addEventListener('pointermove', onPointerMove)
    host.addEventListener('pointerleave', onPointerLeave)
    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId)
      }
      host.removeEventListener('pointermove', onPointerMove)
      host.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [])

  return (
    <div ref={rootRef} className={cn('relative isolate overflow-hidden', className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_0%,hsl(var(--primary)/0.22),transparent_60%),radial-gradient(900px_500px_at_0%_100%,hsl(var(--accent)/0.18),transparent_55%),radial-gradient(900px_500px_at_100%_100%,hsl(var(--muted)/0.22),transparent_55%)]" />
        <div
          className="absolute -left-24 -top-24 size-112 rounded-full bg-primary/20 blur-3xl will-change-transform transform-[translate(calc((var(--parallax-x,0.5)-0.5)*40px),calc((var(--parallax-y,0.5)-0.5)*30px))] motion-safe:animate-[float1_10s_ease-in-out_infinite]"
          style={{ animationDelay: '0ms' }}
        />
        <div
          className="absolute -right-28 top-24 size-120 rounded-full bg-accent/30 blur-3xl will-change-transform transform-[translate(calc((0.5-var(--parallax-x,0.5))*55px),calc((var(--parallax-y,0.5)-0.5)*40px))] motion-safe:animate-[float2_14s_ease-in-out_infinite]"
          style={{ animationDelay: '700ms' }}
        />
        <div
          className="absolute -bottom-40 left-1/2 size-136 -translate-x-1/2 rounded-full bg-muted/40 blur-3xl will-change-transform transform-[translate(calc((var(--parallax-x,0.5)-0.5)*30px),calc((0.5-var(--parallax-y,0.5))*60px))] motion-safe:animate-[float3_18s_ease-in-out_infinite]"
          style={{ animationDelay: '1200ms' }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.9)_1px,transparent_1px)] bg-size-[18px_18px] opacity-[0.06]" />
      </div>
      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translate(calc((var(--parallax-x,0.5)-0.5)*40px), calc((var(--parallax-y,0.5)-0.5)*30px)) scale(1); }
          50% { transform: translate(calc((var(--parallax-x,0.5)-0.5)*52px), calc((var(--parallax-y,0.5)-0.5)*22px)) scale(1.05); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(calc((0.5-var(--parallax-x,0.5))*55px), calc((var(--parallax-y,0.5)-0.5)*40px)) scale(1); }
          50% { transform: translate(calc((0.5-var(--parallax-x,0.5))*42px), calc((var(--parallax-y,0.5)-0.5)*48px)) scale(1.06); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(calc((var(--parallax-x,0.5)-0.5)*30px), calc((0.5-var(--parallax-y,0.5))*60px)) scale(1); }
          50% { transform: translate(calc((var(--parallax-x,0.5)-0.5)*18px), calc((0.5-var(--parallax-y,0.5))*44px)) scale(1.04); }
        }
      `}</style>
      {children}
    </div>
  )
}

export { ParallaxBackground }
