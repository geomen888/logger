import { parseError } from 'modules/client';
import { handleActions } from 'redux-actions';
import * as R from 'ramda';
import immutable from 'immutability-helper';

import { ActionTypes, STATUS } from 'constants/index';

export const TransactionsState = {
  transactions: {
    data: [],
    status: STATUS.IDLE,
    tabHeaders: [],
    message: '',
  },
  uploading: {
    status: STATUS.IDLE,
    message: '',
  },
  mimeTypes: ["application/csv",
  "application/x-csv",
  "text/csv",
  "text/comma-separated-values",
  "text/x-comma-separated-values",
  "text/tab-separated-values" ]
};

function formatHireDate(dateStr) {
 const d = dateStr ? new Date(dateStr) : new Date();
return (d.getTime() + Math.abs(d.getTimezoneOffset()*60*1000));
} 

export default {
  logs: handleActions(
    {
      [ActionTypes.API_GET_TRANSACTIONS]: (draft) => immutable(draft, {
        transactions: {
          status: { $set: STATUS.RUNNING },
          message: { $set: '' }
        },
      }),
      [ActionTypes.API_GET_TRANSACTIONS_SUCCESS]: (draft, { payload: { transactions, tabHeaders } }) => immutable(draft, {
        transactions: {
          status: { $set: STATUS.SUCCESS },
          data: { $set: R.unless(R.isEmpty, R.map(R.evolve({ datetime: formatHireDate, amount: R.ifElse(R.isNil, R.always(0), (str)=> parseInt(str) )})))(transactions) },
          tabHeaders: { $set: tabHeaders },
        }
      }),
      [ActionTypes.API_GET_TRANSACTIONS_FAILURE]: (draft, { payload }) => immutable(draft, {
        transactions: {
          status: { $set: STATUS.ERROR },
          message: { $set: parseError(payload.message) },
        }
      }),
      [ActionTypes.API_UPLOAD_CSV_FILE]: (draft) => immutable(draft, {
        uploading: {
          status: { $set: STATUS.RUNNING },
          message: { $set: '' }
        },
      }),
      [ActionTypes.API_UPLOAD_CSV_FILE_SUCCESS]: (draft) => immutable(draft, {
        uploading: {
          status: { $set: STATUS.SUCCESS },
        }
      }),
      [ActionTypes.API_UPLOAD_CSV_FILE_FAILURE]: (draft, { payload }) => immutable(draft, {
        uploading: {
          status: { $set: STATUS.ERROR },
          message: { $set: parseError(payload.message) },
        }
      }),
    },
    TransactionsState,
  ),
};
