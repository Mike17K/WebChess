import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import rootReducer from './rootReducer';

const persistConfig = {
  key: 'WebChessClientState',
  storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const loggerMiddleware = (store) => (next) => (action) => {
  console.log('Action:', action);
  const result = next(action);
  console.log('State:', store.getState());
  return result;
};

const store = createStore(
  persistedReducer,
  applyMiddleware(loggerMiddleware)
);

const persistor = persistStore(store);

export { store, persistor };
