import React, { Component } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  Linking,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
  BackHandler
} from "react-native";
import {
  Container,
  H1,
  H2,
  H3,
  Text,
  Button,
  Form,
  Item,
  Input,
  Label,
  Icon,
  Body,
  CheckBox,
  
} from "native-base";
import {
  image,
  config,
  _storeUser,
  _retrieveUser,
  validate,
  _showErrorMessage,
  Loader,
  _showSuccessMessage,
  _setHideNotifyExpired,
} from "assets";
import CustomeHeader from "../CustomeHeader";
import Content from "../../components/Content";
import { withTranslation } from "react-i18next";

class Notification extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isloading: false,
      showDetail: false,
      ticket: {},
      result: [],
      allTickets: [],
      modalVisible: false,
      ticketType: "",
      hide_expired: false,
      sortingStatus: false,
    };
  }

  componentDidMount() {
    var self = this;
    this.mounted = true;
    if (config.hasToken) {
      this.checkExpiredStatus();
      this._fetchTickets(config.currentToken);
    }
    this.focusListener = this.props.navigation.addListener("willFocus", () => {
      this.checkExpiredStatus();
      this._fetchTickets(config.currentToken);
      this.setState({ showDetail: false });
    });
   
       
     
  }

  checkExpiredStatus() {
    _retrieveUser().then((user) => {
      if (user !== null) {
        var usr = JSON.parse(user);
        this.setState({
          hide_expired: usr?.hide_notify_expired || false,
        });
      }
    });
  }

  _fetchTickets(token) {
    if (this.mounted) {
      this.setState({
        isloading: true,
      });
    }
    fetch(config.BASE_URL + "get-notifications?api_token=" + token, {
      method: "GET",
      headers: {
        Authorization:
          "Bearer 9wrSEwxch6jkKUWoyc0a8oXdHUoatLuRnbuyGQ16flVWb1yVBvUraLNPnFM6",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        // console.log("notification api res ---", res);
        if (this.mounted) {
          let result;
          if (res.status == 1) {
            var tickets = res.data;
            let hideExpired = this.state.hide_expired;
            result = tickets.filter(function (ticket) {
              if (hideExpired) {
                if (ticket.days_left != "Expired") {
                  return ticket;
                }
              } else {
                return ticket;
              }
            });

            this.setState({
              allTickets: tickets,
              result: result,
            });
          } else if (res.status == 0) {
            _showErrorMessage(res.message);
          }
          this.setState({
            isloading: false,
          });
        }
      })
      .catch((err) => {
        if (this.mounted) {
          _showErrorMessage("Something went wrong, Try again later.");
        }
      })
      .done();
  }

  componentWillUnmount() {
    this.mounted = false;


  }

  handleBackButton = () => {
    // Show a confirmation dialog
     this.goBack()

    // Prevent the default back button behavior
    return true;
  };

  goBack = () => {
    this.setState({
      ticket: {},
      showDetail: false,
    });
  };

  clickTicket = (ticket) => {
    ticket.renew = false;
    ticket.expire = false;
    ticket.close = false;
    if (ticket.status == 1) {
      ticket.renew = true;
    } else if (ticket.status == 2) {
      ticket.expire = true;
    }

    this.setState({
      ticket: ticket,
      showDetail: true,
    });
  };

  filterExpired() {
    var hide_expired = this.state.hide_expired ? false : true;
    var self = this;
    _setHideNotifyExpired(hide_expired).then((res) => {
      this.setState(
        {
          hide_expired: hide_expired,
        },
        () => {
          self.hideExpired();
        }
      );
    });
  }

  hideExpired() {
    let result_;
    var tickets = this.state.allTickets;
    let hideExpired = this.state.hide_expired;
    result_ = tickets.filter(function (ticket) {
      if (hideExpired) {
        if (ticket.days_left != "Expired") {
          return ticket;
        }
      } else {
        return ticket;
      }
    });

    this.setState({
      result: result_,
    });
  }

  sortingTicket(val) {
    console.log(val, "-----val---");
    // alert(this.state?.result[0])
    if (val == true) {
      const numAscending = [...this.state?.result].sort(
        (a, b) => b.ticket_no - a.ticket_no
      );
      // console.log('numAscending-------',numAscending);
      this.setState({
        result: numAscending,
        sortingStatus: !this.state.sortingStatus,
      });
    } else {
      const numAscending = [...this.state?.result].sort(
        (a, b) => a.ticket_no - b.ticket_no
      );
      // console.log('numAscending-------',numAscending);
      this.setState({
        result: numAscending,
        sortingStatus: !this.state.sortingStatus,
      });
    }
  }

  sortingJonName(val) {
    if (val == true) {
      const numAscending = [...this.state?.result].sort((a, b) =>
        a.job_name > b.job_name ? -1 : 1
      );
      // console.log('numAscending-------',numAscending);
      this.setState({
        result: numAscending,
        sortingStatus: !this.state.sortingStatus,
      });
    } else {
      const numAscending = [...this.state?.result].sort((a, b) =>
        a.job_name > b.job_name ? 1 : -1
      );
      // console.log('numAscending-------',numAscending);
      this.setState({
        result: numAscending,
        sortingStatus: !this.state.sortingStatus,
      });
    }
  }

  sortingExpiring(val){
    if (val == true) {
      const numAscending = [...this.state?.result].sort(
        (a, b) => b.days_left - a.days_left
      );
      // console.log('numAscending-------',numAscending);
      this.setState({
        result: numAscending,
        sortingStatus: !this.state.sortingStatus,
      });
    } else {
      const numAscending = [...this.state?.result].sort(
        (a, b) => a.days_left - b.days_left
      );
      // console.log('numAscending-------',numAscending);
      this.setState({
        result: numAscending,
        sortingStatus: !this.state.sortingStatus,
      });
    }

  }

  renderTickets() {
  // Remove the back button event listener when the component unmounts
  BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);

    return (
      <View style={{ margin: 10 }}>
        <H1
          style={{
            fontFamily: "RacingSansOne-Regular",
            marginTop: 30,
            marginBottom: 30,
          }}>
          {this.props.t("NOTIFICATIONS")}
        </H1>

        <View>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              paddingTop: 10,
              paddingBottom: 10,
            }}
            onPress={() => this.filterExpired()}>
            <View style={{ marginRight: 5 }}>
              <CheckBox
                checked={this.state.hide_expired}
                style={{ left: 0 }}
                color={this.state.hide_expired ? "green" : "#D3D3D3"}
                onPress={() => this.filterExpired()}
              />
            </View>
            <Text
              style={{
                fontSize: 14,
                fontStyle: "italic",
                textAlign: "center",
              }}>
              {this.props.t(
                "Check to hide expired tickets from the list below"
              )}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#333",
            padding: 15,
          }}>
          <View style={{ flex: 1.2, alignSelf: "flex-start" }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => this.sortingTicket(!this.state.sortingStatus)}>
              <Text
                style={{
                  fontSize: 14,
                  textAlign: "left",
                  color: "#fff",
                  fontFamily: "OpenSans-Bold",
                  paddingLeft: 25,
                }}>
                {this.props.t("TICKET#")}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1, alignSelf: "flex-start" }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => this.sortingJonName(!this.state.sortingStatus)}>
              <Text
                style={{
                  fontSize: 14,
                  textAlign: "right",
                  color: "#fff",
                  fontFamily: "OpenSans-Bold",
                }}>
                {this.props.t("JOB NAME")}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1, marginRight: 2, alignSelf: "flex-end" }}>
          <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => this.sortingExpiring(!this.state.sortingStatus)}
              >
            <Text
              style={{
                fontSize: 14,
                textAlign: "right",
                color: "#fff",
                fontFamily: "OpenSans-Bold",
              }}>
              {this.props.t("EXPIRING")}
            </Text>
            </TouchableOpacity>
          </View>
        </View>
        {this.state.result.map((key, i) => {
          return (
            <TouchableOpacity
              key={key.eticket_id}
              onPress={() => this.clickTicket(key)}>
              <Body
                style={{
                  height: 50,
                  flexDirection: "row",
                  backgroundColor: i % 2 == 0 ? "#D2D2D2" : "#e4e4e4",
                  paddingLeft: 12,
                  paddingRight: 12,
                }}>
                <View style={{ marginRight: 5 }}>
                  <Image
                    source={image["pending"]}
                    style={{ height: 25, width: 20 }}
                    resizeMode="contain"
                  />
                </View>
                <View style={{ flex: 1, paddingLeft: 2 }}>
                  <Text
                    style={{
                      // fontSize: 13,
                      // textAlign: "left",
                      // fontFamily: "OpenSans-Bold",
                      fontSize: 13,
                      textAlign: 'left',
                      fontFamily: 'OpenSans-Regular',
                      fontWeight:'700'
                    }}>
                    {key.ticket_no}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, textAlign: "right" }}>
                    {key.job_name}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  {key.days_left == "Expired" ? (
                    <Text
                      style={{
                        fontSize: 13,
                        textAlign: "right",
                        fontFamily: "OpenSans-Regular",
                        color: "red",
                      }}>
                      Expired
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontSize: 13,
                        textAlign: "right",
                        fontFamily: "OpenSans-Regular",
                      }}>
                      {key.days_left} Days
                    </Text>
                  )}
                </View>
              </Body>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  renderDetail() {
    const { ticket } = this.state;
     // Add the back button event listener when the component mounts
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    return (
      <View style={{ margin: 10 }}>
        <Text
          style={{
            fontFamily: "RacingSansOne-Regular",
            fontSize: 27,
            marginTop: 30,
            marginBottom: 15,
          }}
          onPress={() => this.goBack()}>
          <Icon name="chevron-left" type="Entypo" />
          {this.props.t("NOTIFICATIONS")}
        </Text>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1, backgroundColor: "#fdbe25" }}>
            <View style={{ alignSelf: "center", padding: 10 }}>
              <Image source={image.npending} resizeMode="contain" />
            </View>
          </View>
          <View style={{ flex: 2, backgroundColor: "#fdbe25" }}>
            <View
              style={{
                justifyContent: "center",
                alignSelf: "flex-start",
                alignItems: "flex-start",
                padding: 15,
              }}>
              <Text style={{ fontFamily: "OpenSans-Bold" }}>
                {ticket.days_left == "Expired"
                  ? `${this.porps.textAlign("This Ticket Expired")}`
                  : `${this.props.t("Ticket Expires in ")}` + ticket.days_left + `${this.props.t(" Days")}`}
              </Text>
              <Text style={{ fontFamily: "OpenSans-Regular", fontSize: 26 }}>
                # {ticket.ticket_no}
              </Text>
            </View>
          </View>
        </View>
        {ticket.days_left == "Expired" ? (
          <View style={{ marginTop: 20 }}>
            <Text
              style={{
                paddingBottom: 10,
                fontSize: 17,
                fontFamily: "OpenSans-Regular",
              }}>
              {this.props.t(
                "This ticket has already expired. If your work is completed, no further action is necessary. If you plan to dig again or are currently digging related to this ticket, you will need to contact 811 to establish a new ticket."
              )}
            </Text>
          </View>
        ) : (
          <View style={{ marginTop: 20 }}>
            <H2 style={{ fontFamily: "OpenSans-Regular" }}>
              {this.props.t(
                "Your ticket is scheduled to expire. You have three options:"
              )}
            </H2>
            <View style={{ marginTop: 10, padding: 5 }}>
              <Text
                style={{
                  paddingBottom: 10,
                  fontSize: 17,
                  fontFamily: "OpenSans-Regular",
                }}>
                <Text style={{ fontWeight: "bold", fontSize: 17 }}>1.</Text> {this.props.t('Let your ticket expire on')} {ticket.expiry_date} {this.props.t('because work is or will be completed before then')}.{" "}
              </Text>
              <Text
                style={{
                  paddingBottom: 10,
                  fontSize: 17,
                  fontFamily: "OpenSans-Regular",
                }}>
                <Text style={{ fontWeight: "bold", fontSize: 17 }}>2.</Text>{" "}
                {this.props.t('Contact 811 to renew your ticket beyond')} {ticket.expiry_date}{" "}
                {this.props.t('because work is expected to continue beyond the expiration date')}.
              </Text>
              <Text
                style={{
                  paddingBottom: 10,
                  fontSize: 17,
                  fontFamily: "OpenSans-Regular",
                }}>
                <Text style={{ fontWeight: "bold", fontSize: 17 }}>3.</Text>{" "}
                {this.props.t('Contact 811 to close your ticket now because work is completed and no digging is expected at the site')}.
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  }

  _changeStatus(token, type) {
    if (this.mounted) {
      this.setState({
        isloading: true,
      });
    }
    stats = 0;
    if (type == "renew") {
      stats = 1;
    } else if (type == "expire") {
      stats = 2;
    } else if (type == "close") {
      stats = 3;
    }

    const formdata = new FormData();
    formdata.append("status", stats);
    formdata.append("eticket_id", this.state.ticket.eticket_id);

    fetch(config.BASE_URL + "update-status?api_token=" + token, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formdata,
    })
      .then((response) => response.json())
      .then((res) => {
        if (this.mounted) {
          if (res.status == 1) {
            this.state.ticket.renew = false;
            this.state.ticket.expire = false;
            this.state.ticket.close = false;
            this.state.ticket[type] = true;
          } else if (res.status == 0) {
            _showErrorMessage(res.message);
          } else {
            throw "Error";
          }
          this.setState({
            isloading: false,
          });
        }
      })
      .catch((err) => {
        if (this.mounted) {
          _showErrorMessage("Something went wrong, Try again later");
          this.setState({
            isloading: false,
          });
        }
      })
      .done();
  }

  setModalVisible(visible, type) {
    if (type == "cancel" || type == "confirm") {
      if (type == "confirm") {
        wType = this.state.ticketType;
        if (config.hasToken) {
          this._changeStatus(config.currentToken, wType);
        }
      }
      type = "";
    }
    this.setState({
      modalVisible: visible,
      ticketType: type,
    });
  }

  renderModal() {
    const { ticketType } = this.state;
    if (ticketType != "") {
      if (ticketType == "renew") {
        middleContent = (
          <View>
            <View
              style={{
                backgroundColor: "#febf26",
                padding: 15,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}>
              <H2 style={{ fontFamily: "RacingSansOne-Regular" }}>
                RENEW TICKET
              </H2>
            </View>
            <View style={{ padding: 15 }}>
              <View
                style={{
                  marginTop: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <Text style={{ fontFamily: "OpenSans-Regular" }}>
                  You requested to renew ticket
                </Text>
                <Text
                  style={{
                    fontFamily: "OpenSans-Bold",
                    fontSize: 20,
                    marginTop: 10,
                    marginBottom: 10,
                  }}>
                  #{this.state.ticket.ticket_no}
                </Text>
                <Text style={{ fontFamily: "OpenSans-Regular" }}>
                  for 28 days. We will send a ticket
                </Text>
                <Text style={{ fontFamily: "OpenSans-Regular" }}>
                  request to 811 upon confirmation.
                </Text>
              </View>
            </View>
          </View>
        );
      } else if (ticketType == "expire") {
        middleContent = (
          <View>
            <View
              style={{
                backgroundColor: "#febf26",
                padding: 15,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}>
              <H2 style={{ fontFamily: "RacingSansOne-Regular" }}>
                ALLOW TICKET TO EXPIRE
              </H2>
            </View>
            <View style={{ padding: 15 }}>
              <View
                style={{
                  marginTop: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <Text style={{ fontFamily: "OpenSans-Regular" }}>
                  You requested to let ticket
                </Text>
                <Text
                  style={{
                    fontFamily: "OpenSans-Bold",
                    fontSize: 20,
                    marginTop: 10,
                    marginBottom: 10,
                  }}>
                  #{this.state.ticket.ticket_no}
                </Text>
                <Text style={{ fontFamily: "OpenSans-Regular" }}>
                  expire in {this.state.ticket.days_left} days. Please confirm
                  your
                </Text>
                <Text style={{ fontFamily: "OpenSans-Regular" }}>
                  selection.
                </Text>
              </View>
            </View>
          </View>
        );
      } else if (ticketType == "close") {
        middleContent = (
          <View>
            <View
              style={{
                backgroundColor: "#febf26",
                padding: 15,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}>
              <H2 style={{ fontFamily: "RacingSansOne-Regular" }}>
                CLOSE TICKET
              </H2>
            </View>
            <View style={{ padding: 15 }}>
              <View
                style={{
                  marginTop: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <Text style={{ fontFamily: "OpenSans-Regular" }}>
                  You requested to close ticket
                </Text>
                <Text
                  style={{
                    fontFamily: "OpenSans-Bold",
                    fontSize: 20,
                    marginTop: 10,
                    marginBottom: 10,
                  }}>
                  #{this.state.ticket.ticket_no}
                </Text>
                <Text style={{ fontFamily: "OpenSans-Regular" }}>
                  immediately. Please confirm your{" "}
                </Text>
                <Text style={{ fontFamily: "OpenSans-Regular" }}>
                  selection.
                </Text>
              </View>
            </View>
          </View>
        );
      }

      return (
        <View style={styless.ModalInsideView}>
          {middleContent}
          <View
            style={{
              position: "absolute",
              flexDirection: "row",
              width: "100%",
              height: 40,
              bottom: 0,
            }}>
            <TouchableOpacity
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                this.setModalVisible(!this.state.modalVisible, "cancel");
              }}>
              <Text
                style={{
                  fontSize: 17,
                  marginBottom: 5,
                  alignSelf: "center",
                  fontFamily: "OpenSans-Bold",
                }}>
                CANCEL
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                this.setModalVisible(!this.state.modalVisible, "confirm");
              }}>
              <Text
                style={{
                  fontSize: 17,
                  marginBottom: 5,
                  alignSelf: "center",
                  fontFamily: "OpenSans-Bold",
                }}>
                CONFIRM
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return <View></View>;
    }
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#6f6f6f" }}>
        <Container>
          <CustomeHeader {...this.props} />
          <Content>
            {this.state.showDetail ? this.renderDetail() : this.renderTickets()}
            <View style={styless.MainContainer}>
              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {}}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0,0,0,0.5)",
                  }}>
                  {this.renderModal()}
                </View>
              </Modal>
            </View>
          </Content>
          {this.state.isloading && <Loader />}
        </Container>
      </SafeAreaView>
    );
  }
}

export default withTranslation()(Notification);

const styless = StyleSheet.create({
  listContainer: { flex: 1, flexDirection: "row" },
  btnTexts: {
    fontSize: 28,
    textAlign: "center",
    color: "#fff",
    fontFamily: "OpenSans-Bold",
  },

  innerSecondText1: { color: "#000", fontFamily: "OpenSans-Bold" },
  innerSecondText2: { fontFamily: "OpenSans-Regular", fontSize: 14 },

  innerSecond: {
    justifyContent: "center",
    flex: 1,
    //borderWidth:1,
    //width:280,
    paddingLeft: 10,
    //borderColor: '#717274'
  },
  inner: {
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 5,
    paddingBottom: 5,
    marginRight: 1,
    backgroundColor: "#fff",
    borderRadius: 5,
    justifyContent: "flex-start",
    borderColor: "#333",
    borderWidth: 2,
  },
  outer: {
    marginTop: 30,
    //backgroundColor: '#7E7E7E',
    borderRadius: 2,
  },

  radioWrap: {
    flexDirection: "row",
    marginBottom: 5,
  },
  radioNormal: {
    borderRadius: 5,
  },
  radioActive: {
    width: 10,
    height: 10,
    backgroundColor: "#000",
  },
  radioouter: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    width: 20,
    height: 20,
    alignSelf: "center",
    borderColor: "#000",
    borderRadius: 5,
  },
  ModalInsideView: {
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: "#fff",
    height: 300,
    width: "90%",
    borderRadius: 10,
    //borderWidth: 1,
    borderColor: "#ccc",
    borderStyle: "solid",
    elevation: 20,
    flexDirection: "column",
  },
  MainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Platform.OS == "ios" ? 20 : 0,
  },
});
