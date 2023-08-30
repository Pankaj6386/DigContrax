import React, { Component } from 'react';
import {  SafeAreaView, StyleSheet,  View , Image, Linking, ScrollView, TouchableOpacity }  from 'react-native';
import { Container,  H1, H2, H3, Text , Button, Form, Item, Input, Label, Icon } from "native-base";
import { image, config, _storeUser, _retrieveUser, validate, _showErrorMessage, Loader, _showSuccessMessage, _phoneFormat} from 'assets';
import CustomeHeader from '../CustomeHeader';
import { StackActions, CommonActions } from '@react-navigation/native';
import Content from '../../components/Content';

export default  class AddTicket extends Component {
	static navigationOptions = {
		header: null,
	};

	constructor(props){
		super(props);
		this.state = {
			isloading: false,
			ticketCount: 5,
			ticketNumbers: ['','','','',''],
			ticketErrorIdx: []
		};		
	}
	
	componentDidMount(){
		this.mounted = true;	
	}
	
	componentWillUnmount(){
		this.mounted = false;
	}

	addMoreTickets() {
		let ticketNumbers = this.state.ticketNumbers;
		for(let i=0; i<5; i++) {
			ticketNumbers.push('');
		}
		this.setState({ticketNumbers: ticketNumbers});
	}

	validateTicketNumber(){
		let ticketNumbers = this.state.ticketNumbers;
		var ticketErrorIdx = [];
		let error = false;
		const re = /^(?=.{10}$)[XW][0-9]+$/;
		ticketNumbers.map((v,k) => {
			if(v != "" && !re.test(v)) {
				ticketErrorIdx.push(k);
				error = true;
			}
		});
		this.setState({ ticketErrorIdx : ticketErrorIdx });
		return error;
	}

	changeTicket(idx, ticketNo) {
		let ticketNumbers = this.state.ticketNumbers;
		if(typeof ticketNumbers[idx] != "undefined") {
			ticketNumbers[idx] = ticketNo;
		}
		this.setState({ ticketNumbers: ticketNumbers });
		this.validateTicketNumber();
		console.log(ticketNumbers);
	}
	
	submitTickets() {
		let error = true;
		this.state.ticketNumbers.map((v,k) => {
			if(v != ''){
				error = false;
			}
		});
		if(error){
			_showErrorMessage("Please enter atleast one ticket number.", true);
			return;
		}
		error = this.validateTicketNumber();
		if(!error){
			_retrieveUser().then((user) => {
				if (user !== null) {
					var usr = JSON.parse(user);
					var user_id = usr.userInfo.id;
					this.submitTicketInfo(user_id);
					console.log(usr.userInfo.id);
				}
			});

		}

	}

	submitTicketInfo(user_id){
		this.setState({
					isloading: true						
				});	
		var ticketNumbers = [];
		this.state.ticketNumbers.map((v,k) => {
			if(v != ''){
				ticketNumbers.push(v);
			}
		});
		const formdata = new FormData();
	    formdata.append('tickets', JSON.stringify(ticketNumbers));
	    formdata.append('user_id', user_id );
		const token = config.currentToken;
		fetch(config.BASE_URL+'save-ticket?api_token='+token,{
			method: 'POST',
			headers: {
				Accept: 'application/json',
			},
			body:formdata		
		})
		.then((response) => response.json())
		.then((res) => {
			if(this.mounted) {
				if(res.status == 1)
				{					
					_showSuccessMessage(res.success_msg, true);			
				}
				else if(res.status == 0)
				{
					let errorMessage = '';
					if(typeof res.error != "undefined") {
						
					}
					_showErrorMessage(res.error_msg, true);				
				}
				this.setState({
					isloading: false,						
				});				
			}
		}).catch(err => {
			if(this.mounted) {
				_showErrorMessage('Something went wrong, Try again later.')
				this.setState({
					isloading: false,						
				});
			}
		}).done();
	}

	render() {
		const { navigation } = this.props;
		return (
			<SafeAreaView style={{flex: 1, backgroundColor: '#6f6f6f'}}>
			<Container>
			<CustomeHeader {...this.props}/>
			<Content>
			<View>
				<View style={{ padding: 10}}>
					<View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 35, alignItems: "center"}}>	
						<View style={{ width: '60%'}}>		
							<H1 style={{fontFamily:'RacingSansOne-Regular'}}>Add Tickets</H1>
						</View>
						<TouchableOpacity dark style={{backgroundColor: "#313131", padding: 10, alignItems: "center", borderRadius: 5, width: '32%', flexDirection: "row", height: 40, justifyContent: 'center'}} onPress={() => this.addMoreTickets()} >
							<Icon type="FontAwesome" name="plus-circle" style={{ color: "#fff", fontSize: 22}}/>
				            <Text style={{ fontSize: 15, marginLeft: 5, color: "#fff"}}>Add More</Text>
				        </TouchableOpacity>
				        
			        </View>
		        	<Text style={{marginBottom: 5,fontSize:15, marginTop: 5}}>To add tickets to your account, please enter the ticket numbers below. We will retrieve the ticket details and load them into your Manage Tickets dashboard.</Text>
		        </View>
				<View style={{padding:10, margin: 10, paddingBottom: 20, backgroundColor: "#313131", borderRadius: 5}}>
					{
						this.state.ticketNumbers.map((value, key) => {
							return(
								<View>
								<Item stackedLabel style={{ marginTop: 5 }}>
									<Label style={{ color: '#fff'}}>Ticket Number</Label>
									<Input onChangeText={(ticketNo) => this.changeTicket(key, ticketNo) } style={{ backgroundColor: '#fff', height: 20}} value={value} placeholder="Enter Ticket Number" maxLength={10} uppercase={true}/>
								</Item>
								{(this.state.ticketErrorIdx.indexOf(key) != -1) && <Text style={{ color: "red", fontSize: 14}}>Invalid ticket number.</Text>
								}
								</View>
							)
						})
					}
					
				</View>
				<View style={{ margin: 10 }}> 
					<TouchableOpacity style={{alignSelf:'center',paddingTop:10,paddingBottom:10,backgroundColor:'#FFBC42', width: '100%', borderRadius: 5}} onPress={() => this.submitTickets()}>
	                  	<Text style={{fontSize:22,fontFamily:'OpenSans-Bold', textAlign: "center"}}>SUBMIT</Text>
	               	</TouchableOpacity>
               	</View>
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