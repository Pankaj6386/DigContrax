import React, { Component } from 'react';
import {  SafeAreaView, StyleSheet,  View , Image, Linking, ScrollView, TouchableOpacity, Dimensions }  from 'react-native';
import { Container, H1, H2, H3, Text , Button, Form, Item, Input, Label, Picker, Icon } from "native-base";
import { image, config, _storeUser, _retrieveUser, validate, _showErrorMessage, Loader, _showSuccessMessage, _phoneFormat, _getcompanies} from 'assets';
import CustomeHeader from '../CustomeHeader';
import Content from '../../components/Content';
import {withTranslation} from 'react-i18next';

let formsvalue = [
	{  field: 'name', title:'Name', required: true },
	{  field: 'email', title:'Email', required: false },
	{  field: 'c_phone', title:'Phone(Cell)', required: false },
	{  field: 'username', title:'Username', required: true },
	{  field: 'communicate_method', title:'', required: false },
	/*{  field: 'company_id', title:'Company Name', required: false },*/

	/*{  field: 'cname', title:'Company Name', required: false },
	{  field: 'address', title:'Address 1', required: false },
	{  field: 'address2', title:'Address 2', required: false },
	{  field: 'city', title:'City', required: false },
	{  field: 'state', title:'State', required: false },
	{  field: 'zip', title:'Zip', required: false },
	{  field: 'company_type', title:'Company Type', required: false },
	{  field: 'industry', title:'Industry', required: false },*/

	{  field: 'o_phone', title:'Phone(Office)', required: true },
	{  field: 'fax', title:'Fax', required: false },
	{  field: 'alt_contact', title:'Alternate Contact Person', required: true },
	{  field: 'phone', title:'Alternate Phone', required: true }
]

 class Account extends Component {
	constructor(props){
		super(props)
		this.state = {
			isloading: false,
			c_phone:'',
			o_phone:'',
			fax:'',
			phone:'',
			//state:'NV',
			companies:[],
			company_id:0,
			companyinfo:{'company_id':0, 'name':'', 'address':'', 'address2':'', 'city':'', 'state':'', 'zip':'', 'company_type':'', 'industry':''},
		};
	}

	componentDidMount(){
		this.mounted = true;
		this._getUser();
	}

	componentWillUnmount(){
		this.mounted = false;
	}

	_getUser()
	{
		_retrieveUser().then((user) => {
			if (user !== null) {
				var usr = JSON.parse(user)
				if(usr.isLoggedIn)
				{
					this._getUserInfo(usr.userInfo.token)
				}
			}
		});
	}

	_getUserInfo(token){
		if(this.mounted) {
			this.setState({
				isloading: true,
			});
		}
		fetch(config.BASE_URL+'account_information?api_token='+token,{
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + token,
			}
		})
		.then((response) => response.json())
		.then((res) => {
			if(this.mounted) {
				console.log(res);
				if(res.status == 1)
				{
					this.setState({
						isloading: false,
					});
					var information = res.info;
					formsvalue.forEach((option, i) => {
						if(information[option.field] != "undefined")
						{

							this.setState({ [option.field]: information[option.field] })
						} else {
							this.setState({ [option.field]: '' })
						}
					});

					/*Fetch Companies LIST*/
					var self = this;
					var comp_info = res.info.company;
					_getcompanies(config.BASE_URL+'all-companies', function(res){
						if(res.status == 1)
						{
							self.setState({
								companies:res.data,
								company_id:information['company_id'],
							});
							self.onCompanyChange(information['company_id'], comp_info);
						}
					})
				}
			}
		}).catch(err => {
			_showErrorMessage('Something went wrong, Try again later.')
			if(this.mounted) {
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
				var res = validate(option.field, this.state[option.field], option.title);
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

		if(msg != '')
		{
			_showErrorMessage(msg)
		} else {
			//console.warn(data)
			this._updateAccount(data);
		}
	}

	_updateAccount(data){
		if(this.mounted) {
			this.setState({
				isloading: true,
			});
		}
		fetch(config.BASE_URL+'update_account_information?api_token='+config.currentToken,{
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
					//console.warn(res.info.communicate_method)
					this.setState({
						communicate_method: res.info.communicate_method
					})
					/*var information = res.info;
					formsvalue.forEach((option, i) => {
						if(information[option.field] != "undefined")
						{
							this.setState({ [option.field]: information[option.field] })
						} else {
							this.setState({ [option.field]: '' })
						}
					});*/
					_showSuccessMessage('Information updated successfully');
				}
				else if(res.status == 0)
				{
					_showErrorMessage(res.message)
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

	onTextChange(wState, text) {
		var number = _phoneFormat(text);
		this.setState({
			[wState]: number
		});
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

	onCompanyChange(value: string, companyinfos) {
		this.setState({
			company_id:value,
			companyinfo: companyinfos
		});
	}
	/*Old function 
	onCompanyChange(value: string) {
		companyinfos = []
		this.state.companies.map((comp) => {
		    if(comp.id == value)
		    {
		    	companyinfos = {
					'company_id':comp.id,
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
			company_id:value,
			companyinfo: companyinfos
		});
	}*/

	renderComapnies(data) {
		return (
			<Input placeholder='Comapny Name' editable = {false}  value={this.state.companyinfo.name} />
		)
		/*var {height, width} = Dimensions.get('window');
		return (
			<Item picker>
				<Picker
					mode="dropdown"
					iosIcon={<Icon name="ios-arrow-down" />}
					style={{ width: width-20 }}
					placeholder={this.state.companyinfo.name}
					placeholderStyle={{ color: "#000" }}
					placeholderIconColor="#007aff"
               		selectedValue={this.state.company_id}
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
		)*/
	}

	changeBox = (v) => {
		if(this.state.email != '' && v == 'email')
		{
			this.setState({
				communicate_method: v
			});
		}
		else if(this.state.c_phone != '' && v == 'phone')
		{
			this.setState({
				communicate_method: v
			});
		}
	}

	render() {
		return (
			<SafeAreaView style={{flex: 1, backgroundColor: '#6f6f6f'}}>
			<Container>
				<CustomeHeader {...this.props}/>
				<Content>
				<View style={{margin:10}}>
					<H1 style={{fontFamily:'RacingSansOne-Regular', marginTop: 20}}>{this.props.t('ACCOUNT SETTINGS')}</H1>
					<H3 style={{fontFamily:'RacingSansOne-Regular', marginTop: 10}}>{this.props.t('User Information')}</H3>
					<Form>
						<Label style={{marginTop: 10}}>{this.props.t('Username')}</Label>
						<Item disabled regular style={{backgroundColor: '#fff', marginTop: 5}}>
							<Input disabled defaultValue={this.state.username} />
						</Item>
						<Label style={{marginTop: 10}}>{this.props.t('Name')}</Label>
						<Item regular style={{backgroundColor: '#fff', marginTop: 5}}>
							<Input defaultValue={this.state.name}  onChangeText={(text) => this.setState({name: text.trim()})}/>
						</Item>
						<Label style={{marginTop: 10}}>{this.props.t('Email')}</Label>
						<Item regular style={{backgroundColor: '#fff', marginTop: 5}}>
							<Input defaultValue={this.state.email} onChangeText={(text) => this.setState({email: text.trim()})} />
						</Item>
						<Label style={{marginTop: 10}}>{this.props.t('Phone(Cell)')}</Label>
						<Item regular style={{backgroundColor: '#fff', marginTop: 5}}>
							<Input textContentType='telephoneNumber' dataDetectorTypes='phoneNumber' keyboardType='phone-pad' defaultValue={this.state.c_phone}  maxLength={14} onChangeText={(text) => this.onTextChange('c_phone', text) } />
						</Item>
					</Form>
					<View style={{marginTop:10, marginBottom:20}}>
						<Text>{this.props.t('Your preferred method of communication. This is where system notifications will be sent.')}</Text>
						<View style={{ flex: 1, marginTop:5, marginBottom:5, flexDirection: 'row' }}>
							<TouchableOpacity style={{flexDirection: 'row'}} onPress={() => this.changeBox('email')} >
								{
									(Platform.OS === 'ios') ? <Icon name={(this.state.communicate_method == 'email') ? 'checkbox' : 'md-square-outline'} /> : <Icon type="FontAwesome" name={(this.state.communicate_method == 'email') ? 'check-square' : 'square'} />
								
								}
								<Text style={{marginLeft:5, marginTop:5, fontFamily:'OpenSans-Regular'}}>{this.props.t('Email Address')}</Text>
							</TouchableOpacity>
							<TouchableOpacity style={{flexDirection: 'row', marginLeft:20}} onPress={() => this.changeBox('phone')} >
								{
									(Platform.OS === 'ios') ? <Icon name={(this.state.communicate_method == 'phone') ? 'checkbox' : 'md-square-outline'} /> : <Icon type="FontAwesome" name={(this.state.communicate_method == 'phone') ? 'check-square' : 'square'} /> 
								}
								<Text style={{marginLeft:5, marginTop:5, fontFamily:'OpenSans-Regular'}}>{this.props.t('Phone')}</Text>
							</TouchableOpacity>
						</View>
					</View>
					<H3 style={{fontFamily:'RacingSansOne-Regular', marginBottom: 15, marginTop: 15}}>{this.props.t('Company Information')}</H3>
					<Form>
						<Label style={{marginTop: 10}}>{this.props.t('Company Name')}</Label>
						<Item regular style={{backgroundColor: '#fff', marginTop: 5}}>
							{this.renderComapnies(this.state.companies)}
						</Item>
						<Label style={{marginTop: 10}}>{this.props.t('Address 1')}</Label>
						<Item regular style={{backgroundColor: '#fff', marginTop: 5}}>
							<Input placeholder='Address 1' editable = {false}  value={this.state.companyinfo.address1} />
						</Item>
						<Label style={{marginTop: 10}}>{this.props.t('Address 2')}</Label>
						<Item regular style={{backgroundColor: '#fff', marginTop: 5}}>
							<Input placeholder='Address 2' editable = {false}  value={this.state.companyinfo.address2} />
						</Item>
					</Form>
					<Form style={{ flexDirection: "row" }}>
						<Label style={{flex: 1, marginTop: 10}}>{this.props.t('City')}</Label>
						<Label style={{flex: 1, marginTop: 10}}>{this.props.t('State')}</Label>
						<Label style={{flex: 1, marginTop: 10}}>{this.props.t('Zip')}</Label>

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
						<Label style={{marginTop: 10}}>{this.props.t('Company Type')}</Label>
						<Item regular style={{backgroundColor: '#fff', marginTop: 5}}>
							<Input placeholder='Company Type'  editable = {false}  value={this.state.companyinfo.type} />
						</Item>
						<Label style={{marginTop: 10}}>{this.props.t('Industry')}</Label>
						<Item regular style={{backgroundColor: '#fff', marginTop: 5}}>
							<Input placeholder='Industry' editable = {false}  value={this.state.companyinfo.industry} />
						</Item>
					</Form>
					<H3 style={{fontFamily:'RacingSansOne-Regular', marginBottom: 15, marginTop: 15}}>{this.props.t('Contact Information')}</H3>
					<Form>
						<Label style={{marginTop: 10}}>{this.props.t('Phone(Office)')}</Label>
						<Item regular style={{backgroundColor: '#fff', marginTop: 5}}>
							<Input textContentType='telephoneNumber' dataDetectorTypes='phoneNumber' keyboardType='phone-pad' defaultValue={this.state.o_phone}  maxLength={14} onChangeText={(text) => this.onTextChange('o_phone', text) } />
						</Item>
						<Label style={{marginTop: 10}}>{this.props.t('Fax')}</Label>
						<Item regular style={{backgroundColor: '#fff', marginTop: 5}}>
							<Input textContentType='telephoneNumber' dataDetectorTypes='phoneNumber' keyboardType='phone-pad' defaultValue={this.state.fax}  maxLength={14} onChangeText={(text) => this.onTextChange('fax', text)} />
						</Item>
						<Label style={{marginTop: 10}}>{this.props.t('Alternate Contact Person')}</Label>
						<Item regular style={{backgroundColor: '#fff', marginTop: 15}}>
							<Input defaultValue={this.state.alt_contact}  onChangeText={(text) => this.setState({alt_contact: text.trim()})}/>
						</Item>
						<Label style={{marginTop: 10}}>{this.props.t('Alternate Phone')}</Label>
						<Item regular style={{backgroundColor: '#fff', marginTop: 5}}>
							<Input textContentType='telephoneNumber' dataDetectorTypes='phoneNumber' keyboardType='phone-pad' defaultValue={this.state.phone}  maxLength={14} onChangeText={(text) => this.onTextChange('phone', text)} />
						</Item>
					</Form>

					<Button block large onPress={this._doRegister} style={{backgroundColor: "#FFBC42", marginTop: 25}}>
							<H3 style={{color:"#000", fontFamily:'OpenSans-SemiBold' }}>{this.props.t('SAVE CHANGES')}</H3>
					</Button>
					<Button block small onPress={()=> this.props.navigation.navigate('Manage')} style={{backgroundColor: "#E05439", marginTop: 25}}>
							<Text style={{color:"#fff", fontFamily:'OpenSans-SemiBold' }}>{this.props.t('CANCEL')}</Text>
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

export default withTranslation()(Account);

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
