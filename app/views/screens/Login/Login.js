import React, {Component} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  Text,
  Platform,
  TouchableOpacity,
  Linking,
  Dimensions,
  AsyncStorage
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
  config,
  _storeUser,
  validate,
  _showErrorMessage,
  Loader,
  phone,
} from 'assets';
import {StackActions, CommonActions} from '@react-navigation/native';
import Content from '../../components/Content';

const data = new FormData();
const windowHeight = Dimensions.get('window').height;
const app_version = config?.app_version;
export default class Login extends Component {
  static navigationOptions = {
    headerTitle: (
      <Image
        source={image.taglogo}
        style={{
          alignSelf: 'center',
          flex: 1,
          resizeMode: 'contain',
          height: 70,
          transform: Platform.OS === 'ios' ? [{scale: 0.65}] : [{scale: 0.72}],
        }}
      />
    ),
    headerStyle: {
      backgroundColor: '#6f6f6f',
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isloading: false,
      defaultLang:''
    };
  }

  
  async componentDidMount() {
    this.mounted = true;

     await AsyncStorage.getItem('@SelectLanguage').then((language) => {
			// console.log(language,"----1- lanaguyafge comiung friom asaync stoegarghe")
			// Use the retrieved language as the initial app language.
			this.setState({defaultLang:language})
		  });
    
  }

  componentWillUnmount() {
    this.mounted = false;
  }

   _sendLogin(data) {
    this.setState({
      isloading: true,
    });
    fetch(config.BASE_URL + 'login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: data,
    })
      .then(response => {
        console.log('--------login api ----',JSON.stringify(response));
        return response.json();
      })
    .then(async res => {
        console.log('login res**************-----------', res.info.multi_lang);
        if (this.mounted) {
          this.setState({
            isloading: false,
          });
          if (res.status == 1) {
            let appState = {
              isLoggedIn: true,
              userInfo: res.info,
            };
            await AsyncStorage.setItem('multi_lang',res?.info?.multi_lang)
            // console.log('11111222 res**************-----------', res.info.multi_lang);

            _storeUser(appState).then(user => {
              const resetAction = CommonActions.reset({
                index: 0,
                routes: [{name: 'Dashboard'}],
              });
              /*const resetAction = StackActions.reset({
								index: 0,
								key: null,
								actions: [
									NavigationActions.navigate({ routeName: 'Dashboard' })
								],
							});*/
              this.props.navigation.dispatch(resetAction);
            });
            if(this.state.defaultLang==null){
              await AsyncStorage.setItem('addLangtype','en')
            }else{
              await AsyncStorage.setItem('addLangtype',this.state.defaultLang)
            }
          } else if (res.status == 0) {
            _showErrorMessage(res.message, true);
          } else {
            throw 'Error';
          }
        }
      })
      .catch(err => {
        if (this.mounted) {
          _showErrorMessage('Something went wrong, Try again later.');
          this.setState({
            isloading: false,
          });
        }
      })
      .done();
  }

  _dologin = () => {
    const email = this.state.email;
    const password = this.state.password;
    var error = false;
    var msg = '';
    /*mValid = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;		
		if(!mValid.test(email))
		{
			msg += 'Please enter a valid email address\n';
			var error = true;
		}*/
    if (email.trim() == '') {
      msg += 'Please enter username\n';
      var error = true;
    }
    if (password.length < 6) {
      msg += 'Please enter password\n';
      var error = true;
    }
    if (error) {
      _showErrorMessage(msg, true);
    } else {
      if (this.mounted) {
        this.setState({
          isloading: true,
        });
        data.append('username', email);
        data.append('password', password);
        data.append('app_version', app_version);
        this._sendLogin(data);
      }
    }
  };

  navigateToScreen = route => () => {
    /* old code const navigateAction = NavigationActions.navigate({
				routeName: route
			});
			this.props.navigation.dispatch(navigateAction); */
    this.props.navigation.navigate(route);
  };

  forgotClick(route) {
    /* old code const navigateAction = NavigationActions.navigate({
			routeName: route
		});
		this.props.navigation.dispatch(navigateAction);*/
    this.props.navigation.navigate(route);
  }

  onPressCall(url) {
    try {
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          return Linking.openURL(url).catch(() => null);
        }
      });
    } catch (e) {
      console.log('On press call digcontrax Error:: ', e);
    }
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <Container padder style={{backgroundColor: '#FFBC42'}}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Content padder={true}>
              <H1
                style={{fontFamily: 'RacingSansOne-Regular', marginBottom: 10}}>
                LOGIN
              </H1>
              <Form>
                <Item regular style={{backgroundColor: '#fff'}}>
                  <Thumbnail
                    source={image.user}
                    style={{
                      transform: [{scale: 0.85}],
                      resizeMode: 'contain',
                      width: 40,
                      marginLeft: 5,
                    }}
                  />
                  <Input
                    placeholder="Username"
                    onChangeText={text => this.setState({email: text.trim()})}
                  />
                </Item>
                <Item regular style={{backgroundColor: '#fff', marginTop: 20}}>
                  <Thumbnail
                    square
                    source={image.password}
                    style={{
                      transform: [{scale: 0.85}],
                      resizeMode: 'contain',
                      width: 40,
                      marginLeft: 5,
                    }}
                  />
                  <Input
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={text =>
                      this.setState({password: text.trim()})
                    }
                  />
                </Item>
                <TouchableOpacity
                  style={styles.forget}
                  onPress={() => {
                    this.forgotClick('ForgotPassword');
                  }}>
                  <Text style={{textDecorationLine: 'underline'}}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
                <Button
                  block
                  large
                  onPress={this._dologin}
                  style={{
                    backgroundColor: '#262626',
                    fontFamily: 'OpenSans-SemiBold',
                    marginTop: 25,
                  }}>
                  <H3 style={{color: '#fff', fontFamily: 'OpenSans-SemiBold'}}>
                    LOGIN
                  </H3>
                </Button>
              </Form>
              <View style={styles.innerSecond}>
                <Button
                  block
                  style={{backgroundColor: '#6F6F6F'}}
                  onPress={() =>
                    this.onPressCall(
                      `tel:${encodeURIComponent('(702) 851-3333')}`,
                    )
                  }>
                  <Thumbnail
                    circle
                    source={image.phone}
                    style={{
                      transform: [{scale: 0.8}],
                      resizeMode: 'contain',
                      width: 30,
                      marginRight: 5,
                    }}
                  />
                  <H3 style={{color: '#fff'}}>Call DigContrax</H3>
                </Button>
              </View>
              {/*<View style={{marginTop:180}}>
							<Button block medium onPress={this.navigateToScreen('Register') } style={{backgroundColor: "#6F6F6F", fontFamily:'OpenSans-SemiBold'}}>
								<Text style={{color:"#fff", fontFamily:'OpenSans-Bold', fontSize: 16 }}>REGISTER A NEW ACCOUNT</Text>
							</Button>
						</View> */}
            </Content>
          </View>
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#FFBC42',
              padding: 20,
              flexDirection: 'row',
              flexWrap: 'wrap',
              flex: 1,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'OpenSans-SemiBold',
                fontSize: 14,
                textAlign: 'center',
              }}>
              Please contact your company administrator to gain access to your
              company account via the mobile application. If you do not have an
              account, our customer care team is available to assist at
              <Text
                onPress={() => this.onPressCall('tel:(702) 851-3333')}
                style={{fontFamily: 'OpenSans-SemiBold', fontSize: 14}}>
                {' '}
                (702) 851-3333
              </Text>
              <Text style={{fontFamily: 'OpenSans-SemiBold', fontSize: 14}}>
                {' '}
                or{' '}
              </Text>
              <Text
                onPress={() =>
                  this.onPressCall('mailto:support@digcontrax.com')
                }
                style={{fontFamily: 'OpenSans-SemiBold', fontSize: 14}}>
                Support@DigContrax.com.
              </Text>
            </Text>
          </View>
        </Container>
        {this.state.isloading && <Loader />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  logoImage: {
    alignSelf: 'center',
    flex: 1,
    resizeMode: 'contain',
    transform: Platform.OS === 'ios' ? [{scale: 0.65}] : [{scale: 0.82}],
  },
  texts: {
    fontFamily: 'OpenSans-Regular',
  },
  textss: {
    fontFamily: 'OpenSans-Bold',
  },
  ticket_req: {
    fontSize: 28,
    textAlign: 'center',
    color: '#000000',
    fontFamily: 'OpenSans-Bold',
  },
  forget: {
    flex: 1,
    textDecorationLine: 'underline',
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  innerSecond: {justifyContent: 'center', flex: 1, marginTop: 20},
});
