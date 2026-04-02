import { zodResolver } from "@hookform/resolvers/zod";
import { memo } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import { useTopicSchemas, type TopicSchema } from "../schemas/topic.schema";
import { type Lesson } from "../types";

interface TopicFormProps {
  readonly initialValues?: Partial<TopicSchema>;
  readonly onSubmit: (data: TopicSchema) => void;
  readonly onCancel: () => void;
  readonly isSubmitting?: boolean;
  readonly lessons: readonly Lesson[];
  readonly mode: "create" | "edit";
}

const TopicForm = ({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting,
  lessons,
  mode,
}: TopicFormProps) => {
  const { topicSchema } = useTopicSchemas();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TopicSchema>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      lesson_ids:
        initialValues?.lesson_ids && initialValues.lesson_ids.length > 0
          ? initialValues.lesson_ids
          : [{ value: undefined as any }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lesson_ids",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel>
            トピックス名
            <span className="ml-1 text-xs font-bold text-destructive">
              (必須)
            </span>
          </FieldLabel>
          <Input
            {...register("name")}
            placeholder="トピックス名を入力してください"
            className="w-full"
            aria-invalid={!!errors.name}
          />
          <FieldError errors={[errors.name]} />
        </Field>

        <Field>
          <FieldLabel>
            自動ブックマークするコンテンツ
            <span className="ml-1 text-xs font-bold text-destructive">
              (必須)
            </span>
          </FieldLabel>
          <div className="flex flex-col gap-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Controller
                  control={control}
                  name={`lesson_ids.${index}.value`}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      value={value?.toString()}
                      onValueChange={(val) => onChange(Number(val))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        {lessons.map((lesson) => (
                          <SelectItem
                            key={lesson.id}
                            value={lesson.id.toString()}
                          >
                            {lesson.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    className="font-normal text-destructive hover:bg-destructive/10"
                  >
                    削除
                  </Button>
                )}
              </div>
            ))}
          </div>
          <FieldError errors={[errors.lesson_ids as any]} />
          <div className="mt-2 flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ value: undefined as any })}
            >
              コンテンツ追加
            </Button>
          </div>
        </Field>
      </FieldGroup>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          キャンセル
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "保存中…" : mode === "create" ? "新規追加" : "保存"}
        </Button>
      </div>
    </form>
  );
};

export default memo(TopicForm);
