import React, {Component} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  Container,
  Form,
  Item,
  Input,
  H1,
  Left,
  Body,
  Right,
  Icon,
  Title,
} from 'native-base';
import {image, _retrieveUser, config, Loader} from 'assets';
import Content from '../../components/Content';

class Searchview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tickets: this.props.data,
      isloading: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({tickets: nextProps.data});
  }
  render() {
    return (
      <Content>
        <View
          style={{flexDirection: 'row', backgroundColor: '#333', padding: 15}}>
          <TouchableOpacity
            onPress={() => this.props.sortTicket('ticket_no')}
            style={{flex: 1, alignSelf: 'flex-start'}}>
            <Text
              style={{
                fontSize: 14,
                textAlign: 'left',
                color: '#fff',
                fontFamily: 'OpenSans-Bold',
              }}>
              STATUS/TICKET#
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.sortTicket('job_name')}
            style={{flex: 1, marginRight: 2, alignSelf: 'flex-end'}}>
            <Text
              style={{
                fontSize: 14,
                textAlign: 'right',
                color: '#fff',
                fontFamily: 'OpenSans-Bold',
              }}>
              JOB NAME
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.sortTicket('expirydate')}
            style={{flex: 1, marginRight: 2, alignSelf: 'flex-end'}}>
            <Text
              style={{
                fontSize: 14,
                textAlign: 'right',
                color: '#fff',
                fontFamily: 'OpenSans-Bold',
              }}>
              EXPIRING
            </Text>
          </TouchableOpacity>
        </View>
        {typeof this.state.tickets.map != 'undefined' &&
          this.state.tickets.map((key, i) => {
            return (
              <TouchableOpacity
                key={key.ticket}
                onPress={() => this.props.goticket(key)}>
                <Body
                  style={{
                    height: 50,
                    flexDirection: 'row',
                    backgroundColor: i % 2 == 0 ? '#D2D2D2' : '#e4e4e4',
                    paddingRight: 12,
                  }}>
                  <View style={{marginRight: 5}}>
                    <Image
                      source={image[key.classs]}
                      style={{height: 25, width: 30}}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={{flex: 1}}>
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
                  <View style={{flex: 1}}>
                    <Text
                      style={{
                        fontSize: 13,
                        textAlign: 'right',
                        fontFamily: 'OpenSans-Regular',
                        color: key.days_left == 'Expired' ? 'red' : '#000',
                      }}>
                      {key.days_left}
                    </Text>
                  </View>
                </Body>
              </TouchableOpacity>
            );
          })}
      </Content>
    );
  }
}
export default Searchview;

const styles = StyleSheet.create({
  manageText: {
    fontFamily: 'OpenSans-Regular',
    alignSelf: 'center',
    color: '#fff',
    fontSize: 20,
  },
});
