// @flow
/**
 * @module Actions/App
 * @desc App Actions
 */

import uid from 'nanoid';
import { createActions } from 'redux-actions';

import { ActionTypes } from 'constants/index';

export { goBack, go, push, replace } from 'modules/history';

export const { hideAlert, showAlert, switchMenu } = createActions({
  [ActionTypes.SWITCH_MENU]: (query) => ({ query }),
  [ActionTypes.HIDE_ALERT]: (id) => ({ id }),
  [ActionTypes.SHOW_ALERT]: (message, options) => {
    const timeout = options.variant === 'danger' ? 5 : 10;

    return {
      id: options.id || uid(),
      icon: options.icon,
      message,
      position: options.position || 'bottom-right',
      variant: options.variant || 'dark',
      timeout: typeof options.timeout === 'number' ? options.timeout : timeout,
    };
  },
});
