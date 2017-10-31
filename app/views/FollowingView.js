import React, { Component } from 'react';
import {AsyncStorage} from 'react-native';
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
            liveUsers: [],
            filter: CONSTANTS.ALL_INDEX
        };
    }

    componentDidMount() {
        let navigation = this.props.navigation;        
        this.getFollowers();
        navigation.setParams({ displayFilter: this.displayFilterOption.bind(this) });        
    }
    componentDidUpdate(prevProps, prevState){
        if(prevState.filter != this.state.filter) this.getFollowers();
    } 

    async getFollowers() {
        let users = this.state.users;
        if(this.state.filter === CONSTANTS.ALL_INDEX) {
            let response = await TwitchAPI.v5getUsersFollow();
            users = response.follows;
        }
        const liveUsers = await TwitchAPI.v5getFollowedStreams(this.state.filter);
        this.setState({
            users: users,
            liveUsers: liveUsers.streams,
            loading: false
        });
    }

    renderLiveUserCards() {
        let elements = this.state.liveUsers.map(function(user) {
            let props = {
                user_id: `${user.channel._id}`,
                key: user.channel._id, 
                username: user.channel.display_name,
                live: true,
                start_time: user.created_at,
                viewers_count: user.viewers,
                game_title: user.game,
                title: user.channel.status,
                image_url: user.preview.large,
                onUserPress: this.navigateUserView.bind(this)
            };

            return(<LiveUserCard {...props} />);
        }.bind(this));
        
        return elements;
    }

    navigateUserView(data) {
        this.props.navigation.navigate('UserView', data);
    }

    renderAllUserCard(){
        let elements = this.state.users.map(function(user) {
            let userLive = this.state.liveUsers.find((live) => {
                return user.channel._id === `${live.channel._id}`;
            });

            let props = {
                image_url: user.channel.logo,
                user_id: user.channel._id,
                key: user.channel._id, 
                username: user.channel.display_name,
                followers_count: user.channel.followers,
                live: userLive !== undefined,
                onUserPress: this.navigateUserView.bind(this)
            };

            if (userLive) {
                props.start_time = userLive.created_at;
                props.viewers_count = userLive.viewers;
                props.game_title = userLive.game;
                props.title = userLive.channel.status;
                props.image_url = userLive.preview.large;
            }

            return(<LiveUserCard {...props} />);
        }.bind(this));

        return elements;
    }

    renderUsers() {
        let elements = [];
        
        if(this.state.filter === CONSTANTS.LIVE_INDEX || this.state.filter === CONSTANTS.VOD_INDEX){
            elements = this.renderLiveUserCards();
        } else {
            elements = this.renderAllUserCard();
        }

        if(elements.length === 0 && !this.state.loading) {
            elements.push(<Text>No Results</Text>);
        }
        return(elements)
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
                liveUsers: []
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
        this.props.navigation.setParams({filter: false});
    }

    renderSpinner() {
        if(this.state.loading) return(<Spinner color='black'/>);   
    }

    render() {
        return(
            <Container>
                <Content>
                    { this.renderUsers() }
                    { this.renderSpinner() }
                </Content>
            </Container>
        );
    }
}