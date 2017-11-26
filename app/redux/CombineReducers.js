import AppNavigation from '../navigation/AppNavigation';
import { combineReducers } from 'redux';
import { AUTH_USER, USER_AUTHED } from './actions/userAuthActions';
import { FOLLOWING_RESPONSE, FETCHING_FOLLOWING, REFRESH_FOLLOWING, FILTER_FOLLOWING } from './actions/followActions';
import { FETCHING_USER_CLIPS, USER_CLIPS_RESPONSE, REFRESH_USER_CLIPS } from "./actions/userClipsActions";
import { FETCHING_USER_VIDEOS, USER_VIDEOS_RESPONSE, REFRESH_USER_VIDEOS } from "./actions/userVideoActions";
import { TRENDING_CLIPS_COUNT, SUGGESTED_TOP_CLIPS_COUNT, SUGGESTED_TOP_CLIPS_RESPONSE, FETCHING_SUGGESTED_TOP_CLIPS, FETCHING_TRENDING_CLIPS, TRENDING_CLIPS_RESPONSE, FETCH_TRENDING_CLIPS } from "./actions/topClipsActions";
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

function userClips(state = { clips: [], cursor: '', loading: false, refreshing: false }, action) {
  switch (action.type) {
    case REFRESH_USER_CLIPS:
      return Object.assign({}, state, { clips: [], refreshing: true});
    case FETCHING_USER_CLIPS:
      return Object.assign({}, state, { loading: true });
    case USER_CLIPS_RESPONSE:
      return Object.assign({}, state, { clips: state.clips.concat(action.clips), cursor: action.cursor, loading: false, refreshing: false });
    default:
      return state;
  }
}

function userVideos(state = { videos: [], total: 0, loading: false, refreshing: false }, action) {
  switch (action.type) {
    case REFRESH_USER_VIDEOS:
      return Object.assign({}, state, { videos: [], refreshing: true});
    case FETCHING_USER_VIDEOS:
      return Object.assign({}, state, { loading: true });
    case USER_VIDEOS_RESPONSE:
      return Object.assign({}, state, { videos: state.videos.concat(action.videos), total: action.total, loading: false, refreshing: false });
    default:
      return state;
  }
}

function topClips(state = { top_clips: [], trending_clips: [], suggested_count: 25, trending_count: 25, loading: true, refreshing: false }, action) {
  switch (action.type) {
    case FETCHING_SUGGESTED_TOP_CLIPS:
      return Object.assign({}, state, { loading: true, top_clips: []});
    case FETCHING_TRENDING_CLIPS:
      return Object.assign({}, state, { loading: true, trending_clips: []});
    case TRENDING_CLIPS_COUNT:
      return Object.assign({}, state, { trending_count: action.trending_count});
    case SUGGESTED_TOP_CLIPS_COUNT:
      return Object.assign({}, state, { suggested_count: action.suggested_count});
    case SUGGESTED_TOP_CLIPS_RESPONSE:
      return Object.assign({}, state, { top_clips: action.top_clips, loading: false, refreshing: false });
    case TRENDING_CLIPS_RESPONSE:
      return Object.assign({}, state, { trending_clips: action.trending_clips, loading: false, refreshing: false });
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  nav: navReducer,
  authTwitchApp,
  userFollowing,
  userClips,
  userVideos,
  topClips,
});

export default rootReducer;