import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Image
} from 'react-native';
import { Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';

export default class LiveUserCard extends Component {

  static propTypes = {
    image_url: PropTypes.string.isRequired,
    user_id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    start_time: PropTypes.string.isRequired,
    viewers_count: PropTypes.number.isRequired
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

    return new Date(elapsedTime).getMinutes();
  }  

  render() {
    const { image_url, user_id, username, title, start_time, viewers_count } = this.props;
    return (
      <Card>
        <CardItem>
          <Body>
            <Text>{username}</Text>
            <Text note>{title}</Text>
          </Body>
        </CardItem>
        <CardItem cardBody>
          <Image source={ {uri: this.setImageSize(200, 356)} } style={{ height: 200, width: null, flex: 1 }} />
        </CardItem>
        <CardItem>
          <Left>
            <Button transparent>
              <Icon active name="people" />
              <Text>{viewers_count} Viewers</Text>
            </Button>
          </Left>
          <Body>
            <Button transparent>
              <Icon active name="videocam" />
              <Text>Live for {this.getLiveDuration()} min</Text>
            </Button>
          </Body>
        </CardItem>
      </Card>
    );
  }
}
