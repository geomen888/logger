/**
 * @module Sagas/GitHub
 * @desc GitHub
 */

import { all, call, put, takeLatest } from 'redux-saga/effects';
import { request } from 'modules/client';
import * as R from 'ramda';
import { ActionTypes } from 'constants/index';

/**
 * Get Repos
 *
 * @param {Object} action
 *
 */
export function* getTrans({ payload }) {
  try {
    const response = yield call(
      request,
      ` http://localhost:9005/api/transactions`,
    );
    console.log("getTrans:", response)
    yield put({
      type: ActionTypes.API_GET_TRANSACTIONS_SUCCESS,
      payload: R.propOr(({ tabHeaders: [], transactions:[] }),'data', response),
    });
  } catch (err) {
    /* istanbul ignore next */
    yield put({
      type: ActionTypes.API_GET_TRANSACTIONS_FAILURE,
      payload: err,
    });
  }
}

/**
 * GitHub Sagas
 */
export default function* root() {
  yield all([takeLatest(ActionTypes.API_GET_TRANSACTIONS, getTrans)]);
}
