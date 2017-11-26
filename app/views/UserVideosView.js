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
import { connect } from 'react-redux';
import { fetchUsersVideos, refreshUserVideos} from '../redux/actions/userVideoActions';

class UserVideosView extends Component {
    static navigationOptions = ({navigation}) => {
        return({
            headerTitle: navigation.state.params.username,
            title: 'videos'
        });
    };

    componentDidMount() {
        this.refreshUsersVideos();
    }

    async refreshUsersVideos() {
        let offset = this.props.videos.length;
        let channel_id = this.props.navigation.state.params._id;
        let { dispatch } = this.props.navigation;
        dispatch(refreshUserVideos(channel_id, offset));
    }

    endReached = () => {
        if(this.props.loading) return;                
        if(this.props.videos.length >= this.props.total) {
            return;
        }

        let { dispatch } = this.props.navigation;
        let offset = this.props.videos.length;
        let channel_id = this.props.navigation.state.params._id;
        dispatch(fetchUsersVideos(channel_id, offset));
    }

    toggleVideoOverlay = (url) => {
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
        if (this.props.loading || this.props.refreshing) {
            return null;
        } else {
            return <Text style={{textAlign: 'center'}}>Nothing Here To See Move Along...</Text>;
        }
    }

    renderFooter = () => {
        if(this.props.loading) {
            return(<Spinner color='black'/>);
        } else {
            return null;
        }   
    }

    onRefresh = () => {
       this.refreshUsersVideos(); 
    }

    render() {
        return(
            <Container>
                <FlatList
                    style={styles.content}
                    data={this.props.videos}
                    keyExtractor={(item) => item._id}
                    renderItem={this.addVideoCard} 
                    onEndReached={this.endReached}
                    onEndReachedThreshold={0.50}
                    ListFooterComponent={this.renderFooter()}
                    ListEmptyComponent={this.renderEmptyList()}
                    onRefresh={this.onRefresh}
                    refreshing={this.props.refreshing}
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

const mapStateToProps = state => ({
    videos: state.userVideos.videos,
    cursor: state.userVideos.total,
    loading: state.userVideos.loading,
    refreshing: state.userVideos.refreshing,
});

export default connect(mapStateToProps)(UserVideosView);