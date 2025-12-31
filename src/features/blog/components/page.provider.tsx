import { createContext, useReducer, type Dispatch } from "react";
import type { BlogState } from "../reducers/state";
import { blogReducer, initialState } from "../reducers/reducer";

export const PageContext = createContext<BlogState>(initialState);
export const PageDispatchContext = createContext<Dispatch<any>>(() => {});

export default function PageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(blogReducer, initialState);

  return (
    <PageContext.Provider value={state}>
      <PageDispatchContext.Provider value={dispatch}>
        {children}
      </PageDispatchContext.Provider>
    </PageContext.Provider>
  );
}
