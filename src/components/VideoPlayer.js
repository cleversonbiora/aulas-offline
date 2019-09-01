import React, { Component } from 'react';
import {StyleSheet, View, Button, TouchableOpacity} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class VideoPlayer extends Component {  
    constructor(props) {
        super(props);
        this.state = {
            paused: false,
        };
    }

    _onTogglePaused() {
        this.setState({paused: !this.state.paused});
    }

    render() {
        return (
            <View style={styles.container}>
                <Video
                    ref={ref => {
                        this.player = ref;
                    }}
                    paused={this.state.paused}
                    resizeMode={'contain'}
                    onBuffer={this.onBuffer}
                    onError={this.videoError}
                    style={styles.backgroundVideo}
                    {...this.props}
                />
                <View style={styles.bottomControls}>
                    <TouchableOpacity onPress={() => this._onTogglePaused()}>
                        <Icon name={this.state.paused ? "play" : "pause"} size={25} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        )
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
  bottomControls: {
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 100,
    padding:15, 
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
});
