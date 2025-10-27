import { Outlet } from "react-router-dom";

export function LayoutDefault() {
  return (
    <div id="main">
      <Outlet />
    </div>
  );
}
