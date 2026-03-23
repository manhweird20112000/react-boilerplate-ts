import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./app/store";

import "~/i18n";

import "~/assets/styles/tailwind.css";

import { ConfigProvider } from "antd";
import viVN from "antd/es/locale/vi_VN";

createRoot(document.getElementById("root")!).render(
  <ConfigProvider
    locale={viVN}
    theme={{
      token: {
        borderRadius: 0,
        colorPrimary: "#2C687B",

        colorError: "#E74C3C",
        colorWarning: "#E76F2E",
        colorInfo: "#2C687B",
        colorSuccess: "#2ECC71",

        colorText: "#1F2D3D",
        colorTextSecondary: "#5A6B7B",
        colorTextTertiary: "#8FA3B8",
        colorTextQuaternary: "#C3CEDA",

        colorBorder: "#E0E6ED",
        colorBgContainer: "#FFFFFF",
        colorBgLayout: "#F7FAFC",
      },
    }}
    form={{
      colon: false,
      requiredMark: false,
    }}
  >
    <Provider store={store}>
      <App />
    </Provider>
  </ConfigProvider>,
);
