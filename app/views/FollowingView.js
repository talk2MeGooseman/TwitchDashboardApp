import React, { Component } from 'react';
import {AsyncStorage} from 'react-native';
import { Container, Content, Text, Header } from 'native-base';
import LiveUserCard from '../components/LiveUserCard'
import TwitchAPI from '../lib/TwitchAPI';

export default class FollowingView extends Component {
    static navigationOptions = {
        drawerLabel: 'Following'
    };

    constructor(props){
        super(props);

        this.state = {
            users: []
        };
    }

    componentDidMount() {
        this.getFollowers();
    }

    async getFollowers() {
        const results = await TwitchAPI.v5getUsersFollow();
        this.setState({
            users: results.follows
        });
    }

    renderUsers() {
        let elements = [];
        if(this.state.users.length === 0) return;
        
        this.state.users.map(function(user) {
            let props = {
                image_url: user.channel.logo,
                user_id: user.channel._id,
                key: user.channel._id, 
                username: user.channel.display_name,
                followers_count: user.channel.followers,
                live: false
            }

              elements.push(<LiveUserCard {...props} />);
        });
        return(elements)
    }

    render() {
        return(
            <Container>
                <Header />
                <Content>
                    { this.renderUsers() }
                </Content>
            </Container>
        );
    }
}