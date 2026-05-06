import { combineReducers } from '@reduxjs/toolkit'

/**
 * Root Redux reducer composed from feature module reducers.
 */
export const rootReducer = combineReducers({})

export type RootReducerState = ReturnType<typeof rootReducer>
