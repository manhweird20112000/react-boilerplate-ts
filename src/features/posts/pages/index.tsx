import { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useHead } from "~/hooks/use-head";
import { postsActions } from "~/features/posts/store/slice";
import type { RootState } from "~/app/store";

function PostsPage() {
  useHead({ title: "Posts" });
  const dispatch = useDispatch();
  const { items, isLoading, hasError, errorMessage } = useSelector(
    (state: RootState) => state.posts
  );

  useEffect(() => {
    dispatch(postsActions.fetchPostsRequest());
  }, [dispatch]);

  if (isLoading) {
    return <div className="p-4 text-gray-500">Loading posts...</div>;
  }

  if (hasError) {
    return <div className="p-4 text-red-500">Error: {errorMessage}</div>;
  }

  return (
    <div className="mx-auto max-w-3xl p-4">
      <h1 className="mb-6 text-2xl font-bold">Posts</h1>
      <ul className="space-y-4">
        {items.map((post) => (
          <li
            key={post.id}
            className="rounded-lg border border-gray-200 p-4 shadow-sm transition hover:shadow-md"
          >
            <h2 className="mb-2 text-lg font-semibold capitalize">
              {post.title}
            </h2>
            <p className="text-sm text-gray-600">{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default memo(PostsPage);
