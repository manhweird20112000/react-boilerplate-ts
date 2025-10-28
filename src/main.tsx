import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { ConfigProvider } from "@arco-design/web-react";
import jaJP from "@arco-design/web-react/es/locale/ja-JP";

import "~/i18n";

import "~/assets/styles/tailwind.css";
import "@arco-design/web-react/dist/css/arco.css";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ConfigProvider locale={jaJP}>
      <App />
    </ConfigProvider>
  </Provider>
);
