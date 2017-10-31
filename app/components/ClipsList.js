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
        getClipsFunc: PropTypes.func.isRequired,
        shouldPage: PropTypes.bool
    };


    state = {
        loading: true,
        totalHeight: 0,
        clips: [],
        cursor: '',
    };    

    componentWillReceiveProps(nextProps){
        this.setState({
            clip_cards: [],
            loading: true
        });
    }

    componentDidMount() {
        this.getClips();
    }

    async getClips() { 
        let results = await this.props.getClipsFunc();
        this.setState({
            clips: results.clips,
            cursor: results._cursor,
            loading: false,            
        });
    }

    // FIXME: Weird flat list issues
    async getMoreClips() {
        if(!this.props.shouldPage || this.state.clips.length === 0) return;
        
        let results = await this.props.getClipsFunc(this.state.cursor);

        if(results.clips.length === 0) {
            this.setState({
                cursor: null,
                loading: false        
            });
        } else {
            this.setState({
                clips: [...this.state.clips, ...results.clips],
                cursor: results._cursor,
                loading: false        
            });
        }
    }

    endReached = () => {
        if(this.state.loading || !this.state.cursor) return;

        this.setState(
            {
                loading: true
            },
            () => this.getMoreClips()
        );
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
        if (this.state.loading) {
            comp = <ActivityIndicator color="black" size="large" style={ styles.spinner } />
        } 
        return comp;
    }

    onScroll(event) {
        if(this.props.onScrollFunc) this.props.onScrollFunc(event, this.state.totalHeight);   
    }

    onLayout({nativeEvent: { layout: {height}}}) {
        this.setState({
            totalHeight: height
        });
    }

    render(){
        return(
            <FlatList
                style={styles.content}
                data={this.state.clips}
                renderItem={this.addClip}
                keyExtractor={(item) => item.tracking_id}
                onEndReached={this.endReached}
                onEndReachedThreshold={0.80}
                ListFooterComponent={this.renderActivityIndicator}
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