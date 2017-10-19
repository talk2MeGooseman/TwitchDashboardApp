import React, { Component } from 'react';
import {AsyncStorage} from 'react-native';
import { Container, Content, Text, Header, Left, Button, Icon, Right, ActionSheet } from 'native-base';
import LiveUserCard from '../components/LiveUserCard'
import TwitchAPI from '../lib/TwitchAPI';

const BUTTONS = ["All", "Live", "Vodcast", "Cancel"];
const CANCEL_INDEX = 3;

export default class FollowingView extends Component {
    static navigationOptions = {
        drawerLabel: 'Following'
    };

    constructor(props){
        super(props);

        this.state = {
            users: [],
            liveUsers: []
        };
    }

    componentDidMount() {
        this.getFollowers();
    }

    async getFollowers() {
        const results = await TwitchAPI.v5getUsersFollow();
        const liveUsers = await TwitchAPI.v5getFollowedSteams();
        this.setState({
            users: results.follows,
            liveUsers: liveUsers
        });
    }

    renderUsers() {
        let elements = [];
        if(this.state.users.length === 0) return;
        
        this.state.users.map(function(user) {
            let userLive = this.state.liveUsers.streams.find((live) => {
                return user.channel._id === `${live.channel._id}`;
            });

            let props = {
                image_url: user.channel.logo,
                user_id: user.channel._id,
                key: user.channel._id, 
                username: user.channel.display_name,
                followers_count: user.channel.followers,
                live: userLive !== undefined
            }

            if (userLive) {
                props.start_time = userLive.created_at;
                props.viewers_count = userLive.viewers;
                props.game_title = userLive.game;
                props.title = userLive.channel.status;
                props.image_url = userLive.preview.large;
            }

            elements.push(<LiveUserCard {...props} />);
        }.bind(this));
        return(elements)
    }

    displayFilterOption(){
        ActionSheet.show(
          {
            options: BUTTONS,
            cancelButtonIndex: CANCEL_INDEX,
            title: "Filter By"
          },
          alert
        )
      }

    render() {
        return(
            <Container>
                <Header>
                    <Left>
                        <Button onPress={() => {this.props.navigation.navigate('DrawerOpen');} }>
                            <Icon name="menu" />
                        </Button>
                    </Left>
                    <Right>
                        <Button onPress={() => this.displayFilterOption() }>
                            <Icon name="ios-funnel" />
                        </Button>
                    </Right>
                </Header>
                <Content>
                    { this.renderUsers() }
                </Content>
            </Container>
        );
    }
}