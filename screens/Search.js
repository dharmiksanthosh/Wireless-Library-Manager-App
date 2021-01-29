import * as React from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, FlatList, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard } from 'react-native';
import firebase from 'firebase';
import db from '../config';
import Header from './components/Header'

var width = window.innerWidth, height = window.innerHeight; 
var iw = width/8*7
var iww = iw

export default class Search extends React.Component {
    constructor(props){
        super(props);
        this.state={
            allTransactions: [],
            lastVisibleTransaction: null,
            search: '',
        }
    }
    fetchMoreTransaction = async() =>{
        console.log(this.state.search)
        var text = this.state.search.toUpperCase();
        var inputText = text.split("")
        if (inputText[0].toUpperCase() === 'B'){
            const transac = await db.collection('transaction')
                .startAfter(this.state.lastVisibleTransaction)
                .limit(7)
                .get()
            transac.docs.map((doc)=>{
                this.setState({
                    allTransactions: [...this.state.allTransactions,doc.data()],
                    lastVisibleTransaction: doc
                })
            })
        } else if (inputText[0].toUpperCase() === 'S'){
            const transac = await db.collection('transaction')
                .startAfter(this.state.lastVisibleTransaction)
                .limit(7)
                .get()
            transac.docs.map((doc)=>{
                this.setState({
                    allTransactions: [...this.state.allTransactions,doc.data()],
                    lastVisibleTransaction: doc
                })
            })
        }
    }
    searchTransaction = async (text) =>{
        this.setState({allTransactions:[]})
        var inputText = text.split("")
        if (inputText[0] === "b"){
            const transac = await db.collection('transaction')
                .where('bookid','==',text)
                .get()
            transac.docs.map((doc)=>{
                this.setState({
                    allTransactions: [...this.state.allTransactions,doc.data()],
                    lastVisibleTransaction: doc
                })
            })
        } else if (inputText[0] === "s"){
            const transac = await db.collection('transaction')
                .where('studentId','==',text)
                .get()
            transac.docs.map((doc)=>{
                this.setState({
                    allTransactions: [...this.state.allTransactions,doc.data()],
                    lastVisibleTransaction: doc
                })
            })
        }
    }
    render(){
        return(
            <KeyboardAvoidingView behavior={Platform.OS === "android" ? "padding" : "height"} style={styles.container}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View>
                        <Header/>
                    <View>
                        <Image style={{width:150,height:150,margin:20,marginBottom:20,alignSelf:'center'}} source={require('../assets/search.png')}/>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Image style={{width:30,height:30,marginRight:-35,alignSelf:'center'}} source={require('../assets/searchic.png')}/>
                        <TextInput
                          style={styles.input}
                          placeholder={'Enter Book or Student ID'}
                          onChangeText={(text)=>{this.setState({search:text})}}/>
                        <TouchableOpacity
                          style={styles.scanbutton}
                          onPress={()=>{
                            this.searchTransaction(this.state.search);
                          }}>
                      <Text style={styles.scantext}>Search</Text>
                    </TouchableOpacity>
                    </View>
                        <FlatList
                            data={this.state.allTransactions}
                            renderItem={({item})=>(
                                <View
                                    style={{borderBottomWidth:3}}>
                                    <Text>{"Book Id: "+item.bookid}</Text>
                                    <Text>{"Student Id: "+item.studentId}</Text>
                                    <Text>{"Transaction Type: "+item.transactionType}</Text>
                                    <Text>{"Date: "+item.date.toDate()}</Text>
                                </View>
                            )}
                            keyExtractor={(index)=>index.toString()}
                            onEndReached={this.fetchMoreTransaction}
                            onEndReachedThreshold={0.5}>
                        </FlatList>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        );
    }
}
const styles = StyleSheet.create({
    scanbutton: {
        flex:2,
        height:50,
        backgroundColor:'#fa8828',
        alignItems:'center',
        justifyContent:'center',
        alignSelf: 'center',
        borderRadius:20,
        borderWidth:2
    },
    scantext: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
    },
    input: {
        flex:6,
        borderWidth:5,
        alignSelf: 'center',
        height:50,
        borderRadius: 20,
        borderColor:'#ddd',
        alignSelf: 'center',
        paddingLeft:35
    }
})