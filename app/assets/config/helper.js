import React from 'react';
import { AsyncStorage, Platform, Alert, Linking} from 'react-native';
import { Toast, Root } from 'native-base';

export async function _storeUser(data) {
	try {
		await AsyncStorage.setItem('@DigContrax:sQd!@_loginInfo', JSON.stringify(data));
		return true;
	} catch (error) {
		return false
	}
}
export async function _retrieveUser() {
	try {
		const value = await AsyncStorage.getItem('@DigContrax:sQd!@_loginInfo');
		return value
	} catch (error) {
		return false;
	}
}

export async function _retrieveLanguage() {
	try {
		const value = await AsyncStorage.getItem('@SelectLanguage');
		return value
	} catch (error) {
		return false;
	}
}

export async function _updateTermsAccepted() {
	try {
		const user = await AsyncStorage.getItem('@DigContrax:sQd!@_loginInfo');
		var usr = JSON.parse(user);
		usr.userInfo.terms_accepted = 1;
		await AsyncStorage.setItem('@DigContrax:sQd!@_loginInfo', JSON.stringify(usr));
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}

export async function _setHideExpired(status = false) {
	try {
		const user = await AsyncStorage.getItem('@DigContrax:sQd!@_loginInfo');
		var usr = JSON.parse(user);
		usr['hide_expired'] = status;
		console.log("setting user info ", usr);
		await AsyncStorage.setItem('@DigContrax:sQd!@_loginInfo', JSON.stringify(usr));
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}
export async function _setHideNotifyExpired(status = false) {
	try {
		const user = await AsyncStorage.getItem('@DigContrax:sQd!@_loginInfo');
		var usr = JSON.parse(user);
		usr['hide_notify_expired'] = status;
		await AsyncStorage.setItem('@DigContrax:sQd!@_loginInfo', JSON.stringify(usr));
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}
export async function _removeUser() {
	try {
		await AsyncStorage.removeItem('@DigContrax:sQd!@_loginInfo');
		return true;
    }
    catch(exception) {
		return false;
    }
}

export async function _getAll() {
	await AsyncStorage.getAllKeys().then((user) => {
		//console.warn(user)
	});
	return true;
}

export async function _showErrorMessage(msg, showAlert = false) {
	if(showAlert) {
		alert(msg);
	}else{
		Toast.show({
			text: msg,
			buttonText: "Okay",
			duration: 3000,
			type: "danger",
			position:Platform.OS === 'ios' ? 'top' : 'bottom',
		})
	}
}

export async function _showSuccessMessage(msg, showAlert = false) {
	if(showAlert) {
		alert(msg);
	}else {
		Toast.show({
			text: msg,
			buttonText: "Okay",
			duration: 3000,
			type: "success",
			position:Platform.OS === 'ios' ? 'top' : 'bottom',
		});
	}
}


export function _phoneFormat(text) {
	var cleaned = ('' + text).replace(/\D/g, '')
	var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
	if (match) {
		var intlCode = (match[1] ? '+1 ' : ''),
		number = [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
		return number;
	}
	return text;	
}

export const _getallticketstatus = function(URL, reach) {
	fetch(URL,{
		method: 'GET',
		headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
	})
	.then((response) => response.json())
	.then((res) => {
		reach(res);
	}).catch(err => {
		//return 'Something went wrong, Try again later.';		
	}).done();
}

export const _updateAppMessage = function(msg) {

	const APP_STORE_LINK = 'itms://itunes.apple.com/in/app/apple-store/id1526011703?mt=8';
    const PLAY_STORE_LINK = 'market://details?id=com.digcontrax';
    Alert.alert(
        'Update Available',
        'This version of the app is outdated. Please update app from the '+(Platform.OS =='ios' ? 'app store' : 'play store')+'.',
        [
            {text: 'Update Now', onPress: () => {
                if(Platform.OS =='ios'){
                	Linking.canOpenURL(APP_STORE_LINK).then(supported => {
				        supported && Linking.openURL(APP_STORE_LINK);
				    }, (err) => {
				    	alert("Unable to open this link. please update it manually from app store.");
				    });
                    //Linking.openURL(APP_STORE_LINK).catch(err => console.error('An error occurred', err));
                }
                else{
                	Linking.canOpenURL(PLAY_STORE_LINK).then(supported => {
				        supported && Linking.openURL(PLAY_STORE_LINK);
				    }, (err) => {
				    	alert("Unable to open this link. please update it manually from app store."); 
				    });
                    
                    //Linking.openURL(PLAY_STORE_LINK).catch(err => console.error('An error occurred', err));
                }
            }},
        ]
    );
 
}
/*Get Companies List*/
export const _getcompanies = function(URL, reach) {
	fetch(URL,{
		method: 'GET',
		headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
	})
	.then((response) => response.json())
	.then((res) => {
		reach(res);
	}).catch(err => {
		//return 'Something went wrong, Try again later.';		
	}).done();
}
/*Get Companies List*/
/*Check User Activation*/
export const _isUserActivated = function(URL, reach) {
	fetch(URL,{
		method: 'GET',
		headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
	})
	.then((response) => response.json())
	.then((res) => {
		reach(res);
	}).catch(err => {
		//return 'Something went wrong, Try again later.';		
	}).done();
}
/*Check User Activation*/