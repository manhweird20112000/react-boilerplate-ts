import { lazy, type ReactElement } from "react";
import { Route, Routes } from "react-router-dom";

import { LayoutDefault } from "~/shared/layouts/default";

const HomePage = lazy(() => import("~/features/home/pages"));
const PostsPage = lazy(() => import("~/features/posts/pages"));
const NotFoundPage = lazy(() => import("~/features/errors/pages"));

/**
 * Application route tree; lazy-loaded feature pages stay in their modules.
 */
export function AppRoutes(): ReactElement {
  return (
    <Routes>
      <Route path="/" element={<LayoutDefault />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/posts" element={<PostsPage />} />
      </Route>
      <Route element={<LayoutDefault />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
