import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {
  Container,
  Header,
  Form,
  Item,
  Input,
  Label,
  Icon,
  Toast,
  Root,
  Button,
  H3,
  H1,
  Thumbnail,
} from 'native-base';
import {
  image,
  _retrieveUser,
  config,
  _showErrorMessage,
  _updateAppMessage,
} from 'assets';
import {StackActions, CommonActions} from '@react-navigation/native';
const app_version = config?.app_version;

class Welcome extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // check app version first
    this.checkAppVersion();
  }

  checkUserIsLoggedIn = function () {
    _retrieveUser().then(user => {
      this.timeoutHandle = setTimeout(() => {
        if (user !== null) {
          const resetAction = CommonActions.reset({
            index: 0,
            routes: [{name: 'Dashboard'}],
          });
          /* old codeconst resetAction = StackActions.reset({
						index: 0, 
						key: null,
						actions: [
							CommonActions.navigate({ routeName: 'Dashboard' })
						],
					});*/
          this.props.navigation.dispatch(resetAction);
        } else {
          const resetAction = CommonActions.reset({
            index: 0,
            routes: [{name: 'Auth'}],
          });
          /* old code
					const resetAction = StackActions.replace({
						index: 0, 
						key: null,
						actions: [
							CommonActions.navigate({ routeName: 'Auth' })
						],
					});*/
          this.props.navigation.dispatch(resetAction);
        }
      }, 2000);
    });
  };

  checkAppVersion() {
    fetch(config.BASE_URL + 'app-version?app_version=' + app_version, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
      .then(response => {
        console.log('response checkapp', response);
        return response.json();
      })
      .then(res => {
        if (res.status == 1) {
          // app upto date
          this.checkUserIsLoggedIn();
        } else if (res.status == 0) {
          // app outdated
          _updateAppMessage(res?.message);
          return false;
        } else {
          alert(
            'Something went checking app version. Please contact admin or update your app.',
          );
        }
      })
      .catch(err => {
        _showErrorMessage('Something went wrong, Try again later.');
        return false;
      });
  }
  static navigationOptions = {
    header: null,
    headerVisible: false,
  };

  render() {
    var {height, width} = Dimensions.get('window');
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#5e5e5e'}}>
        <View style={styles.container}>
          <View padder>
            <View style={styles.imageContainer}>
              <Image
                source={image.logoLarge}
                style={{width: width - 20}}
                resizeMode="contain"
              />
            </View>
            <View>
              <Text style={styles.btext}>
                You are one step closer to digging safer than ever before...
              </Text>
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 50,
              }}>
              <Image
                source={image.homeLoading}
                resizeMode="contain"
                style={{width: 100}}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //textAlign: 'center',
    alignItems: 'center',
    backgroundColor: '#5e5e5e',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  imageContainer: {
    //flex: 1,
    //backgroundColor: 'red'
    //transform: [{ scale: 0.55 }],
  },
  btext: {
    fontSize: 20,
    textAlign: 'center',

    marginLeft: 20,
    marginRight: 20,
    color: '#fff',
    fontFamily: 'OpenSans-Regular',
  },
});

export default Welcome;
