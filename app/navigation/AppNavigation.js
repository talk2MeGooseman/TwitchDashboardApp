import { StackNavigator, DrawerNavigator, TabNavigator, TabBarTop } from 'react-navigation';
import TrendingClipsView from '../views/TrendingClipsView';
import SplashScreen from '../views/SplashScreenView';
import FollowingView from '../views/FollowingView';
import UserClipsView from '../views/UserClipsView';
import UserVideosView from '../views/UserVideosView';
import NativeBaseTheme from '../../native-base-theme/variables/platform';
import {Title, Container} from 'native-base';

const UserViewTabNav = TabNavigator({
  UserClips: { screen: UserClipsView },
  UserVideos: { screen: UserVideosView},
}, {
  tabBarComponent: TabBarTop,
  tabBarPosition: 'top',
  animationEnabled: true,
  lazy: true,
  tabBarOptions: {
    indicatorStyle: {
      backgroundColor: 'white'
    }, 
    labelStyle: {
      fontSize: NativeBaseTheme.tabFontSize,
      fontWeight: 'bold'
    },
    style: {
      backgroundColor: NativeBaseTheme.brandPrimary,
    },
  },
});

// Following Stack
const FollowingStack = StackNavigator({
  FollowingView: { screen: FollowingView },
  UserView: { screen: UserViewTabNav },
}, {
  initialRouteName: 'FollowingView',
  mode: 'card',
  headerMode: 'screen',
  navigationOptions: {
    headerStyle: {
      backgroundColor: NativeBaseTheme.brandPrimary
    },
    headerTitleStyle: {
      color: 'white'
    },
    headerBackTitleStyle: {
      color: 'white'
    }
  }
});

// Drawer stack
const DrawerStack = DrawerNavigator({
  TrendingClipsView: { screen: TrendingClipsView },
  FollowingStack: { screen: FollowingStack }
});

// Root Stack
const PrimaryNav = StackNavigator({
    SplashScreen: { screen: SplashScreen},
    DrawerStack: { screen: DrawerStack }
  }, {
  // Default config for all screens
  headerMode: 'none',
  initialRouteName: 'SplashScreen'
});

export default PrimaryNav;