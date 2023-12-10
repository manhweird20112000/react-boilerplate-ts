import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'

import appReducer from './features/app/index.slice'
import root from './saga'

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: {
    app: appReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware)
})
sagaMiddleware.run(root)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
