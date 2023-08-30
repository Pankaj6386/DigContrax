import React, { Component } from 'react';
import {  SafeAreaView, StyleSheet,  View , Image, Linking, ScrollView }  from 'react-native';
import { Container,  H1, H2, H3, Text , Button, Form, Item, Input, Label, Icon } from "native-base";
import { image, config, _storeUser, _retrieveUser, validate, _showErrorMessage, Loader, _showSuccessMessage, _phoneFormat} from 'assets';
import Common from './Common';
import Content from '../../components/Content';

export default  class TicketDoc extends Component {
	static navigationOptions = {
		header: null,
	};
	
	constructor(props){
		super(props)
		this.state = {
			isloading: false,
			
		};
	}
	componentDidMount(){
		this.mounted = true;	
	}
	
	componentWillUnmount(){
		this.mounted = false;		
	}
	
	render() {
		return (
			<SafeAreaView style={{flex: 1, backgroundColor: '#6f6f6f'}}>
			<Container>
				<CustomeHeader {...this.props}/>
				<Content>
				<View style={{margin:10}}>
					<Common ticket={this.state.ticket} active='doc'/>
				</View>
				</Content>
				{this.state.isloading && (
					<Loader />
				)}
			</Container>
			</SafeAreaView>
		);
	}
}

const styless = StyleSheet.create({
	texts: {
		fontFamily:'OpenSans-Regular',		
	},
	ticket_req:{
		fontSize: 28,
		textAlign: 'center',
		marginTop: 20,
		color:'#000000',
		fontFamily: "OpenSans-Bold" 
	},
	button:{
		backgroundColor: "#ffcc2b",    
		marginTop: 15
	}  
});