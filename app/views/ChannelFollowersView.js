import React, { Component } from 'react';
import { Container, Title, Button, Icon,
    Header, Left, Body, Right, Text, Content,
    Card, CardItem,
 } from 'native-base';

class ChannelFollowersView extends Component {
    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params;
        return {
            title: 'You Channel',
            headerTitle: <Title>Your Channel</Title>,
        };
    };

    render() {
        return (
            <Container>
                <Content>

                </Content>
            </Container>
        );
    }
}

export default ChannelFollowersView ;