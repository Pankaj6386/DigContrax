import React, { Component } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  Text,
  TouchableOpacity,
  Plateform,
  AsyncStorage,
} from "react-native";
import {
  Container,
  Header,
  Form,
  Item,
  Input,
  H1,
  Left,
  Body,
  Right,
  Icon,
  Title,
} from "native-base";
import { image } from "assets";
import i18n from "../translation";
import "../translation";

export default class CustomeHeader extends Component {
  constructor(props) {
    super(props);
    this.state = { isChecked: null, langOption: 0 };
  }
  static navigationOptions = {
    header: null,
  };

  async componentDidMount() {
    this.mounted = true;

    await AsyncStorage.getItem("addLangtype").then((language) => {
      // Use the retrieved language as the initial app language.
      this.setState({ isChecked: language });
    });

    await AsyncStorage.getItem("multi_lang").then((type) => {
      // Use the retrieved language as the initial app language.
      // i18n.changeLanguage(language);
      this.setState({ langOption: type });
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleCheckboxToggle = (check) => {
    this.setState({ isChecked: check });
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={{ height: 50, backgroundColor: "#6F6F6F" }}>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
            <View style={{ alignSelf: "center" }}>
              <Image
                source={image.iconMenu}
                resizeMode="contain"
                style={{ transform: [{ scale: 0.72 }] }}
              />
            </View>
          </TouchableOpacity>
          <View style={{ flex: 1, marginTop: -10 }}>
            <Image
              source={image.taglogo}
              style={{
                alignSelf: "center",
                transform: [{ scale: 0.65 }],
                height: 70,
              }}
              resizeMode="contain"
            />
          </View>
          <View style={{ alignSelf: "center", paddingRight: 10 }}>
            <TouchableOpacity
              style={{
                backgroundColor:
                  this.state.isChecked == "en" ? "#FEBC42" : "#9E9E9E",
                padding: 1,
                paddingHorizontal:3
              }}
              disabled={this.state.isChecked == "en" ? true : false}
              onPress={async () => {
                i18n.changeLanguage("en");
                this.handleCheckboxToggle("en"),
                  await AsyncStorage.setItem("@SelectLanguage", "en");
                await AsyncStorage.setItem("addLangtype", "en");
              }}>
              <Text
                style={{
                  fontSize: 12,
                  lineHeight: 14,
                  color: this.state.isChecked == "en" ? "#ffffff" : "#000000",
                }}>
                ENG
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={this.state.isChecked == "sp" ? true : false}
              onPress={async () => {
                i18n.changeLanguage("sp");
                this.handleCheckboxToggle("sp"),
                  await AsyncStorage.setItem("@SelectLanguage", "sp");
                await AsyncStorage.setItem("addLangtype", "sp");
              }}
              style={{
                backgroundColor:
                  this.state.isChecked == "sp" ? "#FEBC42" : "#9E9E9E",
                padding: 1,
                paddingHorizontal:3
              }}>
              <Text
                style={{
                  fontSize: 12,
                  lineHeight: 14,
                  color: this.state.isChecked == "sp" ? "#ffffff" : "#000000",
                }}>
                ESP
              </Text>
            </TouchableOpacity>
          </View>
          {/* <TouchableOpacity  onPress={()=> this.props.navigation.navigate('Account')} style={{alignSelf:'center', paddingRight: 10}}>
						<Image source={image.user} resizeMode='contain' />
					</TouchableOpacity> */}
        </View>
      </View>
    );
  }
}
