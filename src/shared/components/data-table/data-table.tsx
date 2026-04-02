import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { memo, useMemo, useState, type ReactElement } from "react";
import { ArrowDownIcon, ArrowUpIcon, ArrowUpDownIcon } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip";

type DataTableProps<TData> = {
  readonly className?: string;
  readonly columns: readonly ColumnDef<TData>[];
  readonly data: readonly TData[];
  readonly emptyText?: string;
};

export { DataTableColumnHeader };

type DataTableColumnMeta = {
  readonly headerClassName?: string;
  readonly cellClassName?: string;
};

type DataTableColumnHeaderProps<TData> = {
  readonly column: import("@tanstack/react-table").Column<TData>;
  readonly title: string;
};

function DataTableColumnHeader<TData>(
  props: DataTableColumnHeaderProps<TData>,
): ReactElement {
  const canSort: boolean = props.column.getCanSort();
  if (!canSort) {
    return <div className="whitespace-nowrap">{props.title}</div>;
  }

  const sortState = props.column.getIsSorted();
  const icon =
    sortState === "asc" ? (
      <ArrowUpIcon className="size-4" />
    ) : sortState === "desc" ? (
      <ArrowDownIcon className="size-4" />
    ) : (
      <ArrowUpDownIcon className="size-4" />
    );

  const tooltipText: string =
    sortState === "asc"
      ? "昇順"
      : sortState === "desc"
      ? "降順"
      : "並べ替え";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="sm"
              className="-ml-2 h-8 px-2"
            />
          }
          onClick={() => props.column.toggleSorting(sortState === "asc")}
        >
          <span className="whitespace-nowrap">{props.title}</span>
          {icon}
        </TooltipTrigger>
        <TooltipContent>{tooltipText}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function DataTableComponent<TData>(props: DataTableProps<TData>): ReactElement {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data: props.data as TData[],
    columns: props.columns as ColumnDef<TData>[],
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSortingRemoval: true,
  });

  const colSpan: number = useMemo(() => props.columns.length, [props.columns.length]);

  return (
    <div className={cn("w-full rounded-xl border bg-background", props.className)}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    (header.column.columnDef.meta as DataTableColumnMeta | undefined)
                      ?.headerClassName,
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      (cell.column.columnDef.meta as DataTableColumnMeta | undefined)
                        ?.cellClassName,
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={colSpan} className="py-10 text-center text-sm text-muted-foreground">
                {props.emptyText ?? "No results."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

const DataTable = memo(DataTableComponent) as <TData>(
  props: DataTableProps<TData>,
) => ReactElement;

export default DataTable;

