import React, { Component } from 'react';
import {AsyncStorage, FlatList} from 'react-native';
import { Title, Body, Spinner, Container, Content, Text, Header, Left, Button, Icon, Right, ActionSheet } from 'native-base';
import LiveUserCard from '../components/LiveUserCard'
import TwitchAPI from '../lib/TwitchAPI';
import CONSTANTS from '../lib/Constants';
import { connect } from 'react-redux';
import { fetchFollowing, refreshFollowing, filterFollowing } from '../redux/actions/followActions';

class FollowingView extends Component {
    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params;
        return {
            drawerLabel: 'Following',
            title: 'Following',
            headerTitle: <Title>Following</Title>,
            headerLeft: <Button onPress={() => {navigation.navigate('DrawerOpen');} }><Icon name="menu" /></Button>,
            headerRight: <Button onPress={() => params.displayFilter() }><Icon name="ios-funnel" /></Button>     
        };
    };

    componentDidMount() {
        const { dispatch, setParams } = this.props.navigation;
        dispatch(fetchFollowing());
        setParams({ displayFilter: this.displayFilterOption.bind(this) });        
    }

    componentDidUpdate(prevProps, prevState){
        if(!this.props.loading) {
            this.displayFollowers();
        }
        if(this.props.filter != prevProps.filter) {
            const { dispatch } = this.props.navigation;
        }
    }

    displayFollowers = () => {
        let followings;
        let total = 0;
        let streams = this.props.streaming;

        //if(this.state.totalChannels > 0 && this.state.totalChannels === this.state.followings.length) return;

        // if(streams.length === 0) {
        //     streams = await TwitchAPI.v5getFollowedStreams(this.state.filter);
        // }
        
        if(this.props.filter === CONSTANTS.ALL_INDEX) {
            const { following, total } = this.props;

            following = following.map((user) => {
                let streaming = streams.find((stream) => {
                    return user.channel._id === `${stream.channel._id}`;
                });

                if(streaming) {
                    user = Object.assign({}, user, streaming);
                    user.isLive = true;
                }

                return user;
            });
            
        } else {
            following = streams;
            total = streams.length;
        }
        
        
        // this.setState({
        //     loading: false,
        //     streams: streams,
        //     totalChannels: total,
        //     refreshing: false
        // });
    }

    navigateUserView(data) {
        this.props.navigation.navigate('UserView', data);
    }

    renderChannel(channel) {       

            let props = {
                image_url: channel.channel.logo,
                channel_id: channel.channel._id,
                key: channel.channel._id,
                user_id: `${channel.channel._id}`,
                username: channel.channel.display_name,
                followers_count: channel.channel.followers,
                onUserPress: this.navigateUserView.bind(this),
                live: false
            };

            if (channel.isLive || this.props.filter !== CONSTANTS.ALL_INDEX) {
                props.start_time = channel.created_at;
                props.viewers_count = channel.viewers;
                props.game_title = channel.game;
                props.title = channel.channel.status;
                //props.image_url = channel.preview.large;
                props.live = true;
            }

            return(<LiveUserCard {...props} />);
    }

    filterSelected(index) {
        let selectedFilter = this.props.filter;
        switch (index) {
            case CONSTANTS.ALL_INDEX:
                selectedFilter = CONSTANTS.ALL_INDEX;
                break;
            case CONSTANTS.LIVE_INDEX:
                selectedFilter = CONSTANTS.LIVE_INDEX;
                break;
            case CONSTANTS.VOD_INDEX:
                selectedFilter = CONSTANTS.VOD_INDEX;
                break;
            default:
                break;
        }

        if (this.props.filter !== selectedFilter) {
            const { dispatch } = this.props.navigation;
            dispatch(filterFollowing(selectedFilter));
        }
    }

    displayFilterOption(){
        ActionSheet.show(
          {
            options: CONSTANTS.FOLLOWING_FILTERS,
            cancelButtonIndex: CONSTANTS.CANCEL_INDEX,
            title: "Filter By"
          },
          this.filterSelected.bind(this)
        );
    }

    renderFooter = () => {
        if(this.props.loading) {
            return(<Spinner color='black'/>);
        } else {
            return null;
        }   
    }

    renderEmptyList = () => {
        if (this.props.loading || this.props.refreshing) {
            return null;
        } else {
            return <Text style={{textAlign: 'center'}}>Nothing Here To See Move Along...</Text>;
        }
    }

    onRefresh = () => {
        const { dispatch } = this.props.navigation;        
        dispatch(refreshFollowing());
    }

    render() {
        return(
            <Container>
                    <FlatList 
                        data={this.props.following}
                        renderItem={({item: channel}) => this.renderChannel(channel)}
                        keyExtractor={(channel) => channel.channel._id}
                        onEndReached={() => {}}
                        onEndReachedThreshold={0.75}
                        ListFooterComponent={this.renderFooter()}
                        ListEmptyComponent={this.renderEmptyList()}
                        onRefresh={this.onRefresh}
                        refreshing={this.props.refreshing}
                    />
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    following: state.userFollowing.following,
    total: state.userFollowing.total,
    loading: state.userFollowing.loading,
    refreshing: state.userFollowing.refreshing,
    filter: state.userFollowing.filter,
    streaming: state.userFollowing.streaming,
});

export default connect(mapStateToProps)(FollowingView);