import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LayoutDefault } from "~/layouts/default";
import { lazy, Suspense } from "react";
import { Spin } from "antd";

const HomePage = lazy(() => import("~/features/home/pages"));
const PostsPage = lazy(() => import("~/features/posts/pages"));
const LoginPage = lazy(() => import("~/features/auth/pages/login"));
const NotFoundPage = lazy(() => import("~/features/errors/pages"));

function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-screen">
            <Spin size="large" />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<LayoutDefault />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/posts" element={<PostsPage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<LayoutDefault />}>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
