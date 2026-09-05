import { useMemo, useState, useTransition, type ChangeEvent, type ReactElement } from 'react'

const LIST_SIZE = 1

function createRandomItem(index: number): string {
  const suffix = Math.random().toString(36).slice(2, 8)
  return `Item ${index}-${suffix}`
}

const lists = Array.from({ length: LIST_SIZE }, (_, index) => createRandomItem(index))

export function DashboardPage(): ReactElement {
  const [search, setSearch] = useState('')
  const [isPending, startTransition] = useTransition()

  const onChangeValue = (e: ChangeEvent<HTMLInputElement>): void => {
    startTransition(() => {
      setSearch(e.target.value)
    })
  }
  const filteredLists = useMemo(() => {
    console.log('filteredLists', lists, search)
    return lists.filter((item) => item.includes(search))
  }, [lists, search])
  return (
    <div>
      Search: {search} {isPending ? 'Loading...' : ''}
      <br />
      <input
        className="border-2 border-gray-300 rounded-md p-2"
        type="text"
        onChange={onChangeValue}
      />
      <br />
      {search.length > 0 && (
        <ul>
          {filteredLists.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
