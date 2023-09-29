import React, { Component } from 'react';
import {  SafeAreaView, StyleSheet,  View , Image, Linking, ScrollView, TouchableOpacity, Modal, Platform, Dimensions }  from 'react-native';
import { Container,  H1, H2, H3, Text , Button, Form, Item, Input, Label, Icon, Body } from "native-base";
import { image, config, _storeUser, _retrieveUser, validate, _showErrorMessage, Loader, _showSuccessMessage } from 'assets';
import CustomeHeader from '../CustomeHeader';
import { WebView} from 'react-native-webview';
import Content from '../../components/Content';


let trainingLINKS =
[
	{ title:'How To Premark', link: 'https://www.youtube.com/watch?v=LwMd8gNz7EA' },
	{ title:'Pre-Marking Best Practices', link: 'https://commongroundalliance.com/best-practices/best-practices-guide/guidelines-excavation-delineation' },
	{ title:'Common Abbreviations', link: 'https://commongroundalliance.com/best-practices/best-practices-guide/common-abbreviations' },
	{ title:'Utility Member Contact Lookup', link: 'https://newtinx.usan.org/newtinweb/usan_contactlookup_emergency.html'},
	{ title:'CGA Best Practices ', link: 'https://commongroundalliance.com/best-practices-guide' }
	/*{ title:'E-Ticket Training Video', link: 'https://youtu.be/dP5VLvthYk4' },
	{ title:'811 Express Training Video', link: 'https://www.youtube.com/watch?v=W9MZ33cZagc' },
	{ title:'E-Ticket Training Continuous Locations', link: 'https://youtu.be/wOzILpGc58M' },
	{ title:'E-Ticket Training Bounded Area Locations', link: 'https://youtu.be/zJ2OmE0SN6w' },
	{ title:'E-Ticket Training Point Locations', link: 'https://youtu.be/GPjRrfYi3Zg' },
	{ title:'E-Ticket Training Renewals & Remarks', link: 'https://youtu.be/PVJgguWNisY' },
	{ title:'E-Ticket Training Between Intersections', link: 'https://youtu.be/qtR20wABSQY' },
	{ title:'E-Ticket Training Address Locations', link: 'https://www.youtube.com/watch?v=-makLsrNnbo' },
	{ title:'E-Ticket Training Mile Posts', link: 'https://youtu.be/FDSe01VXQFY' },
	{ title:'WebTMS Training Video', link: 'https://www.youtube.com/watch?v=DnXvQERky-I' },
	{ title:'How To Premark', link: 'https://www.youtube.com/watch?v=LwMd8gNz7EA' },
	{ title:'Utility Member Contact Lookup', link: 'https://www.youtube.com/watch?v=0XaLQoyQ5pA' },*/
]

export default  class Support extends Component {

	static navigationOptions = {
		header: null,
	};

	constructor(props){
		super(props)
		this.state = {
			isloading: false,
			activeTab: ''
		}
	}

	componentDidMount(){
		this.focusListener = this.props.navigation.addListener('willFocus', () => {
	    	this.setState({ activeTab: ''});    
      	});
      	/*const { navigation } = this.props;
      	var page = navigation.getParam('page', 0);
      	this.setState({ activeTab: page });
      	this.mounted = true;
      	console.log(navigation);*/
	}

	componentWillUnmount(){
		this.mounted = false;
	}

	changetab = (page) => {
		/* Create different pages for tabs because old navigation could  not handle params in component Did mount */
		var routeAction = "Support";
		if(page == "faq") {
		  	routeAction = "SupportFaq";
		}else if(page == "law") {
		  	routeAction = "SupportLaw";
		}else if(page == "training") {
		  	routeAction = "SupportTraining";
		}
		this.props.navigation.navigate(routeAction, {});
	}

	onPressCall(url) {
		Linking.canOpenURL(url).then((supported) => {
			if (supported) {
				return Linking.openURL(url).catch(() => null);
			}
		});
	}

	render() {
		var { activeTab } = this.state;
		//const { navigation } = this.props;
		//var page = navigation.getParam('page', 0);
		//console.warn(this.props.navigation.state.params.page)
		/*if(typeof page != 'undefined')
		{
			activeTab = page;
			navigation.setParams({ page: 0 })
		}*/
		return (
			<SafeAreaView style={{flex: 1, backgroundColor: '#6f6f6f'}}>
			<Container>
				<CustomeHeader {...this.props}/>
				<Content>
					<View style={{margin:10}}>
						<H1 style={{fontFamily:'RacingSansOne-Regular', marginTop: 20, marginBottom: 10}}>SUPPORT</H1>
						<View style={{ flexDirection: "row" }}>
							<TouchableOpacity onPress={() => this.changetab('faq')} style={(activeTab == 'faq') ? styles.reqTouchActive : styles.reqTouch} >
								<View style={styles.reqTouchV} >
									<Image source={image.faq} style={{width:80}} resizeMode='contain' />
								</View>
								<Text style={styles.reqText}>FAQ</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => this.changetab('law')} style={(activeTab == 'law') ? styles.reqTouchActive : styles.reqTouch} >
								<View style={styles.reqTouchV}>
									<Image source={image.law} style={{width:80}}  resizeMode='contain' />
								</View>
								<Text style={styles.reqText}>Laws</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => this.changetab('training')} style={(activeTab == 'training') ? styles.reqTouchLastActive : styles.reqTouchLast} >
								<View style={styles.reqTouchV}>
									<Image source={image.training} style={{width:80}} resizeMode='contain' />
								</View>
								<Text style={styles.reqTextLast}>Training</Text>
							</TouchableOpacity>
						</View>
						{ (this.state.activeTab == '') && <View>
							<H3 style={{fontFamily:'RacingSansOne-Regular', marginTop: 25, marginBottom: 5}}>Contact 811</H3>
								<View style={styles.listContainer}>
				                    <View style={styles.inner} >
										<View style={{flexDirection: 'row', alignItems: 'center' }}  >
											<Image source={image.call} style={{width:40}}  resizeMode='contain' />
										</View>
									</View>
				                    <View style={styles.innerSecond} >
				                        <Button block style={{backgroundColor: "#fdbe25"}} onPress={() => this.onPressCall('tel:811')}>
											<H3 style={{color:"#000" }}>Call 811</H3>
										</Button>
				                    </View>
				                </View>
				                <View style={styles.listContainer}>
				                    <View style={styles.inner} >
										<View style={{flexDirection: 'row', alignItems: 'center' }}  >
											<Image source={image.email} style={{width:40}}  resizeMode='contain' />
										</View>
									</View>
				                    <View style={styles.innerSecond} >
				                        <Button block style={{backgroundColor: "#fdbe25"}} onPress={() => this.onPressCall('mailto:onlineservices@usanorth811.org')}>
											<H3 style={{color:"#000" }}>Email 811</H3>
										</Button>
				                    </View>
				                </View>

				                <H3 style={{fontFamily:'RacingSansOne-Regular', marginTop: 25, marginBottom: 5}}>Contact DigContrax</H3>
				                <View style={styles.listContainer}>
				                    <View style={styles.inner} >
										<View style={{flexDirection: 'row', alignItems: 'center' }}  >
											<Image source={image.call} style={{width:40}}  resizeMode='contain' />
										</View>
									</View>
				                    <View style={styles.innerSecond} >
				                        <Button block style={{backgroundColor: "#fdbe25"}} onPress={() => this.onPressCall('tel:(702) 851-3333')}>
											<H3 style={{color:"#000" }}>Call DigContrax</H3>
										</Button>
				                    </View>
				                </View>
				                <View style={styles.listContainer}>
				                    <View style={styles.inner} >
										<View style={{flexDirection: 'row', alignItems: 'center' }}  >
											<Image source={image.email} style={{width:40}}  resizeMode='contain' />
										</View>
									</View>
				                    <View style={styles.innerSecond} >
				                        <Button block style={{backgroundColor: "#fdbe25"}} onPress={() => this.onPressCall('mailto:support@digcontrax.com')}>
											<H3 style={{color:"#000" }}>Email DigContrax</H3>
										</Button>
				                    </View>
				                </View>
						</View>
						}
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
		alignSelf:'center', marginTop:15
	},
	reqText:{
		fontFamily:'OpenSans-Bold', alignSelf:'center'
	},
	reqTextLast:{
		fontFamily:'OpenSans-Bold', alignSelf:'center'
	},

	listContainer:{ flex: 1, flexDirection: 'row', backgroundColor:'#9C9C9C'},
	innerSecond: { justifyContent: 'center', flex:1, paddingRight:10 },
	inner: { paddingRight:20, paddingLeft:20, marginRight: 1, justifyContent: 'flex-start' },
	listContainer2:{ flex: 1, flexDirection: 'row', borderColor:"#333", borderBottomWidth:1, padding:5},
	innerSecond2: { justifyContent: 'center', flex:1, paddingLeft:10 },
	inner2: {
		paddingRight:3,
		paddingLeft:6,
		paddingTop:3,
		paddingBottom:3,
		marginRight: 1,
		backgroundColor: '#fdbe25',
		borderRadius: 25,
		justifyContent: 'flex-start'
	},
});
