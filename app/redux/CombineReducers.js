import AppNavigation from '../navigation/AppNavigation';
import { combineReducers } from 'redux';
import { AUTH_USER , USER_AUTHED } from './actions/userAuthActions';
import { FOLLOWING_RESPONSE, FETCHING_FOLLOWING, REFRESH_FOLLOWING, FILTER_FOLLOWING } from './actions/followActions';
import CONSTANTS from '../lib/Constants';

const navReducer = (state, action) => {
  const newState = AppNavigation.router.getStateForAction(action, state)
  return newState || state
}

function authTwitchApp(state = { loggedIn: false }, action) {
  switch (action.type) {
    case AUTH_USER:
    case USER_AUTHED:
      return Object.assign({}, state, action);
    default:
      return state;
  }
}

function userFollowing(state = { following: [], total: 0, loading: false, refreshing: false }, action) {
  switch (action.type) {
    case FILTER_FOLLOWING:
      return Object.assign({}, state, { filter: action.filter });
    case REFRESH_FOLLOWING:
      return Object.assign({}, state, { refreshing: true, following: [] });    
    case FETCHING_FOLLOWING:
      return Object.assign({}, state, { loading: true, following: [] });
    case FOLLOWING_RESPONSE:
      return Object.assign({}, state, { following: action.following, total: action.total, loading: false, refreshing: false });
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  nav: navReducer,
  authTwitchApp,
  userFollowing,
});

export default rootReducer;