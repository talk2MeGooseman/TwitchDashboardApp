import AppNavigation from '../navigation/AppNavigation';
import { combineReducers } from 'redux';

const navReducer = (state, action) => {
  const newState = AppNavigation.router.getStateForAction(action, state)
  return newState || state
}

const rootReducer = combineReducers({
  nav: navReducer,
  // other reducers here
});

export default rootReducer;