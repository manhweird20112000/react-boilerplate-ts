export interface Lesson {
  readonly id: number;
  readonly title: string;
  readonly workspace_id: number;
  readonly lesson_no: number;
}

export interface Topic {
  readonly id: number;
  readonly name: string;
  readonly sort_order: number;
}

export interface TopicDetail extends Topic {
  readonly lessons: readonly Lesson[];
}

export interface TopicCreateInput {
  readonly name: string;
  readonly lesson_ids: readonly number[];
}

export interface TopicUpdateInput {
  readonly name: string;
  readonly lesson_ids: readonly number[];
}

export interface TopicListQuery {
  readonly order_by?: "asc" | "desc";
}
