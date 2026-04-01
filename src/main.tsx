import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import App from "./app/App.tsx";
import { store } from "./app/store";

import "~/i18n";

import "~/assets/styles/tailwind.css";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
