import React, {Component} from 'react';
import { 
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
  AsyncStorage
} from 'react-native';
import { config, _removeUser, _retrieveUser} from 'assets'; 
import './translation';
import {withTranslation} from 'react-i18next';

class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {modalVisible: false, isChecked: null,langOption:0};
  }

  navigateToScreen = route => () => { 
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
     
      this.props.navigation.dispatch(resetAction);
    });
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
         
            <View style={styles.screenStyle}>
              <TouchableOpacity onPress={() => this.logout()}>
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
    backgroundColor: '#fff',
    height: 300,
    width: '90%',
    borderRadius: 10,
    borderColor: '#ccc',
    borderStyle: 'solid',
    elevation: 20,
    flexDirection: 'column',
  },
});



