import React, {Component} from 'react';
import {
  StackActions,
  CommonActions,
  DrawerActions,
} from '@react-navigation/native';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Image,
  AsyncStorage
} from 'react-native';
import {image, config, _removeUser, _retrieveUser} from 'assets';
import {H2} from 'native-base';
import {CheckBox} from 'react-native-elements';

import i18n from './translation';
import './translation';
import {withTranslation,useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';

class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {modalVisible: false, isChecked: null,langOption:0};
  }

  async componentDidMount(){		
		
		await AsyncStorage.getItem('addLangtype').then((language) => {
			// Use the retrieved language as the initial app language.
			this.setState({isChecked:language})
		});


      await AsyncStorage.getItem('multi_lang').then((type) => {
        // Use the retrieved language as the initial app language.
        // i18n.changeLanguage(language);
        this.setState({langOption:type})
        });

	}

  navigateToScreen = route => () => {
    /* old code
		  const navigateAction = NavigationActions.navigate({
				routeName: route
		  });
		  this.props.navigation.dispatch(navigateAction);
		  */
    this.props.navigation.navigate(route);
    this.props.navigation.dispatch(DrawerActions.closeDrawer());
  };

  navigateToSupport = page => () => {
    var routeAction = 'Contact';
    if (page == 'faq') {
      routeAction = 'SupportFaq';
    } else if (page == 'law') {
      routeAction = 'SupportLaw';
    } else if (page == 'training') {
      routeAction = 'SupportTraining';
    }
    /* old code const navigateAction =  StackActions.reset({
	          index: 0,
	          actions: [
	            NavigationActions.navigate({
	              	routeName: 'Support',
					params: { page: page }
	            })
	          ]
	      })
		  this.props.navigation.dispatch(navigateAction);
		  */
    this.props.navigation.navigate('Support', {screen: routeAction});
    this.props.navigation.dispatch(DrawerActions.closeDrawer());
  };

  logout = () => {
    _removeUser().then(user => {
      config.hasToken = false;
      const resetAction = CommonActions.reset({
        index: 0,
        routes: [{name: 'Auth'}],
      });
      // AsyncStorage.clear().then(() => console.log('------Cleared'))

      /* old code
			const resetAction = StackActions.reset({
				index: 0, 
				key: null,
				actions: [
					CommonActions.navigate({ routeName: 'Auth' })
				],
			});
			*/
      this.props.navigation.dispatch(resetAction);
    });
  };

  renderModal() {
    // kkey = this.state.wCode;
    // if(typeof membersrowdetail[kkey] != 'undefined')
    // {
    // 	rowDetail = membersrowdetail[kkey];
    // } else {
    // 	rowDetail = membersrowdetail['SWGHPT'];
    console.log('check isckecd value ----',this.state.isChecked)
    // }
    return (
      <View style={styles.ModalInsideView}>
        <View
          style={{
            backgroundColor: '#febf26',
            padding: 5,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection : 'row'
          }}>
          <H2 style={{fontFamily: 'RacingSansOne-Regular'}}>
            Select Language
          </H2>
          <Icon name='cancel' size={20} onPress={() => this.setState({
            modalVisible: false

          })}  style={{left:50}}/>
        </View>

        <TouchableOpacity
          style={{
            borderBottomColor: '#ccc',
            borderBottomWidth: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'row',
          }}
          disabled={this.state.isChecked == 'en' ? true : false}
          onPress={async() => {
            i18n.changeLanguage('en');
            
            this.handleCheckboxToggle('en'),
              this.setModalVisible(!this.state.modalVisible, '');
              await AsyncStorage.setItem('@SelectLanguage','en')
              await AsyncStorage.setItem('addLangtype','en')
          }}>
          <CheckBox
            checked={this.state.isChecked=='en' ? true : false}
            disabled={true}
            
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '75%',
              alignItems: 'center',
            }}>
            <Text style={{color: '#000000'}}>English</Text>
            <Image
              source={image.flag}
              style={{
                resizeMode: 'contain',
                width: 25,
                height: 25,
              }}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            borderBottomColor: '#ccc',
            borderBottomWidth: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'row',
          }}
          disabled={this.state.isChecked=='sp' ? true : false}
          onPress={async() => {
            i18n.changeLanguage('sp');
            this.handleCheckboxToggle('sp'),
              this.setModalVisible(!this.state.modalVisible, '');
              await AsyncStorage.setItem('@SelectLanguage','sp')
              await AsyncStorage.setItem('addLangtype','sp')
          }}>
          <CheckBox
            checked={this.state.isChecked=='sp' ? true : false}
            disabled={true}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '75%',
              alignItems: 'center',
            }}>
            <Text style={{color: '#000000'}}>Spanish</Text>
            <Image
              source={image.spain}
              style={{
                resizeMode: 'contain',
                width: 25,
                height: 25,
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  setModalVisible(visible, code) {
    this.setState({modalVisible: visible, wCode: code});
  }

  handleCheckboxToggle = check => {
    this.setState({isChecked: check});
  };

  render() {
    const {t} = this.props;
    return (
      <SafeAreaView>
        <View style={styles.container}>
          <View style={styles.screenContainer}>
            <View style={styles.screenStyle}>
              <TouchableOpacity onPress={this.navigateToScreen('Manage')}>
                <Text style={styles.btext}>{t('Manage Tickets')}</Text>
              </TouchableOpacity>
            </View>
            {/*<View style={styles.screenStyle}>
					<TouchableOpacity onPress={this.navigateToScreen('Create')}>
                    	<Text style={styles.btext} >Add Tickets</Text>
					</TouchableOpacity>
				</View>*/}
            <View style={styles.screenStyle}>
              <TouchableOpacity onPress={this.navigateToScreen('Notification')}>
                <Text style={styles.btext}>{t('Notifications')}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.screenStyle}>
              <Text style={styles.btext}>{t('Support')}</Text>
              <View style={styles.innerStyle}>
                <TouchableOpacity onPress={this.navigateToSupport('faq')}>
                  <Text style={styles.innerText}>{t('FAQ')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.navigateToSupport('law')}>
                  <Text style={styles.innerText}>{t('Laws')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.navigateToSupport('training')}>
                  <Text style={styles.innerText}>{t('Training Videos')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.navigateToSupport('support')}>
                  <Text style={styles.innerText}>{t('Contact 811')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.navigateToSupport('support')}>
                  <Text style={styles.innerText}>
                    {t('Contact DigContrax')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.screenStyle}>
              <TouchableOpacity onPress={this.navigateToScreen('Account')}>
                <Text style={styles.btext}>{t('Account')}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.screenStyle}>
              <TouchableOpacity
                onPress={this.navigateToScreen('ChangePassword')}>
                <Text style={styles.btext}>{t('Change Password')}</Text>
              </TouchableOpacity>
            </View>
            {/* <View style={styles.screenStyle}>
            {this.state.langOption==1 &&  <TouchableOpacity
                onPress={() => this.setModalVisible(!this.state.modalVisible)}>
                <Text style={styles.btext}>{t('Change Language')}</Text>
              </TouchableOpacity>}
              <View style={styles.MainContainer}>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={this.state.modalVisible}
                  onRequestClose={() => {}}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                    }}>
                    {this.renderModal()}
                  </View>
                </Modal>
              </View>
            </View> */}
            <View style={styles.screenStyle}>
              <TouchableOpacity onPress={() => this.logout()}>
                {/* <Text style={styles.btext}>Logout</Text> */}
                <Text style={styles.btext}>{t('Logout')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

export default withTranslation()(SideMenu);
const styles = StyleSheet.create({
  container: {
    //alignItems: 'center',
  },
  innerStyle: {
    marginLeft: 20,
    marginTop: 10,
  },
  screenContainer: {
    paddingTop: 20,
  },
  screenStyle: {
    marginTop: 15,
    marginLeft: 20,
  },
  btext: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'OpenSans-Regular',
  },
  innerText: {
    marginTop: 8,
    fontSize: 20,
    color: '#fff',
    fontFamily: 'OpenSans-Regular',
  },

  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS == 'ios' ? 20 : 0,
  },
  ModalInsideView: {
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '#fff',
    height: 300,
    width: '90%',
    borderRadius: 10,
    //borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'solid',
    elevation: 20,
    flexDirection: 'column',
  },
});





// import React, {Component} from 'react';
// import {
//   StackActions,
//   CommonActions,
//   DrawerActions,
// } from '@react-navigation/native';
// import {
//   Text,
//   View,
//   StyleSheet,
//   ImageBackground,
//   TouchableOpacity,
//   SafeAreaView,
//   Modal,
//   Image,
//   AsyncStorage
// } from 'react-native';
// import {image, config, _removeUser, _retrieveUser} from 'assets';
// import {H2} from 'native-base';
// import {CheckBox} from 'react-native-elements';

// import i18n from './translation';
// import './translation';
// import {withTranslation,useTranslation} from 'react-i18next';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// class SideMenu extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {modalVisible: false, isChecked: true,};
//   }

//   async componentDidMount(){		
		
// 		await AsyncStorage.getItem('addLangtype').then((language) => {
// 			console.log(language,"----1- lanaguyafge comiung friom asaync stoegarghe")
// 			// Use the retrieved language as the initial app language.
			
// 		  });
// 	}

//   navigateToScreen = route => () => {
//     /* old code
// 		  const navigateAction = NavigationActions.navigate({
// 				routeName: route
// 		  });
// 		  this.props.navigation.dispatch(navigateAction);
// 		  */
//     this.props.navigation.navigate(route);
//     this.props.navigation.dispatch(DrawerActions.closeDrawer());
//   };

//   navigateToSupport = page => () => {
//     var routeAction = 'Contact';
//     if (page == 'faq') {
//       routeAction = 'SupportFaq';
//     } else if (page == 'law') {
//       routeAction = 'SupportLaw';
//     } else if (page == 'training') {
//       routeAction = 'SupportTraining';
//     }
//     /* old code const navigateAction =  StackActions.reset({
// 	          index: 0,
// 	          actions: [
// 	            NavigationActions.navigate({
// 	              	routeName: 'Support',
// 					params: { page: page }
// 	            })
// 	          ]
// 	      })
// 		  this.props.navigation.dispatch(navigateAction);
// 		  */
//     this.props.navigation.navigate('Support', {screen: routeAction});
//     this.props.navigation.dispatch(DrawerActions.closeDrawer());
//   };

//   logout = () => {
//     _removeUser().then(user => {
//       config.hasToken = false;
//       const resetAction = CommonActions.reset({
//         index: 0,
//         routes: [{name: 'Auth'}],
//       });
//       /* old code
// 			const resetAction = StackActions.reset({
// 				index: 0, 
// 				key: null,
// 				actions: [
// 					CommonActions.navigate({ routeName: 'Auth' })
// 				],
// 			});
// 			*/
//       this.props.navigation.dispatch(resetAction);
//     });
//   };

//   renderModal() {
//     // kkey = this.state.wCode;
//     // if(typeof membersrowdetail[kkey] != 'undefined')
//     // {
//     // 	rowDetail = membersrowdetail[kkey];
//     // } else {
//     // 	rowDetail = membersrowdetail['SWGHPT'];
//     // }
//     return (
//       <View style={styles.ModalInsideView}>
//         <View
//           style={{
//             backgroundColor: '#febf26',
//             padding: 5,
//             borderTopLeftRadius: 10,
//             borderTopRightRadius: 10,
//             justifyContent: 'center',
//             alignItems: 'center',
//             flexDirection : 'row'
//           }}>
//           <H2 style={{fontFamily: 'RacingSansOne-Regular'}}>
//             Select Language
//           </H2>
//           <Icon name='cancel' size={20} onPress={() => this.setState({
//             modalVisible: false

//           })}  style={{left:50}}/>
//         </View>

//         <TouchableOpacity
//           style={{
//             borderBottomColor: '#ccc',
//             borderBottomWidth: 1,
//             justifyContent: 'flex-start',
//             alignItems: 'center',
//             flexDirection: 'row',
//           }}
//           disabled={this.state.isChecked == true ? true : false}
//           onPress={async() => {
//             i18n.changeLanguage('en');
//             this.handleCheckboxToggle(!this.state.isChecked),
//               this.setModalVisible(!this.state.modalVisible, '');
//               await AsyncStorage.setItem('@SelectLanguage','en')
//           }}>
//           <CheckBox
//             checked={this.state.isChecked ? true : false}
//             disabled={true}
            
//           />

//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               width: '75%',
//               alignItems: 'center',
//             }}>
//             <Text style={{color: '#000000'}}>English</Text>
//             <Image
//               source={image.flag}
//               style={{
//                 resizeMode: 'contain',
//                 width: 25,
//                 height: 25,
//               }}
//             />
//           </View>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={{
//             borderBottomColor: '#ccc',
//             borderBottomWidth: 1,
//             justifyContent: 'flex-start',
//             alignItems: 'center',
//             flexDirection: 'row',
//           }}
//           disabled={this.state.isChecked == false ? true : false}
//           onPress={async() => {
//             i18n.changeLanguage('sp');
//             this.handleCheckboxToggle(!this.state.isChecked),
//               this.setModalVisible(!this.state.modalVisible, '');
//               await AsyncStorage.setItem('@SelectLanguage','sp')
//           }}>
//           <CheckBox
//             checked={this.state.isChecked ? false : true}
//             disabled={true}
//           />

//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               width: '75%',
//               alignItems: 'center',
//             }}>
//             <Text style={{color: '#000000'}}>Spanish</Text>
//             <Image
//               source={image.spain}
//               style={{
//                 resizeMode: 'contain',
//                 width: 25,
//                 height: 25,
//               }}
//             />
//           </View>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   setModalVisible(visible, code) {
//     this.setState({modalVisible: visible, wCode: code});
//   }

//   handleCheckboxToggle = check => {
//     this.setState({isChecked: check});
//   };

//   render() {
//     const {t} = this.props;
//     return (
//       <SafeAreaView>
//         <View style={styles.container}>
//           <View style={styles.screenContainer}>
//             <View style={styles.screenStyle}>
//               <TouchableOpacity onPress={this.navigateToScreen('Manage')}>
//                 <Text style={styles.btext}>{t('Manage Tickets')}</Text>
//               </TouchableOpacity>
//             </View>
//             {/*<View style={styles.screenStyle}>
// 					<TouchableOpacity onPress={this.navigateToScreen('Create')}>
//                     	<Text style={styles.btext} >Add Tickets</Text>
// 					</TouchableOpacity>
// 				</View>*/}
//             <View style={styles.screenStyle}>
//               <TouchableOpacity onPress={this.navigateToScreen('Notification')}>
//                 <Text style={styles.btext}>{t('Notifications')}</Text>
//               </TouchableOpacity>
//             </View>
//             <View style={styles.screenStyle}>
//               <Text style={styles.btext}>{t('Support')}</Text>
//               <View style={styles.innerStyle}>
//                 <TouchableOpacity onPress={this.navigateToSupport('faq')}>
//                   <Text style={styles.innerText}>{t('FAQ')}</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={this.navigateToSupport('law')}>
//                   <Text style={styles.innerText}>{t('Laws')}</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={this.navigateToSupport('training')}>
//                   <Text style={styles.innerText}>{t('Training Videos')}</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={this.navigateToSupport('support')}>
//                   <Text style={styles.innerText}>{t('Contact 811')}</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={this.navigateToSupport('support')}>
//                   <Text style={styles.innerText}>
//                     {t('Contact DigContrax')}
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//             <View style={styles.screenStyle}>
//               <TouchableOpacity onPress={this.navigateToScreen('Account')}>
//                 <Text style={styles.btext}>{t('Account')}</Text>
//               </TouchableOpacity>
//             </View>
//             <View style={styles.screenStyle}>
//               <TouchableOpacity
//                 onPress={this.navigateToScreen('ChangePassword')}>
//                 <Text style={styles.btext}>{t('Change Password')}</Text>
//               </TouchableOpacity>
//             </View>
//             <View style={styles.screenStyle}>
//               <TouchableOpacity
//                 onPress={() => this.setModalVisible(!this.state.modalVisible)}>
//                 <Text style={styles.btext}>{t('Change Language')}</Text>
//               </TouchableOpacity>
//               <View style={styles.MainContainer}>
//                 <Modal
//                   animationType="slide"
//                   transparent={true}
//                   visible={this.state.modalVisible}
//                   onRequestClose={() => {}}>
//                   <View
//                     style={{
//                       flex: 1,
//                       justifyContent: 'center',
//                       alignItems: 'center',
//                       backgroundColor: 'rgba(0,0,0,0.5)',
//                     }}>

//                     {this.renderModal()}
//                   </View>
//                 </Modal>
//               </View>
//             </View>
//             <View style={styles.screenStyle}>
//               <TouchableOpacity onPress={() => this.logout()}>
//                 {/* <Text style={styles.btext}>Logout</Text> */}
//                 <Text style={styles.btext}>{t('Logout')}</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </SafeAreaView>
//     );
//   }
// }

// export default withTranslation()(SideMenu);
// const styles = StyleSheet.create({
//   container: {
//     //alignItems: 'center',
//   },
//   innerStyle: {
//     marginLeft: 20,
//     marginTop: 10,
//   },
//   screenContainer: {
//     paddingTop: 20,
//   },
//   screenStyle: {
//     marginTop: 15,
//     marginLeft: 20,
//   },
//   btext: {
//     fontSize: 20,
//     color: '#fff',
//     fontFamily: 'OpenSans-Regular',
//   },
//   innerText: {
//     marginTop: 8,
//     fontSize: 20,
//     color: '#fff',
//     fontFamily: 'OpenSans-Regular',
//   },

//   MainContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: Platform.OS == 'ios' ? 20 : 0,
//   },
//   ModalInsideView: {
//     //justifyContent: 'center',
//     //alignItems: 'center',
//     backgroundColor: '#fff',
//     height: 300,
//     width: '90%',
//     borderRadius: 10,
//     //borderWidth: 1,
//     borderColor: '#ccc',
//     borderStyle: 'solid',
//     elevation: 20,
//     flexDirection: 'column',
//   },
// });
