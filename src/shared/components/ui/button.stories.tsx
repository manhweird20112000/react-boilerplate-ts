import type { Meta, StoryObj } from '@storybook/react'

import { Button, type ButtonProps } from './button'

const meta: Meta<ButtonProps> = {
  title: 'shared/ui/Button',
  component: Button,
  args: {
    children: 'Button'
  }
}

export default meta

type Story = StoryObj<ButtonProps>

export const Primary: Story = { args: { variant: 'primary' } }
export const Secondary: Story = { args: { variant: 'secondary' } }
export const Disabled: Story = { args: { disabled: true } }
