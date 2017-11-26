import React, { Component } from 'react';
import { AsyncStorage, FlatList } from 'react-native';
import { Title, Body, Spinner, Container, Content, Text, Header, Left, Button, Icon, Right, ActionSheet, Thumbnail, ListItem } from 'native-base';
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
            headerLeft: <Button onPress={() => { navigation.navigate('DrawerOpen'); }}><Icon name="menu" /></Button>,
        };
    };

    componentDidMount() {
        const { dispatch, setParams } = this.props.navigation;
        dispatch(fetchFollowing());
    }

    componentDidUpdate(prevProps, prevState) {
    }

    navigateUserView = (data) => {
        this.props.navigation.navigate('UserView', data);
    }

    renderChannel(channelInfo) {

        let image_url = channelInfo.channel.logo || "http://via.placeholder.com/300x533?text=?";

        return (
            <ListItem avatar onPress={() => this.navigateUserView(channelInfo.channel)}>
                <Left>
                    <Thumbnail source={{ uri: image_url }} />
                </Left>
                <Body>
                    <Text>{channelInfo.channel.display_name}</Text>
                    <Text note>{channelInfo.channel.status}</Text>
                    <Text note>Followers: {channelInfo.channel.followers}</Text>
                </Body>
                <Right />
            </ListItem>
        );
    }

    renderFooter = () => {
        if (this.props.loading) {
            return (<Spinner color='black' />);
        } else {
            return null;
        }
    }

    renderEmptyList = () => {
        if (this.props.loading || this.props.refreshing) {
            return null;
        } else {
            return <Text style={{ textAlign: 'center' }}>Nothing Here To See Move Along...</Text>;
        }
    }

    onRefresh = () => {
        const { dispatch } = this.props.navigation;
        dispatch(refreshFollowing());
    }

    render() {
        return (
            <Container>
                <FlatList
                    style={{ backgroundColor: 'white' }}
                    data={this.props.following}
                    renderItem={({ item: channel }) => this.renderChannel(channel)}
                    keyExtractor={(channel) => channel.channel._id}
                    onEndReached={() => { }}
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
});

export default connect(mapStateToProps)(FollowingView);