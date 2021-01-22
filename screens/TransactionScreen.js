import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, Image, TextInput, Alert, ToastAndroid, KeyboardAvoidingView, Keyboard, Platform } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';
import * as firebase from 'firebase'
import db from '../config';

export default class TransactionScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      hasCameraPerm: null,
      scanned: false,
      scanData: '',
      buttonState: 'normal',
      sstudentId: '',
      sbookId: '',
      transactionMessage: ''
    };
  }
  getCameraPermission = async (id) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPerm: status === 'granted', //the granted is true the user has aalowed or false if the user has denied
      buttonState: id,
      scanned: false
    });
  };
  handleBarCodeScan = async ({ type, data }) => {
    if (this.state.buttonState === 'bookId'){
      this.setState({
        scanned: true,
        sbookId: data,
        buttonState: 'normal',
      });
    } else if (this.state.buttonState === 'stuId'){
      this.setState({
        scanned: true,
        sstudentId: data,
        buttonState: 'normal',
      });
    }
  };
  initiateBookIssue = async () => {
    db.collection('transaction')
      .add({
        'studentId': this.state.sstudentId,
        'bookId': this.state.sbookId,
        'date': firebase.firestore.Timestamp.now().toDate(),
        'transactionType': 'issue'
      })
    db.collection('Books')
    .doc('bca001')
    .update({
      availablity: false
    })
    db.collection('Students')
    .doc('stu001')
    .update({
      noofbookissued: firebase.firestore.FieldValue.increment(1)
    })
    Alert.alert('Book Issued');
    this.setState({
      sstudentId: '',
      sbookId: ''
    })
  }
  initiateBookReturn = async () => {
    db.collection('transaction')
      .add({
        'studentId': this.state.sstudentId,
        'bookId': this.state.sbookId,
        'date': firebase.firestore.Timestamp.now().toDate(),
        'transactionType': 'return'
      })
    db.collection('Books')
    .doc('bca001')
    .update({
      availablity: true
    })
    db.collection('Students')
    .doc('stu001')
    .update({
      noofbookissued: firebase.firestore.FieldValue.increment(-1)
    })
    Alert.alert('Book Return');
    this.setState({
      sstudentId: '',
      sbookId: ''
    })
  }
  studentEligiliblityForIssue =  async () => {
    const sturef = await db.collection('Students')
      .where("id",'==',this.state.sstudentId)
      .get()
    var isStudentEligible = ""
    if(sturef.docs.length==0){
      this.setState({
        sstudentId: '',
        sbookId: ''
      })
      isStudentEligible = false;
      Alert.alert('This Student Id does not exit in our Database');
    } else {
      sturef.docs.map((doc) =>{
        var student = doc.data();
        if (student.noofbookissued < 2){
          isStudentEligible = true;
        } else {
          this.setState({
            sstudentId: '',
            sbookId: ''
          })
          isStudentEligible = false;
          Alert.alert('This Student has Already issued 2 Books');
        }
      })
    }
    return isStudentEligible
  }
  studentEligiliblityForReturn = async () =>{
    const ref = await db.collection("transaction")
      .where("bookId",'==',this.state.sbookId).limit(1)
      .get();
      var isStudentEligible = '';
      ref.docs.map((doc) =>{
        var lastTra = doc.data();
        if (lastTra.studentId === this.state.sstudentId) {
          isStudentEligible = true;
        } else {
          this.setState({
            sstudentId: '',
            sbookId: ''
          })
          isStudentEligible = false;
          Alert.alert('This Book was not by this student');
        }
      })
      return isStudentEligible
  }
  bookEligiliblityForIssue = async () =>{
    const bookref = await db.collection("Books")
      .where("bookId",'==',this.state.sbookId)
      .get();
    var traType = '';
    if (bookref.docs.length == 0) {
      traType = false;
    } else {
      bookref.docs.map((doc) => {
        var book = doc.data();
        if (book.availablity) {
          traType = 'issue'
        } else {
          traType = 'return'
        }
      })
    }
    return traType
  }
  handleTransaction = async () => {
    // we are going to verify if student is eligible for book issue or return or none
    // we are also gonna check if student id exit in database
    // we will decide the status, the status will be issue if number of book iued is les than 2
    // status will again issue if book is available
    // status will be return if the last transaction shows
    var transactionType = await this.bookEligiliblityForIssue();
    if (!transactionType){
      Alert.alert('The Book does not exist in out database')
      this.setState({
        sstudentId: '',
        sbookId: ''
      })
    } else if (transactionType === 'issue') {
      var isStudentEligible = await this.studentEligiliblityForIssue();
      if (isStudentEligible) {
        this.initiateBookIssue();
        Alert.alert('Book Issued To the Student');
      }
    } else {
      var isStudentEligible = await this.studentEligiliblityForReturn();
      if (isStudentEligible) {
        this.initiateBookReturn();
        Alert.alert('Book Retuned To the Library');
      }
    }
  };
  render() {
    const hasCamPerm = this.state.hasCameraPerm;
    const scanned = this.state.scanned;
    const buttonState = this.state.buttonState;
    if (buttonState != 'normal' && hasCamPerm) {
      return (
        <BarCodeScanner
          style={StyleSheet.absoluteFillObject}
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScan}
        />
      );
    } else if (buttonState === 'normal') {
      return (
        <KeyboardAvoidingView behavior={Platform.OS === "android" ? "padding" : "height"} style={styles.container}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ alignItems: 'center' }}>
              <View>
                <Image style={{width:150,height:150,margin:30,marginBottom:50}} source={require('../assets/book.png')}/>
              </View>
              <View styles={styles.inputView}>
                <TextInput
                  style={styles.input}
                  placeholder={'Book ID'}
                  onChangeText={(text)=>{this.setState({sbookId:text})}}
                  value={this.state.sbookId}/>
                <TouchableOpacity
                  style={styles.scanbutton}
                  onPress={()=>{
                    this.getCameraPermission('bookId')
                  }}>
                  <Text style={styles.scantext}>Scan</Text>
                </TouchableOpacity>
              </View>
              <View styles={styles.inputView}>
                <TextInput
                  style={styles.input}
                  placeholder={'Student ID'}
                  onChangeText={(text)=>{this.setState({sstudentId:text})}}
                  value={this.state.sstudentId}/>
                <TouchableOpacity
                  style={styles.scanbutton}
                  onPress={()=>{
                    this.getCameraPermission('stuId')
                  }}>
                  <Text style={styles.scantext}>Scan</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.submit}
                onPress={async () =>{this.handleTransaction();this.setState({sbookId:'',sstudentId:''})}}>
                  <Text style={styles.submitText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1
  },
  inputView: {
    flexDirection:'row'
  },
  scanbutton: {
    backgroundColor: '#093869',
    padding:5,
    width:50,
    height:50,
    marginTop:-50,
    marginLeft:200,
    marginBottom:10,
    alignItems:'center',
    justifyContent:'center'
  },
  scantext: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  displaytext: {
    margin: 20,
    fontSize: 20,
  },
  input: {
    width:200,
    height:50,
    borderWidth:2
  },
  submit: {
    alignSelf:'center',
    backgroundColor:'#49C593',
    width:100,
    height:50
  },
  submitText:{
    padding:10,
    textAlign:'center',
    fontSize:20
  }
});
