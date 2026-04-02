import { useTranslation } from "react-i18next";
import { z } from "zod";

export interface TopicFormValues {
  name: string;
  lesson_ids: { value: number }[];
}

export const topicSchemaDefinition = z.object({
  name: z.string().min(1).max(255),
  lesson_ids: z.array(z.object({ value: z.number() })).min(1),
});

export type TopicSchema = TopicFormValues;

export const useTopicSchemas = () => {
  const { t } = useTranslation();

  const topicSchema = z.object({
    name: z
      .string()
      .min(1, {
        message: t("validation.required", { _field_: "トピックス名" }),
      })
      .max(255, {
        message: t("validation.max", { _field_: "トピックス名", _length_: 255 }),
      }),
    lesson_ids: z
      .array(
        z.object({
          value: z.any().refine((val) => val != null && val !== "", {
            message: t("validation.required", {
              _field_: "自動ブックマークするコンテンツ",
            }),
          }),
        }),
      )
      .min(1, {
        message: t("validation.required", {
          _field_: "自動ブックマークするコンテンツ",
        }),
      }),
  });

  return {
    topicSchema,
  };
};
