import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LayoutDefault } from "~/layouts/default";
import { lazy, Suspense } from "react";

const HomePage = lazy(() => import("~/features/home/pages"));
const PostsPage = lazy(() => import("~/features/posts/pages"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<LayoutDefault />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/posts" element={<PostsPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
