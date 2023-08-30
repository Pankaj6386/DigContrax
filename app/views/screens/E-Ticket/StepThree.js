import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions} from 'react-native';
import { Container, Form, Item, Input, Label, Icon, Picker, H3, Textarea  } from 'native-base';
import Content from '../../components/Content';

class StepThree extends Component{
	constructor(props) {
		super(props);
		this.state = { eTicketForm: this.props.dataForm, activeTab:this.props.activeTAB };
	}
	
	changeRadio = (v, x) => {
		this.setState({
			[x]: v,
		});		
		this.timeoutHandle = setTimeout(() => {
			this.props.updateOtherFields(x, v)
		}, 100);
	}
	
	onValueChange2(which, value) {
		this.setState({
			[which]: value
		});
		this.timeoutHandle = setTimeout(()=>{
			this.props.updateOtherFields(which, value)
		}, 100);
	}
	
	onClick  = () => {
		this.setState({
			is_agree: !this.state.is_agree
		});
		this.timeoutHandle = setTimeout(()=>{
			this.props.updateOtherFields('is_agree', this.state.is_agree)
		}, 100);
	}

	renderRadio(radio) {
		return (
			<View style={{flexDirection: 'row', alignContent: 'flex-end' }}>
				{
					radio.data.map((option, i) => {	
						stts = radio.wtype						
						if(this.state[stts])
						{
							currentV = this.state[stts];
						} else 
						{
							currentV = radio.cVal;
						}
						
						return (	
							<TouchableOpacity key={i} style={{flexDirection: 'row', alignItems: 'center', margin:5 }} onPress={() => this.changeRadio(option.v, radio.wtype)}>
								<Icon style={{fontSize: 30, marginRight:5, color:'#5d9d3d' }} name={(currentV == option.v ) ? 'md-radio-button-on' : 'md-radio-button-off'} />
								<Text style={{fontFamily:'OpenSans-Regular'}}>{option.k}</Text>
							</TouchableOpacity>
						)
					})
				}								
			</View>
		)
	}
	
	renderDropDown(data) {
		return (
			<Item picker>
				<Picker
					mode="dropdown"
					iosIcon={<Icon name="ios-arrow-down" />}
					style={{ width: Dimensions.get('window').width - 20 }}
					placeholder={(this.state[data.wtype])?this.state[data.wtype]:data.cVal}
					placeholderStyle={{ color: "#000" }}
					placeholderIconColor="#007aff"
               selectedValue={(this.state[data.wtype])?this.state[data.wtype]:data.cVal}
               onValueChange={this.onValueChange2.bind(this, data.wtype)}
				>
				{
					data.data.map((option, i) => {
						return (	
							<Picker.Item key={i} label={option.k} value={option.v} />
						)
					})
				}               
				</Picker>
			</Item>
		)
	}
	
	renderElement(tab)
	{
		if(tab == 'single')
		{
			return (
				<View>
					<H3 style={{fontFamily:'RacingSansOne-Regular', marginTop: 30}}>Additional Information</H3>
	            <Form>
	            {this.props.dataForm.map((key, index) => {
						if(typeof key.inType != "undefined")
						{	
							if(key.inType == 'radio')
							{
								return (
									<View key={key.wtype} style={{flexDirection: 'row', marginTop: 15, marginBottom: 5}}>
										<Label style={{fontWeight:'bold', marginTop: 5, color:'#000', flex:1}} >{key.title}</Label>
										{ this.renderRadio(key) }
									</View>
								);
							}
							else if(key.inType == 'dropdown')
							{	
								return (
									<View key={key.wtype}>
										<Label style={{marginTop: 10, fontWeight:'bold', color:'#000'}} >{key.title}</Label>
										{this.renderDropDown(key)}
									</View>
								);
							}
							else if(key.inType == 'text')
							{
								return (
									<View key='text1' style={{marginTop: 10, color:'#000'}}>
										<Text style={{color:'#000', fontFamily:'OpenSans-Regular'}}>The law requires that any person planning to conduct an excavation shall provide a Start Date and Time of no less than two working days prior to commencing excavation. The two work days start Date and Time for your excavation is displayed below.</Text>
									</View>
								);
							}
							else if(key.inType == 'textarea')
							{
								return (
									<View key={key.wtype}>
										<Label style={{marginTop: 10, fontWeight:'bold', color:'#000'}} >{key.title}</Label>
										<Textarea placeholder="Example:installing fence, landscaping, repair sprinkler, dig to plant tree etc." rowSpan={5} bordered defaultValue={this.state.eTicketForm[index][key.wtype]}  onChangeText={this.props.updateTextCB(key.wtype)} />
									</View>
								);
							}
						} else {
							return (
								<View key={key.wtype}>
								<Label style={{fontWeight:'bold', marginTop: 10, color:'#000'}} >{key.title}</Label>
								<Item regular style={{ marginTop: 5}} >
									<Input placeholder={key.title} defaultValue={this.state.eTicketForm[index][key.wtype]}  onChangeText={this.props.updateTextCB(key.wtype)} />
								</Item>
								</View>
							);
						}
	            })
	            }
				<Content style={{marginTop:10}}>
					<View style={styles.radioWrap} >
						<TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', margin:5 }} onPress={this.onClick} >
						<View style={styles.outer}>
							<View style={this.state.is_agree?styles.radioActive:''}></View>							
						</View>
						<Text style={{ marginLeft:5, color:'#000', fontFamily:'OpenSans-Regular' }}>The information entered is complete, {"\n"} accurate and correct</Text>
						</TouchableOpacity>
					</View>
				</Content>		
	            </Form>
				<View style={{margin:20}}>
					<Text style={{fontSize: 15,textAlign: 'center',color:'#aaadad'}}>Step 3 of 3</Text>
				</View>
				</View>

			);
		}
		else
		{
			return (
				<View>
					<H3 style={{fontFamily:'RacingSansOne-Regular', marginTop: 30}}>Work Information</H3>
	            <Form>
	            {this.props.dataForm.map((key, index) => {
	            		if(key.multiple)
	            		{
	            			return(
	            				<View key={index + 'multiple'}>
		            			<View style={{ flexDirection: "row" }}>
		            			{
		            			key.fields.map((option, i) => {
									return (								
									<Label key={option.title + 'label'} style={{flex: 1, fontWeight:'bold', color:'#000', marginTop: 10 }}>{option.title}</Label>
									)
								})
		            			}
								</View>
								<View style={{ flexDirection: "row" }}>
								{
									key.fields.map((option, i) => {
										if(option.wtype == 'phone_m' || option.wtype == 'phone_i')
										{
											return (
												<Item key={option.title} regular style={{ flex: 1, backgroundColor: '#fff', marginTop: 5, marginRight: 5 }}>
													<Input keyboardType='phone-pad' placeholder={option.title} defaultValue={option[option.wtype]} onChangeText={this.props.updateTextCB(option.wtype)} />
												</Item>
											);
										}
										else
										{
											return (								
												<Item key={option.title} regular style={{ flex: 1, backgroundColor: '#fff', marginTop: 5, marginRight: 5 }}>
													<Input placeholder={option.title} defaultValue={option[option.wtype]} onChangeText={this.props.updateTextCB(option.wtype)} />
												</Item>
											)
										}										
									})
								}		
								</View>
								</View>
							);
	            		}
						else if(typeof key.inType != "undefined")
						{	
							if(key.inType == 'radio')
							{
								return (
									<View key={key.wtype} style={{flexDirection: 'row', marginTop: 15, marginBottom: 5}}>
										<Label style={{fontWeight:'bold', marginTop: 5, color:'#000', flex:1}} >{key.title}</Label>
										{ this.renderRadio(key) }
									</View>
								);
							}
							else if(key.inType == 'dropdown')
							{	
								return (
									<View key={key.wtype}>
										<Label style={{marginTop: 10, fontWeight:'bold', color:'#000'}} >{key.title}</Label>
										{this.renderDropDown(key)}
									</View>
								);
							}
							else if(key.inType == 'text')
							{
								return (
									<View key='text1' style={{marginTop: 10, color:'#000'}}>
										<Text style={{color:'#000', fontFamily:'OpenSans-Regular'}}>The law requires that any person planning to conduct an excavation shall provide a Start Date and Time of no less than two working days prior to commencing excavation. The two work days start Date and Time for your excavation is displayed below.</Text>
									</View>
								);
							}
							else if(key.inType == 'textarea')
							{
								return (
									<View key={key.wtype}>
										<Label style={{marginTop: 10, fontWeight:'bold', color:'#000'}} >{key.title}</Label>
										<Textarea placeholder="Example:installing fence, landscaping, repair sprinkler, dig to plant tree etc." rowSpan={5} bordered defaultValue={this.state.eTicketForm[index][key.wtype]}  onChangeText={this.props.updateTextCB(key.wtype)} />
									</View>
								);
							}
						} else {
							return (
								<View key={key.wtype}>
								<Label style={{fontWeight:'bold', marginTop: 10, color:'#000'}} >{key.title}</Label>
								<Item regular style={{ marginTop: 5}} >
									<Input placeholder={key.title} defaultValue={this.state.eTicketForm[index][key.wtype]}  onChangeText={this.props.updateTextCB(key.wtype)} />
								</Item>
								</View>
							);
						}
	            })
	            }					
	            </Form>
				<View style={{margin:20}}>
					<Text style={{fontSize: 15,textAlign: 'center',color:'#aaadad'}}>Step 3 of 4</Text>
				</View>
				</View>

			);
		}		
	}

	render() {
		const { activeTab } = this.state;
		return(
			this.renderElement(activeTab)
		)
	}
}
export default StepThree;

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