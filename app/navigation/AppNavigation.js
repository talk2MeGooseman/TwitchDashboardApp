import { StackNavigator, DrawerNavigator } from 'react-navigation';
import TrendingClipsView from '../views/TrendingClipsView';
import SplashScreen from '../views/SplashScreenView';
import FollowingView from '../views/FollowingView';

// drawer stack
const DrawerStack = DrawerNavigator({
  TrendingClipsView: { screen: TrendingClipsView },
  FollowingView: { screen: FollowingView }
});

const DrawerNavigation = StackNavigator({
  DrawerStack: { screen: DrawerStack }
}, {
  headerMode: 'none',
});

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  SplashScreen: { screen: SplashScreen},
  DrawerStack: { screen: DrawerNavigation }
}, {
  // Default config for all screens
  headerMode: 'none',
  initialRouteName: 'SplashScreen'
});

export default PrimaryNav;