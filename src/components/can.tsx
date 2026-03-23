import { useMemo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "~/app/store";

interface Props {
  resource: string;
  action: string;
  children: React.ReactNode;
}

export function Can({ resource, action, children }: Props) {
  const permissions: string[] = useSelector(
    (state: RootState) => state.auth.auth.permissions,
  );

  const permission = useMemo(() => {
    return `${resource}:${action}`;
  }, [resource, action]);

  if (!permissions.includes(permission)) {
    return null;
  }
  return children;
}
