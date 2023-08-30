import React, { Component } from 'react';
import { Toast, Root } from 'native-base';
import { AppStack } from './Route';
import {  Text, TextInput, View }  from 'react-native';

//navigator.geolocation = require('@react-native-community/geolocation');

class App extends React.Component {
	
	constructor(props){
		super(props);
		console.disableYellowBox = true;
  	}
	
	componentDidMount(){		
		this.mounted = true;

		Text.defaultProps = {};
		Text.defaultProps.allowFontScaling = false; 
		Text.defaultProps.adjustsFontSizeToFit = true;

		TextInput.defaultProps = {};
		TextInput.defaultProps.allowFontScaling = false;
		TextInput.defaultProps.adjustsFontSizeToFit = true;
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