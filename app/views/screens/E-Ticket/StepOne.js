import React, {Component} from 'react';
import { Text, View, ScrollView, Dimensions } from 'react-native';
import { Form, Item, Input, Label, Picker, Icon, H3 } from 'native-base';
import { config, Loader, _phoneFormat} from 'assets';
 
class StepOne extends Component{
	constructor(props) {
		super(props);
		this.state = { eTicketForm: this.props.dataForm };
		this.isPhnWritten = false;
		this.isFxWritten = false;
	}
	
	componentWillReceiveProps(nextProps) {
		/*if(!this.isPhnWritten)
		{
			if(nextProps.dataForm[9].phone != null)
			{
				this.setState({
					phone: nextProps.dataForm[9].phone
				});
				this.isPhnWritten = true;
			}			
		}	*/		
	}
	
	onValueChange2(which, value) {
		this.setState({
			[which]: value
		});
		this.timeoutHandle = setTimeout(()=>{
			this.props.updateOtherFields(which, value)
		}, 100);
	}
	
	onTextChange = fieldName => text => {
		number = _phoneFormat(text);		
		this.setState({
			[fieldName]: number
		});
		this.timeoutHandle = setTimeout(()=>{
			this.props.updateOtherFields(fieldName, number)
		}, 100);
  	}	
	
	componentDidMount(){	
		this.mounted = true;		
	}
	
	componentWillUnmount(){
		this.mounted = false;		
	}
	
	renderDropDown(data, widths) {
		return (
			<Item picker>
				<Picker
					mode="dropdown"
					iosIcon={<Icon name="ios-arrow-down" />}
					style={{ width: (widths)?widths:Dimensions.get('window').width - 20 }}
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
	
	render() {		
        return (
            <View>
				<H3 style={{fontFamily:'RacingSansOne-Regular', marginTop: 30}}>Excavator Information</H3>
            <Form>
            {this.state.eTicketForm.map((key, index) => {
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
									if(option.wtype == 'state')
									{
										return (
											<Item key={option.title} regular style={{ flex: 1, backgroundColor: '#fff', marginTop: 5, marginRight: 5 }}>
												{this.renderDropDown(option, 82)}
											</Item>
										);
									}
									else if(option.wtype == 'phone')
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
						if(key.inType == 'dropdown')
						{	
							return (
								<View key={key.wtype}>
									<Label style={{marginTop: 10, color:'#000', fontWeight:'bold'}} >{key.title}</Label>
									{this.renderDropDown(key)}
								</View>
							);
						}
					} 					
					else 
					{
						return (		
							<View key={key.wtype}>
							<Label style={{marginTop: 10, color:'#000', fontWeight:'bold'}} >{key.title}</Label>
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
				<Text style={{fontSize: 15,textAlign: 'center',color:'#aaadad'}}>Step 1 of 4</Text>
			</View>			
			</View>

		);
  }
}
export default StepOne;
