import { memo, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

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
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/shared/components/ui/empty";
import { LayoutPage } from "@/shared/layouts/page-layout";

import TopicForm from "../components/topic-form";
import TopicList from "../components/topic-list";
import { type TopicSchema } from "../schemas/topic.schema";
import {
  createTopic,
  deleteTopic,
  getLessonList,
  getTopicById,
  getTopicList,
  updateTopic,
} from "../services/topic.service";
import { type Lesson, type Topic } from "../types";

const TopicListPage = () => {
  const [topics, setTopics] = useState<readonly Topic[]>([]);
  const [lessons, setLessons] = useState<readonly Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [initialValues, setInitialValues] = useState<
    Partial<TopicSchema> | undefined
  >();

  const [topicToDelete, setTopicToDelete] = useState<Topic | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [topicsRes, lessonsRes] = await Promise.all([
        getTopicList(),
        getLessonList(),
      ]);
      setTopics(topicsRes.data.data);
      setLessons(lessonsRes.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = () => {
    setEditingTopic(null);
    setInitialValues(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = async (topic: Topic) => {
    try {
      const res = await getTopicById(topic.id);
      const detail = res.data.data;
      setEditingTopic(topic);
      setInitialValues({
        name: detail.name,
        lesson_ids: detail.lessons.map((l) => ({ value: l.id })),
      });
      setIsDialogOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (data: TopicSchema) => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: data.name,
        lesson_ids: data.lesson_ids.map((item) => item.value),
      };

      const res = editingTopic
        ? await updateTopic(editingTopic.id, payload)
        : await createTopic(payload);

      const message = res.data.message;
      if (message?.trim()) {
        toast.success(message);
      }

      setIsDialogOpen(false);
      fetchData();
    } catch (error: any) {
      const message = error?.response?.data?.message;
      if (message?.trim()) {
        toast.error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!topicToDelete) return;

    try {
      const res = await deleteTopic(topicToDelete.id);
      const message = res.data.message;
      if (message?.trim()) {
        toast.success(message);
      }
      fetchData();
    } catch (error: any) {
      const message = error?.response?.data?.message;
      if (message?.trim()) {
        toast.error(message);
      }
    } finally {
      setTopicToDelete(null);
    }
  };

  return (
    <LayoutPage
      heading="トピックス管理"
      action={<Button onClick={handleCreate}>トピックス追加</Button>}
    >
      {topics.length === 0 && !isLoading ? (
        <Empty className="min-h-[400px]">
          <EmptyHeader>
            <EmptyTitle>トピックスがありません</EmptyTitle>
            <EmptyDescription>
              トピックスを登録して、連動するレッスンを管理しましょう。
            </EmptyDescription>
          </EmptyHeader>
          <Button onClick={handleCreate}>トピックス追加</Button>
        </Empty>
      ) : (
        <TopicList
          topics={topics}
          onEdit={handleEdit}
          onDelete={setTopicToDelete}
          isLoading={isLoading}
        />
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingTopic ? "編集" : "新規追加"}</DialogTitle>
          </DialogHeader>
          <div className="pt-4">
            <TopicForm
              mode={editingTopic ? "edit" : "create"}
              initialValues={initialValues}
              onSubmit={handleSubmit}
              onCancel={() => setIsDialogOpen(false)}
              isSubmitting={isSubmitting}
              lessons={lessons}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!topicToDelete}
        onOpenChange={(open) => !open && setTopicToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>トピックスを削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </LayoutPage>
  );
};

export default memo(TopicListPage);
