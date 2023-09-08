import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  Linking,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
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
  Thumbnail,
  CheckBox,
} from 'native-base';
import {
  _updateAppMessage,
  image,
  config,
  _storeUser,
  _retrieveUser,
  validate,
  _showErrorMessage,
  Loader,
  _showSuccessMessage,
  _getallticketstatus,
  _removeUser,
  _updateTermsAccepted,
  _setHideExpired,
} from 'assets';
import CustomeHeader from '../CustomeHeader';
import {StackActions, CommonActions} from '@react-navigation/native';
import MapView, {PROVIDER_GOOGLE, AnimatedRegion} from 'react-native-maps';
import {Marker} from 'react-native-maps';
import {WebView} from 'react-native-webview';
import Content from '../../components/Content';
import {withTranslation} from 'react-i18next';
import '../../translation';

import { _retrieveLanguage } from '../../../assets/config/helper';

const app_version = config?.app_version;

class Manage extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      filterRecord:false,
      isloading: false,
      result: [],
      tickets: [],
      srch_q: '',
      prev_srch_q: '',
      sort_by: '',
      sort_order: '',
      sort_order_ticket: '',
      sort_order_days: '',
      ticketStatus: {
        pending: {count: 0},
        cleared: {count: 0},
        closed: {count: 0},
        expired: {count: '0'},
      },
      activeView: 'table',
      clickedBox: '',
      ticketInfoModalVisible: false,
      openTicketNum: '',
      openJobName: '',
      openTicketStatus: '',
      openTicketIndex: '',
      initialRegion: {
        latitude: 36.18896796426283,
        latitudeDelta: 0.43120351639411325,
        longitude: -115.17533551901579,
        longitudeDelta: 0.5594524741172506,
      },
      markers: [
        {
          latitude: 45.65,
          longitude: -78.9,
          title: 'Foo Place',
          subtitle: '1234 Foo Drive',
          pinColor: 'red',
        },
        {
          latitude: 46.65,
          longitude: -78.9,
          title: 'Other Place',
          subtitle: '567 Other Drive',
          pinColor: 'yellow',
        },
        {
          latitude: 47.65,
          longitude: -78.9,
          title: 'Other Place',
          subtitle: '567 Other Drive',
          pinColor: 'yellow',
        },
        {
          latitude: 48.65,
          longitude: -76.9,
          title: 'Other Place',
          subtitle: '567 Other Drive',
          pinColor: 'yellow',
        },
        {
          latitude: 46.65,
          longitude: -77.9,
          title: 'Other Place',
          subtitle: '567 Other Drive',
          pinColor: 'yellow',
        },
      ],
      alertModalVisible: false,
      alertMessage: 'loading response...',
      eulaInfoModalVisible: false,
      hide_expired: false,
      page: 1,
      userListLoading: false,
    };
  }
  componentDidMount() {

    console.log('----------------------- i am refreshing everytime')
    var self = this;
    this.mounted = true;

    _retrieveUser().then(user => {
      if (user !== null) {
        var usr = JSON.parse(user);
        this.setState({
          hide_expired: usr?.hide_expired || true,
        });
        this.checkTermsAccepted(user);
        setTimeout(function () {
          //delay
          config.hasToken = true;
          config.currentToken = usr.userInfo.token;
          self._initTicketsList();
        }, 200);
      } else {
        alert('Something went wrong, Please logout and login again.');
      }
    });

    this.focusListener = this.props.navigation.addListener('willFocus', () => {
      _retrieveUser().then(user => {
        if (user !== null) {
          var usr = JSON.parse(user);
          this.setState({
            hide_expired: usr?.hide_expired || true,
          });
          this.checkTermsAccepted(user);
        }
      });
      this.setState(
        {
          srch_q: '',
          prev_srch_q: '',
          page: 1,
          activeView: 'table',
          clickedBox: '',
          result: [],
          sort_by: '',
          sort_order: '',
          sort_order_ticket: '',
          sort_order_days: '',
        },
        () => {
          this.mounted = true;
          this._initTicketsList();
        },
      );
    });

    this.getCurrentLocation();
  }

  checkTermsAccepted(user) {
    var usr = JSON.parse(user);
    if (usr?.userInfo?.terms_accepted != 1) {
      this.setState({eulaInfoModalVisible: true});
    }
  }

  eulaModalContent() {
    return (
      <View style={[styles.MainContainer, {width: '100%'}]}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.eulaInfoModalVisible}
          onRequestClose={() => {}}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
              padding: 5,
            }}>
            <View style={styles.EulaModalInsideView}>
              <View
                style={{
                  backgroundColor: '#febf26',
                  padding: 5,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <H3 style={{fontFamily: 'RacingSansOne-Regular'}}>
                  {this.props.t('END-USER LICENSE AGREEMENT')}
                </H3>
              </View>
              <WebView
                source={{uri: 'https://digcontrax.com/eula'}}
                startInLoadingState={true}
                javaScriptEnabled={true}
                scalesPageToFit={true}
                injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=640'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);`}
                scrollEnabled={true}
                bounces={true}
                allowUniversalAccessFromFileURLs={true}
                onNavigationStateChange={event => {
                  if (event.url !== 'https://digcontrax.com/eula') {
                    this.webview.stopLoading();
                    Linking.openURL(event.url);
                  }
                }}
                onShouldStartLoadWithRequest={event => {
                  if (event.url !== 'https://digcontrax.com/eula') {
                    Linking.openURL(event.url);
                    return false;
                  }
                  return true;
                }}
                style={{backgroundColor: '#1b1b1b'}}
              />

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  position: 'absolute',
                  bottom: 0,
                  backgroundColor: '#1b1b1b',
                  height: 50,
                  width: '100%',
                  padding: 10,
                }}>
                <Button
                  small
                  style={{
                    backgroundColor: '#febf26',
                    justifyContent: 'center',
                    color: '#fff',
                    width: '45%',
                  }}
                  onPress={() => this.eulaAction('accept')}>
                  <Text
                    style={{color: '#000', textAlign: 'center', fontSize: 14}}>
                    {this.props.t('ACCEPT')}
                  </Text>
                </Button>
                <Button
                  small
                  style={{
                    backgroundColor: '#da5531',
                    justifyContent: 'center',
                    color: '#fff',
                    width: '45%',
                  }}
                  onPress={() => this.eulaAction('decline')}>
                  <Text
                    style={{color: '#fff', textAlign: 'center', fontSize: 14}}>
                    {this.props.t('DECLINE')}
                  </Text>
                </Button>
              </View>
            </View>
          </View>
          {this.state.isloading && <Loader />}
        </Modal>
      </View>
    );
  }

  eulaAction = action => {
    var self = this;
    this.setState({isloading: true});
    const token = config.currentToken;
    const status = action == 'accept' ? 1 : 2;
    const formdata = new FormData();
    formdata.append('status', status);
    formdata.append('api_token', token);
    fetch(config.BASE_URL + 'update-eula', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'multipart/form-data',
      },
      body: formdata,
    })
      .then(response => {
        return response.json();
      })
      .then(res => {
        if (this.mounted) {
          if (res.status == 1) {
            if (action == 'decline') {
              //logout
              this.setState({isloading: false});
              _removeUser().then(user => {
                config.hasToken = false;
                /* old code const resetAction = StackActions.reset({
									index: 0,
									key: null,
									actions: [
										NavigationActions.navigate({ routeName: 'Auth' })
									],
								});*/
                const resetAction = CommonActions.reset({
                  index: 0,
                  routes: [{name: 'Auth'}],
                });
                self.props.navigation.dispatch(resetAction);
              });
            } else {
              // update session terms_accepted
              _updateTermsAccepted().then(res => {});
              this.setState({isloading: false, eulaInfoModalVisible: false});
            }
          }
        }
      })
      .catch(err => {
        this.setState({isloading: false});
        if (this.mounted) {
          _showErrorMessage('Something went wrong, Try again later.');
        }
      })
      .done();
  };

  async getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      position => {
        let region = {
          latitude: parseFloat(position.coords.latitude),
          longitude: parseFloat(position.coords.longitude),
          latitudeDelta: 0.43120351639411325,
          longitudeDelta: 0.5594524741172506,
        };
        this.setState({
          initialRegion: region,
        });
      },
      error => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
      },
    );
  }

  _initTicketsList() {
    if (config.hasToken) {
      var self = this;
      _getallticketstatus(
        config.BASE_URL + 'ticket_status?api_token=' + config.currentToken,
        function (res) {
          if (res.status == 1) {
            self.setState({
              ticketStatus: res.data,
              srch_q: '',
              prev_srch_q: '',
            });
          }
        },
      );
      this._fetchTickets(config.currentToken);
    }
  }

  sortTicket(sort_by) {
    this.setState({
      filterRecord:true,
      result: [],
      page: 1,
    
    })
    console.log(
      sort_by,
      '---------sort by -------',
      '-----this.state.sort_order_ticket----- ',
      this.state.sort_order_ticket,
    );
    var sort_order = '';
    if (sort_by == 'ticket_no') {
      sort_order =
        this.state.sort_order_ticket === ''
          ? 'asc'
          : this.state.sort_order_ticket === 'asc'
          ? 'desc'
          : 'asc';
      console.log(sort_order, '----sort_order');
      this.setState({sort_order_ticket: sort_order});
      this.setState({sort_order_days: ''});

      console.log(
        '---------sort_order_days-------',
        this.state.sort_order_days,
        '-----sort_order_ticket----- ',
        this.state.sort_order_ticket,
      );
    } else {
      sort_order =
        this.state.sort_order_days == ''
          ? 'asc'
          : this.state.sort_order_days == 'asc'
          ? 'desc'
          : 'asc';
      this.setState({sort_order_ticket: '', sort_order_days: sort_order});
    }
    this.setState({sort_by: sort_by, sort_order: sort_order});
    console.log(
      '---------sort_by-------',
      this.state.sort_by,
      '-----sort_order----- ',
      this.state.sort_order,
    );
    var self = this;
    setTimeout(function () {
      self._fetchTickets(config.currentToken);
    
    }, 100);
   
  }

  _fetchTickets(token) {
    const currentToken = config.currentToken;
    console.log(currentToken, '---currentToken');
    const page = this.state.page;
    if (this.mounted) {
      this.setState({
        isloading: page == 1 || page == 'all' ? true : false,
        userListLoading: true,
      });
    }
    var self = this;
    const sort_by = this.state.sort_by;
    const sort_order = this.state.sort_order;
    const searchString = this.state.srch_q;
    const status = this.state.clickedBox;
    const hide_expired = this.state.hide_expired ? 1 : 0;

    console.log(
      config.BASE_URL +
        'alltickets?api_token=' +
        currentToken +
        '&app_version=' +
        app_version +
        '&sort_by=' +
        sort_by +
        '&sort_order=' +
        sort_order +
        '&page=' +
        page +
        '&search_key=' +
        searchString +
        '&status=' +
        status +
        '&hide_expired=' +
        hide_expired,
      '-----------url',
    );
    
    fetch(
      config.BASE_URL +
        'alltickets?api_token=' +
        currentToken +
        '&app_version=' +
        app_version +
        '&sort_by=' +
        sort_by +
        '&sort_order=' +
        sort_order +
        '&page=' +
        page +
        '&search_key=' +
        searchString +
        '&status=' +
        status +
        '&hide_expired=' +
        hide_expired,
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + currentToken,
        },
      },
    ) 
      .then(
        response => response.json()) 
      .then(res => {
        console.log(res, '---------RES');
        if (this.mounted) {
          
          if (res?.status == 1) {
            
            let newTickets = res?.data;
            const alreadyTickets = page === 1 ? [] : this.state.tickets;
            console.log(alreadyTickets,"---alreadyTicketsalreadyTicketsalreadyTicketsalreadyTicketsalreadyTicketsalreadyTickets")
            let results = alreadyTickets.concat(newTickets);
            console.log('----------------------------result runnin',results)
            if(this.state.filterRecord)
              {
                this.setState({
                  filterRecord:false
                })
              }
            this.setState({
              tickets: results,
              result: results,
              page: page == 'all' ? 'all' : page + 1,
              totalpages: res?.totalpages || 0,
            });
          } else if (res?.status == 0) {
            if (res?.error_type && res?.error_type == 'app_update') {
              _updateAppMessage(res?.message);

              return;
            }
            _showErrorMessage(res?.message);
          }

          this.setState({
            isloading: false,
            userListLoading: false,
          });
        }
      })
      .catch(err => {
        if (this.mounted) {
          console.log(err);
          _showErrorMessage('Something went wrong, Try again later.');
          this.setState({
            isloading: false,
          });
        }
      })
      .done();
  }

  clickedTab = tab => {
    this.setState(
      {
        activeView: tab,
        result: [],
        page: tab == 'map' ? 'all' : 1,
      },
      () => {
        this._fetchTickets();
      },
    );
  };

  componentWillUnmount() {
    //this.focusListener();
    this.mounted = false;
  }

  clickTicket = ticket => {
    this.setState({ticketInfoModalVisible: false});
    this.props.navigation.navigate('TicketDetail', {ticket: ticket});
  };

  addTicket = () => {
    this.props.navigation.navigate('AddTicket');
  };

  searchHandler = async string => {
    const _this = this;
    console.log('string--------', string);
    _this.setState(
      {
        srch_q: string,
        prev_srch_q: string,
        page: 1,
      },
      () => {
        setTimeout(() => {
          if (this.state.userListLoading == false) {
            _this._fetchTickets();
          }
        }, 100);
      },
    );
  };

  filterTicket = type => {
    let statusType = type;
    if (type == this.state.clickedBox) {
      statusType = '';
    }
    this.setState(
      {
        clickedBox: statusType,
        page: 1,
      },
      () => {
        setTimeout(() => {
          if (this.state.userListLoading == false) {
            this._fetchTickets();
          }
        }, 100);
      },
    );
  };

  filterExpired() {
    var hide_expired = this.state.hide_expired ? false : true;
    const tab = this.state.activeView;
    var self = this;
    _setHideExpired(hide_expired).then(res => {
      this.setState(
        {
          hide_expired: hide_expired,
          page: tab == 'map' ? 'all' : 1,
        },
        () => {
          self._fetchTickets();
        },
      );
    });
  }

  _onMarkerPress = (markerData, index) => {
    this.setState({
      ticketInfoModalVisible: true,
      openTicketNum: markerData.ticket,
      openJobName: markerData.name,
      openTicketStatus: markerData.status,
      openTicketIndex: markerData,
    });
  };

  renderTicketInfoModal() {
    return (
      <View style={[styles.MainContainer, {width: '100%'}]}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.ticketInfoModalVisible}
          // visible={true}
          onRequestClose={() => {}}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
              padding: 5,
            }}>
            <View style={[styles.ModalInsideView, {height: 300}]}>
              <View
                style={{
                  backgroundColor: '#febf26',
                  padding: 5,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <H2 style={{fontFamily: 'RacingSansOne-Regular'}}>
                  {this.props.t('Ticket Info')}
                </H2>
              </View>
              <View
                style={{marginRight: 5, marginLeft: 5, alignItems: 'center'}}>
                <Image
                  source={image[this.state.openTicketIndex.classs]}
                  style={{height: 50, width: 40}}
                  resizeMode="contain"
                />
              </View>
              <View style={{margin: 10, alignItems: 'center'}}>
                <Text style={{fontWeight: 'bold'}}>{this.props.t('TICKET')}:</Text>
                <Text>#{this.state.openTicketNum}</Text>
              </View>
              <View style={{margin: 10, alignItems: 'center'}}>
                <Text style={{fontWeight: 'bold'}}>{this.props.t('JOB NAME')}:</Text>
                <Text>{this.state.openJobName}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  margin: 10,
                  justifyContent: 'space-between',
                  position: 'absolute',
                  bottom: 10,
                }}>
                <Button
                  small
                  style={{
                    backgroundColor: '#da5531',
                    justifyContent: 'center',
                    color: '#fff',
                    width: '45%',
                  }}
                  onPress={() =>
                    this.setState({ticketInfoModalVisible: false})
                  }>
                  <Text style={{color: '#fff', textAlign: 'center'}}>
                    {this.props.t('Cancel')}
                  </Text>
                </Button>
                <Button
                  small
                  style={{
                    backgroundColor: 'green',
                    justifyContent: 'center',
                    color: '#fff',
                    width: '50%',
                  }}
                  onPress={() => this.clickTicket(this.state.openTicketIndex)}>
                  <Text style={{color: '#fff', textAlign: 'center'}}>
                    {this.props.t('View Ticket')}
                  </Text>
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  getPinColor = status => {
    if (status == 'Pending') {
      return 'yellow';
    } else if (status == 'Closed') {
      return '#f50202';
    } else if (status == 'Cleared') {
      return '#03730b';
    }
    return 'black';
  };

  //Calculate the initialRegion from multiple coordinates
  getRegionForCoordinates = points => {
    // points should be an array of { latitude: X, longitude: Y }
    let minX, maxX, minY, maxY;

    // init first point
    (point => {
      minX = point.latitude;
      maxX = point.latitude;
      minY = point.longitude;
      maxY = point.longitude;
    })(points[0]);

    // calculate rect
    points.map(point => {
      minX = Math.min(minX, point.latitude);
      maxX = Math.max(maxX, point.latitude);
      minY = Math.min(minY, point.longitude);
      maxY = Math.max(maxY, point.longitude);
    });

    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;
    const deltaX = maxX - minX;
    const deltaY = maxY - minY;

    return {
      latitude: midX,
      longitude: midY,
      latitudeDelta: deltaX,
      longitudeDelta: deltaY,
    };
  };

  refreshTicket(ticket_id = 'all') {
    this.setState({
      isloading: true,
    });
    var ticketNumbers = [];
    var _this = this;
    if (ticket_id == 'all') {
      this.state.result.map((k, v) => {
        if (k.ticket != '' && k.days >= 0 && k.days <= 10) {
          ticketNumbers.push(k.ticket);
        }
      });
    } else {
      ticketNumbers.push(ticket_id);
    }
    const formdata = new FormData();
    formdata.append('tickets', JSON.stringify(ticketNumbers));
    const token = config.currentToken;
    fetch(config.BASE_URL + 'save-ticket?api_token=' + token, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: formdata,
    })
      .then(response => response.json())
      .then(res => {
        if (this.mounted) {
          if (res.status == 1) {
            //_showSuccessMessage(res.success_msg, true);
            this.setState({
              alertMessage:
                'Response has been updated with the latest information from 811.',
              alertModalVisible: true,
            });
            setTimeout(() => _this._fetchTickets(token), 200);
          } else if (res.status == 0) {
            let errorMessage = '';
            if (typeof res.error != 'undefined') {
              this.setState({
                alertMessage: res.error_msg,
                alertModalVisible: true,
              });
            } else {
              this.setState({
                alertMessage: 'No update found!',
                alertModalVisible: true,
              });
            }
            //_showErrorMessage(res.error_msg, true);
          }

          this.setState({
            isloading: false,
          });
        }
      })
      .catch(err => {
        if (this.mounted) {
          _showErrorMessage('Something went wrong, Try again later.');
          this.setState({
            isloading: false,
          });
        }
      })
      .done();
  }

  handleScroll({nativeEvent: {contentSize, contentOffset}}) {
    if (this.state.activeView == 'map') return;
    //console.log("scrollll callllll"+contentSize.height) ;
    //console.log("yyy"+contentOffset.y);
    const getMoreUsersScrollHeightOffset = 1000;
    const currentPage = this.state.page;
    const totalpages = this.state.totalpages;
    if (contentOffset.y <= 0) {
      this.setState({
        isloading: false,
      });
      return;
    }

    if (this.state.userListLoading || currentPage > totalpages) {
      return;
    }

    if (
      contentOffset.y > 0 &&
      contentOffset.y > contentSize.height - getMoreUsersScrollHeightOffset
    ) {
      //console.log("inside");
      this._fetchTickets(config.currentToken);
    }
  }

  alertModal = () => {
    return (
      <View style={[styles.MainContainer, {width: '100%'}]}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.alertModalVisible}
          onRequestClose={() => {}}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
              padding: 5,
            }}>
            <View style={[styles.ModalInsideView, {height: 180}]}>
              <View
                style={{
                  backgroundColor: '#febf26',
                  padding: 5,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <H2 style={{fontFamily: 'RacingSansOne-Regular'}}>Alert</H2>
              </View>
              <View style={{margin: 10, justifyContent: 'center', height: 50}}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}>
                  {this.state.alertMessage}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: 'center',
                }}>
                <Button
                  small
                  style={{
                    backgroundColor: '#da5531',
                    justifyContent: 'center',
                    color: '#fff',
                    width: '100%',
                  }}
                  onPress={() =>
                    this.setState({alertModalVisible: false, alertMessage: ''})
                  }>
                  <Text style={{color: '#fff', textAlign: 'center'}}>
                    Close
                  </Text>
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  render() {
    const TicketStatusBox = () => {
      let st = this.state.clickedBox;
      let activeView = this.state.activeView;
      return (
        <View>
          <View style={{backgroundColor: '#313131'}}>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={styles.manageTouch}
                onPress={() => this.filterTicket('cleared')}>
                <View
                  style={{
                    margin: 5,
                    backgroundColor: st == 'cleared' ? '#fff' : '',
                  }}>
                  <View style={{alignSelf: 'center'}}>
                    <Image
                      source={image.cleared}
                      style={styles.manageImage}
                      resizeMode="contain"
                    />
                  </View>
                  <Text
                    style={[
                      styles.manageText,
                      {color: st == 'cleared' ? '#5E9B3E' : '#fff'},
                    ]}>
                    {this.state.ticketStatus.cleared.count}
                  </Text>
                  <Text
                    style={[
                      styles.manageTextb,
                      {color: st == 'cleared' ? '#5E9B3E' : '#fff'},
                    ]}>
                    {this.props.t('Cleared')}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.manageTouch}
                onPress={() => this.filterTicket('pending')}>
                <View
                  style={{
                    margin: 5,
                    backgroundColor: st == 'pending' ? '#fff' : '',
                  }}>
                  <View style={{alignSelf: 'center'}}>
                    <Image
                      source={image.pending}
                      style={styles.manageImage}
                      resizeMode="contain"
                    />
                  </View>
                  <Text
                    style={[
                      styles.manageText,
                      {color: st == 'pending' ? '#FDC431' : '#fff'},
                    ]}>
                    {this.state.ticketStatus.pending.count}
                  </Text>
                  <Text
                    style={[
                      styles.manageTextb,
                      {color: st == 'pending' ? '#FDC431' : '#fff'},
                    ]}>
                    {this.props.t('Pending')}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.manageTouch}
                onPress={() => this.filterTicket('expired')}>
                <View
                  style={{
                    margin: 5,
                    backgroundColor: st == 'expired' ? '#fff' : '',
                  }}>
                  <View style={{alignSelf: 'center'}}>
                    <Image
                      source={image.expired}
                      style={styles.manageImage}
                      resizeMode="contain"
                    />
                  </View>
                  <Text
                    style={[
                      styles.manageText,
                      {color: st == 'expired' ? '#D75631' : '#fff'},
                    ]}>
                    {this.state.ticketStatus?.expired?.count}
                  </Text>
                  <Text
                    style={[
                      styles.manageTextb,
                      {color: st == 'expired' ? '#D75631' : '#fff'},
                    ]}>
                    {this.props.t('Expired')}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.manageTouch}
                onPress={() => this.filterTicket('cancelled')}>
                <View
                  style={{
                    margin: 5,
                    backgroundColor: st == 'cancelled' ? '#fff' : '',
                  }}>
                  <View style={{alignSelf: 'center'}}>
                    <Image
                      source={image.closed}
                      style={styles.manageImage}
                      resizeMode="contain"
                    />
                  </View>
                  <Text
                    style={[
                      styles.manageText,
                      {color: st == 'cancelled' ? '#D75631' : '#fff'},
                    ]}>
                    {this.state.ticketStatus?.cancelled?.count}
                  </Text>
                  <Text
                    style={[
                      styles.manageTextb,
                      {color: st == 'cancelled' ? '#D75631' : '#fff'},
                    ]}>
                    {this.props.t('Cancelled')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <Text
              style={{
                marginBottom: 5,
                marginLeft: 5,
                fontSize: 14,
                fontStyle: 'italic',
                color: '#fff',
              }}>
              {this.props.t('Click a status to filter results')}
            </Text>
          </View>
          {st != 'expired' && (
            <View>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  marginTop: 5,
                }}
                onPress={() => this.filterExpired()}>
                <View style={{marginRight: 5}}>
                  <CheckBox
                    checked={this.state.hide_expired}
                    style={{left: 0}}
                    color={this.state.hide_expired ? 'green' : '#D3D3D3'}
                    onPress={() => this.filterExpired()}
                  />
                </View>
                {/*<Icon name={(this.state.hide_expired) ? 'checkbox' : 'md-square-outline'} />*/}
                <Text
                  style={{
                    fontSize: 14,
                    fontStyle: 'italic',
                    textAlign: 'center',
                  }}>
                  {this.props.t('Check to hide expired tickets from the')}{' '}
                  {activeView ==  `${this.props.t('map')}` ? `${this.props.t('map')}` :  `${this.props.t('list')}`} {this.props.t('below')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      );
    };

    const {activeView} = this.state;

    return (
      <SafeAreaView
        style={{flex: 1, backgroundColor: '#6f6f6f'}}
        showsVerticalScrollIndicator={false}>
        {/*<ScrollView onScroll={event => this.handleScroll(event)} scrollEventThrottle={50}>*/}
        <Container>
          <ScrollView
            ref={c => {
              this.scroll = c;
            }}
            scrollToOverflowEnabled={true}
            style={{flex: 1}}
            scrollEventThrottle={16}
            overScrollMode={'always'}
            onScroll={event => this.handleScroll(event)}>
            <CustomeHeader {...this.props} />
            <Content>
              <View style={{margin: 10}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 35,
                    alignItems: 'center',
                  }}>
                  <View style={{width: '100%'}}>
                    <H1 style={{fontFamily: 'RacingSansOne-Regular'}}>
                      {this.props.t('MANAGE TICKETS')} 
                    </H1>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                      }}>
                      <TouchableOpacity
                        style={{
                          padding: 15,
                          backgroundColor:
                            activeView == 'table' ? '#FFBC42' : '#9d9d9d',
                          width: '49%',
                          borderTopLeftRadius: 10,
                          borderTopRightRadius: 10,
                        }}
                        onPress={() => this.clickedTab('table')}>
                        <Text
                          style={{
                            color: '#000',
                            fontSize: 20,
                            textAlign: 'center',
                          }}>
                          {this.props.t('Table View')}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          padding: 15,
                          backgroundColor:
                            activeView == 'map' ? '#FFBC42' : '#9d9d9d',
                          width: '49%',
                          borderTopLeftRadius: 10,
                          borderTopRightRadius: 10,
                        }}
                        onPress={() => this.clickedTab('map')}>
                        <Text
                          style={{
                            color: '#000',
                            fontSize: 20,
                            textAlign: 'center',
                          }}>
                          {this.props.t('Map View')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                {/* START TABLE VIEW */}
                {activeView == 'table' && (
                  <View
                    style={{
                      padding: 5,
                      borderWidth: 2,
                      borderColor: '#D2D2D2',
                      paddingTop: 10,
                    }}>
                    <TicketStatusBox />
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        marginTop: 10,
                        flexWrap: 'wrap',
                      }}>
                      <H3
                        style={{
                          fontFamily: 'RacingSansOne-Regular',
                          width: '50%',
                          alignSelf: 'center',
                        }}>
                        {this.props.t('Search Tickets')}
                      </H3>
                    </View>
                    <Form>
                      {/*<Item regular style={{marginTop: 5}}>
							<Icon name='search' />
								<Input placeholder='Search' onChangeText={(searchString) => this.searchHandler(searchString)} />
							</Item>*/}
                      <Item regular style={{marginTop: 5}}>
                        <Input
                          placeholder={this.props.t('Search')}
                          defaultValue={this.state.srch_q}
                          onChangeText={searchString =>
                            this.setState({srch_q: searchString})
                          }
                        />
                        {/* {console.log(
                          'this.state.prev_srch_q.length -----------',
                          this.state.prev_srch_q.length,
                          '-----',
                          this.state.srch_q,
                          '------',
                          this.state.prev_srch_q,
                        )} */}
                        {this.state.prev_srch_q.length > 0 &&
                        this.state.prev_srch_q == this.state.srch_q ? (
                          <Icon
                            type="FontAwesome"
                            name={'close'}
                            onPress={() => this.searchHandler('')}
                          />
                        ) : (
                          <Icon
                            type="FontAwesome"
                            name={'search'}
                            onPress={() =>
                              this.searchHandler(this.state.srch_q)
                            }
                          />
                        )}
                        {/*<TouchableOpacity onPress={() => this.searchHandler(this.state.srch_q)} style={{  padding: 10, width: 50, textAlign: 'right'}}>
														<Icon name={'search'} />
													</TouchableOpacity>*/}
                      </Item>
                    </Form>
                    <View
                      style={{
                        flexDirection: 'row',
                        backgroundColor: '#333',
                        padding: 15,
                      }}>
                      <TouchableOpacity
                        onPress={() => this.sortTicket('ticket_no')}
                        style={{flex: 1, alignSelf: 'flex-start'}}>
                        <Text
                          style={{
                            fontSize: 14,
                            textAlign: 'left',
                            color: '#fff',
                            fontFamily: 'OpenSans-Bold',
                          }}>
                          {this.props.t('STATUS/TICKET#')}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => this.sortTicket('job_name')}
                        style={{
                          flex: 1,
                          marginRight: 2,
                          alignSelf: 'flex-end',
                        }}>
                        <Text
                          style={{
                            fontSize: 14,
                            textAlign: 'right',
                            color: '#fff',
                            fontFamily: 'OpenSans-Bold',
                          }}>
                          {this.props.t('JOB NAME')}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => this.sortTicket('expirydate')}
                        style={{
                          flex: 1,
                          marginRight: 2,
                          alignSelf: 'flex-end',
                        }}>
                        <Text
                          style={{
                            fontSize: 14,
                            textAlign: 'right',
                            color: '#fff',
                            fontFamily: 'OpenSans-Bold',
                          }}>
                          {this.props.t('EXPIRING')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {this.state.result.map((key, i) => {
                      console.log('-----------', i, key.ticket)
                      return (
                        <TouchableOpacity
                          key={key.ticket}
                          onPress={() => this.clickTicket(key)}>
                          <Body
                            style={{
                              height: 50,
                              flexDirection: 'row',
                              backgroundColor:
                                i % 2 == 0 ? '#D2D2D2' : '#e4e4e4',
                              paddingRight: 12,
                            }}>
                            <View style={{marginRight: 5, marginLeft: 5}}>
                              <Image
                                source={image[key.classs]}
                                style={{height: 25, width: 20}}
                                resizeMode="contain"
                              />
                            </View>
                            <View style={{flex: 1, paddingLeft: 5}}>
                              <Text
                                style={{
                                  fontSize: 13,
                                  textAlign: 'left',
                                  fontFamily: 'OpenSans-Bold',
                                }}>
                                {key.ticket}
                              </Text>
                            </View>
                            <View style={{flex: 1}}>
                              <Text
                                style={{
                                  fontSize: 13,
                                  textAlign: 'right',
                                  fontFamily: 'OpenSans-Regular',
                                  color: '#000',
                                }}>
                                {key.name}
                              </Text>
                            </View>
                            <View
                              style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                              }}>
                              {key?.days_left && (
                                <Text
                                  style={{
                                    fontSize: 13,
                                    textAlign: 'right',
                                    fontFamily: 'OpenSans-Regular',
                                    color:
                                      key?.days_left == 'Expired' ||
                                      key?.days_left == 'Cancelled'
                                        ? 'red'
                                        : '#000',
                                  }}>
                                  {key?.days_left || ''}
                                </Text>
                              )}
                              {/*{

																	(key.days_left != "Expired" && key?.days && key?.days >= 0 && key?.days <= 10) && <TouchableOpacity key={"ref" + key?.ticket} onPress={() => this.refreshTicket(key?.ticket)} style={{ width: 30, height: 30, justifyContent: 'center' }}>
																		<Image
																			style={{ alignSelf: 'center', height: 22, width: 22 }}
																source={image?.refresh} /
																	</TouchableOpacity>>
																}*/}
                            </View>
                          </Body>
                        </TouchableOpacity>
                      );
                    })}
                    {this.state.result.length == 0 && (
                      <Text style={{textAlign: 'center'}}>
                        {console.log('-----this.state.filterRecord----',this.state.filterRecord)}
                        {this.state.filterRecord===true?this.props.t('loading records..'):this.props.t('No record found')}.
                      </Text>
                    )}
                    {this.state.page > 1 && this.state.userListLoading == true && (
                      <Text
                        style={{
                          textAlign: 'center',
                          maringTop: 5,
                          maringBottom: 5,
                          fontFamily: 'OpenSans-Bold',
                        }}>
                        Loading more...
                      </Text>
                    )}
                    {/* 
										<View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center', backgroundColor: '#313131', padding: 5, paddingTop: 10, paddingBottom: 10 }}>
											

										  <Image
												style={{ alignSelf: 'center', height: 25, width: 25 }}
												source={image.refresh} />	<Text style={{ fontSize: 12, marginLeft: 5, flexWrap: 'wrap', lineHeight: 12, color: '#fff', width: '90%' }}>If you have renewed a ticket with 811 and kept the same ticket number, you can refresh your expiration date by clicking here.</Text>
										</View>*/}
                  </View>
                )}
                {/* END TABLE VIEW */}

                {/* START MAP VIEW */}
                {activeView == 'map' && (
                  <View>
                    <View style={{margin: 5, marginTop: 10}}>
                      <TicketStatusBox />
                    </View>
                    <MapView
                      ref={ref => (this.mapView = ref)}
                      style={{height: 350, marginTop: 8, flex: 1}}
                      provider={MapView.PROVIDER_GOOGLE}
                      initialRegion={this.state.initialRegion}
                      minZoomLevel={10}
                      showsUserLocation={true}
                      followsUserLocation={true}
                      onRegionChangeComplete={region => {
                        /*this.setState({
													regionChanged: true,
													currentRegion: region
												})*/
                      }}>
                      {this.state.result.map(
                        (marker, index) =>
                          marker.latitude != '' &&
                          marker.longitude != '' && (
                            <Marker
                              key={index}
                              coordinate={{
                                latitude: marker.latitude,
                                longitude: marker.longitude,
                              }}
                              title={'#' + marker.ticket}
                              //pinColor={this.getPinColor(marker.status)}
                              onPress={this._onMarkerPress.bind(
                                this,
                                marker,
                                index,
                              )}>
                              <Image
                                source={
                                  marker.status == 'Pending'
                                    ? image.pending
                                    : marker.status == 'Cleared'
                                    ? image.cleared
                                    : marker.status == 'Cancelled'
                                    ? image.cancelled
                                    : image.expired
                                }
                                style={{width: 20, height: 20}}
                              />
                            </Marker>
                          ),
                      )}
                    </MapView>

                    {this.renderTicketInfoModal()}
                  </View>
                )}
                {/* END MAP VIEW */}
                {this.alertModal()}
                {this.eulaModalContent()}
              </View>
            </Content>
          </ScrollView>
          {this.state.isloading && <Loader />}
        </Container>
      </SafeAreaView>
    );
  }
}

export default withTranslation()(Manage);
const styles = StyleSheet.create({
  manageText: {
    fontFamily: 'OpenSans-Regular',
    alignSelf: 'center',
    color: '#fff',
    fontSize: 20,
  },
  manageTextb: {
    fontFamily: 'OpenSans-Regular',
    alignSelf: 'center',
    color: '#fff',
    paddingBottom: 10,
  },
  manageImage: {
    width: 40,
  },
  manageTouch: {
    flex: 1,
    backgroundColor: '#313131',
  },
  map: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    bottom: 50,
  },
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS == 'ios' ? 40 : 0,
  },
  ModalInsideView: {
    backgroundColor: '#fff',
    height: 300,
    width: '80%',
    borderRadius: 10,
    borderColor: '#ccc',
    borderStyle: 'solid',
    elevation: 20,
    flexDirection: 'column',
  },
  EulaModalInsideView: {
    backgroundColor: '#1b1b1b',
    height: Dimensions.get('window').height - 200,
    width: '90%',
    borderRadius: 10,
    borderColor: '#ccc',
    borderStyle: 'solid',
    elevation: 20,
    flexDirection: 'column',
  },
});
