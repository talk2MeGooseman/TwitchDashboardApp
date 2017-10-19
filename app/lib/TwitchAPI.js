import { Linking, AsyncStorage } from 'react-native';

const CLIENT_ID = 'imgxjm3xjyq0kupk8ln0s11b3bpu1x';
const TWITCH_ACCEPT = "application/vnd.twitchtv.v5+json";
const REDIRECT_URI = 'app://localhost/twitchdashboardapp';
const SCOPES = 'collections_edit user_follows_edit user_subscriptions user_read user_subscriptions';
const V5_TWITCH_BASE_URL = "https://api.twitch.tv/kraken";

export default class TwitchAPI {
    constructor(){
      this.access_token = null;
    }

    getUserAccessToken(callback) {
      const url = `${V5_TWITCH_BASE_URL}/oauth2/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}&force_verify=true`;
      Linking.openURL(url).catch(err => alert('An error occurred', err));;
      
      Linking.addEventListener('url', handleAccessTokenResponse );

      async function handleAccessTokenResponse(event){
        const access_token = event.url.toString().match( /access_token=([^&]+)/ );
        // Check for issue with Kindle Fire Tablet
        if (Array.isArray(access_token) && access_token.length === 2) {
          this.access_token = access_token[1];
          AsyncStorage.setItem('TWITCH:ACCESS_TOKEN:key',  this.access_token);
          await this.tokenValid();

          callback(access_token[1]);
        } else if(access_token) {
          this.access_token = access_token;
          AsyncStorage.setItem('TWITCH:ACCESS_TOKEN:key',  this.access_token);
          await this.tokenValid();

          callback(access_token);
        } else {
          callback(null);
        }
      }
    }

    async tokenValid(token) {
      try {
        if (!token) {
          token = await AsyncStorage.getItem('TWITCH:ACCESS_TOKEN:key');
        }
        const response = await fetch(`${V5_TWITCH_BASE_URL}?oauth_token=${token}`, { 
          method: 'GET',
          headers: {
            "client-id": CLIENT_ID,
            "accept": TWITCH_ACCEPT
          }
        }); 
    
        result = await response.json();

        if (result.token.user_id) {
          AsyncStorage.setItem('TWITCH:USER_ID:key', result.token.user_id);
        }

        console.log("Response", result);
      } catch (error) {
        console.log('Request Error: access_token', token, error)
        result = false;
      }
      return result.token.valid; 
    }

    async getTopClipsForUser({trending, cursor="", count=25}) {
      let result = {};
      let token = null;
      try {
        token = await AsyncStorage.getItem('TWITCH:ACCESS_TOKEN:key');
        const response = await fetch(`${V5_TWITCH_BASE_URL}/clips/followed?limit=${count}&trending=${trending}`, { 
          method: 'GET',
          headers: {
            "Client-ID": CLIENT_ID,
            "Authorization": `OAuth ${token}`,
            "Accept": TWITCH_ACCEPT,
            'Content-Type': 'application/json',
          }
        }); 
    
        result = await response.json();

        if(response.status === 401) throw result.message;
      } catch (error) {
        console.log('Request Error: access_token', token, error)
        result = false;
      }
      return result; 
    }

    static async fetchUsersInfo(user_id) {
        const response = await fetch(`${V5_TWITCH_BASE_URL}?id=${user_id}`, { 
          method: 'GET',
          headers: {
            "client-id":CLIENT_ID,
          }
        }); 
    
        let result = await response.json();
    
        return result.data; 
    }

    static async v5fetchUsersInfo(user_id) {
        const response = await fetch(`${V5_TWITCH_BASE_URL}/channels/${user_id}`, { 
          method: 'GET',
          headers: {
            "client-id": CLIENT_ID,
            "accept": TWITCH_ACCEPT
          }
        }); 
    
        let result = await response.json();
    
        return result; 
    }
    
    static async v5getUsersFollow(direction='desc') {
      let user_id = await AsyncStorage.getItem('TWITCH:USER_ID:key');
      const response = await fetch(`${V5_TWITCH_BASE_URL}/users/${user_id}/follows/channels?limit=100&direction=${direction}`, { 
          method: 'GET',
          headers: {
            "client-id": CLIENT_ID,
            "accept": TWITCH_ACCEPT
          }
      });
    
      let result = await response.json();

      return(result); 
    }

    static async v5getFollowedSteams() {
      let token = await AsyncStorage.getItem('TWITCH:ACCESS_TOKEN:key');
      
      const response = await fetch(`${V5_TWITCH_BASE_URL}/streams/followed?limit=100`, { 
          method: 'GET',
          headers: {
            "client-id": CLIENT_ID,
            "accept": TWITCH_ACCEPT,
            "Authorization": `OAuth ${token}`,            
          }
      });
    
      let result = await response.json();

      return(result); 
    }

    static async fetchLiveUsers(user_ids) {
      const params = user_ids.map((user_id) => `user_id=${user_id}` );

      const response = await fetch(`https://api.twitch.tv/helix/streams?${params.join('&')}&type%20=live&first=100`, { 
        method: 'GET',
        headers: {
          "client-id": CLIENT_ID,
        }
      }); 
  
      let result = await response.json();
  
      return(result.data); 
    }

    static async fetchVodcastUsers(user_ids) {
      const params = user_ids.map((user_id) => `user_id=${user_id}` );

      const response = await fetch(`https://api.twitch.tv/helix/streams?${params.join('&')}&type=vodcast&first=100`, { 
        method: 'GET',
        headers: {
          "client-id": CLIENT_ID,
        }
      }); 
  
      let result = await response.json();
  
      return(result.data); 
    }

    static async getUsersFollow(user_id) {
        const response = await fetch(`https://api.twitch.tv/helix/users/follows?from_id=${user_id}&first=100`, { 
            method: 'GET',
            headers: {
              "client-id": CLIENT_ID,
            }
        });
      
        let result = await response.json();

        const followed = result.data.map((item) => {
            return item.to_id;
        });

        return(followed); 
    }
}