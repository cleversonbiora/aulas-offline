import React, { Component } from 'react';
import {StyleSheet, View, Text, TouchableOpacity, TouchableWithoutFeedback, PanResponder, Animated, Easing} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';

export default class VideoPlayer extends Component {  
    constructor(props) {
        super(props);
        this.state = {            
            // Video
            resizeMode: this.props.resizeMode,
            paused: this.props.paused,
            muted: this.props.muted,
            rate: 0,
            currentTime: 0,
            duration: 0,
            seekerPosition: 0,
            seekerFillWidth: 0,
            seekerOffset: 0,
            seeking: false,
            loading: true,
            lastScreenPress: 0,
            showControls: true
        };
        this.seekPanResponder = PanResponder;
        this.seekWidth = 0;
        this.controlTimeoutDelay = 15000;
        this.controlTimeout = null;

        this.mounted = false;
        this.rates = [
            1,
            1.2,
            1.5,
            2,
            3,
            0.7
        ];

        const initialValue = this.props.showOnStart ? 1 : 0;
        this.animations = {
            bottomControl: {
                marginBottom: new Animated.Value( 0 ),
                opacity: new Animated.Value( initialValue ),
            },
            topControl: {
                marginTop: new Animated.Value( 0 ),
                opacity: new Animated.Value( initialValue ),
            },
            video: {
                opacity: new Animated.Value( 1 ),
            },
            loader: {
                rotate: new Animated.Value( 0 ),
                MAX_VALUE: 360,
            }
        };
    }

    componentDidMount() {
        this.initSeekPanResponder();
        this.mounted = true;
    }

    _onChangeRate = () => {
        if(this.state.rate < this.rates.length - 1)
            this.setState({rate: this.state.rate + 1});
        else
            this.setState({rate: 0});
    }

    _onTogglePaused = () => {
        this.setState({paused: !this.state.paused});
    }

    _onLoad = (data = {}) => {
        this.setState({duration: data.duration, loading : false});

        if (this.state.showControls) {
            this.setControlTimeout();
        }
    }

    _onEnd = () => {
        this.setState({duration: 0, paused: true});
    }

    _onProgress = (data = {}) => {
        if (!this.state.seeking) {
            const position = this.calculateSeekerPosition();
            this.setSeekerPosition(position);
        }
        this.setState({currentTime: data.currentTime});
    }

    _onScreenTouch() {
        const time = new Date().getTime();
        this._toggleControls();

        this.setState({lastScreenPress: time});
    }

    setControlTimeout() {
        this.controlTimeout = setTimeout( ()=> {
            this._hideControls();
        }, this.controlTimeoutDelay );
    }

    clearControlTimeout() {
        clearTimeout( this.controlTimeout );
    }

    /**
     * Reset the timer completely
     */
    resetControlTimeout() {
        this.clearControlTimeout();
        this.setControlTimeout();
    }

    hideControlAnimation() {
        Animated.parallel([
            Animated.timing(
                this.animations.topControl.opacity,
                { toValue: 0 }
            ),
            Animated.timing(
                this.animations.topControl.marginTop,
                { toValue: -100 }
            ),
            Animated.timing(
                this.animations.bottomControl.opacity,
                { toValue: 0 }
            ),
            Animated.timing(
                this.animations.bottomControl.marginBottom,
                { toValue: -100 }
            ),
        ]).start();
    }

    showControlAnimation() {
        Animated.parallel([
            Animated.timing(
                this.animations.topControl.opacity,
                { toValue: 1 }
            ),
            Animated.timing(
                this.animations.topControl.marginTop,
                { toValue: 0 }
            ),
            Animated.timing(
                this.animations.bottomControl.opacity,
                { toValue: 1 }
            ),
            Animated.timing(
                this.animations.bottomControl.marginBottom,
                { toValue: 0 }
            ),
        ]).start();
    }

    _hideControls() {
        if(this.mounted) {
            this.hideControlAnimation();
            this.setState({showControls: false});
        }
    }

    _toggleControls() {
        if (this.state.showControls ) {
            this.showControlAnimation();
            this.setControlTimeout();
        }
        else {
            this.hideControlAnimation();
            this.clearControlTimeout();
        }
        this.setState({showControls: !this.state.showControls});
    }

    formatTime(time = 0) {
        time = Math.min(
            Math.max(time, 0),
            this.state.duration
        );

        const formattedMinutes = _.padStart( Math.floor( time / 60 ).toFixed( 0 ), 2, 0 );
        const formattedSeconds = _.padStart( Math.floor( time % 60 ).toFixed( 0 ), 2 , 0 );

        return `${ formattedMinutes }:${ formattedSeconds }`;
    }

    setSeekerPosition(position = 0) {
        let state = this.state;
        position = this.constrainToSeekerMinMax(position);

        state.seekerFillWidth = position;
        state.seekerPosition = position;

        if (!state.seeking) {
            state.seekerOffset = position
        };

        this.setState(state);
    }

    constrainToSeekerMinMax(val = 0) {
        if (val <= 0) {
            return 0;
        }
        else if (val >= this.seekerWidth) {
            return this.seekerWidth;
        }
        return val;
    }

    calculateSeekerPosition() {
        const percent = this.state.currentTime / this.state.duration;
        return this.seekerWidth * percent;
    }

    calculateTimeFromSeekerPosition() {
        const percent = this.state.seekerPosition / this.seekerWidth;
        return this.state.duration * percent;
    }

    seekTo(time = 0) {
        this.player.seek( time );
        this.setState({currentTime: time});
    }

    initSeekPanResponder() {
        this.seekPanResponder = PanResponder.create({

            // Ask to be the responder.
            onStartShouldSetPanResponder: ( evt, gestureState ) => true,
            onMoveShouldSetPanResponder: ( evt, gestureState ) => true,

            /**
             * When we start the pan tell the machine that we're
             * seeking. This stops it from updating the seekbar
             * position in the onProgress listener.
             */
            onPanResponderGrant: ( evt, gestureState ) => {
                let state = this.state;
                //this.clearControlTimeout();
                state.seeking = true;
                this.setState(state);
            },

            /**
             * When panning, update the seekbar position, duh.
             */
            onPanResponderMove: ( evt, gestureState ) => {
                const position = this.state.seekerOffset + gestureState.dx;
                this.setSeekerPosition(position);
            },

            /**
             * On release we update the time and seek to it in the video.
             * If you seek to the end of the video we fire the
             * onEnd callback
             */
            onPanResponderRelease: ( evt, gestureState ) => {
                const time = this.calculateTimeFromSeekerPosition();
                let state = this.state;
                if ( time >= state.duration && ! state.loading ) {
                    state.paused = true;
                    this._onEnd();
                } else {
                    this.seekTo(time);
                    //this.setControlTimeout();
                    state.seeking = false;
                }
                this.setState( state );
            }
        });
    }

    renderSeekbar() {

        return (
            <View style={ styles.seekbarContainer }>
                <View
                    style={ styles.seekbarTrack }
                    onLayout={ event => this.seekerWidth = event.nativeEvent.layout.width }
                >
                    <View style={[
                        styles.seekbarFill,
                        {
                            width: this.state.seekerFillWidth,
                            backgroundColor: this.props.seekColor || '#FFF'
                        }
                    ]}/>
                </View>
                <View
                    style={[
                        styles.seekbarHandle,
                        { left: this.state.seekerPosition }
                    ]}
                    { ...this.seekPanResponder.panHandlers }
                >
                    <View style={[
                        styles.seekbarCircle,
                        { backgroundColor: '#FFF' } ]}
                    />
                </View>
            </View>
        );
    }


    render() {
        return (
            <TouchableWithoutFeedback
                onPress={ this._onScreenTouch.bind(this) }
                style={styles.container}
            >
                <View style={styles.container}>
                    <Video
                        { ...this.props }

                        ref={ref => {
                            this.player = ref;
                        }}

                        resizeMode={this.state.resizeMode}
                        volume={this.state.volume}
                        muted={this.state.muted}
                        rate={this.rates[this.state.rate]}
                        paused={this.state.paused}

                        //onLoadStart={this.onLoadStart}
                        onProgress={this._onProgress}
                        //onError={this.onError}
                        onLoad={this._onLoad}
                        onEnd={this._onEnd}

                        style={styles.backgroundVideo}
                    />
                    <View style={styles.topControls}>
                        <TouchableOpacity onPress={this._onBack} style={styles.btnControl}>
                            <Icon name={"angle-left"} size={18} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.time}>{this.props.title}</Text>
                        <TouchableOpacity onPress={this._onChangeRate} style={styles.btnControl}>
                            <Text style={styles.iconText}>{`${this.rates[this.state.rate]}x`}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.bottomControls}>
                        {this.renderSeekbar()}
                        <View style={styles.bottomControlsButtons}>
                            <Text style={styles.time}>{this.formatTime(this.state.currentTime)}</Text>
                            <TouchableOpacity onPress={this._onTogglePaused} style={styles.btnControl}>
                                <Icon name={this.state.paused ? "play" : "pause"} size={18} color="#fff" />
                            </TouchableOpacity>
                            <Text style={styles.time}>{this.formatTime(this.state.duration)}</Text>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

VideoPlayer.defaultProps = {
    resizeMode:                     'contain',
    paused:                         false,
    muted:                          false,
    title:                          '',
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000',
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'space-between',
    },
    btnControl: {
        paddingHorizontal: 5
    },
    time:{
        color: '#FFF',
        fontSize: 16,
    },
    iconText:{
        color: '#FFF',
        fontSize: 16,
    },
    backgroundVideo: {
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
    topControls: {
        flex:1,
        flexDirection:'row',
        justifyContent: 'space-between',
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: 40,
        padding:10, 
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    bottomControls: {
        flex:1,
        flexDirection:'column',
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: 70,
        padding:10, 
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    bottomControlsButtons: {
        flex:1,
        flexDirection:'row',
        justifyContent: 'space-between',
    },
    seekbarContainer: {
        alignSelf: 'stretch',
        height: 28,
        marginLeft: 10,
        marginRight: 10
    },
    seekbarTrack: {
        backgroundColor: '#666',
        height: 1,
        position: 'relative',
        top: 8,
        width: '100%'
    },
    seekbarFill: {
        backgroundColor: '#FFF',
        height: 1,
        width: '100%'
    },
    seekbarHandle: {
        position: 'absolute',
        marginLeft: -7,
        height: 28,
        width: 28,
    },
    seekbarCircle: {
        padding:5,
        borderRadius: 16,
        position: 'relative',
        top: 0, left: 8,
        height: 16,
        width: 16,
    },
});
