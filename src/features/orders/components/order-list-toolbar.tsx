import { DownOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Dropdown } from 'antd'
import type { ReactElement } from 'react'

export type OrderListToolbarProps = {
  readonly isMobile: boolean
  readonly selectedCount: number
  readonly onCreate: () => void
  readonly onRefresh: () => void
  readonly onDeleteSelected: () => void
}

export function OrderListToolbar({
  isMobile,
  selectedCount,
  onCreate,
  onRefresh,
  onDeleteSelected
}: OrderListToolbarProps): ReactElement {
  return (
    <>
      <Button block={isMobile} variant="filled" color="default" icon={<UploadOutlined />}>
        Export
      </Button>
      <Dropdown
        menu={{
          items: [
            { key: 'refresh', label: 'Refresh' },
            {
              key: 'delete-selected',
              danger: true,
              disabled: selectedCount === 0,
              label: `Delete selected (${selectedCount})`
            }
          ],
          onClick: ({ key }) => {
            if (key === 'refresh') {
              onRefresh()
              return
            }

            if (key === 'delete-selected') {
              onDeleteSelected()
            }
          }
        }}
      >
        <Button
          block={isMobile}
          icon={<DownOutlined />}
          iconPlacement="end"
          variant="filled"
          color="default"
        >
          More actions
        </Button>
      </Dropdown>
      <Button block={isMobile} icon={<PlusOutlined />} onClick={onCreate} type="primary">
        Create order
      </Button>
    </>
  )
}
