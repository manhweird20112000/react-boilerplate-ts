import { Suspense, type ReactElement } from "react";
import { BrowserRouter } from "react-router-dom";

import { AppRoutes } from "./routes";

function App(): ReactElement {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div
            className="flex h-screen items-center justify-center"
            role="status"
            aria-label="Loading"
          >
            <div className="size-10 animate-spin rounded-full border-4 border-[#2C687B] border-t-transparent" />
          </div>
        }
      >
        <AppRoutes />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
