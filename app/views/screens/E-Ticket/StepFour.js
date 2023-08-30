import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Modal, TouchableHighlight, Platform, Dimensions} from 'react-native';
import { Container, Form, Item, Input, Label, Icon, Picker, Textarea, H2, H3, Body   } from 'native-base';
import { image } from 'assets';
let membersrow =
[
	{  code:'SWGHPT', description: 'SOUTHWEST GAS', added:'POLYGON' },
	{  code:'NENGSO', description: 'NV ENERGY', added:'POLYGON' },
	{  code:'COXLVE', description: 'COX COMM.', added:'POLYGON' },
	{  code:'CENTE2', description: 'CENTURY LINK', added:'POLYGON' },
]

let membersrowdetail =
{
	SWGHPT: { title: 'SOUTHWEST GAS', detail:[{'title':'CODE','value':'SWGHPT'}, {'title':'MAIN CONTACT #','value':'(702) 555-5555'}, , {'title':'VACUUM CONTACT #','value':'(702) 555-5555'}, {'title':'EMERGENCY CONTACT #','value':'(702) 555-5555'}] },
	NENGSO: { title: 'NV ENERGY', detail:[{'title':'CODE','value':'NENGSO'}, {'title':'MAIN CONTACT #','value':'(702) 555-5555'}, , {'title':'VACUUM CONTACT #','value':'(702) 555-5555'}, {'title':'EMERGENCY CONTACT #','value':'(702) 555-5555'}] },
	COXLVE: { title: 'COX COMM.', detail:[{'title':'CODE','value':'COXLVE'}, {'title':'MAIN CONTACT #','value':'(702) 555-5555'}, , {'title':'VACUUM CONTACT #','value':'(702) 555-5555'}, {'title':'EMERGENCY CONTACT #','value':'(702) 555-5555'}] },
	CENTE2: { title: 'CENTURY LINK', detail:[{'title':'CODE','value':'CENTE2'}, {'title':'MAIN CONTACT #','value':'(702) 555-5555'}, , {'title':'VACUUM CONTACT #','value':'(702) 555-5555'}, {'title':'EMERGENCY CONTACT #','value':'(702) 555-5555'}] },	
}

class StepFour extends Component{
	constructor(props) {
		super(props);
		this.state = { eTicketForm: this.props.dataForm, modalVisible: false, wCode:''};
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
	
	renderModal()
	{
		kkey = this.state.wCode;
		if(typeof membersrowdetail[kkey] != 'undefined')
		{
			rowDetail = membersrowdetail[kkey];
		} else {
			rowDetail = membersrowdetail['SWGHPT'];
		}
		return(
			<View style={styles.ModalInsideView}>
				<View style={{backgroundColor:'#febf26', padding: 5, borderTopLeftRadius:10, borderTopRightRadius:10, justifyContent: 'center', alignItems: 'center'}}>
					<H2 style={{fontFamily:'RacingSansOne-Regular' }}>{rowDetail.title}</H2>
				</View>
				<View style={{padding:15}} >
				{
					rowDetail.detail.map((key, index) => {
						return(
							<View style={{marginTop:10}} key={index}>
								<Text style={{fontFamily:'OpenSans-Bold'}} >{key.title}</Text>
								<Text>{key.value}</Text>
							</View>
						)
					})
				}
				</View>					
				<TouchableOpacity style={{position:'absolute', width:'100%', height:40, bottom:0, borderTopColor: '#ccc',  borderTopWidth: 1,  justifyContent: 'flex-end', alignItems: 'center' }} onPress={() => {	this.setModalVisible(!this.state.modalVisible, ''); }}>
					<Text style={{ fontSize:20, marginBottom:5, alignItems: 'center', fontFamily:'OpenSans-Bold'}} >Ok</Text>
				</TouchableOpacity>
			</View>			
		);
	}
	
	setModalVisible(visible, code) {
		this.setState({modalVisible: visible, wCode:code});
	}

	
	render() {
		return (
        <View>
				<H3 style={{fontFamily:'RacingSansOne-Regular', marginTop: 30}}>Additional Work Information</H3>
            <Form>
            {this.props.dataForm.map((key, index) => {
					if(typeof key.inType != "undefined")
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
								<View key={key.wtype}>
									<Label style={{marginTop: 10, color:'#000'}} >{key.title}</Label>
									{this.renderDropDown(key)}
								</View>
							);
						} 
						else if(key.inType == 'textarea')
						{
							return (
								<View key={key.wtype}>
									<Label style={{marginTop: 10, color:'#000'}} >{key.title}</Label>
									<Textarea rowSpan={5} bordered defaultValue={this.state.eTicketForm[index][key.wtype]}  onChangeText={this.props.updateTextCB(key.wtype)} />
								</View>
							);
						}
					} else {
						if(key.wtype == 'work_order')
						{
							return (								
								<View key={key.wtype}>
								<Label style={{marginTop: 10, color:'#000'}} >{key.title}</Label>
								<Item regular style={{ marginTop: 5}} >
									<Input keyboardType='phone-pad' placeholder={key.title} defaultValue={this.state.eTicketForm[index][key.wtype]}  onChangeText={this.props.updateTextCB(key.wtype)} />
								</Item>
								</View>
							);
						}
						else
						{
							return (
								<View key={key.wtype}>
								<Label style={{marginTop: 10, color:'#000'}} >{key.title}</Label>
								<Item regular style={{ marginTop: 5}} >
									<Input placeholder={key.title} defaultValue={this.state.eTicketForm[index][key.wtype]}  onChangeText={this.props.updateTextCB(key.wtype)} />
								</Item>
								</View>
							);
						}						
					}
            })
            }				
            </Form>
				<H3 style={{fontFamily:'RacingSansOne-Regular', marginTop: 30}}>Sent to</H3>			
				<View>
					<View style={{ flexDirection: 'row', backgroundColor:'#333', padding:15 }}>
						<View style={{ width:100 }} >
							<Text style={{fontSize: 18, textAlign: 'left', color:'#fff', fontFamily:'OpenSans-Bold'}}>CODE</Text>
						</View>
						<View style={{ flex: 1, marginRight:2, alignSelf:'flex-start' }} >
							<Text style={{fontSize: 18, textAlign: 'left', color:'#fff', fontFamily:'OpenSans-Bold'}}>UTILITY</Text>
						</View>					  
					</View>					
					{
						membersrow.map((key, index) => {
							return (
								<Body style={{ flexDirection: 'row', backgroundColor:(index%2 ==0)?'#D2D2D2':'#f3f3f3', paddingTop:2,paddingLeft:12,paddingRight:12,paddingBottom:2 }} key={key.code}>
									<View style={{  width:100 }} >
										<Text style={{fontSize: 15, textAlign: 'left', fontFamily:'OpenSans-Bold' }}>{key.code}</Text>
									</View>
									<View style={{ flex: 1 }} >
										<Text style={{fontSize: 15, textAlign: 'left', fontFamily:'OpenSans-Regular' }}>{key.description}</Text>
									</View>
									<View style={{ flex: 1, alignSelf:'flex-end' }} >
										<TouchableOpacity onPress={()=> this.setModalVisible(!this.state.modalVisible, key.code)} ><Image source={image.info} style={{alignSelf:'flex-end', transform: [{ scale: 0.70 }]}} /></TouchableOpacity>
									</View>
								</Body>
							);
						})
					}
					<View style={styles.MainContainer}>
						<Modal
						 animationType="slide"
						 transparent={true}
						 visible={this.state.modalVisible}
							onRequestClose={() => { }}
						>
						 <View style={{ flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
							{this.renderModal()}							
						 </View>
					  </Modal>
					</View>			
				</View>
				<View style={{margin:20}}>
					<Text style={{fontSize: 15,textAlign: 'center',color:'#aaadad'}}>Step 4 of 4</Text>
				</View>
			</View>
		);
	}
}
export default StepFour;
const styles = StyleSheet.create({
	MainContainer :{    
		flex:1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: (Platform.OS == 'ios') ? 20 : 0 
	},
	ModalInsideView:{	 
		//justifyContent: 'center',
		//alignItems: 'center', 
		backgroundColor : "#fff", 
		height: 300 ,
		width: '90%',
		borderRadius:10,
		//borderWidth: 1,
		borderColor: '#ccc',
		borderStyle: 'solid',
		elevation: 20,
		flexDirection: 'column'		
	},
});