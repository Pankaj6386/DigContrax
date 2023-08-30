import React, { Component } from 'react';
import {ScrollView, StyleSheet, View, SafeAreaView, Image, Text, TouchableOpacity,Platform, Dimensions, Linking } from 'react-native';
import { Container, Header, Form, Item, Input, Label, Icon, Toast, Root, Button, H3, H1, H2, Thumbnail, Picker, CheckBox, ListItem, Body } from 'native-base';
import { image, config, _storeUser, validate, _showErrorMessage, Loader, _phoneFormat, _getcompanies} from 'assets';
import { StackActions, CommonActions } from '@react-navigation/native';
import Content from '../../components/Content';

let formsvalue = [
	{  field: 'name', title:'Name', required: true },
	{  field: 'email', title:'Email', required: false },
	{  field: 'c_phone', title:'Phone(Cell)', required: false },
	{  field: 'username', title:'Username', required: true },
	{  field: 'password', title:'Password', required: true },
	{  field: 'companyid', title:'Company', required: true },
	/*{  field: 'cname', title:'Company Name', required: false },
	{  field: 'address', title:'Address 1', required: false },
	{  field: 'address2', title:'Address 2', required: false },
	{  field: 'city', title:'City', required: false },
	{  field: 'state', title:'State', required: false },
	{  field: 'zip', title:'Zip', required: false },
	{  field: 'company_type', title:'Company Type', required: false },
	{  field: 'industry', title:'Industry', required: false },	*/
	{  field: 'o_phone', title:'Phone(Office)', required: true },
	{  field: 'fax', title:'Fax', required: false },
	{  field: 'alt_contact', title:'Alternate Contact Person', required: true },
	{  field: 'phone', title:'Phone', required: true }
]

export default class Register extends Component {
	
	static navigationOptions = {
		headerTitle: <Image  source={image.taglogo}  style={{
			alignSelf:'center',
			flex:1,
			resizeMode:'contain',
			height:70,
			transform: Platform.OS === 'ios' ? [{ scale: 0.65 }] : [{ scale: 0.72 }],
		}} />,
		headerStyle: {
        backgroundColor: '#6f6f6f',
      },
		headerLeft: null
	};
	
	constructor(props){
		super(props);	
		this.state = {
			isloading: false,
			is_agree: false,
			//state:'NV',
			email:'',
			c_phone:'',
			c_phone_original:'',
			username:'',
			notify_email:false,
			notify_phone:false,
			isInvited:false,
			companies:[],
			companyid:0,
			companyinfo:{'name':'', 'companyid':0, 'address1':'', 'address2':'', 'city':'', 'state':'', 'zip':'', 'type':'', 'industry':''},
		}
  	}
	
	componentDidMount(){
		var self = this;
		this.mounted = true;
		_getcompanies(config.BASE_URL+'all-companies', function(res){
			if(res.status == 1)
			{
				self.setState({						
					companies:res.data,
					//companyid:res.data[0]['id'],
					/*companyinfo:{
						'companyid':res.data[0]['id'], 
						'name':res.data[0]['name'], 
						'address':res.data[0]['address1'],
						'address2':res.data[0]['address2'],
						'city':res.data[0]['city'],
						'state':res.data[0]['state'],
						'zip':res.data[0]['zip'],
						'company_type':res.data[0]['type'],
						'industry':res.data[0]['industry']
					},*/
				});
			}
		})
	}
	
	componentWillUnmount(){
		this.mounted = false;		
	}
	
	renderComapnies(data) {
		var {height, width} = Dimensions.get('window');
		if(this.state.isInvited)
		{
			return (
				<Input placeholder='Comapny Name' editable = {false}  value={this.state.companyinfo.name} />
			)
		}else if (Platform.OS === 'android'){
			return (
				<Item picker>
					<Picker
						mode="dropdown"
						iosIcon={<Icon name="ios-arrow-down" />}
						style={{ width: width-20 }}
						placeholder="Select Company"
						iosHeader="Select Company"
						placeholderStyle={{ color: "#000" }}
						placeholderIconColor="#007aff"
	               		selectedValue={this.state.companyid}
	               		onValueChange={this.onCompanyChange.bind(this)}
					>
					<Picker.Item label="Select Company" value=''/>
					{
						data.map((option, i) => {
							return (	
								<Picker.Item key={option.id} label={option.name} value={option.id} />
							)						
						})
					}               
					</Picker>
				</Item>
			)

		}
		else
		{
			return (
				<Item picker>
					<Picker
						mode="dropdown"
						iosIcon={<Icon name="ios-arrow-down" />}
						style={{ width: width-20 }}
						placeholder="Select Company"
						iosHeader="Select Company"
						placeholderStyle={{ color: "#000" }}
						placeholderIconColor="#007aff"
	               		selectedValue={this.state.companyid}
	               		onValueChange={this.onCompanyChange.bind(this)}
					>
					{
						data.map((option, i) => {
							return (	
								<Picker.Item key={option.id} label={option.name} value={option.id} />
							)						
						})
					}               
					</Picker>
				</Item>
			)
		}
		
	}

	onCompanyChange(value: string) {
		var companyinfos = []
		this.state.companies.map((comp) => {
		    if(comp.id == value)
		    {
		    	companyinfos = {
					'companyid':comp.id, 
					'name':comp.name, 
					'address':comp.address1,
					'address2':comp.address2,
					'city':comp.city,
					'state':comp.state,
					'zip':comp.zip,
					'company_type':comp.type,
					'industry':comp.industry
				}
		    }
		});
		this.setState({
			companyid:value,
			companyinfo: companyinfos
		});
	}

	onTextChange(wState, text) {
		var number = _phoneFormat(text);		
		this.setState({
			[wState]: number
		});
		if(wState == 'c_phone' )
		{
			this.setState({ c_phone_original: text });
			if(text.length == 10 && !this.state.isInvited)
			{
				const d = new FormData();
				d.append('findkey', 'p')
				d.append('value', text) 
				this._checkIsInvited(d)
			}
			var notify_phone = ((number.trim() != '') && this.state.email == '' )?true:false;
			this.setState({
				notify_phone: notify_phone,
				notify_email: (notify_phone)?false:true,
				username:(this.state.email == "")?text:this.state.email,
			});			
		}
	}

	_checkIsInvited = (data) => {
		console.log(data);
		fetch(config.BASE_URL+'is-invited-user',{
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
				if(res.status == 1)
				{
					if(typeof res.data.id != "undefined")
					{
						companyinfos = {
							'companyid':res.data.id, 
							'name':res.data.name, 
							'address1':res.data.address1,
							'address2':res.data.address2,
							'city':res.data.city,
							'state':res.data.state,
							'zip':res.data.zip,
							'type':res.data.type,
							'industry':res.data.industry
						}
						this.setState({
							companyid:res.data.id,
							companyinfo: companyinfos,
							isInvited:true
						});
					}
				}else {
					this.setState({
						companyid:'',
						companyinfo: [],
						isInvited:false
					});
					

				}			
			}
		}).catch(err => {
			if(this.mounted) {
				
			}
		}).done();
	}

	onEmailChange(wState, text) {
		var txt = text.trim();
		
		var res = validate('email', txt, 'email' );
		console.log(res);
		//if(res.status == 1 && !this.state.isInvited)
		if(res.status == 1)
		{
			const d = new FormData();
			d.append('findkey', 'e') //Check For email
			d.append('value', txt) 
			this._checkIsInvited(d)
		}
		var notify_email = (this.state.c_phone == '' && (txt.trim() != '') )?true:false;
		this.setState({
			email: txt,
			username:(this.state.c_phone == '' && (txt.trim() != '') )?txt:this.state.c_phone_original,
			notify_email: notify_email,
			notify_phone: (notify_email)?false:true
		});

	}	
	
	_sendRegister(data){
		this.setState({
			isloading: true
		});
		//console.log(data);return;
		fetch(config.BASE_URL+'register',{
			method: 'POST',
			headers: {
				'Accept': 'application/json',					
			},
			body:data			
		})
		.then((response) => response.json())
		.then((res) => {
			if(this.mounted) {
				//console.log(res);return;
				this.setState({
					isloading: false
				});
				if(res.status == 1)
				{
					let appState = {
						isLoggedIn: true,
						userInfo: res.info
					};				 
					_storeUser(appState).then((user) => {
						/* old code const resetAction = StackActions.reset({
							index: 0, 
							key: null,
							actions: [
								NavigationActions.navigate({ routeName: 'Dashboard' })
							],
						});*/
						const resetAction = CommonActions.reset({
							    index: 0,
							    routes: [
							      { name: 'Dashboard' }
							    ],
							  });
						this.props.navigation.dispatch(resetAction);
					});
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
	
	_doRegister = () => {
		var msg = '';
		const data = new FormData();
		formsvalue.forEach((option, i) => {
			if(option.field == 'email')
			{
				if(this.state.email == '' && this.state.c_phone == '')
				{
					msg += 'Please enter Email or Phone(Cell) \n';
				}
				else if(this.state.email != '')
				{
					var res = validate(option.field, this.state[option.field], option.title );
					if(res.status == 0)
					{
						msg += res.message+'\n';
					}
				}
			}
			if(option.required)
			{
				var res = validate(option.field, this.state[option.field], option.title );
				if(res.status == 0)
				{
					msg += res.message+'\n';
				}
			} 
			if(typeof this.state[option.field] != "undefined")
			{
				data.append(option.field, this.state[option.field] );
			}					
		});
		if(msg == '')
		{
			if(this.state.cpassword != this.state.password)
			{
				msg = 'Confirm password not matched';
			}	
			else if(!this.state.is_agree)
			{
				msg = 'Please agree with term and conditions';
			}			
		}
		
		if(msg != '')
		{
			_showErrorMessage(msg, true)
		} else {
			data.append('notified_e', (this.state.notify_email)?1:0 );
			data.append('notified_p', (this.state.notify_phone)?1:0 );

			this._sendRegister(data);
		}		
	}
	
	onClick  = () => {
	  this.setState({
			is_agree: !this.state.is_agree
		})
	}
	
	changeBox = (v) => {
		if(this.state.c_phone != '' && this.state.email != '')
		{
			this.setState({
				notify_email: (v == 'email')?true:false,
				notify_phone: (v == 'c_phone')?true:false,
				username: (v == 'email')?this.state.email:this.state.c_phone_original
			});
		}	
	}

	onValueChange2(value: string) {
		this.setState({
			state: value
		});
	}
	
	renderDropDown(data) {
		return (
			<Item picker>
				<Picker
					mode="dropdown"
					iosIcon={<Icon name="ios-arrow-down" />}
					style={{ width: 82 }}
					placeholder={data[0].k}
					placeholderStyle={{ color: "#000" }}
					placeholderIconColor="#007aff"
               selectedValue={this.state.state}
               onValueChange={this.onValueChange2.bind(this)}
				>
				{
					data.map((option, i) => {
						return (	
							<Picker.Item key={i} label={option.k} value={option.v} />
						)						
					})
				}               
				</Picker>
			</Item>
		)
	}
	
	render() {    
		return (
			<SafeAreaView style={{flex: 1}}>
				<Container style={{backgroundColor: '#FFBC42',}}>
				<Content>
					<View style={{margin:10}}>
						<H1 style={{fontFamily:'RacingSansOne-Regular', marginTop: 30, marginBottom: 20}}>REGISTER NEW ACCOUNT</H1>	
						<Form>						
							<Item regular style={{backgroundColor: '#fff', marginTop: 5}}>
								<Input placeholder='Name'  onChangeText={(text) => this.setState({name: text.trim()})}/>
							</Item>
							<Item regular style={{backgroundColor: '#fff', marginTop: 5}}>
								<Input placeholder='Email' onChangeText={(text) => this.onEmailChange('email', text) } />
							</Item>
							<Item regular style={{backgroundColor: '#fff', marginTop: 5}}>
								<Input placeholder='Phone(Cell)' textContentType='telephoneNumber' dataDetectorTypes='phoneNumber' keyboardType='phone-pad' defaultValue={this.state.c_phone}  maxLength={14} onChangeText={(text) => this.onTextChange('c_phone', text) } />
							</Item>
							<View style={{marginTop:10, marginBottom:20}}>
								<Text>What is your preferred method of communication? This is where system notifications will be sent.It can be changed at any time in your user account settings.</Text>	
								<View style={{ flex: 1, marginTop:5, marginBottom:5, flexDirection: 'row' }}>
									<TouchableOpacity style={{flexDirection: 'row'}} onPress={() => this.changeBox('email')} >
										<Icon name={(this.state.notify_email) ? 'checkbox' : 'md-square-outline'} />
										<Text style={{marginLeft:5, marginTop:5, fontFamily:'OpenSans-Regular'}}>Email Address</Text>
									</TouchableOpacity>
									<TouchableOpacity style={{flexDirection: 'row', marginLeft:20}} onPress={() => this.changeBox('c_phone')} >
										<Icon name={(this.state.notify_phone) ? 'checkbox' : 'md-square-outline'} />
										<Text style={{marginLeft:5, marginTop:5, fontFamily:'OpenSans-Regular'}}>Phone</Text>
									</TouchableOpacity>									
								</View>
							</View>

							<Item regular style={{backgroundColor: '#fff', marginTop: 5}}>
								<Input placeholder='Username' onChangeText={(text) => this.setState({username: text.trim()})} defaultValue={this.state.username} />
							</Item>
							<Item regular style={{backgroundColor: '#fff', marginTop: 5}}>
								<Input placeholder='Password' secureTextEntry={true} onChangeText={(text) => this.setState({password: text.trim()})} />
							</Item>
							<Item regular style={{backgroundColor: '#fff', marginTop: 5}}>
								<Input placeholder='Confirm Password' secureTextEntry={true} onChangeText={(text) => this.setState({cpassword: text.trim()})} />
							</Item>																			
						</Form>
						<H2 style={{fontFamily:'RacingSansOne-Regular', marginBottom: 5, marginTop: 15}}>Company Info</H2>	
						<Form>
							<Item regular style={{backgroundColor: '#fff', marginTop: 5}}>
								{this.renderComapnies(this.state.companies)}
							</Item>
							<Item regular style={{backgroundColor: '#fff', marginTop: 5}}>
								<Input placeholder='Address 1' editable = {false}  value={this.state.companyinfo.address} />
							</Item>
							<Item regular style={{backgroundColor: '#fff', marginTop: 5}}>
								<Input placeholder='Address 2' editable = {false}  value={this.state.companyinfo.address2} />
							</Item>													
						</Form>
						<Form style={{ flexDirection: "row" }}>
							<Item regular style={{ flex: 1, backgroundColor: '#fff', marginTop: 5, marginRight: 5 }}>
								<Input placeholder='City' editable = {false}  value={this.state.companyinfo.city}/>
							</Item>
							<Item regular style={{ flex: 1, backgroundColor: '#fff', marginTop: 5, marginRight: 5 }}>
								<Input placeholder='State' editable = {false}  value={this.state.companyinfo.state}/>
							</Item>
							<Item regular style={{ flex: 1, backgroundColor: '#fff', marginTop: 5 }}>
								<Input placeholder='Zip' editable = {false}  value={this.state.companyinfo.zip} />
							</Item>							
						</Form>
						<Form>
							<Item regular style={{backgroundColor: '#fff', marginTop: 5}}>
								<Input placeholder='Company Type'  editable = {false}  value={this.state.companyinfo.company_type} />
							</Item>
							<Item regular style={{backgroundColor: '#fff', marginTop: 5}}>
								<Input placeholder='Industry' editable = {false}  value={this.state.companyinfo.industry} />
							</Item>
						</Form>
						<H2 style={{fontFamily:'RacingSansOne-Regular', marginBottom: 5, marginTop: 15}}>Contact Info</H2>	
						<Form>							
							<Item regular style={{backgroundColor: '#fff', marginTop: 5}}>
								<Input placeholder='Phone(Office)' textContentType='telephoneNumber' dataDetectorTypes='phoneNumber' keyboardType='phone-pad' defaultValue={this.state.o_phone}  maxLength={14} onChangeText={(text) => this.onTextChange('o_phone', text) } />
							</Item>
							<Item regular style={{backgroundColor: '#fff', marginTop: 5}}>
								<Input placeholder='Fax' textContentType='telephoneNumber' dataDetectorTypes='phoneNumber' keyboardType='phone-pad' defaultValue={this.state.fax}  maxLength={14} onChangeText={(text) => this.onTextChange('fax', text)} />
							</Item>	
							<Item regular style={{backgroundColor: '#fff', marginTop: 15}}>
								<Input placeholder='Alternate Contact Person'  onChangeText={(text) => this.setState({alt_contact: text.trim()})}/>
							</Item>		
							<Item regular style={{backgroundColor: '#fff', marginTop: 5}}>
								<Input placeholder='Phone' textContentType='telephoneNumber' dataDetectorTypes='phoneNumber' keyboardType='phone-pad' defaultValue={this.state.phone}  maxLength={14} onChangeText={(text) => this.onTextChange('phone', text)} />
							</Item>							
						</Form>
						<View style={{marginTop:10, marginBottom:20}}>
<Text>
	<Text>By registering with DigContrax, you agree to comply with all applicable laws and policies and procedures established by your local excavation, public safety and damage prevention organization (e.g., USA North – see 
	</Text>
	<Text style={{color: '#046bf9', textDecorationLine: 'underline'}} onPress={ ()=> Linking.openURL('https://www.usanorth811.org') }> https://www.usanorth811.org</Text>
	<Text> ). You agree that DigContrax is providing an independent ticket tracking system that is subject to the limitations of the information provided through the DigContrax application. By accepting the terms and conditions, you agree to release DigContrax of any liabilities and/or responsibilities.
	</Text>
									
</Text>
						</View>
						<Content style={{marginTop:10}}>
							<View style={styles.radioWrap} >
								<TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', margin:5 }} onPress={this.onClick} >
								<View style={styles.outer}>
									<View style={this.state.is_agree?styles.radioActive:''}></View>							
								</View>
								<Text style={{ marginLeft:5, color:'#000', fontFamily:'OpenSans-Regular' }}>I agree to the terms and conditions</Text>
								</TouchableOpacity>
							</View>
						</Content>	
						<Button block large onPress={this._doRegister} style={{backgroundColor: "#262626", fontFamily:'OpenSans-SemiBold', marginTop: 25, height:60}}>
								<H3 style={{color:"#fff", fontFamily:'OpenSans-SemiBold' }}>REGISTER</H3>
						</Button>
						<Button block small onPress={()=> this.props.navigation.navigate('Login')} style={{backgroundColor: "#6F6F6F", fontFamily:'OpenSans-SemiBold', marginTop: 30}}>
							<Text style={{color:"#fff", fontFamily:'OpenSans-Bold' }}>LOGIN TO EXISTING ACCOUNT</Text>
						</Button>												
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

const styles = StyleSheet.create({
	radioWrap: {
		flexDirection: 'row',
		marginBottom: 5,
	},
	radioNormal: {
		borderRadius: 5,
	},
	radioActive: {
		width: 10,
		height: 10,
		backgroundColor: '#000',
	},
	outer: {
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth:2,
		width: 20,
		height: 20,
		alignSelf: 'center',
		borderColor: '#000',
		borderRadius: 5,
	}
})
