import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  Linking,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  Platform,
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
  Textarea,
} from 'native-base';
import {
  image,
  config,
  _storeUser,
  _retrieveUser,
  validate,
  _showErrorMessage,
  Loader,
  _showSuccessMessage,
  _phoneFormat,
} from 'assets';
import {WebView} from 'react-native-webview';
import {StackActions, CommonActions} from '@react-navigation/native';
import {withTranslation} from 'react-i18next';

class Common extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticket: this.props.ticket,
      completeInfo: this.props.info,
      modalVisible: false,
      modalMsg: '',
      ticketInfo: '',
      excavatorInfo: '',
      excavationAreaInfo: '',
      modalMapVisible: false,
      eInfoTabActive: false,
      eAreaTabActive: false,
      jobText: '',
      linked_tickets: [],
      mapurl: '',
      showmap: 0,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (typeof props.ticket != 'undefined') {
      if (props.ticket.ticket !== state.ticket.ticket) {
        return {
          ticket: props.ticket,
          ticketInfo: props.ticketInfo,
          excavatorInfo: props.excavatorInfo,
          excavationAreaInfo: props.excavationAreaInfo,
          completeInfo: props.info,
        };
      }
    }
    return null;
  }

  componentDidMount() {
    this.mounted = true;
    this.getTicketExtraInfo(this.state.ticket.ticket);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ticket: nextProps.data});
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  clickTicket = ticket => {
    this.getTicketExtraInfo(ticket.ticket);
    this.setState({
      ticket: ticket,
      linkedTicketsModalVisible: false,
    });
    this.props.clickTicket(ticket);
  };
  getTicketExtraInfo(ticket_no) {
    if (this.mounted) {
      this.props.changeLoadingState(true);
    }
    const token = config.currentToken;
    const formdata = new FormData();
    formdata.append('ticket_no', ticket_no);
    fetch(config.BASE_URL + 'ticket_info?api_token=' + token, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      body: formdata,
    })
      .then(response => response.json())
      .then(res => {
        if (this.mounted) {
          //console.log(JSON.stringify(res, null, 2))
          if (res.status == 1) {
            if (res.data.ticket_info.portal == 'ca') {
              var url =
                'https://onecallcapreprod.undergroundservicealert.org/ngen.web/map/index?RequestNumber=' +
                this.state.ticket.ticket +
                '-000';
            } else {
              var url =
                'https://onecallnvpreprod.undergroundservicealert.org/ngen.web/map/index?RequestNumber=' +
                this.state.ticket.ticket +
                '-000';
            }

            this.setState({
              ticketInfo: res.data.ticket_info,
              showmap: res.data.ticket_info.is_map_view,
              mapurl: url,
            });
            this.setState({excavatorInfo: res.data.excavator_info});
            this.setState({excavationAreaInfo: res.data.excavation_info});
          } else if (res.status == 0) {
            _showErrorMessage(res.message);
          }
          this.props.changeLoadingState(false);
        }
      })
      .catch(err => {
        if (this.mounted) {
          _showErrorMessage('Something went wrong, Try again later.');
          this.props.changeLoadingState(false);
        }
      })
      .done();
  }

  renderModal() {
    return (
      <View style={styless.ModalInsideView}>
        <View
          style={{
            backgroundColor: '#febf26',
            padding: 5,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <H2 style={{fontFamily: 'RacingSansOne-Regular'}}>Message</H2>
        </View>
        <View style={{padding: 15}}>
          <View style={{marginTop: 30}}>
            <Text style={{fontFamily: 'OpenSans-Regular', fontSize: 17}}>
              {this.state.modalMsg}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={{
            position: 'absolute',
            width: '100%',
            height: 40,
            bottom: 0,
            borderTopColor: '#ccc',
            borderTopWidth: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
          onPress={() => {
            this.setModalVisible(!this.state.modalVisible);
          }}>
          <Text
            style={{
              fontSize: 20,
              marginBottom: 5,
              alignItems: 'center',
              fontFamily: 'OpenSans-Bold',
            }}>
            Ok
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  onNavigationStateChange = navState => {
    //console.log(navState);
  };
  renderMapModal() {
    console.log('map url link -----',this.state.excavationAreaInfo.map_link)
    return (
      <View style={[styless.ModalInsideView, {width: '100%', height: 630}]}>
        {this.state.showmap == 0 && (
          <View
            style={{
              backgroundColor: '#febf26',
              padding: 5,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <H2 style={{fontFamily: 'RacingSansOne-Regular'}}>{this.props?.t('SHOW MAP')}</H2>
          </View>
        )}

        <WebView
          source={{uri: this.state.excavationAreaInfo.map_link}}
          mixedContentMode={Platform.OS==='android'?"always":null} //add new props when map not show in android
          originWhitelist={['*']}
          startInLoadingState={true}
          javaScriptEnabled={true}
          scalesPageToFit={true}
          injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=640'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);`}
          scrollEnabled={true}
          bounces={true}
          allowUniversalAccessFromFileURLs={true}
          onNavigationStateChange={this.onNavigationStateChange}

          

domStorageEnabled={true}
        />
        
        {/* <WebView
          source={{uri: this.state.excavationAreaInfo.map_link}}
          mixedContentMode={Platform.OS==='android'?"compatibility":null} //add new props when map not show in android
          startInLoadingState={true}
          javaScriptEnabled={true}
          scalesPageToFit={true}
          injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=640'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);`}
          scrollEnabled={true}
          bounces={true}
          allowUniversalAccessFromFileURLs={true}
          onNavigationStateChange={this.onNavigationStateChange}
        /> */}
        <TouchableOpacity
          style={{
            position: 'absolute',
            width: '100%',
            height: 40,
            bottom: 0,
            borderTopColor: '#ccc',
            borderTopWidth: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
            backgroundColor: '#da5531',
          }}
          onPress={() => {
            this.setMapModalVisible(false);
          }}>
          <Text
            style={{
              fontSize: 20,
              alignItems: 'center',
              fontFamily: 'OpenSans-Bold',
              color: '#fff',
            }}>
            {this.props?.t('Close')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderLinkedTicketsModal() {
    return (
      <View style={[styless.ModalInsideView, {width: '100%', minHeight: 630}]}>
        <ScrollView style={{flex: 1, marginBottom: 40}}>
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
              Linked Tickets
            </H2>
          </View>
          <View style={{margin: 10}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: '#333',
                padding: 10,
              }}>
              <Text
                style={{
                  fontSize: 15,
                  width: '50%',
                  textAlign: 'left',
                  color: '#fff',
                }}>
                Ticket#
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  width: '50%',
                  textAlign: 'left',
                  color: '#fff',
                  marginLeft: 10,
                }}>
                Job Name
              </Text>
            </View>
            {this.state.linked_tickets.map((key, i) => {
              return (
                <TouchableOpacity
                  key={key.ticket}
                  onPress={() => this.clickTicket(key)}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        width: '50%',
                        textAlign: 'left',
                        fontWeight: 'bold',
                        backgroundColor: 'lightgray',
                        padding: 10,
                        marginBottom: 2,
                        textDecorationLine: 'underline',
                      }}>
                      #{key.ticket}
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        width: '50%',
                        textAlign: 'left',
                        fontWeight: 'bold',
                        backgroundColor: 'lightgray',
                        padding: 10,
                        marginBottom: 2,
                      }}>
                      {key.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            position: 'absolute',
            bottom: 0,
          }}>
          <Button
            small
            style={{
              backgroundColor: '#da5531',
              justifyContent: 'center',
              color: '#fff',
              width: '100%',
              height: 40,
            }}
            onPress={() =>
              this.setState({linkedTicketsModalVisible: false, jobText: ''})
            }>
            <Text style={{color: '#fff', textAlign: 'center'}}>Close</Text>
          </Button>
        </View>
      </View>
    );
  }
  showJobModal() {
    this.setState({
      jobText: this.state.ticketInfo.job_name,
      jobModalVisible: true,
    });
  }

  showLinkedTicketsModal() {
    if (this.mounted) {
      this.props.changeLoadingState(true);
    }
    const token = config.currentToken;
    const ticket_id = this.state.ticket.digid;
    const formdata = new FormData();
    formdata.append('eticket_id', ticket_id);
    fetch(config.BASE_URL + 'linked_tickets?api_token=' + token, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      body: formdata,
    })
      .then(response => response.json())
      .then(res => {
        if (this.mounted) {
          if (res.status == 1) {
            this.setState({
              linkedTicketsModalVisible: true,
              linked_tickets: res.data,
            });
          } else if (res.status == 0) {
            _showErrorMessage(res.message);
          }
          this.props.changeLoadingState(false);
        }
      })
      .catch(err => {
        if (this.mounted) {
          _showErrorMessage('Something went wrong, Try again later.');
          this.props.changeLoadingState(false);
        }
      })
      .done();
  }

  saveTicketJob() {
    if (this.mounted) {
      this.props.changeLoadingState(true);
      const token = config.currentToken;
      const formdata = new FormData();
      formdata.append('eticket_id', this.state.ticket.digid);
      formdata.append('jobname', this.state.jobText);

      fetch(config.BASE_URL + 'update-jobname?api_token=' + token, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
        },
        body: formdata,
      })
        .then(response => response.json())
        .then(res => {
          if (this.mounted) {
            if (res.success == 1) {
              _showSuccessMessage(res.message);
              var ticketInfo = {...this.state.ticketInfo};
              ticketInfo.job_name = this.state.jobText;
              this.setState({ticketInfo});
            } else if (res.success == 0) {
              _showErrorMessage(res.message);
            }
            this.setState({
              jobText: '',
              jobModalVisible: false,
            });
            this.props.changeLoadingState(false);
          }
        })
        .catch(err => {
          this.props.changeLoadingState(false);
          if (this.mounted) {
            _showErrorMessage('Something went wrong, Try again later.');
          }
        })
        .done();
    }
  }

  ticketInfo() {
    const info = this.state.ticketInfo;
    const is_ticket_linked = this.state.ticket.linkedid;
    return (
      <View style={{flex: 1}}>
        <View style={{backgroundColor: '#313131', padding: 10}}>
          <View
            style={{
              flexWrap: 'wrap',
              flexDirection: 'row',
              minHeight: 20,
              maxHeight: 60,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}>
            <Text
              style={{fontSize: 14, color: '#fff', opacity: 0.9, width: '50%'}}>
              {this.props.t('JOB NAME')}:{' '}
            </Text>
            <TouchableOpacity
              onPress={() => this.showJobModal()}
              style={{flex: 1}}>
              <Text
                style={{
                  fontSize: 14,
                  color: '#fff',
                  fontWeight: 'bold',
                  textDecorationLine: 'underline',
                  flexWrap: 'wrap',
                }}>
                {info.job_name == '' ? 'N/A' : info.job_name}
              </Text>
            </TouchableOpacity>
          </View>
          {is_ticket_linked == 1 && (
            <View
              style={{
                flexWrap: 'wrap',
                flexDirection: 'row',
                height: 20,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: '#fff',
                  opacity: 0.9,
                  width: '50%',
                }}>
                {this.props.t('LINKED TICKET')}:{' '}
              </Text>
              <TouchableOpacity onPress={() => this.showLinkedTicketsModal()}>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#fff',
                    fontWeight: 'bold',
                    textDecorationLine: 'underline',
                  }}>
                  {this.props.t('View Tickets')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <View
            style={{
              flexWrap: 'wrap',
              flexDirection: 'row',
              marginBottom: 2,
              minHeight: 20,
              alignItems: 'center',
            }}>
            <Text
              style={{fontSize: 14, color: '#fff', opacity: 0.9, width: '50%'}}>
              {this.props.t('ORIGINAL START DATE')}:{' '}
            </Text>
            <Text style={{fontSize: 14, color: '#fff', fontWeight: 'bold'}}>
              {info?.original_start == '' ? 'N/A' : info?.original_start}
            </Text>
          </View>
          <View
            style={{
              flexWrap: 'wrap',
              flexDirection: 'row',
              marginBottom: 2,
              minHeight: 20,
              alignItems: 'center',
            }}>
            <Text
              style={{fontSize: 14, color: '#fff', opacity: 0.9, width: '50%'}}>
              {this.props.t('FIELD MANAGER')}:{' '}
            </Text>
            <Text style={{fontSize: 14, color: '#fff', fontWeight: 'bold'}}>
              {info.manager_name == '' ? 'N/A' : info.manager_name}
            </Text>
          </View>

          <View
            style={{
              flexWrap: 'wrap',
              flexDirection: 'row',
              minHeight: 20,
              alignItems: 'center',
            }}>
            <Text
              style={{fontSize: 14, color: '#fff', opacity: 0.9, width: '50%'}}>
              {this.props.t('FIELD USER')}:{' '}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: '#fff',
                fontWeight: 'bold',
                flexWrap: 'wrap',
                width: '50%',
              }}>
              {info.contact_name == '' ? 'N/A' : info.contact_name}
            </Text>
          </View>

          <View
            style={{flexDirection: 'row', height: 20, alignItems: 'center'}}>
            <Text
              style={{fontSize: 14, color: '#fff', opacity: 0.9, width: '50%'}}>
              {this.props.t('DAYS UNTIL EXPIRATION')}:{' '}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color:
                  info.days_left == 'Expired' || info.days_left == 'Cancelled'
                    ? 'red'
                    : '#fff',
                fontWeight: 'bold',
              }}>
              {info.days_left}
            </Text>
          </View>
          <View
            style={{flexDirection: 'row', height: 20, alignItems: 'center'}}>
            <Text
              style={{fontSize: 14, color: '#fff', opacity: 0.9, width: '50%'}}>
              {this.props.t('Legal Start Date')}:{' '}
            </Text>
            <Text style={{fontSize: 14, color: '#fff', fontWeight: 'bold'}}>
              {info.start_date}
            </Text>
          </View>
          <View
            style={{flexDirection: 'row', height: 20, alignItems: 'center'}}>
            <Text
              style={{fontSize: 14, color: '#fff', opacity: 0.9, width: '50%'}}>
              {this.props.t('Legal Start Time')}:{' '}
            </Text>
            <Text style={{fontSize: 14, color: '#fff', fontWeight: 'bold'}}>
              {info.start_time}
            </Text>
          </View>
          <View
            style={{flexDirection: 'row', height: 20, alignItems: 'center'}}>
            <Text
              style={{fontSize: 14, color: '#fff', opacity: 0.9, width: '50%'}}>
              {this.props.t('Expire Date')}:{' '}
            </Text>
            <Text style={{fontSize: 14, color: '#fff', fontWeight: 'bold'}}>
              {info.expiry_date}
            </Text>
          </View>
          <View
            style={{flexDirection: 'row', height: 20, alignItems: 'center'}}>
            <Text
              style={{fontSize: 14, color: '#fff', opacity: 0.9, width: '50%'}}>
              {this.props.t('Expire Time')}:{' '}
            </Text>
            <Text style={{fontSize: 14, color: '#fff', fontWeight: 'bold'}}>
              {info.expiry_time}
            </Text>
          </View>
          <View
            style={{
              flexWrap: 'wrap',
              flexDirection: 'row',
              height: 20,
              alignItems: 'center',
            }}>
            <Text
              style={{fontSize: 14, color: '#fff', opacity: 0.9, width: '50%'}}>
              {this.props.t('PHOTOS')}:{' '}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: '#fff',
                fontWeight: 'bold',
                width: '50%',
              }}>
              {info.total_image}
            </Text>
          </View>
          <View
            style={{
              flexWrap: 'wrap',
              flexDirection: 'row',
              height: 20,
              alignItems: 'center',
            }}>
            <Text
              style={{fontSize: 14, color: '#fff', opacity: 0.9, width: '50%'}}>
              {this.props.t('INCIDENTS/DAMAGE')}:{' '}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: '#fff',
                fontWeight: 'bold',
                width: '50%',
              }}>
              {info.damage_image}
            </Text>
          </View>
          {info?.pdf_link && info?.pdf_link != '' && (
            <View
              style={{
                flexWrap: 'wrap',
                flexDirection: 'row',
                height: 20,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: '#fff',
                  opacity: 0.9,
                  width: '50%',
                }}>
                {this.props.t('SHOW TICKET INFO')}:{' '}
              </Text>
              <Text
                onPress={() =>
                  Linking.openURL(info?.pdf_link).catch(() => null)
                }
                style={{
                  fontSize: 14,
                  color: '#fff',
                  textDecorationLine: 'underline',
                  fontWeight: 'bold',
                  width: '50%',
                }}>
                {this.props.t('PDF')}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  excavatorInfo() {
    const info = this.state.excavatorInfo;
    return (
      <View
        style={{
          flex: 1,
          marginTop: 5,
          backgroundColor: '#313131',
          paddingBottom: 5,
          paddingLeft: 5,
          paddingRight: 5,
        }}>
        <TouchableHighlight
          onPress={() =>
            this.setState({eInfoTabActive: !this.state.eInfoTabActive})
          }>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                fontFamily: 'RacingSansOne-Regular',
                fontSize: 20,
                color: '#febf26',
                fontWeight: 'bold',
                fontStyle: 'italic',
                margin: 10,
              }}>
              {this.props.t('Excavator Information')}
            </Text>
            <Image
              source={
                this.state.eInfoTabActive ? image.arrowDown : image.arrowRight
              }
              resizeMode="contain"
              style={{margin: 15}}
            />
          </View>
        </TouchableHighlight>
        {this.state.eInfoTabActive && (
          <View style={{margin: 10}}>
            {info.company != '' && (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginTop: 10,
                  alignItems: 'center',
                  marginBottom: 2,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    width: '30%',
                    fontSize: 14,
                    opacity: 0.9,
                  }}>
                  {this.props.t('Company')}:
                </Text>
                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>
                  {info.company}
                </Text>
              </View>
            )}
            {info.address != '' && (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  marginBottom: 2,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    width: '30%',
                    fontSize: 14,
                    opacity: 0.9,
                    width: '30%',
                  }}>
                  {this.props.t('Co Addr')}:
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 14,
                    width: '70%',
                  }}>
                  {info.address}
                </Text>
              </View>
            )}
            {info.city != '' && (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  marginBottom: 2,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    width: '30%',
                    fontSize: 14,
                    opacity: 0.9,
                  }}>
                  {this.props.t('City')}:
                </Text>
                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>
                  {info.city}
                </Text>
              </View>
            )}
            {info.state != '' && (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  marginBottom: 2,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    width: '30%',
                    fontSize: 14,
                    opacity: 0.9,
                  }}>
                  {this.props.t('State')}:
                </Text>
                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>
                  {info.state}
                </Text>
              </View>
            )}
            {info.zip != '' && (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  marginBottom: 2,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    width: '30%',
                    fontSize: 14,
                    opacity: 0.9,
                  }}>
                  {this.props.t('Zip')}:
                </Text>
                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>
                  {info.zip}
                </Text>
              </View>
            )}
            {info.name != '' && (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  marginBottom: 2,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    width: '30%',
                    fontSize: 14,
                    opacity: 0.9,
                  }}>
                  {this.props.t('Created By')}:
                </Text>
                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>
                  {info.name}
                </Text>
              </View>
            )}
            {info.language != '' && (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  marginBottom: 2,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    width: '30%',
                    fontSize: 14,
                    opacity: 0.9,
                  }}>
                  {this.props.t('Language')}:
                </Text>
                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>
                  {info.language}
                </Text>
              </View>
            )}
            {info.phone != '' && (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  marginBottom: 2,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    width: '30%',
                    fontSize: 14,
                    opacity: 0.9,
                  }}>
                  {this.props.t('Office Phone')}:
                </Text>
                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>
                  {info.phone}
                </Text>
              </View>
            )}
            {info.cell != '' && (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  marginBottom: 2,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    width: '30%',
                    fontSize: 14,
                    opacity: 0.9,
                  }}>
                  {this.props.t('SMS/Cell')}:
                </Text>
                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>
                  {info.cell}
                </Text>
              </View>
            )}
            {info.email != '' && (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  marginBottom: 2,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    width: '30%',
                    fontSize: 14,
                    opacity: 0.9,
                  }}>
                  {this.props.t('Office Email')}:
                </Text>
                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>
                  {info.email}
                </Text>
              </View>
            )}
            {info.site_contact != '' && (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  marginBottom: 2,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    width: '30%',
                    fontSize: 14,
                    opacity: 0.9,
                  }}>
                  {this.props.t('Site Contact')}:
                </Text>
                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>
                  {info.site_contact}
                </Text>
              </View>
            )}
            {info.site_phone != '' && (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  marginBottom: 2,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    width: '30%',
                    fontSize: 14,
                    opacity: 0.9,
                  }}>
                  {this.props.t('Site Phone')}:
                </Text>
                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>
                  {info.site_phone}
                </Text>
              </View>
            )}
            {info.site_cell != '' && (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  marginBottom: 2,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    width: '30%',
                    fontSize: 14,
                    opacity: 0.9,
                  }}>
                  {this.props.t('Site SMS/Cell')}:
                </Text>
                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>
                  {info.site_cell}
                </Text>
              </View>
            )}
            {info.site_email != '' && (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginBottom: 10,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: '#fff',
                    width: '30%',
                    fontSize: 14,
                    opacity: 0.9,
                  }}>
                  {this.props.t('Site Email')}:
                </Text>
                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>
                  {info.site_email}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  }

  excavationAreaInfo() {
    const info = this.state.excavationAreaInfo;
    return (
      <View
        style={{
          flex: 1,
          marginTop: 5,
          backgroundColor: '#313131',
          paddingBottom: 5,
          paddingLeft: 5,
          paddingRight: 5,
        }}>
        <TouchableHighlight
          onPress={() =>
            this.setState({eAreaTabActive: !this.state.eAreaTabActive})
          }>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                fontFamily: 'RacingSansOne-Regular',
                fontSize: 20,
                color: '#febf26',
                fontWeight: 'bold',
                fontStyle: 'italic',
                margin: 10,
              }}>
              {this.props.t('Excavation Area')}
            </Text>
            <Image
              source={
                this.state.eAreaTabActive ? image.arrowDown : image.arrowRight
              }
              resizeMode="contain"
              style={{margin: 15}}
            />
          </View>
        </TouchableHighlight>
        {this.state.eAreaTabActive && (
          <View style={{margin: 10}}>
            {info.dig_state_i != '' && (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginTop: 10,
                  alignItems: 'center',
                  marginBottom: 2,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    width: '30%',
                    fontSize: 14,
                    opacity: 0.9,
                  }}>
                  {this.props.t('State')}:
                </Text>
                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>
                  {info.dig_state_i}
                </Text>
              </View>
            )}
            {info.dig_county_i != '' && (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  marginBottom: 2,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    width: '30%',
                    fontSize: 14,
                    opacity: 0.9,
                  }}>
                  {this.props.t('County')}:
                </Text>
                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>
                  {info.dig_county_i}
                </Text>
              </View>
            )}
            {info.dig_place_i != '' && (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  marginBottom: 2,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    width: '30%',
                    fontSize: 14,
                    opacity: 0.9,
                  }}>
                  {this.props.t('Place')}:
                </Text>
                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>
                  {info.dig_place_i}
                </Text>
              </View>
            )}
            {info.dig_zip_i != null && info.dig_zip_i != '' && (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  marginBottom: 2,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    width: '30%',
                    fontSize: 14,
                    opacity: 0.9,
                  }}>
                  {this.props.t('Zip')}:
                </Text>
                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>
                  {info.dig_zip_i}
                </Text>
              </View>
            )}
            {info.company != null && info.company != '' && (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  marginBottom: 2,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    width: '30%',
                    fontSize: 14,
                    opacity: 0.9,
                  }}>
                  {this.props.t('Location')}:
                </Text>
                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>
                  {info.company}
                </Text>
              </View>
            )}
            {info.dig_street_i != '' && (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  marginBottom: 2,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    width: '30%',
                    fontSize: 14,
                    opacity: 0.9,
                  }}>
                  {this.props.t('Address/Street')}:
                </Text>
                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>
                  {info.dig_street_i}
                </Text>
              </View>
            )}
            {info.dig_cross_i_1 != '' && (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  marginBottom: 2,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    width: '30%',
                    fontSize: 14,
                    opacity: 0.9,
                  }}>
                  {this.props.t('X/ST1')}:
                </Text>
                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>
                  {info.dig_cross_i_1}
                </Text>
              </View>
            )}
            {info.dig_cross_i_2 != '' && (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  marginBottom: 2,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    width: '30%',
                    fontSize: 14,
                    opacity: 0.9,
                  }}>
                  {this.props.t('ST2')}:
                </Text>
                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>
                  {info.dig_cross_i_2}
                </Text>
              </View>
            )}
            {info.dig_locate_i != '' && (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  marginBottom: 2,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    width: '30%',
                    fontSize: 14,
                    opacity: 0.9,
                  }}>
                  {this.props.t('Delineated')}:
                </Text>
                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>
                  {info.dig_locate_i}
                </Text>
              </View>
            )}
            {info.premark_method_i != '' && (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  marginBottom: 2,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    width: '30%',
                    fontSize: 14,
                    opacity: 0.9,
                  }}>
                  {this.props.t('Method')}:
                </Text>
                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>
                  {info.premark_method_i}
                </Text>
              </View>
            )}
            {info.work_type != '' && (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  marginBottom: 2,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    width: '30%',
                    fontSize: 14,
                    opacity: 0.9,
                  }}>
                  {this.props.t('Work Type')}:
                </Text>
                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>
                  {info.work_type}
                </Text>
              </View>
            )}
            {info.work_for_i != '' && (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  marginBottom: 2,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    width: '30%',
                    fontSize: 14,
                    opacity: 0.9,
                  }}>
                  {this.props.t('Work For')}:
                </Text>
                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>
                  {info.work_for_i}
                </Text>
              </View>
            )}
            {info.permit_no_i != '' && (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  marginBottom: 2,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    width: '30%',
                    fontSize: 14,
                    opacity: 0.9,
                  }}>
                  {this.props.t('Permit')}:
                </Text>
                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>
                  {info.permit_no_i}
                </Text>
              </View>
            )}
            {info.company != '' && (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  marginBottom: 2,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    width: '30%',
                    fontSize: 14,
                    opacity: 0.9,
                  }}>
                  {this.props.t('Job/Work')}:
                </Text>
                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>
                  {info.company}
                </Text>
              </View>
            )}
            {info.work_order != '' && (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  marginBottom: 2,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    width: '30%',
                    fontSize: 14,
                    opacity: 0.9,
                  }}>
                  {this.props.t('order')}:
                </Text>
                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>
                  {info.work_order}
                </Text>
              </View>
            )}
            <View style={{flex: 1, marginTop: 5}}>
              {info.one_year_i != null && (
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: '#706f6d',
                    justifyContent: 'space-between',
                    marginBottom: 5,
                    padding: 5,
                  }}>
                  <Text style={{color: '#fff', fontSize: 14, opacity: 0.9}}>
                    1 Year:
                  </Text>
                  <Text
                    style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>
                    {info.one_year_i == null
                      ? 'N'
                      : info.one_year_i == 'yes'
                      ? 'Y'
                      : 'N'}
                  </Text>
                </View>
              )}
              {info.boring_i != null && (
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: '#706f6d',
                    justifyContent: 'space-between',
                    textAlign: 'center',
                    marginBottom: 5,
                    padding: 5,
                  }}>
                  <Text style={{color: '#fff', fontSize: 14, opacity: 0.9}}>
                  {this.props.t('Boring')}:
                  </Text>
                  <Text
                    style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>
                    {info.boring_i == null
                      ? 'N'
                      : info.boring_i == 'yes'
                      ? 'Y'
                      : 'N'}
                  </Text>
                </View>
              )}
              {info.excavation_street_i != null && (
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: '#706f6d',
                    justifyContent: 'space-between',
                    textAlign: 'center',
                    marginBottom: 5,
                    padding: 5,
                  }}>
                  <Text style={{color: '#fff', fontSize: 14, opacity: 0.9}}>
                  {this.props.t('Street/Sidewalk')}:
                  </Text>
                  <Text
                    style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>
                    {info.excavation_street_i}
                  </Text>
                </View>
              )}
              {info.vaccum_i != null && (
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: '#706f6d',
                    justifyContent: 'space-between',
                    textAlign: 'center',
                    marginBottom: 5,
                    padding: 5,
                  }}>
                  <Text style={{color: '#fff', fontSize: 14, opacity: 0.9}}>
                  {this.props.t('Vacuum')}:
                  </Text>
                  <Text
                    style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>
                    {info.vaccum_i == null
                      ? 'N'
                      : info.vaccum_i == 'yes'
                      ? 'Y'
                      : 'N'}
                  </Text>
                </View>
              )}
              {info.explosives_i != null && (
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: '#706f6d',
                    justifyContent: 'space-between',
                    textAlign: 'center',
                    marginBottom: 5,
                    padding: 5,
                  }}>
                  <Text style={{color: '#fff', fontSize: 14, opacity: 0.9}}>
                  {this.props.t('Explosives')}:
                  </Text>
                  <Text
                    style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>
                    {info.explosives_i == null
                      ? 'N'
                      : info.explosives_i == 'yes'
                      ? 'Y'
                      : 'N'}
                  </Text>
                </View>
              )}
            </View>
            {this.state.showmap == 0 && (
              <View>
                <TouchableOpacity
                  style={{
                    padding: 10,
                    backgroundColor: '#febf26',
                    width: '40%',
                    marginTop: 10,
                    padding: 2,
                  }}
                  onPress={() => {
                    this.setMapModalVisible(!this.state.modalMapVisible);
                  }}>
                  <Text style={{color: '#000', textAlign: 'center'}}>
                  {this.props.t('Show Map')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        {this.state.showmap == 1 && (
          <View style={{height: 200, backgroundColor: '#6f6f6f'}}>
            <WebView source={{uri: this.state.mapurl}} />
          </View>
        )}
      </View>
    );
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  setMapModalVisible(visible) {
    this.setState({modalMapVisible: visible});
  }

  performThis(code) {
    if (this.mounted) {
      this.props.changeLoadingState(true);
    }
    const token = config.currentToken;

    const formdata = new FormData();
    formdata.append('code', code);
    formdata.append('eticket_id', this.state.completeInfo.digid);

    fetch(config.BASE_URL + 'ticket-actions?api_token=' + token, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      body: formdata,
    })
      .then(response => response.json())
      .then(res => {
        if (this.mounted) {
          if (res.status == 1) {
            if (res.isNew == 1) {
              _showSuccessMessage(res.message);
            } else {
              this.setState({modalVisible: true, modalMsg: res.message});
            }
          } else if (res.status == 0) {
            _showErrorMessage(res.message);
          }
          this.props.changeLoadingState(false);
        }
      })
      .catch(err => {
        if (this.mounted) {
          _showErrorMessage('Something went wrong, Try again later.');
          this.props.changeLoadingState(false);
        }
      })
      .done();
  }

  render() {
    return (
      <ScrollView>
        <View>
          <View style={{marginTop: 25}}>
            <Text
              style={{fontFamily: 'RacingSansOne-Regular', fontSize: 25}}
              onPress={() => this.props.goBack()}>
              <Icon name="chevron-left" type="Entypo" />
              {this.props.t('MANAGE TICKETS')}
            </Text>
          </View>
          <View>
            <View style={{flex: 1, backgroundColor: '#313131'}}>
              <View
                style={{
                  alignSelf: 'center',
                  padding: 10,
                  flexDirection: 'row',
                }}>
                <Image
                  source={image[this.state.ticket.classs]}
                  resizeMode="contain"
                  style={{width: 32, height: 32}}
                />
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    alignSelf: 'center',
                    color: '#fff',
                    paddingLeft: 5,
                    fontSize: 22,
                  }}>
                  {this.state.ticket.status == 'Pending'
                    ? 'TICKET'
                    : this.state.ticket.status}
                </Text>
              </View>
            </View>
            {this.state.ticket.status == 'Cancelled' && (
              <View style={{flex: 2, backgroundColor: '#313131'}}>
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    alignSelf: 'center',
                    color: '#fff',
                    fontSize: 22,
                    paddingTop: 10,
                  }}>
                  # {this.state.ticket.ticket}
                </Text>
              </View>
            )}
            {this.state.ticket.status == 'Closed' && (
              <View style={{flex: 2, backgroundColor: '#313131'}}>
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    alignSelf: 'center',
                    color: '#fff',
                    fontSize: 22,
                    paddingTop: 10,
                  }}>
                  # {this.state.ticket.ticket}
                </Text>
                {/*<Button block small style={{backgroundColor: "#FFBC42", fontFamily:'OpenSans-SemiBold', marginTop: 5, marginRight: 10, marginBottom: 5}}>
	                              <Text style={{color:"#333", fontFamily:'OpenSans-Bold' }}>RE-SUBMIT TICKET</Text>
	                        </Button>*/}
              </View>
            )}
            {this.state.ticket.status == 'Cleared' && (
              <View style={{flex: 2, backgroundColor: '#313131'}}>
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    alignSelf: 'center',
                    color: '#fff',
                    fontSize: 22,
                  }}>
                  # {this.state.ticket.ticket}
                </Text>
              </View>
            )}
            {this.state.ticket.status == 'Pending' && (
              <View style={{flex: 3, backgroundColor: '#313131'}}>
                {/*<Text style={{fontFamily:'OpenSans-Regular', textAlign:'right', color:'#fff',fontSize:22,paddingTop:5, paddingRight: 5, fontStyle:'italic', fontWeight: "600"}}>TICKET</Text>*/}
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    alignSelf: 'center',
                    color: '#fff',
                    fontSize: 22,
                    paddingTop: 5,
                    paddingRight: 5,
                    opacity: 0.9,
                  }}>
                  #{this.state.ticket.ticket}
                </Text>
              </View>
            )}
          </View>
          {this.ticketInfo()}
          {this.excavatorInfo()}
          {this.excavationAreaInfo()}

          <View style={{flexDirection: 'row', marginTop: 5}}>
            {/*<TouchableOpacity onPress={() => this.props.toggleactive('info')} style={{ flex: 1, backgroundColor:(this.props.active == 'info')? '#FFBC42': '#c6c9c6', marginRight:5,paddingTop:25, paddingBottom:25, paddingLeft:5, paddingRight:5 }} >
						<Text style={{fontFamily:'OpenSans-Bold', alignSelf:'center'}}>Ticket</Text>
						<Text style={{fontFamily:'OpenSans-Bold', alignSelf:'center'}}>Information</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => this.props.toggleactive('doc')} style={{ flex: 1, backgroundColor:(this.props.active == 'doc')? '#FFBC42': '#c6c9c6', paddingTop:25,paddingBottom:25,paddingLeft:5,paddingRight:5 }}  >
						<Text style={{fontFamily:'OpenSans-Bold', alignSelf:'center'}}>Ticket</Text>
						<Text style={{fontFamily:'OpenSans-Bold', alignSelf:'center'}}>Documentation</Text>
					</TouchableOpacity>*/}
          </View>
          {this.state.modalVisible && (
            <View style={styless.MainContainer}>
              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {}}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                  }}>
                  {this.renderModal()}
                </View>
              </Modal>
            </View>
          )}
          {this.state.modalMapVisible && (
            <View style={[styless.MainContainer, {width: '100%'}]}>
              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalMapVisible}
                onRequestClose={() => {}}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    padding: 5,
                  }}>
                  {this.renderMapModal()}
                </View>
              </Modal>
            </View>
          )}

          {this.state.jobModalVisible && (
            <View style={[styless.MainContainer, {width: '100%'}]}>
              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.jobModalVisible}
                onRequestClose={() => {}}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    padding: 5,
                  }}>
                  <View style={[styless.ModalInsideView, {height: 180}]}>
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
                        Assign Job Name
                      </H2>
                    </View>
                    <View style={{margin: 10}}>
                      <Textarea
                        rowSpan={2}
                        bordered
                        placeholder="Enter job name here.."
                        style={{backgroundColor: '#fff'}}
                        value={this.state.jobText}
                        onChangeText={jobText => this.setState({jobText})}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        margin: 10,
                        justifyContent: 'space-between',
                      }}>
                      <Button
                        small
                        style={{
                          backgroundColor: 'green',
                          justifyContent: 'center',
                          color: '#fff',
                          width: '40%',
                        }}
                        onPress={() => this.saveTicketJob()}>
                        <Text style={{color: '#fff', textAlign: 'center'}}>
                          Save
                        </Text>
                      </Button>
                      <Button
                        small
                        style={{
                          backgroundColor: '#da5531',
                          justifyContent: 'center',
                          color: '#fff',
                          width: '40%',
                        }}
                        onPress={() =>
                          this.setState({jobModalVisible: false, jobText: ''})
                        }>
                        <Text style={{color: '#fff', textAlign: 'center'}}>
                          Cancel
                        </Text>
                      </Button>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
          )}

          {this.state.linkedTicketsModalVisible && (
            <View
              style={[
                styless.MainContainer,
                {width: '100%', marginTop: Platform.OS == 'ios' ? 20 : 0},
              ]}>
              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.linkedTicketsModalVisible}
                onRequestClose={() => {}}>
                <SafeAreaView
                  showsVerticalScrollIndicator={true}
                  style={{flex: 1}}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      padding: 5,
                    }}>
                    {this.renderLinkedTicketsModal()}
                  </View>
                </SafeAreaView>
              </Modal>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}

export default withTranslation()(Common);

const styless = StyleSheet.create({
  texts: {
    fontFamily: 'OpenSans-Regular',
  },
  ticket_req: {
    fontSize: 28,
    textAlign: 'center',
    marginTop: 20,
    color: '#000000',
    fontFamily: 'OpenSans-Bold',
  },
  button: {
    backgroundColor: '#ffcc2b',
    marginTop: 15,
  },
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS == 'ios' ? 40 : 0,
  },
  ModalInsideView: {
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '#fff',
    height: 200,
    width: '70%',
    borderRadius: 10,
    //borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'solid',
    elevation: 20,
    flexDirection: 'column',
  },
});
