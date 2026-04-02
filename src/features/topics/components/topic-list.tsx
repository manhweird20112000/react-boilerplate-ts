import { type ColumnDef } from "@tanstack/react-table";
import { memo, useMemo } from "react";

import DataTable, {
  DataTableColumnHeader,
} from "@/shared/components/data-table/data-table";
import { Button } from "@/shared/components/ui/button";

import { type Topic } from "../types";

interface TopicListProps {
  readonly topics: readonly Topic[];
  readonly onEdit: (topic: Topic) => void;
  readonly onDelete: (topic: Topic) => void;
  readonly isLoading?: boolean;
}

const TopicList = ({
  topics,
  onEdit,
  onDelete,
  isLoading,
}: TopicListProps) => {
  const columns = useMemo<ColumnDef<Topic>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="トピックス名" />
        ),
        cell: ({ row }) => (
          <div className="font-medium">{row.original.name}</div>
        ),
      },
      {
        id: "actions",
        meta: {
          headerClassName: "w-[150px]",
          cellClassName: "w-[150px] text-right",
        },
        header: () => <div className="text-right">アクション</div>,
        cell: ({ row }) => (
          <div className="flex justify-end gap-2">
            <Button
              variant="link"
              size="sm"
              onClick={() => onEdit(row.original)}
              className="px-2 text-foreground font-normal hover:no-underline"
            >
              編集
            </Button>
            <Button
              variant="link"
              size="sm"
              onClick={() => onDelete(row.original)}
              className="px-2 text-destructive font-normal hover:no-underline"
            >
              削除
            </Button>
          </div>
        ),
      },
    ],
    [onEdit, onDelete],
  );

  return (
    <DataTable
      columns={columns}
      data={topics}
      className={isLoading ? "opacity-50 pointer-events-none" : ""}
    />
  );
};

export default memo(TopicList);
