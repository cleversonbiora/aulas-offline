import React, {Component} from 'react';
import {StyleSheet, View, Button} from 'react-native';
import VideoPlayer from './src/components/VideoPlayer'

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
          <VideoPlayer 
                source={{
                    uri:
                    'http://vod.grupouninter.com.br/2017/JUL/201701528-A06-P08.mp4',
                }} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'space-between',
  },
  backgroundVideo: {
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
});
