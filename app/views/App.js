import React, { Component ,Suspense} from 'react';
import { Toast, Root } from 'native-base';
import { AppStack } from './Route';
import {  Text, TextInput, View,AsyncStorage }  from 'react-native';
import i18n from 'i18next';
import SplashScreen from 'react-native-splash-screen';

//navigator.geolocation = require('@react-native-community/geolocation');

class App extends React.Component {
	
	constructor(props){
		super(props);
		console.disableYellowBox = true;
  	}
	
	async componentDidMount(){		
		SplashScreen.hide();
		this.mounted = true;

		Text.defaultProps = {};
		Text.defaultProps.allowFontScaling = false; 
		Text.defaultProps.adjustsFontSizeToFit = true;

		TextInput.defaultProps = {};
		TextInput.defaultProps.allowFontScaling = false;
		TextInput.defaultProps.adjustsFontSizeToFit = true;
		// await AsyncStorage.setItem('@SelectLanguage', 'sp');
		await AsyncStorage.getItem('@SelectLanguage').then((language) => {
			console.log(language,"----1- lanaguyafge comiung friom asaync stoegarghe")
			// Use the retrieved language as the initial app language.
			i18n.changeLanguage(language);
		});
	}
	
	componentWillUnmount(){
		this.mounted = false;		
	}

	
	render() {
		return (
		
			<Root>
				<AppStack />
			</Root>
		);
	}
}
export default App;