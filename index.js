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
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right, Title, Spinner, Tab, Tabs  } from 'native-base';
import LiveUserCard from './app/components/LiveUserCard';
import TwitchAPI from './app/lib/TwitchAPI';

export default class TwitchDashboardApp extends Component {
  constructor() {
    super();
    this.state = {
      live_user_cards: [],
      following_user_cards: [],
      vodcast_user_cards: [],
      live_loading: true,
      office_loading: true,
      vodcast_loading: true
    };

    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) { 
      UIManager.setLayoutAnimationEnabledExperimental(true); 
    }
  }


  componentWillMount() {
    this.populateLiveUsers();
    this.populateAllUsers();
    this.populateVodcastingUsers();
  }

  async populateLiveUsers() {
    let follows = await TwitchAPI.getUsersFollow(120750024);
    follows.push(120750024);
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
        game_title: usersInfo.game,
        live: true
      };

      userList.push(<LiveUserCard { ...passProps } />);
    };

    this.setState({
      live_user_cards: userList,
      live_loading: false
    });
  }

  async populateAllUsers() {
    const follows = await TwitchAPI.getUsersFollow(120750024);

    let userList = [];
    for(let user_id of follows)  {
      let usersInfo = await TwitchAPI.v5fetchUsersInfo(user_id);

      const passProps = {
        username: usersInfo.display_name,
        key: user_id,
        user_id: user_id,
        image_url: usersInfo.logo || '',
        followers_count: usersInfo.followers,
        live: false
      };

      userList.push(<LiveUserCard { ...passProps } />);
    };

    this.setState({
      following_user_cards: userList,
      offline_loading: false
    });
  }

  async populateVodcastingUsers() {
    const follows = await TwitchAPI.getUsersFollow(120750024);
    const vods = await TwitchAPI.fetchVodcastUsers(follows);

    let userList = [];
    for(let vod of vods)  {
      let usersInfo = await TwitchAPI.v5fetchUsersInfo(vod.user_id);

      const passProps = {
        username: usersInfo.display_name,
        key: vod.user_id,
        user_id: vod.user_id,
        title: vod.title,
        viewers_count: vod.viewer_count,
        start_time: vod.started_at,
        image_url: vod.thumbnail_url,
        game_title: usersInfo.game,
        live: true
      };

      userList.push(<LiveUserCard { ...passProps } />);
    };

    this.setState({
      vodcast_user_cards: userList,
      vodcast_loading: false
    });
  }

  renderActivityIndicator(loading_flag) { 
    if (this.state[loading_flag]) { 
      return (
        <ActivityIndicator color="white" size="large" style={ styles.spinner } />
      ); 
    } 
  }

  refreshLiveFollows() {
    this.setState({
      live_user_cards: [],
      following_user_cards: [],
      vodcast_user_cards: [],
      live_loading: true,
      offline_loading: true
    });

    this.populateLiveUsers();
    this.populateAllUsers();
    this.populateVodcastingUsers();
  }

  render() {
    return (
       <Container>
        <Header hasTabs >
          <Left>
            <Button transparent onPress={ () => { this.refreshLiveFollows() } }>
              <Icon name='refresh' />
            </Button>
          </Left>
          <Body>
            <Title>Following</Title>
          </Body>
          <Right>
          </Right>
        </Header>
        <Tabs initialPage={1}>
          <Tab heading="Live">
            <Content style={styles.content}>
              {this.state.live_user_cards}
              {this.renderActivityIndicator('live_loading')}
            </Content>
          </Tab>
          <Tab heading="VODcasts">
            <Content style={styles.content}>
              {this.state.vodcast_user_cards}
              {this.renderActivityIndicator('vodcast_loading')}
            </Content>
          </Tab>
          <Tab heading="All">
            <Content style={styles.content}>
               {this.state.following_user_cards}
              {this.renderActivityIndicator('offline_loading')}
            </Content>
          </Tab>
        </Tabs>
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
