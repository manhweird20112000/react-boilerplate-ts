import { memo, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { RotateCcw, Search } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Field, FieldLabel } from "@/shared/components/ui/field";
import type { AccountListQuery } from "../types/accounts.types";

interface AccountFiltersProps {
  onSearch: (query: AccountListQuery) => void;
  isLoading?: boolean;
}

const AccountFilters = ({ onSearch, isLoading }: AccountFiltersProps) => {
  const { t } = useTranslation();

  const defaultValues: AccountListQuery = {
    name: "",
    email: "",
    role: undefined,
    status: undefined,
  };

  const { register, handleSubmit, reset, watch, setValue, formState } =
    useForm<AccountListQuery>({
      defaultValues,
    });

  const isDirty = formState.isDirty;

  const onSubmit = (data: AccountListQuery) => {
    // Convert string status to boolean if needed, but for now assuming select values are handled correctly
    onSearch(data);
  };

  const handleReset = () => {
    reset(defaultValues);
    onSearch(defaultValues);
  };

  const roleOptions = useMemo(
    () => [
      { value: "admin", label: t("features.accounts.roles.admin") },
      { value: "staff", label: t("features.accounts.roles.staff") },
    ],
    [t]
  );

  const statusOptions = useMemo(
    () => [
      { value: "true", label: t("features.accounts.status.active") },
      { value: "false", label: t("features.accounts.status.inactive") },
    ],
    [t]
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-12 gap-3 items-end"
    >
      <div className="col-span-12 md:col-span-3">
        <Field>
          <FieldLabel className="text-xs">{t("features.accounts.fields.name")}</FieldLabel>
          <Input
            {...register("name")}
            placeholder={t("features.accounts.fields.name")}
            className="h-9"
          />
        </Field>
      </div>

      <div className="col-span-12 md:col-span-3">
        <Field>
          <FieldLabel className="text-xs">{t("features.accounts.fields.email")}</FieldLabel>
          <Input
            {...register("email")}
            type="email"
            placeholder={t("features.accounts.fields.email")}
            className="h-9"
            spellCheck={false}
          />
        </Field>
      </div>

      <div className="col-span-12 md:col-span-2">
        <Field>
          <FieldLabel className="text-xs">{t("features.accounts.fields.role")}</FieldLabel>
          <Select
            value={watch("role") || ""}
            onValueChange={(value) => setValue("role", value as any, { shouldDirty: true })}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder={t("validation.no_selection")} />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="col-span-12 md:col-span-2">
        <Field>
          <FieldLabel className="text-xs">{t("features.accounts.fields.status")}</FieldLabel>
          <Select
            value={watch("status")?.toString() || ""}
            onValueChange={(value) =>
              setValue("status", value === "true", { shouldDirty: true })
            }
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder={t("validation.no_selection")} />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="col-span-12 md:col-span-2 flex gap-2">
        <Button
          type="submit"
          className="flex-1 h-9"
          disabled={isLoading}
        >
          <Search className="size-4 mr-1" aria-hidden="true" />
          検索
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1 h-9"
          onClick={handleReset}
          disabled={!isDirty || isLoading}
        >
          <RotateCcw className="size-4 mr-1" aria-hidden="true" />
          {t("features.accounts.actions.resetFilter")}
        </Button>
      </div>
    </form>
  );
};

export default memo(AccountFilters);
