import React, { Component } from "react";
import { View, FlatList, StyleSheet, AsyncStorage } from "react-native";
import { Text } from "native-base";
import { connect } from "react-redux";
import { fetchUsersVideos } from '../redux/actions/userVideoActions'
import ClipCard from "../components/ClipCard";
import EmptyListText from "../components/EmptyListText";
import ListFooter from "../components/ListFooter";

class ChannelVideosView extends Component {
    static navigationOptions = ({navigation}) => {
        return({
            headerTitle: 'Videos',
            title: 'videos'
        });
    };

    _endReached = async () => {
        if(this.props.loading) return;                
        if(this.props.videos.length >= this.props.total) {
            return;
        }
        let result = await AsyncStorage.getItem('TWITCH:USER_INFO:key');
        let userInfo = JSON.parse(result);
        let { dispatch } = this.props.navigation;

        let offset = this.props.videos.length;
        dispatch(fetchUsersVideos(userInfo.user_id, offset, 'current'));
    }

    _toggleVideoOverlay = (url) => {
        this.props.navigation.navigate('VideoPlayerView', { embedUrl: url});
    }

    _addVideoCard = ({item: video}) => {
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
            onImagePress: this._toggleVideoOverlay
        };

        return <ClipCard { ...passProps } />;
    }

    _renderEmptyList = () => {
        return <EmptyListText loading={this.props.loading} refreshing={this.props.refreshing} />
    }

    _renderFooter = () => {
        return <ListFooter loading={this.props.loading} />
    }

    _onRefresh = () => {
       this.refreshUsersVideos(); 
    }

    render() {
        return (
            <View>
                <FlatList
                    style={styles.content}
                    data={this.props.videos}
                    keyExtractor={(item) => item._id}
                    renderItem={this._addVideoCard} 
                    onEndReached={this._endReached}
                    onEndReachedThreshold={0.50}
                    ListFooterComponent={this._renderFooter()}
                    ListEmptyComponent={this._renderEmptyList()}
                /> 
            </View>
        )
    }
}

const styles = StyleSheet.create({
    content: {
      backgroundColor: 'gray',
    },
});

const stateToProps = (state) => ({
    videos: state.currentUserVideos.videos,
    total: state.currentUserVideos.total,
    loading: state.currentUserVideos.loading,
    refreshing: state.currentUserVideos.refreshing,
});
export default connect(stateToProps)(ChannelVideosView);