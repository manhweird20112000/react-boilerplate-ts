import { memo, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
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
import { LayoutPage } from "@/shared/layouts/page-layout";
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent } from "@/shared/components/ui/empty";

import AccountTable from "../components/account-table";
import AccountFilters from "../components/account-filters";
import AccountForm from "../components/account-form";
import { AccountService } from "../services/accounts.service";
import type { Account, AccountListQuery } from "../types/accounts.types";

function toastIfBackendMessage(message: string | undefined, variant: "success" | "error"): void {
  const trimmed: string | undefined = message?.trim();
  if (trimmed === undefined || trimmed.length === 0) {
    return;
  }
  if (variant === "success") {
    toast.success(trimmed);
  } else {
    toast.error(trimmed);
  }
}

function readAxiosErrorMessage(error: unknown): string | undefined {
  if (typeof error !== "object" || error === null || !("response" in error)) {
    return undefined;
  }
  const data: unknown = (error as { response?: { data?: unknown } }).response?.data;
  if (typeof data !== "object" || data === null || !("message" in data)) {
    return undefined;
  }
  const msg: unknown = (data as { message: unknown }).message;
  return typeof msg === "string" ? msg : undefined;
}

const AccountsListPage = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<readonly Account[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState<AccountListQuery>({ page: 1, limit: 50 });

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<Account | null>(null);
  const [isMutating, setIsMutating] = useState(false);

  const fetchData = useCallback(async (searchQuery: AccountListQuery) => {
    setIsLoading(true);
    try {
      const res = await AccountService.getAccounts(searchQuery);
      setData(res.data.data.items);
      setTotal(res.data.data.total);
    } catch (error: unknown) {
      toastIfBackendMessage(readAxiosErrorMessage(error), "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(query);
  }, [fetchData, query]);

  const handleSearch = (newQuery: AccountListQuery) => {
    setQuery((prev) => ({ ...prev, ...newQuery, page: 1 }));
  };

  const handleCreate = async (formData: any) => {
    setIsMutating(true);
    try {
      const res = await AccountService.createAccount(formData);
      toastIfBackendMessage(res.data.message, "success");
      setIsCreateOpen(false);
      fetchData(query);
    } catch (error: unknown) {
      toastIfBackendMessage(readAxiosErrorMessage(error), "error");
    } finally {
      setIsMutating(false);
    }
  };

  const handleUpdate = async (formData: any) => {
    if (!editingAccount) return;
    setIsMutating(true);
    try {
      const res = await AccountService.updateAccount(editingAccount.id, formData);
      toastIfBackendMessage(res.data.message, "success");
      setEditingAccount(null);
      fetchData(query);
    } catch (error: unknown) {
      toastIfBackendMessage(readAxiosErrorMessage(error), "error");
    } finally {
      setIsMutating(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingAccount) return;
    setIsMutating(true);
    try {
      const res = await AccountService.deleteAccount(deletingAccount.id);
      toastIfBackendMessage(res.data.message, "success");
      setDeletingAccount(null);
      fetchData(query);
    } catch (error: unknown) {
      toastIfBackendMessage(readAxiosErrorMessage(error), "error");
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <LayoutPage
      heading={t("features.accounts.title")}
      action={
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="size-4 mr-1" />
          {t("features.accounts.actions.create")}
        </Button>
      }
      filter={<AccountFilters onSearch={handleSearch} isLoading={isLoading} />}
      paginationBarProps={{
        currentPage: query.page || 1,
        totalPages: Math.ceil(total / (query.limit || 50)) || 1,
        onPageChange: (page) => setQuery((prev) => ({ ...prev, page })),
      }}
    >
      {data.length === 0 && !isLoading ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>{t("validation.no_data")}</EmptyTitle>
            <EmptyDescription>
              アカウントが見つかりませんでした。条件を変更するか、新しく作成してください。
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => setIsCreateOpen(true)}>
              {t("features.accounts.actions.create")}
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <AccountTable
          data={data}
          onEdit={setEditingAccount}
          onDelete={setDeletingAccount}
        />
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-xl sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{t("features.accounts.actions.create")}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <AccountForm
              mode="create"
              onSubmit={handleCreate}
              isSubmitting={isMutating}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)} disabled={isMutating}>
              {t("features.accounts.actions.cancel")}
            </Button>
            <Button type="submit" form="account-form" disabled={isMutating}>
              {t("features.accounts.actions.create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingAccount} onOpenChange={(open) => !open && setEditingAccount(null)}>
        <DialogContent className="max-w-xl sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{t("features.accounts.actions.edit")}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {editingAccount && (
              <AccountForm
                mode="edit"
                initialValues={editingAccount}
                onSubmit={handleUpdate}
                isSubmitting={isMutating}
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingAccount(null)} disabled={isMutating}>
              {t("features.accounts.actions.cancel")}
            </Button>
            <Button type="submit" form="account-form" disabled={isMutating}>
              {t("features.accounts.actions.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingAccount} onOpenChange={(open) => !open && setDeletingAccount(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("features.accounts.messages.deleteConfirm")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("features.accounts.messages.deleteDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isMutating}>
              {t("features.accounts.actions.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isMutating}
            >
              {t("features.accounts.actions.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </LayoutPage>
  );
};

export default memo(AccountsListPage);
