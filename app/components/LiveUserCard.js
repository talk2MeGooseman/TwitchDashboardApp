import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Image
} from 'react-native';
import { Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';

const MILISECONDS_IN_MINUTE = 60000;

export default class LiveUserCard extends Component {

  static propTypes = {
    image_url: PropTypes.string.isRequired,
    user_id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    title: PropTypes.string,
    start_time: PropTypes.string,
    viewers_count: PropTypes.number,
    game_title: PropTypes.string,
    followers_count: PropTypes.number
  };

  setImageSize(height, width){
    let url = this.props.image_url.replace('{width}', width);
    url = url.replace('{height}', height);

    return url;
  }

  //TODO
  getLiveDuration() {
    let startTime = new Date(this.props.start_time);
    let elapsedTime = Math.abs(startTime.getTime() - Date.now());

    return Math.round(elapsedTime/MILISECONDS_IN_MINUTE);
  }

  getCardFooter() {
    if (this.props.live) {
      return this.createLiveFooter();
    } else {
      return this.createOfflineFooter();
    }
  }

  createLiveFooter() {
    return (
      <CardItem>
        <Left>
          <Button transparent>
            <Icon active name="people" />
            <Text>{this.props.viewers_count} Viewers</Text>
          </Button>
        </Left>
        <Body>
          <Button transparent>
            <Icon active name="videocam" />
            <Text>Live for {this.getLiveDuration()} min</Text>
          </Button>
        </Body>
      </CardItem>
    );
  }

  createOfflineFooter() {
    return (
      <CardItem>
        <Left>
          <Button transparent>
            <Icon active name="people" />
            <Text>{this.props.followers_count} Followers</Text>
          </Button>
        </Left>
      </CardItem>
    );
  }

  getCardLiveHeaderMetadata() {
    let jsxElements = [];
    if(this.props.live) {
      jsxElements.push(<Text note>{this.props.game_title}</Text>);
      jsxElements.push(<Text note>{this.props.title}</Text>);
    }

    return jsxElements;
  }

  render() {
    const { image_url, user_id, username, title, start_time, viewers_count, game_title } = this.props;
    return (
      <Card>
        <CardItem>
          <Body>
            <Text>{username}</Text>
            { this.getCardLiveHeaderMetadata() }
          </Body>
        </CardItem>
        <CardItem cardBody>
          <Button transparent onPress={alert}>
            <Image 
              source={ {uri: this.setImageSize(300, 533)} }
              style={{ height: 300, width: null, flex: 1 }}
            />
          </Button>
        </CardItem>
        { this.getCardFooter() }
      </Card>
    );
  }
}
