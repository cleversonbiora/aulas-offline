import React, { Component } from 'react'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import ApiService from '../services/ApiService';
import UsuarioRepository from '../repositories/UsuarioRepository';
import { Actions } from 'react-native-router-flux';  
import Colors from '../assets/Colors'; 
import Video from './Video';

export default class Videos extends Component {
    constructor(props){
        super(props);
        this.apiService = new ApiService();
        this.usuarioRepository = new UsuarioRepository();
        this.state = {
            videos: [],
            video:'',
            title: ''
        }
        this.loader();
    }

    loader = async () => {
        var usuario = await this.usuarioRepository.get();
        if(this.props.rota.itemAprendizagemEtiquetas){
            var links = this.props.rota.itemAprendizagemEtiquetas.filter(item => {
                if(!item.valorEtiqueta)
                    return false;
                if(item.valorEtiqueta.indexOf('conteudosdigitais.uninter.com') != -1)
                    return true;
                return false;
            });
            if(links.length > 0){
                var videosRes = await this.apiService.getVideos(links[0].valorEtiqueta, usuario.token);
                if(videosRes.indexOf('resultvideos') != -1)
                    this.setState({videos: videosRes.split(/\r?\n/).filter(item => {
                        if(item.indexOf('resultvideos') != -1)
                            return false;
                        return true;
                    })});
            }
        }
    }
    
    render() {
        const videos = this.state.videos.map((video, index) => <Video key={video} video={video} index={index}/>)
        return (
            <View>
                {videos}
            </View>
        )
    }
}
