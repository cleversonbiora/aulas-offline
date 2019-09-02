import React, { Component } from 'react'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import Colors from '../assets/Colors'; 

export default class ListItem extends Component {
    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress}>
                <View style={(this.props.inative ? styles.containerInative : styles.container)}>
                    {this.props.nome && <Text style={styles.title}>{this.props.nome}</Text>}
                    {this.props.descricao && <Text style={styles.text}>{this.props.descricao}</Text>}
                </View>
            </TouchableOpacity>
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
    },
    containerInative: {
        flex: 1,
        padding: 10,
        marginTop:10,
        backgroundColor: Colors.softGray,
        justifyContent: 'flex-start',
    }
});