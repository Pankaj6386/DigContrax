import React, {Component} from 'react';
import { Text, View, SafeAreaView, Image } from 'react-native';
import { Form, Item, Input, Label, Picker, Icon, H1, Container } from 'native-base';
import { config, Loader, _phoneFormat, image} from 'assets';
import CustomeHeader from '../CustomeHeader';
import { StackActions, CommonActions } from '@react-navigation/native';
import { DrawerActions } from 'react-navigation-drawer';
import Content from '../../components/Content';
class Eticketsuccess extends Component{
	constructor(props) {
		super(props);
		this.state ={ timer: 5}
	}
	componentDidMount(){	
		this.mounted = true;
		this.interval = setInterval(
			() => this.setState((prevState)=> ({ timer: prevState.timer - 1 })),
			1000
		);
	}
	
	componentDidUpdate(){
		if(this.state.timer === 1){ 
			clearInterval(this.interval);
			const resetAction = StackActions.reset({
				index: 0, 
				key: null,
				actions: [
					NavigationActions.navigate({ routeName: 'Dashboard' })
				],
			});
			this.props.navigation.dispatch(resetAction);		
		}
	}
	
	componentWillUnmount(){
		this.mounted = false;		
	}
			
	render() {
		return (
			<SafeAreaView style={{flex: 1, backgroundColor: '#6f6f6f'}}>
			<Container>
				<CustomeHeader {...this.props}/>
				<View style={{ flex:1, flexDirection:'row', justifyContent: 'center', alignItems: 'center' }} >
					<Content padder>
						<H1 style={{fontFamily:'RacingSansOne-Regular', marginTop: 30, textAlign:'center'}}>Ticket Request Complete</H1>
						<Text style={{fontFamily:'OpenSans-Regular', padding:20, marginTop: 10, textAlign:'center', fontSize:16}}>Thank you for submitting your e-Ticket request with DigContrax. Your request is being processed by the agency responsible in your area. A ticket number will be sent shortly.</Text>
						<Image source={image.cleared} style={{alignSelf:'center'}} resizeMode='contain' />
						<Text style={{fontFamily:'OpenSans-Bold', textAlign:'center', marginTop: 10,}}>Redirecting... {this.state.timer} </Text>
					</Content>
				</View>
			</Container>
			</SafeAreaView>
		);
	}
}
export default Eticketsuccess;
