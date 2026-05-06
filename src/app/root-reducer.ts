import { combineReducers } from '@reduxjs/toolkit'

/**
 * Root Redux reducer composed from feature module reducers.
 */
function reduceAppPlaceholder(state: null = null): null {
  return state
}

export const rootReducer = combineReducers({
  app: reduceAppPlaceholder
})

export type RootReducerState = ReturnType<typeof rootReducer>
