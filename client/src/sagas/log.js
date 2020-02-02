/**
 * @module Sagas/Log
 * @desc Log
 */

import { all, call, put, takeLatest } from 'redux-saga/effects';
import { request } from 'modules/client';
import * as R from 'ramda';
import { showAlert } from '../actions';
import axios from 'axios';
import { ActionTypes } from 'constants/index';

/**
 * Get Transactions
 *
 * @param {Object} action
 *
 */
export function* getTrans({}) {
  try {
    const response = yield call(
      request,
      'http://172.19.0.5:9005/api/transactions',
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

export function* uploadFile({ payload: { fileData, loadProgress, toast } }) {
  try {
    const  response = yield call(axios.post, 'http://172.19.0.5:9005/api/file', fileData, loadProgress);
    const { data: { data: feed } } = response;
    console.info(`uploadFile:feed:`, JSON.stringify(feed));
    toast.success('upload success')
    yield all([put({
      type: ActionTypes.API_UPLOAD_CSV_FILE_SUCCESS,
      payload: { feed },
    }),
    put({
      type: ActionTypes.API_GET_TRANSACTIONS,
      payload: {},
    })
  
  ])
  }
  catch (err) {
    /* istanbul ignore next */
    let message;
    // eslint-disable-next-line no-console
    console.error('uploadFile:err:', err.response);
    if (err.response) {
      switch (err.response.status) {
        case 500:
          message = 'Internal Server Error';
          break;
        case 501:
          message = R.propOr('Internal Server Error', 'data')(err.response);
            break;  
        case 401:
          message = R.propOr('Invalid credentials', 'data')(err.response)
          break;
        case 403:
            message = R.propOr('Invalid credentials', 'data')(err.response);
         break;
        case 204:
          message = 'No Content';
          break;
        default:
          message = 'Something went wrong';
      }
    }
    toast.error('upload fail')
    console.error('uploadFile:err:message', message);
    if (R.has('code', message)) {
      yield put(showAlert(`code:${message.code}msg:${message.message}:${R.compose(R.toString, R.omit(['message', 'code']))(message)}`, { variant: err.response.status >= 500 ? 'danger' : 'warning', icon: 'check' }))
    }
    yield put({
      type: ActionTypes.API_UPLOAD_CSV_FILE_FAILURE,
      payload: { message },
    });
  }
}

/**
 * Log Sagas
 */
export default function* root() {
  yield all([
    takeLatest(ActionTypes.API_GET_TRANSACTIONS, getTrans),
    takeLatest(ActionTypes.API_UPLOAD_CSV_FILE, uploadFile)
  ]);
}
