import React, { Component } from 'react'
import { Text, View, SafeAreaView, ScrollView } from 'react-native'
import ApiService from '../services/ApiService';
import UsuarioRepository from '../repositories/UsuarioRepository';
import { Actions } from 'react-native-router-flux';   
import Sala from '../components/Sala';
import defaultStyles from '../assets/Styles'  

export default class Disciplina extends Component {
    constructor(props){
        super(props);
        this.apiService = new ApiService();
        this.usuarioRepository = new UsuarioRepository();
        this.state = {
          salas: [],
        }
        this.loader();
      }
    
      loader = async () => {
        var usuario = await this.usuarioRepository.get();
        var salasRes = await this.apiService.getSalas(this.props.cId, this.props.idSalaVirtualOfertaAtual, this.props.idSalaVirtualOfertaAproveitamento, usuario.token);
        this.setState({salas: salasRes.salaVirtualEstruturas});
      }
    
    
      render() {
        const salas = this.state.salas.map(sala => <Sala key={sala.id} sala={sala} idSalaVirtualOfertaAproveitamento={this.props.idSalaVirtualOfertaAproveitamento}/>)
        return (
          <View style={defaultStyles.outContainer}>
            <SafeAreaView>
              <ScrollView
                  contentInsetAdjustmentBehavior="automatic">
                      <View style={defaultStyles.container}>
                          {salas}
                      </View>
              </ScrollView>
            </SafeAreaView>
          </View>
        )
    }
}
