import { createSelector } from 'reselect';

export const ApiOrdersListSelector = createSelector(
  state => state.api_orders.data,
  data => data,
);