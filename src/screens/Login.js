import React, {Component} from 'react';
import {Platform, Text, View, Image, TextInput,TouchableOpacity,StatusBar,ActivityIndicator,KeyboardAvoidingView,StyleSheet} from 'react-native';
import ApiService from '../services/ApiService';
import UsuarioRepository from '../repositories/UsuarioRepository';
import { Actions } from 'react-native-router-flux';     
import Colors from '../assets/Colors'; 

export default class Login extends Component{
    constructor(props){
      super(props);
      this.apiService = new ApiService();
      this.usuarioRepository = new UsuarioRepository();
      this.state = {
        RU: '',
        Senha: '',
        Error: '',
        isLoading:false
      }
      
    }
  
    render() {
      return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Colors.navBar} barStyle="light-content" />
            <View style={styles.loginContainer}>
                {/* <Image resizeMode="contain" style={styles.logo} source={require('../assets/login_1600.png')} /> */}
            </View>
            <KeyboardAvoidingView
                      behavior={Platform.OS === "ios" ? "padding" : null}
                      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
                <View style={styles.formContainer}>
                <TextInput style = {styles.input} 
                              autoCapitalize="none" 
                              onSubmitEditing={() => this.passwordInput.focus()} 
                              autoCorrect={false} 
                              keyboardType='numeric' 
                              returnKeyType="next" 
                              placeholder='RU' 
                              value={this.state.RU}
                              onChangeText={(RU) => this.setState({RU})}
                              placeholderTextColor={Colors.gray}/>
  
                <TextInput style = {styles.input}   
                              returnKeyType="go" 
                              placeholder='Senha' 
                              autoCapitalize="none" 
                              ref={(input) => this.passwordInput = input}
                              onSubmitEditing={() => this.login()} 
                              placeholderTextColor={Colors.gray} 
                              value={this.state.Senha}
                              onChangeText={(Senha) => this.setState({Senha})}
                              secureTextEntry/>

                  {!this.state.isLoading && <TouchableOpacity style={styles.buttonContainer} 
                                    accessible={true}
                                    accessibilityRole="button"
                                    onPress={() => this.login()}>
                                    <View style={styles.buttonInner}>
                                      <Text  style={styles.buttonText}>ENTRAR</Text>
                                    </View>
                  </TouchableOpacity> }
                  {this.state.isLoading == true && <ActivityIndicator size="small" color={Colors.buttonText}  style={styles.buttonContainer} />}
                  {this.state.Error.length > 0 && <Text accessibilityLiveRegion="polite" style={styles.errorText}>{this.state.Error}</Text>}
              </View>
            </KeyboardAvoidingView>
        </View>
      );
    }
  
    login = async () => {
      this.setState({ isLoading: true });
      if(!this.state.RU){
        this.setState({Error:'Preencha o RU.'});
        this.setState({ isLoading: false });
        return;
      }
      if(!this.state.Senha){
        this.setState({Error:'Preencha a senha.'});
        this.setState({ isLoading: false });
        return;
      }
      try {
        var result =  await this.apiService.login(this.state.RU, this.state.Senha);
        var usuario = result.usuario;
        if(!usuario){
            this.setState({Error:'Usuário ou Senha inválidos.'});
            this.setState({ isLoading: false });
            return;
        }
        this.usuarioRepository.insert(usuario);
        Actions.main();
      } catch (error) {
        this.setState({Error:'Falha na autenticação.'});
        this.setState({ isLoading: false });
      }
    }
  }

  const paddinTop = (Platform.OS === 'ios') ? 40 : 0;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: paddinTop,
      backgroundColor: Colors.blue,
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    input:{
        width: 280,
        height: 40,
        backgroundColor: '#FFF',
        marginBottom: 25,
        padding: 10,
        color: Colors.gray,
        paddingLeft:15,
  
        fontWeight: '700',
    },
    buttonContainer:{
        width:280,
        height:50,
        backgroundColor: Colors.transparent,
        paddingVertical: 15,
        marginBottom: 10,
    },
    buttonInner:{
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    iconButton:{
      marginLeft: 10, 
      width: 40,
      height: 40
    },
    buttonText:{
        color: Colors.white,
        fontWeight: '700',
        fontSize:20,
        marginLeft:10
    },
    errorText:{
        backgroundColor: 'rgba(225,225,225,0.2)',
        width:280,
        color: '#fcb300',
        textAlign: 'center',
        padding:10,
        marginBottom: 10
    },
    loginContainer:{
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center'
    },
    logo: {
        position: 'absolute',
        width: 280,
    },
    formContainer: {
      backgroundColor: Colors.blue,
      marginBottom: 20
    }
  });