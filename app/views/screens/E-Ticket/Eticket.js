import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, View, Image, ScrollView} from 'react-native';
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
  Body,
} from 'native-base';
import {
  image,
  config,
  _storeUser,
  _retrieveUser,
  validate,
  _showErrorMessage,
  _savePrevStep,
  Loader,
} from 'assets';
import CustomeHeader from '../CustomeHeader';
import {StackActions, CommonActions} from '@react-navigation/native';
import Content from '../../components/Content';
//import { DrawerActions } from 'react-navigation-drawer';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import StepFour from './StepFour';

let formAttr = {
  Step1: [
    {
      multiple: false,
      name: null,
      wtype: 'name',
      title: 'Name',
      required: false,
    },
    {
      multiple: false,
      company: null,
      wtype: 'company',
      title: 'Company',
      required: false,
    },
    {
      multiple: false,
      type: null,
      wtype: 'type',
      title: 'Type',
      required: false,
      inType: 'dropdown',
      data: [
        {k: 'Home Owner', v: 'home'},
        {k: 'Contractor', v: 'contractor'},
        {k: 'USA North Member', v: 'member'},
      ],
      cVal: 'contractor',
    },
    {
      multiple: false,
      industry: null,
      wtype: 'industry',
      title: 'Industry',
      required: false,
      inType: 'dropdown',
      data: [
        {k: 'Commercial', v: 'Commercial'},
        {k: 'Residential', v: 'Residential'},
        {k: 'Government', v: 'Government'},
        {k: 'Utilities', v: 'Utilities'},
      ],
      cVal: 'Commercial',
    },
    {
      multiple: false,
      address: null,
      wtype: 'address',
      title: 'Address',
      required: false,
    },
    {
      multiple: true,
      fields: [
        {city: null, wtype: 'city', title: 'City', required: false},
        {
          state: null,
          wtype: 'state',
          title: 'State',
          required: false,
          inType: 'dropdown',
          data: config.usaState,
          cVal: 'NV',
        },
        {zip: null, wtype: 'zip', title: 'Zip', required: false},
      ],
    },
    {
      multiple: true,
      fields: [
        {phone: null, wtype: 'phone', title: 'Office Phone', required: false},
        {
          extension: null,
          wtype: 'extension',
          title: 'Extension',
          required: false,
        },
      ],
    },
    {
      multiple: false,
      cell: null,
      wtype: 'cell',
      title: 'Cell',
      required: false,
    },
    {
      multiple: false,
      email: null,
      wtype: 'email',
      title: 'Email',
      required: true,
    },
    {
      multiple: false,
      cemail: null,
      wtype: 'cemail',
      title: 'Confirm Email',
      required: true,
    },
  ],
  Step2: {
    single: [
      {
        multiple: false,
        job_name: null,
        wtype: 'job_name',
        title: 'Job Name',
        required: false,
      },
      {
        multiple: false,
        dig_state_s: null,
        wtype: 'dig_state_s',
        title: 'State',
        required: false,
        inType: 'dropdown',
        data: [
          {k: 'Nevada', v: 'NV'},
          {k: 'California', v: 'CA'},
        ],
        cVal: 'NV',
      },
      {
        multiple: false,
        dig_county_s: null,
        wtype: 'dig_county_s',
        title: 'County',
        required: false,
        inType: 'dropdown',
        data: config.nvcounties,
        cVal: 'Clark',
      },
      {
        multiple: false,
        dig_city_s: null,
        wtype: 'dig_city_s',
        title: 'City',
        required: false,
      },
      {
        multiple: false,
        dig_street_s: null,
        wtype: 'dig_street_s',
        title: 'Street',
        required: false,
      },
      {
        multiple: false,
        dig_cross_s_1: null,
        wtype: 'dig_cross_s_1',
        title: 'Cross Street 1',
        required: false,
      },
      {
        multiple: false,
        dig_cross_s_2: null,
        wtype: 'dig_cross_s_2',
        title: 'Cross Street 2',
        required: false,
      },
    ],
    multi: [
      {
        multiple: false,
        job_name: null,
        wtype: 'job_name',
        title: 'Job Name',
        required: false,
      },
      {
        multiple: false,
        dig_state_m: null,
        wtype: 'dig_state_m',
        title: 'State',
        required: false,
        inType: 'dropdown',
        data: [
          {k: 'Nevada', v: 'NV'},
          {k: 'California', v: 'CA'},
        ],
        cVal: 'NV',
      },
      {
        multiple: false,
        dig_county_m: null,
        wtype: 'dig_county_m',
        title: 'County',
        required: false,
        inType: 'dropdown',
        data: config.nvcounties,
        cVal: 'Clark',
      },
      {
        multiple: false,
        dig_city_m: null,
        wtype: 'dig_city_m',
        title: 'City',
        required: false,
      },
      {
        multiple: false,
        dig_locate_m: null,
        wtype: 'dig_locate_m',
        title: 'Locate',
        required: false,
        inType: 'textarea',
        cVal: '',
      },
      {
        multiple: false,
        dig_street_m: null,
        wtype: 'dig_street_m',
        title: 'Street',
        required: false,
      },
      {
        multiple: false,
        dig_cross_m_1: null,
        wtype: 'dig_cross_m_1',
        title: 'Cross Street 1',
        required: false,
      },
      {
        multiple: false,
        dig_cross_m_2: null,
        wtype: 'dig_cross_m_2',
        title: 'Cross Street 2',
        required: false,
      },
      {
        multiple: false,
        excavation_street_m: null,
        wtype: 'excavation_street_m',
        title: 'Will excavation enter street or sidewalk area ?',
        required: false,
        inType: 'radio',
        data: [
          {k: 'Yes', v: 'yes'},
          {k: 'No', v: 'no'},
        ],
        num: 1,
        cVal: 'no',
      },
      {
        multiple: true,
        fields: [
          {buffer_m: null, wtype: 'buffer_m', title: 'Buffer', required: false},
          {units_m: null, wtype: 'units_m', title: 'Units', required: false},
        ],
      },
    ],
    inter: [
      {
        multiple: false,
        job_name: null,
        wtype: 'job_name',
        title: 'Job Name',
        required: false,
      },
      {
        multiple: false,
        dig_state_i: null,
        wtype: 'dig_state_i',
        title: 'State',
        required: false,
        inType: 'dropdown',
        data: [
          {k: 'Nevada', v: 'NV'},
          {k: 'California', v: 'CA'},
        ],
        cVal: 'NV',
      },
      {
        multiple: false,
        dig_county_i: null,
        wtype: 'dig_county_i',
        title: 'County',
        required: false,
        inType: 'dropdown',
        data: config.nvcounties,
        cVal: 'Clark',
      },
      {
        multiple: false,
        dig_city_i: null,
        wtype: 'dig_city_i',
        title: 'City',
        required: false,
      },
      {
        multiple: false,
        location_type: null,
        wtype: 'location_type',
        title: 'Location Type',
        required: false,
        inType: 'dropdown',
        data: [
          {k: 'Intersection', v: 'Intersection'},
          {k: 'Between Intersections', v: 'Between Intersections'},
        ],
        cVal: 'Intersection',
      },
      {
        multiple: false,
        corner_side: null,
        wtype: 'corner_side',
        title: 'Corner/Side',
        required: false,
        inType: 'dropdown',
        data: config.cornerSide['corner'],
        cVal: 'East',
      },
      {
        multiple: false,
        dig_locate_i: null,
        wtype: 'dig_locate_i',
        title: 'Locate',
        required: false,
        inType: 'textarea',
        cVal: '',
      },
      {
        multiple: false,
        dig_street_i: null,
        wtype: 'dig_street_i',
        title: 'Street',
        required: false,
      },
      {
        multiple: false,
        dig_cross_i_1: null,
        wtype: 'dig_cross_i_1',
        title: 'Cross Street 1',
        required: false,
      },
      {
        multiple: false,
        dig_cross_i_2: null,
        wtype: 'dig_cross_i_2',
        title: 'Cross Street 2',
        required: false,
      },
      {
        multiple: false,
        excavation_street_i: null,
        wtype: 'excavation_street_i',
        title: 'Will excavation enter street or sidewalk area ?',
        required: false,
        inType: 'radio',
        data: [
          {k: 'Yes', v: 'yes'},
          {k: 'No', v: 'no'},
        ],
        num: 1,
        cVal: 'no',
      },
      {
        multiple: true,
        fields: [
          {buffer_i: null, wtype: 'buffer_i', title: 'Buffer', required: false},
          {units_i: null, wtype: 'units_i', title: 'Units', required: false},
        ],
      },
    ],
  },
  Step3: {
    single: [
      {
        multiple: false,
        digging_incharge: null,
        wtype: 'digging_incharge',
        title: 'Are you in charge of digging/excavation?',
        required: false,
        inType: 'radio',
        data: [
          {k: 'Yes', v: 'yes'},
          {k: 'No', v: 'no'},
        ],
        num: 1,
        cVal: 'no',
      },
      {
        multiple: false,
        excavation_street_s: null,
        wtype: 'excavation_street_s',
        title: 'Will excavation enter street or sidewalk area ?',
        required: false,
        inType: 'radio',
        data: [
          {k: 'Yes', v: 'yes'},
          {k: 'No', v: 'no'},
        ],
        num: 1,
        cVal: 'no',
      },
      {
        multiple: false,
        excavating_address: null,
        wtype: 'excavating_address',
        title: 'Where at the address are you excavating?',
        required: false,
        inType: 'dropdown',
        data: [
          {k: 'Front of Property', v: 'front'},
          {k: 'Back of Property', v: 'back'},
        ],
        cVal: 'front',
      },
      {multiple: false, inType: 'text'},
      {
        multiple: false,
        excavation_time: null,
        wtype: 'excavation_time',
        title: 'Start date and time of excavation',
        required: false,
      },
      {
        multiple: false,
        dig_purpose: null,
        wtype: 'dig_purpose',
        title: 'Reason and method for digging',
        required: false,
        inType: 'textarea',
        cVal: '',
      },
      {
        multiple: false,
        any_permit: null,
        wtype: 'any_permit',
        title: 'Were you required to get permits?',
        required: false,
        inType: 'dropdown',
        data: [
          {k: 'Yes', v: 'yes'},
          {k: 'No', v: 'no'},
        ],
        cVal: 'yes',
      },
    ],
    multi: [
      {
        multiple: false,
        start_time_m: null,
        wtype: 'start_time_m',
        title: 'Start Time',
        required: false,
      },
      {
        multiple: false,
        priority_m: null,
        wtype: 'priority_m',
        title: 'Priority',
        required: false,
      },
      {
        multiple: false,
        tw_work_days_m: null,
        wtype: 'tw_work_days_m',
        title: 'Two Working Days',
        required: false,
      },
      {
        multiple: false,
        expires_m: null,
        wtype: 'expires_m',
        title: 'Expires',
        required: false,
      },
      {
        multiple: false,
        update_by_m: null,
        wtype: 'update_by_m',
        title: 'Update By',
        required: false,
      },
      {
        multiple: false,
        night_work_m: null,
        wtype: 'night_work_m',
        title: 'Night Work',
        required: false,
        inType: 'radio',
        data: [
          {k: 'Yes', v: 'yes'},
          {k: 'No', v: 'no'},
        ],
        num: 1,
        cVal: 'no',
      },
      {
        multiple: false,
        weekend_work_m: null,
        wtype: 'weekend_work_m',
        title: 'Weekend Work',
        required: false,
        inType: 'radio',
        data: [
          {k: 'Yes', v: 'yes'},
          {k: 'No', v: 'no'},
        ],
        num: 2,
        cVal: 'no',
      },
      {
        multiple: false,
        work_for_m: null,
        wtype: 'work_for_m',
        title: 'Work For',
        required: false,
      },
      {
        multiple: false,
        premark_m: null,
        wtype: 'premark_m',
        title: 'Premark',
        required: false,
        inType: 'radio',
        data: [
          {k: 'Yes', v: 'yes'},
          {k: 'No', v: 'no'},
        ],
        num: 3,
        cVal: 'no',
      },
      {
        multiple: false,
        premark_method_m: null,
        wtype: 'premark_method_m',
        title: 'Premark Method',
        required: false,
        inType: 'dropdown',
        data: [
          {k: 'Chalk', v: 'chalk'},
          {k: 'Flags', v: 'flags'},
          {k: 'Flour', v: 'flour'},
          {k: 'Stakes', v: 'stakes'},
          {k: 'Whiskers', v: 'whiskers'},
          {k: 'White Paint', v: 'white_paint'},
          {k: 'Pink Paint', v: 'pink_paint'},
        ],
        cVal: 'chalk',
      },
      {
        multiple: false,
        permit_req_m: null,
        wtype: 'permit_req_m',
        title: 'Permit Required',
        required: false,
        inType: 'radio',
        data: [
          {k: 'Yes', v: 'yes'},
          {k: 'No', v: 'no'},
        ],
        num: 4,
        cVal: 'no',
      },
      {
        multiple: false,
        permit_no_m: null,
        wtype: 'permit_no_m',
        title: 'Permit Number',
        required: false,
      },
      {
        multiple: false,
        foreman_m: null,
        wtype: 'foreman_m',
        title: 'Foreman',
        required: false,
      },
      {
        multiple: true,
        fields: [
          {
            phone_m: null,
            wtype: 'phone_m',
            title: 'Office Phone',
            required: false,
          },
          {
            extension_m: null,
            wtype: 'extension_m',
            title: 'Extension',
            required: false,
          },
        ],
      },
      {
        multiple: false,
        cell_m: null,
        wtype: 'cell_m',
        title: 'Cell',
        required: false,
      },
      {
        multiple: false,
        email_m: null,
        wtype: 'email_m',
        title: 'Email',
        required: true,
      },
      {
        multiple: false,
        vaccum_m: null,
        wtype: 'vaccum_m',
        title: 'Vaccum',
        required: false,
        inType: 'radio',
        data: [
          {k: 'Yes', v: 'yes'},
          {k: 'No', v: 'no'},
        ],
        num: 5,
        cVal: 'no',
      },
      {
        multiple: false,
        boring_m: null,
        wtype: 'boring_m',
        title: 'Boring',
        required: false,
        inType: 'radio',
        data: [
          {k: 'Yes', v: 'yes'},
          {k: 'No', v: 'no'},
        ],
        num: 5,
        cVal: 'no',
      },
      {
        multiple: false,
        explosives_m: null,
        wtype: 'explosives_m',
        title: 'Explosives',
        required: false,
        inType: 'radio',
        data: [
          {k: 'Yes', v: 'yes'},
          {k: 'No', v: 'no'},
        ],
        num: 6,
        cVal: 'no',
      },
      {
        multiple: false,
        work_type_m: null,
        wtype: 'work_type_m',
        title: 'Work Type',
        required: false,
      },
    ],
    inter: [
      {
        multiple: false,
        start_time_i: null,
        wtype: 'start_time_i',
        title: 'Start Time',
        required: false,
      },
      {
        multiple: false,
        priority_i: null,
        wtype: 'priority_i',
        title: 'Priority',
        required: false,
      },
      {
        multiple: false,
        tw_work_days_i: null,
        wtype: 'tw_work_days_i',
        title: 'Two Working Days',
        required: false,
      },
      {
        multiple: false,
        expires_i: null,
        wtype: 'expires_i',
        title: 'Expires',
        required: false,
      },
      {
        multiple: false,
        update_by_i: null,
        wtype: 'update_by_i',
        title: 'Update By',
        required: false,
      },
      {
        multiple: false,
        night_work_i: null,
        wtype: 'night_work_i',
        title: 'Night Work',
        required: false,
        inType: 'radio',
        data: [
          {k: 'Yes', v: 'yes'},
          {k: 'No', v: 'no'},
        ],
        num: 1,
        cVal: 'no',
      },
      {
        multiple: false,
        weekend_work_i: null,
        wtype: 'weekend_work_i',
        title: 'Weekend Work',
        required: false,
        inType: 'radio',
        data: [
          {k: 'Yes', v: 'yes'},
          {k: 'No', v: 'no'},
        ],
        num: 2,
        cVal: 'no',
      },
      {
        multiple: false,
        work_for_i: null,
        wtype: 'work_for_i',
        title: 'Work For',
        required: false,
      },
      {
        multiple: false,
        premark_i: null,
        wtype: 'premark_i',
        title: 'Premark',
        required: false,
        inType: 'radio',
        data: [
          {k: 'Yes', v: 'yes'},
          {k: 'No', v: 'no'},
        ],
        num: 3,
        cVal: 'no',
      },
      {
        multiple: false,
        premark_method_i: null,
        wtype: 'premark_method_i',
        title: 'Premark Method',
        required: false,
        inType: 'dropdown',
        data: [
          {k: 'Chalk', v: 'chalk'},
          {k: 'Flags', v: 'flags'},
          {k: 'Flour', v: 'flour'},
          {k: 'Stakes', v: 'stakes'},
          {k: 'Whiskers', v: 'whiskers'},
          {k: 'White Paint', v: 'white_paint'},
          {k: 'Pink Paint', v: 'pink_paint'},
        ],
        cVal: 'chalk',
      },
      {
        multiple: false,
        permit_req_i: null,
        wtype: 'permit_req_i',
        title: 'Permit Required',
        required: false,
        inType: 'radio',
        data: [
          {k: 'Yes', v: 'yes'},
          {k: 'No', v: 'no'},
        ],
        num: 4,
        cVal: 'no',
      },
      {
        multiple: false,
        permit_no_i: null,
        wtype: 'permit_no_i',
        title: 'Permit Number',
        required: false,
      },
      {
        multiple: false,
        foreman_i: null,
        wtype: 'foreman_i',
        title: 'Foreman',
        required: false,
      },
      {
        multiple: true,
        fields: [
          {
            phone_i: null,
            wtype: 'phone_i',
            title: 'Office Phone',
            required: false,
          },
          {
            extension_i: null,
            wtype: 'extension_i',
            title: 'Extension',
            required: false,
          },
        ],
      },
      {
        multiple: false,
        cell_i: null,
        wtype: 'cell_i',
        title: 'Cell',
        required: false,
      },
      {
        multiple: false,
        email_i: null,
        wtype: 'email_i',
        title: 'Email',
        required: true,
      },
      {
        multiple: false,
        vaccum_i: null,
        wtype: 'vaccum_i',
        title: 'Vaccum',
        required: false,
        inType: 'radio',
        data: [
          {k: 'Yes', v: 'yes'},
          {k: 'No', v: 'no'},
        ],
        num: 5,
        cVal: 'no',
      },
      {
        multiple: false,
        boring_i: null,
        wtype: 'boring_i',
        title: 'Boring',
        required: false,
        inType: 'radio',
        data: [
          {k: 'Yes', v: 'yes'},
          {k: 'No', v: 'no'},
        ],
        num: 5,
        cVal: 'no',
      },
      {
        multiple: false,
        explosives_i: null,
        wtype: 'explosives_i',
        title: 'Explosives',
        required: false,
        inType: 'radio',
        data: [
          {k: 'Yes', v: 'yes'},
          {k: 'No', v: 'no'},
        ],
        num: 6,
        cVal: 'no',
      },
      {
        multiple: false,
        work_type: null,
        wtype: 'work_type',
        title: 'Work Type',
        required: false,
      },
    ],
  },
  Step4: [
    {
      call_req: null,
      wtype: 'call_req',
      title: 'Call Requested',
      required: false,
      inType: 'radio',
      data: [
        {k: 'Yes', v: 'yes'},
        {k: 'No', v: 'no'},
      ],
      num: 1,
      cVal: 'no',
    },
    {
      field_meet: null,
      wtype: 'field_meet',
      title: 'Field Meet',
      required: false,
      inType: 'radio',
      data: [
        {k: 'Yes', v: 'yes'},
        {k: 'No', v: 'no'},
      ],
      num: 2,
      cVal: 'no',
    },
    {
      emergency: null,
      wtype: 'emergency',
      title: 'Emergency',
      required: false,
      inType: 'radio',
      data: [
        {k: 'Yes', v: 'yes'},
        {k: 'No', v: 'no'},
      ],
      num: 3,
      cVal: 'no',
    },
    {
      opt_remark: null,
      wtype: 'opt_remark',
      title: 'Request Operators Re-mark their facilities',
      required: false,
      inType: 'radio',
      data: [
        {k: 'Yes', v: 'yes'},
        {k: 'No', v: 'no'},
      ],
      num: 4,
      cVal: 'no',
    },
    {
      work_order: null,
      wtype: 'work_order',
      title: 'Work Order/Job Number',
      required: false,
    },
    {
      comments: null,
      wtype: 'comments',
      title: 'Comments',
      required: false,
      inType: 'textarea',
      cVal: '',
    },
  ],
};
const mValid =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var eTicketID = 0;
const initialState = {
  isloading: false,
  isEditing: false,
  stage: 1,
  activeTab: '',
  is_agree: false,
  countylist: config.nvcounties,
  formdata: formAttr,
};
export default class ETicket extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.updateFormField = this.updateFormField;
  }

  componentDidMount() {
    this.mounted = true;
    if (config.hasToken) {
      this._getUserInfo(config.currentToken);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  updateFormField = fieldName => text => {
    this.setState({[fieldName]: text});
  };

  updateOtherFields = (f, t) => {
    this.setState({
      [f]: t,
    });
  };

  _getUserInfo(token) {
    if (this.mounted) {
      this.setState({
        isloading: true,
      });
    }
    fetch(config.BASE_URL + 'account_information?api_token=' + token, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
      .then(response => response.json())
      .then(res => {
        if (this.mounted) {
          if (res.status == 1) {
            var information = res.info;
            jsonObj = formAttr.Step1;

            var selectItems = {
              name: 'name',
              /*company: "cname",
			            address: "address",*/
              phone: 'o_phone',
              /*city: "city",
			            state: "state",
			            zip: "zip",*/
              email: 'email',
              cemail: 'email',
            };

            jsonObj.map(item => {
              if (item.multiple) {
                item.fields.map(itm => {
                  if (typeof selectItems[itm.wtype] != 'undefined') {
                    itm[itm.wtype] = information[selectItems[itm.wtype]];
                    this.updateOtherFields(
                      itm.wtype,
                      information[selectItems[itm.wtype]],
                    );
                  }
                });
              } else {
                if (typeof selectItems[item.wtype] != 'undefined') {
                  item[item.wtype] = information[selectItems[item.wtype]];
                  this.updateOtherFields(
                    item.wtype,
                    information[selectItems[item.wtype]],
                  );
                }
              }
            });

            this.setState({formdata: jsonObj});
          }
          this.setState({
            isloading: false,
          });
        }
      })
      .catch(err => {
        if (this.mounted) {
          this.setState({
            isloading: false,
          });
        }
      })
      .done();
  }

  onNextStep = wState => {
    if (wState == 2 && this.state.activeTab == '') {
      _showErrorMessage('Please select Digsite type.');
      return false;
    }

    var tArray;
    switch (wState) {
      case 1:
        tArray = formAttr.Step1;
        break;
      case 2:
        tArray = formAttr.Step2[this.state.activeTab];
        break;
      case 3:
        tArray = formAttr.Step3[this.state.activeTab];
        break;
      case 4:
        tArray = formAttr.Step4;
        break;
    }

    //console.warn(tArray)

    var err = '';
    tArray.forEach((k, v, arr) => {
      if (k.required) {
        if (typeof this.state[k.wtype] == 'undefined') {
          err += k.title + ' is required \n';
        } else if (
          typeof this.state.email != 'undefined' &&
          !mValid.test(this.state.email)
        ) {
          err = 'Please enter a valid email address \n';
        } else if (
          typeof this.state.email != 'undefined' &&
          k.wtype == 'cemail' &&
          this.state.email != this.state.cemail
        ) {
          err = 'Email should be matched \n';
        }
      }
    });

    if (err != '') {
      _showErrorMessage(err);
    } else if (
      this.state.is_agree == false &&
      this.state.activeTab == 'single' &&
      wState == 3
    ) {
      _showErrorMessage('Please agreed');
    } else {
      that = this;
      this._submitStep(wState, tArray, d => {
        if (this.mounted) {
          if (
            wState == 4 ||
            (this.state.activeTab == 'single' && wState == 3)
          ) {
            this.setState(initialState);
            eTicketID = 0;
            this.props.navigation.navigate({
              routeName: 'Eticketsuccess',
              key: 'Eticket',
              params: {message: 'E-Ticket submit successfully.'},
            });
          } else {
            this.setState({stage: wState + 1, isEditing: false});
          }
          setTimeout(() => {
            that.scroll._root.scrollToPosition(0, 0);
          }, 1);
        }
      });
    }
  };

  renderElement() {
    const {formdata, stage, activeTab, countylist} = this.state;
    switch (stage) {
      case 1:
        return (
          <StepOne
            dataForm={formAttr.Step1}
            updateOtherFields={this.updateOtherFields}
            updateTextCB={this.updateFormField}
          />
        );
      case 2:
        return (
          <StepTwo
            dataForm={formAttr.Step2}
            updateOtherFields={this.updateOtherFields}
            updateTextCB={this.updateFormField}
            activeTAB={activeTab}
            countylist={countylist}
          />
        );
      case 3:
        return (
          <StepThree
            dataForm={formAttr.Step3[activeTab]}
            updateOtherFields={this.updateOtherFields}
            updateTextCB={this.updateFormField}
            activeTAB={activeTab}
          />
        );
      case 4:
        return (
          <StepFour
            dataForm={formAttr.Step4}
            updateOtherFields={this.updateOtherFields}
            updateTextCB={this.updateFormField}
          />
        );
    }
  }

  formatPrevios(data, step) {
    switch (step) {
      case 1:
        wStep = 'Step1';
        Srray = formAttr.Step1;
        break;
      case 2:
        wStep = 'Step2';
        Srray = formAttr.Step2;
        break;
      case 3:
        wStep = 'Step3';
        Srray = formAttr.Step3;
        break;
      case 4:
        wStep = 'Step4';
        Srray = formAttr.Step4;
        break;
    }
    jsonObj = [];
    jsonObj = Srray;
    if (step == 2 || step == 3) {
      jsonObj[this.state.activeTab].map(item => {
        if (item.multiple) {
          item.fields.map(itm => {
            itm[itm.wtype] = data[itm.wtype];
            itm['cVal'] = data[itm.wtype];
          });
        } else {
          item[item.wtype] = data[item.wtype];
          item['cVal'] = data[item.wtype];

          if (
            item.wtype == 'dig_county_s' ||
            item.wtype == 'dig_county_m' ||
            item.wtype == 'dig_county_i'
          ) {
            if (
              data['dig_state_s'] == 'CA' ||
              data['dig_state_m'] == 'CA' ||
              data['dig_state_i'] == 'CA'
            ) {
              this.setState({countylist: config.cacounties});
            } else {
              this.setState({countylist: config.nvcounties});
            }
          }
        }
      });
    } else {
      jsonObj.map(item => {
        if (item.multiple) {
          item.fields.map(itm => {
            itm[itm.wtype] = data[itm.wtype];
            itm['cVal'] = data[itm.wtype];
          });
        } else {
          item[item.wtype] = data[item.wtype];
          item['cVal'] = data[item.wtype];
        }
      });
    }
    formAttr[wStep] = jsonObj;
    this.setState({stage: step, isEditing: true});
    setTimeout(() => {
      this.scroll._root.scrollToPosition(0, 0);
    }, 1);
  }

  _doBack() {
    const {stage} = this.state;
    if (stage > 1 && eTicketID != 0) {
      ticket = eTicketID;
      step = stage - 1;
      //this.setState({ stage: step, isEditing:true }); //Remove this

      if (this.mounted) {
        this.setState({
          isloading: true,
        });
      }
      fetch(
        config.BASE_URL +
          'ticket_data?ticket_id=' +
          ticket +
          '&api_token=' +
          config.currentToken,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      )
        .then(response => response.json())
        .then(res => {
          if (this.mounted) {
            if (res.status == 1) {
              this.formatPrevios(res.data, step);
            }
            this.setState({
              isloading: false,
            });
          }
        })
        .catch(err => {
          if (this.mounted) {
            this.setState({
              isloading: false,
            });
          }
        })
        .done();
    } else {
      this._doCancel();
    }
  }

  _doCancel() {
    const resetAction = StackActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({routeName: 'Dashboard'})],
    });
    this.props.navigation.dispatch(resetAction);
  }

  _submitStep(step, steparr, callback) {
    const formdata = new FormData();
    if (config.hasToken) {
      formdata.append('step', step);
      formdata.append('eticket_id', eTicketID);
      if (step > 1) {
        formdata.append('step_type', this.state.activeTab);
      }
      steparr.forEach((k, v, arr) => {
        if (k.multiple) {
          k.fields.forEach((k1, v1, arr1) => {
            if (typeof this.state[k1.wtype] != 'undefined') {
              formdata.append(k1.wtype, this.state[k1.wtype]);
            } else if (
              typeof k1.inType != 'undefined' &&
              !this.state.isEditing
            ) {
              formdata.append(k1.wtype, k1.cVal);
            } else if (this.state.isEditing) {
              if (typeof k1.cVal != 'undefined') {
                formdata.append(k1.wtype, k1.cVal);
              }
            }
          });
        } else if (typeof this.state[k.wtype] != 'undefined') {
          formdata.append(k.wtype, this.state[k.wtype]);
        } else if (typeof k.inType != 'undefined' && !this.state.isEditing) {
          if (k.inType != 'text') formdata.append(k.wtype, k.cVal);
        } else if (this.state.isEditing) {
          if (typeof k.cVal != 'undefined') {
            formdata.append(k.wtype, k.cVal);
          }
        }
      });
      //console.warn(formdata)
      this._postData(config.currentToken, formdata, callback);
      //callback();		// Remove this
    }
  }

  _postData(token, data, callback) {
    if (this.mounted) {
      this.setState({
        isloading: true,
      });
    }
    fetch(config.BASE_URL + 'register_ticket?api_token=' + token, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: data,
    })
      .then(response => response.json())
      .then(res => {
        //console.warn(res)
        if (this.mounted) {
          if (res.status == 1) {
            eTicketID = res.info.eticket_id;
            callback();
          } else if (res.status == 0) {
            _showErrorMessage(res.message);
          } else {
            throw 'Error';
          }
          this.setState({
            isloading: false,
          });
        }
      })
      .catch(err => {
        if (this.mounted) {
          _showErrorMessage('Something went wrong, Try again later');
          this.setState({
            isloading: false,
          });
        }
      })
      .done();
  }

  render() {
    const {stage, activeTab} = this.state;
    if ((stage == 3 && activeTab == 'single') || stage > 3) {
      btnText = 'Submit';
    } else {
      btnText = 'Save and Continue';
    }
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#6f6f6f'}}>
        <Container>
          <CustomeHeader {...this.props} />
          <Content ref={c => (this.scroll = c)}>
            <View style={{margin: 10}}>
              <H1 style={{fontFamily: 'RacingSansOne-Regular', marginTop: 30}}>
                NEW TICKET
              </H1>
              {this.renderElement()}
              <Button
                block
                style={styless.buttong}
                onPress={() => this.onNextStep(stage)}>
                <H3 style={styless.textss}>{btnText}</H3>
              </Button>
              <Body style={{flexDirection: 'row'}}>
                <Button
                  block
                  small
                  onPress={() => this._doBack()}
                  style={{
                    backgroundColor: '#6F6F6F',
                    flex: 1,
                    alignSelf: 'center',
                    marginTop: 25,
                    marginRight: 5,
                  }}>
                  <Text
                    style={{color: '#fff', fontFamily: 'OpenSans-SemiBold'}}>
                    BACK
                  </Text>
                </Button>
                <Button
                  block
                  small
                  onPress={() => this._doCancel()}
                  style={{
                    backgroundColor: '#E05439',
                    flex: 1,
                    alignSelf: 'center',
                    marginTop: 25,
                  }}>
                  <Text
                    style={{color: '#fff', fontFamily: 'OpenSans-SemiBold'}}>
                    CANCEL
                  </Text>
                </Button>
              </Body>
            </View>
          </Content>
          {this.state.isloading && <Loader />}
        </Container>
      </SafeAreaView>
    );
  }
}

const styless = StyleSheet.create({
  texts: {
    fontFamily: 'OpenSans-Regular',
  },
  textss: {
    fontFamily: 'OpenSans-Bold',
  },
  ticket_req: {
    fontSize: 28,
    textAlign: 'center',
    marginTop: 20,
    color: '#000000',
    fontFamily: 'OpenSans-Bold',
  },
  buttong: {
    backgroundColor: '#febf26',
    marginTop: 20,
  },
});
