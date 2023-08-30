import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Dimensions} from 'react-native';
import { Container, Form, Item, Input, Label, Button, H3, Textarea, Picker, Icon } from 'native-base';
import { image, _retrieveUser, config, Loader, _showErrorMessage, _showSuccessMessage, _getallticketstatus } from 'assets';

class StepTwo extends Component{
	constructor(props) {
		super(props);
		this.state = { eTicketForm: this.props.dataForm, activeTab:this.props.activeTAB, counties: this.props.countylist, totalpage:4, cornerside:config.cornerSide['corner'], locationtitle:'Corner' };
	}

	/*componentWillReceiveProps(nextProps) {
		if(nextProps.activeTAB != '')
		{
			wField = nextProps.dataForm[nextProps.activeTAB][0]
			if(wField.cVal == 'CA')
			{
				this.setState({
					counties: config.cacounties
				});
			}
		}
	}*/

	digSiteType = (tab) => {
		this.setState({
			activeTab:tab,
			totalpage:(tab == 'single')?3:4
		});
		this.timeoutHandle = setTimeout(()=>{
			this.props.updateOtherFields('activeTab', tab)
		}, 100);
	}

	onValueChange2(which, value) {
		this.setState({
			[which]: value
		});
		if(which == 'dig_state_s' || which == 'dig_state_m' || which == 'dig_state_i')
		{
			this.setState({
				counties: (value == 'NV')?config.nvcounties:config.cacounties,
				placeHolder: (value == 'NV')?'Clark':'Alameda',
				dig_state_s: value,
				dig_state_m: value,
				dig_state_i: value,
			});
		}

		if(which == 'location_type')
		{
			this.setState({
				cornerside: (value == 'Intersection')?config.cornerSide['corner']:config.cornerSide['side'],
				locationtitle:(value == 'Intersection')?'Corner':'Side'
			});
		}
		this.timeoutHandle = setTimeout(()=>{
			this.props.updateOtherFields(which, value)
		}, 100);
	}

	changeRadio = (v, x) => {
		this.setState({
			[x]: v,
		});
		this.timeoutHandle = setTimeout(() => {
			this.props.updateOtherFields(x, v)
		}, 100);
	}

	renderDropDown(data, widths) {
		pickerItems = data.data
		title = data.title
		placHolder = (this.state[data.wtype])?this.state[data.wtype]:data.cVal
		if(data.wtype == 'dig_county_s' || data.wtype == 'dig_county_m' || data.wtype == 'dig_county_i')
		{
			pickerItems = this.state.counties
			placHolder = (this.state.placeHolder)?this.state.placeHolder:data.cVal
		}
		else if(data.wtype == 'corner_side')
		{
			pickerItems = this.state.cornerside
			title = this.state.locationtitle
			placHolder = (this.state[data.wtype])?this.state[data.wtype]:data.cVal
		}

		return (
			<View key={data.wtype}>
			<Label style={{marginTop: 10, color:'#000', fontWeight:'bold'}} >{title}</Label>
			<Item picker>
				<Picker
					mode="dropdown"
					iosIcon={<Icon name="ios-arrow-down" />}
					style={{ width: (widths)?widths:Dimensions.get('window').width - 20 }}
					placeholder={placHolder}
					placeholderStyle={{ color: "#000" }}
					placeholderIconColor="#007aff"
               selectedValue={(this.state[data.wtype])?this.state[data.wtype]:data.cVal}
               onValueChange={this.onValueChange2.bind(this, data.wtype)}
				>
				{
					pickerItems.map((option, i) => {
						return (
							<Picker.Item key={i} label={option.k} value={option.v} />
						)
					})
				}
				</Picker>
			</Item>
			</View>
		)
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

	renderElement(tab)
	{
		if(tab == '')
		{
			return(<View></View>);
		}
		else
		{
			return(
				<Form>
					<Label style={{marginTop: 10, marginBottom: 10, color:'#000', fontWeight:'bold'}} >Digsite Location</Label>
					{/*<Button block style={{backgroundColor: "#6F6F6F"}} >
						<Text style={{color:"#fff"}}>USE GPS TO HELP DETERMINE LOCATION</Text>
					</Button>*/}
					{
					this.props.dataForm[tab].map((key, index) => {
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
										return (
											<Item key={option.title} regular style={{ flex: 1, backgroundColor: '#fff', marginTop: 5, marginRight: 5 }}>
												<Input placeholder={option.title} defaultValue={option[option.wtype]} onChangeText={this.props.updateTextCB(option.wtype)} />
											</Item>
										)
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
										<Label style={{marginTop: 5, color:'#000', flex:1}} >{key.title}</Label>
										{ this.renderRadio(key) }
									</View>
								);
							}
							else if(key.inType == 'dropdown')
							{
								return (
									this.renderDropDown(key)
								);
							} else
							{
								return (
									<View key={key.wtype}>
										<Label style={{marginTop: 10, color:'#000', fontWeight:'bold'}} >{key.title}</Label>
										<Textarea placeholder="Describe Location" rowSpan={5} bordered defaultValue={this.state.eTicketForm[tab][index][key.wtype]}  onChangeText={this.props.updateTextCB(key.wtype)} />
									</View>
								);
							}
						}
						else
						{
							return (
								<View key={key.wtype}>
								<Label style={{fontWeight:'bold', marginTop: 10, color:'#000'}} >{key.title}</Label>
								<Item regular style={{ marginTop: 5}} >
									<Input placeholder={key.title} defaultValue={this.state.eTicketForm[tab][index][key.wtype]}  onChangeText={this.props.updateTextCB(key.wtype)} />
								</Item>
								</View>
							);
						}
					})
					}
		        </Form>
	        );
		}
	}

	render() {
		const { activeTab } = this.state;
		return (
			<View>
				<H3 style={{fontFamily:'RacingSansOne-Regular', marginTop: 30}}>Digsite Information</H3>
				<Label style={{marginTop: 10, marginBottom: 10, color:'#000', fontWeight:'bold'}} >Digsite Type</Label>
				<View style={{ flexDirection: "row" }}>
					<TouchableOpacity onPress={() => this.digSiteType('single')} style={(activeTab == 'single') ? styles.reqTouchActive : styles.reqTouch} >
						<View style={styles.reqTouchV} >
							<Image source={image.singleAddress} style={{width:40}} resizeMode='contain' />
						</View>
						<Text style={styles.reqText}>Single</Text>
						<Text style={styles.reqText}>Address</Text>
						<Text style={styles.smalltext}>(e.g. residential</Text>
						<Text style={styles.smalltext}>address)</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => this.digSiteType('multi')} style={(activeTab == 'multi') ? styles.reqTouchActive : styles.reqTouch} >
						<View style={styles.reqTouchV}>
							<Image source={image.multiLocation} style={{width:40}}  resizeMode='contain' />
						</View>
						<Text style={styles.reqText}>Multi-Location</Text>
						<Text style={styles.smalltext}>(e.g. multiple</Text>
						<Text style={styles.smalltext}>addresses/</Text>
						<Text style={styles.smalltext}>non-address</Text>
						<Text style={styles.smalltext}>location)</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => this.digSiteType('inter')} style={(activeTab == 'inter') ? styles.reqTouchLastActive : styles.reqTouchLast} >
						<View style={styles.reqTouchV}>
							<Image source={image.interSection} style={{width:40}} resizeMode='contain' />
						</View>
						<Text style={styles.reqTextLast}>Intersection</Text>
						<Text style={styles.reqTextLasts}>(e.g. Roadway/</Text>
						<Text style={styles.reqTextLasts}>intersection/</Text>
						<Text style={styles.reqTextLasts}>between</Text>
						<Text style={styles.reqTextLasts}>intersections)</Text>
					</TouchableOpacity>
				</View>
            	{ this.renderElement(activeTab) }
			<View style={{margin:20}}>
				<Text style={{fontSize: 15,textAlign: 'center',color:'#aaadad'}}>Step 2 of {this.state.totalpage}</Text>
			</View>
			</View>

		);
	}
}
export default StepTwo;

const styles = StyleSheet.create({
	reqTouch:{
		flex: 1, backgroundColor:'#9C9C9C', marginRight:15, height:150
	},
	reqTouchActive:{
		flex: 1, backgroundColor:'#fdbe25', marginRight:15, height:150
	},
	reqTouchLast:{
		flex: 1, backgroundColor:'#9C9C9C', height:150
	},
	reqTouchLastActive:{
		flex: 1, backgroundColor:'#fdbe25', height:150
	},
	reqTouchV:{
		alignSelf:'center', marginTop:5
	},
	reqText:{
		fontFamily:'OpenSans-Bold', alignSelf:'center'
	},
	reqTextLast:{
		fontFamily:'OpenSans-Bold', alignSelf:'center'
	},
	reqTextLasts:{
		fontFamily:'OpenSans-Regular', alignSelf:'center', fontSize: 10
	},
	smalltext:{
		fontFamily:'OpenSans-Regular', alignSelf:'center', fontSize: 10
	}
});
