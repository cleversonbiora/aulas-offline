import React, {Fragment,Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';
import ApiService from '../services/ApiService';
import UsuarioRepository from '../repositories/UsuarioRepository';
import ListItem from '../components/ListItem';
import { Actions } from 'react-native-router-flux';   
import Colors from '../assets/Colors';   
import defaultStyles from '../assets/Styles'
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Home extends Component {
  constructor(props){
    super(props);
    this.apiService = new ApiService();
    this.usuarioRepository = new UsuarioRepository();
    this.state = {
      cursos: [],
      usuario:null
    }
    this.loader();
  }

  loader = async () => {
    var usuario = await this.usuarioRepository.get();
    if(!usuario){
      Actions.login();
    }
    this.setState({usuario});
    var cursosRes = await this.apiService.getCursos(usuario.token);
    this.setState({cursos: cursosRes.cursos});
  }

  render() {
    const cursos = this.state.cursos.map(curso => <ListItem key={curso.idCurso} onPress={() => Actions.curso({ title: curso.nome, idUsuarioCurso:curso.idUsuarioCurso, idCurso:curso.idCurso})} nome={curso.nome}/>)
    return (
      <View style={defaultStyles.outContainer}>
      <StatusBar backgroundColor={Colors.navBar} barStyle="light-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic">
                <View style={defaultStyles.container}>
                        {!this.state.usuario
                        ?
                            <View>
                                <Text style={defaultStyles.title}>Carregando...</Text>
                            </View>
                        :
                            <View>
                                <Text style={defaultStyles.title}>Ola, {this.state.usuario.nome}</Text> 
                                {cursos}
                            </View>
                        }
                </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    )
  }
}
