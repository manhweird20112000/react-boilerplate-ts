import type { PropsWithChildren } from 'react'

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { DashboardPage } from './index'

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children, ...props }: PropsWithChildren<Record<string, unknown>>) => (
    <div data-camera={JSON.stringify(props.camera)} data-testid="r3f-canvas">
      {children}
    </div>
  ),
  useFrame: vi.fn()
}))

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />
}))

describe('DashboardPage', () => {
  it('renders a React Three Fiber learning playground with core ThreeJS concepts', () => {
    const { container } = render(<DashboardPage />)

    expect(screen.getByTestId('r3f-canvas')).toBeInTheDocument()
    expect(screen.getByTestId('orbit-controls')).toBeInTheDocument()
    expect(getNamedObject(container, 'lighting-rig')).toBeInTheDocument()
    expect(getNamedObject(container, 'scene-helpers')).toBeInTheDocument()
    expect(getNamedObject(container, 'animated-shapes')).toBeInTheDocument()
    expect(getNamedObject(container, 'standard-material-cube')).toBeInTheDocument()
    expect(getNamedObject(container, 'physical-material-sphere')).toBeInTheDocument()
    expect(getNamedObject(container, 'wireframe-torus')).toBeInTheDocument()
    expect(getNamedObject(container, 'shadow-plane')).toBeInTheDocument()
  })

  it('marks a shape as active when it is selected', () => {
    const { container } = render(<DashboardPage />)

    const sphere = getNamedObject(container, 'physical-material-sphere')
    const material = () => getNamedObject(sphere, 'sphere-material')

    expect(material()).toHaveAttribute('color', '#c2410c')
    fireEvent.pointerDown(sphere)
    expect(material()).toHaveAttribute('color', '#f97316')
  })
})

function getNamedObject(container: ParentNode, name: string): HTMLElement {
  const element = container.querySelector(`[name="${name}"]`)
  if (!element) throw new Error(`Missing R3F object named ${name}`)

  return element as HTMLElement
}
