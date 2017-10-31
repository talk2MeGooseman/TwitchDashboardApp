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
            loading: true
        };
    }

    componentDidMount() {
        this.getVideos();
    }

    async getVideos() {
        let offset = this.state.videos.length;
        let channel_name = this.props.navigation.state.params.user_id;

        let results = await TwitchAPI.v5getChannelVideos({channel_id: channel_name, offset: offset});

        let videos = [...this.state.videos, ...results.videos];
        console.log(videos.length);        
        this.setState({
            videos: videos,
            totalVideo: results._total,
            loading: false
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
            onImagePress: () => {}
        };

        return <ClipCard { ...passProps } />;
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
                    onEndReachedThreshold={0.75}
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