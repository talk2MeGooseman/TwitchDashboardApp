import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  StyleSheet,
  LayoutAnimation,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { 
  Container,
  Header,
  Content,
  Thumbnail,
  Text,
  Button,
  Icon,
  Left,
  Body,
  Right,
  Title,
  Spinner,
  Footer,
  FooterTab,
  Tab,
  Tabs
} from 'native-base';
import ClipCard from '../components/ClipCard';
import TwitchAPI from '../lib/TwitchAPI';
const MOST_VIEWED = 0;
const TRENDING = 1;

export default class TrendingClipsView extends Component {
    static propTypes = {
        twitchAPI: PropTypes.object,
        trending: PropTypes.bool,
        count: PropTypes.number,
        toggleOverlay: PropTypes.func.isRequired
    };

    constructor() {
        super();
        this.state = {
          loading: true,
        };    
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.count != this.props.count) {
            this.setState({
                clip_cards: [],
                loading: true
            });
        }
    }

    componentDidUpdate() {
        if(this.state.loading) {
            this.loadTopClips();
        }
    }

    componentDidMount() {
        this.loadTopClips();
    }

    async loadTopClips() {
        let {twitchAPI, trending, count} = this.props;
        let jsxElements = [];
        const trendingSelection = this.state.trendingView === TRENDING;
  
        let results = await twitchAPI.getTopClipsForUser({trending, count});
        if (!results) return;

        for(let clip of results['clips'])  {
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
    
          jsxElements.push(<ClipCard { ...passProps } />);
        };
    
        this.setState({
          clip_cards: jsxElements,
          loading: false,
          page: results['cursor']
        });
    }

    renderActivityIndicator() { 
        if (this.state.loading) { 
          return (
            <ActivityIndicator color="black" size="large" style={ styles.spinner } />
          ); 
        } 
    }

    render(){
        return(
            <Content style={styles.content}>
                {this.state.clip_cards}
                {this.renderActivityIndicator()}
            </Content>
        );  
    }
};

const styles = StyleSheet.create({
    content: {
      backgroundColor: 'gray',
      flex: 1,
    },
    spinner: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: "center"
    }
});