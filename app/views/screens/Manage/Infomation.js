import React, { Component } from 'react';
import {  SafeAreaView, StyleSheet,  View , Image, Linking, ScrollView, TouchableOpacity }  from 'react-native';
import { Container,  H1, H2, H3, Text , Button, Form, Item, Input, Label, Icon } from "native-base";
import { image, config, _storeUser, _retrieveUser, validate, _showErrorMessage, Loader, _showSuccessMessage, _phoneFormat} from 'assets';

export default  class Infomation extends Component {
	constructor(props){
		super(props)		
	}
	componentDidMount(){
		this.mounted = true;	
	}
	componentWillUnmount(){
		this.mounted = false;
	}
	render() {
		return (
			<View>
				<View style={{padding:10}}>
					<Item regular style={{}}>
						  <Input placeholder='Input Name' />
					 </Item>
					 <Item regular style={{marginTop:5}}>
						  <Input placeholder='Input Name' />
					 </Item>
					  <Item regular style={{marginTop:5}}>
						  <Input placeholder='Input Name' />
					 </Item>
					 <Item regular style={{marginTop:5}}>
						  <Input placeholder='Input Name' />
					 </Item>
				</View>
				<Button block style={{backgroundColor: "#c6c9c6",marginTop: 20}}>
					<H3 style={{fontFamily:'OpenSans-Bold'}}>SAVE UPDATES</H3>
				</Button>
				<Button block small onPress={() => this.props.goBack()} style={{backgroundColor: "#E05439", marginTop: 25}} >
					<Text style={{color:"#fff", fontFamily:'OpenSans-SemiBold' }}>CANCEL</Text>
				</Button>
			</View>
		);
	}
}