import { memo, useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import DataTable, {
  DataTableColumnHeader,
} from "@/shared/components/data-table/data-table";
import type { Account } from "../types/accounts.types";

interface AccountTableProps {
  data: readonly Account[];
  onEdit: (account: Account) => void;
  onDelete: (account: Account) => void;
}

const AccountTable = ({ data, onEdit, onDelete }: AccountTableProps) => {
  const { t } = useTranslation();

  const columns: ColumnDef<Account>[] = useMemo(
    () => [
      {
        accessorKey: "id",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("features.accounts.fields.id")}
          />
        ),
        cell: ({ row }) => <span className="font-mono text-xs">{row.original.id}</span>,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("features.accounts.fields.name")}
          />
        ),
        cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("features.accounts.fields.email")}
          />
        ),
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.email}</span>,
      },
      {
        accessorKey: "role",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("features.accounts.fields.role")}
          />
        ),
        cell: ({ row }) => {
          const role = row.original.role;
          return (
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              {t(`features.accounts.roles.${role}`)}
            </Badge>
          );
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("features.accounts.fields.status")}
          />
        ),
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <Badge
              variant={status ? "default" : "secondary"}
              className={status ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" : ""}
            >
              {status
                ? t("features.accounts.status.active")
                : t("features.accounts.status.inactive")}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: () => (
          <div className="text-center">{t("features.accounts.fields.actions" as any) || "操作"}</div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-16"
              onClick={() => onEdit(row.original)}
            >
              {t("features.accounts.actions.edit")}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="h-8 w-16"
              onClick={() => onDelete(row.original)}
            >
              {t("features.accounts.actions.delete")}
            </Button>
          </div>
        ),
      },
    ],
    [t, onEdit, onDelete]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      emptyText={t("validation.no_data")}
    />
  );
};

export default memo(AccountTable);
