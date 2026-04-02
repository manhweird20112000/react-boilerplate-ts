import type { Future } from "@/shared/types/common";
import type {
  Lesson,
  Topic,
  TopicCreateInput,
  TopicDetail,
  TopicListQuery,
  TopicUpdateInput,
} from "../types";

/**
 * Mock data for topics
 */
const MOCK_TOPICS: Topic[] = [
  { id: 1, name: "Introduction to AI", sort_order: 1 },
  { id: 2, name: "Machine Learning Basics", sort_order: 2 },
  { id: 3, name: "Deep Learning Foundations", sort_order: 3 },
];

const MOCK_LESSONS: Lesson[] = [
  { id: 10, title: "What is Machine Learning?", workspace_id: 1, lesson_no: 1 },
  { id: 11, title: "Deep Learning Basics", workspace_id: 1, lesson_no: 2 },
  { id: 12, title: "Neural Networks 101", workspace_id: 1, lesson_no: 3 },
  { id: 13, title: "Python for AI", workspace_id: 1, lesson_no: 4 },
  { id: 14, title: "Data Preprocessing", workspace_id: 1, lesson_no: 5 },
];

export const getTopicList = (_query?: TopicListQuery): Future<Topic[]> => {
  return Promise.resolve({
    data: {
      message: "Success",
      data: MOCK_TOPICS,
    },
    status: 200,
    statusText: "OK",
    headers: {},
    config: {} as any,
  } as any);
};

export const getTopicById = (id: number): Future<TopicDetail> => {
  const topic = MOCK_TOPICS.find((t) => t.id === id) || MOCK_TOPICS[0];
  return Promise.resolve({
    data: {
      message: "Success",
      data: {
        ...topic,
        lessons: [MOCK_LESSONS[0], MOCK_LESSONS[1]], // Mocking associated lessons
      },
    },
    status: 200,
    statusText: "OK",
    headers: {},
    config: {} as any,
  } as any);
};

export const createTopic = (data: TopicCreateInput): Future<Topic> => {
  return Promise.resolve({
    data: {
      message: "Created successfully",
      data: {
        id: Math.floor(Math.random() * 100) + 10,
        name: data.name,
        sort_order: MOCK_TOPICS.length + 1,
      },
    },
    status: 201,
    statusText: "Created",
    headers: {},
    config: {} as any,
  } as any);
};

export const updateTopic = (
  _id: number,
  data: TopicUpdateInput,
): Future<Topic> => {
  return Promise.resolve({
    data: {
      message: "Updated successfully",
      data: {
        id: _id,
        name: data.name,
        sort_order: 1,
      },
    },
    status: 200,
    statusText: "OK",
    headers: {},
    config: {} as any,
  } as any);
};

export const deleteTopic = (_id: number): Future<boolean> => {
  return Promise.resolve({
    data: {
      message: "Deleted successfully",
      data: true,
    },
    status: 200,
    statusText: "OK",
    headers: {},
    config: {} as any,
  } as any);
};

export const reorderTopics = (_ids: number[]): Future<void> => {
  return Promise.resolve({
    data: {
      message: "Reordered successfully",
      data: undefined,
    },
    status: 200,
    statusText: "OK",
    headers: {},
    config: {} as any,
  } as any);
};

/**
 * Mocking lesson list as requested by the user.
 */
export const getLessonList = (): Future<Lesson[]> => {
  return Promise.resolve({
    data: {
      message: "Success",
      data: MOCK_LESSONS,
    },
    status: 200,
    statusText: "OK",
    headers: {},
    config: {} as any,
  } as any);
};
