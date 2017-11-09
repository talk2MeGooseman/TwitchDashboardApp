import React, { Component } from 'react';
import {AsyncStorage, FlatList} from 'react-native';
import { Title, Body, Spinner, Container, Content, Text, Header, Left, Button, Icon, Right, ActionSheet } from 'native-base';
import LiveUserCard from '../components/LiveUserCard'
import TwitchAPI from '../lib/TwitchAPI';
import CONSTANTS from '../lib/Constants';

export default class FollowingView extends Component {
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

    constructor(props){
        super(props);

        this.state = {
            loading: true,
            users: [],
            streams: [],
            totalChannels: 0,
            filter: CONSTANTS.ALL_INDEX,
            refreshing: false
        };
    }

    componentDidMount() {
        let navigation = this.props.navigation;        
        this.getFollowers();
        navigation.setParams({ displayFilter: this.displayFilterOption.bind(this) });        
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.filter != this.state.filter || this.state.refreshing) this.getFollowers();
    }

    getFollowers = async () => {
        let users;
        let total = 0;
        let streams = this.state.streams;

        if(this.state.totalChannels > 0 && this.state.totalChannels === this.state.users.length) return;

        if(streams.length === 0) {
            streams = await TwitchAPI.v5getFollowedStreams(this.state.filter);
        }
        
        if(this.state.filter === CONSTANTS.ALL_INDEX) {
            let response = await TwitchAPI.v5getUsersFollow(this.state.users.length);
            users = response.follows;
            total = response._total;

            users = users.map((user) => {
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
            users = streams;
            total = streams.length;
        }
        
        
        this.setState({
            users: [...this.state.users, ...users],
            loading: false,
            streams: streams,
            totalChannels: total,
            refreshing: false
        });
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

            if (channel.isLive || this.state.filter !== CONSTANTS.ALL_INDEX) {
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
        let selectedFilter = this.state.filter;
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

        if (this.state.filter !== selectedFilter) {
            this.setState({
                loading: true,
                filter: selectedFilter,
                users: [],
                streams: [],
                totalChannels: 0,                
            });
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
        if(this.state.loading) {
            return(<Spinner color='black'/>);
        } else {
            return null;
        }   
    }

    renderEmptyList = () => {
        if (this.state.loading) {
            return null;
        } else {
            return <Text style={{textAlign: 'center'}}>Nothing Here To See Move Along...</Text>;
        }
    }

    onRefresh = () => {
        this.setState({
            loading: true,
            users: [],
            streams: [],
            totalChannels: 0,
            refreshing: true            
        });
    }

    render() {
        return(
            <Container>
                    <FlatList 
                        data={this.state.users}
                        renderItem={({item: channel}) => this.renderChannel(channel)}
                        keyExtractor={(channel) => channel.channel._id}
                        onEndReached={this.getFollowers}
                        onEndReachedThreshold={0.75}
                        ListFooterComponent={this.renderFooter()}
                        ListEmptyComponent={this.renderEmptyList()}
                        onRefresh={this.onRefresh}
                        refreshing={this.state.refreshing}
                    />
            </Container>
        );
    }
}