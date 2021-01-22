import * as React from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList } from 'react-native';
import firebase from 'firebase';
import db from '../config';

export default class Search extends React.Component {
    constructor(props){
        super(props);
        this.state={
            allTransactions: [],
            lastVisibleTransaction: null
        }
    }
    componentDidMount = async () =>{
        const query = await db.collection('transaction').limit(7).get();
        query.docs.map((doc)=>{
            this.setState({
                allTransactions: [...this.state.allTransactions,doc.data()],
                lastVisibleTransaction: doc
            })
        })
    }
    fetchMoreTransaction = async() =>{
        const query = await db.collection('transaction').startAfter(this.state.lastVisibleTransaction).limit(7).get();
        query.docs.map((doc)=>{
            this.setState({
                allTransactions: [...this.state.allTransactions,doc.data()],
                lastVisibleTransaction: doc
            })
        })
    }
    render(){
        return(
            /* {<ScrollView>
                {this.state.allTransactions.map((tra,index)=>{
                    return(
                        <View
                            key={index}
                            style={{borderBottomWidth:3}}>
                            <Text>{"Book Id: "+tra.bookId}</Text>
                            <Text>{"Student Id: "+tra.studentId}</Text>
                            <Text>{"Transaction Type: "+tra.transactionType}</Text>
                            <Text>{"Date: "+tra.date.toDate()}</Text>
                        </View>
                    )
                })}
            </ScrollView> 
            } */
            <FlatList
                data={this.state.allTransactions}
                renderItem={({item})=>(
                    <View
                        style={{borderBottomWidth:3}}>
                        <Text>{"Book Id: "+item.bookId}</Text>
                        <Text>{"Student Id: "+item.studentId}</Text>
                        <Text>{"Transaction Type: "+item.transactionType}</Text>
                        <Text>{"Date: "+item.date.toDate()}</Text>
                    </View>
                )}
                keyExtractor={(index)=>index.toString()}
                onEndReached={this.fetchMoreTransaction}
                onEndReachedThreshold={0.5}>

            </FlatList>
        );
    }
}
