import React, { PureComponent } from 'react';
import { StyleSheet} from 'react-native';
import { Content, Container, Spinner, H1} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import TwitchAPI from '../lib/TwitchAPI';

export default class SplashScreen extends PureComponent {
    
    componentDidMount(){
        this.getToken();
    }

    async getToken() {
        const twitchAPI = new TwitchAPI();
        let valid = await twitchAPI.tokenValid();
        if (valid) { 
            this.startApp();
        } else {
            twitchAPI.getUserAccessToken(this.startApp.bind(this));
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