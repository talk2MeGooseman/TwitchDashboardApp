import React, { Component } from 'react';
import { TouchableOpacity, AsyncStorage } from 'react-native';
import { Container, Title, Button, Icon,
    Header, Left, Body, Right, Text, Content,
    Card, CardItem,
 } from 'native-base';
import TwitchAPI from '../lib/TwitchAPI';

class UserStuffView extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            drawerLabel: 'Your Channel',
            title: 'You Channel',
            headerTitle: <Title>{params.username}</Title>,
            headerLeft: <Button onPress={() => { navigation.navigate('DrawerOpen'); }}><Icon name="menu" /></Button>,
        };
    };

    _onFollowersPress = () => {
        this.props.navigation.navigate('ChannelFollowersView');
    }

    componentDidMount(){
        this._getUsersInfo();
    }

    async _getUsersInfo() {
        let result = await AsyncStorage.getItem('TWITCH:USER_INFO:key');
        let userInfo = JSON.parse(result);
        const {setParams} = this.props.navigation;    
        setParams({username: userInfo.user_name });
    }

    render() {
        return (
            <Container>
                <Content>
                    <Card>
                        <TouchableOpacity onPress={this._onFollowersPress}>
                            <CardItem>
                                <Body>
                                    <Text>
                                        Your Follower
                                    </Text>
                                </Body>
                            </CardItem>
                        </TouchableOpacity>
                    </Card>
                    <Card>
                        <TouchableOpacity onPress={this._onFollowersPress}>
                            <CardItem>
                                <Body>
                                    <Text>
                                        Your Clips
                                    </Text>
                                </Body>
                            </CardItem>
                        </TouchableOpacity>
                    </Card>
                    <Card>
                        <TouchableOpacity onPress={this._onFollowersPress}>
                            <CardItem>
                                <Body>
                                    <Text>
                                        Your Videos
                                    </Text>
                                </Body>
                            </CardItem>
                        </TouchableOpacity>
                    </Card>
                </Content>
            </Container>
        );
    }
}

export default UserStuffView;