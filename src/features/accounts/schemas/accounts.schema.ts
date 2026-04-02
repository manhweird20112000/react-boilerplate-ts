import { useTranslation } from "react-i18next";
import { z } from "zod";

export const useAccountSchemas = () => {
  const { t } = useTranslation();

  const baseSchema = z.object({
    name: z.string().trim().min(1, {
      message: t("validation.required", { _field_: t("features.accounts.fields.name") }),
    }),
    email: z
      .string()
      .trim()
      .min(1, {
        message: t("validation.required", { _field_: t("features.accounts.fields.email") }),
      })
      .email({
        message: t("validation.email"),
      }),
    role: z.string().refine((val) => val === "admin" || val === "staff", {
      message: t("validation.required", { _field_: t("features.accounts.fields.role") }),
    }),
    status: z.boolean().default(true),
  });

  const passwordSchema = z
    .string()
    .min(6, {
      message: t("validation.min", {
        _field_: t("features.accounts.fields.password"),
        _length_: 6,
      }),
    })
    .max(20, {
      message: t("validation.max", {
        _field_: t("features.accounts.fields.password"),
        _length_: 20,
      }),
    })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: t("validation.regex-password", {
        _field_: t("features.accounts.fields.password"),
      }),
    });

  const createSchema = baseSchema.extend({
    password: passwordSchema,
  });

  const updateSchema = baseSchema
    .extend({
      resetPassword: z.boolean().optional(),
      password: z.string().optional(),
    })
    .refine(
      (data) => {
        if (data.resetPassword) {
          const result = passwordSchema.safeParse(data.password);
          return result.success;
        }
        return true;
      },
      {
        message: t("validation.password"),
        path: ["password"],
      }
    );

  return { createSchema, updateSchema };
};

export type AccountCreateFormData = z.infer<ReturnType<typeof useAccountSchemas>["createSchema"]>;
export type AccountUpdateFormData = z.infer<ReturnType<typeof useAccountSchemas>["updateSchema"]>;
