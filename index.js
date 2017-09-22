/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Image,
  StyleSheet,
  UIManager,
  LayoutAnimation,
  ActivityIndicator,
  Platform,
  View 
} from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right, Title, Spinner  } from 'native-base';
import LiveUserCard from './app/components/LiveUserCard';
import TwitchAPI from './app/lib/TwitchAPI';

export default class TwitchDashboardApp extends Component {
  constructor() {
    super();
    this.state = {
      user_cards: [],
      loading: true
    };

    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) { 
      UIManager.setLayoutAnimationEnabledExperimental(true); 
    }
  }

  async populateLiveUsers() {
    const follows = await TwitchAPI.getUsersFollow(120750024);
    const liveUsers = await TwitchAPI.fetchLiveUsers(follows);

    let userList = [];

    for(let user of liveUsers)  {
      let usersInfo = await TwitchAPI.v5fetchUsersInfo(user.user_id);

      const passProps = {
        username: usersInfo.display_name,
        key: user.user_id,
        user_id: user.user_id,
        title: user.title,
        viewers_count: user.viewer_count,
        start_time: user.started_at,
        image_url: user.thumbnail_url,
        game_title: usersInfo.game
      };

      userList.push(<LiveUserCard { ...passProps } />);
    };

    this.setState({
      user_cards: userList,
      loading: false
    });
  }

  renderActivityIndicator() { 
    if (this.state.loading) { 
      return (
        <ActivityIndicator color="white" size="large" style={ styles.spinner } />
      ); 
    } 
  }

  refreshLiveFollows() {
    this.setState({
      user_cards: [],
      loading: true
    });

    this.populateLiveUsers();
  }

  componentWillMount() {
    this.populateLiveUsers();
  }
  
  render() {
    return (
       <Container>
       <Header>
          <Left>
            <Button transparent onPress={ () => { this.refreshLiveFollows() } }>
              <Icon name='refresh' />
            </Button>
          </Left>
          <Body>
            <Title>Live Channels</Title>
          </Body>
          <Right />
       </Header>
       <Content style={styles.content}>
          {this.state.user_cards}
          {this.renderActivityIndicator()}
       </Content>
     </Container>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'gray',
    flex: 1
  },
  spinner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: "center"
  }
});

AppRegistry.registerComponent('TwitchDashboardApp', () => TwitchDashboardApp);
