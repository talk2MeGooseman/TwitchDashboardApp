import React, { PureComponent } from 'react';
import { StyleSheet} from 'react-native';
import { Container, Spinner, H1} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import {
    authUserIfNeeded,
} from '../redux/actions/userAuthActions';

class SplashScreen extends PureComponent {
    
    componentDidMount(){
        // this.getToken();
        const { dispatch } = this.props.navigation;
        dispatch(authUserIfNeeded());
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.loggedIn) {
            this.startApp();
        }
    }

    startApp() {
        this.props.navigation.navigate('DrawerStack');
    }

    render() {
        return(
            <Container style={ styles.container }>
                <Grid>
                    <Row size={45}></Row>
                    <Row size={10}>
                        <Col>
                            <Row style={ styles.spinnerRow }>
                                <H1>LOGGING YOU IN...</H1>
                            </Row>
                            <Row style={ styles.spinnerRow }>
                                <Spinner color='white'/>                        
                            </Row>
                        </Col>
                    </Row>
                    <Row size={45}></Row>
                </Grid>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    spinnerRow: {
        justifyContent: 'center'
    },
    container: {
        backgroundColor: 'blue'
    }
});

const mapStateToProps = state => ({
    loggedIn: state.authTwitchApp.loggedIn,
});

export default connect(mapStateToProps)(SplashScreen);