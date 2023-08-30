import React, { Component } from 'react';
import {  SafeAreaView, StyleSheet,  View , ScrollView, TouchableOpacity, Dimensions }  from 'react-native';
import { Container,  H1, H2, H3, Text , Button, Item, Input, Label } from "native-base";
import {config, _showErrorMessage, Loader, _showSuccessMessage} from 'assets';
import CustomeHeader from '../CustomeHeader';
import Content from '../../components/Content';

export default class ChangePassword extends Component {
	constructor(props){
		super(props)
		this.state = {
			isloading: false,
			old_password: '',
			new_password: '',
			confirm_password: ''
		}
	}

	componentDidMount(){
		this.mounted = true;
		this.setState({
			old_password: '',
			new_password: '',
			confirm_password: ''
		});
	}

	componentWillUnmount(){
		this.mounted = false;
	}

	_doChangePassword = () => {
		const {old_password, new_password, confirm_password} = this.state;
		if ( old_password.trim() == "" || new_password.trim() == "" || confirm_password.trim() == "") {
			_showErrorMessage("All fields required.");
			return;
		}

		if (new_password.trim().length < 6) {
			_showErrorMessage("The new password must be at least 6 characters.");
			return;
		}

		if (new_password.trim() != confirm_password.trim()) {
			_showErrorMessage("Confirm password not matched.");
			return;
		}

		this._updatePassword();

	}

	_updatePassword(){
		if(this.mounted) {
			this.setState({
				isloading: true,
			});
		}
		const {old_password, new_password, confirm_password} = this.state;
		const data = new FormData();
		data.append('old_password', old_password.trim());
		data.append('new_password', new_password.trim());
		data.append('confirm_password', confirm_password.trim());
		
		fetch(config.BASE_URL+'change-password?api_token='+config.currentToken,{
			method: 'POST',
			headers: {
				Accept: 'application/json',
			},
			body:data
		})
		.then((response) => response.json())
		.then((res) => {
			if(this.mounted) {
				if(res.status == 1)
				{
					this.setState({
						old_password: '',
						new_password: '',
						confirm_password: ''
					});
					alert('Password updated successfully.');
				}
				else if(res.status == 0)
				{
					alert(res.message)
				} else {
					throw "Error";
				}
				
				this.setState({
					isloading: false,
				});
			}
		}).catch(err => {
			if(this.mounted) {
				_showErrorMessage('Something went wrong, Try again later');
				this.setState({
					isloading: false,
				});
			}
		}).done();
	}

	render() {
		return (
			<SafeAreaView style={{flex: 1, backgroundColor: '#6f6f6f'}}>
			<Container>
				<CustomeHeader {...this.props}/>
				<Content>
				<View style={{margin:10}}>
					<H1 style={{fontFamily:'RacingSansOne-Regular', marginTop: 20}}>CHANGE PASSWORD</H1>
					<H3 style={{fontFamily:'RacingSansOne-Regular', marginTop: 10}}>User Information</H3>
					<View>
						<Label style={{marginTop: 10}}>Current Password</Label>
						<Item regular style={{backgroundColor: '#fff', marginTop: 5}}>
							<Input defaultValue={this.state.old_password}  onChangeText={(text) => this.setState({old_password: text.trim()})} secureTextEntry={true}/>
						</Item>

						<Label style={{marginTop: 10}}>New Password</Label>
						<Item regular style={{backgroundColor: '#fff', marginTop: 5}}>
							<Input defaultValue={this.state.new_password}  onChangeText={(text) => this.setState({new_password: text.trim()})} secureTextEntry={true}/>
						</Item>

						<Label style={{marginTop: 10}}>Confirm New Password</Label>
						<Item regular style={{backgroundColor: '#fff', marginTop: 5}}>
							<Input defaultValue={this.state.confirm_password}  onChangeText={(text) => this.setState({confirm_password: text.trim()})} secureTextEntry={true}/>
						</Item>
					</View>
					<Button block large onPress={this._doChangePassword} style={{backgroundColor: "#FFBC42", marginTop: 25}}>
							<H3 style={{color:"#000", fontFamily:'OpenSans-SemiBold' }}>UPDATE PASSWORD</H3>
					</Button>
					<Button block large onPress={()=> this.props.navigation.navigate('Manage')} style={{backgroundColor: "#E05439", marginTop: 25}}>
							<Text style={{color:"#fff", fontFamily:'OpenSans-SemiBold' }}>CANCEL</Text>
					</Button>
				</View>
				</Content>
				{this.state.isloading && (
					<Loader />
				)}
			</Container>
			</SafeAreaView>	
		)
	}
}