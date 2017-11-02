/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
} from 'react-native';
import { 
  Container,
  Header,
  Button,
  Icon,
  Left,
  Right,
  Tab,
  Tabs,
  Title,
  Body,
  ActionSheet
} from 'native-base';
import TwitchAPI from '../lib/TwitchAPI';
import ClipsList from '../components/ClipsList';
import WebViewOverlay from '../components/WebViewOverlay';

const TAB1_NAME = "Most Viewed";
const TAB2_NAME = "Trending";

const BUTTONS = ["25 Clips", "50 Clips", "75 Clips", "100 clips", "Cancel"];
const CLIPS_25 = "0";
const CLIPS_50 = "1";
const CLIPS_75 = "2";
const CLIPS_100 = "3";
const CANCEL_INDEX = 4;

export default class TrendingClipsView extends Component {
    static navigationOptions = {
      drawerLabel: 'Top Clips'
    };

    constructor() {
      super();
      this.state = {
        overlayUrl: 'https://clips.twitch.tv/embed?clip=AmazonianEncouragingLyrebirdAllenHuhu&tt_medium=clips_api&tt_content=embed'
      };  
    }

    toggleVideoOverlay(url) {
      this.props.navigation.navigate('VideoPlayerView', { embedUrl: url});      
    }

    async getMostViewedClips() {
      let results = await TwitchAPI.getTopClipsForUser({trending: false, count: this.state.count});
      return results;
    }

    async getTrendingClips() {
      let results = await TwitchAPI.getTopClipsForUser({trending: true, count: this.state.count});
      return results;
    }

    displayClips(trending) {
      if (trending) {
        return(<ClipsList getClipsFunc={this.getTrendingClips.bind(this)} toggleOverlay={ this.toggleVideoOverlay.bind(this) } />);        
      } else {
        return(<ClipsList getClipsFunc={this.getMostViewedClips.bind(this)} toggleOverlay={ this.toggleVideoOverlay.bind(this) } />);
      }
    }

    displayFilterOption(){
      ActionSheet.show(
        {
          options: BUTTONS,
          cancelButtonIndex: CANCEL_INDEX,
          title: "Number of Clips"
        },
        this.userSelectedOption.bind(this)
      )
    }
    
    userSelectedOption(index) {
      let count = this.state.count;
      switch (index) {
        case CLIPS_25:
          count = 25;
          break;
          case CLIPS_50:
          count = 50;
          break;
          case CLIPS_75:
          count = 75;
          break;
          case CLIPS_100:
          count = 100;
          break;      
        default:
          break;
      }

      this.setState({
        count: count
      });
    }

    render() {
      return (
        <Container>
          <Header hasTabs>
            <Left>
              <Button onPress={() => {this.props.navigation.navigate('DrawerOpen');} }>
                <Icon name="menu" />
              </Button>
            </Left>
            <Body>
              <Title>Top Clips</Title>
            </Body>
            <Right>
              <Button onPress={() => this.displayFilterOption() }>
                <Icon name="ios-funnel" />
              </Button>
            </Right>
          </Header>
          <Tabs initialPage={0}>
            <Tab heading={TAB1_NAME}>
              {this.displayClips(false)}
            </Tab>
            <Tab heading={TAB2_NAME}>
              {this.displayClips(true)}
            </Tab>
          </Tabs>
        </Container>
      );
    }
  }
  
  const styles = StyleSheet.create({
  });