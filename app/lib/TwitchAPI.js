export default class TwitchAPI {
    static async fetchUsersInfo(user_id) {
        const response = await fetch(`https://api.twitch.tv/helix/users?id=${user_id}`, { 
          method: 'GET',
          headers: {
            "client-id": "imgxjm3xjyq0kupk8ln0s11b3bpu1x",
          }
        }); 
    
        let result = await response.json();
    
        return result.data; 
    }

    static async v5fetchUsersInfo(user_id) {
        const response = await fetch(`https://api.twitch.tv/kraken/channels/${user_id}`, { 
          method: 'GET',
          headers: {
            "client-id": "imgxjm3xjyq0kupk8ln0s11b3bpu1x",
            "accept": "application/vnd.twitchtv.v5+json"
          }
        }); 
    
        let result = await response.json();
    
        return result; 
    }

    static async fetchLiveUsers(user_ids) {
      const params = user_ids.map((user_id) => `user_id=${user_id}` );

      const response = await fetch(`https://api.twitch.tv/helix/streams?${params.join('&')}&type%20=live&first=100`, { 
        method: 'GET',
        headers: {
          "client-id": "imgxjm3xjyq0kupk8ln0s11b3bpu1x",
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
          "client-id": "imgxjm3xjyq0kupk8ln0s11b3bpu1x",
        }
      }); 
  
      let result = await response.json();
  
      return(result.data); 
    }

    static async getUsersFollow(user_id) {
        const response = await fetch(`https://api.twitch.tv/helix/users/follows?from_id=${user_id}&first=100`, { 
            method: 'GET',
            headers: {
              "client-id": "imgxjm3xjyq0kupk8ln0s11b3bpu1x",
            }
        });
      
        let result = await response.json();

        const followed = result.data.map((item) => {
            return item.to_id;
        });

        return(followed); 
    }
}