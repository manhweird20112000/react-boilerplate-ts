import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LayoutDefault } from "~/layouts/default";
import { lazy, Suspense } from "react";

const HomePage = lazy(() => import("~/features/home/pages"));
const PostsPage = lazy(() => import("~/features/posts/pages"));
const LoginPage = lazy(() => import("~/features/auth/pages/login"));
const NotFoundPage = lazy(() => import("~/features/errors/pages"));

function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center" role="status" aria-label="Loading">
            <div className="size-10 animate-spin rounded-full border-4 border-[#2C687B] border-t-transparent" />
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
