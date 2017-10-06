/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  LayoutAnimation,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { 
  Container,
  Header,
  Content,
  Thumbnail,
  Text,
  Button,
  Icon,
  Left,
  Body,
  Right,
  Title,
  Spinner,
  Footer,
  FooterTab,
  Tab,
  Tabs,
  ActionSheet
} from 'native-base';
import ClipCard from '../components/ClipCard';
import TwitchAPI from '../lib/TwitchAPI';
import TrendingClipsList from '../components/TrendingClipsList';

const MOST_VIEWED = 0;
const TRENDING = 1;

const TAB1_NAME = "Most Viewed";
const TAB2_NAME = "Trending";

const BUTTONS = ["25 Clips", "50 Clips", "75 Clips", "100 clips", "Cancel"];
const CLIPS_25 = "0";
const CLIPS_50 = "1";
const CLIPS_75 = "2";
const CLIPS_100 = "3";
const CANCEL_INDEX = 4;

export default class TrendingClipsView extends Component {
    constructor() {
      super();
      this.state = {
        loading: true,
        authed: false
      };
  
      this.twitchAPI = new TwitchAPI();
    }
  
    componentDidMount() {
      this.twitchAPI.getUserAccessToken(this.userDidAuthenticate.bind(this));
    }
    
    userDidAuthenticate() {
      this.setState({
        authed: true
      });
    }

    // TODO: WTF IS THIS OK TO DO?
    displayClips(trending) {
      if(this.state.authed){
        return(<TrendingClipsList twitchAPI={this.twitchAPI} trending={trending} count={this.state.count} />);
      } else {
        return;
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
      //this.setState({ clicked: BUTTONS[buttonIndex] });
      let count = 25;
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
          <Footer>
            <FooterTab>
              <Button vertical>
                <Icon active name="trending-up" />
                <Text>My Top Clips</Text>
              </Button>
              <Button vertical>
                <Icon name="camera" />
                <Text>Subs and Follows</Text>
              </Button>
            </FooterTab>
          </Footer>
        </Container>
      );
    }
  }
  
  const styles = StyleSheet.create({
  });