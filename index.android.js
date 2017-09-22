/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Image
} from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';
import LiveUserCard from './app/components/LiveUserCard';
import TwitchAPI from './app/lib/TwitchAPI';

export default class TwitchDashboardApp extends Component {
  constructor() {
    super();
    this.state = {
      user_cards: []
    };
  }

  async populateLiveUsers() {
    const follows = await TwitchAPI.getUsersFollow(120750024);
    const liveUsers = await TwitchAPI.fetchLiveUsers(follows);

    let userList = [];

    for(let user of liveUsers)  {
      let usersInfo = await TwitchAPI.fetchUsersInfo(user.user_id);

      const passProps = {
        username: usersInfo[0].display_name,
        user_id: user.user_id,
        title: user.title,
        viewers_count: user.viewer_count,
        start_time: user.started_at,
        image_url: user.thumbnail_url
      };

      userList.push(<LiveUserCard { ...passProps } />);
    };

    this.setState({
      user_cards: userList
    });
  }

  componentWillMount() {
    this.populateLiveUsers();
  }
  
  render() {
    return (
       <Container>
       <Header />
       <Content>
          {this.state.user_cards}
       </Content>
     </Container>
    );
  }
}

AppRegistry.registerComponent('TwitchDashboardApp', () => TwitchDashboardApp);
