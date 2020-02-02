// @flow
/**
 * @module Actions/User
 * @desc User Actions
 */
import { createActions } from 'redux-actions';
import { ActionTypes } from 'constants/index';

export const { 
  apiGetTransactions: getTrans,
  apiUploadCsvFile: uploadFile,
 } = createActions({
  [ActionTypes.API_GET_TRANSACTIONS]: () => ({}),
  [ActionTypes.API_UPLOAD_CSV_FILE]: (fileData, loadProgress, toast) => ({fileData, loadProgress, toast}),
});
