import config from './config/config';
import {
  _updateAppMessage,
  _retrieveUser,
  _storeUser,
  _removeUser,
  _showErrorMessage,
  _showSuccessMessage,
  _getallticketstatus,
  _phoneFormat,
  _getcompanies,
  _isUserActivated,
  _updateTermsAccepted,
  _setHideExpired,
  _setHideNotifyExpired,
} from './config/helper';
import {validate} from './config/validation';
import {Loader} from './config/Loader';

const image = {
  logo: require('./images/logo.png'),
  logoLarge: require('./images/digcontrax-logo.png'),
  add: require('./images/create.png'),
  addActive: require('./images/createactive.png'),
  home: require('./images/home.png'),
  homeActive: require('./images/homeactive.png'),
  iconMenu: require('./images/icon-menu.png'),
  password: require('./images/login-password.png'),
  user: require('./images/login-user.png'),
  manage: require('./images/manage.png'),
  manageActive: require('./images/manageactive.png'),
  notification: require('./images/notification.png'),
  notificationActive: require('./images/notificationactive.png'),
  support: require('./images/support.png'),
  supportActive: require('./images/supportactive.png'),
  phone: require('./images/phone.png'),
  warning: require('./images/warning.png'),
  web: require('./images/web.png'),
  homeLoading: require('./images/home-loading.png'),
  taglogo: require('./images/tag-logo.png'),
  clock: require('./images/clock.png'),
  cleared: require('./images/cleared.png'),
  cleared_new: require('./images/cleared_new.png'),
  closed: require('./images/inactive.png'),
  pending: require('./images/pending.png'),
  pending_new: require('./images/pending_new.png'),
  info: require('./images/info.png'),
  noImage: require('./images/noImage.png'),
  singleAddress: require('./images/singleaddress.png'),
  interSection: require('./images/inter.png'),
  multiLocation: require('./images/multilocation.png'),
  npending: require('./images/npending.png'),
  faq: require('./images/faq.png'),
  law: require('./images/law.png'),
  training: require('./images/training.png'),
  call: require('./images/call.png'),
  email: require('./images/email.png'),
  arrowRight: require('./images/arrow-right.png'),
  arrowDown: require('./images/arrow-down.png'),
  pdfIcon: require('./images/pdf-black.png'),
  excelIcon: require('./images/excel-black.png'),
  docIcon: require('./images/doc-black.png'),
  pendingResIcon: require('./images/pending-r.png'),
  completeResIcon: require('./images/complete-r.png'),
  add_ticket: require('./images/add_ticket.png'),
  refresh: require('./images/refresh.png'),
  calendarIcon: require('./images/Calendar.png'),
  locationIcon: require('./images/locationIcon.png'),
  ticket: require('./images/ticket.png'),
  user: require('./images/user.png'),
  phoneCall: require('./images/phoneCall.png'),
  mailIcon: require('./images/mailIcon.png'),
  factory: require('./images/factory.png'),
  chooseFile: require('./images/chooseFile.png'),
  imageIcon: require('./images/imageIcon.png'),
  videoIcon: require('./images/videoIcon.png'),
  pdfIcon: require('./images/pdfIcon.png'),
  docsIcon: require('./images/docsIcon.png'),
  deleteIcon: require('./images/deleteIcon.png'),
  downloadIcon: require('./images/downloadIcon.png'),
  closeIcon: require('./images/closeIcon.png'),
  expired: require('./images/expired.png'),
  cancelled: require('./images/cancelled.png'),
  usericon: require('./images/usericon.png'),
  usericonActive: require('./images/usericonActive.png'),
  flag: require('./images/flag.png'),
  spain: require('./images/spain.png'),
  screen: require('./images/screen.png'),
};

/* const Loading =  (
	<Loader />
); */

export {
  image,
  config,
  _retrieveUser,
  _storeUser,
  _removeUser,
  _showErrorMessage,
  validate,
  Loader,
  _showSuccessMessage,
  _getallticketstatus,
  _phoneFormat,
  _getcompanies,
  _isUserActivated,
  _updateTermsAccepted,
  _setHideExpired,
  _setHideNotifyExpired,
  _updateAppMessage,
};
