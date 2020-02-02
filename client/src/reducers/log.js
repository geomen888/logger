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
};

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
          data: { $set: R.unless(R.isEmpty, R.map(R.evolve({ amount: R.ifElse(R.isNil, R.always(0), (str)=> parseInt(str) )})))(transactions) },
          tabHeaders: { $set: tabHeaders },
        }
      }),
      [ActionTypes.API_GET_TRANSACTIONS_FAILURE]: (draft, { payload }) => immutable(draft, {
        transactions: {
          status: { $set: STATUS.ERROR },
          message: { $set: parseError(payload.message) },
        }
      }),
    },
    TransactionsState,
  ),
};
