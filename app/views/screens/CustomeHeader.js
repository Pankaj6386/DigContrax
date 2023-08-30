import React, { Component } from 'react';
import {ScrollView, StyleSheet, View, SafeAreaView, Image, Text, TouchableOpacity, Plateform } from 'react-native';
import { Container, Header, Form, Item, Input, H1, Left, Body, Right, Icon, Title } from 'native-base';
import {image} from 'assets';

export default class CustomeHeader extends Component {
	constructor(props){
		super(props);		
  	}	
	static navigationOptions = {
		header: null
	};
	
	componentDidMount(){
		this.mounted = true;		
	}
	
	componentWillUnmount(){
		this.mounted = false;		
	}
	
	render() {
		const {navigate} = this.props.navigation;
		return (
			<View style={{ height:50, backgroundColor: '#6F6F6F' }}>
				<View style={{flexDirection: 'row'}}>
					<TouchableOpacity  onPress={()=> this.props.navigation.openDrawer()}>
						<View style={{alignSelf:'center'}} >
							<Image  source={image.iconMenu} resizeMode='contain' style={{transform: [{ scale: 0.72 }] }} />
						</View>
					</TouchableOpacity>
					<View style={{flex:1, marginTop:-10}}>
						<Image source={image.taglogo}  style={{ alignSelf:'center', transform: [{ scale: 0.65 }], height:70	 }} resizeMode='contain' />
					</View>
					<TouchableOpacity  onPress={()=> this.props.navigation.navigate('Account')} style={{alignSelf:'center', paddingRight: 10}}>
						<Image source={image.user} resizeMode='contain' />
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}