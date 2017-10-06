/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  UIManager,
  Platform,
} from 'react-native';
import { Root } from "native-base";
import TrendingClipsView from './views/TrendingClipsView';

export default class TwitchDashboardApp extends Component {
  constructor() {
    super();

    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) { 
      UIManager.setLayoutAnimationEnabledExperimental(true); 
    }
  }

  render() {
    return (
      <Root>
        <TrendingClipsView />
      </Root>
    );
  }
};

AppRegistry.registerComponent('TwitchDashboardApp', () => TwitchDashboardApp);
