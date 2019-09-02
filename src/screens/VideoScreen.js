import React, { Component } from 'react'
import { StatusBar} from 'react-native'
import VideoPlayer from '../components/VideoPlayer'
import { Actions } from 'react-native-router-flux';  
import Colors from '../assets/Colors'; 

export default class VideoScreen extends Component {
    render() {
        return (
            <React.Fragment>
                <StatusBar backgroundColor={Colors.black} barStyle="light-content" />
                <VideoPlayer source={{uri: this.props.src}} title={this.props.title} onBack={() => Actions.pop()}/>
            </React.Fragment>
            
        )
    }
}