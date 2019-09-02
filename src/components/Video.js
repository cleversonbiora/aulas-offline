import React, { Component } from 'react'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import { Actions } from 'react-native-router-flux';  
import Colors from '../assets/Colors'; 
import Icon from 'react-native-vector-icons/FontAwesome';
import VideoRepository from '../repositories/VideoRepository'

export default class Video extends Component {
    constructor(props){
        super(props);
        this.videoRepository = new VideoRepository();
        this.state = {
            downloaded: false,
            video: props.video
        }
        this.loader();
    }

    async loader(){
        let exists = await this.videoRepository.exists(this.props.video);
        if(exists){
            let videopath = await this.videoRepository.getFilePath(this.props.video)
            this.setState({video: videopath});
        }
        this.setState({downloaded: exists});
    }

    _onToggleDownload = async () => {
        if(this.state.downloaded){
            await this.videoRepository.delete(this.props.video);
            this.setState({video: this.props.video});
        }else{
            await this.videoRepository.download(this.props.video);
            let videopath = await this.videoRepository.getFilePath(this.props.video)
            this.setState({video: videopath});
        }
        this.setState({downloaded:!this.state.downloaded});
    }

    requestFolderPermission = async () => {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the Folder');
          } else {
            console.log('Folder permission denied');
          }
          const granted2 = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
          if (granted2 === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the Folder');
          } else {
            console.log('Folder permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }

    render() {
        return (
            <TouchableOpacity onPress={() => Actions.videoScreen({src:this.state.video, title: `Video ${(this.props.index + 1)}`})}>
                <View style={styles.container}>
                    <Text style={styles.text}>Video {(this.props.index + 1)}</Text>
                    <TouchableOpacity onPress={this._onToggleDownload}>
                        <Icon name={this.state.downloaded ? "times" : "download"} size={20} color={Colors.blue} style={styles.btnControl}/>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({  
    title:{
      color:Colors.white,
      fontSize:18,
    },
    text:{
      color:Colors.blue,
      fontSize:14,
    },
    btnControl: {
        padding: 5,
    },
    container: {
        flexDirection:'row',
        justifyContent: 'space-between',
        padding: 10,
        marginTop: 5,
        backgroundColor:Colors.white
    }
});