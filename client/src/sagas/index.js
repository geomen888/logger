import { all, fork } from 'redux-saga/effects';

import app from './app';
import log from './log';
import user from './user';

/**
 * rootSaga
 */
export default function* root() {
  yield all([fork(app), fork(log), fork(user)]);
}
