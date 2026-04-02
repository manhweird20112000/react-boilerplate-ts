import { z } from "zod";
import { useTranslation } from "react-i18next";

export const useAccountSchemas = () => {
  const { t } = useTranslation();

  const baseSchema = {
    name: z.string().min(1, { message: t("validation.required", { _field_: "アカウント名" }) }),
    email: z.string().email({ message: t("validation.email") }).min(1, { message: t("validation.required", { _field_: "メールアドレス" }) }),
    role: z.enum(["ADMIN", "STAFF"], {
      required_error: t("validation.required", { _field_: "権限" }),
      invalid_type_error: t("validation.required", { _field_: "権限" }),
    }),
    status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  };

  const createSchema = z.object({
    ...baseSchema,
    password: z.string()
      .min(6, { message: t("validation.password") })
      .max(20, { message: t("validation.password") })
      .regex(/^[a-zA-Z0-9]+$/, { message: t("validation.password") }),
  });

  const updateSchema = z.object({
    ...baseSchema,
    isResetPassword: z.boolean().default(false),
    password: z.string()
      .min(6, { message: t("validation.password") })
      .max(20, { message: t("validation.password") })
      .regex(/^[a-zA-Z0-9]+$/, { message: t("validation.password") })
      .optional()
      .or(z.literal("")),
  }).refine((data) => {
    if (data.isResetPassword && (!data.password || data.password.length < 6)) {
      return false;
    }
    return true;
  }, {
    message: t("validation.password"),
    path: ["password"],
  });

  return { createSchema, updateSchema };
};

export type AccountCreateSchema = z.input<ReturnType<typeof useAccountSchemas>["createSchema"]>;
export type AccountUpdateSchema = z.input<ReturnType<typeof useAccountSchemas>["updateSchema"]>;
