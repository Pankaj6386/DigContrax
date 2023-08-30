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
  H2,
  H3,
  Left,
  Body,
  Right,
  Icon,
  Title,
  Button,
} from 'native-base';
import {
  image,
  _retrieveUser,
  _removeUser,
  config,
  Loader,
  _showErrorMessage,
  _showSuccessMessage,
  _getallticketstatus,
  _isUserActivated,
} from 'assets';
import {StackActions, CommonActions} from '@react-navigation/native';
import CustomeHeader from '../CustomeHeader';
import Searchview from './Searchview';
import Content from '../../components/Content';

const data = new FormData();
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isloading: false,
      filterloading: false,
      home: true,
      search: false,
      srch_q: '',
      filterView: false,
      filterdata: [],
      serachresult: [],
      ticketStatus: {
        pending: {count: 0},
        cleared: {count: 0},
        closed: {count: 0},
      },
      pending: 0,
      sort_by: '',
      sort_order: '',
      sort_order_ticket: '',
      sort_order_days: '',
      type: '',
      sortClicked: false,
    };
  }

  componentDidUpdate() {}

  componentDidMount() {
    var self = this;
    _retrieveUser().then(user => {
      if (user !== null) {
        var usr = JSON.parse(user);
        config.hasToken = true;
        config.currentToken = usr.userInfo.token;

        _isUserActivated(
          config.BASE_URL + 'user-validate?api_token=' + usr.userInfo.token,
          function (resu) {
            if (resu.status == 1) {
              _getallticketstatus(
                config.BASE_URL +
                  'ticket_status?api_token=' +
                  usr.userInfo.token,
                function (res) {
                  if (res.status == 1) {
                    self.setState({
                      ticketStatus: res.data,
                    });
                  }
                },
              );
            } else {
              _removeUser().then(user => {
                config.hasToken = false;
                const resetAction = StackActions.reset({
                  index: 0,
                  key: null,
                  actions: [NavigationActions.navigate({routeName: 'Auth'})],
                });
                self.props.navigation.dispatch(resetAction);
              });
            }
          },
        );
      } else {
        _removeUser().then(user => {
          config.hasToken = false;
          const resetAction = StackActions.reset({
            index: 0,
            key: null,
            actions: [NavigationActions.navigate({routeName: 'Auth'})],
          });
          self.props.navigation.dispatch(resetAction);
        });
      }
    });

    this.focusListener = this.props.navigation.addListener('willFocus', () => {
      alert('heer');
      self.setState({isloading: true});
      _getallticketstatus(
        config.BASE_URL + 'ticket_status?api_token=' + config.currentToken,
        function (res) {
          if (res.status == 1) {
            self.setState({
              ticketStatus: res.data,
            });
          }
          self.setState({isloading: false});
        },
      );
      this.navigateToScreen('Manage');
    });
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  navigateToScreen = route => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route,
    });
    this.props.navigation.dispatch(navigateAction);
  };

  clickTicket = ticket => {
    /* if(this.mounted) {
			this.setState({
				home:true,
				search:false,
				srch_q:''
			});
		} */
    const token = config.currentToken;
    const formdata = new FormData();
    formdata.append('ticket_no', ticket.ticket);
    const _this = this;
    fetch(config.BASE_URL + 'ticket_info?api_token=' + token, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      body: formdata,
    })
      .then(response => response.json())
      .then(res => {
        console.log('->>>>>>>>>>>', res.data.excavation_info);
        if (res.status == 1) {
          /*this.setState({ 'ticketInfo': res.data.ticket_info });
                	this.setState({ 'excavatorInfo': res.data.excavator_info });
                	this.setState({ 'excavationAreaInfo': res.data.excavation_info});*/
        } else if (res.status == 0) {
          _showErrorMessage(res.message);
        }

        const navigateAction = NavigationActions.navigate({
          routeName: 'TicketDetail',
          params: {
            ticket: ticket,
            ticketInfo: res.data.ticket_info,
            excavatorInfo: res.data.excavator_info,
            excavationAreaInfo: res.data.excavation_info,
          },
        });
        this.props.navigation.dispatch(navigateAction);
      })
      .catch(err => {
        _showErrorMessage('Something went wrong, Try again later.');
        this.props.changeLoadingState(false);
      })
      .done();

    //this.props.navigation.navigate({routeName: 'TicketDetail', params: { ticket: ticket }})
  };

  getfilterTicket(token, query) {
    if (this.mounted) {
      if (this.state.sortClicked) {
        this.setState({
          isloading: true,
        });
      } else {
        this.setState({
          filterloading: true,
          filterView: false,
          filterdata: [],
        });
      }
      console.log(this.state.sort_by);
      data.append('filter', query);
      data.append('sort_by', this.state.sort_by);
      data.append('sort_order', this.state.sort_order);
    }
    fetch(config.BASE_URL + 'filtered?api_token=' + token, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      body: data,
    })
      .then(response => response.json())
      .then(res => {
        if (this.mounted) {
          if (res.status == 1) {
            this.setState({
              filterView: true,
              filterdata: res.data,
            });
          } else if (res.status == 0) {
            _showErrorMessage(res.message);
          }
          this.setState({
            filterloading: false,
            isloading: false,
          });
        }
      })
      .catch(err => {
        if (this.mounted) {
          _showErrorMessage('Something went wrong, Try again later.');
          this.setState({
            filterloading: false,
            isloading: false,
          });
        }
      })
      .done();
  }

  filterTicket = type => {
    if (config.hasToken) {
      this.setState({type: type});
      this.getfilterTicket(config.currentToken, type);
    }
  };

  filteredTicketView() {
    if (this.state.filterloading) {
      return (
        <H1
          style={{
            fontFamily: 'RacingSansOne-Regular',
            marginTop: 25,
            marginBottom: 5,
            alignSelf: 'center',
          }}>
          Loading...
        </H1>
      );
    } else if (this.state.filterView) {
      return (
        <View style={{marginTop: 10}}>
          <Searchview
            data={this.state.filterdata}
            goticket={this.clickTicket}
            sortTicket={this.sortTicket}
          />
        </View>
      );
    }
  }

  renderBottomView() {
    if (this.state.search) {
      return (
        <Searchview
          data={this.state.serachresult}
          goticket={this.clickTicket}
          sortTicket={this.sortTicket}
        />
      );
    } else {
      return (
        <Content>
          <H1
            style={{
              fontFamily: 'RacingSansOne-Regular',
              marginTop: 35,
              marginBottom: 5,
            }}>
            MANAGE TICKETS
          </H1>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={styles.manageTouch}
              onPress={() => this.filterTicket('cleared')}>
              <View style={{alignSelf: 'center'}}>
                <Image
                  source={image.cleared}
                  style={styles.manageImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.manageText}>
                {this.state.ticketStatus.cleared.count}
              </Text>
              <Text style={styles.manageTextb}>Cleared</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.manageTouch}
              onPress={() => this.filterTicket('pending')}>
              <View style={{alignSelf: 'center'}}>
                <Image
                  source={image.pending}
                  style={styles.manageImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.manageText}>
                {this.state.ticketStatus.pending.count}
              </Text>
              <Text style={styles.manageTextb}>Pending</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.manageTouch}
              onPress={() => this.filterTicket('closed')}>
              <View style={{alignSelf: 'center'}}>
                <Image
                  source={image.closed}
                  style={styles.manageImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.manageText}>
                {this.state.ticketStatus.closed.count}
              </Text>
              <Text style={styles.manageTextb}>Closed</Text>
            </TouchableOpacity>
          </View>
        </Content>
      );
    }
  }

  sortTicket = sort_by => {
    var sort_order = '';
    if (sort_by == 'ticket_no') {
      sort_order =
        this.state.sort_order_ticket == ''
          ? 'asc'
          : this.state.sort_order_ticket == 'asc'
          ? 'desc'
          : 'asc';
      this.setState({sort_order_days: '', sort_order_ticket: sort_order});
    } else {
      sort_order =
        this.state.sort_order_days == ''
          ? 'asc'
          : this.state.sort_order_days == 'asc'
          ? 'desc'
          : 'asc';
      this.setState({sort_order_ticket: '', sort_order_days: sort_order});
    }
    this.setState({
      sort_by: sort_by,
      sort_order: sort_order,
      sortClicked: true,
    });
    var self = this;
    this.mounted = true;
    setTimeout(function () {
      if (self.state.search) {
        self._searchTicket(config.currentToken, self.state.srch_q);
      } else {
        self.getfilterTicket(config.currentToken, self.state.type);
      }
    }, 100);
  };

  _searchTicket(token, query) {
    if (this.mounted) {
      var data = new FormData();
      this.setState({
        isloading: true,
      });
      data.append('number', query);
      data.append('sort_by', this.state.sort_by);
      data.append('sort_order', this.state.sort_order);
    }
    fetch(config.BASE_URL + 'search-ticket?api_token=' + token, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      body: data,
    })
      .then(response => response.json())
      .then(res => {
        if (this.mounted) {
          if (res.status == 1) {
            this.setState({
              home: false,
              search: true,
              serachresult: res.data,
              filterdata: [],
            });
          } else if (res.status == 0) {
            this.setState({
              serachresult: res.data,
              filterdata: [],
            });
            _showErrorMessage(res.message);
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

  onPressSearch = () => {
    const sNumber = this.state.srch_q;
    if (sNumber.length < 1) {
      if (this.mounted) {
        _showErrorMessage('Enter ticket number.');
      }
      return false;
    }
    if (config.hasToken) {
      this._searchTicket(config.currentToken, sNumber);
    }
  };

  resetSearch = () => {
    this.setState({
      srch_q: '',
      serachresult: [],
      filterdata: [],
      home: true,
      search: false,
    });
  };

  _dosearch(text) {
    if (text.trim().length == 0) {
      if (this.mounted) {
        this.setState({
          home: true,
          search: false,
        });
      }
    }
    if (this.mounted) {
      this.setState({
        srch_q: text.trim(),
      });
      var self = this;
      setTimeout(function () {
        self.onPressSearch();
      }, 1000);
    }
  }

  render() {
    const {navigate} = this.props.navigation;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#6f6f6f'}}>
        <Container>
          <CustomeHeader {...this.props} />
          <Content padder>
            <H1 style={{fontFamily: 'RacingSansOne-Regular', marginTop: 20}}>
              SEARCH TICKETS
            </H1>
            <Form>
              <Item regular style={{marginTop: 5}}>
                <Input
                  placeholder="Search"
                  defaultValue={this.state.srch_q}
                  onChangeText={text => this._dosearch(text)}
                />
                <Icon
                  name={this.state.srch_q.length > 0 ? 'close' : 'search'}
                  onPress={() => this.resetSearch()}
                />
              </Item>
            </Form>
            {this.renderBottomView()}
            {this.filteredTicketView()}
          </Content>
          {this.state.isloading && <Loader />}
        </Container>
      </SafeAreaView>
    );
  }
}

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
  reqTouch: {
    flex: 1,
    backgroundColor: '#fdbe25',
    marginRight: 15,
    height: 130,
  },
  reqTouchLast: {
    flex: 1,
    backgroundColor: '#fdbe25',
    height: 130,
  },
  reqTouchV: {
    alignSelf: 'center',
    marginTop: 10,
  },
  reqText: {
    fontFamily: 'OpenSans-Bold',
    alignSelf: 'center',
    marginBottom: 15,
  },
  reqTextLast: {
    fontFamily: 'OpenSans-Bold',
    alignSelf: 'center',
  },
  reqTextLasts: {
    fontFamily: 'OpenSans-Regular',
    alignSelf: 'center',
    fontSize: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#fdbe25',
    marginTop: 15,
  },
});
