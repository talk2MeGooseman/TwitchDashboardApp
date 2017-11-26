import React, {Component} from 'react';
import {View} from 'react-native';
import ClipCard from '../components/ClipCard';
import WebViewOverlay from '../components/WebViewOverlay';
import ClipsList from '../components/ClipsList';
import TwitchAPI from '../lib/TwitchAPI';
import { connect } from 'react-redux';
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
import { fetchUsersClips, fetchingUserClips, refreshUserClips } from '../redux/actions/userClipsActions';

class UserClipsView extends Component {
    static navigationOptions = ({navigation}) => {
        return({
            headerTitle: navigation.state.params.display_name,
            title: 'Clips'
        });
    };

    constructor(props) {
        super(props);
    }

    getMoreClips() {
        if(!this.props.cursor) {
            console.log('No more items to grab');
            return;
        }

        const { dispatch } = this.props.navigation;
        let channel_name = this.props.navigation.state.params.display_name;
        dispatch(fetchUsersClips(channel_name, this.props.cursor));
    }

    componentDidMount() {
        this.refreshUsersClips();
    }

    refreshUsersClips = () => {
        const { dispatch } = this.props.navigation;
        let channel_name = this.props.navigation.state.params.display_name;
        dispatch(refreshUserClips(channel_name));
    }

    displayClips() {
        return(
            <ClipsList 
                data={this.props.clips}
                onFetchNextPage={this.getMoreClips.bind(this)}
                toggleOverlay={ this.toggleVideoOverlay.bind(this) } 
                refreshing={this.props.refreshing}
                onRefresh={this.refreshUsersClips}
                loading={this.props.loading}
            />
        );                
    }

    toggleVideoOverlay(url) {
        this.props.navigation.navigate('VideoPlayerView', { embedUrl: url});
    }

    render(){
        let params = this.props.navigation.state.params;
        return(
            <Container>
                {this.displayClips()}
            </Container>    
        );
    }
}

const mapStateToProps = state => ({
    clips: state.userClips.clips,
    cursor: state.userClips.cursor,
    loading: state.userClips.loading,
    refreshing: state.userClips.refreshing,
});

export default connect(mapStateToProps)(UserClipsView);