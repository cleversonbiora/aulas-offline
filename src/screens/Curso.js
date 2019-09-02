import React, { Component } from 'react'
import { Text, View, SafeAreaView, ScrollView } from 'react-native'
import ApiService from '../services/ApiService';
import UsuarioRepository from '../repositories/UsuarioRepository';
import ListItem from '../components/ListItem';
import { Actions } from 'react-native-router-flux'; 
import defaultStyles from '../assets/Styles'  

export default class Curso extends Component {
    constructor(props){
        super(props);
        this.apiService = new ApiService();
        this.usuarioRepository = new UsuarioRepository();
        this.state = {
          disciplinas: [],
        }
        this.loader();
      }
    
      loader = async () => {
        var usuario = await this.usuarioRepository.get();
        var disciplinasRes = await this.apiService.getDisciplinas(this.props.idCurso, this.props.idUsuarioCurso, usuario.token);
        this.setState({disciplinas: disciplinasRes.salaVirtuais});
      }
    
    
      render() {
        const disciplinas = this.state.disciplinas.map(disciplina => <ListItem key={disciplina.id} inative={disciplina.statusConcluido} onPress={() => Actions.disciplina({title:disciplina.nome, cId:disciplina.cId, idSalaVirtualOfertaAtual:disciplina.idSalaVirtualOfertaAtual,idSalaVirtualOfertaAproveitamento:disciplina.idSalaVirtualOfertaAproveitamento})} nome={disciplina.nome}/>)
        return (
            <View style={defaultStyles.outContainer}>
              <SafeAreaView>
                <ScrollView 
                    contentInsetAdjustmentBehavior="automatic">
                        <View style={defaultStyles.container}>
                            <Text style={defaultStyles.title}>Disciplinas </Text>
                            {disciplinas}
                        </View>
                </ScrollView>
              </SafeAreaView>
            </View>
        )
    }
}
