import { memo, useMemo } from "react";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { RotateCcwIcon } from "lucide-react";
import { Field, FieldLabel, FieldContent } from "@/shared/components/ui/field";
import type { AccountFilters as FilterType, AccountRole, AccountStatus } from "../types/account";

interface AccountFiltersProps {
  filters: FilterType;
  onChange: (filters: FilterType) => void;
  onReset: () => void;
}

const AccountFilters = ({ filters, onChange, onReset }: AccountFiltersProps) => {
  const isDirty = useMemo(() => {
    return !!(filters.name || filters.email || filters.role || filters.status);
  }, [filters]);

  const roleValue: AccountRole | "ALL" = filters.role ?? "ALL";
  const statusValue: AccountStatus | "ALL" = filters.status ?? "ALL";

  return (
    <div className="grid grid-cols-12 items-end gap-3">
      <Field className="col-span-12 md:col-span-3">
        <FieldLabel htmlFor="filter-name">アカウント名</FieldLabel>
        <FieldContent>
          <Input
            id="filter-name"
            name="name"
            value={filters.name ?? ""}
            onChange={(e) => onChange({ ...filters, name: e.target.value })}
            placeholder="アカウント名で検索…"
            autoComplete="name"
          />
        </FieldContent>
      </Field>
      <Field className="col-span-12 md:col-span-4">
        <FieldLabel htmlFor="filter-email">メールアドレス</FieldLabel>
        <FieldContent>
          <Input
            id="filter-email"
            name="email"
            type="email"
            value={filters.email ?? ""}
            onChange={(e) => onChange({ ...filters, email: e.target.value })}
            placeholder="メールアドレスで検索…"
            autoComplete="email"
            spellCheck={false}
          />
        </FieldContent>
      </Field>
      <Field className="col-span-12 md:col-span-2">
        <FieldLabel htmlFor="filter-role">権限</FieldLabel>
        <FieldContent>
          <Select
            value={roleValue}
            onValueChange={(val) =>
              onChange({ ...filters, role: val === "ALL" ? undefined : (val as AccountRole) })
            }
          >
            <SelectTrigger id="filter-role" className="w-full">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">すべて</SelectItem>
              <SelectItem value="ADMIN">管理者</SelectItem>
              <SelectItem value="STAFF">担当者</SelectItem>
            </SelectContent>
          </Select>
        </FieldContent>
      </Field>
      <Field className="col-span-12 md:col-span-2">
        <FieldLabel htmlFor="filter-status">ステータス</FieldLabel>
        <FieldContent>
          <Select
            value={statusValue}
            onValueChange={(val) =>
              onChange({ ...filters, status: val === "ALL" ? undefined : (val as AccountStatus) })
            }
          >
            <SelectTrigger id="filter-status" className="w-full">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">すべて</SelectItem>
              <SelectItem value="ACTIVE">アクティブ</SelectItem>
              <SelectItem value="INACTIVE">非アクティブ</SelectItem>
            </SelectContent>
          </Select>
        </FieldContent>
      </Field>
      <div className="col-span-12 flex justify-end md:col-span-1">
        <Button variant="outline" size="sm" onClick={onReset} disabled={!isDirty} className="gap-2">
          <RotateCcwIcon className="size-4" aria-hidden="true" />
          リセット
        </Button>
      </div>
    </div>
  );
};

export default memo(AccountFilters);
