import { StackNavigator, DrawerNavigator } from 'react-navigation';
import TrendingClipsView from '../views/TrendingClipsView';
import SplashScreen from '../views/SplashScreenView';
import FollowingView from '../views/FollowingView';
import UserView from '../views/UserView'

// Following Stack
const FollowingStack = StackNavigator({
  FollowingView: { screen: FollowingView },
  UserView: { screen: UserView },
}, {
  headerMode: 'none',
  initialRouteName: 'FollowingView',
  mode: 'card'
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