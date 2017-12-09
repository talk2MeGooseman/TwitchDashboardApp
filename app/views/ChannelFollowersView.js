import React, {
    Component
} from 'react';
import {
    FlatList
} from 'react-native';
import {
    Container,
    Title,
    Button,
    Icon,
    Header,
    Left,
    Body,
    Right,
    Text,
    Content,
    Card,
    CardItem,
} from 'native-base';
import { connect } from "react-redux";
import UserListCell from "../components/UserListCell";

class ChannelFollowersView extends Component {
    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params;
        return {
            title: 'Followers',
            headerTitle: <Title>Followers</Title>,
        };
    };

    componentDidMount(){
        this._getChannelFollowers();
    }

    _getChannelFollowers() {
        // Dispatch for followers
    }

    _renderRow({ user }) {
        return(
            <UserListCell channel={user} onPress={alert} /> 
        );
    }

    render() {
        return (
            <Container>
                <FlatList
                    style={{ backgroundColor: 'white' }}
                    data={this.props.followers}
                    renderItem={({ item: user }) => this._renderRow(user)}
                    keyExtractor={({user}) => user._id}
                    onEndReached={() => { }}
                    onEndReachedThreshold={0.75}
                    // ListFooterComponent={this.renderFooter()}
                    // ListEmptyComponent={this.renderEmptyList()}
                    // onRefresh={this.onRefresh}
                    // refreshing={this.props.refreshing}
                />
            </Container>
        );
    }
}

const mapStateToProps = (state) => ({
    followers: state.userStuff.followersData.follows,
});

export default connect(mapStateToProps)(ChannelFollowersView);