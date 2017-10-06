import { StackNavigator } from 'react-navigation'
import TrendingClipsView from '../views/TrendingClipsView'

// drawer stack
const DrawerStack = DrawerNavigator({
  TrendingClipsView: { screen: TrendingClipsView }
});

const DrawerNavigation = StackNavigator({
  DrawerStack: { screen: DrawerStack }
}, {
  headerMode: 'none',
});

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  SplashScreen: { screen: TrendingClipsView},
  drawerStack: { screen: DrawerNavigation }
}, {
  // Default config for all screens
  headerMode: 'none',
  initialRouteName: 'SplashScreen'
});

export default PrimaryNav