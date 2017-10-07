import React, {
    PureComponent
} from 'react';
import { PropTypes } from 'prop-types';
import {
    View,
    WebView,
    Dimensions,
    Text
} from 'react-native';
import {Button} from 'native-base';

export default class WebViewOverlay extends PureComponent {
    static propTypes = {
        url: PropTypes.string.isRequired,
    }

    render() {
        const {height, width} = Dimensions.get('window');        
        const overlayStyles = { 
            height: height,
            width: width,
            position: 'absolute',
            top: 0,
            left: 0,
            paddingBottom: 20,
            backgroundColor: 'black',
            opacity: 0.9
        };

        return (
            <View style={overlayStyles}>
                <Button onPress={ this.props.toggleOverlay }><Text>Close</Text></Button>
                <WebView
                    style={{flex:1, backgroundColor: 'black'}}
                    javaScriptEnabled={true}
                    source={{uri: this.props.url}}
                />
            </View>
        );
    }
}