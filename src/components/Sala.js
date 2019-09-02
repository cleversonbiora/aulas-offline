import React, { Component } from 'react'
import { Text, View, StyleSheet,TouchableOpacity } from 'react-native'
import ApiService from '../services/ApiService';
import UsuarioRepository from '../repositories/UsuarioRepository';
import Videos from './Videos';
import Colors from '../assets/Colors'; 

export default class Sala extends Component {    
    constructor(props){
        super(props);
        this.apiService = new ApiService();
        this.usuarioRepository = new UsuarioRepository();
        this.state = {
            rotas: [],
            loaded: false,
            show: true
        }
    }

    onPress = () => {
        if(!this.state.loaded){
            this.loader();
        }else{
            this.setState({show:!this.state.show});
        }
    }

    loader = async () => {
        var usuario = await this.usuarioRepository.get();
        var salaRes = await this.apiService.getSala(this.props.sala.id, this.props.sala.idSalaVirtualOferta, this.props.idSalaVirtualOfertaAproveitamento, usuario.token);
        var rotas = [];
        for (const element of salaRes.salaVirtualAtividades) {
            var rotasRes = await this.apiService.getRotas(element.idAtividade, usuario.token);
            rotas = [...rotas, ...rotasRes.atividadeItemAprendizagens];
        }
        this.setState({rotas, loaded:true});
    }
    
    render() {
        const rotas = this.state.rotas.map(rota => <Videos rota={rota} />)
        //console.log(this.state.rotas);
        //const rotas = this.state.rotas.map(rota => <Text>{rota.nomeAcao}</Text>)
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => this.onPress()}>
                    <Text style={styles.title}>{this.props.sala.nome}</Text>
                </TouchableOpacity>
                {this.state.show && rotas}
            </View>
        )
    }
}

const styles = StyleSheet.create({  
    title:{
      color:Colors.white,
      fontSize:18,
    },
    text:{
      color:Colors.white,
      fontSize:14,
    },
    container: {
        flex: 1,
        padding: 10,
        marginTop:10,
        backgroundColor: Colors.lightBlue,
        justifyContent: 'flex-start',
    }
});