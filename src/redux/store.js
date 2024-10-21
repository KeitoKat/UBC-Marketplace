// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from './itemsReducer';
import usersReducer from './usersReducer';
import itemReportReducer from './itemReportReducer';
import userReportReducer from './userReportReducer';
import conversationReducer from './conversationReducer';
import orderReducer from './order/orderReducer';

/**
 *  The store is the object that brings actions and reducers together.
 * @type {EnhancedStore<any, UnknownAction, Tuple<[StoreEnhancer<{dispatch: ExtractDispatchExtensions<Tuple<[ThunkMiddlewareFor<any>]>>}>, StoreEnhancer]>>}
 */
const store = configureStore({
  reducer: {
    items: itemsReducer,
    users: usersReducer,
    itemReports: itemReportReducer,
    userReports: userReportReducer,
    conversations: conversationReducer,
    orders: orderReducer,
  },
});

store.subscribe(() => {
  const state = store.getState();
  const serializedState = JSON.stringify(state.items.itemList);
  localStorage.setItem('itemList', serializedState);
});

export default store;
