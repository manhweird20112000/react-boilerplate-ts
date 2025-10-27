import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LayoutDefault } from "~/layouts/default";
import { HomePage } from "~/features/home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LayoutDefault />}>
          <Route path="/" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
