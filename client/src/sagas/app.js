/**
 * @module Sagas/App
 * @desc App
 */
import { all, put, select, takeLatest } from 'redux-saga/effects';

import { ActionTypes } from 'constants/index';

/**
 * Switch Menu
 *
 * @param {Object} action
 *
 */
export function* switchMenu({ payload }) {
  try {
    const transactions = yield select(state => state.logs.transactions);

    /* istanbul ignore else */
    if (!transactions.data.length) {
      yield put({
        type: ActionTypes.API_GET_TRANSACTIONS,
        payload,
      });
    }
  } catch (err) {
    /* istanbul ignore next */
    yield put({
      type: ActionTypes.EXCEPTION,
      payload: err,
    });
  }
}

/**
 * App Sagas
 */
export default function* root() {
  yield all([takeLatest(ActionTypes.SWITCH_MENU, switchMenu)]);
}
