import 'react-native-gesture-handler';
import * as React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Search from './screens/Search';
import TransactionScreen from './screens/TransactionScreen';

export default class App extends React.Component {
  render(){
    return (
      <AppContainer />
    );
  }
}

const TabNavigator = createBottomTabNavigator({
  Transaction: {screen: TransactionScreen},
  Search: {screen: Search}
  },
  {
    defaultNavigationOptions: ({ navigation }) =>({
      tabBarIcon: () =>{
        const routeName = navigation.state.routeName;

        if (routeName === 'Transaction') {
          return (
            <Image style={{width:40,height:40}} source={require('./assets/book.png')}/>
          )
        } else if (routeName === 'Search') {
          return (
            <Image style={{width:40,height:40}} source={require('./assets/search.png')}/>
          )
        }
      },
      tabBarOptions: {
        activeTintColor:'black',
        activeBackgroundColor:'#ccc',
        style: {
            backgroundColor: '#f7f7f7',
            height: 70
        },
      }
    })
  }
)
const AppContainer = createAppContainer(TabNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
