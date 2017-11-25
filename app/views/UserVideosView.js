import React, {
    Component,
} from 'react';
import {
    StyleSheet,
    Text,
    FlatList,    
} from 'react-native';
import {
    Container,
    Spinner,
} from 'native-base';
import TwitchAPI from '../lib/TwitchAPI';
import ClipCard from '../components/ClipCard';

export default class UserVideosView extends Component {
    static navigationOptions = ({navigation}) => {
        return({
            headerTitle: navigation.state.params.username,
            title: 'videos'
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            videos: [],
            totalVideo: null,
            loading: true,
            refreshing: false,
        };
    }

    componentDidMount() {
        this.getVideos();
    }

    async getVideos() {
        let offset = this.state.videos.length;
        let channel_id = this.props.navigation.state.params._id;

        let results = await TwitchAPI.v5getChannelVideos({channel_id: channel_id, offset: offset});

        let videos = [...this.state.videos, ...results.videos];
     
        this.setState({
            videos: videos,
            totalVideo: results._total,
            loading: false,
            refreshing: false,
        });
    }

    endReached = () => {
        if(this.state.loading) return;                
        if(this.state.videos.length >= this.state.totalVideo) {
            return;
        }

        this.setState(
            {
                loading: true
            },
            () => { this.getVideos() }    
        );
    }

    toggleVideoOverlay = (url) => {
        // let splits = url.split('/');
        // if(splits.length === 0) return;

        // const vID = splits.pop();
        // let newUrl = 'http://player.twitch.tv/?video=v40464143&autoplay=false'
        this.props.navigation.navigate('VideoPlayerView', { embedUrl: url});
    }

    addVideoCard = ({item: video}) => {
        const passProps = {
            username: video.channel.display_name,
            key: video._id,
            user_id: `${video.channel._id}`,
            image_url: video.preview.medium,
            views: video.views,
            duration: video.length,
            game_title: video.game,
            created_at: video.created_at,
            url: video.url,
            title: video.title,
            onImagePress: this.toggleVideoOverlay
        };

        return <ClipCard { ...passProps } />;
    }

    renderEmptyList = () => {
        if (this.state.loading) {
            return null;
        } else {
            return <Text style={{textAlign: 'center'}}>Nothing Here To See Move Along...</Text>;
        }
    }

    renderFooter = () => {
        if(this.state.loading) {
            return(<Spinner color='black'/>);
        } else {
            return null;
        }   
    }

    onRefresh = () => {
        this.setState({
            videos: [],
            totalVideo: null,
            loading: true,
            refreshing: true,
        }, () => { this.getVideos() } );
    }

    render() {
        return(
            <Container>
                <FlatList
                    style={styles.content}
                    data={this.state.videos}
                    keyExtractor={(item) => item._id}
                    renderItem={this.addVideoCard} 
                    onEndReached={this.endReached}
                    onEndReachedThreshold={0.50}
                    ListFooterComponent={this.renderFooter()}
                    ListEmptyComponent={this.renderEmptyList()}
                    onRefresh={this.onRefresh}
                    refreshing={this.state.refreshing}
                /> 
            </Container>            
        );
    }
}

const styles = StyleSheet.create({
    content: {
      backgroundColor: 'gray',
    },
    spinner: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: "center"
    },
    noClipsText: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold'
    }
});