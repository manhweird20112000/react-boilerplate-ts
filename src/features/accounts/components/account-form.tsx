import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { memo, useMemo } from "react";

import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/shared/components/ui/field";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  useAccountSchemas,
} from "../schemas/accounts.schema";
import type { Account } from "../types/accounts.types";

interface AccountFormProps {
  initialValues?: Partial<Account>;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting?: boolean;
  mode: "create" | "edit";
}

const AccountForm = ({
  initialValues,
  onSubmit,
  isSubmitting,
  mode,
}: AccountFormProps) => {
  const { t } = useTranslation();
  const { createSchema, updateSchema } = useAccountSchemas();

  const schema = mode === "create" ? createSchema : updateSchema;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialValues?.name || "",
      email: initialValues?.email || "",
      role: initialValues?.role || "staff",
      status: initialValues?.status ?? true,
      resetPassword: false,
      password: "",
    },
  });

  const resetPassword = watch("resetPassword");

  const roleOptions = useMemo(
    () => [
      { value: "admin", label: t("features.accounts.roles.admin") },
      { value: "staff", label: t("features.accounts.roles.staff") },
    ],
    [t]
  );

  return (
    <form id="account-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <fieldset disabled={isSubmitting}>
        <FieldGroup>
        <Field>
          <FieldLabel>
            {t("features.accounts.fields.name")}
            <span className="ml-1 text-xs font-bold text-destructive">(必須)</span>
          </FieldLabel>
          <Input
            {...register("name")}
            placeholder={t("features.accounts.fields.name")}
            aria-invalid={!!errors.name}
          />
          <FieldError errors={[errors.name]} />
        </Field>

        <Field>
          <FieldLabel>
            {t("features.accounts.fields.email")}
            <span className="ml-1 text-xs font-bold text-destructive">(必須)</span>
          </FieldLabel>
          <Input
            {...register("email")}
            type="email"
            placeholder="example@domain.com"
            aria-invalid={!!errors.email}
            spellCheck={false}
          />
          <FieldError errors={[errors.email]} />
        </Field>

        <Field>
          <FieldLabel>
            {t("features.accounts.fields.role")}
            <span className="ml-1 text-xs font-bold text-destructive">(必須)</span>
          </FieldLabel>
          <Select
            value={watch("role")}
            onValueChange={(value) => setValue("role", value as any)}
          >
            <SelectTrigger aria-invalid={!!errors.role}>
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
          <FieldError errors={[errors.role]} />
        </Field>

        {mode === "edit" && (
          <Field orientation="horizontal" className="items-center gap-2">
            <Checkbox
              id="resetPassword"
              checked={watch("resetPassword")}
              onCheckedChange={(checked) => setValue("resetPassword", !!checked)}
            />
            <FieldLabel htmlFor="resetPassword" className="cursor-pointer">
              {t("features.accounts.fields.resetPassword")}
            </FieldLabel>
          </Field>
        )}

        {(mode === "create" || resetPassword) && (
          <Field>
            <FieldLabel>
              {t("features.accounts.fields.password")}
              <span className="ml-1 text-xs font-bold text-destructive">(必須)</span>
            </FieldLabel>
            <Input
              {...register("password")}
              type="password"
              placeholder="半角英数8~20文字"
              aria-invalid={!!errors.password}
            />
            <FieldError errors={[errors.password]} />
          </Field>
        )}

        <Field orientation="horizontal" className="items-center gap-4">
          <FieldLabel>{t("features.accounts.fields.status")}</FieldLabel>
          <div className="flex items-center gap-2">
            <Checkbox
              id="status"
              checked={watch("status")}
              onCheckedChange={(checked) => setValue("status", !!checked)}
            />
            <span className="text-sm">
              {watch("status")
                ? t("features.accounts.status.active")
                : t("features.accounts.status.inactive")}
            </span>
          </div>
        </Field>
        </FieldGroup>
      </fieldset>
    </form>
  );
};

export default memo(AccountForm);
