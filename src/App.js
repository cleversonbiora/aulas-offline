import React, {Component} from 'react';
import {BackHandler, StyleSheet,TouchableWithoutFeedback,Text} from 'react-native';
import {
  Curso,
  Home,
  Login,
  Disciplina,
  VideoScreen
} from './screens';
import { Router, Scene, Tabs, Actions } from 'react-native-router-flux';
import Colors from './assets/Colors'; 
import Icon from 'react-native-vector-icons/FontAwesome';
import UsuarioRepository from './repositories/UsuarioRepository';
export default class App extends Component {
  constructor(props){
    super(props);
    this.usuarioRepository = new UsuarioRepository();
  }
  componentDidMount() {
      BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  onBackPress = () => {
    if (Actions.state.index === 0) {
      return false
    }
    Actions.pop();
    return true
  } 
  
  logOut = async () => {
    await this.usuarioRepository.remove();
    Actions.refresh();
    Actions.login();
  }

  render() {
    const logout = <TouchableWithoutFeedback onPress={this.logOut}>
                    <Icon name={"sign-out"} size={18} color="#FFF"  style={{padding:5, paddingRight:20}}/>
                  </TouchableWithoutFeedback>
    return (
      <Router navigationBarStyle={styles.navBar} titleStyle={styles.navTitle} tintColor='#fff' >
        <Scene key="root" hideNavBar>
          <Scene key="main" hideNavBar panHandlers={null}> 
              <Scene key="home" title="Bem Vindo" component={Home} hideNavBar={false} initial type="reset"
                  right={logout}/>
              <Scene key="curso" title="Curso" component={Curso} hideNavBar={false} back/>
              <Scene key="disciplina" title="Disciplina" component={Disciplina} hideNavBar={false} back/>
              <Scene key="videoScreen" title="Video Player" component={VideoScreen} hideNavBar/>
          </Scene>
          <Scene key="login" component={Login} type="reset"/>
        </Scene>
      </Router>
    )
  }
}

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: Colors.navBar, 
  },
  navTitle: {
    color: 'white', 
  }
})