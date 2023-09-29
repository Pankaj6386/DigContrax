import React, {Component} from 'react';
import {SafeAreaView} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export default class Content extends Component {
  render() {
    const {children, padder} = this.props;
    const containerStyle = {
      flex: 1,
     
    };
    const variables = {
      contentPadding: 10,
    };
    return (
      <SafeAreaView style={containerStyle}>
        <KeyboardAwareScrollView
        
          automaticallyAdjustContentInsets={false}
          resetScrollToCoords={{x: 0, y: 0}}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            padding: padder ? variables.contentPadding : undefined,
          }}
          {...this.props}>
          {children}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}
