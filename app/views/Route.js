import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {ScrollView, StyleSheet, View, Image,SafeAreaView, Text, TouchableOpacity } from 'react-native';
import {image} from 'assets';
import SideMenu from './SideMenu';
import Welcome from './Welcome';
import { Home, Login, Register, Account, Manage, Eticketsuccess, TicketDetail, Notification, Support, ForgotPassword, Contact, SupportFaq, SupportLaws, SupportTraining, AddTicket, ChangePassword } from './screens';

const SplashStack = createNativeStackNavigator();

const Splash = () => {
  return (
    <SplashStack.Navigator
      initialRouteName="Welcome"
    >
      <SplashStack.Screen
        name="Welcome"
        component={Welcome}
        options={{
          headerShown: false
        }}
      />
    </SplashStack.Navigator>
  );
};

const AuthStack = createNativeStackNavigator();

const Auth = () => {
  return (
    <AuthStack.Navigator
      initialRouteName="Login"
      headerMode="screen" 
    >
      <AuthStack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
      <AuthStack.Screen name="Register" component={Register} options={{ headerShown: false }}/>
      <AuthStack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }}/>
    </AuthStack.Navigator>
  );
};

const AddTicketStack = createNativeStackNavigator();

const addticket = () => {
  return (
    <AddTicketStack.Navigator
      initialRouteName="AddTicket"
      headerMode="screen" 
    >
      <AddTicketStack.Screen name="AddTicket" component={AddTicket} options={{ headerShown: false }}/>
    </AddTicketStack.Navigator>
  );
};

/*Tabs*/

const ManageTicketStack = createNativeStackNavigator();

const manageticket = () => {
  return (
    <ManageTicketStack.Navigator
      initialRouteName="Manage"
      headerMode="screen"
    >
      <ManageTicketStack.Screen name="Manage" component={Manage} options={{ headerShown: false }}/>
      <ManageTicketStack.Screen name="TicketDetail" component={TicketDetail} options={{ headerShown: false }}/>
    </ManageTicketStack.Navigator>
  );
};

const SupportStack = createNativeStackNavigator();

const support = () => {
  return (
    <SupportStack.Navigator
      initialRouteName="Contact"
      headerMode="screen" 
    >
      <SupportStack.Screen name="Contact" component={Contact} options={{ headerShown: false }}/>
      <SupportStack.Screen name="SupportFaq" component={SupportFaq} options={{ headerShown: false }}/>
      <SupportStack.Screen name="SupportLaw" component={SupportLaws} options={{ headerShown: false }}/>
      <SupportStack.Screen name="SupportTraining" component={SupportTraining} options={{ headerShown: false }}/>
    </SupportStack.Navigator>
  );
};

const CustomTabBar = ({...props}) => {   
	let navigation = props.navigation;
	let iconsa = ['homeActive',	'usericonActive','manageActive', 'notificationActive', 'supportActive'	];
	let icons = ['manage', 'usericon', 'notification', 'support'	];
	// let titles = [ 'Manage', 'Add', 'Notifications', 'Support' ];	
  let titles = [ 'Manage', 'Account', 'Notifications', 'Support' ];	
	const { routes, index } = props.state;
	console.log("routes >> ", routes)
	return (
		<SafeAreaView>
		<View style={{ height:65, backgroundColor: '#313131' }}>
			<View style={{flexDirection: 'row', justifyContent:'space-between' }}>     
				{routes.map((route, idx) => {
               const color = (index === idx) ? '#FFBC42' : 'gray';
					const isActive = index === idx;
          console.log('Anuj',route.name)
					if(idx < 4)
					{
            // if(titles[idx] != "Add"){
              return (
                <TouchableOpacity key={route.key} style={{ flex: 1 }} onPress={() => { 
  
                  if(route.name == "Support"){navigation.navigate("Support", {screen:"Contact"})
                  }else if(route.name == "Create"){navigation.navigate("AddTicket")
                  }else{
                    navigation.navigate(route.name) 
                  } 
                }}>
  
                  <View style={{alignSelf:'center'}} >
                    <Image source={isActive ? image[iconsa[idx]] : image[icons[idx]]} resizeMode='contain' style={{transform: [{ scale: 0.60 }]}} />
                  </View>
                  <Text style={{fontFamily:'OpenSans-Regular', alignSelf:'center', marginTop:-12, color:color, fontSize:12 }}>{titles[idx]}</Text>
                </TouchableOpacity>
              )
            // }
						
					}                    
				})}
			</View>
		</View>
		</SafeAreaView>
	)
};

const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
  	<Tab.Navigator
      initialRouteName="Manage"
      screenOptions={{
        tabBarActiveTintColor: '#e91e63',
        headerShown: false
      }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="Manage"
        component={manageticket}
        options={{
          tabBarLabel: 'Manage',
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarLabel: 'Account'
        }}
      />
      <Tab.Screen
        name="Notification"
        component={Notification}
        options={{
          tabBarLabel: 'Notifications'
        }}
      />
      <Tab.Screen
        name="Support"
        component={support}
        options={{
          tabBarLabel: 'Support'
        }}
      />
      {/*<Tab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarLabel: 'Account'
        }}
      />*/}
      <Tab.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{
          tabBarLabel: 'ChangePassword'
        }}
      />
      <Tab.Screen
        name="Eticket"
        component={Eticketsuccess}
        options={{
          tabBarLabel: 'Eticket'
        }}
      />
    </Tab.Navigator>
  );
};

/*Tabs*/
const Drawer = createDrawerNavigator();

const MyDrawer = () => {
  return (
    <Drawer.Navigator 
    	drawerContent={(props) => <SideMenu {...props} />}
    	screenOptions={{
		    drawerStyle: {
		      backgroundColor: '#202020'
		    },
		    headerShown: false
		  }}
    >
      <Drawer.Screen name="Tabs" component={Tabs} />
    </Drawer.Navigator>
  );
};

const Stack = createNativeStackNavigator();

export const AppStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Auth"
          component={Auth}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dashboard"
          component={MyDrawer}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};