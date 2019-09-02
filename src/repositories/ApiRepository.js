import AsyncStorage from '@react-native-community/async-storage';
const API_KEY = 'url:';
export default class ApiRepository {
    static setItem = async (url,json) => { 
        await AsyncStorage.setItem(`${API_KEY}${url}`,JSON.stringify(json));
    }
    static getItem = async (url) => { 
        var json = await AsyncStorage.getItem(`${API_KEY}${url}`);
        if(!json){
            return null;
        }
        return JSON.parse(json);
    }

    static setText = async (url,text) => { 
        await AsyncStorage.setItem(`${API_KEY}${url}`,text);
    }
    static getText = async (url) => { 
        return await AsyncStorage.getItem(`${API_KEY}${url}`);
    }
}
