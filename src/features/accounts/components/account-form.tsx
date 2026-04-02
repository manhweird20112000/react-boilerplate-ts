import { memo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Field, FieldLabel, FieldError, FieldGroup, FieldContent } from "@/shared/components/ui/field";
import { useAccountSchemas, type AccountCreateSchema, type AccountUpdateSchema } from "../schemas/account.schema";
import type { Account } from "../types/account";

interface AccountFormProps {
  initialValues?: Partial<Account>;
  onSubmit: (data: AccountCreateSchema | AccountUpdateSchema) => void;
  isSubmitting: boolean;
  mode: "create" | "edit";
  onCancel: () => void;
}

const AccountForm = ({ initialValues, onSubmit, isSubmitting, mode, onCancel }: AccountFormProps) => {
  const { createSchema, updateSchema } = useAccountSchemas();

  if (mode === "create") {
    return (
      <AccountCreateForm
        initialValues={initialValues}
        schema={createSchema}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        onCancel={onCancel}
      />
    );
  }

  return (
    <AccountEditForm
      initialValues={initialValues}
      schema={updateSchema}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      onCancel={onCancel}
    />
  );
};

interface AccountCreateFormProps {
  initialValues?: Partial<Account>;
  schema: ReturnType<typeof useAccountSchemas>["createSchema"];
  onSubmit: (data: AccountCreateSchema | AccountUpdateSchema) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

const AccountCreateForm = ({ initialValues, schema, onSubmit, isSubmitting, onCancel }: AccountCreateFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountCreateSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialValues?.name ?? "",
      email: initialValues?.email ?? "",
      role: initialValues?.role ?? "STAFF",
      status: initialValues?.status ?? "ACTIVE",
      password: "",
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data))} className="space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel>
            アカウント名 <span className="text-destructive font-bold text-xs ml-1">(必須)</span>
          </FieldLabel>
          <FieldContent>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="アカウント名を入力してください" className="w-full" />
              )}
            />
            <FieldError errors={[errors.name]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>
            メールアドレス <span className="text-destructive font-bold text-xs ml-1">(必須)</span>
          </FieldLabel>
          <FieldContent>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="example@domain.com" type="email" className="w-full" />
              )}
            />
            <FieldError errors={[errors.email]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>
            権限 <span className="text-destructive font-bold text-xs ml-1">(必須)</span>
          </FieldLabel>
          <FieldContent>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">管理者</SelectItem>
                    <SelectItem value="STAFF">担当者</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[errors.role]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>
            パスワード <span className="text-destructive font-bold text-xs ml-1">(必須)</span>
          </FieldLabel>
          <FieldContent>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="password"
                  placeholder="半角英数6~20文字"
                  className="w-full"
                />
              )}
            />
            <FieldError errors={[errors.password]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>ステータス</FieldLabel>
          <FieldContent>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={field.value === "ACTIVE"}
                    onCheckedChange={(checked) => field.onChange(checked ? "ACTIVE" : "INACTIVE")}
                  />
                  <span className="text-sm">{field.value === "ACTIVE" ? "アクティブ" : "非アクティブ"}</span>
                </div>
              )}
            />
          </FieldContent>
        </Field>
      </FieldGroup>

      <div className="flex flex-col-reverse justify-end gap-2 pt-4 sm:flex-row">
        <Button type="button" variant="outline" onClick={onCancel} className="min-w-32">
          キャンセル
        </Button>
        <Button type="submit" disabled={isSubmitting} className="min-w-32">
          新規追加
        </Button>
      </div>
    </form>
  );
};

interface AccountEditFormProps {
  initialValues?: Partial<Account>;
  schema: ReturnType<typeof useAccountSchemas>["updateSchema"];
  onSubmit: (data: AccountCreateSchema | AccountUpdateSchema) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

const AccountEditForm = ({ initialValues, schema, onSubmit, isSubmitting, onCancel }: AccountEditFormProps) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AccountUpdateSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialValues?.name ?? "",
      email: initialValues?.email ?? "",
      role: initialValues?.role ?? "STAFF",
      status: initialValues?.status ?? "ACTIVE",
      password: "",
      isResetPassword: false,
    },
  });

  const isResetPassword: boolean = watch("isResetPassword") ?? false;

  useEffect(() => {
    if (!isResetPassword) {
      setValue("password", "");
    }
  }, [isResetPassword, setValue]);

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data))} className="space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel>
            アカウント名 <span className="text-destructive font-bold text-xs ml-1">(必須)</span>
          </FieldLabel>
          <FieldContent>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="アカウント名を入力してください" className="w-full" />
              )}
            />
            <FieldError errors={[errors.name]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>
            メールアドレス <span className="text-destructive font-bold text-xs ml-1">(必須)</span>
          </FieldLabel>
          <FieldContent>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="example@domain.com" type="email" className="w-full" />
              )}
            />
            <FieldError errors={[errors.email]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>
            権限 <span className="text-destructive font-bold text-xs ml-1">(必須)</span>
          </FieldLabel>
          <FieldContent>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">管理者</SelectItem>
                    <SelectItem value="STAFF">担当者</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[errors.role]} />
          </FieldContent>
        </Field>

        <Field orientation="horizontal" className="items-center">
          <Controller
            name="isResetPassword"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                <span className="text-sm font-medium">パスワードを再設定</span>
              </div>
            )}
          />
        </Field>

        <Field className={!isResetPassword ? "opacity-50 pointer-events-none" : ""}>
          <FieldLabel>
            パスワード <span className="text-destructive font-bold text-xs ml-1">(必須)</span>
          </FieldLabel>
          <FieldContent>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="password"
                  placeholder="半角英数6~20文字"
                  className="w-full"
                  disabled={!isResetPassword}
                />
              )}
            />
            <FieldError errors={[errors.password]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>ステータス</FieldLabel>
          <FieldContent>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={field.value === "ACTIVE"}
                    onCheckedChange={(checked) => field.onChange(checked ? "ACTIVE" : "INACTIVE")}
                  />
                  <span className="text-sm">{field.value === "ACTIVE" ? "アクティブ" : "非アクティブ"}</span>
                </div>
              )}
            />
          </FieldContent>
        </Field>
      </FieldGroup>

      <div className="flex flex-col-reverse justify-end gap-2 pt-4 sm:flex-row">
        <Button type="button" variant="outline" onClick={onCancel} className="min-w-32">
          キャンセル
        </Button>
        <Button type="submit" disabled={isSubmitting} className="min-w-32">
          保存
        </Button>
      </div>
    </form>
  );
};

export default memo(AccountForm);
