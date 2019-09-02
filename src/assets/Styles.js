import {
    StyleSheet,
    Dimensions
  } from 'react-native';
import Colors from './Colors'

export default Styles = StyleSheet.create({  
    outContainer:{
        backgroundColor: Colors.backgroud,
        height:  Dimensions.get('screen').height
    },
    title:{
      color:Colors.blue,
      fontWeight:'700',
      fontSize:18,
    },
    text:{
      color:Colors.black,
      fontSize:14,
    },
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: Colors.backgroud,
        justifyContent: 'flex-start',
    }
});