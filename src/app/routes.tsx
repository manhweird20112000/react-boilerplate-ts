import { lazy, type ReactElement } from "react";
import { Route, Routes } from "react-router-dom";

import { LayoutDefault } from "~/shared/layouts/default";
import { LayoutAdmin } from "~/shared/layouts/admin";

const NotFoundPage = lazy(() => import("~/features/errors/pages"));
const AuthorListPage = lazy(
  () => import("~/features/author/pages/author-list-page"),
);
const AccountListPage = lazy(
  () => import("~/features/accounts/pages/account-list-page"),
);

/**
 * Application route tree; lazy-loaded feature pages stay in their modules.
 */
export function AppRoutes(): ReactElement {
  return (
    <Routes>
      <Route path="/admin" element={<LayoutAdmin />}>
        <Route path="authors" element={<AuthorListPage />} />
        <Route path="accounts" element={<AccountListPage />} />
      </Route>
      <Route element={<LayoutDefault />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
