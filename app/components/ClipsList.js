import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  StyleSheet,
  LayoutAnimation,
  ActivityIndicator,
  Platform,
  FlatList
} from 'react-native';
import { 
  Content,
  Text,
} from 'native-base';
import ClipCard from '../components/ClipCard';
import TwitchAPI from '../lib/TwitchAPI';

export default class ClipsList extends Component {
    static propTypes = {
        toggleOverlay: PropTypes.func.isRequired,
        onFetchNextPage: PropTypes.func,
        onRefresh: PropTypes.func,
        data: PropTypes.array,
        loading: PropTypes.bool,
        refreshing: PropTypes.bool,
    };

    endReached = () => {
        if(this.props.loading) return;
        if(this.props.onFetchNextPage) {
            this.props.onFetchNextPage();
        } else {
            return false;
        }
    }

    addClip = ({item: clip}) => {
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
            onImagePress: this.props.toggleOverlay
        };

        return <ClipCard { ...passProps } />;
    }

    renderActivityIndicator = () => {
        let comp = null;
        if (this.props.loading) {
            comp = <ActivityIndicator color="black" size="large" style={ styles.spinner } />
        } 
        return comp;
    }

    renderEmptyList = () => {
        if (this.props.loading || this.props.refreshing) {
            return null;
        } else {
            return <Text style={{textAlign: 'center'}}>Nothing Here To See Move Along...</Text>;
        }
    }

    renderHeader = () => {
        if(this.props.renderHeader) {
            return this.props.renderHeader();
        } else {
            return false;
        }
    }

    onRefresh = () => {
        if(this.props.onRefresh) {
            this.props.onRefresh();
        } else {
            return false
        }
    }

    render(){
        return(
            <FlatList
                style={styles.content}
                data={this.props.data}
                renderItem={this.addClip}
                keyExtractor={(item) => item.tracking_id}
                onEndReached={this.endReached}
                onEndReachedThreshold={0.80}
                ListHeaderComponent={this.renderHeader}
                ListFooterComponent={this.renderActivityIndicator}
                ListEmptyComponent={this.renderEmptyList}
                onRefresh={this.onRefresh}
                refreshing={this.props.refreshing}
            />            
        );  
    }
};

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