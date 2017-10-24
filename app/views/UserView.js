import React, {Component} from 'react';
import {View} from 'react-native';
import ClipCard from '../components/ClipCard';
import WebViewOverlay from '../components/WebViewOverlay'
import TwitchAPI from '../lib/TwitchAPI';
import {
    Text,
    Container,
    Header,
    Left,
    Right,
    Content,
    Body,
    Title,
    Tab,
    Tabs
} from 'native-base';

const TAB1_NAME = 'Clips';
const TAB2_NAME = 'Videos'

export default class UserView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            clips: [],
            showVideoOverlay: false
        }
    }

    componentDidMount() {
        this.getTopClips();
    }

    async getTopClips() {
        let username = this.props.navigation.state.params.username;
        let results = await TwitchAPI.v5getTopClips(username);

        this.setState({
            clips: results.clips
        });
    }

    componentDidUpdate(prevProps, prevState) {

    }

    displayClips() {
        let jsxElements = [];

        for(let clip of this.state.clips) {
            const passProps = {
              username: clip.broadcaster.display_name,
              key: clip.tracking_id,
              user_id: clip.broadcaster.id,
              image_url: clip.thumbnails.medium,
              views: clip.views,
              duration: clip.duration,
              game_title: clip.game,
              created_at: clip.created_at,
              url: clip.url,
              embed_url: clip.embed_url,
              title: clip.title,
              onImagePress: this.toggleVideoOverlay.bind(this)
            };
      
            jsxElements.push(<ClipCard { ...passProps } />);
        };
        
        return jsxElements;
    }

    displayVideos() {
        return;
    }

    toggleVideoOverlay(url) {
        this.setState({
          showVideoOverlay: !this.state.showVideoOverlay,
          overlayUrl: url
        });
    }

    renderVideoOverlay() {
        if(!this.state.showVideoOverlay) return;
  
        return <WebViewOverlay url={this.state.overlayUrl} toggleOverlay={this.toggleVideoOverlay.bind(this)} />
    }

    render(){
        let params = this.props.navigation.state.params;
        return(
            <Container>
                <Header hasTabs>
                <Left>
                </Left>
                <Body>
                    <Title>{params.username}</Title>
                </Body>
                <Right />
                </Header>
                <Tabs initialPage={0}>
                    <Tab heading={TAB1_NAME}>
                        <Content>
                            {this.displayClips()}
                        </Content>
                    </Tab>
                    <Tab heading={TAB2_NAME}>
                        <Content>                    
                            {this.displayVideos()}
                        </Content>
                    </Tab>
                </Tabs>
                {this.renderVideoOverlay()}
            </Container>    
        );
    }
}