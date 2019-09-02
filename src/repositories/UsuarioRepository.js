import AsyncStorage from '@react-native-community/async-storage';
const USUARIO_KEY = 'usuario';
export default class UsuarioRepository {
    insert = async (usuario) => { 
        AsyncStorage.setItem(USUARIO_KEY,JSON.stringify(usuario));
    }
    get = async () => { 
        var user = await AsyncStorage.getItem(USUARIO_KEY);
        if(!user){
            return null;
        }
        return JSON.parse(user);
    }
    getToken = async () => { 
        var usuario = JSON.parse(await AsyncStorage.getItem(USUARIO_KEY));
        if(!usuario){
            return null;
        }
        return usuario.token;
    }
    remove = async () => { 
        await AsyncStorage.removeItem(USUARIO_KEY);
    }
}
