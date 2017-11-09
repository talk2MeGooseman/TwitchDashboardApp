import AppNavigation from '../navigation/AppNavigation';
import { combineReducers } from 'redux';
import { AUTH_USER , USER_AUTHED } from './actions';
import TwitchAPI from '../lib/TwitchAPI';

const navReducer = (state, action) => {
  const newState = AppNavigation.router.getStateForAction(action, state)
  return newState || state
}

function authTwitchApp(state = { valid: false }, action) {
  switch (action.type) {
    case AUTH_USER:
    case USER_AUTHED:
      return Object.assign({}, state, action);
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  nav: navReducer,
  authTwitchApp,
  // other reducers here
});

export default rootReducer;