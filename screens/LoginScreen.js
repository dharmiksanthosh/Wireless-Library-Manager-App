import * as React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, StyleSheet, Platform, Keyboard } from 'react-native';
import firebase from 'firebase';
import Header from './components/Header'

export default class LoginScreen extends React.Component {
    constructor(){
        super();
        this.state={
            password:'',
            email:''
        }
    }
    login = async (email,password)=>{
        if (email && password) {
            try {
                const response = await firebase.auth().signInWithEmailAndPassword(email,password)
                if (response) {
                    this.props.navigation.navigate('Transaction');
                }
            } catch (error) {
                switch (error.code) {
                    case 'auth/user-not-found':
                            Alert.alert('User does not exists');
                            console.log('User does not exists');
                        break;
                    case 'auth/invaild-email':
                            Alert.alert('incorrect email or password');
                            console.log('incorrect email or password');
                        break;
                    default:

                        break;
                }
            }
        } else {
            Alert.alert('Enter Email and Password')
        }
    }
    render(){
        return(
            <KeyboardAvoidingView behavior={Platform.OS === "android" ? "padding" : "height"} style={styles.container}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View>
                    <Header/>
                    <View>
                        <Image style={{width:170,height:170,margin:30,marginBottom:50,alignSelf:'center'}} source={require('../assets/book.png')}/>
                    </View>
                    <View styles={styles.inputView}>
                        <View style={{flexDirection:'row',alignSelf:'center',marginBottom:15}}>
                            <Image style={{width:25,height:20,marginRight:-32,marginTop:7}} source={require('../assets/mail.png')}/>
                            <TextInput
                                style={styles.input}
                                placeholder="abc@example.com"
                                keyboardType="email-address"
                                onChangeText={(text)=>{this.setState({email:text})}}/>
                        </View>
                        <View style={{flexDirection:'row',alignSelf:'center'}}>
                            <Image style={{width:20,height:20,marginRight:-28,marginTop:5}} source={require('../assets/pw.png')}/>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Password"
                                secureTextEntry={true}
                                onChangeText={(text)=>{this.setState({password:text})}}/>
                        </View>
                    </View>
                    <View>
                        <TouchableOpacity
                            style={styles.login}
                            onPress={()=>{
                                this.login(this.state.email,this.state.password)
                            }}>
                                <Text style={styles.loginText}>Login</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        );
    }
} 

const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    input: {
        width:250,
        height:35,
        borderWidth:2,
        borderRadius:10,
        paddingLeft:35
    },
    login: {
        height:30,
        width:90,
        borderWidth:2,
        borderRadius:50,
        margin:20,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#fa8828',
        alignSelf: 'center'
    }
  });