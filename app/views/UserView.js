import React, {Component} from 'react';
import {View} from 'react-native';
import ClipCard from '../components/ClipCard';
import WebViewOverlay from '../components/WebViewOverlay';
import ClipsList from '../components/ClipsList';
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
            showVideoOverlay: false
        }
    }

    async getTopClips() {
        let username = this.props.navigation.state.params.username;
        let results = await TwitchAPI.v5getTopClips(username);

       return results;
    }

    componentDidUpdate(prevProps, prevState) {

    }

    displayClips() {
        return(<ClipsList getClipsFunc={this.getTopClips.bind(this)} toggleOverlay={ this.toggleVideoOverlay.bind(this) } />);                
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
                        {this.displayClips()}
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