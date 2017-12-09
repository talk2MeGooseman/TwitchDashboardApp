import TwitchAPI from '../../lib/TwitchAPI';

export const SET_USERS_INFO = 'SET_USERS_INFO';
export const REQUESTING_USER_INFO = 'REQUESTING_USER_INFO';
export const REQUESTING_CHANNELS_FOLLOWERS = 'REQUESTING_CHANNELS_FOLLOWERS';
export const CHANNEL_FOLLOWERS_RESPONSE = 'CHANNEL_FOLLOWERS_RESPONSE';

const requestingUsersInfo = () => {
    return {
        type: REQUESTING_USER_INFO,
    }
}

function requestingChannelsFollowers() {
    return {
        type: REQUESTING_CHANNELS_FOLLOWERS,
    }
}

function setUserInfo(data) {
    return {
        type: SET_USERS_INFO,
        userInfo: data
    };
} 

function fetchUsersInfo() {
    return async (dispatch) => {
        let users = await TwitchAPI.currentUserInfo();
        if (users.length > 0) {
            dispatch(setUserInfo(users[0]));
        }
    }
}

export function requestUserInfo() {
    return async (dispatch) => {
        dispatch(requestingUsersInfo());
        dispatch(fetchUsersInfo());
    }
}

function channelFollowersResponse(data) {
    return {
        type: CHANNEL_FOLLOWERS_RESPONSE,
        followersData: data
    }
}

function fetchChannelFollowers(channel_id) {
    return async (dispatch, getState) => {
        let result = await TwitchAPI.v5getChannelFollowers(channel_id);
        dispatch(channelFollowersResponse(result));
    }
}

export function requestUsersFollowers(channel_id) {
    return async (dispatch) => {
        dispatch(requestingChannelsFollowers());
        dispatch(fetchChannelFollowers(channel_id));
    }
}