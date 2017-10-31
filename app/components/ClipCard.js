import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Image
} from 'react-native';
import { Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';

const MILISECONDS_IN_MINUTE = 60000;

export default class ClipCard extends PureComponent {

  static propTypes = {
    image_url: PropTypes.string.isRequired,
    user_id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    views: PropTypes.number.isRequired,
    game_title: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    embed_url: PropTypes.string,
    onImagePress: PropTypes.func.isRequired
  };

  createFooter() {
    return (
      <CardItem>
        <Left>
          <Button transparent>
            <Icon active name="people" />
            <Text>{this.props.views} Views</Text>
          </Button>
        </Left>
        <Right>
          <Button transparent>
            <Icon active name="timer" />
            <Text>{Math.round(this.props.duration)} seconds</Text>
          </Button>
        </Right>
      </CardItem>
    );
  }

  createHeaderInformation() {
    let jsxElements = [];
    jsxElements.push(<Text key="1" >{this.props.title}</Text>);
    jsxElements.push(<Text note key="2">{this.props.username}</Text>);    
    jsxElements.push(<Text note key="3">{this.props.game_title}</Text>);
    return jsxElements;
  }

  render() {
    const { image_url } = this.props;
    return (
      <Card>
        <CardItem>
          <Body>
            { this.createHeaderInformation() }
          </Body>
        </CardItem>
        <CardItem cardBody>
          <Content>
            <Button style={{ height: 272, width: null,}} transparent onPress={ () => this.props.onImagePress(this.props.embed_url) }>
              <Image source={ {uri: image_url} } style={{ height: 272, width: null, flex: 1 }} />
            </Button>
          </Content>
        </CardItem>
        { this.createFooter() }
      </Card>
    );
  }
}