import React, { Component } from 'react';
import {ScrollView, StyleSheet, View, SafeAreaView, Image, Text, Platform } from 'react-native';
import { Container, Header, Form, Item, Input, Label, Icon, Toast, Root, Button, H3, H1,Thumbnail } from 'native-base';
import { image, config, _storeUser, validate, _showErrorMessage, _showSuccessMessage,Loader} from 'assets';
import { StackActions, CommonActions } from '@react-navigation/native';
import Content from '../../components/Content';

const data = new FormData();
export default class ForgotPassword extends Component {
	
	static navigationOptions = {
		headerTitle: <Image  source={image.taglogo}  style={{
			alignSelf:'center',
			flex:1,
			resizeMode:'contain',
			transform: Platform.OS === 'ios' ? [{ scale: 0.65 }] : [{ scale: 0.72 }],
		}} />,
		headerStyle: {
        backgroundColor: '#6f6f6f',
      },
	};
	
	constructor(props){
		super(props);	
		this.state = {
			email: "",
			isloading: false,
		}		
  	}
	
	componentDidMount(){
		this.mounted = true;		
	}
	
	componentWillUnmount(){
		this.mounted = false;		
	}
	
	_sendRequest(data){
		console.log(data);
		this.setState({
			isloading: true
		});
		var _this = this;
		fetch(config.BASE_URL+'forgetPassword',{
			method: 'POST',
			headers: {
				'Accept': 'application/json',					
			},
			body:data			
		})
		.then((response) => response.json())
		.then((res) => {
			console.log(res);
			if(this.mounted) {
				this.setState({
					isloading: false
				});
				if(res.status == 1)
				{
					this.setState({ email: "" });
					this.navigateToScreen('Login');
					_showSuccessMessage(res.message, true);					
				}	
				else if(res.status == 0)
				{
					_showErrorMessage(res.message, true)					
				} else {
					throw "Error";
				}	
			}
		}).catch(err => {
			if(this.mounted) {
				_showErrorMessage('Something went wrong, Try again later.')
				this.setState({
					isloading: false
				});
			}
		}).done();
	}
	
	_resetPassoword = () => {
		const data = new FormData();
		const email = this.state.email;
		var error = false;
		var msg = '';
		if(email.trim() == '')
		{
			msg += 'Please enter email address\n';
			var error = true;
		}else{
			var mValid = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;		
			if(!mValid.test(email))
			{
				msg += 'Please enter a valid email address\n';
				var error = true;
			}
		}
		
		if(error)
		{
			_showErrorMessage(msg, true)				
		} else {
			if(this.mounted) {
				this.setState({
					isloading: true,
				});
				data.append('email', email );
				this._sendRequest(data);
			}
		}
	}
	
	navigateToScreen = ( route ) =>(
		  () => {			  
		  /* old code const navigateAction = NavigationActions.navigate({
				routeName: route
		  });
		  this.props.navigation.dispatch(navigateAction);*/
		  this.props.navigation.navigate(route);

	})
	
	render() {    
		return (
			<SafeAreaView style={{flex: 1}}>
				<Container padder style={{backgroundColor: '#FFBC42',}}>
					<View style={{ flex:1, flexDirection:'row', justifyContent: 'center', alignItems: 'center' }} >
					<Content padder style={{padding:20}} >
						<H1 style={{fontFamily:'RacingSansOne-Regular'}}>FORGOT PASSWORD</H1>	
						<Text style={{ fontSize: 12, marginBottom: 10}} >We will send a recovery link to your registered email to reset your password.</Text>
						<Form>
							<Item regular style={{backgroundColor: '#fff'}}>
								<Thumbnail source={image.user} style={{transform: [{ scale: 0.85 }], resizeMode:'contain', width:40, marginLeft: 5 }} />
								<Input placeholder='Email Address'  onChangeText={(text) => this.setState({email: text.trim()})}/>
							</Item>
							<Button block medium onPress={this._resetPassoword} style={{backgroundColor: "#262626", fontFamily:'OpenSans-SemiBold', marginTop: 25}}>
								<H3 style={{color:"#fff", fontFamily:'OpenSans-SemiBold' }}>SEND</H3>
							</Button>
							<Button block medium onPress={this.navigateToScreen('Login') } style={{backgroundColor: "#6F6F6F", fontFamily:'OpenSans-SemiBold', marginTop: 25}}>
								<H3 style={{color:"#fff", fontFamily:'OpenSans-SemiBold' }}>CANCEL</H3>
							</Button>
						</Form>
						
					</Content>
					</View>					
					{this.state.isloading && (
							<Loader />
					)}					
				</Container>				
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	logoImage: {
		alignSelf:'center',
		flex:1,
		resizeMode:'contain',
		transform: Platform.OS === 'ios' ? [{ scale: 0.65 }] : [{ scale: 0.82 }],
	},
	texts: {
		fontFamily:'OpenSans-Regular',
	},
	textss: {
		fontFamily:'OpenSans-Bold',
	},
	ticket_req:{
		fontSize: 28,
		textAlign: 'center',
		color:'#000000',
		fontFamily: "OpenSans-Bold"
	}
});
