import { Skeleton } from '@/shared/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/components/ui/table'

interface TableSkeletonProps {
  columnCount?: number
  rowCount?: number
}

export function TableSkeleton({ columnCount = 5, rowCount = 10 }: TableSkeletonProps) {
  return (
    <div className="w-full bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: columnCount }).map((_, i) => (
              <TableHead key={i}>
                <Skeleton className="h-4 w-24" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rowCount }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columnCount }).map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <div className="flex items-center gap-3">
                    {colIndex === 0 && <Skeleton className="size-8 rounded-full" />}
                    <div className="flex flex-col gap-1.5 flex-1">
                      <Skeleton className="h-4 w-32" />
                      {colIndex === 0 && <Skeleton className="h-3 w-20" />}
                    </div>
                  </div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
