import React, { Component } from 'react';
import {  SafeAreaView, StyleSheet,  View , Image, Linking, ScrollView }  from 'react-native';
import { Container,  H1, H2, H3, Text , Button, Form, Item, Input, Label, Icon } from "native-base";
import { image, config, _storeUser, _retrieveUser, validate, _showErrorMessage, Loader, _showSuccessMessage, _phoneFormat} from 'assets';
import CustomeHeader from '../CustomeHeader';
import Common from './Common';
import Infomation from './Infomation';
import Documentation from './Documentation';
import Content from '../../components/Content';
import { WebView } from 'react-native-webview';

export default  class TicketDetail extends Component {
	static navigationOptions = {
		header: null,
	};
	
	constructor(props){
		super(props)
		this.state = {
			isloading: false,
			ticket:[],
			active:'doc',
			ticket_number:'',
			mapurl:'https://onecallnvpreprod.undergroundservicealert.org/ngen.web/map/index?RequestNumber='+this.props.route.params.ticket.ticket+'-000',
		};
	}


	componentDidMount(){
		this.mounted = true;	
		console.log('aaaaaaaaaa',this.state.mapurl);
	}
	componentWillReceiveProps(nextProps) {
	  this.setState({ ticket: nextProps.ticket });  
	}
	componentWillUnmount(){
		this.mounted = false;		
	}
	
	goBack = () => {		
		this.props.navigation.navigate('Manage')
	}
	
	toggleactive = (w) => {
		this.setState({
			active:w
		});
	}
	
	changeLoadingState = (type) => {
		this.setState({
			isloading: type
		});
	}
	
	goForward = (data) => {				
		this.props.navigation.navigate('TicketDetail', {ticket: data })
	}

	renderElement(ticket){
		const { active } = this.state;
		switch (active)
		{
			case 'info':
			return <Infomation goBack={this.goBack} />;
			case 'doc':
			return <Documentation data={ticket.ticket} info={ticket} changeLoadingState={this.changeLoadingState} goForward={this.goForward}/>;			
		}
	}

	render() {
		const { navigation, route } = this.props;
		const itemId = route.params?.ticket ?? 0;
		const ticketInfo = route.params?.ticketInfo ?? 0;
		const excavatorInfo = route.params?.excavatorInfo ?? 0;
		const excavationAreaInfo = route.params?.excavationAreaInfo ?? 0;
		if(typeof itemId.ticket == 'undefined')
		{ 
			this.props.navigation.navigate('Manage')
		}		
		return (
			<SafeAreaView style={{flex: 1, backgroundColor: '#6f6f6f'}}>
			<Container>
				<CustomeHeader {...this.props}/>
				<Content>
				<View style={{margin:10}}>
					<Common ticket={itemId} ticketInfo={ticketInfo} excavatorInfo={excavatorInfo} excavationAreaInfo={excavationAreaInfo} info={itemId} active={this.state.active} toggleactive={this.toggleactive} goBack={this.goBack} changeLoadingState={this.changeLoadingState} clickTicket={this.goForward}/>
					
					{this.renderElement(itemId)}
					
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