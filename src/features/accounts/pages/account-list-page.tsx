import { memo, useState, useMemo } from "react";
import { Button } from "@/shared/components/ui/button";
import DataTable, { DataTableColumnHeader } from "@/shared/components/data-table/data-table";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/shared/components/ui/empty";
import { LayoutPage } from "@/shared/layouts/page-layout";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { Badge } from "@/shared/components/ui/badge";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import type { ColumnDef } from "@tanstack/react-table";

import AccountFilters from "../components/account-filters";
import AccountForm from "../components/account-form";
import type { Account, AccountFilters as FilterType } from "../types/account";
import type { AccountCreateSchema, AccountUpdateSchema } from "../schemas/account.schema";

const SAMPLE_ACCOUNTS: Account[] = [
  {
    id: "1",
    name: "ADMIN",
    email: "admin@domain.com",
    role: "ADMIN",
    status: "ACTIVE",
    createdAt: "2026-04-01 10:00:00",
    updatedAt: "2026-04-01 10:00:00",
  },
  {
    id: "2",
    name: "担当者名",
    email: "momotest789@gmail.com",
    role: "STAFF",
    status: "ACTIVE",
    createdAt: "2026-04-01 11:00:00",
    updatedAt: "2026-04-01 11:00:00",
  },
];

const AccountListPage = () => {
  const [accounts, setAccounts] = useState<Account[]>(SAMPLE_ACCOUNTS);
  const [filters, setFilters] = useState<FilterType>({
    name: "",
    email: "",
    role: undefined,
    status: undefined,
  });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [deletingAccountId, setDeletingAccountId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      const matchName = !filters.name || acc.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchEmail = !filters.email || acc.email.toLowerCase().includes(filters.email.toLowerCase());
      const matchRole = !filters.role || acc.role === filters.role;
      const matchStatus = !filters.status || acc.status === filters.status;
      return matchName && matchEmail && matchRole && matchStatus;
    });
  }, [accounts, filters]);

  const handleCreate = (data: AccountCreateSchema | AccountUpdateSchema) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      if ("isResetPassword" in data) {
        setIsLoading(false);
        toast.error("入力内容を確認してください。");
        return;
      }
      const newAccount: Account = {
        id: Math.random().toString(36).substr(2, 9),
        name: data.name,
        email: data.email,
        role: data.role,
        status: data.status ?? "ACTIVE",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setAccounts((prev) => [newAccount, ...prev]);
      setIsCreateOpen(false);
      setIsLoading(false);
      toast.success("アカウントを新規追加しました。");
    }, 500);
  };

  const handleUpdate = (data: AccountCreateSchema | AccountUpdateSchema) => {
    if (!editingAccount) return;
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (!("isResetPassword" in data)) {
        setIsLoading(false);
        toast.error("入力内容を確認してください。");
        return;
      }
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === editingAccount.id
            ? {
                ...acc,
                name: data.name,
                email: data.email,
                role: data.role,
                status: data.status ?? "ACTIVE",
                updatedAt: new Date().toISOString(),
              }
            : acc
        )
      );
      setEditingAccount(null);
      setIsLoading(false);
      toast.success("アカウントを保存しました。");
    }, 500);
  };

  const handleDelete = () => {
    if (!deletingAccountId) return;
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAccounts((prev) => prev.filter((acc) => acc.id !== deletingAccountId));
      setDeletingAccountId(null);
      setIsLoading(false);
      toast.success("アカウントを削除しました。");
    }, 500);
  };

  const columns: ColumnDef<Account>[] = useMemo(
    () => [
      {
        accessorKey: "id",
        header: ({ column }) => <DataTableColumnHeader column={column} title="アカウントID" />,
        cell: ({ row }) => row.original.id,
      },
      {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="アカウント名" />,
        cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
      },
      {
        accessorKey: "email",
        header: ({ column }) => <DataTableColumnHeader column={column} title="メールアドレス" />,
        cell: ({ row }) => row.original.email,
      },
      {
        accessorKey: "role",
        header: ({ column }) => <DataTableColumnHeader column={column} title="権限" />,
        cell: ({ row }) => (
          <Badge variant="secondary">{row.original.role === "ADMIN" ? "管理者" : "担当者"}</Badge>
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="ステータス" />,
        cell: ({ row }) => (
          <Badge variant="secondary">{row.original.status === "ACTIVE" ? "アクティブ" : "非アクティブ"}</Badge>
        ),
      },
      {
        id: "actions",
        meta: { headerClassName: "w-[150px] text-center", cellClassName: "w-[150px] text-center" },
        header: () => "操作",
        cell: ({ row }) => (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingAccount(row.original)}
            >
              編集
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeletingAccountId(row.original.id)}
            >
              削除
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <LayoutPage
      heading="アカウント管理"
      action={
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
          <PlusIcon className="size-4" aria-hidden="true" />
          新規追加
        </Button>
      }
      filter={
        <AccountFilters
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters({ name: "", email: "", role: undefined, status: undefined })}
        />
      }
    >
      {filteredAccounts.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>データが見つかりません</EmptyTitle>
            <EmptyDescription>
              検索条件を変更するか、新しいアカウントを作成してください。
            </EmptyDescription>
          </EmptyHeader>
          <Button onClick={() => setIsCreateOpen(true)} variant="outline" className="mt-4">
            アカウントを新規追加
          </Button>
        </Empty>
      ) : (
        <DataTable columns={columns} data={filteredAccounts} />
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>新規追加</DialogTitle>
          </DialogHeader>
          <AccountForm
            mode="create"
            onSubmit={handleCreate}
            isSubmitting={isLoading}
            onCancel={() => setIsCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingAccount} onOpenChange={() => setEditingAccount(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>編集</DialogTitle>
          </DialogHeader>
          {editingAccount && (
            <AccountForm
              mode="edit"
              initialValues={editingAccount}
              onSubmit={handleUpdate}
              isSubmitting={isLoading}
              onCancel={() => setEditingAccount(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog open={!!deletingAccountId} onOpenChange={() => setDeletingAccountId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>アカウント削除</AlertDialogTitle>
            <AlertDialogDescription>
              このアカウントを削除してもよろしいですか？この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </LayoutPage>
  );
};

export default memo(AccountListPage);
