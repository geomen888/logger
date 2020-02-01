// @flow
/**
 * @module Actions/User
 * @desc User Actions
 */
import { createActions } from 'redux-actions';
import { ActionTypes } from 'constants/index';

export const { apiGetTransactions: getTrans } = createActions({
  [ActionTypes.API_GET_TRANSACTIONS]: (query) => ({ query }),
});
