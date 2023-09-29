import React, {Component} from 'react';
import {
  Appearance,
  TextInput,
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  ActivityIndicator,
  ListView,
  Modal,
  Linking,
  Dimensions,
  Platform,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
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
  Toast,
  Root,
  Icon,
  Textarea,
  Body,
  CheckBox,
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
} from 'assets';
import PhotoUpload from 'react-native-photo-upload';
import DocumentPicker from 'react-native-document-picker';
import FastImage from 'react-native-fast-image';
import ImageViewer from 'react-native-image-zoom-viewer';
import {WebView} from 'react-native-webview';
import RNFetchBlob from 'rn-fetch-blob';
import ImagePicker from 'react-native-image-crop-picker';
import DatePicker from 'react-native-datepicker';
import {TimePicker} from 'react-native-simple-time-picker';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
//import { initialMode } from 'react-native-dark-mode';
import {withTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
const app_version = config?.app_version;
const colorScheme = Appearance.getColorScheme();
const isDarkMode = colorScheme === 'dark' ? true : false;
var radio_props = [
  {label: 'Above', value: 'above'},
  {label: 'Below', value: 'below'},
];
var radio_props1 = [
  {label: 'Yes', value: 'yes'},
  {label: 'No', value: 'no'},
];
var radio_props2 = [
  {label: 'Yes', value: 'yes'},
  {label: 'No', value: 'no'},
];
var radio_props3 = [
  {label: 'Yes, marked within 24" of facility', value: 'yes_within_facility'},
  {label: 'Yes, marked outside 24" of facility', value: 'yes_outside_facility'},
  {label: 'No, there were no marking', value: 'no'},
];
var radio_props4 = [
  {label: 'Yes', value: 'yes'},
  {label: 'No', value: 'no'},
];

class Documentation extends Component {
  constructor(props) {
    super(props);
    (this.state = {
      ticketId: this.props.data,
      sImg: this.props.info.classs,
      status: this.props.info.status,
      completeInfo: this.props.info,
      activeTab: 0,
      changedImageUrl: '',
      descriptionText: '',
      //isloading: false,
      checkedRadio: '',
      checked2Radio: 'nv_energy',
      changedSecondStepImageUrl: '',
      changedThirdStepImageUrl: '',
      changedFourStepImageUrl: '',
      changedFiveStepImageUrl: '',
      descriptionTextSecondStep: '',
      descriptionTextThirdStep: '',
      descriptionTextFourStep: '',
      descriptionTextFiveStep: '',
      StepOneData: [],
      StepTwoData: [],
      StepThreeData: [],
      StepFourData: [],
      StepFiveData: [],
      imageLoad: false,
      utilitiesList: [],
      savedUtilities: {},
      uFetchCount: 0,
      stepTwoCompleted: false,
      stepThreeCompleted: false,
      stepFourCompleted: false,
      inCompleteStepMessage: '',
      showTab: false,
      previewImageURL: '',
      previewDocURL: '',
      previewImageDesc: '',
      previewUtilityImageDesc: '',
      modalVisible: false,
      singleFile: '',
      stepOneUploadFile: '',
      stepThreeUploadFile: '',
      is_doc: false, // preview item is image or doc
      showModal: false,
      selectedHours: 0,
      selectedMinutes: 0,
      flag: 0,
      damageIncidentData: '',
      ticket_id: '',
      incident_date: moment().format('MM-DD-YYYY'),
      incident_time: '',
      ticket_no: '',
      approx_location: '',
      ground_above_below: '',
      shutdown: '',
      incident_desc: '',
      utility_men_impacted: '',
      damage_desc: '',
      utility_rep_contact_name: '',
      utility_rep_contact_phone: '',
      utility_rep_contact_email: '',
      utility_rep_contact_email_error: false,
      utility_rep_onsite_name: '',
      utility_rep_onsite_phone: '',
      utility_rep_onsite_email: '',
      utility_rep_onsite_email_error: false,
      utility_trucks: '',
      utility_personnel: '',
      utility_equipment: '',
      response_onsite_time: '',
      liability_utility_determination: '',
      utility_response_desc: '',
      line_locate_company: '',
      locate_date: moment().format('MM-DD-YYYY'),
      locate_time: '',
      damaged_facility_marked: '',
      distance_bw_mark_facility: '',
      liability_locator_determination: '',
      locate_rep_contact_name: '',
      locate_rep_contact_phone: '',
      locate_rep_contact_email: '',
      locate_rep_contact_email_error: false,
      locate_rep_onsite_name: '',
      locate_rep_onsite_phone: '',
      locate_rep_onsite_email: '',
      locate_rep_onsite_email_error: false,
      locator_response_desc: '',
      upload_white_marking: '',
      upload_utility_marking: '',
      upload_damage: '',
      upload_utility_response: '',
      upload_other_img_doc: '',
      timepicker1_visible: false,
      datepicker1_visible: false,
      damageLoader: false,
      damageListData: {},
      damage_inc_id: '',
      previewDamageShow: false, // state to open preview on same modal of damage incident for because its not possible to open 2 modal on ios same time.
      visitedSteps: [], // check if step already visited
    }),
      (this.hasImage = false);
    this.webViewPreviewRef = null;
  }

  componentDidMount() {
    this.mounted = true;
    if (config.hasToken) {
      this._fetchSteps(config.currentToken);
      this._fetchUtilities();
      this._fetchDamageList(config.currentToken);
    }
    this.hasImage = false;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.info.ticket !== this.props.info.ticket) {
      this.mounted = true;
      this.setState({
        completeInfo: nextProps.info,
        ticketId: nextProps.info.ticket,
        activeTab: 0,
      });
      var _this = this;
      setTimeout(function () {
        _this._fetchSteps(config.currentToken);
        _this._fetchUtilities();
      }, 100);
    }
  }

  getRadioActiveKey(radioProps, selValue) {
    let radioKey = -1;
    radioProps.map((v, k) => {
      if (v.value == selValue) {
        radioKey = k;
      }
    });
    return radioKey;
  }

  setDamageIncidentData = () => {
    if (
      this.state?.damageIncidentData &&
      this.state.damageIncidentData !== null
    ) {
      if (this.state.damageIncidentData.steps !== null) {
        let visitedSteps = [];
        this.state.damageIncidentData.steps.map((v, k) => {
          visitedSteps.push(parseInt(v));
        });
        this.setState({visitedSteps: visitedSteps});
      }
      if (this.state.damageIncidentData.incident_date !== null) {
        const incident_date = moment(
          this.state.damageIncidentData.incident_date,
          'YYYY-MM-DD hh:ii',
        ).format('MM-DD-YYYY');
        this.setState({incident_date: incident_date});
      }
      if (this.state.damageIncidentData.incident_time !== null) {
        this.setState({
          incident_time: this.state.damageIncidentData.incident_time,
        });
      }
      if (this.state.damageIncidentData.approx_location !== null) {
        this.setState({
          approx_location: this.state.damageIncidentData.approx_location,
        });
      }
      if (this.state.damageIncidentData.ground_above_below !== null) {
        this.setState({
          ground_above_below: this.state.damageIncidentData.ground_above_below,
        });
      }
      if (this.state.damageIncidentData.shutdown !== null) {
        this.setState({shutdown: this.state.damageIncidentData.shutdown});
      }
      if (this.state.damageIncidentData.incident_desc !== null) {
        this.setState({
          incident_desc: this.state.damageIncidentData.incident_desc,
        });
      }
      if (this.state.damageIncidentData.utility_men_impacted !== null) {
        this.setState({
          utility_men_impacted:
            this.state.damageIncidentData.utility_men_impacted,
        });
      }
      if (this.state.damageIncidentData.damage_desc !== null) {
        this.setState({damage_desc: this.state.damageIncidentData.damage_desc});
      }
      if (this.state.damageIncidentData.utility_rep_contact_name !== null) {
        this.setState({
          utility_rep_contact_name:
            this.state.damageIncidentData.utility_rep_contact_name,
        });
      }
      if (this.state.damageIncidentData.utility_rep_contact_email !== null) {
        this.setState({
          utility_rep_contact_email:
            this.state.damageIncidentData.utility_rep_contact_email,
        });
      }
      if (this.state.damageIncidentData.utility_rep_contact_phone !== null) {
        this.setState({
          utility_rep_contact_phone:
            this.state.damageIncidentData.utility_rep_contact_phone,
        });
      }
      if (this.state.damageIncidentData.utility_rep_onsite_name !== null) {
        this.setState({
          utility_rep_onsite_name:
            this.state.damageIncidentData.utility_rep_onsite_name,
        });
      }
      if (this.state.damageIncidentData.utility_rep_onsite_phone !== null) {
        this.setState({
          utility_rep_onsite_phone:
            this.state.damageIncidentData.utility_rep_onsite_phone,
        });
      }
      if (this.state.damageIncidentData.utility_rep_onsite_email !== null) {
        this.setState({
          utility_rep_onsite_email:
            this.state.damageIncidentData.utility_rep_onsite_email,
        });
      }
      if (this.state.damageIncidentData.utility_trucks !== null) {
        this.setState({
          utility_trucks: this.state.damageIncidentData.utility_trucks,
        });
      }
      if (this.state.damageIncidentData.utility_personnel !== null) {
        this.setState({
          utility_personnel: this.state.damageIncidentData.utility_personnel,
        });
      }
      if (this.state.damageIncidentData.utility_equipment !== null) {
        this.setState({
          utility_equipment: this.state.damageIncidentData.utility_equipment,
        });
      }
      if (this.state.damageIncidentData.response_onsite_time !== null) {
        this.setState({
          response_onsite_time:
            this.state.damageIncidentData.response_onsite_time,
        });
      }
      if (
        this.state.damageIncidentData.liability_utility_determination !== null
      ) {
        this.setState({
          liability_utility_determination:
            this.state.damageIncidentData.liability_utility_determination,
        });
      }
      if (this.state.damageIncidentData.utility_response_desc !== null) {
        this.setState({
          utility_response_desc:
            this.state.damageIncidentData.utility_response_desc,
        });
      }
      if (this.state.damageIncidentData.line_locate_company !== null) {
        this.setState({
          line_locate_company:
            this.state.damageIncidentData.line_locate_company,
        });
      }
      if (this.state.damageIncidentData.locate_date !== null) {
        const locate_date = moment(
          this.state.damageIncidentData.locate_date,
          'YYYY-MM-DD hh:ii',
        ).format('MM-DD-YYYY');
        this.setState({locate_date: locate_date});
      }
      if (this.state.damageIncidentData.locate_time !== null) {
        this.setState({locate_time: this.state.damageIncidentData.locate_time});
      }
      if (this.state.damageIncidentData.damaged_facility_marked !== null) {
        this.setState({
          damaged_facility_marked:
            this.state.damageIncidentData.damaged_facility_marked,
        });
      }
      if (this.state.damageIncidentData.distance_bw_mark_facility !== null) {
        this.setState({
          distance_bw_mark_facility:
            this.state.damageIncidentData.distance_bw_mark_facility,
        });
      }
      if (
        this.state.damageIncidentData.liability_locator_determination !== null
      ) {
        this.setState({
          liability_locator_determination:
            this.state.damageIncidentData.liability_locator_determination,
        });
      }
      if (this.state.damageIncidentData.locate_rep_contact_name !== null) {
        this.setState({
          locate_rep_contact_name:
            this.state.damageIncidentData.locate_rep_contact_name,
        });
      }
      if (this.state.damageIncidentData.locate_rep_contact_phone !== null) {
        this.setState({
          locate_rep_contact_phone:
            this.state.damageIncidentData.locate_rep_contact_phone,
        });
      }
      if (this.state.damageIncidentData.locate_rep_contact_email !== null) {
        this.setState({
          locate_rep_contact_email:
            this.state.damageIncidentData.locate_rep_contact_email,
        });
      }
      if (this.state.damageIncidentData.locate_rep_onsite_name !== null) {
        this.setState({
          locate_rep_onsite_name:
            this.state.damageIncidentData.locate_rep_onsite_name,
        });
      }
      if (this.state.damageIncidentData.locate_rep_onsite_phone !== null) {
        this.setState({
          locate_rep_onsite_phone:
            this.state.damageIncidentData.locate_rep_onsite_phone,
        });
      }
      if (this.state.damageIncidentData.locate_rep_onsite_email !== null) {
        this.setState({
          locate_rep_onsite_email:
            this.state.damageIncidentData.locate_rep_onsite_email,
        });
      }
      if (this.state.damageIncidentData.locator_response_desc !== null) {
        this.setState({
          locator_response_desc:
            this.state.damageIncidentData.locator_response_desc,
        });
      }
      this.setState({
        showModal: true,
      });
      this.props.changeLoadingState(false);
    }
  };

  _fetchSteps(token) {
    if (this.mounted) {
      this.props.changeLoadingState(true);
    }
    fetch(
      config.BASE_URL +
        'search_documentations?api_token=' +
        token +
        '&eticket_id=' +
        this.state.completeInfo.digid +
        '&ticket_id=' +
        this.state.ticketId,
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    )
      .then(response => response.json())
      .then(res => {
        /* Commented now data edit individual fetch from listing
        this.setState({ damageIncidentData: res.data.damage_incident })
        this.setDamageIncidentData();*/
        if (this.mounted) {
          if (res.status == 1) {
            if (typeof res.data.step1 != 'undefined') {
              //console.log(JSON.stringify(res.data, null, 2))
              this.setState({
                StepOneData: res.data.step1.image,
              });
              this.hasImage = true;
            } else {
              this.setState({
                StepOneData: [],
              });
              this.hasImage = false;
            }

            if (typeof res.data.step3 != 'undefined') {
              if (typeof res.data.step3.image != 'undefined') {
                this.setState({
                  StepThreeData: res.data.step3.image,
                  stepThreeCompleted: true,
                  inCompleteStepMessage: 'Complete Step 4 to proceed further.',
                });
              }
            } else {
              this.setState({
                StepThreeData: [],
                stepThreeCompleted: false,
                inCompleteStepMessage: 'Complete Step 3 to proceed further.',
              });
              this.hasImage = false;
            }

            if (typeof res.data.step4 != 'undefined') {
              this.setState({
                StepFourData: res.data.step4.image,
                stepFourCompleted: true,
                inCompleteStepMessage: '',
              });
              this.hasImage = true;
            } else {
              this.setState({
                StepFourData: [],
                stepFourCompleted: false,
              });
              this.hasImage = false;
            }

            if (typeof res.data.step5 != 'undefined') {
              this.setState({
                StepFiveData: res.data.step5.image,
              });
              this.hasImage = true;
            } else {
              this.setState({
                StepFiveData: [],
              });
              this.hasImage = false;
            }
          }
          var _this = this;
          setTimeout(function () {
            _this.props.changeLoadingState(false);
          }, 500);
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

  // This function fetch all saved damage incident forms for current open ticket
  _fetchDamageList = currentToken => {
    if (this.mounted) {
      this.props.changeLoadingState(true);
    }
    const ticket_id = this.state.completeInfo.digid;
    fetch(
      config.BASE_URL +
        'damage-incident-listing?ticket_id=' +
        ticket_id +
        '&app_version=' +
        app_version +
        '&api_token=' +
        currentToken,
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + currentToken,
        },
      },
    )
      .then(response => response.json())
      .then(res => {
        if (this.mounted) {
          if (res.status == 1) {
            this.setState({
              damageListData: res?.data || {},
            });
          }
        }
        this.props.changeLoadingState(false);
      })
      .catch(err => {
        //console.log("err >>", err)
        if (this.mounted) {
          console.log(
            'Something went wrong fetching damage incident saved listing, Try again later.',
          );
          //_showErrorMessage('Something went wrong, Try again later.');
          this.props.changeLoadingState(false);
        }
      })
      .done();
  };

  _fetchUtilities = () => {
    if (this.mounted) {
      this.props.changeLoadingState(true);
    }
    fetch(
      config.BASE_URL + 'fetch-utilities/' + this.state.completeInfo.digid,
      {
        method: 'GET',
      },
    )
      .then(response => response.json())
      .then(res => {
        if (this.mounted) {
          if (res.status == 1) {
            if (
              typeof res.data.data != 'undefined' &&
              res.data.data.length > 0
            ) {
              this.setState({showTab: true});
            }
            this.setState({stepTwoCompleted: false});
            var completeStatusCount = 0;
            var savedUtilities = {}; // used in utility list to detect which one checked already so that green icon visible there
            res.data.data.map((key, i) => {
              if (key.status == 1) {
                completeStatusCount++;
                var keyId = key.code;
                savedUtilities[keyId] = true;
              }
              //completeStatusCount = 7;

              this.setState({savedUtilities: savedUtilities});
            });

            this.setState({
              inCompleteStepMessage: 'Step 2 is not completed yet.',
            });
            // console.log('res.data.data-----',JSON.stringify(res.data.data))
            if (res.data.data.length == completeStatusCount) {
              this.setState({stepTwoCompleted: true});
              this.setState({
                inCompleteStepMessage: 'Complete Step 3 to proceed further.',
              });
            }
            var uFCnt = this.state.uFetchCount;

            var uris = res.data.images.map((key, index) => ({
              uri: config.IMAGE_URL + '/' + key.image,
            }));
            FastImage.preload(uris);

            this.setState({
              utilitiesList: res.data,
              uFetchCount: uFCnt + 1,
            });
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
  };

  componentWillUnmount() {
    this.mounted = false;
  }

  goTabHandler = type => {
    if (this.state.activeTab == type) {
      type = 0;
    }
    this.setState({
      activeTab: 0,
      isloading: true,
    });
    const _this = this;
    setTimeout(() => {
      _this.setState({
        activeTab: type,
        isloading: false,
      });
    }, 100);
  };

  changeRadio = status => {
    this.setState({
      checkedRadio: status,
    });
  };

  changeRadio2 = status => {
    this.setState({
      checked2Radio: status,
    });
  };

  renderLoader() {
    return (
      <View>
        <Text style={{color: '#fff', textAlign: 'center'}}>Loading...</Text>
      </View>
    );
  }

  renderPreviewText() {
    return (
      <View style={{width: '100%'}}>
        {this.state.previewImageDesc != '' && (
          <Text
            style={{
              backgroundColor: '#000',
              color: '#fff',
              padding: 10,
              fontSize: 14,
              width: '100%',
              flexWrap: 'wrap',
              flexDirection: 'column',
            }}>
            {this.state.previewImageDesc}
          </Text>
        )}
        {this.state.activeTab == 2 && this.state.previewUtilityImageDesc != '' && (
          <Text
            style={{
              backgroundColor: '#000',
              color: '#fff',
              paddingTop: 0,
              paddingLeft: 10,
              paddingRight: 10,
              paddingBottom: 10,
              fontSize: 14,
              width: '100%',
              flexWrap: 'wrap',
              flexDirection: 'column',
            }}>
            {this.props?.t('PHOTO DESCRIPTION')}: {this.state.previewUtilityImageDesc}
          </Text>
        )}
        <TouchableOpacity
          style={{
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
            this.setModalVisible(false);
          }}>
          <Text
            style={{
              fontSize: 20,
              marginBottom: 5,
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

  previewImage() {
    const images = [{url: this.state.previewImageURL}];
    return (
      <View style={{position: 'relative', padding: 10}}>
        <View
          style={{
            borderTopColor: '#000',
            backgroundColor: '#000',
            flexWrap: 'wrap',
            borderWidth: 2,
            width: Dimensions.get('window').width - 20,
          }}>
          <ImageViewer imageUrls={images} />
          {this.state.previewImageDesc != '' && (
            <Text
              style={{
                backgroundColor: '#000',
                color: '#fff',
                padding: 10,
                fontSize: 14,
                width: '100%',
                flexWrap: 'wrap',
                flexDirection: 'column',
              }}>
              {this.state.previewImageDesc}
            </Text>
          )}
          {this.state.activeTab == 2 &&
            this.state.previewUtilityImageDesc != '' && (
              <Text
                style={{
                  backgroundColor: '#000',
                  color: '#fff',
                  paddingTop: 0,
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingBottom: 10,
                  fontSize: 14,
                  width: '100%',
                  flexWrap: 'wrap',
                  flexDirection: 'column',
                }}>
                {this.props?.t('PHOTO DESCRIPTION')}: {this.state.previewUtilityImageDesc}
              </Text>
            )}
          <TouchableOpacity
            style={{
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
              this.setModalVisible(false);
            }}>
            <Text
              style={{
                fontSize: 20,
                marginBottom: 5,
                alignItems: 'center',
                fontFamily: 'OpenSans-Bold',
                color: '#fff',
              }}>
              {this.props?.t('Close')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  uploadFirstStepHandler = async() => {
    if (this.mounted) {
      this.props.changeLoadingState(true);
      const isImage = this.state.changedImageUrl;
      //return;
      if (isImage != '') {
        const token = config.currentToken;
        const formdata = new FormData();
        this.state.changedImageUrl.map((v, k) => {
          let uri = v.path;
          let filename = uri.substring(uri.lastIndexOf('/') + 1, uri.length);
          let image = {
            uri: uri,
            name: filename,
            type: 'image/jpeg',
          };
          formdata.append('image[]', image);
        });
        formdata.append('step', this.state.activeTab);
        formdata.append('eticket_id', this.state.completeInfo.digid);
        formdata.append('ticket_id', this.state.ticketId);
        formdata.append(
          'image_desc',
          JSON.stringify(this.state.descriptionText),
        );
        await fetch(config.BASE_URL + 'save-documentation?api_token=' + token, {
          method: 'POST',
          headers: {
            // Authorization: 'Bearer ' + token,
            'Content-Type': 'multipart/form-data',
          },
          body: formdata,
        })
          .then(response => {
            console.log('-------large image res----',JSON.stringify(response))
            return response.json()
          }
          )
          .then(res => {
            console.log('aaaaaaa-------',JSON.stringify(res))
            if (this.mounted) {
              if (res.status == 1) {
                _showSuccessMessage(res.message);
                this.setState({changedImageUrl: ''});
                this._fetchSteps(config.currentToken);
              } else if (res.status == 0) {
                _showErrorMessage(res.message);
              }
              this.props.changeLoadingState(false);
            }
          })
          .catch(err => {
            if (this.mounted) {
              _showErrorMessage('Something went wrong, Try again later.');
              console.log(err,'upload image res----')
              this.props.changeLoadingState(false);
            }
          })
          .done();
      } else {
        _showErrorMessage('Please Upload Image First!');
      }
    }
  };

  uploadSecondStepHandler = alldata => {
    console.log('---alldata----', JSON.stringify(alldata));
    if (this.mounted) {
      console.log('---this.mounted----', JSON.stringify(this.mounted));
      this.props.changeLoadingState(true);
      const token = config.currentToken;
      fetch(config.BASE_URL + 'utilities-documentation?api_token=' + token, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'multipart/form-data',
        },
        body: alldata,
      })
        .then(
          response => response.json(),
          // console.log('---api response----', JSON.stringify(response)),
        )
        .then(res => {
          if (this.mounted) {
            if (res.status == 1) {
              _showSuccessMessage(res.message);
              this._fetchUtilities();
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
  };

  uploadThirdStepHandler = () => {
    if (this.mounted) {
      this.props.changeLoadingState(true);
      const checked = this.state.checked2Radio;
      const image = this.state.changedThirdStepImageUrl;
      const desc = this.state.descriptionTextThirdStep;

      if (checked != '') {
        if (image == '' && desc != '') {
          _showErrorMessage('Select Image First!');
        } else {
          const token = config.currentToken;
          const formdata = new FormData();
          formdata.append('step', this.state.activeTab);
          formdata.append('eticket_id', this.state.completeInfo.digid);
          formdata.append('ticket_id', this.state.ticketId);
          formdata.append('company_marking', this.state.checked2Radio);
          formdata.append('image_desc', JSON.stringify(desc));
          //formdata.append('image', image );
          this.state.changedThirdStepImageUrl.map((v, k) => {
            let uri = v.path;
            let filename = uri.substring(uri.lastIndexOf('/') + 1, uri.length);
            let image = {
              uri: uri,
              name: filename,
              type: 'image/jpeg',
            };
            formdata.append('image[]', image);
          });

          fetch(config.BASE_URL + 'save-documentation?api_token=' + token, {
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + token,
              'Content-Type': 'multipart/form-data',
            },
            body: formdata,
          })
            .then(response => response.json())
            .then(res => {
              if (this.mounted) {
                if (res.status == 1) {
                  _showSuccessMessage(res.message);
                  this.setState({
                    changedThirdStepImageUrl: '',
                  });
                  this.setState({
                    stepThreeCompleted: true,
                    inCompleteStepMessage: 'Complete Step 4 to proceed further',
                  });
                  this._fetchSteps(config.currentToken);
                } else if (res.status == 0) {
                  _showErrorMessage(res.message);
                }
                this.props.changeLoadingState(false);
              }
            })
            .catch(err => {
              if (this.mounted) {
                _showErrorMessage('Something went wrong, Try again later.');
              }
            })
            .done();
        }
      } else {
        _showErrorMessage('Select Steps First!');
        this.setState({
          isloading: false,
        });
      }
    }
  };

  uploadFourStepHandler = () => {
    if (this.mounted) {
      this.props.changeLoadingState(true);

      const token = config.currentToken;
      const formdata = new FormData();
      formdata.append('step', 4);
      formdata.append('eticket_id', this.state.completeInfo.digid);
      formdata.append('ticket_id', this.state.ticketId);
      if (this.state.changedFourStepImageUrl != '') {
        //formdata.append('image', this.state.changedFourStepImageUrl );
        this.state.changedFourStepImageUrl.map((v, k) => {
          let uri = v.path;
          let filename = uri.substring(uri.lastIndexOf('/') + 1, uri.length);
          let image = {
            uri: uri,
            name: filename,
            type: 'image/jpeg',
          };
          formdata.append('image[]', image);
        });
      }
      if (this.state.descriptionTextFourStep != '') {
        formdata.append(
          'image_desc',
          JSON.stringify(this.state.descriptionTextFourStep),
        );
      }

      fetch(config.BASE_URL + 'save-documentation?api_token=' + token, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'multipart/form-data',
        },
        body: formdata,
      })
        .then(response => response.json())
        .then(res => {
          if (this.mounted) {
            if (res.status == 1) {
              _showSuccessMessage(res.message);
              this.setState({
                changedFourStepImageUrl: '',
              });
              this.state.completeInfo.status = 'Cleared';
              this.state.completeInfo.classs = 'cleared';
              this.props.goForward(this.state.completeInfo);
              this._fetchSteps(config.currentToken);
            } else if (res.status == 0) {
              _showErrorMessage(res.message);
            }
            this.props.changeLoadingState(false);
          }
        })
        .catch(err => {
          if (this.mounted) {
            _showErrorMessage('Something went wrong, Try again later.');
          }
        })
        .done();
    }
  };

  uploadFiveStepHandler = () => {
    if (this.mounted) {
      this.props.changeLoadingState(true);
      const token = config.currentToken;
      const formdata = new FormData();
      formdata.append('step', 5);
      formdata.append('eticket_id', this.state.completeInfo.digid);
      formdata.append('ticket_id', this.state.ticketId);
      if (this.state.changedFiveStepImageUrl != '') {
        //formdata.append('image', this.state.changedFiveStepImageUrl );
        this.state.changedFiveStepImageUrl.map((v, k) => {
          let uri = v.path;
          let filename = uri.substring(uri.lastIndexOf('/') + 1, uri.length);
          let image = {
            uri: uri,
            name: filename,
            type: 'image/jpeg',
          };
          formdata.append('image[]', image);
        });
      }
      if (this.state.descriptionTextFiveStep != '') {
        formdata.append(
          'image_desc',
          JSON.stringify(this.state.descriptionTextFiveStep),
        );
      }

      fetch(config.BASE_URL + 'save-documentation?api_token=' + token, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'multipart/form-data',
        },
        body: formdata,
      })
        .then(response => response.json())
        .then(res => {
          if (this.mounted) {
            if (res.status == 1) {
              _showSuccessMessage(res.message);
              this.setState({
                changedFiveStepImageUrl: '',
              });
              this._fetchSteps(config.currentToken);
            } else if (res.status == 0) {
              _showErrorMessage(res.message);
            }
            this.props.changeLoadingState(false);
          }
        })
        .catch(err => {
          if (this.mounted) {
            _showErrorMessage('Something went wrong, Try again later.');
          }
        })
        .done();
    }
  };

  notify811 = () => {
    if (this.mounted) {
      this.props.changeLoadingState(true);

      const token = config.currentToken;
      const formdata = new FormData();
      formdata.append('eticket_id', this.state.completeInfo.digid);
      formdata.append('ticket_id', this.state.ticketId);

      fetch(config.BASE_URL + 'notify811?api_token=' + token, {
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
              _showSuccessMessage(res.message);
            } else if (res.status == 0) {
              _showErrorMessage(res.message);
            }
            this.props.changeLoadingState(false);
          }
        })
        .catch(err => {
          if (this.mounted) {
            _showErrorMessage('Something went wrong, Try again later.');
          }
        })
        .done();
    }
  };

  setModalVisible(visible) {
    // if preview open in damage incident pop up then hide only view
    if (this.state.previewDamageShow) {
      this.setState({previewDamageShow: false});
    }
    // if modal open in step 1,2.. to preview in modalVisible modal then hide it.
    this.setState({modalVisible: visible});
  }

  /* Create random file name for downloaded pdf */
  getFileName() {
    let d = new Date();
    let dformat = `${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}`;
    //console.log("getCurrentDate : ", dformat);
    return 'DIGCONTRAX_' + dformat + '.pdf';
  }

  /* This function will fetch filpath pdf and download it in device */
  downloadImage(filename, isFullUrl = false) {
    let filepath = config.IMAGE_URL + '/' + filename;
    if (isFullUrl) {
      filepath = filename;
    }
    Linking.openURL(filepath).catch(err => {
      console.error('Failed opening page because: ', err);
      alert('Failed to open page');
    });
    return;

    //below download code is on hold for now open on browser link directly.
    let dirs =
      Platform.OS == 'ios'
        ? RNFetchBlob.fs.dirs.DocumentDir
        : RNFetchBlob.fs.dirs.DCIMDir;
    RNFetchBlob.config({
      // this is much more performant.
      fileCache: true,
      // response data will be saved to this path if it has access right.
      path: dirs + filename,
      addAndroidDownloads: {
        title: filename,
        //mime : "application/pdf",
        useDownloadManager: true,
        description: 'DigContraxdocument',
        mediaScannable: true,
        notification: true,
      },
    })
      .fetch('GET', filepath, {
        //some headers ..
      })
      .then(res => {
        // the temp file path
        if (Platform.OS === 'ios') {
          //RNFetchBlob.ios.openDocument(res.data);
          RNFetchBlob.ios.previewDocument(res.path());
        }
        //alert('Report file saved to ', res.path());
      })
      .catch(err => {
        console.log(err);
        _showErrorMessage('Something went wrong, Try again later.');
      });
  }

  showPreviewImage = (
    imgUrl,
    desc,
    utility_desc,
    doc_url,
    isFullUrl = false,
  ) => {
    var ext = doc_url.substr(doc_url.lastIndexOf('.') + 1);
    var is_doc = false;
    if (ext == 'doc' || ext == 'docx' || ext == 'xlsx' || ext == 'xls') {
      is_doc = true;
      doc_url =
        'https://view.officeapps.live.com/op/embed.aspx?src=' +
        config.IMAGE_URL +
        '/' +
        doc_url;
    } else if (ext == 'pdf') {
      is_doc = true;
      doc_url =
        'https://docs.google.com/gview?embedded=true&url=' +
        config.IMAGE_URL +
        '/' +
        doc_url;
    }

    // For utitility pdf type open in preview with full aws URL
    if (isFullUrl) {
      is_doc = true;
      doc_url = 'https://docs.google.com/gview?embedded=true&url=' + doc_url;
    }
    this.setState(
      {
        previewImageURL: imgUrl,
        previewImageDesc: desc,
        modalVisible: true,
        previewUtilityImageDesc: utility_desc,
        is_doc: is_doc,
        previewDocURL: doc_url,
      },
      () => {
        if (this?.webViewPreviewRef) this.webViewPreviewRef.reload();
      },
    );
  };

  cancelStepUpload = step => {
    if (step == 1) this.setState({changedImageUrl: '', descriptionText: ''});
    else if (step == 2)
      this.setState({changedSecondStepImageUrl: '', descriptionText2: ''});
    else if (step == 3)
      this.setState({
        changedThirdStepImageUrl: '',
        descriptionTextThirdStep: '',
      });
    else if (step == 4)
      this.setState({changedFourStepImageUrl: '', descriptionTextFourStep: ''});
    else if (step == 5)
      this.setState({changedFiveStepImageUrl: '', descriptionTextFiveStep: ''});

    ImagePicker.clean()
      .then(() => {
        console.log('removed all tmp images from tmp directory');
      })
      .catch(e => {
        console.log(e);
      });
  };

  deleteImage = (id, step) => {
    this.setState({
      isloading: true,
    });
    var self = this;
    const token = config.currentToken;
    const formdata = new FormData();
    formdata.append('id', id);
    formdata.append('step', step);
    fetch(config.BASE_URL + 'delete-images?api_token=' + token, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      body: formdata,
    })
      .then(response => response.json())
      .then(res => {
        if (self.mounted) {
          if (res.status == 1) {
            _showSuccessMessage(res.message);
            self.mounted = true;
            this._fetchSteps(config.currentToken);
            this._fetchUtilities();
          } else if (res.status == 0) {
            _showErrorMessage(res.message);
          }
          self.setState({
            isloading: false,
          });
        }
      })
      .catch(err => {
        if (this.mounted) {
          console.warn(err);
          _showErrorMessage('Something went wrong, Try again later.');
          self.setState({
            isloading: false,
          });
        }
      })
      .done();
  };

  changeLoadingState2 = status => {
    this.props.changeLoadingState(status);
  };
  /* This function call when upload button clicked it will take step and set state for image upload */
  async selectOneFile(step) {
    //Opening Document Picker for selection of one file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        //There can me more options as well
        // DocumentPicker.types.allFiles
        // DocumentPicker.types.images
        // DocumentPicker.types.plainText
        // DocumentPicker.types.audio
        // DocumentPicker.types.pdf
      });
      //Printing the log realted to the file
      /*console.log('res : ' + JSON.stringify(res));
      console.log('URI : ' + res.uri);
      console.log('Type : ' + res.type);
      console.log('File Name : ' + res.name);
      console.log('File Size : ' + res.size);*/
      if (
        res.type == 'application/pdf' ||
        res.type == 'application/msword' ||
        res.type ==
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        res.type == 'text/plain' ||
        res.type == 'application/vnd.ms-excel' ||
        res.type ==
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        res.type == 'image/png' ||
        res.type == 'image/jpeg'
      ) {
        //Setting the state to show single file attributes
        if (step == 1)
          this.setState({changedImageUrl: res.uri, stepOneUploadFile: res});
        else if (step == 2)
          this.setState({
            changedSecondStepImageUrl: res.uri,
            stepTwoUploadFile: res,
          });
        else if (step == 3)
          this.setState({
            changedThirdStepImageUrl: res.uri,
            stepThreeUploadFile: res,
          });
        else if (step == 4)
          this.setState({
            changedFourStepImageUrl: res.uri,
            stepFourUploadFile: res,
          });
        else if (step == 5)
          this.setState({
            changedFiveStepImageUrl: res.uri,
            stepFiveUploadFile: res,
          });
      } else {
        alert('Please upload image,pdf,excel and document file.');
        return;
      }
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        //alert('You canceled document upload.');
      } else {
        //For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  }

  /* Get upload image uri as per document type */
  getUploadImage(uploadKeyName) {
    const uploadFile = this.state[uploadKeyName];
    var imgUri = {uri: uploadFile.uri};
    if (uploadFile.type == 'application/pdf') {
      imgUri = image.pdfIcon;
    } else if (
      uploadFile.type == 'application/msword' ||
      uploadFile.type ==
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      uploadFile.type == 'text/plain'
    ) {
      imgUri = image.docIcon;
    } else if (
      uploadFile.type == 'application/vnd.ms-excel' ||
      uploadFile.type ==
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      imgUri = image.excelIcon;
    }
    return imgUri;
  }

  uploadCameraImage(step) {
    if (step == 1) {
      ImagePicker.openCamera({
        mediaType: 'image',
      }).then(image => {
        const images = [image];
        if (typeof images[0].path != 'undefined') {
          let descriptionText = [];
          images.map((v, k) => {
            descriptionText[k] = '';
          });
          this.setState({
            changedImageUrl: images,
            descriptionText: descriptionText,
          });
        }
      });
    } else if (step == 3) {
      ImagePicker.openCamera({
        mediaType: 'image',
      }).then(image => {
        const images = [image];
        if (typeof images[0].path != 'undefined')
          this.setState({changedThirdStepImageUrl: images});
      });
    } else if (step == 4) {
      ImagePicker.openCamera({
        mediaType: 'image',
      }).then(image => {
        const images = [image];
        if (typeof images[0].path != 'undefined')
          this.setState({changedFourStepImageUrl: images});
      });
    } else if (step == 5) {
      ImagePicker.openCamera({
        mediaType: 'image',
      }).then(image => {
        const images = [image];
        if (typeof images[0].path != 'undefined')
          this.setState({changedFiveStepImageUrl: images});
      });
    }
  }

  /* New multiple upload plugin to upload more than 1 image */
  //https://github.com/ivpusic/react-native-image-crop-picker
  uploadMultipleImage(step) {
    if (step == 1) {
      ImagePicker.openPicker({
        multiple: true,
      }).then(images => {
        if (typeof images[0].path != 'undefined') {
          let descriptionText = [];
          images.map((v, k) => {
            descriptionText[k] = '';
          });
          this.setState({
            changedImageUrl: images,
            descriptionText: descriptionText,
          });
        }
      });
    } else if (step == 3) {
      ImagePicker.openPicker({
        multiple: true,
      }).then(images => {
        if (typeof images[0].path != 'undefined')
          this.setState({changedThirdStepImageUrl: images});
      });
    } else if (step == 4) {
      ImagePicker.openPicker({
        multiple: true,
      }).then(images => {
        if (typeof images[0].path != 'undefined')
          this.setState({changedFourStepImageUrl: images});
      });
    } else if (step == 5) {
      ImagePicker.openPicker({
        multiple: true,
      }).then(images => {
        if (typeof images[0].path != 'undefined')
          this.setState({changedFiveStepImageUrl: images});
      });
    }
  }

  photoDescription(step, idx, photo_description) {
    if (step == 1) {
      let descriptionText =
        this.state.descriptionText == '' ? [] : this.state.descriptionText;
      descriptionText[idx] = photo_description;
      this.setState({descriptionText: descriptionText});
    } else if (step == 3) {
      let descriptionTextThirdStep =
        this.state.descriptionTextThirdStep == ''
          ? []
          : this.state.descriptionTextThirdStep;
      descriptionTextThirdStep[idx] = photo_description;
      this.setState({descriptionTextThirdStep: descriptionTextThirdStep});
    } else if (step == 4) {
      let descriptionTextFourStep =
        this.state.descriptionTextFourStep == ''
          ? []
          : this.state.descriptionTextFourStep;
      descriptionTextFourStep[idx] = photo_description;
      this.setState({descriptionTextFourStep: descriptionTextFourStep});
    } else if (step == 5) {
      let descriptionTextFiveStep =
        this.state.descriptionTextFiveStep == ''
          ? []
          : this.state.descriptionTextFiveStep;
      descriptionTextFiveStep[idx] = photo_description;
      this.setState({descriptionTextFiveStep: descriptionTextFiveStep});
    }
  }

  /** 
  @author PP 
  @date 31 July, 2021
  This function create to take a photo and open camera for step 4 all images/document uploads. 
  **/
  selectPhotosMarking(step, isMultiple = false) {
    let array = [];
    let array1 = [];
    try {
      // if there is multiple image picker upload/browse
      if (isMultiple) {
        ImagePicker.openPicker({
          multiple: true,
        }).then(images => {
          if (typeof images[0].path != 'undefined') {
            images.map((image, k) => {
              let uri = image.path;
              let filename = uri.substring(
                uri.lastIndexOf('/') + 1,
                uri.length,
              );
              let arr = {
                uri: uri,
                name: filename,
                type: 'image/jpeg',
              };
              this.addImage(step, arr);
            });
          }
        });
      }
      // if take a photo and append single image
      else {
        ImagePicker.openCamera({
          mediaType: 'image',
        }).then(image => {
          let uri = image.path;
          let filename = uri.substring(uri.lastIndexOf('/') + 1, uri.length);
          let arr = {
            uri: uri,
            name: filename,
            type: 'image/jpeg',
          };
          this.addImage(step, arr);
        });
      }
    } catch (err) {
      throw err;
    }
  }

  /**
   * @author PP
   * Common function to add/push upload/takephoto images into there state as per step
   **/
  addImage = (step, arr) => {
    let images = [];
    if (step == 1) {
      images = this.state.upload_white_marking || [];
      images.push(arr);
      this.setState({upload_white_marking: images}, () =>
        console.log('upload_white_marking', this.state.upload_white_marking),
      );
    } else if (step == 2) {
      images = this.state.upload_utility_marking || [];
      images.push(arr);
      this.setState({upload_utility_marking: images}, () =>
        console.log(
          'upload_utility_marking',
          this.state.upload_utility_marking,
        ),
      );
    } else if (step == 3) {
      images = this.state.upload_damage || [];
      images.push(arr);
      this.setState({upload_damage: images}, () =>
        console.log('upload_damage', this.state.upload_damage),
      );
    } else if (step == 4) {
      images = this.state.upload_utility_response || [];
      images.push(arr);
      this.setState({upload_utility_response: images}, () =>
        console.log(
          'upload_utility_response',
          this.state.upload_utility_response,
        ),
      );
    } else if (step == 5) {
      images = this.state.upload_other_img_doc || [];
      images.push(arr);
      this.setState(
        {upload_other_img_doc: images},
        console.log('upload_other_img_doc', this.state.upload_other_img_doc),
      );
    }
  };

  /* TODO: remove this document picker after approval
   Remove this code after client approve take a photo on step 4 all upload button
 async selectPhotosMarking(step) {
    let array = [];
    let array1 = [];
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.images],
      });
      for (const res of results) {
        console.log("rse", res)
        if (step === 1) {
          array.push(res);
          console.log("res", res)
          this.setState({ upload_white_marking: array }, () => console.log("upload_white_marking", this.state.upload_white_marking))
        } else if (step === 2) {
          array1.push(res);
          this.setState({ upload_utility_marking: array1 }, () => console.log("upload_utility_marking", this.state.upload_utility_marking))
        }
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        alert('You canceled image upload.');
      } else {
        throw err;
      }
    }
  }

  async selectPhotoVideoDamage(step) {
    let array = [];
    let array1 = [];
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
      });
      for (const res of results) {
        if (step === 3) {
          if ((res.type == "image/png") || (res.type == "image/jpeg") || (res.type == "image/jpg") || (res.type == "video/mp4")) {
            array.push(res);
            this.setState({ upload_damage: array }, () => console.log("upload_damage", this.state.upload_damage))
          } else {
            alert("Please upload image and video file.");
            return;
          }
        } else if (step === 4) {
          if ((res.type == "image/png") || (res.type == "image/jpeg") || (res.type == "image/jpg") || (res.type == "video/mp4")) {
            array1.push(res);
            this.setState({ upload_utility_response: array1 }, () => console.log("upload_utility_response", this.state.upload_utility_response))
          } else {
            alert("Please upload image or video file.");
            return;
          }

        }
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        alert('You canceled image upload.');
      } else {
        throw err;
      }
    }
  }

  async selectSupportingDocs() {
    let array = [];
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
      });
      for (const res of results) {
        array.push(res);
        this.setState({ upload_other_img_doc: array }, console.log("upload_other_img_doc", this.state.upload_other_img_doc))
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        alert('You canceled image upload.');
      } else {
        throw err;
      }
    }
  }*/

  _deleteDamageIncidentMedia = mediaID => {
    this.setState({damageLoader: true});
    const token = config.currentToken;
    const formdata = new FormData();
    formdata.append('ticket_id', this.state.completeInfo.digid);
    formdata.append('media_id', mediaID);
    formdata.append('api_token', token);
    fetch(config.BASE_URL + 'damage-media-delete', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      body: formdata,
    })
      .then(response => response.json())
      .then(res => {
        this._fetchSteps(token);
        this.setState({damageLoader: false});
      })
      .catch(err => {
        this.setState({damageLoader: false});
        console.warn(err);
      })
      .done();
  };

  /** author PP
   * @param image url , image name as doc url
   * This function display image or doc preview in damage incident form modal.
   * On IOS not possible to display 2 modal at same time so display on same modal
   * using common renderPreviewPopUpContent function.
   **/
  showPreviewImageList = (imgUrl, doc_url) => {
    var ext = doc_url.substr(doc_url.lastIndexOf('.') + 1);
    var is_doc = false;
    if (ext == 'doc' || ext == 'docx' || ext == 'xlsx' || ext == 'xls') {
      is_doc = true;
      doc_url =
        'https://view.officeapps.live.com/op/embed.aspx?src=' +
        config.IMAGE_URL +
        '/' +
        doc_url;
    } else if (ext == 'pdf') {
      is_doc = true;
      doc_url =
        'https://docs.google.com/gview?embedded=true&url=' +
        config.IMAGE_URL +
        '/' +
        doc_url;
    }

    this.setState(
      {
        previewImageURL: imgUrl,
        previewDocURL: doc_url,
        is_doc: is_doc,
        previewDamageShow: true,
      },
      () =>
        console.log(
          'previewImageURL',
          this.state.previewImageURL,
          'previewDocURL',
          this.state.previewDocURL,
        ),
    );
  };

  uploadDamageIncidentAPI = nextStep => {
    //this.setState({damageLoader: true });
    this.props.changeLoadingState(true);
    const currentStep = this.state.flag + 1;
    const token = config.currentToken;
    const formdata = new FormData();
    const incident_date = moment(this.state.incident_date, 'MM-DD-YYYY').format(
      'YYYY-MM-DD',
    ); //change again date format to YYYY-MM-DD for api post param
    const locate_date = moment(this.state.locate_date, 'MM-DD-YYYY').format(
      'YYYY-MM-DD',
    ); //change again date format to YYYY-MM-DD for api post param
    formdata.append('damage_inc_id', this.state.damage_inc_id);
    formdata.append('step', currentStep);
    formdata.append('ticket_no', this.state.ticketId);
    formdata.append('ticket_id', this.state.completeInfo.digid);
    formdata.append('incident_date', incident_date);
    formdata.append('incident_time', this.state.incident_time);
    formdata.append('approx_location', this.state.approx_location);
    formdata.append('ground_above_below', this.state.ground_above_below);
    formdata.append('shutdown', this.state.shutdown);
    formdata.append('incident_desc', this.state.incident_desc);
    formdata.append('utility_men_impacted', this.state.utility_men_impacted);
    formdata.append('damage_desc', this.state.damage_desc);
    formdata.append(
      'utility_rep_contact_name',
      this.state.utility_rep_contact_name,
    );
    formdata.append(
      'utility_rep_contact_phone',
      this.state.utility_rep_contact_phone,
    );
    formdata.append(
      'utility_rep_contact_email',
      this.state.utility_rep_contact_email,
    );
    formdata.append(
      'utility_rep_onsite_name',
      this.state.utility_rep_onsite_name,
    );
    formdata.append(
      'utility_rep_onsite_phone',
      this.state.utility_rep_onsite_phone,
    );
    formdata.append(
      'utility_rep_onsite_email',
      this.state.utility_rep_onsite_email,
    );
    formdata.append('utility_trucks', this.state.utility_trucks);
    formdata.append('utility_personnel', this.state.utility_personnel);
    formdata.append('utility_equipment', this.state.utility_equipment);
    formdata.append('response_onsite_time', this.state.response_onsite_time);
    formdata.append(
      'liability_utility_determination',
      this.state.liability_utility_determination,
    );
    formdata.append('utility_response_desc', this.state.utility_response_desc);
    formdata.append('line_locate_company', this.state.line_locate_company);
    formdata.append('locate_date', locate_date);
    formdata.append('locate_time', this.state.locate_time);
    formdata.append(
      'damaged_facility_marked',
      this.state.damaged_facility_marked,
    );
    formdata.append(
      'distance_bw_mark_facility',
      this.state.distance_bw_mark_facility,
    );
    formdata.append(
      'liability_locator_determination',
      this.state.liability_locator_determination,
    );
    formdata.append(
      'locate_rep_contact_name',
      this.state.locate_rep_contact_name,
    );
    formdata.append(
      'locate_rep_contact_phone',
      this.state.locate_rep_contact_phone,
    );
    formdata.append(
      'locate_rep_contact_email',
      this.state.locate_rep_contact_email,
    );
    formdata.append(
      'locate_rep_onsite_name',
      this.state.locate_rep_onsite_name,
    );
    formdata.append(
      'locate_rep_onsite_phone',
      this.state.locate_rep_onsite_phone,
    );
    formdata.append(
      'locate_rep_onsite_email',
      this.state.locate_rep_onsite_email,
    );
    formdata.append('locator_response_desc', this.state.locator_response_desc);
    if (this.state.upload_white_marking !== '') {
      this.state.upload_white_marking.map((v, k) => {
        formdata.append('upload_white_marking[]', v);
      });
    }
    if (this.state.upload_utility_marking !== '') {
      this.state.upload_utility_marking.map((v, k) => {
        formdata.append('upload_utility_marking[]', v);
      });
    }
    if (this.state.upload_damage !== '') {
      this.state.upload_damage.map((v, k) => {
        formdata.append('upload_damage[]', v);
      });
    }
    if (this.state.upload_utility_response !== '') {
      this.state.upload_utility_response.map((v, k) => {
        formdata.append('upload_utility_response[]', v);
      });
    }
    if (this.state.upload_other_img_doc !== '') {
      this.state.upload_other_img_doc.map((v, k) => {
        formdata.append('upload_other_img_doc[]', v);
      });
    }
    fetch(config.BASE_URL + 'damage-incident?api_token=' + token, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formdata,
    })
      .then(response => {
        return response.json();
      })
      .then(res => {
        if (res.status == 1) {
          // move to next step.
          //this.setState({flag: nextStep})
          if (nextStep == 0) {
            _showSuccessMessage(res.message); // display save message on last step submit only
          }
        } else {
          _showErrorMessage('Request failed to send.');
        }
        //this.setState({ damageLoader: false });
        this._fetchDamageList(config.currentToken);
        this._fetchSteps(config.currentToken);
      })
      .catch(err => {
        this.setState({damageLoader: false});
        this.props.changeLoadingState(false);
        _showErrorMessage('Something went wrong, Try again later.');
      })
      .done();
    if (this.state.flag == 3) {
      //hide modal on final step submit button
      this.setState({
        showModal: false,
        flag: 0,
        upload_white_marking: '',
        upload_utility_marking: '',
        upload_damage: '',
        upload_utility_response: '',
        upload_other_img_doc: '',
        damageLoader: false,
        damage_inc_id: '',
        damageIncidentData: '',
      });
    }
  };
  // check validation field before leave current step form
  nextStep = (flag, submitData = false) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    let isError = false;
    if (this.state.flag == 1) {
      let email = this.state.utility_rep_contact_email;
      if (email.trim() !== '' && reg.test(email) === false) {
        alert('Incorrect utility response contact email.');
        isError = true;
      }

      email = this.state.utility_rep_onsite_email;
      if (email.trim() !== '' && reg.test(email) === false) {
        alert('Incorrect utility response onsite email.');
        isError = true;
      }
      //check onsite email
    } else if (this.state.flag == 2) {
      // check local rep contact email
      let email = this.state.locate_rep_contact_email;
      if (email.trim() !== '' && reg.test(email) === false) {
        alert('Incorrect locate response contact email.');
        isError = true;
      }
      // check local rep email
      email = this.state.locate_rep_onsite_email;
      if (email.trim() !== '' && reg.test(email) === false) {
        alert('Incorrect locate response onsite email.');
        isError = true;
      }
    }
    if (isError) {
      return false;
    }
    if (submitData) {
      let visitedSteps = this.state.visitedSteps;
      const currentStep = this.state.flag + 1;
      if (visitedSteps.indexOf(currentStep) == -1) {
        visitedSteps.push(currentStep);
        this.setState({visitedSteps: visitedSteps});
      }
      this.uploadDamageIncidentAPI(flag);
    }
    this.refs['scroll'].scrollToPosition(0, 0, true);
    // comment it if next step need to display after success return above uploadDamageIncidentApi
    this.setState({
      flag,
    });
  };

  _validateEmail = (text, field) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(text) === false) {
      console.log('error', field);
      this.setState({[field + '_error']: true});
    } else {
      this.setState({[field + '_error']: false});
    }
    this.setState({[field]: text});
    /*if (step === 1) {
      if (reg.test(text) === false) {
        console.log("Email is Not Correct");
      }
      this.setState({ utility_rep_onsite_email: text })
      
    } else if (step === 2) {
      if (reg.test(text) === false) {
        console.log("Email is Not Correct");
      }
      this.setState({ locate_rep_onsite_email: text })
    }*/
  };

  _validatePhone = (text, step) => {
    let number = text
      .replace(/\D+/g, '')
      .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    if (step === 1) {
      this.setState({utility_rep_contact_phone: number});
    } else if (step === 2) {
      this.setState({utility_rep_onsite_phone: number});
    } else if (step === 3) {
      this.setState({locate_rep_contact_phone: number});
    } else if (step === 4) {
      this.setState({locate_rep_onsite_phone: number});
    }
  };

  _getIcon = type => {
    if (type === 'mp4') {
      return <Image style={{height: 20, width: 20}} source={image.videoIcon} />;
    } else if (type === 'png' || type === 'jpg' || type === 'jpeg') {
      return <Image style={{height: 20, width: 20}} source={image.imageIcon} />;
    } else if (type === 'pdf') {
      return <Image style={{height: 20, width: 20}} source={image.pdfIcon} />;
    } else if (
      type === 'csv' ||
      type === 'docx' ||
      type === 'zip' ||
      type === 'download'
    ) {
      return <Image style={{height: 20, width: 20}} source={image.docsIcon} />;
    }
  };
  /**
   * @author PP
   * This function return damage incident form top steps color
   * currentStep active return yellow, already visited green and rest gray
   **/
  getStepColor = (step, defaultColor = '') => {
    const flag = this.state.flag;
    const visitedSteps = this.state.visitedSteps;
    const currentStep = step - 1; // get step color
    let color = defaultColor == '' ? 'gray' : defaultColor; // default color
    if (flag == currentStep) {
      return '#FFBC42'; // first check if current step then make it yellow
    } else if (visitedSteps.indexOf(step) !== -1) {
      return '#25CB46'; // return green
    } else {
      return color;
    }
  };
  /**
   * @author PP
   * This function return damage incident form top steps
   **/
  renderStepsHeader() {
    const flag = this.state.flag;
    return (
      <View style={styless.listHeaderMain}>
        <TouchableOpacity
          style={styless.listHeaderTitle}
          onPress={() => this.nextStep(0)}>
          <View
            style={{
              width: '95%',
              backgroundColor: this.getStepColor(1),
              height: 15,
            }}></View>
          <Text
            style={{
              color: this.getStepColor(1, '#000'),
              fontWeight: 'bold',
              marginTop: 5,
              fontSize: 10,
              textAlign: 'center',
            }}>
            {this.props?.t('INCIDENT OVERVIEW')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styless.listHeaderTitle}
          onPress={() => this.nextStep(1)}>
          <View
            style={{
              width: '95%',
              backgroundColor: this.getStepColor(2),
              height: 15,
            }}></View>
          <Text
            style={{
              color: this.getStepColor(2, '#000'),
              fontWeight: 'bold',
              marginTop: 5,
              fontSize: 10,
              textAlign: 'center',
            }}>
            {this.props?.t('UTILITY DAMAGE INFO')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styless.listHeaderTitle}
          onPress={() => this.nextStep(2)}>
          <View
            style={{
              width: '95%',
              backgroundColor: this.getStepColor(3),
              height: 15,
            }}></View>
          <Text
            style={{
              color: this.getStepColor(3, '#000'),
              fontWeight: 'bold',
              marginTop: 5,
              fontSize: 10,
              textAlign: 'center',
            }}>
            {this.props?.t('LINE LOCATE INFORMATION')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styless.listHeaderTitle}
          onPress={() => this.nextStep(3)}>
          <View
            style={{
              width: '95%',
              backgroundColor: this.getStepColor(4),
              height: 15,
            }}></View>
          <Text
            style={{
              color: this.getStepColor(4, '#000'),
              fontWeight: 'bold',
              marginTop: 5,
              fontSize: 10,
              textAlign: 'center',
            }}>
            {this.props?.t('DOCUMENT UPLOAD')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderConditionalText() {
    const {selectedHours, selectedMinutes} = this.state;
    if (this.state.flag === 0) {
      return (
        <ScrollView
          ref="_scrollView"
          style={{backgroundColor: '#F1F1F1', margin: 10, marginTop: 40}}>
          {this._renderHeader()}
          <View style={{justifyContent: 'center', marginTop: 20}}>
            <Text
              style={{
                fontWeight: 'bold',
                textAlign: 'center',
                color: 'black',
                fontSize: 20,
                color: '#2C3E50',
              }}>
              {this.props?.t('INCIDENT OVERVIEW')}
            </Text>
          </View>
          <View style={{marginLeft: 15, marginRight: 15}}>
            <View style={{marginTop: 20}}>
              <View style={{marginBottom: 10}}>
                <Text style={{fontWeight: 'bold'}}>{this.props?.t('Date of Incident')}</Text>
              </View>
              <Button
                style={{
                  backgroundColor: '#fff',
                  width: '100%',
                }}
                onPress={() => {
                  this.setState({datepicker1_visible: true});
                }}>
                <Text style={{color: '#000', textAlign: 'center'}}>
                  {this.state.incident_date}
                </Text>
              </Button>
              {this.state.datepicker1_visible && (
                <DateTimePickerModal
                  date={new Date()}
                  maximumDate={new Date()}
                  mode="date"
                  isDarkModeEnabled={isDarkMode}
                  isVisible={true}
                  onConfirm={date => {
                    const month = ('0' + (date.getMonth() + 1)).slice(-2);
                    const day = ('0' + date.getDate()).slice(-2);
                    const year = date.getFullYear();
                    const incidentDate = month + '-' + day + '-' + year;
                    this.setState({
                      incident_date: incidentDate,
                      datepicker1_visible: false,
                    });
                  }}
                  onCancel={() => {
                    this.setState({datepicker1_visible: false});
                    console.log('cancel date picker');
                  }}
                />
              )}
              {/*<DatePicker
              style={{ width: '100%' }}
              date={this.state.incident_date}
              mode="date"
              placeholder="MM-DD-YYYY"
              format="MM-DD-YYYY"
              minDate="01-01-2000"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              iconSource={image.calendarIcon}
              customStyles={{
                dateInput: {
                  backgroundColor: 'white',
                  height: 55,
                  borderWidth: 0,
                }
              }}
              onDateChange={(date) => { 
                                        this.setState({ incident_date: date }); 
                                      }
                            }
            />*/}
            </View>
            <View style={{marginTop: 10}}>
              <Text style={{fontWeight: 'bold'}}>
              {this.props?.t('Approximate Time of Incident')}
              </Text>
            </View>
            <View style={{marginTop: 10, backgroundColor: 'white'}}>
              <Button
                style={{
                  backgroundColor: '#fff',
                  width: '100%',
                }}
                onPress={() => {
                  this.setState({timepicker1_visible: true});
                }}>
                <Text style={{color: '#000', textAlign: 'center'}}>
                  {this.state.incident_time != ''
                    ? moment(this.state.incident_time, ['HH.mm']).format(
                        'hh:mm a',
                      )
                    : 'HH:MM'}
                </Text>
              </Button>
              {this.state.timepicker1_visible && (
                <DateTimePickerModal
                  date={new Date()}
                  mode="time"
                  isDarkModeEnabled={isDarkMode}
                  isVisible={true}
                  onConfirm={date => {
                    const hr =
                      date.getHours() < 9
                        ? '0' + date.getHours()
                        : date.getHours();
                    const mn =
                      date.getMinutes() < 9
                        ? '0' + date.getMinutes()
                        : date.getMinutes();
                    const locateTime = hr + ':' + mn;
                    this.setState({
                      incident_time: locateTime,
                      timepicker1_visible: false,
                    });
                  }}
                  onCancel={() => {
                    this.setState({timepicker1_visible: false});
                    console.log('cancel date picker');
                  }}
                />
              )}
              {/*<TimePicker
              selectedHours={selectedHours}
              selectedMinutes={selectedMinutes}
              isAmpm={true}
              onChange={(hours, minutes) =>
                this.setState({ selectedHours: hours, selectedMinutes: minutes })
              }
            />*/}
            </View>
            <View style={{marginTop: 10}}>
              <Text style={{fontWeight: 'bold'}}>{this.props?.t('Ticket Number')}</Text>
            </View>
            <View style={{marginTop: 10}}>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  height: 55,
                  width: '100%',
                  backgroundColor: 'white',
                }}>
                <View style={{flex: 0.9}}>
                  <Text style={{marginLeft: 10}}>{this.state.ticketId}</Text>
                </View>
                <TouchableOpacity style={{flex: 0.1}}>
                  <Image style={{fontWeight: 'bold'}} source={image.ticket} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{marginTop: 10}}>
              <Text style={{fontWeight: 'bold'}}>{this.props?.t('Approximate Location')}</Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <View style={{flex: 1}}>
                <TextInput
                  placeholder="Approximate Location"
                  placeholderTextColor="#76838F"
                  autoCorrect={false}
                  autoCapitalize="none"
                  lineWidth={0}
                  activeLineWidth={0}
                  style={{
                    color: '#000',
                    height: 55,
                    backgroundColor: 'white',
                    paddingLeft: 10,
                    fontSize: 17,
                  }}
                  value={this.state.approx_location}
                  onChangeText={approx_location =>
                    this.setState({approx_location})
                  }
                />
              </View>
              <Image
                style={{
                  position: 'absolute',
                  right: 15,
                  top: 15,
                  justifyContent: 'center',
                }}
                source={image.locationIcon}
              />
            </View>

            <View
              style={{marginTop: 10, height: 120, backgroundColor: '#D8D8D8'}}>
              <Text
                style={{
                  marginTop: 20,
                  marginLeft: 20,
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                {this.props?.t('Above/Below Ground')}
              </Text>
              <View style={{marginTop: 20}}>
                <RadioForm
                  key={this.state.ground_above_below == '' ? 'rp' : 'rpa'}
                  style={{marginLeft: 20}}
                  radio_props={radio_props}
                  initial={
                    this.state.ground_above_below == ''
                      ? -1
                      : this.getRadioActiveKey(
                          radio_props,
                          this.state.ground_above_below,
                        )
                  }
                  formHorizontal={true}
                  borderWidth={1}
                  buttonSize={15}
                  buttonOuterSize={25}
                  labelStyle={{fontSize: 16, color: 'black', paddingRight: 30}}
                  onPress={value => {
                    if (this.state.ground_above_below === value) {
                      this.setState({ground_above_below: ''});
                    } else {
                      this.setState({ground_above_below: value});
                    }
                  }}
                />
              </View>
            </View>
            <View
              style={{marginTop: 10, height: 120, backgroundColor: '#D8D8D8'}}>
              <Text
                style={{
                  marginTop: 20,
                  marginLeft: 20,
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                {this.props?.t('Did the Incident Cause a Shutdown')}
              </Text>
              <View style={{marginTop: 20}}>
                <RadioForm
                  key={this.state.shutdown == '' ? 'rp1' : 'rpa1'}
                  style={{marginLeft: 20}}
                  radio_props={radio_props1}
                  initial={
                    this.state.shutdown == ''
                      ? '-1'
                      : this.getRadioActiveKey(
                          radio_props1,
                          this.state.shutdown,
                        )
                  } // not default checked
                  formHorizontal={true}
                  borderWidth={1}
                  buttonSize={15}
                  buttonOuterSize={25}
                  buttonStyle={{marginLeft: 60}}
                  buttonWrapStyle={{marginLeft: 60}}
                  labelStyle={{fontSize: 16, color: 'black', paddingRight: 50}}
                  onPress={value => {
                    if (this.state.shutdown === value) {
                      this.setState({shutdown: ''});
                    } else {
                      this.setState({shutdown: value});
                    }
                  }}
                />
              </View>
            </View>
            <View style={{marginTop: 10}}>
              <Text style={{fontWeight: 'bold'}}>
                {this.props?.t('Description of the Incident')}
              </Text>
            </View>
            <View style={{marginTop: 10}}>
              <Textarea
                rowSpan={5}
                bordered
                placeholder="Description of the Incident"
                style={{backgroundColor: '#fff'}}
                value={this.state.incident_desc}
                onChangeText={incident_desc => this.setState({incident_desc})}
              />
            </View>

            <View style={{marginTop: 20, marginBottom: 20}}>
              <TouchableOpacity
                onPress={() => {
                  this.nextStep(1);
                }}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#000000',
                  alignSelf: 'center',
                  height: 50,
                  width: '50%',
                }}>
                <Text style={{color: 'white'}}>{this.props?.t('Next')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      );
    } else if (this.state.flag === 1) {
      return (
        <ScrollView
          ref="_scrollView1"
          style={{
            backgroundColor: '#F1F1F1',
            margin: 10,
            marginTop: 50,
            paddingBottom: 10,
          }}>
          {this._renderHeader()}
          <View style={{justifyContent: 'center', marginTop: 20}}>
            <Text
              style={{
                fontWeight: 'bold',
                textAlign: 'center',
                color: 'black',
                fontSize: 20,
                color: '#2C3E50',
              }}>
              {this.props?.t('UTILITY DAMAGE INFORMATION')}
            </Text>
          </View>
          <View style={{marginLeft: 15, marginRight: 15}}>
            <View style={{marginTop: 20}}>
              <View style={{marginBottom: 10}}>
                <Text style={{fontWeight: 'bold'}}>
                {this.props?.t('Utility Member Impacted')}
                </Text>
              </View>
              <TextInput
                placeholder="Utility Member Impacted"
                placeholderTextColor="#76838F"
                autoCorrect={false}
                autoCapitalize="none"
                lineWidth={0}
                activeLineWidth={0}
                style={{
                  color: '#000',
                  height: 55,
                  backgroundColor: 'white',
                  paddingLeft: 10,
                }}
                baseColor="#7F859E"
                value={this.state.utility_men_impacted}
                onChangeText={utility_men_impacted =>
                  this.setState({utility_men_impacted})
                }
              />
            </View>
            <View style={{marginTop: 10}}>
              <Text style={{fontWeight: 'bold'}}>
              {this.props?.t('Description of What Was Damaged')}
              </Text>
            </View>
            <View style={{marginTop: 10}}>
              <TextInput
                placeholder="Description of What Was Damaged"
                placeholderTextColor="#76838F"
                autoCorrect={false}
                autoCapitalize="none"
                lineWidth={0}
                activeLineWidth={0}
                style={{
                  color: '#000',
                  height: 55,
                  backgroundColor: 'white',
                  paddingLeft: 10,
                }}
                baseColor="#7F859E"
                value={this.state.damage_desc}
                onChangeText={damage_desc => this.setState({damage_desc})}
              />
            </View>
            <View style={{marginTop: 10, backgroundColor: '#D8D8D8'}}>
              <View style={{margin: 20}}>
                <View style={{marginBottom: 10}}>
                  <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                  {this.props?.t('Utility Representative Contacted')}
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <TextInput
                      placeholder="Name"
                      placeholderTextColor="#76838F"
                      autoCorrect={false}
                      autoCapitalize="none"
                      lineWidth={0}
                      activeLineWidth={0}
                      style={{
                        color: '#000',
                        height: 55,
                        backgroundColor: 'white',
                        borderWidth: 0.2,
                        paddingLeft: 10,
                        borderRadius: 5,
                      }}
                      baseColor="#7F859E"
                      value={this.state.utility_rep_contact_name}
                      onChangeText={utility_rep_contact_name =>
                        this.setState({utility_rep_contact_name})
                      }
                    />
                  </View>
                  <Image
                    style={{position: 'absolute', right: 15, top: 20}}
                    source={image.user}
                  />
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1, marginTop: 10}}>
                    <TextInput
                      placeholder="Phone"
                      placeholderTextColor="#76838F"
                      autoCorrect={false}
                      autoCapitalize="none"
                      lineWidth={0}
                      maxLength={14}
                      activeLineWidth={0}
                      keyboardType="numeric"
                      style={{
                        color: '#000',
                        height: 55,
                        backgroundColor: 'white',
                        borderWidth: 0.2,
                        paddingLeft: 10,
                        borderRadius: 5,
                      }}
                      baseColor="#7F859E"
                      value={this.state.utility_rep_contact_phone}
                      onChangeText={utility_rep_contact_phone =>
                        this._validatePhone(utility_rep_contact_phone, 1)
                      }
                    />
                  </View>
                  <Image
                    style={{position: 'absolute', right: 15, top: 20}}
                    source={image.phoneCall}
                  />
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1, marginTop: 10}}>
                    <TextInput
                      placeholder="Email"
                      placeholderTextColor="#76838F"
                      autoCorrect={false}
                      autoCapitalize="none"
                      lineWidth={0}
                      activeLineWidth={0}
                      style={{
                        backgroundColor: 'white',
                        borderWidth: 0.2,
                        padding: 15,
                        borderRadius: 5,
                        color: '#000',
                      }}
                      baseColor="#7F859E"
                      value={this.state.utility_rep_contact_email}
                      onChangeText={text =>
                        this._validateEmail(text, 'utility_rep_contact_email')
                      }
                    />
                  </View>
                  <Image
                    style={{position: 'absolute', right: 15, top: 20}}
                    source={image.mailIcon}
                  />
                </View>
                {this.state.utility_rep_contact_email_error && (
                  <Text style={styless.emailError}>{this.props?.t('Invalid email.')}</Text>
                )}
              </View>
            </View>

            <View style={{marginTop: 10, backgroundColor: '#D8D8D8'}}>
              <View style={{margin: 20}}>
                <View style={{marginBottom: 10}}>
                  <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                  {this.props?.t('Utility Representative Onsite')}
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <TextInput
                      placeholder="Name"
                      placeholderTextColor="#76838F"
                      autoCorrect={false}
                      autoCapitalize="none"
                      lineWidth={0}
                      activeLineWidth={0}
                      style={{
                        color: '#000',
                        height: 55,
                        backgroundColor: 'white',
                        borderWidth: 0.2,
                        paddingLeft: 10,
                        borderRadius: 5,
                      }}
                      baseColor="#7F859E"
                      value={this.state.utility_rep_onsite_name}
                      onChangeText={utility_rep_onsite_name =>
                        this.setState({utility_rep_onsite_name})
                      }
                    />
                  </View>
                  <Image
                    style={{position: 'absolute', right: 15, top: 20}}
                    source={image.user}
                  />
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1, marginTop: 10}}>
                    <TextInput
                      placeholder="Phone"
                      placeholderTextColor="#76838F"
                      autoCorrect={false}
                      autoCapitalize="none"
                      maxLength={14}
                      lineWidth={0}
                      keyboardType="numeric"
                      activeLineWidth={0}
                      style={{
                        color: '#000',
                        height: 55,
                        backgroundColor: 'white',
                        borderWidth: 0.2,
                        paddingLeft: 10,
                        borderRadius: 5,
                      }}
                      baseColor="#7F859E"
                      value={this.state.utility_rep_onsite_phone}
                      onChangeText={utility_rep_onsite_phone =>
                        this._validatePhone(utility_rep_onsite_phone, 2)
                      }
                    />
                  </View>
                  <Image
                    style={{position: 'absolute', right: 15, top: 20}}
                    source={image.phoneCall}
                  />
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1, marginTop: 10}}>
                    <TextInput
                      placeholder="Email"
                      placeholderTextColor="#76838F"
                      autoCorrect={false}
                      autoCapitalize="none"
                      lineWidth={0}
                      activeLineWidth={0}
                      style={{
                        backgroundColor: 'white',
                        borderWidth: 0.2,
                        padding: 15,
                        borderRadius: 5,
                        color: '#000',
                      }}
                      baseColor="#7F859E"
                      value={this.state.utility_rep_onsite_email}
                      onChangeText={text =>
                        this._validateEmail(text, 'utility_rep_onsite_email')
                      }
                    />
                  </View>
                  <Image
                    style={{position: 'absolute', right: 15, top: 20}}
                    source={image.mailIcon}
                  />
                </View>
                {this.state.utility_rep_onsite_email_error && (
                  <Text style={styless.emailError}>{this.props?.t('Invalid email.')}</Text>
                )}
              </View>
            </View>
            <View style={{marginTop: 10}}>
              <Text style={{fontWeight: 'bold'}}>
              {this.props?.t('Number of Utility Trucks Responding')}
              </Text>
            </View>
            <View style={{marginTop: 10}}>
              <TextInput
                placeholder="Number of Utility Trucks Responding"
                placeholderTextColor="#76838F"
                autoCorrect={false}
                autoCapitalize="none"
                lineWidth={0}
                keyboardType="numeric"
                activeLineWidth={0}
                style={{
                  color: '#000',
                  height: 55,
                  backgroundColor: 'white',
                  paddingLeft: 10,
                }}
                baseColor="#7F859E"
                value={'' + this.state.utility_trucks}
                onChangeText={utility_trucks => this.setState({utility_trucks})}
              />
            </View>
            <View style={{marginTop: 10}}>
              <Text style={{fontWeight: 'bold'}}>
              {this.props?.t('Number of Utility Personnel Responding')}
              </Text>
            </View>
            <View style={{marginTop: 10}}>
              <TextInput
                placeholder="Number of Utility Personnel Responding"
                placeholderTextColor="#76838F"
                autoCorrect={false}
                autoCapitalize="none"
                lineWidth={0}
                keyboardType="numeric"
                activeLineWidth={0}
                style={{
                  color: '#000',
                  height: 55,
                  backgroundColor: 'white',
                  paddingLeft: 10,
                }}
                baseColor="#7F859E"
                value={'' + this.state.utility_personnel}
                onChangeText={utility_personnel =>
                  this.setState({utility_personnel})
                }
              />
            </View>
            <View style={{marginTop: 10}}>
              <Text style={{fontWeight: 'bold'}}>
              {this.props?.t('Number of Pieces of Heavy Equipment Responding')}
              </Text>
            </View>
            <View style={{marginTop: 10}}>
              <TextInput
                placeholder="Number of Pieces of Heavy Equipment Responding"
                placeholderTextColor="#76838F"
                autoCorrect={false}
                autoCapitalize="none"
                lineWidth={0}
                activeLineWidth={0}
                keyboardType="numeric"
                style={{
                  color: '#000',
                  height: 55,
                  backgroundColor: 'white',
                  paddingLeft: 10,
                }}
                baseColor="#7F859E"
                value={'' + this.state.utility_equipment}
                onChangeText={utility_equipment =>
                  this.setState({utility_equipment})
                }
              />
            </View>

            <View style={{marginTop: 10}}>
              <Text style={{fontWeight: 'bold'}}>
              {this.props?.t('Approximate Time of Response Onsite')}
              </Text>
            </View>
            <View style={{marginTop: 10, backgroundColor: 'white'}}>
              <Button
                style={{
                  backgroundColor: '#fff',
                  width: '100%',
                }}
                onPress={() => {
                  this.setState({timepicker1_visible: true});
                }}>
                <Text style={{color: '#000', textAlign: 'center'}}>
                  {this.state.response_onsite_time != ''
                    ? moment(this.state.response_onsite_time, ['HH.mm']).format(
                        'hh:mm a',
                      )
                    : 'HH:MM'}
                </Text>
              </Button>
              {this.state.timepicker1_visible && (
                <DateTimePickerModal
                  date={new Date()}
                  mode="time"
                  isDarkModeEnabled={isDarkMode}
                  isVisible={true}
                  onConfirm={date => {
                    const hr =
                      date.getHours() < 9
                        ? '0' + date.getHours()
                        : date.getHours();
                    const mn =
                      date.getMinutes() < 9
                        ? '0' + date.getMinutes()
                        : date.getMinutes();
                    const response_onsite_time = hr + ':' + mn;
                    this.setState({
                      selectedHours:
                        date.getHours() < 9
                          ? '0' + date.getHours()
                          : date.getHours(),
                      selectedMinutes:
                        date.getMinutes() < 9
                          ? '0' + date.getMinutes()
                          : date.getMinutes(),
                      timepicker1_visible: false,
                      response_onsite_time: response_onsite_time,
                    });
                  }}
                  onCancel={() => {
                    this.setState({timepicker1_visible: false});
                  }}
                />
              )}
              {/*<TimePicker
              selectedHours={selectedHours}
              selectedMinutes={selectedMinutes}
              isAmpm={true}
              onChange={(hours, minutes) =>
                this.setState({ selectedHours: hours, selectedMinutes: minutes })
              }
            />*/}
            </View>

            <View
              style={{marginTop: 10, height: 120, backgroundColor: '#D8D8D8'}}>
              <Text
                style={{
                  marginTop: 20,
                  marginLeft: 20,
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                {this.props?.t('Any Determination of Liability by Utility')}
              </Text>
              <View style={{marginTop: 20}}>
                <RadioForm
                  key={
                    this.state.liability_utility_determination == ''
                      ? 'rp2'
                      : 'rpa2'
                  }
                  style={{marginLeft: 20}}
                  radio_props={radio_props2}
                  initial={
                    this.state.liability_utility_determination == ''
                      ? '-1'
                      : this.getRadioActiveKey(
                          radio_props2,
                          this.state.liability_utility_determination,
                        )
                  }
                  formHorizontal={true}
                  borderWidth={1}
                  buttonSize={15}
                  buttonOuterSize={25}
                  buttonStyle={{marginLeft: 60}}
                  buttonWrapStyle={{marginLeft: 60}}
                  labelStyle={{fontSize: 16, color: 'black', paddingRight: 50}}
                  onPress={value => {
                    if (this.state.liability_utility_determination === value) {
                      this.setState({liability_utility_determination: ''});
                    } else {
                      this.setState({liability_utility_determination: value});
                    }
                  }}
                />
              </View>
            </View>

            <View style={{marginTop: 10}}>
              <Text style={{fontWeight: 'bold'}}>
              {this.props?.t('Description of Liability or Utility Response')}
              </Text>
            </View>
            <View style={{marginTop: 10}}>
              <Textarea
                rowSpan={5}
                bordered
                placeholder="Description of Liability or Utility Response"
                style={{backgroundColor: '#fff'}}
                value={this.state.utility_response_desc}
                onChangeText={utility_response_desc =>
                  this.setState({utility_response_desc})
                }
              />
            </View>

            <View
              style={{marginTop: 20, marginBottom: 20, flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => this.nextStep(0)}
                style={{
                  marginRight: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#000000',
                  alignSelf: 'center',
                  height: 50,
                  flex: 0.5,
                }}>
                <Text style={{color: 'white'}}>{this.props?.t('Back')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.nextStep(2)}
                style={{
                  marginLeft: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#FEBF26',
                  alignSelf: 'center',
                  height: 50,
                  flex: 0.5,
                }}>
                <Text style={{color: 'white'}}>{this.props?.t('Next')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      );
    } else if (this.state.flag === 2) {
      return (
        <ScrollView
          ref="_scrollView2"
          style={{backgroundColor: '#F1F1F1', margin: 10, marginTop: 50}}>
          {this._renderHeader()}
          <View style={{justifyContent: 'center', marginTop: 20}}>
            <Text
              style={{
                fontWeight: 'bold',
                textAlign: 'center',
                color: 'black',
                fontSize: 20,
                color: '#2C3E50',
              }}>
              {this.props?.t('LINE LOCATE INFORMATION')}
            </Text>
          </View>
          <View style={{marginLeft: 15, marginRight: 15}}>
            <View style={{marginTop: 20}}>
              <View style={{marginBottom: 10}}>
                <Text style={{fontWeight: 'bold'}}>{this.props?.t('Line Locate Company')}</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                  <TextInput
                    placeholder="Line Locate Company"
                    placeholderTextColor="#76838F"
                    autoCorrect={false}
                    autoCapitalize="none"
                    lineWidth={0}
                    activeLineWidth={0}
                    style={{
                      color: '#000',
                      height: 55,
                      backgroundColor: 'white',
                      paddingLeft: 10,
                    }}
                    baseColor="#7F859E"
                    value={this.state.line_locate_company}
                    onChangeText={line_locate_company =>
                      this.setState({line_locate_company})
                    }
                  />
                </View>
              </View>
              <View style={{marginTop: 10}}>
                <Text style={{fontWeight: 'bold'}}>{this.props?.t('Date of Locate')}</Text>
              </View>
              <View style={{marginTop: 10}}>
                <Button
                  style={{
                    backgroundColor: '#fff',
                    width: '100%',
                  }}
                  onPress={() => {
                    this.setState({datepicker1_visible: true});
                  }}>
                  <Text style={{color: '#000', textAlign: 'center'}}>
                    {this.state.locate_date}
                  </Text>
                </Button>
                {this.state.datepicker1_visible && (
                  <DateTimePickerModal
                    date={new Date()}
                    maximumDate={new Date()}
                    mode="date"
                    isDarkModeEnabled={isDarkMode}
                    isVisible={true}
                    onConfirm={date => {
                      const month = ('0' + (date.getMonth() + 1)).slice(-2);
                      const day = ('0' + date.getDate()).slice(-2);
                      const year = date.getFullYear();
                      const locateDate = month + '-' + day + '-' + year;
                      this.setState({
                        locate_date: locateDate,
                        datepicker1_visible: false,
                      });
                    }}
                    onCancel={() => {
                      this.setState({datepicker1_visible: false});
                    }}
                  />
                )}
                {/*<DatePicker
                style={{ width: '100%' }}
                date={this.state.date}
                mode="date"
                placeholder="YYYY-MM-DD"
                format="YYYY-MM-DD"
                minDate="2000-01-01"
                maxDate={new Date()}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                iconSource={image.calendarIcon}
                customStyles={{
                  dateInput: {
                    backgroundColor: 'white',
                    height: 50,
                    borderWidth: 0,
                  }
                }}
                onDateChange={(date) => { this.setState({ locate_date: date }) }}
              />*/}
              </View>
              <View style={{marginTop: 10}}>
                <Text style={{fontWeight: 'bold'}}>{this.props?.t('Time of Locate')}</Text>
              </View>
              <View style={{marginTop: 10, backgroundColor: 'white'}}>
                <Button
                  style={{
                    backgroundColor: '#fff',
                    width: '100%',
                  }}
                  onPress={() => {
                    this.setState({timepicker1_visible: true});
                  }}>
                  <Text style={{color: '#000', textAlign: 'center'}}>
                    {this.state.locate_time != ''
                      ? moment(this.state.locate_time, ['HH.mm']).format(
                          'hh:mm a',
                        )
                      : 'HH:MM'}
                  </Text>
                </Button>
                {this.state.timepicker1_visible && (
                  <DateTimePickerModal
                    date={new Date()}
                    mode="time"
                    isDarkModeEnabled={isDarkMode}
                    isVisible={true}
                    onConfirm={date => {
                      const hr =
                        date.getHours() < 9
                          ? '0' + date.getHours()
                          : date.getHours();
                      const mn =
                        date.getMinutes() < 9
                          ? '0' + date.getMinutes()
                          : date.getMinutes();
                      const locateTime = hr + ':' + mn;
                      this.setState({
                        locate_time: locateTime,
                        selectedHours:
                          date.getHours() < 9
                            ? '0' + date.getHours()
                            : date.getHours(),
                        selectedMinutes:
                          date.getMinutes() < 9
                            ? '0' + date.getMinutes()
                            : date.getMinutes(),
                        timepicker1_visible: false,
                      });
                    }}
                    onCancel={() => {
                      this.setState({timepicker1_visible: false});
                    }}
                  />
                )}
                {/*}
              <TimePicker
                selectedHours={selectedHours}
                selectedMinutes={selectedMinutes}
                isAmpm={true}
                onChange={(hours, minutes) =>
                  this.setState({ selectedHours: hours, selectedMinutes: minutes })
                }
              />*/}
              </View>
            </View>

            <View style={{marginTop: 10, backgroundColor: '#D8D8D8'}}>
              <View style={{margin: 20}}>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                {this.props?.t('Was the Damaged Facility Located/Marked')}
                </Text>
                <View style={{marginTop: 20}}>
                  <RadioForm
                    key={
                      this.state.damaged_facility_marked == '' ? 'rp3' : 'rpa3'
                    }
                    radio_props={radio_props3}
                    initial={
                      this.state.damaged_facility_marked == ''
                        ? '-1'
                        : this.getRadioActiveKey(
                            radio_props3,
                            this.state.damaged_facility_marked,
                          )
                    }
                    borderWidth={1}
                    buttonSize={15}
                    buttonOuterSize={25}
                    buttonStyle={{marginLeft: 60}}
                    buttonWrapStyle={{marginLeft: 60}}
                    labelStyle={{
                      fontSize: 16,
                      color: 'black',
                      paddingRight: 20,
                    }}
                    onPress={value => {
                      if (this.state.damaged_facility_marked === value) {
                        this.setState({damaged_facility_marked: ''});
                      } else {
                        this.setState({damaged_facility_marked: value});
                      }
                    }}
                  />
                </View>
              </View>
            </View>
            <View style={{marginTop: 10}}>
              <Text style={{fontWeight: 'bold'}}>
              {this.props?.t('Distance Between Marking and Facility')}
              </Text>
            </View>
            <View style={{marginTop: 10}}>
              <TextInput
                placeholder="Distance Between Marking and Facility"
                placeholderTextColor="#76838F"
                autoCorrect={false}
                autoCapitalize="none"
                lineWidth={0}
                activeLineWidth={0}
                style={{
                  color: '#000',
                  height: 55,
                  backgroundColor: 'white',
                  paddingLeft: 10,
                }}
                baseColor="#7F859E"
                value={this.state.distance_bw_mark_facility}
                onChangeText={distance_bw_mark_facility =>
                  this.setState({distance_bw_mark_facility})
                }
              />
            </View>
            <View
              style={{marginTop: 20, height: 120, backgroundColor: '#D8D8D8'}}>
              <Text
                style={{
                  marginTop: 20,
                  marginLeft: 20,
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                {this.props?.t('Any Determination of Liability by Locator')}
              </Text>
              <View style={{marginTop: 20}}>
                <RadioForm
                  key={
                    this.state.liability_locator_determination == ''
                      ? 'rp4'
                      : 'rpa4'
                  }
                  radio_props={radio_props4}
                  style={{marginLeft: 20}}
                  initial={
                    this.state.liability_locator_determination == ''
                      ? '-1'
                      : this.getRadioActiveKey(
                          radio_props4,
                          this.state.liability_locator_determination,
                        )
                  }
                  formHorizontal={true}
                  borderWidth={1}
                  buttonSize={15}
                  buttonOuterSize={25}
                  buttonStyle={{marginLeft: 60}}
                  buttonWrapStyle={{marginLeft: 60}}
                  labelStyle={{fontSize: 16, color: 'black', paddingRight: 50}}
                  onPress={value => {
                    if (this.state.liability_locator_determination === value) {
                      this.setState({liability_locator_determination: ''});
                    } else {
                      this.setState({liability_locator_determination: value});
                    }
                  }}
                />
              </View>
            </View>

            <View style={{marginTop: 10, backgroundColor: '#D8D8D8'}}>
              <View style={{margin: 20}}>
                <View style={{marginBottom: 10}}>
                  <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                  {this.props?.t('Locate Representative Contacted')}
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <TextInput
                      placeholder="Name"
                      placeholderTextColor="#76838F"
                      autoCorrect={false}
                      autoCapitalize="none"
                      lineWidth={0}
                      activeLineWidth={0}
                      style={{
                        color: '#000',
                        height: 55,
                        backgroundColor: 'white',
                        borderWidth: 0.2,
                        paddingLeft: 10,
                        borderRadius: 5,
                      }}
                      baseColor="#7F859E"
                      value={this.state.locate_rep_contact_name}
                      onChangeText={locate_rep_contact_name =>
                        this.setState({locate_rep_contact_name})
                      }
                    />
                  </View>
                  <Image
                    style={{position: 'absolute', right: 15, top: 20}}
                    source={image.user}
                  />
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1, marginTop: 10}}>
                    <TextInput
                      placeholder="Phone"
                      placeholderTextColor="#76838F"
                      autoCorrect={false}
                      autoCapitalize="none"
                      lineWidth={0}
                      maxLength={14}
                      keyboardType="numeric"
                      activeLineWidth={0}
                      style={{
                        color: '#000',
                        height: 55,
                        backgroundColor: 'white',
                        borderWidth: 0.2,
                        padding: 10,
                        borderRadius: 5,
                      }}
                      baseColor="#7F859E"
                      value={this.state.locate_rep_contact_phone}
                      onChangeText={locate_rep_contact_phone =>
                        this._validatePhone(locate_rep_contact_phone, 3)
                      }
                    />
                  </View>
                  <Image
                    style={{position: 'absolute', right: 15, top: 20}}
                    source={image.phoneCall}
                  />
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1, marginTop: 10}}>
                    <TextInput
                      placeholder="Email"
                      placeholderTextColor="#76838F"
                      autoCorrect={false}
                      autoCapitalize="none"
                      lineWidth={0}
                      activeLineWidth={0}
                      style={{
                        backgroundColor: 'white',
                        borderWidth: 0.2,
                        padding: 15,
                        borderRadius: 5,
                        color: '#000',
                      }}
                      baseColor="#7F859E"
                      value={this.state.locate_rep_contact_email}
                      onChangeText={text =>
                        this._validateEmail(text, 'locate_rep_contact_email')
                      }
                    />
                  </View>
                  <Image
                    style={{position: 'absolute', right: 15, top: 20}}
                    source={image.mailIcon}
                  />
                </View>
                {this.state.locate_rep_contact_email_error && (
                  <Text style={styless.emailError}>{this.props?.t('Invalid email.')}</Text>
                )}
              </View>
            </View>

            <View style={{marginTop: 10, backgroundColor: '#D8D8D8'}}>
              <View style={{margin: 20}}>
                <View style={{marginBottom: 10}}>
                  <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                  {this.props?.t('Locate Representative Onsite')}
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <TextInput
                      placeholder="Name"
                      placeholderTextColor="#76838F"
                      autoCorrect={false}
                      autoCapitalize="none"
                      lineWidth={0}
                      activeLineWidth={0}
                      style={{
                        color: '#000',
                        height: 55,
                        backgroundColor: 'white',
                        borderWidth: 0.2,
                        paddingLeft: 10,
                        borderRadius: 5,
                      }}
                      baseColor="#7F859E"
                      value={this.state.locate_rep_onsite_name}
                      onChangeText={locate_rep_onsite_name =>
                        this.setState({locate_rep_onsite_name})
                      }
                    />
                  </View>
                  <Image
                    style={{position: 'absolute', right: 15, top: 20}}
                    source={image.user}
                  />
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1, marginTop: 10}}>
                    <TextInput
                      placeholder="Phone"
                      placeholderTextColor="#76838F"
                      autoCorrect={false}
                      autoCapitalize="none"
                      keyboardType="numeric"
                      lineWidth={0}
                      maxLength={14}
                      activeLineWidth={0}
                      style={{
                        color: '#000',
                        height: 55,
                        backgroundColor: 'white',
                        borderWidth: 0.2,
                        paddingLeft: 10,
                        borderRadius: 5,
                      }}
                      baseColor="#7F859E"
                      value={this.state.locate_rep_onsite_phone}
                      onChangeText={locate_rep_onsite_phone =>
                        this._validatePhone(locate_rep_onsite_phone, 4)
                      }
                    />
                  </View>
                  <Image
                    style={{position: 'absolute', right: 15, top: 20}}
                    source={image.phoneCall}
                  />
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1, marginTop: 10}}>
                    <TextInput
                      placeholder="Email"
                      placeholderTextColor="#76838F"
                      autoCorrect={false}
                      autoCapitalize="none"
                      lineWidth={0}
                      activeLineWidth={0}
                      style={{
                        color: '#000',
                        backgroundColor: 'white',
                        borderWidth: 0.2,
                        padding: 15,
                        borderRadius: 5,
                      }}
                      baseColor="#7F859E"
                      value={this.state.locate_rep_onsite_email}
                      onChangeText={text =>
                        this._validateEmail(text, 'locate_rep_onsite_email')
                      }
                    />
                  </View>
                  <Image
                    style={{position: 'absolute', right: 15, top: 20}}
                    source={image.mailIcon}
                  />
                </View>
                {this.state.locate_rep_onsite_email_error && (
                  <Text style={styless.emailError}>{this.props?.t('Invalid email.')}</Text>
                )}
              </View>
            </View>
            <View style={{marginTop: 10}}>
              <Text style={{fontWeight: 'bold'}}>
              {this.props?.t('Description of Liability or Locator Response')}
              </Text>
            </View>
            <View style={{marginTop: 10}}>
              <Textarea
                rowSpan={5}
                bordered
                placeholder="Description of Liability or Locator Response"
                style={{backgroundColor: '#fff'}}
                value={this.state.locator_response_desc}
                onChangeText={locator_response_desc =>
                  this.setState({locator_response_desc})
                }
              />
            </View>

            <View
              style={{marginTop: 20, marginBottom: 20, flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => this.nextStep(1)}
                style={{
                  marginRight: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#000000',
                  alignSelf: 'center',
                  height: 50,
                  flex: 0.5,
                }}>
                <Text style={{color: 'white'}}>{this.props?.t('Back')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.nextStep(3)}
                style={{
                  marginLeft: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#FEBF26',
                  alignSelf: 'center',
                  height: 50,
                  flex: 0.5,
                }}>
                <Text style={{color: 'white'}}>{this.props?.t('Next')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      );
    } else if (this.state.flag === 3) {
      return (
        <ScrollView
          ref="_scrollView3"
          style={{backgroundColor: '#F1F1F1', margin: 10, marginTop: 50}}>
          {this._renderHeader()}
          <View style={{justifyContent: 'center', marginTop: 20}}>
            <Text
              style={{
                fontWeight: 'bold',
                textAlign: 'center',
                color: 'black',
                fontSize: 20,
                color: '#2C3E50',
              }}>
              {this.props?.t('DOCUMENTATION UPLOAD')}
            </Text>
          </View>
          <View style={{marginLeft: 15, marginRight: 15}}>
            <View>
              <View style={{marginTop: 20, marginBottom: 10}}>
                <Text style={{fontWeight: 'bold'}}>
                {this.props?.t('Upload Photo of White Markings (Pre-Excavation)')}
                </Text>
              </View>
              <View
                style={{
                  height: 55,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}>
                <TouchableOpacity
                  onPress={() => this.selectPhotosMarking(1, true)}
                  style={{
                    alignSelf: 'center',
                    paddingTop: 10,
                    paddingBottom: 10,
                    backgroundColor: '#FFBC42',
                    marginTop: 10,
                    width: '48%',
                  }}>
                  <Text
                    style={{
                      fontSize: 17,
                      fontFamily: 'OpenSans-Bold',
                      textAlign: 'center',
                    }}>
                    {this.props?.t('UPLOAD PHOTO')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.selectPhotosMarking(1)}
                  style={{
                    alignSelf: 'center',
                    paddingTop: 10,
                    paddingBottom: 10,
                    backgroundColor: '#FFBC42',
                    marginTop: 10,
                    width: '48%',
                  }}>
                  <Text
                    style={{
                      fontSize: 17,
                      fontFamily: 'OpenSans-Bold',
                      textAlign: 'center',
                    }}>
                    {this.props?.t('TAKE A PHOTO')}
                  </Text>
                </TouchableOpacity>
              </View>
              {this.state.upload_white_marking !== '' ? (
                <View>
                  {this.state.upload_white_marking.map((item, index) => {
                    return (
                      <View style={{marginTop: 10}}>
                        <View>
                          <Image
                            style={{height: 30, width: 30}}
                            source={{uri: item.uri}}
                          />
                        </View>
                      </View>
                    );
                  })}
                </View>
              ) : null}
              {this.state.damageIncidentData !== null &&
              this.state.damageIncidentData !== '' ? (
                <View>
                  {this.state.damageIncidentData?.damage_media !== null ? (
                    <View style={{marginTop: 10, marginBottom: 10}}>
                      {this.state.damageIncidentData?.damage_media
                        ?.upload_white_marking !== null
                        ? this.state.damageIncidentData?.damage_media?.upload_white_marking.map(
                            (v, k) => {
                              return (
                                <View
                                  style={{
                                    alignItems: 'center',
                                    marginTop: 10,
                                    backgroundColor: 'white',
                                    flexDirection: 'row',
                                    height: 40,
                                  }}>
                                  <TouchableOpacity
                                    onPress={() =>
                                      this.showPreviewImageList(
                                        v.ori_url,
                                        v.meta_value,
                                      )
                                    }
                                    style={{flex: 0.1, marginLeft: 10}}>
                                    {this._getIcon(v.meta_key)}
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() =>
                                      this.showPreviewImageList(
                                        v.ori_url,
                                        v.meta_value,
                                      )
                                    }
                                    style={{flex: 0.8}}>
                                    <Text>{v.meta_value}</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() =>
                                      this._deleteDamageIncidentMedia(v.id)
                                    }
                                    style={{flex: 0.1}}>
                                    <Image
                                      style={{height: 20, width: 20}}
                                      source={image.deleteIcon}
                                    />
                                  </TouchableOpacity>
                                </View>
                              );
                            },
                          )
                        : null}
                    </View>
                  ) : null}
                </View>
              ) : null}
            </View>
            <View style={styless.lineStyle} />
            <View>
              <View style={{marginTop: 10, marginBottom: 10}}>
                <Text style={{fontWeight: 'bold'}}>
                {this.props?.t('Upload Photo of Utility Markings (Pre-Excavation)')}
                </Text>
              </View>
              <View
                style={{
                  height: 55,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}>
                <TouchableOpacity
                  onPress={() => this.selectPhotosMarking(2, true)}
                  style={{
                    alignSelf: 'center',
                    paddingTop: 10,
                    paddingBottom: 10,
                    backgroundColor: '#FFBC42',
                    marginTop: 10,
                    width: '48%',
                  }}>
                  <Text
                    style={{
                      fontSize: 17,
                      fontFamily: 'OpenSans-Bold',
                      textAlign: 'center',
                    }}>
                    {this.props?.t('UPLOAD PHOTO')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.selectPhotosMarking(2)}
                  style={{
                    alignSelf: 'center',
                    paddingTop: 10,
                    paddingBottom: 10,
                    backgroundColor: '#FFBC42',
                    marginTop: 10,
                    width: '48%',
                  }}>
                  <Text
                    style={{
                      fontSize: 17,
                      fontFamily: 'OpenSans-Bold',
                      textAlign: 'center',
                    }}>
                    {this.props?.t('TAKE A PHOTO')}
                  </Text>
                </TouchableOpacity>
              </View>
              {this.state.upload_utility_marking !== '' ? (
                <View>
                  {this.state.upload_utility_marking.map((item, index) => {
                    return (
                      <View style={{marginTop: 10}}>
                        <View>
                          <Image
                            style={{height: 30, width: 30}}
                            source={{uri: item.uri}}
                          />
                        </View>
                      </View>
                    );
                  })}
                </View>
              ) : null}
              {this.state.damageIncidentData !== null &&
              this.state.damageIncidentData !== '' ? (
                <View>
                  {this.state.damageIncidentData?.damage_media !== null ? (
                    <View style={{marginTop: 10, marginBottom: 10}}>
                      {this.state.damageIncidentData?.damage_media
                        ?.upload_utility_marking !== null
                        ? this.state.damageIncidentData.damage_media.upload_utility_marking.map(
                            (v, k) => {
                              return (
                                <View
                                  style={{
                                    alignItems: 'center',
                                    marginTop: 10,
                                    backgroundColor: 'white',
                                    flexDirection: 'row',
                                    height: 40,
                                  }}>
                                  <TouchableOpacity
                                    onPress={() =>
                                      this.showPreviewImageList(
                                        v.ori_url,
                                        v.meta_value,
                                      )
                                    }
                                    style={{flex: 0.1, marginLeft: 10}}>
                                    {this._getIcon(v.meta_key)}
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() =>
                                      this.showPreviewImageList(
                                        v.ori_url,
                                        v.meta_value,
                                      )
                                    }
                                    style={{flex: 0.8}}>
                                    <Text>{v.meta_value}</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() =>
                                      this._deleteDamageIncidentMedia(v.id)
                                    }
                                    style={{flex: 0.1}}>
                                    <Image
                                      style={{height: 20, width: 20}}
                                      source={image.deleteIcon}
                                    />
                                  </TouchableOpacity>
                                </View>
                              );
                            },
                          )
                        : null}
                    </View>
                  ) : null}
                </View>
              ) : null}
            </View>
            <View style={styless.lineStyle} />
            <View>
              <View style={{marginTop: 10, marginBottom: 10}}>
                <Text style={{fontWeight: 'bold'}}>
                {this.props?.t('Upload Photos/Videos of Damage')}
                </Text>
              </View>
              <View
                style={{
                  height: 55,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}>
                <TouchableOpacity
                  onPress={() => this.selectPhotosMarking(3, true)}
                  style={{
                    alignSelf: 'center',
                    paddingTop: 10,
                    paddingBottom: 10,
                    backgroundColor: '#FFBC42',
                    marginTop: 10,
                    width: '48%',
                  }}>
                  <Text
                    style={{
                      fontSize: 17,
                      fontFamily: 'OpenSans-Bold',
                      textAlign: 'center',
                    }}>
                    {this.props?.t('UPLOAD PHOTO')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.selectPhotosMarking(3)}
                  style={{
                    alignSelf: 'center',
                    paddingTop: 10,
                    paddingBottom: 10,
                    backgroundColor: '#FFBC42',
                    marginTop: 10,
                    width: '48%',
                  }}>
                  <Text
                    style={{
                      fontSize: 17,
                      fontFamily: 'OpenSans-Bold',
                      textAlign: 'center',
                    }}>
                    {this.props?.t('TAKE A PHOTO')}
                  </Text>
                </TouchableOpacity>
              </View>
              {this.state.upload_damage !== '' ? (
                <View>
                  {this.state.upload_damage.map((item, index) => {
                    return (
                      <View style={{marginTop: 10}}>
                        <View>
                          <Image
                            style={{height: 30, width: 30}}
                            source={{uri: item.uri}}
                          />
                        </View>
                      </View>
                    );
                  })}
                </View>
              ) : null}
              {this.state.damageIncidentData !== null &&
              this.state.damageIncidentData !== '' ? (
                <View>
                  {this.state.damageIncidentData.damage_media !== null ? (
                    <View style={{marginTop: 10, marginBottom: 10}}>
                      {this.state.damageIncidentData.damage_media
                        .upload_damage !== null
                        ? this.state.damageIncidentData.damage_media.upload_damage.map(
                            (v, k) => {
                              return (
                                <View
                                  style={{
                                    alignItems: 'center',
                                    marginTop: 10,
                                    backgroundColor: 'white',
                                    flexDirection: 'row',
                                    height: 40,
                                  }}>
                                  <TouchableOpacity
                                    onPress={() =>
                                      this.showPreviewImageList(
                                        v.ori_url,
                                        v.meta_value,
                                      )
                                    }
                                    style={{flex: 0.1, marginLeft: 10}}>
                                    {this._getIcon(v.meta_key)}
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() =>
                                      this.showPreviewImageList(
                                        v.ori_url,
                                        v.meta_value,
                                      )
                                    }
                                    style={{flex: 0.8}}>
                                    <Text>{v.meta_value}</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() =>
                                      this._deleteDamageIncidentMedia(v.id)
                                    }
                                    style={{flex: 0.1}}>
                                    <Image
                                      style={{height: 20, width: 20}}
                                      source={image.deleteIcon}
                                    />
                                  </TouchableOpacity>
                                </View>
                              );
                            },
                          )
                        : null}
                    </View>
                  ) : null}
                </View>
              ) : null}
            </View>
            <View style={styless.lineStyle} />
            <View>
              <View style={{marginTop: 10, marginBottom: 10}}>
                <Text style={{fontWeight: 'bold'}}>
                {this.props?.t('Upload Photo/Videos of Utility Response')}
                </Text>
              </View>
              <View
                style={{
                  height: 55,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}>
                <TouchableOpacity
                  onPress={() => this.selectPhotosMarking(4, true)}
                  style={{
                    alignSelf: 'center',
                    paddingTop: 10,
                    paddingBottom: 10,
                    backgroundColor: '#FFBC42',
                    marginTop: 10,
                    width: '48%',
                  }}>
                  <Text
                    style={{
                      fontSize: 17,
                      fontFamily: 'OpenSans-Bold',
                      textAlign: 'center',
                    }}>
                    {this.props?.t('UPLOAD PHOTO')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.selectPhotosMarking(4)}
                  style={{
                    alignSelf: 'center',
                    paddingTop: 10,
                    paddingBottom: 10,
                    backgroundColor: '#FFBC42',
                    marginTop: 10,
                    width: '48%',
                  }}>
                  <Text
                    style={{
                      fontSize: 17,
                      fontFamily: 'OpenSans-Bold',
                      textAlign: 'center',
                    }}>
                    {this.props?.t('TAKE A PHOTO')}
                  </Text>
                </TouchableOpacity>
              </View>
              {this.state.upload_utility_response !== '' ? (
                <View>
                  {this.state.upload_utility_response.map((item, index) => {
                    return (
                      <View style={{marginTop: 10}}>
                        <View>
                          <Image
                            style={{height: 30, width: 30}}
                            source={{uri: item.uri}}
                          />
                        </View>
                      </View>
                    );
                  })}
                </View>
              ) : null}
              {this.state.damageIncidentData !== null &&
              this.state.damageIncidentData !== '' ? (
                <View>
                  {this.state.damageIncidentData.damage_media !== null ? (
                    <View style={{marginTop: 10, marginBottom: 10}}>
                      {this.state.damageIncidentData.damage_media
                        .upload_utility_response !== null
                        ? this.state.damageIncidentData.damage_media.upload_utility_response.map(
                            (v, k) => {
                              return (
                                <View
                                  style={{
                                    alignItems: 'center',
                                    marginTop: 10,
                                    backgroundColor: 'white',
                                    flexDirection: 'row',
                                    height: 40,
                                  }}>
                                  <TouchableOpacity
                                    onPress={() =>
                                      this.showPreviewImageList(
                                        v.ori_url,
                                        v.meta_value,
                                      )
                                    }
                                    style={{flex: 0.1, marginLeft: 10}}>
                                    {this._getIcon(v.meta_key)}
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() =>
                                      this.showPreviewImageList(
                                        v.ori_url,
                                        v.meta_value,
                                      )
                                    }
                                    style={{flex: 0.8}}>
                                    <Text>{v.meta_value}</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() =>
                                      this._deleteDamageIncidentMedia(v.id)
                                    }
                                    style={{flex: 0.1}}>
                                    <Image
                                      style={{height: 20, width: 20}}
                                      source={image.deleteIcon}
                                    />
                                  </TouchableOpacity>
                                </View>
                              );
                            },
                          )
                        : null}
                    </View>
                  ) : null}
                </View>
              ) : null}
            </View>
            <View style={styless.lineStyle} />
            <View>
              <View style={{marginTop: 10, marginBottom: 10}}>
                <Text style={{fontWeight: 'bold'}}>
                {this.props?.t('Upload Other Supporting Images and Documents')}
                </Text>
              </View>
              <View
                style={{
                  height: 55,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}>
                <TouchableOpacity
                  onPress={() => this.selectPhotosMarking(5, true)}
                  style={{
                    alignSelf: 'center',
                    paddingTop: 10,
                    paddingBottom: 10,
                    backgroundColor: '#FFBC42',
                    marginTop: 10,
                    width: '48%',
                  }}>
                  <Text
                    style={{
                      fontSize: 17,
                      fontFamily: 'OpenSans-Bold',
                      textAlign: 'center',
                    }}>
                    {this.props?.t('UPLOAD PHOTO')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.selectPhotosMarking(5)}
                  style={{
                    alignSelf: 'center',
                    paddingTop: 10,
                    paddingBottom: 10,
                    backgroundColor: '#FFBC42',
                    marginTop: 10,
                    width: '48%',
                  }}>
                  <Text
                    style={{
                      fontSize: 17,
                      fontFamily: 'OpenSans-Bold',
                      textAlign: 'center',
                    }}>
                    {this.props?.t('TAKE A PHOTO')}
                  </Text>
                </TouchableOpacity>
              </View>
              {this.state.upload_other_img_doc !== '' ? (
                <View>
                  {this.state.upload_other_img_doc.map((item, index) => {
                    return (
                      <View style={{marginTop: 10}}>
                        <View>
                          <Image
                            style={{height: 30, width: 30}}
                            source={{uri: item.uri}}
                          />
                        </View>
                      </View>
                    );
                  })}
                </View>
              ) : null}
              {this.state.damageIncidentData !== null &&
              this.state.damageIncidentData !== '' ? (
                <View>
                  {this.state.damageIncidentData.damage_media !== null ? (
                    <View style={{marginTop: 10, marginBottom: 10}}>
                      {this.state.damageIncidentData.damage_media
                        .upload_other_img_doc !== null
                        ? this.state.damageIncidentData.damage_media.upload_other_img_doc.map(
                            (v, k) => {
                              return (
                                <View
                                  style={{
                                    alignItems: 'center',
                                    marginTop: 10,
                                    backgroundColor: 'white',
                                    flexDirection: 'row',
                                    height: 40,
                                  }}>
                                  <TouchableOpacity
                                    onPress={() =>
                                      this.showPreviewImageList(
                                        v.ori_url,
                                        v.meta_value,
                                      )
                                    }
                                    style={{flex: 0.1, marginLeft: 10}}>
                                    {this._getIcon(v.meta_key)}
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() =>
                                      this.showPreviewImageList(
                                        v.ori_url,
                                        v.meta_value,
                                      )
                                    }
                                    style={{flex: 0.8}}>
                                    <Text>{v.meta_value}</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() =>
                                      this._deleteDamageIncidentMedia(v.id)
                                    }
                                    style={{flex: 0.1}}>
                                    <Image
                                      style={{height: 20, width: 20}}
                                      source={image.deleteIcon}
                                    />
                                  </TouchableOpacity>
                                </View>
                              );
                            },
                          )
                        : null}
                    </View>
                  ) : null}
                </View>
              ) : null}
            </View>

            <View
              style={{marginTop: 20, marginBottom: 20, flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => this.setState({flag: 2})}
                style={{
                  marginRight: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#000000',
                  alignSelf: 'center',
                  height: 50,
                  flex: 0.5,
                }}>
                <Text style={{color: 'white'}}>{this.props?.t('Back')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.uploadDamageIncidentAPI(0)}
                style={{
                  marginLeft: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#FEBF26',
                  alignSelf: 'center',
                  height: 50,
                  flex: 0.5,
                }}>
                <Text style={{color: 'white'}}>
                  {this.state.damage_inc_id === '' ? 'Submit' : 'Update'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      );
    }
  }

  _renderHeader = () => {
    return (
      <>
        <View
          style={{
            height: 50,
            backgroundColor: '#FFBC42',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: 'black',
              fontFamily: 'OpenSans-Bold',
              fontSize: 16,
            }}>
            {this.props?.t('Damage Incident Form')}
          </Text>
          <TouchableOpacity
            onPress={() =>
              this.setState({
                showModal: false,
                damage_inc_id: '',
                damageIncidentData: '',
              })
            }
            style={{position: 'absolute', right: 20}}>
            <Image style={{height: 20, width: 20}} source={image.closeIcon} />
          </TouchableOpacity>
        </View>
        {this.renderStepsHeader()}
      </>
    );
  };

  renderPreviewPopUpContent = () => {
    return (
      <View style={{minHeight: Dimensions.get('window').height - 30}}>
        {this.state.is_doc ? (
          <WebView
            ref={ref => (this.webViewPreviewRef = ref)}
            source={{uri: this.state.previewDocURL}}
            startInLoadingState={true}
            javaScriptEnabled={true}
            scalesPageToFit={true}
            injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=640'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);`}
            scrollEnabled={true}
            bounces={true}
            allowUniversalAccessFromFileURLs={true}
            onNavigationStateChange={this.onNavigationStateChange}
          />
        ) : (
          <ImageViewer
            enableImageZoom={true}
            enablePreload={true}
            footerContainerStyle={{width: '100%'}}
            renderFooter={() => this.renderPreviewText()}
            renderIndicator={(currentIndex, allSize) => {
              return null;
            }}
            imageUrls={[{url: this.state.previewImageURL}]}
            loadingRender={() => this.renderLoader()}
          />
        )}

        {this.state.is_doc && this.renderPreviewText()}
      </View>
    );
  };
  render() {
    //    const { stage } = this.state;
    const steOneL = Object.keys(this.state.StepOneData).length;
    var urisThumb = this.state.StepOneData.map((key, index) => ({
      uri: config.THUMB_IMAGE_URL + '/' + key.image,
    }));
    FastImage.preload(urisThumb);
    var uris = this.state.StepOneData.map((key, index) => ({
      uri: config.IMAGE_URL + '/' + key.image,
    }));
    FastImage.preload(uris);

    const stepOne = this.state.StepOneData.map((key, index) => {
      //console.log(key)
      return (
        <View>
          <View
            style={{
              flexBasis: '100%',
              width: '100%',
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginTop: 15,
              marginLeft: 5,
              marginRight: 5,
              position: 'relative',
            }}>
            <TouchableOpacity
              onPress={() =>
                this.showPreviewImage(
                  config.IMAGE_URL + '/' + key.image_prev,
                  key.image_desc,
                  '',
                  key.ori_file,
                )
              }>
              <FastImage
                indicatorProps={{color: '#febf26'}}
                key={key.image}
                onLoad={e => this.setState({imageLoad: true})}
                style={{
                  flexBasis: '100%',
                  height: 150,
                  marginBottom: 0,
                  marginRight: 5,
                  width: Dimensions.get('window').width / 2.5,
                  backgroundColor: '#fff',
                  zIndex: 0,
                  resizeMode: 'contain',
                }}
                source={{uri: config.THUMB_IMAGE_URL + '/' + key.image}}
                resizeMode="contain"></FastImage>
            </TouchableOpacity>
            <View style={{position: 'absolute', left: 0, top: 0}}>
              <View
                style={{padding: 5, backgroundColor: '#FFBC42', width: '100%'}}>
                <Text style={{fontSize: 10, textAlign: 'center'}}>
                  {key?.timestamp}
                </Text>
              </View>
            </View>
            <View style={{position: 'absolute', right: 0, top: -20}}>
              <TouchableOpacity
                key={'D' + key.image}
                onPress={() => this.downloadImage(key.ori_file)}
                style={{
                  top: 5,
                  right: 30,
                  position: 'absolute',
                  textAlign: 'center',
                }}>
                <Icon
                  ios="md-download"
                  android="md-download"
                  style={{
                    color: '#fff',
                    backgroundColor: '#000',
                    fontSize: 16,
                    padding: 2,
                    width: 20,
                    height: 20,
                    top: 5,
                    right: 2,
                    textAlign: 'center',
                    borderRadius: 50,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                key={key.image}
                onPress={() => this.deleteImage(key.auto_id, 1)}
                style={{
                  top: 5,
                  right: 0,
                  position: 'absolute',
                  textAlign: 'center',
                }}>
                <Icon
                  type="FontAwesome"
                  name="trash"
                  style={{
                    color: '#fff',
                    backgroundColor: '#000',
                    fontSize: 16,
                    padding: 2,
                    width: 20,
                    height: 20,
                    top: 5,
                    right: 2,
                    textAlign: 'center',
                    borderRadius: 50,
                  }}
                />
              </TouchableOpacity>
            </View>
            {/*<Text style={{ backgroundColor: "#000", color: "#fff", padding: 5, fontSize: 12,width:'100%',flex:1,flexBasis: '100%'}}>Testing, caption, caption2, caption3</Text>*/}
          </View>
        </View>
      );
    });

    const stepThreeL = Object.keys(this.state.StepThreeData).length;
    var urisThumb = this.state.StepThreeData.map((key, index) => ({
      uri: config.THUMB_IMAGE_URL + '/' + key.image,
    }));
    FastImage.preload(urisThumb);
    var uris = this.state.StepThreeData.map((key, index) => ({
      uri: config.IMAGE_URL + '/' + key.image,
    }));
    FastImage.preload(uris);

    const stepThree = this.state.StepThreeData.map((key, index) => {
      if (typeof key.image != 'undefined') {
        return (
          <View>
            <View
              style={{
                flexBasis: '100%',
                width: '100%',
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginTop: 15,
                marginLeft: 5,
                marginRight: 5,
                position: 'relative',
              }}>
              <TouchableOpacity
                onPress={() =>
                  this.showPreviewImage(
                    config.IMAGE_URL + '/' + key.image_prev,
                    key.image_desc,
                    '',
                    key.ori_file,
                  )
                }>
                <FastImage
                  indicatorProps={{color: '#febf26'}}
                  key={key.image}
                  style={{
                    flexBasis: '100%',
                    height: 150,
                    marginBottom: 0,
                    marginRight: 5,
                    width: Dimensions.get('window').width / 2.5,
                    backgroundColor: '#fff',
                    zIndex: 0,
                    resizeMode: 'contain',
                  }}
                  source={{uri: config.THUMB_IMAGE_URL + '/' + key.image}}
                  resizeMode="contain"></FastImage>
              </TouchableOpacity>
              <View style={{position: 'absolute', left: 0, top: 0}}>
                <View
                  style={{
                    padding: 5,
                    backgroundColor: '#FFBC42',
                    width: '100%',
                  }}>
                  <Text style={{fontSize: 10, textAlign: 'center'}}>
                    {key?.timestamp}
                  </Text>
                </View>
              </View>
              <View style={{position: 'absolute', right: 0, top: -20}}>
                <TouchableOpacity
                  key={'D' + key.image}
                  onPress={() => this.downloadImage(key.ori_file)}
                  style={{
                    top: 5,
                    right: 30,
                    position: 'absolute',
                    textAlign: 'center',
                  }}>
                  <Icon
                    ios="md-download"
                    android="md-download"
                    style={{
                      color: '#fff',
                      backgroundColor: '#000',
                      fontSize: 16,
                      padding: 2,
                      width: 20,
                      height: 20,
                      top: 5,
                      right: 2,
                      textAlign: 'center',
                      borderRadius: 50,
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  key={key.image}
                  onPress={() => this.deleteImage(key.auto_id, 3)}
                  style={{
                    top: 5,
                    right: 0,
                    position: 'absolute',
                    textAlign: 'center',
                  }}>
                  <Icon
                    type="FontAwesome"
                    name="trash"
                    style={{
                      color: '#fff',
                      backgroundColor: '#000',
                      fontSize: 16,
                      padding: 2,
                      width: 20,
                      height: 20,
                      top: 5,
                      right: 2,
                      textAlign: 'center',
                      borderRadius: 50,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      }
    });

    const stepFourL = Object.keys(this.state.StepFourData).length;
    var urisThumb = this.state.StepFourData.map((key, index) => ({
      uri: config.THUMB_IMAGE_URL + '/' + key.image,
    }));
    FastImage.preload(urisThumb);
    var uris = this.state.StepFourData.map((key, index) => ({
      uri: config.IMAGE_URL + '/' + key.image,
    }));
    FastImage.preload(uris);
    const stepFour = this.state.StepFourData.map((key, index) => {
      if (typeof key.image != 'undefined') {
        return (
          <View>
            <View
              style={{
                flexBasis: '100%',
                width: '100%',
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginTop: 15,
                marginLeft: 10,
                position: 'relative',
              }}>
              <TouchableOpacity
                onPress={() =>
                  this.showPreviewImage(
                    config.IMAGE_URL + '/' + key.image_prev,
                    key.image_desc,
                    '',
                    key.ori_file,
                  )
                }>
                <FastImage
                  indicatorProps={{color: '#febf26'}}
                  key={key.image}
                  style={{
                    flexBasis: '50%',
                    height: 150,
                    marginBottom: 10,
                    marginRight: 5,
                    width: Dimensions.get('window').width / 2.5,
                    resizeMode: 'contain',
                  }}
                  source={{uri: config.THUMB_IMAGE_URL + '/' + key.image}}
                  resizeMode="contain"></FastImage>
              </TouchableOpacity>
              <View style={{position: 'absolute', right: 0, top: -20}}>
                <TouchableOpacity
                  key={'D' + key.image}
                  onPress={() => this.downloadImage(key.ori_file)}
                  style={{
                    top: 5,
                    right: 30,
                    position: 'absolute',
                    textAlign: 'center',
                  }}>
                  <Icon
                    ios="md-download"
                    android="md-download"
                    style={{
                      color: '#fff',
                      backgroundColor: '#000',
                      fontSize: 16,
                      padding: 2,
                      width: 20,
                      height: 20,
                      top: 5,
                      right: 2,
                      textAlign: 'center',
                      borderRadius: 50,
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  key={key.image}
                  onPress={() => this.deleteImage(key.auto_id, 3)}
                  style={{
                    top: 5,
                    right: 0,
                    position: 'absolute',
                    textAlign: 'center',
                  }}>
                  <Icon
                    type="FontAwesome"
                    name="trash"
                    style={{
                      color: '#fff',
                      backgroundColor: '#000',
                      fontSize: 16,
                      padding: 2,
                      width: 20,
                      height: 20,
                      top: 5,
                      right: 2,
                      textAlign: 'center',
                      borderRadius: 50,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      }
    });

    const stepFiveL = Object.keys(this.state.StepFiveData).length;
    var urisThumb = this.state.StepFiveData.map((key, index) => ({
      uri: config.THUMB_IMAGE_URL + '/' + key.image,
    }));
    FastImage.preload(urisThumb);
    var uris = this.state.StepFiveData.map((key, index) => ({
      uri: config.IMAGE_URL + '/' + key.image,
    }));
    FastImage.preload(uris);

    const stepFive = this.state.StepFiveData.map((key, index) => {
      if (typeof key.image != 'undefined') {
        return (
          <View>
            <View
              style={{
                flexBasis: '100%',
                width: '100%',
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginTop: 15,
                marginLeft: 10,
                position: 'relative',
              }}>
              <TouchableOpacity
                onPress={() =>
                  this.showPreviewImage(
                    config.IMAGE_URL + '/' + key.image_prev,
                    key.image_desc,
                    '',
                    key.ori_file,
                  )
                }>
                <FastImage
                  indicatorProps={{color: '#febf26'}}
                  key={key.image}
                  style={{
                    flexBasis: '50%',
                    height: 150,
                    marginBottom: 10,
                    marginRight: 5,
                    width: Dimensions.get('window').width / 2.5,
                  }}
                  source={{uri: config.THUMB_IMAGE_URL + '/' + key.image}}
                  resizeMode="contain"></FastImage>
              </TouchableOpacity>
              <View style={{position: 'absolute', right: 0, top: -20}}>
                <TouchableOpacity
                  key={'D' + key.image}
                  onPress={() => this.downloadImage(key.ori_file)}
                  style={{
                    top: 5,
                    right: 30,
                    position: 'absolute',
                    textAlign: 'center',
                  }}>
                  <Icon
                    ios="md-download"
                    android="md-download"
                    style={{
                      color: '#fff',
                      backgroundColor: '#000',
                      fontSize: 16,
                      padding: 2,
                      width: 20,
                      height: 20,
                      top: 5,
                      right: 2,
                      textAlign: 'center',
                      borderRadius: 50,
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  key={key.image}
                  onPress={() => this.deleteImage(key.auto_id, 5)}
                  style={{
                    top: 5,
                    right: 0,
                    position: 'absolute',
                    textAlign: 'center',
                  }}>
                  <Icon
                    type="FontAwesome"
                    name="trash"
                    style={{
                      color: '#fff',
                      backgroundColor: '#000',
                      fontSize: 16,
                      padding: 2,
                      width: 20,
                      height: 20,
                      top: 5,
                      right: 2,
                      textAlign: 'center',
                      borderRadius: 50,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      }
    });

    const ImageLoader = () => {
      if (this.hasImage) {
        return (
          <ActivityIndicator
            color="#fc9f04"
            style={{alignItems: 'center'}}
            size={'small'}
            animating={!this.state.imageLoad}
          />
        );
      } else {
        return null;
      }
    };

    const resetDamageFormData = () => {
      this.setState({
        selectedHours: 0,
        selectedMinutes: 0,
        flag: 0,
        damageIncidentData: '',
        incident_date: moment().format('MM-DD-YYYY'),
        incident_time: '',
        approx_location: '',
        ground_above_below: '',
        shutdown: '',
        incident_desc: '',
        utility_men_impacted: '',
        damage_desc: '',
        utility_rep_contact_name: '',
        utility_rep_contact_phone: '',
        utility_rep_contact_email: '',
        utility_rep_contact_email_error: false,
        utility_rep_onsite_name: '',
        utility_rep_onsite_phone: '',
        utility_rep_onsite_email: '',
        utility_rep_onsite_email_error: false,
        utility_trucks: '',
        utility_personnel: '',
        utility_equipment: '',
        response_onsite_time: '',
        liability_utility_determination: '',
        utility_response_desc: '',
        line_locate_company: '',
        locate_date: moment().format('MM-DD-YYYY'),
        locate_time: '',
        damaged_facility_marked: '',
        distance_bw_mark_facility: '',
        liability_locator_determination: '',
        locate_rep_contact_name: '',
        locate_rep_contact_phone: '',
        locate_rep_contact_email: '',
        locate_rep_contact_email_error: false,
        locate_rep_onsite_name: '',
        locate_rep_onsite_phone: '',
        locate_rep_onsite_email: '',
        locate_rep_onsite_email_error: false,
        locator_response_desc: '',
        upload_white_marking: '',
        upload_utility_marking: '',
        upload_damage: '',
        upload_utility_response: '',
        upload_other_img_doc: '',
        timepicker1_visible: false,
        datepicker1_visible: false,
        damageLoader: false,
      });
    };

    const showDamageForm = () => {
      this.setState({
        showModal: true,
        flag: 0,
        damageIncidentData: '',
        damage_inc_id: '',
      });
      resetDamageFormData();
    };

    const getDamageForm = id => {
      if (this.mounted) {
        this.props.changeLoadingState(true);
      }
      this.setState({
        damage_inc_id: '',
        flag: 0,
      });

      fetch(
        config.BASE_URL +
          'damage-incident-detail?dmg_inc_id=' +
          id +
          '&app_version=' +
          app_version +
          '&api_token=' +
          config.currentToken,
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + config.currentToken,
          },
        },
      )
        .then(response => response.json())
        .then(res => {
          if (this.mounted) {
            if (res.status == 1) {
              this.setState(
                {
                  damageIncidentData: res?.data || '',
                  damage_inc_id: res?.data?.id || '',
                },
                () => {
                  this.setDamageIncidentData();
                },
              );
            }
          }
          this.props.changeLoadingState(false);
        })
        .catch(err => {
          if (this.mounted) {
            _showErrorMessage('Something went wrong, Try again later.');
            this.props.changeLoadingState(false);
          }
        })
        .done();
    };

    const deleteDamageFormConfirm = id => {
      Alert.alert(
        'DELETE DAMAGE FORM',
        'Are you sure you want to delete this form?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => deleteDamageForm(id)},
        ],
        {cancelable: false},
      );
    };

    const deleteDamageForm = id => {
      if (this.mounted) {
        this.props.changeLoadingState(true);
      }

      fetch(
        config.BASE_URL +
          'damage-incident-delete?dmg_inc_id=' +
          id +
          '&app_version=' +
          app_version +
          '&api_token=' +
          config.currentToken,
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + config.currentToken,
          },
        },
      )
        .then(response => {
          return response.json();
        })
        .then(res => {
          if (this.mounted) {
            if (res.status == 1) {
              _showSuccessMessage(res.message);
              this._fetchDamageList(config.currentToken);
            } else {
              _showErrorMessage(res.message);
            }
          }
          this.props.changeLoadingState(false);
        })
        .catch(err => {
          if (this.mounted) {
            _showErrorMessage('Something went wrong, Try again later.');
            this.props.changeLoadingState(false);
          }
        })
        .done();
    };

    const damageFormActionBtn = data => {
      return (
        <View
          style={{
            width: '25%',
            height: 30,
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              getDamageForm(data?.id);
            }}
            style={{backgroundColor: '#000', marginLeft: 2}}>
            <Icon
              style={{
                color: '#fff',
                fontSize: 16,
                padding: 5,
                width: 25,
                textAlign: 'center',
              }}
              name="new-message"
              type="Entypo"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(data?.pdf_link).catch(() => null);
            }}
            style={{backgroundColor: '#000', marginLeft: 2}}>
            <Icon
              style={{
                color: '#fff',
                fontSize: 16,
                width: 25,
                height: 25,
                textAlign: 'center',
                padding: 5,
              }}
              name="download"
              type="Entypo"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              deleteDamageFormConfirm(data?.id);
            }}
            style={{backgroundColor: '#000', marginLeft: 2}}>
            <Icon
              style={{
                color: '#fff',
                fontSize: 16,
                padding: 5,
                width: 25,
                textAlign: 'center',
              }}
              name="trash"
              type="Entypo"
            />
          </TouchableOpacity>
        </View>
      );
    };

    return (
      <View>
        <TouchableOpacity
          style={styless.outer}
          onPress={() => this.goTabHandler(1)}>
          <View style={styless.listContainer}>
            <View style={steOneL > 0 ? styless.inner : styless.innered}>
              <Text style={styless.btnTexts}>1</Text>
            </View>
            <View style={styless.innerSecond}>
              <Text style={styless.innerSecondText}>
              {this.props.t('Document Job Overview and White Paint Prior to Commencement of Work')}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        {this.state.activeTab == 1 && (
          <View
            style={{
              padding: 10,
              flex: 1,
              backgroundColor: '#eeeeee',
              borderWidth: 1,
              borderColor: '#717274',
              marginTop: 2,
              textAlign: 'center',
            }}>
            <View>
              <Text style={{fontSize: 16}}>
              {this.props.t('Prior to commencing work, take photos of the job site, document any unique circumstances and any markings of the site you have made identifying where the work is to take place.')}'
              </Text>
            </View>
            <ImageLoader />
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                flexWrap: 'wrap',
                flexGrow: 0,
                justifyContent: 'space-between',
              }}>
              {stepOne}
            </View>
            <View>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => this.uploadMultipleImage(1)}>
                <View
                  style={{
                    alignSelf: 'center',
                    paddingTop: 10,
                    paddingBottom: 10,
                    backgroundColor: '#FFBC42',
                    marginTop: 10,
                    width: '85%',
                  }}>
                  <Text
                    style={{
                      fontSize: 22,
                      fontFamily: 'OpenSans-Bold',
                      textAlign: 'center',
                    }}>
                    {this.props.t('UPLOAD PHOTO')}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => this.uploadCameraImage(1)}>
                <View
                  style={{
                    alignSelf: 'center',
                    paddingTop: 10,
                    paddingBottom: 10,
                    backgroundColor: '#FFBC42',
                    marginTop: 10,
                    width: '85%',
                  }}>
                  <Text
                    style={{
                      fontSize: 22,
                      fontFamily: 'OpenSans-Bold',
                      textAlign: 'center',
                    }}>
                    {this.props.t('TAKE A PHOTO')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            {this.state.changedImageUrl != '' && (
              <View>
                <View style={{marginTop: 10, marginBottom: 10}}>
                  {this.state.changedImageUrl.map((v, k) => {
                    return (
                      <View style={{marginTop: 10}}>
                        <Image
                          style={{
                            alignSelf: 'center',
                            height: 200,
                            width: '100%',
                            borderRadius: 5,
                          }}
                          source={v.path ? {uri: v.path} : image.noImage}
                        />
                        <Textarea
                          rowSpan={3}
                          bordered
                          placeholder="Enter a brief description of the photo"
                          style={{backgroundColor: '#fff'}}
                          onChangeText={descriptionText =>
                            this.photoDescription(1, k, descriptionText)
                          }
                        />
                      </View>
                    );
                  })}
                </View>
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 10,
                      marginBottom: 10,
                      justifyContent: 'space-between',
                    }}>
                    <Button
                      small
                      style={{
                        marginRight: 10,
                        backgroundColor: 'green',
                        justifyContent: 'center',
                        color: '#fff',
                        width: '40%',
                      }}
                      onPress={() => this.uploadFirstStepHandler()}>
                      <Text style={{color: '#fff', textAlign: 'center'}}>
                      {this.props?.t('Save')}
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
                      onPress={() => this.cancelStepUpload(1)}>
                      <Text style={{color: '#fff', textAlign: 'center'}}>
                      {this.props?.t('Cancel')}
                      </Text>
                    </Button>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}
        {/* {this.state.showTab && ( */}
   
          <TouchableOpacity
            style={styless.outer}
            onPress={() => this.goTabHandler(2)}>
            <View style={styless.listContainer}>
              <View
                style={
                  this.state.stepTwoCompleted ? styless.inner : styless.innered
                }>
                <Text style={styless.btnTexts}>2</Text>
              </View>
              <View style={styless.innerSecond}>
                <Text style={styless.innerSecondText}>
                  {this.props.t('Document Third-Party Markings')}
                </Text>
                <Text style={styless.innerSecondText}>{this.props.t('(Positive Response)')}</Text>
              </View>
            </View>
          </TouchableOpacity>
        {/* )} */}
        {this.state.activeTab == 2 && (
          <SafeAreaView forceInset={{top: 'always'}}>
            <View
              style={{
                padding: 10,
                flex: 1,
                backgroundColor: '#eeeeee',
                borderWidth: 1,
                borderColor: '#717274',
                marginTop: 2,
                textAlign: 'center',
              }}>
              <View style={{marginBottom: 5}}>
                <Text style={{fontSize: 16}}>
                  {this.props.t('Utility status will update to “cleared” once photos have been uploaded and a positive response is noted.')}
                </Text>
              </View>
              <UTILITYBOX
                propsVal={this.props}
                eTicketId={this.state.completeInfo.digid}
                updateSecondStep={this.uploadSecondStepHandler}
                utilitiesList={this.state.utilitiesList}
                utilityFcnt={this.state.uFetchCount}
                showPreviewImage={this.showPreviewImage}
                deleteImage={this.deleteImage}
                savedUtilities={this.state.savedUtilities}
                isloading={this.state.isloading}
                downloadImage={this.downloadImage}
                refreshUtilities={this._fetchUtilities}
                changeLoadingState={this.changeLoadingState2}
              />
            </View>
          </SafeAreaView>
        )}
        {/* {this.state.showTab && ( */}
          <TouchableOpacity
            style={styless.outer}
            onPress={() => this.goTabHandler(3)}>
            <View style={styless.listContainer}>
              <View
                style={
                  this.state.stepThreeCompleted
                    ? styless.inner
                    : styless.innered
                }>
                <Text style={styless.btnTexts}>3</Text>
              </View>
              <View style={styless.innerSecond}>
                <Text style={styless.innerSecondText}>
                  {this.props.t('Document Excavation and Other Job Information')}
                </Text>
                {/* <Text style={styless.innerSecondText}>
                  Other Job Information
                </Text> */}
              </View>
            </View>
          </TouchableOpacity>
        {/* )} */}
        {this.state.activeTab == 3 && (
          <View
            style={{
              padding: 10,
              flex: 1,
              backgroundColor: '#eeeeee',
              borderWidth: 1,
              borderColor: '#717274',
              marginTop: 2,
              textAlign: 'center',
            }}>
            <Text style={{fontSize: 16, marginBottom: 5}}>
            {this.props.t('Document excavation work as it is being conducted, upon completion and/or other information about the job that may be useful in the future.')}
            </Text>
            <View>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => this.uploadMultipleImage(3)}>
                <View
                  style={{
                    alignSelf: 'center',
                    width: '85%',
                    paddingTop: 10,
                    paddingBottom: 10,
                    backgroundColor: '#FFBC42',
                    marginTop: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 22,
                      fontFamily: 'OpenSans-Bold',
                      textAlign: 'center',
                    }}>
                    {this.props.t('UPLOAD PHOTO')}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => this.uploadCameraImage(3)}>
                <View
                  style={{
                    alignSelf: 'center',
                    width: '85%',
                    paddingTop: 10,
                    paddingBottom: 10,
                    backgroundColor: '#FFBC42',
                    marginTop: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 22,
                      fontFamily: 'OpenSans-Bold',
                      textAlign: 'center',
                    }}>
                    {this.props.t('TAKE A PHOTO')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {this.state.changedThirdStepImageUrl != '' && (
              <View>
                <View style={{marginTop: 10, marginBottom: 10}}>
                  {this.state.changedThirdStepImageUrl.map((v, k) => {
                    return (
                      <View style={{marginTop: 10}}>
                        <Image
                          style={{
                            alignSelf: 'center',
                            height: 200,
                            width: '100%',
                            borderRadius: 5,
                          }}
                          source={v.path ? {uri: v.path} : image.noImage}
                        />
                        <Textarea
                          rowSpan={3}
                          bordered
                          placeholder="Enter a brief description of the photo"
                          style={{backgroundColor: '#fff'}}
                          onChangeText={descriptionTextThirdStep =>
                            this.photoDescription(
                              3,
                              k,
                              descriptionTextThirdStep,
                            )
                          }
                        />
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {this.state.changedThirdStepImageUrl != '' && (
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  marginBottom: 10,
                  justifyContent: 'space-between',
                }}>
                <Button
                  small
                  style={{
                    marginRight: 10,
                    backgroundColor: 'green',
                    justifyContent: 'center',
                    color: '#fff',
                    width: '40%',
                  }}
                  onPress={() => this.uploadThirdStepHandler()}>
                  <Text style={{color: '#fff', textAlign: 'center'}}>{this.props.t('Save')}</Text>
                </Button>
                <Button
                  small
                  style={{
                    backgroundColor: '#da5531',
                    justifyContent: 'center',
                    color: '#fff',
                    width: '40%',
                  }}
                  onPress={() => this.cancelStepUpload(3)}>
                  <Text style={{color: '#fff', textAlign: 'center'}}>
                  {this.props.t('Cancel')}
                  </Text>
                </Button>
              </View>
            )}
            {/* Step 3 Images */}
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                flexWrap: 'wrap',
                flexGrow: 0,
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              {stepThree}
            </View>
          </View>
        )}
        {this.state.activeTab == 4 && (
          <View
            style={{
              padding: 10,
              flex: 1,
              backgroundColor: '#eeeeee',
              borderWidth: 1,
              borderColor: '#717274',
              marginTop: 2,
              textAlign: 'center',
            }}>
            <Text style={{fontSize: 16, marginBottom: 5}}>
              {this.props.t('Upon completion of work, take photos of the job site documenting that there has been no damage or incident.')}
            </Text>
            {!this.state.stepThreeCompleted || !this.state.stepTwoCompleted ? (
              <View style={{backgroundColor: '#313131', padding: 10}}>
                <Text style={{color: '#fff'}}>
                  {this.state.inCompleteStepMessage}
                </Text>
              </View>
            ) : (
              <View>
                {/* To show new file upload button */}
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => this.uploadMultipleImage(4)}>
                  <View
                    style={{
                      alignSelf: 'center',
                      width: '85%',
                      paddingTop: 10,
                      paddingBottom: 10,
                      backgroundColor: '#FFBC42',
                      marginTop: 10,
                    }}>
                    <Text
                      style={{
                        fontSize: 22,
                        fontFamily: 'OpenSans-Bold',
                        textAlign: 'center',
                      }}>
                      {this.props.t('UPLOAD PHOTO')}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => this.uploadCameraImage(4)}>
                  <View
                    style={{
                      alignSelf: 'center',
                      width: '85%',
                      paddingTop: 10,
                      paddingBottom: 10,
                      backgroundColor: '#FFBC42',
                      marginTop: 10,
                    }}>
                    <Text
                      style={{
                        fontSize: 22,
                        fontFamily: 'OpenSans-Bold',
                        textAlign: 'center',
                      }}>
                      {this.props.t('TAKE A PHOTO')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            {this.state.changedFourStepImageUrl != '' && (
              <View>
                <View style={{marginTop: 10, marginBottom: 10}}>
                  {this.state.changedFourStepImageUrl.map((v, k) => {
                    return (
                      <View style={{marginTop: 10}}>
                        <Image
                          style={{
                            alignSelf: 'center',
                            height: 200,
                            width: '100%',
                            borderRadius: 5,
                          }}
                          source={v.path ? {uri: v.path} : image.noImage}
                        />
                        <Textarea
                          rowSpan={3}
                          bordered
                          placeholder="Enter a brief description of the photo"
                          style={{backgroundColor: '#fff'}}
                          onChangeText={descriptionTextFourStep =>
                            this.photoDescription(4, k, descriptionTextFourStep)
                          }
                        />
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
            {this.state.changedFourStepImageUrl != '' && (
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  marginBottom: 10,
                  justifyContent: 'space-between',
                }}>
                <Button
                  small
                  style={{
                    marginRight: 10,
                    backgroundColor: 'green',
                    justifyContent: 'center',
                    color: '#fff',
                    width: '40%',
                  }}
                  onPress={() => this.uploadFourStepHandler()}>
                  <Text style={{color: '#fff', textAlign: 'center'}}>{this.props.t('Save')}</Text>
                </Button>
                <Button
                  small
                  style={{
                    backgroundColor: '#da5531',
                    justifyContent: 'center',
                    color: '#fff',
                    width: '40%',
                  }}
                  onPress={() => this.cancelStepUpload(4)}>
                  <Text style={{color: '#fff', textAlign: 'center'}}>
                  {this.props.t('Cancel')}
                  </Text>
                </Button>
              </View>
            )}
            {/* Step 4 images */}
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                flexWrap: 'wrap',
                flexGrow: 0,
                justifyContent: 'flex-start',
                marginTop: 10,
              }}>
              {stepFour}
            </View>
          </View>
        )}

        {/* {this.state.showTab && ( */}
          <TouchableOpacity
            style={styless.outer}
            onPress={() => this.goTabHandler(5)}>
            <View style={styless.listContainer}>
              <View style={styless.inneredWarn}>
                <Image
                  source={image.warning}
                  resizeMode="contain"
                  style={{height: 38, width: 38}}
                />
              </View>
              <View style={styless.innerSecondwarm}>
                <Text style={styless.innerSecondTextwarn}>
                  {this.props.t('Document Incident or Damage on Job Site')}
                </Text>
                {/* <Text style={styless.innerSecondTextwarn}>on Job Site</Text> */}
              </View>
            </View>
          </TouchableOpacity>
        {/* )} */}
        {this.state.activeTab == 5 && (
          <View
            style={{
              padding: 10,
              flex: 1,
              backgroundColor: '#eeeeee',
              borderWidth: 1,
              borderColor: '#717274',
              marginTop: 2,
              textAlign: 'center',
            }}>
            <View style={{flexDirection: 'row'}}>
              <View style={{width: '70%'}}>
                <Text style={{fontSize: 16, marginBottom: 5}}>
                {this.props?.t('If incidents or damages occur, document immediately.')}
                </Text>
              </View>
              <View style={{width: '30%'}}>
                <TouchableOpacity
                  style={{
                    height: 50,
                    width: '100%',
                    backgroundColor: '#E05439',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  activeOpacity={0.5}
                  onPress={() => showDamageForm()}>
                  <Text
                    style={{
                      fontSize: 22,
                      fontFamily: 'OpenSans-Bold',
                      textAlign: 'center',
                      color: 'white',
                    }}>
                    {this.props?.t('START')}
                  </Text>
                </TouchableOpacity>
              </View>
              {/* remove it after dynamic
                <View style={{ flex: 0.5, alignItems: 'flex-end' }}>
                {this.state.damageIncidentData ?
                  <TouchableOpacity onPress={() => Linking.openURL(this.state.damageIncidentData.pdf_link)} style={{ height: 50, width: '80%', backgroundColor: "#E05439", marginTop: 10, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                    <Icon type="FontAwesome" name="download" style={{ color: '#fff' , justifyContent: 'center', fontSize: 20, marginTop: 4}}/><Text style={{ fontSize: 22, fontFamily: 'OpenSans-Bold', textAlign: 'center', color: 'white', alignItems: 'center', justifyContent: 'center' }}>REPORT</Text>
                  </TouchableOpacity> : null}
              </View>*/}
            </View>
            <View
              style={{padding: 10, backgroundColor: '#e3e3e3', marginTop: 5}}>
              {this.state.damageListData.length > 0 &&
                this.state.damageListData.map((v, k) => {
                  return (
                    <View
                      key={'DamageList-' + k}
                      style={{
                        backgroundColor: '#fff',
                        padding: 5,
                        flexDirection: 'row',
                        borderRadius: 5,
                      }}>
                      <View style={{width: '75%', justifyContent: 'center'}}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: '400',
                            textAlign: 'left',
                          }}>
                          {v?.incident_date
                            ? moment(
                                v.incident_date,
                                'YYYY-MM-DD hh:ii',
                              ).format('MM-DD-YYYY')
                            : ''}{' '}
                          {v?.incident_time || ''} {v?.incident_loc || ''}
                        </Text>
                      </View>
                      {damageFormActionBtn(v)}
                    </View>
                  );
                })}
            </View>
            {this.state.changedFiveStepImageUrl != '' && (
              <View>
                <View style={{marginTop: 10, marginBottom: 10}}>
                  {this.state.changedFiveStepImageUrl.map((v, k) => {
                    return (
                      <View style={{marginTop: 10}}>
                        <Image
                          style={{
                            alignSelf: 'center',
                            height: 200,
                            width: '100%',
                            borderRadius: 5,
                          }}
                          source={v.path ? {uri: v.path} : image.noImage}
                        />
                        <Textarea
                          rowSpan={3}
                          bordered
                          placeholder="Enter a brief description of the photo"
                          style={{backgroundColor: '#fff'}}
                          onChangeText={descriptionTextFiveStep =>
                            this.photoDescription(5, k, descriptionTextFiveStep)
                          }
                        />
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {this.state.changedFiveStepImageUrl != '' && (
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  marginBottom: 10,
                  justifyContent: 'space-between',
                }}>
                <Button
                  small
                  style={{
                    marginRight: 10,
                    backgroundColor: 'green',
                    justifyContent: 'center',
                    color: '#fff',
                    width: '40%',
                  }}
                  onPress={() => this.uploadFiveStepHandler()}>
                  <Text style={{color: '#fff', textAlign: 'center'}}>{this.props?.t('Save')}</Text>
                </Button>
                <Button
                  small
                  style={{
                    backgroundColor: '#da5531',
                    justifyContent: 'center',
                    color: '#fff',
                    width: '40%',
                  }}
                  onPress={() => this.cancelStepUpload(5)}>
                  <Text style={{color: '#fff', textAlign: 'center'}}>
                  {this.props?.t('Cancel')}
                  </Text>
                </Button>
              </View>
            )}
            <View
              style={{
                backgroundColor: '#E05439',
                fontFamily: 'OpenSans-SemiBold',
                marginTop: 10,
                padding: 5,
              }}>
              <Text style={{color: '#fff', fontFamily: 'OpenSans-Bold'}}>
              {this.props?.t('To report an incident or damage on the job site, please call')}{' '}
                <Text
                  style={{color: '#fff', fontFamily: 'OpenSans-Bold'}}
                  onPress={() => {
                    Linking.openURL('tel:(800) 642-2444');
                  }}>
                  (800) 642-2444
                </Text>{' '}
                {this.props?.t('and provide this number')}: {this.state.ticketId}
              </Text>
            </View>
          </View>
        )}
        {this.state.isloading && <Loader />}
        {this.state.showModal && (
          <View style={styless.MainContainer}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.showModal}
              onRequestClose={() => {}}>
              <View style={{flex: 1}}>
                {this.state.damageLoader && (
                  <ActivityIndicator
                    color="#fc9f04"
                    style={styless.loader}
                    size={'large'}
                    animating={true}
                  />
                )}
                <KeyboardAwareScrollView
                  ref={'scroll'}
                  extraScrollHeight={10}
                  enableOnAndroid={true}
                  keyboardShouldPersistTaps="handled"
                  enableResetScrollToCoords={true}>
                  {!this.state.previewDamageShow &&
                    this.renderConditionalText()}
                </KeyboardAwareScrollView>
                {this.state.previewDamageShow &&
                  this.renderPreviewPopUpContent()}
              </View>
            </Modal>
          </View>
        )}

        {this.state.modalVisible && (
          <View style={styless.MainContainer}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.modalVisible}
              onRequestClose={() => {}}>
              {this.renderPreviewPopUpContent()}
            </Modal>
          </View>
        )}
      </View>
    );
  }
}

export default withTranslation()(Documentation);

class UTILITYBOX extends Component {
  constructor(props) {
    super(props);
    this.state = {
      utilities: this.props.utilitiesList.data,
      images: this.props.utilitiesList.images,
      isloading: this.props.isloading,
      eTicketId: this.props.eTicketId,
      secondStepImageUrl: '',
      descriptionText2: '',
      savedUtilities: this.props.savedUtilities,
      stepTwoUploadFile: '',
      notesModalVisible: false,
      notesText: '',
      editNoteUtilityId: '',
      editNoteUtilityCode: '',
      checkedUtilitiesArr: [],
      addUtilityModalVisible: false,
      manual_utility: '',
      utilityTabActive: {},
      utility_files: [],
      showUtilityFilter: false,
      clickedButtonType: 'upload',
      response_phone: '',
      phoneModalVisible: false,
    };
    this.checkedUtilities = [];
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentDidUpdate(prevProps) {
    if (this.props.utilityFcnt !== prevProps.utilityFcnt) {
      this.setState({
        utilities: this.props.utilitiesList.data,
        images: this.props.utilitiesList.images,
        secondStepImageUrl: '',
        notesText: '',
        checkedUtilitiesArr: [],
        showUtilityFilter: false,
        clickedButtonType: 'upload',
      });
    }
  }

  drawImages(image) {
    var urisThumb = image.map((key, index) => ({
      uri: config.THUMB_IMAGE_URL + '/' + key.image,
    }));
    FastImage.preload(urisThumb);
    var uris = image.map((key, index) => ({
      uri: config.IMAGE_URL + '/' + key.image,
    }));
    FastImage.preload(uris);
    return (
      <View>
        {image.length > 0 && (
          <Text
            style={{
              fontSize: 12,
              marginBottom: 5,
              fontFamily: 'OpenSans-Bold',
            }}>
            {this.props.propsVal.t('ALL UPLOADED FILES')}
          </Text>
        )}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            flexGrow: 0,
            justifyContent: 'space-between',
            alignItems: 'center',
            top: 0,
          }}>
          {image.map((l, s) => {
            return (
              <View
                style={{
                  width: '45%',
                  justifyContent: 'space-between',
                  backgroundColor: '#000',
                  marginBottom: 10,
                }}>
                <View
                  style={{
                    flexBasis: '100%',
                    width: '100%',
                    flexWrap: 'wrap',
                    backgroundColor: '#000',
                  }}>
                  <View
                    style={{
                      padding: 5,
                      backgroundColor: '#FFBC42',
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                      height: 30,
                    }}>
                    <Text
                      style={{
                        fontSize: 14,
                        textAlign: 'left',
                        fontWeight: 'bold',
                      }}>
                      {l?.timestamp}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.showPreviewImage(
                        config.IMAGE_URL + '/' + l.image_prev,
                        l.utility_names,
                        l.image_desc,
                        l.ori_file,
                      )
                    }
                    style={{
                      margin: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      alignSelf: 'center',
                      minHeight: 120,
                    }}>
                    {l.type == 'image' ? (
                      <FastImage
                        indicatorProps={{color: '#febf26'}}
                        key={s}
                        style={{
                          flexBasis: '40%',
                          width: '100%',
                          height: undefined,
                          aspectRatio: 1,
                          alignSelf: 'center',
                        }}
                        source={{
                          uri: config.THUMB_IMAGE_URL + '/' + l.image,
                        }}></FastImage>
                    ) : (
                      <FastImage
                        indicatorProps={{color: '#febf26'}}
                        key={s}
                        style={{
                          flexBasis: '40%',
                          width: 30,
                          height: 30,
                          aspectRatio: 1,
                          alignSelf: 'center',
                        }}
                        source={{
                          uri: config.THUMB_IMAGE_URL + '/' + l.image,
                        }}></FastImage>
                    )}
                  </TouchableOpacity>
                  <View
                    style={{
                      flexDirection: 'row',
                      borderTopColor: '#f2f2f2',
                      borderTopWidth: 1,
                      marginBottom: 5,
                    }}>
                    <Text
                      style={{
                        backgroundColor: '#000',
                        color: '#fff',
                        padding: 2,
                        fontSize: 11,
                        width: '50%',
                        flexWrap: 'wrap',
                        paddingLeft: 5,
                      }}>
                      {l.utility_names}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        width: '50%',
                      }}>
                      <TouchableOpacity
                        key={'D' + l.auto_id}
                        onPress={() => this.props.downloadImage(l.ori_file)}>
                        <Icon
                          key={'D' + l.auto_id}
                          style={{
                            color: '#fff',
                            fontSize: 16,
                            width: 25,
                            height: 25,
                            textAlign: 'center',
                            padding: 5,
                          }}
                          name="download"
                          type="Entypo"
                          onPress={() => this.props.downloadImage(l.ori_file)}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        key={s}
                        onPress={() => this.props.deleteImage(l.auto_id, 2)}>
                        <Icon
                          key={'D' + l.auto_id}
                          style={{
                            color: '#fff',
                            fontSize: 16,
                            padding: 5,
                            width: 25,
                            textAlign: 'center',
                          }}
                          name="trash"
                          type="Entypo"
                          onPress={() => this.props.downloadImage(l.ori_file)}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  }

  makeChecked = index => {
    var jsnArr = this.state.utilities;
    //jsnArr[index]['status'] = (jsnArr[index]['status'])?0:1;
    var name = jsnArr[index]['id'];
    //If Value Exist
    var iii = this.checkedUtilities.indexOf(name);
    if (iii == -1) {
      this.checkedUtilities.push(name);
    } else {
      this.checkedUtilities.splice(iii, 1);
    }
    /*if (iii !== -1) {
      this.checkedUtilities.splice(iii, 1);
    }
    else if(jsnArr[index]['status'])
    {
      this.checkedUtilities.push( name );
    }*/
    this.setState({
      //utilities:jsnArr
      checkedUtilitiesArr: this.checkedUtilities,
    });
  };

  updateImage = () => {
    if (this.state.secondStepImageUrl == '') {
      _showErrorMessage('Select Image First!');
    } else {
      const formdata = new FormData();
      formdata.append('step', 2);
      formdata.append('eticket_id', this.props.eTicketId);
      //formdata.append('utilities', this.checkedUtilities );
      formdata.append('utilities', JSON.stringify(this.checkedUtilities));
      //formdata.append('image', JSON.stringify(this.state.secondStepImageUrl) );
      /*const singleFile = this.state.stepTwoUploadFile;
      formdata.append('image', {
        uri:  singleFile.uri,
        name: singleFile.name,
        type: singleFile.type,
      });
*/
      this.state.secondStepImageUrl.forEach((item, i) => {
        formdata.append('image[]', {
          uri: item.path,
          type: 'image/jpeg',
          name: `filename${i}.jpg`,
        });
      });
      formdata.append(
        'image_desc',
        JSON.stringify(this.state.descriptionText2),
      );
      //console.log(formdata);return;
      this.props.updateSecondStep(formdata);
    }
  };

  getUploadImage(uploadKeyName) {
    const uploadFile = this.state.stepTwoUploadFile;
    var imgUri = {uri: uploadFile.uri};
    if (uploadFile.type == 'application/pdf') {
      imgUri = image.pdfIcon;
    } else if (
      uploadFile.type == 'application/msword' ||
      uploadFile.type ==
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      uploadFile.type == 'text/plain'
    ) {
      imgUri = image.docIcon;
    } else if (
      uploadFile.type == 'application/vnd.ms-excel' ||
      uploadFile.type ==
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      imgUri = image.excelIcon;
    }
    return imgUri;
  }

  /* This function call when upload button clicked it will take step and set state for image upload */
  async selectOneFile(step) {
    //Opening Document Picker for selection of one file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      if (
        res.type == 'application/pdf' ||
        res.type == 'application/msword' ||
        res.type ==
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        res.type == 'text/plain' ||
        res.type == 'application/vnd.ms-excel' ||
        res.type ==
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        res.type == 'image/png' ||
        res.type == 'image/jpeg'
      ) {
        this.setState({secondStepImageUrl: res.uri, stepTwoUploadFile: res});
      } else {
        alert('Please upload image,pdf,excel and document file.');
        return;
      }
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        //alert('You canceled document upload.');
      } else {
        //For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  }

  showNotesModal(editNoteUtilityId, editNoteText, editNoteUtilityCode) {
    this.setState({
      editNoteUtilityId: editNoteUtilityId,
      notesModalVisible: true,
      notesText: editNoteText,
      editNoteUtilityCode: editNoteUtilityCode,
    });
  }

  showPhoneModal(response_phone) {
    this.setState({
      phoneModalVisible: true,
      response_phone: response_phone,
    });
  }

  saveUtilityNotes() {
    if (this.mounted) {
      this.props.changeLoadingState(true);
      var _this = this;
      const token = config.currentToken;
      const formdata = new FormData();
      formdata.append('utility_id', this.state.editNoteUtilityId);
      formdata.append('utility_notes', this.state.notesText);

      fetch(config.BASE_URL + 'update-utility-notes?api_token=' + token, {
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
              _this.props.refreshUtilities();
            } else if (res.success == 0) {
              _showErrorMessage(res.message);
            }
            this.setState({
              notesText: '',
              editNoteUtilityId: '',
              notesModalVisible: false,
              isloading: false,
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

  changeUtilityStatus = (utility_id, status) => {
    Alert.alert(
      'UTILITY STATUS',
      'Are you sure you want to update utility status?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => this.updateUtilityStatus(utility_id, status),
        },
      ],
      {cancelable: false},
    );
  };

  saveManualUtility() {
    if (this.mounted) {
      if (this.state.manual_utility == '') {
        _showErrorMessage('Utility name cannot be blank.');
        return;
      }
      this.props.changeLoadingState(true);
      const token = config.currentToken;
      const formdata = new FormData();
      /*console.log(this.state.eTicketId);
      console.log(this.state.manual_utility);
      return;*/

      formdata.append('eticket_id', this.state.eTicketId);
      formdata.append('utility', this.state.manual_utility);

      fetch(config.BASE_URL + 'add-utility?api_token=' + token, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
        },
        body: formdata,
      })
        .then(response => {
          return response.json();
        })
        .then(res => {
          if (this.mounted) {
            if (res.success == 1) {
              this.props.refreshUtilities();
              var _this = this;
              setTimeout(function () {
                _showSuccessMessage(res.message);
                _this.props.changeLoadingState(false);
              }, 300);
            } else if (res.status == 0) {
              _showErrorMessage(res.message);
              this.props.changeLoadingState(false);
            }
            this.setState({addUtilityModalVisible: false});
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

  deleteUtility(utility_id) {
    Alert.alert(
      'DELETE UTILITY',
      'Are you sure you want to delete utility?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => this.deleteUtilityConfirm(utility_id)},
      ],
      {cancelable: false},
    );
  }

  deleteUtilityConfirm(utility_id) {
    if (this.mounted) {
      this.props.changeLoadingState(true);
      const token = config.currentToken;
      const formdata = new FormData();
      formdata.append('eticket_id', this.state.eTicketId);
      formdata.append('utility_id', utility_id);

      fetch(config.BASE_URL + 'delete-utility?api_token=' + token, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
        },
        body: formdata,
      })
        .then(response => {
          return response.json();
        })
        .then(res => {
          if (this.mounted) {
            if (res.success == 1) {
              this.props.refreshUtilities();
              var _this = this;
              setTimeout(function () {
                _showSuccessMessage(res.message);
                _this.props.changeLoadingState(false);
              }, 300);
            } else if (res.status == 0) {
              _showErrorMessage(res.message);
              this.props.changeLoadingState(false);
            }
            this.setState({addUtilityModalVisible: false});
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

  updateUtilityStatus(utility_id, status) {
    if (this.mounted) {
      this.props.changeLoadingState(true);
      const token = config.currentToken;
      const formdata = new FormData();

      formdata.append('utility_id', utility_id);
      //formdata.append('utility_status', (status == 1)?"0":"1" );
      formdata.append('utility_status', status);

      fetch(config.BASE_URL + 'update-utility-status?api_token=' + token, {
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
              this.props.refreshUtilities();
              var _this = this;
              setTimeout(function () {
                _showSuccessMessage(res.message);
                _this.props.changeLoadingState(false);
              }, 300);
            } else if (res.status == 0) {
              _showErrorMessage(res.message);
              this.props.changeLoadingState(false);
            }
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

  cancelStepUpload = step => {
    if (step == 2)
      this.setState({secondStepImageUrl: '', descriptionText2: ''});
  };

  checkUtilitySelected() {
    /* Check first utility selected */
    const checkedUtilities = this.state.checkedUtilitiesArr;

    if (checkedUtilities.length == 0) {
      _showErrorMessage('Please select atleast one utility first.');
      return false;
    }
    return true;
  }

  uploadStepTwoMultipleImage = () => {
    /* Check first utility selected */
    const status = this.checkUtilitySelected();
    if (status == false) {
      return;
    }

    ImagePicker.openPicker({
      multiple: true,
    }).then(images => {
      if (typeof images[0].path != 'undefined') {
        let descriptionText2 = [];
        images.map((v, k) => {
          descriptionText2[k] = '';
        });
        this.setState({
          secondStepImageUrl: images,
          descriptionText2: descriptionText2,
        });
      }
    });
  };

  uploadStepTwoCameraImage = () => {
    /* Check first utility selected */
    const status = this.checkUtilitySelected();
    if (status == false) {
      return;
    }

    ImagePicker.openCamera({
      mediaType: 'image',
    }).then(image => {
      const images = [image];
      if (typeof images[0].path != 'undefined') {
        let descriptionText2 = [];
        images.map((v, k) => {
          descriptionText2[k] = '';
        });
        this.setState({
          secondStepImageUrl: images,
          descriptionText2: descriptionText2,
        });
      }
    });
  };

  photoDescriptionStepTwo(step, idx, photo_description) {
    let descriptionText2 = this.state.descriptionText2;
    descriptionText2[idx] = photo_description;
    this.setState({descriptionText2: descriptionText2});
  }

  renderAddUtility() {
    return (
      <View>
        {this.state.addUtilityModalVisible && (
          <View style={[styless.MainContainer, {width: '100%'}]}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.addUtilityModalVisible}
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
                      {this.props?.propsVal.t('Add New Utility')}
                    </H2>
                  </View>
                  <View style={{margin: 10}}>
                    <Textarea
                      rowSpan={2}
                      bordered
                      placeholder="Enter utility name"
                      style={{backgroundColor: '#fff'}}
                      value={this.state.manual_utility}
                      onChangeText={manual_utility =>
                        this.setState({manual_utility})
                      }
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
                      onPress={() => this.saveManualUtility()}>
                      <Text style={{color: '#fff', textAlign: 'center'}}>
                      {this.props?.propsVal.t('Save')}
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
                        this.setState({
                          addUtilityModalVisible: false,
                          manual_utility: '',
                        })
                      }>
                      <Text style={{color: '#fff', textAlign: 'center'}}>
                      {this.props?.propsVal.t('Cancel')}
                      </Text>
                    </Button>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        )}
      </View>
    );
  }

  showUtilityFiles(utility_id) {
    var utilityTabActive = this.state.utilityTabActive;
    if (typeof utilityTabActive[utility_id] != 'undefined') {
      utilityTabActive[utility_id] = utilityTabActive[utility_id]
        ? false
        : true;
    } else {
      utilityTabActive[utility_id] = true;
    }
    this.setState({
      utilityTabActive,
    });
  }

  renderUtilityFiles(utility_files) {
    return (
      <View>
        {utility_files.length == 0 && (
          <View style={{padding: 10, alignItems: 'center'}}>
            <Text style={{textAlign: 'center', color: '#cdcdcd', fontSize: 13}}>
            {this.props?.propsVal.t('No files have been tagged to this utility.')}
            </Text>
          </View>
        )}
        {utility_files.map((key, i) => {
          let bgColor = i % 2 == 0 ? '#9d9d9d' : '#a9a9a9';
          if (key.type == 1) {
            bgColor = '#9d9d9d';
          }
          const full_url = key.type == 'pdf' ? key.ext_url : key.ori_file;
          const isFullUrl = key.type == 'pdf' ? true : false;
          return (
            <View>
              <View
                key={i}
                style={[
                  styless.listMainDetail,
                  {backgroundColor: bgColor, flex: 1},
                ]}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.showPreviewImage(
                      config.IMAGE_URL + '/' + key.image_prev,
                      key.image_desc,
                      '',
                      full_url,
                      isFullUrl,
                    )
                  }
                  style={{
                    width: '60%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <FastImage
                    style={{
                      alignItems: 'flex-start',
                      height: 30,
                      width: 30,
                      borderRadius: 1,
                      marginRight: 5,
                      marginLeft: 5,
                    }}
                    source={
                      key?.image
                        ? {uri: config.THUMB_IMAGE_URL + '/' + key.image}
                        : image.noImage
                    }
                  />
                  <Text
                    style={{fontSize: 13, textAlign: 'right', color: '#fff'}}>
                    {key.timestamp}
                  </Text>
                </TouchableOpacity>
                <View
                  style={{
                    width: '40%',
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}>
                  <TouchableOpacity
                    key={'D' + key.auto_id}
                    onPress={() =>
                      this.props.downloadImage(full_url, isFullUrl)
                    }
                    style={{marginRight: 10}}>
                    <Icon
                      key={'D' + key.auto_id}
                      style={{
                        color: '#fff',
                        fontSize: 16,
                        width: 25,
                        height: 25,
                        textAlign: 'center',
                        padding: 5,
                      }}
                      name="download"
                      type="Entypo"
                      onPress={() =>
                        this.props.downloadImage(full_url, isFullUrl)
                      }
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    key={'T' + key.auto_id}
                    onPress={() => this.props.deleteImage(key.auto_id, 2)}>
                    <Icon
                      key={'D' + key.auto_id}
                      style={{
                        color: '#fff',
                        fontSize: 16,
                        padding: 5,
                        width: 25,
                        textAlign: 'center',
                      }}
                      name="trash"
                      type="Entypo"
                      onPress={() => this.props.deleteImage(key.auto_id, 2)}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    );
  }

  renderAllUtilityFilter() {
    const {utilities, checkedUtilitiesArr} = this.state;

    return (
      <View
        style={{
          backgroundColor: '#000',
          padding: 10,
          marginTop: 10,
          borderRadius: 2,
        }}>
        <TouchableOpacity
          style={{position: 'absolute', top: 0, right: 0, padding: 5}}
          onPress={() => {
            this.setState({showUtilityFilter: false, checkedUtilitiesArr: []});
          }}>
          <Icon
            style={{
              position: 'relative',
              fontSize: 20,
              color: '#ededed',
              justifyContent: 'center',
              alignSelf: 'center',
            }}
            name="circle-with-cross"
            type="Entypo"
          />
        </TouchableOpacity>
        <View>
          <Text
            style={{fontFamily: 'OpenSans-Bold', fontSize: 13, color: '#fff'}}>
            {this.props?.propsVal.t('SELECT UTILITY')}
          </Text>
          <Text
            style={{
              color: '#fff',
              fontFamily: 'OpenSans-SemiBold',
              fontSize: 12,
              fontStyle: 'italic',
            }}>
            {this.props?.propsVal.t('(SELECT ALL THAT APPLY)')}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            width: '100%',
            marginTop: 10,
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}>
          {utilities.length > 0 &&
            utilities.map((utility, k) => {
              return (
                <TouchableOpacity
                  style={{
                    width: '33.33%',
                    flexWrap: 'wrap',
                    padding: 5,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                  onPress={() => this.makeChecked(k)}>
                  <CheckBox
                    checked={
                      checkedUtilitiesArr.indexOf(utility.id) != -1
                        ? true
                        : false
                    }
                    style={{left: 0}}
                    color={
                      checkedUtilitiesArr.indexOf(utility.id) != -1
                        ? 'green'
                        : '#D3D3D3'
                    }
                    onPress={() => this.makeChecked(k)}
                  />
                  <Text
                    style={{
                      color: '#fff',
                      marginLeft: 5,
                      fontSize: 12,
                      textAlign: 'center',
                    }}>
                    {utility?.code}
                  </Text>
                </TouchableOpacity>
              );
            })}
        </View>
        <TouchableOpacity
          style={{width: '45%'}}
          activeOpacity={0.5}
          onPress={() =>
            this.state.clickedButtonType == 'upload'
              ? this.uploadStepTwoMultipleImage()
              : this.uploadStepTwoCameraImage()
          }>
          <View
            style={{
              alignSelf: 'flex-start',
              padding: 10,
              backgroundColor: '#FFBC42',
              marginTop: 10,
            }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'OpenSans-Bold',
                textAlign: 'center',
              }}>
              {this.state.clickedButtonType == 'upload'
                ? 'CHOOSE FILE'
                : 'TAKE A PHOTO'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  onPressCall() {
    const phone = 'tel:' + this.state.response_phone;
    Linking.canOpenURL(phone).then(supported => {
      if (supported) {
        return Linking.openURL(phone).catch(() => null);
      }
    });
  }

  render() {
    const savedUtilities = this.props.savedUtilities;
    const utilityTabActive = this.state.utilityTabActive;
    if (this.state.utilities && this.state.utilities.length > 0) {
      return (
        <View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            {/* To show new file upload button */}
            <TouchableOpacity
              style={{width: '45%'}}
              activeOpacity={0.5}
              onPress={() =>
                this.setState({
                  clickedButtonType: 'upload',
                  showUtilityFilter: true,
                })
              }>
              <View
                style={{
                  alignSelf: 'flex-start',
                  padding: 10,
                  backgroundColor: '#FFBC42',
                  marginTop: 10,
                  width: '100%',
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'OpenSans-Bold',
                    textAlign: 'center',
                  }}>
                  {this.props?.propsVal.t('UPLOAD PHOTO')}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{width: '45%'}}
              activeOpacity={0.5}
              onPress={() =>
                this.setState({
                  clickedButtonType: 'photo',
                  showUtilityFilter: true,
                })
              }>
              <View
                style={{
                  alignSelf: 'flex-end',
                  padding: 10,
                  backgroundColor: '#FFBC42',
                  marginTop: 10,
                  width: '100%',
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'OpenSans-Bold',
                    textAlign: 'center',
                  }}>
                  {this.props?.propsVal.t('TAKE A PHOTO')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {this.state.showUtilityFilter && this.renderAllUtilityFilter()}
          {this.state.secondStepImageUrl != '' && (
            <View>
              <View style={{marginTop: 10, marginBottom: 10}}>
                {this.state.secondStepImageUrl.map((v, k) => {
                  return (
                    <View style={{marginTop: 10}}>
                      <Image
                        style={{
                          alignSelf: 'center',
                          height: 200,
                          width: '100%',
                          borderRadius: 5,
                        }}
                        source={v.path ? {uri: v.path} : image.noImage}
                      />
                      <Textarea
                        rowSpan={3}
                        bordered
                        placeholder="Enter a brief description of the photo"
                        style={{backgroundColor: '#fff'}}
                        onChangeText={descriptionText2 =>
                          this.photoDescriptionStepTwo(2, k, descriptionText2)
                        }
                      />
                    </View>
                  );
                })}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  marginBottom: 10,
                  justifyContent: 'space-between',
                }}>
                <Button
                  small
                  style={{
                    marginRight: 10,
                    backgroundColor: 'green',
                    justifyContent: 'center',
                    color: '#fff',
                    width: '40%',
                  }}
                  onPress={() => this.updateImage()}>
                  <Text style={{color: '#fff', textAlign: 'center'}}>{this.props?.propsVal.t('Save')}</Text>
                </Button>
                <Button
                  small
                  style={{
                    backgroundColor: '#da5531',
                    justifyContent: 'center',
                    color: '#fff',
                    width: '40%',
                  }}
                  onPress={() => this.cancelStepUpload(2)}>
                  <Text style={{color: '#fff', textAlign: 'center'}}>
                  {this.props?.propsVal.t('Cancel')}
                  </Text>
                </Button>
              </View>
            </View>
          )}
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#333',
              padding: 12,
              marginTop: 15,
              width: '100%',
            }}>
            <View style={{width: '45%'}}>
              <Text style={styless.utilityLabel}>{this.props.propsVal.t('STATUS/UTILITY')}</Text>
            </View>
            <View style={{width: '5%'}}>
              <Text>{''}</Text>
            </View>
            <View style={{width: '22%', alignItems: 'flex-end'}}>
              <Text style={[styless.utilityLabel, {textAlign: 'right'}]}>
              {this.props.propsVal.t('FILES')}
              </Text>
            </View>
            <View style={{width: '15%', alignItems: 'center'}}>
              <Text style={[styless.utilityLabel, {textAlign: 'center'}]}>
                {' '}
                {this.props.propsVal.t('NOTE')}
              </Text>
            </View>
            <View style={{width: '15%', alignItems: 'center'}}>
              <Text style={styless.utilityLabel}>{this.props.propsVal.t('VIEW')}</Text>
            </View>
          </View>

          {this.state.utilities.map((key, i) => {
            let bgColor = i % 2 == 0 ? '#fff' : '#e4e4e4';
            if (key.type == 1) {
              bgColor = '#f2f2f2';
            }
            return (
              <View>
                <View
                  key={i}
                  style={[styless.listMain, {backgroundColor: bgColor}]}>
                  <View style={{width: '45%'}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        paddingTop: 2,
                        paddingBottom: 2,
                      }}>
                      {/* <TouchableOpacity style={{ flexDirection: 'row', width: '20%', alignItems: 'center', marginRight: 3 }} onPress={() => this.changeUtilityStatus(key.id, key.status)} >
                          {
                          (key.response_color == "Green")
                          ?<Image source={image['cleared_new']} style={{ minHeight:25, width:30, marginLeft: 5}} resizeMode='contain' />
                          :<Image source={ (key.status == "1")?image['cleared_new']:image['pending_new']} style={{ minHeight:25, width:30, marginLeft: 5}} resizeMode='contain' />
                          }
                        </TouchableOpacity> */}

                      <TouchableOpacity
                        style={{
                          flexDirection: 'row',
                          width: '20%',
                          alignItems: 'center',
                          marginRight: 3,
                        }}
                        onPress={() =>
                          this.changeUtilityStatus(key.id, key.status)
                        }>
                        {key.status == '1' ? (
                          <Image
                            source={image['cleared_new']}
                            style={{minHeight: 25, width: 30, marginLeft: 5}}
                            resizeMode="contain"
                          />
                        ) : (
                          <Image
                            source={
                              key.response_color == 'Green'
                                ? image['cleared_new']
                                : image['pending_new']
                            }
                            style={{minHeight: 25, width: 30, marginLeft: 5}}
                            resizeMode="contain"
                          />
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={{width: '80%', justifyContent: 'center'}}
                        onPress={() => this.showUtilityFiles(key.id)}>
                        <Text
                          style={{
                            fontSize: 16,
                            textAlign: 'left',
                            fontFamily: 'OpenSans-Bold',
                            color: '#000',
                            marginLeft: 5,
                          }}>
                          {key.code}
                        </Text>
                        {key?.utility_response != '' && (
                          <Text
                            style={{
                              fontSize: 10,
                              textAlign: 'left',
                              fontFamily: 'OpenSans-Regular',
                              color: '#000',
                              marginLeft: 5,
                            }}>
                            {key?.utility_response}
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                  {key.status != '1' &&
                  key?.member &&
                  key?.member?.response_member_phone != '' ? (
                    <TouchableOpacity
                      style={{width: '10%', padding: 10}}
                      onPress={() =>
                        this.showPhoneModal(key?.member?.response_member_phone)
                      }>
                      <View
                        style={{
                          width: 20,
                          borderRadius: 10,
                          backgroundColor: '#FFBC42',
                          padding: 2,
                        }}>
                        <Icon
                          style={{
                            fontSize: 14,
                            color: '#ededed',
                            justifyContent: 'center',
                            alignSelf: 'flex-end',
                          }}
                          name="phone"
                          type="Entypo"
                        />
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <View style={{width: '10%', padding: 10}}></View>
                  )}
                  <View style={{width: '15%', right: 10}}>
                    <Text
                      style={{
                        fontSize: 15,
                        textAlign: 'right',
                        fontFamily: 'OpenSans-Regular',
                      }}>
                      {key.count}
                    </Text>
                  </View>
                  <View style={{width: '15%', alignItems: 'center'}}>
                    <TouchableOpacity
                      style={{
                        justifyContent: 'center',
                        alignSelf: 'center',
                        alignItems: 'center',
                        width: 25,
                        borderRadius: 13,
                        padding: 3,
                        backgroundColor:
                          key?.notes || {}.length > 0 ? '#5d9d3e' : '#c9c9c9',
                      }}>
                      <Icon
                        style={{
                          fontSize: 16,
                          color: '#ededed',
                          justifyContent: 'center',
                          alignSelf: 'center',
                        }}
                        name="new-message"
                        type="Entypo"
                        onPress={() =>
                          this.showNotesModal(key.id, key.notes, key.code)
                        }
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={{width: '15%', alignItems: 'center'}}>
                    <TouchableOpacity
                      style={{
                        justifyContent: 'center',
                        alignSelf: 'center',
                        alignItems: 'center',
                        width: 25,
                        borderRadius: 13,
                        backgroundColor:
                          typeof utilityTabActive[key.id] != 'undefined' &&
                          utilityTabActive[key.id]
                            ? '#f4c14c'
                            : '#9d9d9d',
                      }}
                      onPress={() => this.showUtilityFiles(key.id)}>
                      {typeof utilityTabActive[key.id] != 'undefined' &&
                      utilityTabActive[key.id] ? (
                        <Icon
                          style={styless.activeIcon}
                          name="chevron-down"
                          type="Entypo"
                          onPress={() => this.showUtilityFiles(key.id)}
                        />
                      ) : (
                        <Icon
                          style={styless.inactiveIcon}
                          name="chevron-right"
                          type="Entypo"
                          onPress={() => this.showUtilityFiles(key.id)}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
                {typeof utilityTabActive[key.id] != 'undefined' &&
                  utilityTabActive[key.id] && (
                    <View key={'VIEW_' + key.id} style={{flexDirection: 'row'}}>
                      {this.renderUtilityFiles(key?.documents || {})}
                    </View>
                  )}
              </View>
            );
          })}

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 5,
            }}>
            <View style={{flexDirection: 'row', marginBottom: 5}}>
              <Text
                style={{
                  flex: 1,
                  fontSize: 12,
                  fontStyle: 'italic',
                  flexWrap: 'wrap',
                }}>
                {' '}
                <Text style={{fontWeight: 'bold', fontSize: 12}}>{this.props.propsVal.t('Notes')}: </Text>
                {this.props.propsVal.t('Click response status icon to update. if a utility has not been pre-populated on the list above, you can manually add a utility using the button below.')}
              </Text>
            </View>
            <TouchableOpacity
              dark
              style={{
                backgroundColor: '#313131',
                padding: 10,
                borderRadius: 5,
                flexDirection: 'row',
                height: 40,
                justifyContent: 'center',
                marginBottom: 5,
                width: '100%',
              }}
              onPress={() => this.setState({addUtilityModalVisible: true})}>
              <Icon
                type="FontAwesome"
                name="plus-circle"
                style={{color: '#fff', fontSize: 22}}
              />
              <Text style={{fontSize: 15, marginLeft: 5, color: '#fff'}}>
              {this.props.propsVal.t('ADD UTILITY')}
              </Text>
            </TouchableOpacity>
          </View>
          {this.drawImages(this.state.images)}
          {/*<PhotoUpload
            onPhotoSelect={avatar => {
                this.setState({
                       secondStepImageUrl:'',
                   });
                  if (avatar) {
                    this.setState({
                      secondStepImageUrl: 'data:png;base64,'+avatar,
                    });
                  }
              }}
            >
            <View style={{alignSelf:'center',paddingLeft:70,paddingRight:70,paddingTop:10,paddingBottom:10,backgroundColor:'#FFBC42',marginTop:10}}>
              <Text style={{fontSize:22,fontFamily:'OpenSans-Bold'}}>UPLOAD PHOTO</Text>
            </View>
          </PhotoUpload>*/}

          {this.renderAddUtility()}
          {this.state.notesModalVisible && (
            <View style={[styless.MainContainer, {width: '100%'}]}>
              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.notesModalVisible}
                onRequestClose={() => {}}>
                <KeyboardAvoidingView
                  behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                  style={{flex: 1}}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      padding: 5,
                    }}>
                    <View style={[styless.ModalInsideView, {height: 350}]}>
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
                        {this.props?.propsVal.t('Add Utility Notes')}
                        </H2>
                      </View>
                      <View style={{margin: 10}}>
                        <Text style={{marginBottom: 10}}>
                        {this.props?.propsVal.t('Add Notes For Utility')} "
                          {this.state.editNoteUtilityCode}"
                        </Text>
                        <Textarea
                          rowSpan={8}
                          bordered
                          placeholder="Add utility notes here.."
                          style={{backgroundColor: '#fff', margin: 5}}
                          onChangeText={notesText => this.setState({notesText})}
                          value={this.state.notesText}
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
                          onPress={() => this.saveUtilityNotes()}>
                          <Text style={{color: '#fff', textAlign: 'center'}}>
                          {this.props?.propsVal.t('Save')}
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
                            this.setState({
                              notesModalVisible: false,
                              notesText: '',
                            })
                          }>
                          <Text style={{color: '#fff', textAlign: 'center'}}>
                          {this.props?.propsVal.t('Cancel')}
                          </Text>
                        </Button>
                      </View>
                    </View>
                  </View>
                </KeyboardAvoidingView>
              </Modal>
            </View>
          )}
          {this.state.phoneModalVisible && (
            <View style={[styless.MainContainer, {width: '100%'}]}>
              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.phoneModalVisible}
                onRequestClose={() => {}}>
                <KeyboardAvoidingView
                  behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                  style={{flex: 1}}>
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
                        {this.props?.propsVal.t('Contact')}
                        </H2>
                      </View>
                      <View
                        style={{
                          margin: 10,
                          flexDirection: 'row',
                          flex: 1,
                          flexWrap: 'wrap',
                        }}>
                        <Text>{this.props?.propsVal.t('Do you want to call')} </Text>
                        <TouchableOpacity onPress={() => this.onPressCall()}>
                          <Text style={{fontWeight: '600'}}>
                            {this.state.response_phone}
                          </Text>
                        </TouchableOpacity>
                        <Text>
                        {this.props?.propsVal.t('who is identified as the contact for this response?')}
                        </Text>
                      </View>
                      <View
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          width: '100%',
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
                            this.setState({
                              phoneModalVisible: false,
                              response_phone: '',
                            })
                          }>
                          <Text style={{color: '#fff', textAlign: 'center'}}>
                          {this.props?.propsVal.t('Cancel')}
                          </Text>
                        </Button>
                      </View>
                    </View>
                  </View>
                </KeyboardAvoidingView>
              </Modal>
            </View>
          )}
        </View>
      );
    } else {
      return (
        <View>
          <H2
            style={{
              fontFamily: 'RacingSansOne-Regular',
              marginTop: 25,
              marginBottom: 5,
              alignSelf: 'center',
            }}>
            {this.props?.propsVal.t('Ticket request pending with 811.')}
          </H2>
        </View>
      );
    }
  }
}

const styless = StyleSheet.create({
  listContainer: {flex: 1, flexDirection: 'row'},
  btnTexts: {
    fontSize: 28,
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'OpenSans-Bold',
  },
  ticket_req: {
    fontSize: 25,
    textAlign: 'center',
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    color: '#000000',
    fontFamily: 'OpenSans-Bold',
  },
  innerSecondText: {color: '#000', fontFamily: 'OpenSans-Bold', fontSize: 14},
  innerSecondTextwarn: {
    color: '#fff',
    fontFamily: 'OpenSans-Bold',
    fontSize: 14,
  },
  innerSecond: {
    justifyContent: 'center',
    flex: 1,
    borderWidth: 1,
    //width:280,
    paddingLeft: 10,
    borderColor: '#717274',
  },
  innerSecondwarm: {
    justifyContent: 'center',
    flex: 1,
    borderWidth: 1,
    //width:280,
    paddingLeft: 10,
    borderColor: '#717274',
    backgroundColor: '#000',
  },
  inner: {
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 5,
    paddingBottom: 5,
    marginRight: 1,
    backgroundColor: '#4caf50',
    borderRadius: 2,
    justifyContent: 'flex-start',
    borderColor: '#4caf50',
    borderWidth: 1,
  },
  innered: {
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 5,
    paddingBottom: 5,
    marginRight: 1,
    backgroundColor: '#FFBC42',
    borderRadius: 2,
    justifyContent: 'flex-start',
    borderColor: '#FFBC42',
    borderWidth: 1,
  },
  inneredWarn: {
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginRight: 1,
    backgroundColor: '#E05439',
    borderRadius: 2,
    justifyContent: 'flex-start',
    borderColor: '#E05439',
    borderWidth: 1,
  },
  outer: {
    marginTop: 20,
    //backgroundColor: '#7E7E7E',
    borderRadius: 2,
  },
  MainContainer: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS == 'ios' ? 40 : 0,
  },
  ModalInsideView: {
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '#fff',
    height: 200,
    width: '80%',
    borderRadius: 10,
    //borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'solid',
    elevation: 20,
    flexDirection: 'column',
  },
  utilityLabel: {
    fontSize: 13,
    textAlign: 'left',
    color: '#fff',
    fontFamily: 'OpenSans-Bold',
  },
  listMain: {
    width: '100%',
    flexDirection: 'row',
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listMainDetail: {
    width: '100%',
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveIcon: {
    fontSize: 22,
    color: '#fff',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  activeIcon: {
    fontSize: 22,
    color: '#000',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  listHeaderMain: {
    flexDirection: 'row',
    height: 40,
    padding: 10,
    marginTop: 10,
    marginBottom: 5,
  },
  listHeaderTitle: {
    width: '25%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
    zIndex: 3,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineStyle: {
    borderWidth: 0.5,
    borderColor: 'gray',
    margin: 10,
  },
  emailError: {
    color: 'red',
    fontSize: 14,
    marginLeft: 1,
    marginTop: 2,
  },
});
