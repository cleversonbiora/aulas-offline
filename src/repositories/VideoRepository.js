import AsyncStorage from '@react-native-community/async-storage';
const CONFIG_KEY = 'videoConfig';
import RNFetchBlob from 'rn-fetch-blob';
export default class VideoRepository {

    dirs = RNFetchBlob.fs.dirs;

    exists = async (video) => {
        video = this._getLocalName(video);
        try {
            return await RNFetchBlob.fs.exists(video)
        } catch (error) {
            alert('Falha ao remover');
        }
    }

    download = async (video) =>{
        let videopath = this._getLocalName(video);
        try {
            let res = await RNFetchBlob
            .config({
              fileCache : false,
              path : videopath,        
              addAndroidDownloads : {
                notification : true,
                title : 'Download Concluidos',
                description : video,
                mime : 'video/mp4',
                mediaScannable : true,
            }
            })
            .fetch('GET', video);
            console.log('The file saved to ', res.path())  
        } catch (error) {
            alert('Falha no download');
        }
    }

    delete = async (video) => {
        video = this._getLocalName(video);
        console.log(video);
        try {
            await RNFetchBlob.fs.unlink(video);
            alert('Video removido');
        } catch (error) {
            alert('Falha ao remover');
        }
    }
    getFilePath = (video) => {
        video = video.replace('http://','');
        return `file://${this.dirs.DocumentDir}/${video}`;
    }

    _getLocalName = (video) => {
        video = video.replace('http://','');
        return `${this.dirs.DocumentDir}/${video}`;
    }

    //Config
    setConfig = async (config) => { 
        await AsyncStorage.setItem(CONFIG_KEY,JSON.stringify(config));
    }
    getConfig = async () => { 
        var config = await AsyncStorage.getItem(CONFIG_KEY);
        console.log(config);
        if(!config){
            config = '{"rate": 0}';
        }
        return JSON.parse(config);
    }
}
