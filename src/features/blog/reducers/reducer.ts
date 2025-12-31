import { Page } from "../models";
import type { BlogState } from "./state";

export const initialState: BlogState = {
  page: new Page("page-1"),
  version: 0,
};

export function blogReducer(state: BlogState = initialState, action: any) {
  switch (action.type) {
    case "LOAD_PAGE":
      return { ...state, page: action.payload };
    case "UPDATE_VERSION":
      return { ...state, version: state.version + 1 };
    default:
      return state;
  }
}
