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
    Tabs,
    Button,
    Icon
} from 'native-base';

export default class UserClipsView extends Component {
    static navigationOptions = ({navigation}) => {
        return({
            headerTitle: navigation.state.params.username,
            title: 'Clips'
        });
    };

    constructor(props) {
        super(props);

        this.state = {
            showVideoOverlay: false
        }
    }

    async getTopClips(cursor='') {
        console.log('Cursor value:', cursor);
        let channel_name = this.props.navigation.state.params.username;
        let results = await TwitchAPI.v5getTopClips({channel_name: channel_name, cursor: cursor});

       return results;
    }

    componentDidUpdate(prevProps, prevState) {

    }

    displayClips() {
        return(
            <ClipsList 
                getClipsFunc={this.getTopClips.bind(this)}
                toggleOverlay={ this.toggleVideoOverlay.bind(this) } 
                shouldPage={true}
            />);                
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
                {this.displayClips()}
                {this.renderVideoOverlay()}
            </Container>    
        );
    }
}