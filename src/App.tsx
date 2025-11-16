import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LayoutDefault } from "~/layouts/default";
import { lazy, Suspense } from "react";

const HomePage = lazy(() => import("~/features/home/pages"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<LayoutDefault />}>
            <Route path="/" element={<HomePage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
