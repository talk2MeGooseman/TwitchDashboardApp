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
import ReduxNavigation from './app/views/ReduxNavigation';
import AppReducer from './app/redux/CombineReducers';
import { createStore } from 'redux';
import { Provider } from 'react-redux'

const store = createStore(AppReducer);

export default class TwitchDashboardApp extends Component {
  constructor() {
    super();

    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) { 
      UIManager.setLayoutAnimationEnabledExperimental(true); 
    }
  }

  render() {
    return (
      <Provider store={store}>
        <ReduxNavigation />
      </Provider>
    );
  }
};

AppRegistry.registerComponent('TwitchDashboardApp', () => TwitchDashboardApp);
