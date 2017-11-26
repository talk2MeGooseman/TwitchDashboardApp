import TwitchAPI from '../../lib/TwitchAPI';

export const FETCHING_USER_VIDEOS = 'FETCH_USER_VIDEOS';
export const USER_VIDEOS_RESPONSE  = 'USER_VIDEOS_RESPONSE';
export const REFRESH_USER_VIDEOS = 'REFRESH_USER_VIDEOS';

export const fetchingUserVideos = () => {
    return {
        type: FETCHING_USER_VIDEOS
    }
}

export function fetchUsersVideos(channel_id, offset) {
    return async (dispatch, getstate) => {
        dispatch(fetchingUserVideos());        
        dispatch(requestUserVideos(channel_id, offset));
    }
}

function isRefreshingUserVideos() {
    return {
        type: REFRESH_USER_VIDEOS
    }
}

export function refreshUserVideos(channel_id, offset) {
    return async (dispatch, getstate) => {
        dispatch(isRefreshingUserVideos());        
        dispatch(requestUserVideos(channel_id, offset));
    }    
}

function recievedUserVideos(response) {
    return {
        type: USER_VIDEOS_RESPONSE,
        videos: response.videos,
        total: response['_total']
    };    
}

function requestUserVideos(channel_id, offset) {
    return async (dispatch) => {
        let results = await TwitchAPI.v5getChannelVideos({channel_id: channel_id, offset: offset});
        dispatch(recievedUserVideos(results));
    }
};