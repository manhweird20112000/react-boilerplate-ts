import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div id="auth">
      <Outlet />
    </div>
  );
}
