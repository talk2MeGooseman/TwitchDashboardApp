import React, { PureComponent } from 'react';
import { StyleSheet, AsyncStorage, Text, TouchableOpacity, Image} from 'react-native';
import { Container, Spinner, H1, Button} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import {
    authUserIfNeeded,
    isUserAuthed,
} from '../redux/actions/userAuthActions';

class SplashScreen extends PureComponent {
    
    componentDidMount(){
        // AsyncStorage.setItem('TWITCH:ACCESS_TOKEN:key', '');
        const { dispatch } = this.props.navigation;
        dispatch(isUserAuthed());
    }

    _loginUser = () => {
        const { dispatch } = this.props.navigation;
        dispatch(authUserIfNeeded());
    }

    componentDidUpdate(prevProps) {
        if(this.props.loggedIn) {
            this._startApp();
        }
    }

    _startApp() {
        this.props.navigation.navigate('DrawerStack');
    }

    _loggingIn() {
        if (this.props.loggedIn) {
            return (
                <Col>
                    <Row style={styles.centerContent}>
                        <H1>LOGGING YOU IN...</H1>
                    </Row>
                    <Row style={styles.centerContent}>
                        <Spinner color='white' />
                    </Row>
                </Col>
            );
        } else {
            return(
                <Col>
                    <TouchableOpacity onPress={this._loginUser} style={styles.centerContent}>
                        <Image source={require('../assets/connect_dark.png')} />
                    </TouchableOpacity>
                </Col>
            );
        }
    }

    render() {
        return(
            <Container style={ styles.container }>
                <Grid>
                    <Row size={45}></Row>
                    <Row size={10}>
                        {this._loggingIn()}
                    </Row>
                    <Row size={45}></Row>
                </Grid>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    centerContent: {
        justifyContent: 'center',
        alignSelf: 'center',
    },
    container: {
        backgroundColor: 'grey'
    }
});

const mapStateToProps = state => ({
    loggedIn: state.authTwitchApp.loggedIn,
});

export default connect(mapStateToProps)(SplashScreen);