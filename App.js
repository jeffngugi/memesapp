import React, { useEffect } from 'react'
import {
  SafeAreaView,
  StyleSheet,
  ScrollView, 
  ToastAndroid,
  View,
  StatusBar,
  TouchableOpacity, TouchableWithoutFeedback,
  ActivityIndicator,
  Dimensions,
  Modal,
  FlatList,
  Alert,
  Clipboard,
  Easing, Linking, RefreshControl, Share, BackHandler, Vibration, Text as NativeText,
  ImageBackground, Image as NativeImage, Slider, CheckBox, PermissionsAndroid, TextInput, Picker, Switch, Animated
} from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import 'react-native-gesture-handler'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator, StackViewTransitionConfigs } from 'react-navigation-stack'
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'
var notifyBadge = 0;
const incBadge=(number)=>{
  notifyBadge = number
  console.log(notifyBadge)
}
var msgBadge = 0;
const incBadgem=(number)=>{
  msgBadge = number
  console.log(msgBadge)
}
import * as eva from '@eva-design/eva'
import { ApplicationProvider, Layout, Button, ButtonGroup,
   Input, Avatar, ListItem, Text, Select, SelectItem, IndexPath } from '@ui-kitten/components'
import {Card, Divider, Overlay,} from 'react-native-elements'  
import { copilot, walkthroughable, CopilotStep } from "react-native-copilot"
import Icon from 'react-native-vector-icons/Ionicons'
import Carousel from 'react-native-snap-carousel'
import Svg, {
 Path, Circle, Rect, G, Defs, Filter
} from 'react-native-svg'
import LinearGradient from 'react-native-linear-gradient'

import FastImage from 'react-native-fast-image'
import ScaledImage from './ScalableImage'
import {Image, Badge, ListItem as HeaderItem} from 'react-native-elements'

import io from 'socket.io-client'
import RNEventSource from 'react-native-event-source'


import {
  GiphyUi
} from 'react-native-giphy-ui'
import RNFS, { existsAssets } from 'react-native-fs'
import ImagePicker from 'react-native-image-picker'
import RNFetchBlob from 'rn-fetch-blob'
import { ScreenContainer } from 'react-native-screens'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { DynamicCollage, StaticCollage } from 'react-native-images-collage'
import { CropView } from 'react-native-image-crop-tools'
import ViewShot from 'react-native-view-shot'
import Gestures from 'react-native-easy-gestures'
import { DragTextEditor } from 'react-native-drag-text-editor'
import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas'
import EnIcon from 'react-native-vector-icons/Entypo'
import FIcon from 'react-native-vector-icons/Feather'
import CameraRoll from "@react-native-community/cameraroll"

import { GiftedChat, Bubble, Send, MessageStatusIndicator, Composer, MessageImage, Time } from 'react-native-gifted-chat'

import { GoogleSignin, GoogleSigninButton } from '@react-native-community/google-signin'
import auth from '@react-native-firebase/auth'
import PhoneInput from '@sesamsolutions/phone-input'
import AppIntroSlider from 'react-native-tutorial-slider'
import InAppReview from 'react-native-in-app-review'
import RNRestart from 'react-native-restart'
import messaging from '@react-native-firebase/messaging'
import ReceiveSharingIntent from 'react-native-receive-sharing-intent'
import {PowerTranslator, ProviderTypes, TranslatorConfiguration} from 'react-native-power-translator'
import SwitchWithIcons from "react-native-switch-with-icons"
import SplashScreen from 'react-native-splash-screen'

//screens
import Search from './screens/Search'
import Notifications from './screens/Notifications'
import Conversations from './screens/Conversations'
import Profile from './screens/Profile'

GiphyUi.configure('Qo2dUHUdpctbPSuRhDIile6Gr6cOn96H')


const CopilotText = walkthroughable(NativeText)
const CopilotView = walkthroughable(View)
const CopilotTouchableOpacity = walkthroughable(TouchableOpacity)

const slides = [
  {'name': 'create'},
  {'name': 'scroll', 'label': 'Scroll for next Meme'},
  {'name': 'remix', 'label': 'Swipe for Remixes'},
  {'name': 'story1', 'label': 'Tap for Story'},
  {'name': 'story2', 'label': 'Story Controls'},
  {'name': 'actions', 'label': 'Engage with Memes'},
  {'name': 'navigation'}
]

class Authentication extends React.Component{
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      title: 'Meeeme',
      headerTitleStyle: { textAlign: 'center', fontSize: 22, color: 'black'},
      headerStyle: { elevation:0, backgroundColor: '#FFD362' }
    }
  }
  state = {
    screen: 'default',
    dark: false,
    userData: [],
    signinPhone: '',
    toConfirm: false,
    phoneSigninData: [],
    confirmCode: '',
    phoneExists: false,
    enableResend: false,
    name: '',
    username: '',
    email: '',
    passcode: '',
    passcodetwo: '',
    newAvatar: '',
    isAvailableUser: false,
    emailCode: ''
  }
 componentDidMount(){
    StatusBar.setBackgroundColor("rgba(0,0,0,0)")
    StatusBar.setBarStyle("light-content")
    StatusBar.setTranslucent(true)
    try{
      GoogleSignin.configure({
        webClientId: '770404131223-rpqbq39sofbclcb8nc1vpf3vjj802a58.apps.googleusercontent.com',
        offlineAccess: true
      })
    } catch(e){
      console.log(e)
      ToastAndroid.show('Something Went wrong with Google', ToastAndroid.SHORT)
    }

        auth().onAuthStateChanged( (user) => {
          if (user) {
             if(Object.keys(this.state.phoneSigninData).length > 0)
              this.setState({screen: 'phoneLogin', phoneExists: true})
          } 
          else 
          {
            console.log('no login')
          }
      })
      BackHandler.addEventListener('hardwareBackPress', () => {
        if(this.state.screen != 'default'){
          this.setState({screen: 'default'})
        }else{
          this.props.navigation.goBack()
        }
        this.setState({username: '', name: '', passcode: '', passcodetwo: '', phone: ''})
        return true
      }) 
    this.fetchUser()  
    this.fetchTheme()
    
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', () => {
      if(this.state.screen != 'default'){
        this.setState({screen: 'default'})
      }else{
        this.props.navigation.goBack()
      }
      this.setState({username: '', name: '', passcode: '', passcodetwo: '', phone: ''})
      return true
    })
  }
  fetchTheme = async() => {
    try {
      var theme = await AsyncStorage.getItem('dark')
      if(theme == 'true') {
        this.setState({dark: true})
        this.props.navigation.setParams({darktheme: true})
      }else{
        this.setState({dark: false})
        this.props.navigation.setParams({darktheme: false})
      }
    } catch(er) {
      ToastAndroid.show('Having hard time to get your Theme', ToastAndroid.SHORT)
    }
  }
  login = async(user) => {
    try {
      await AsyncStorage.setItem('user', user)
      this.props.navigation.navigate('Home', {
        user: user,
        dark: this.state.dark ? 'true' : 'false'
      })
    } catch (e) {
      ToastAndroid.show('Login Error', ToastAndroid.SHORT)
    }
  }
  fetchUser = async() => {
    try {
      var user = await AsyncStorage.getItem('user')
      var lan = await AsyncStorage.getItem('language')
      var lans = await AsyncStorage.getItem('languages')
      console.log(lans)
      console.log(user)
      if(user !== null) {
        this.setState({user: user})
        ToastAndroid.show( 'Logged in as ' + user, ToastAndroid.SHORT)
        this.props.navigation.navigate('Home', {
          user: user,
          language: lan ? lan : 'en',
          dark: this.state.dark ? 'true' : 'false'
        })
        SplashScreen.hide()
      }else{
        ToastAndroid.show('No user is logged in', ToastAndroid.SHORT)
        SplashScreen.hide()
      }
    } catch(e) {
      ToastAndroid.show('Could Not Get User', ToastAndroid.SHORT)
      SplashScreen.hide()
    }
    
  }
  onGoogleButtonPress = async() => {
    const { idToken } = await GoogleSignin.signIn()
    const googleCredential = auth.GoogleAuthProvider.credential(idToken)
    return auth().signInWithCredential(googleCredential)
  }
  signInWithPhoneNumber = async(phoneNumber) => {
    if(phoneNumber){
      try {
        ToastAndroid.show('Sending Secret Code from Alien...', ToastAndroid.SHORT)
          const confirmation = await auth().signInWithPhoneNumber(phoneNumber)
          this.setState({phoneSigninData: confirmation, toConfirm: true})
        setTimeout(() => {
          this.setState({enableResend: true})
        }, 30000)
        console.log(this.state.phoneSigninData)
      } catch (e) {
        console.log(e)
        ToastAndroid.show('Something Went wrong, Please try again later', ToastAndroid.SHORT)
      }

    }else {
      Alert.alert('Hey!', 'Your Number is not Valid!')
    }
  }
  reSendPhone = async(phoneNumber) => {
    if(phoneNumber){
      try {
        ToastAndroid.show('Sending Secret Code from Alien...', ToastAndroid.SHORT)
          const confirmation = await auth().signInWithPhoneNumber(phoneNumber, true)
        this.setState({phoneSigninData: confirmation, toConfirm: true})
        setTimeout(() => {
          this.setState({enableResend: true})
        }, 30000)
        console.log(this.state.phoneSigninData)
      } catch (e) {
        console.log(e)
        ToastAndroid.show('Something Went wrong, Please try again later', ToastAndroid.SHORT)
      }

    }else {
      Alert.alert('Hey!', 'Your Number is not Valid!')
    }
  }

  confirmCode = async() => {
    try {
      await this.state.phoneSigninData.confirm(this.state.confirmCode)
      console.log(this.state.signinPhone)
        fetch('https://lishup.com/app/checkphone.php', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: this.state.signinPhone }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          if(responseJson[0] == 'exists'){
            this.setState({phoneExists: true, screen: 'login', toConfirm: false})
            ToastAndroid.show('You already have an Account. Please Login', ToastAndroid.SHORT)
          }else{
            this.setState({screen: 'register1', phoneExists: false, toConfirm: false})
          }
        })
      
    } catch (error) {
      console.log(error)
      ToastAndroid.show('Could Not Verify Phone Number', ToastAndroid.SHORT)
    }
  }
  handleChangePhone = (data) => {
    if (data.isValid) {
        this.setState({signinPhone: data.e164})
    }
  } 
  fetchlogin(type){
    var user
    if(type == 'google'){
      user = this.state.userData.additionalUserInfo.profile.email
    }else if(type == 'phone'){
      user = this.state.signinPhone
    }else {
      user = this.state.username
    }
    ToastAndroid.show('Signing In...', ToastAndroid.SHORT)
    fetch('https://lishup.com/app/login.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: user, 
      password: this.state.passcode }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({loginload:false})
        if(responseJson.msg == 'match'){
          if(responseJson.multiple == 'yes'){
            Alert.alert('Uh!', 'We found multiple accounts with the same user credential. Please use your UserName to Login')
          }else{
            this.login(responseJson.user)
          }
        }else{
          Alert.alert('Oops', responseJson.msg)
        }
  })
  }
  takepic(){
    const options = {
      title: 'Choose a Profile Photo',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        console.log('file://' + response.path)
        this.setState({newAvatar: 'file://' + response.path})
      }
    });
  }
  uploadpic (){
    let upload = RNFetchBlob.fetch('POST', 'https://api.imgur.com/3/image.json', {
            Authorization : "Bearer 7bc8d41fd39321de0db0b5cccf5a464dd11b7c49",
            otherHeader : "foo",
          'Content-Type' : 'multipart/form-data',
        }, [
          { name : 'image', filename : 'image.jpg', data: RNFetchBlob.wrap(this.state.newAvatar)},
        ])

      setTimeout(()=>{
        upload.uploadProgress({ interval:1 }, (written, total) => {
          let uploaded = (written / total) * 100
          ToastAndroid.show('Uploading LOL Photo ' + uploaded.toFixed(1) + '%', ToastAndroid.SHORT)
    })
      }, 0)
      
      upload.then((resp) => {
        console.log(resp.json())
        fetch('https://lishup.com/app/uploadprofile.php', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
           link: resp.json().data.link,
           user: this.state.username
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
              if(responseJson == 'success'){
                this.setState({screen: 'welcome'})
            }
          })
        })
      upload.catch((err) => {
          console.log(err)
        })
  }
  updateRandomProfile(){
    var avatars= [
      'https://i.imgur.com/eG8nbXm.png',
      'https://i.imgur.com/JUhuqD9.png',
      'https://i.imgur.com/WiNjDVu.png',
      'https://i.imgur.com/YDVm5Gs.png',
      'https://i.imgur.com/lhMoU6A.png',
      'https://i.imgur.com/gVzDOzd.png',
      'https://i.imgur.com/yrkfsIs.png'
    ]
    var randomAvatar = avatars[Math.floor(Math.random() * avatars.length)]
    fetch('https://lishup.com/app/uploadprofile.php', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
           link: randomAvatar,
           user: this.state.username
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
              if(responseJson == 'success'){
                this.setState({screen: 'welcome'})
            }
          })
  }
  register(type){
    var name
    var email
    var phone
    var requiredStuff
    if(type == 'google'){
      name = this.state.userData.additionalUserInfo.profile.given_name
      email = this.state.userData.additionalUserInfo.profile.email
      phone = this.state.userData.user.phoneNumber
      requiredStuff = email
    }else if(type == 'phone'){
      name = this.state.name
      email = ''
      phone = this.state.signinPhone
      requiredStuff = this.state.signinPhone
    }else if(type == 'native'){
      name = this.state.name
      email = this.state.email
      phone = ''
      requiredStuff = email
    }
    if(this.state.username == '' || name == '' || requiredStuff == '' || this.state.passcode == '' || this.state.passcodetwo == ''){
      Alert.alert('Please Fill the Fields', 'UserName, FullName, Email/Phone and Passwords are required')
    }else if(this.state.passcode.length < 8){
      Alert.alert('oops', 'Your Password must contain at least 8 characters!')
    }else if(this.state.passcode != this.state.passcodetwo){
      Alert.alert('oops', 'Your Passwords did not match!')
    }else{
    ToastAndroid.show('Creating your Account...', ToastAndroid.SHORT)
    fetch('https://lishup.com/app/register.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        user: this.state.username, 
        name: name,
        email: email,
        phone: phone ? phone : '',
        password: this.state.passcode,
        secondpassword: this.state.passcodetwo
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
          if(responseJson == 'success'){
            this.setState({screen: 'pic'})
        }else{
          Alert.alert('Opps', responseJson)
        }
      })
      }
  }
  searchUser(val){
    fetch('https://lishup.com/app/user_check.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        user: val
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
          if(responseJson == 'exists'){
            this.setState({isAvailableUser: false})
        }else{
          this.setState({isAvailableUser: true})
        }
      })
  }
  googlesigninform(){
    if(this.state.userData){
      if(this.state.userData.additionalUserInfo.isNewUser){
        return (
          <View style={{width: "90%"}}> 
          <Text category="h3">Create Account</Text>
          <Divider style={{marginVertical: 20}} />
            <Input
              label={evaProps => <Text {...evaProps}>Unique User Name</Text>}
              placeholder='Not your real Name!'
              onChangeText={val => this.setState({username: val})}
              style={{marginVertical: 10}}
            /> 
            <Input
                label={evaProps => <Text {...evaProps}>Password</Text>}
                onChangeText={val => this.setState({passcode: val})}
                secureTextEntry={true}
                style={{marginVertical: 10}}
              />
              <Input
                label={evaProps => <Text {...evaProps}>Retype Password</Text>}
                placeholder='****'
                onChangeText={val => this.setState({passcodetwo: val})}
                secureTextEntry={true}
                style={{marginVertical: 10}}
              /> 
              <Button onPress={() => this.register('google')}>Create Account</Button> 
          </View>
        )
      }else{
        return (
          <View style={{width: "90%"}}>
          <Input
              placeholder='Password'
              onChangeText={val => this.setState({passcode: val})}
              secureTextEntry={true}
              style={{marginVertical: 10}}
            /> 
            <Button onPress={() => this.fetchlogin('google')}>Sign In</Button>
        </View>
        )
      }
    }
  }

  phonesinginform(){
    if(this.state.phoneExists){
          return(
              <View style={{width: "90%"}}>
              <Input
                  placeholder='Password'
                  onChangeText={val => this.setState({passcode: val})}
                  secureTextEntry={true}
                  style={{marginVertical: 10}}
                /> 
                <Button onPress={() => this.fetchlogin('phone')}>Sign In</Button>
              </View>
          )
    }else{
      return (
      <View style={{width: "90%"}}> 
          <Text category="h3">Create Account</Text>
          <Divider style={{marginVertical: 20}} />
          <Input
              label={evaProps => <Text {...evaProps}>Full Name</Text>}
              placeholder='e.g. Albert Einstein'
              onChangeText={val => this.setState({name: val})}
              style={{marginVertical: 10}}
            /> 
            <Input
              label={evaProps => <Text {...evaProps}>Unique User Name</Text>}
              placeholder='Not your real Name!'
              onChangeText={val => this.setState({username: val})}
              style={{marginVertical: 10}}
            /> 
            <Input
                label={evaProps => <Text {...evaProps}>Password</Text>}
                placeholder='****'
                onChangeText={val => this.setState({passcode: val})}
                secureTextEntry={true}
                style={{marginVertical: 10}}
              />
              <Input
                label={evaProps => <Text {...evaProps}>Retype Password</Text>}
                placeholder='****'
                onChangeText={val => this.setState({passcodetwo: val})}
                secureTextEntry={true}
                style={{marginVertical: 10}}
              /> 
              <Button onPress={() => this.register('phone')}>Create Account</Button> 
          </View>
      )
    }
  }
  render(){
    if(this.state.screen == "phone"){
      return (      
      <ApplicationProvider
        {...eva}
        theme={eva.light }> 
          <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFD362'}}>
         {this.state.toConfirm ? <Text category="h4" style={{fontWeight: 'bold'}}>Enter Code</Text> : 
         <Text category="h4"  style={{fontWeight: 'bold'}}>Enter Your Phone #</Text>}   
         {this.state.toConfirm ? <Text category="s1">Still Making Sure you are not a Robot</Text> : <Text category="s1">Making Sure you are not a Robot</Text>} 
         { this.state.toConfirm ? <Input
      placeholder='888888'
      style={{width: "90%", marginVertical: 10, marginTop: 20, borderColor: 'white', backgroundColor: 'white', borderRadius: 20,
      padding: 20}}
      textStyle={{fontSize: 30, height: 90, textAlign: 'center'}}
      maxLength={6}
      textContentType="oneTimeCode"
      onChangeText={val => this.setState({confirmCode: val})}
    /> : <PhoneInput
                  initialCountry="US"
                  onChange={this.handleChangePhone} 
                  style={{width: "90%", marginVertical: 10, marginTop: 20, borderColor: 'white', backgroundColor: 'white', borderRadius: 20, justifyContent: 'center',
                   padding: 20, alignItems: 'center'}}
                  textStyle={{fontSize: 30, padding: 20, height: 90}}
                /> }
          {this.state.toConfirm ?  <Button onPress={() => this.confirmCode()}  style={{width: "60%", borderColor: 'transparent',
            backgroundColor: '#00BBFF', borderRadius: 20,  elevation: 2}} size="giant" >Confirm Code</Button> :
           <Button onPress={() => this.signInWithPhoneNumber(this.state.signinPhone)}  style={{width: "60%", borderColor: 'transparent',
            backgroundColor: '#00BBFF', borderRadius: 20,  elevation: 2}} size="giant" >Send Code</Button> 
          }
          {this.state.toConfirm ? this.state.enableResend ? <TouchableOpacity 
            style={{position: 'absolute', bottom: 30,}} onPress={() => this.reSendPhone(this.state.signinPhone)}>
            <Text style={{ fontSize: 20, fontWeight: 'bold'}}>Resend Code</Text> 
          </TouchableOpacity> : null : <TouchableOpacity onPress={() => this.setState({screen: 'email'})} style={{position: 'absolute', bottom: 30,}}>
               <Text style={{ fontSize: 20, fontWeight: 'bold'}}>Join with Email Instead</Text>
            </TouchableOpacity>}
          </Layout>
        </ApplicationProvider>
        )
    }else if(this.state.screen == 'email'){
      return (      
        <ApplicationProvider
          {...eva}
          theme={eva.light }> 
            <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFD362'}}>
            <Text category="h4" style={{fontWeight: 'bold', marginTop: 20}}>Enter Email</Text>
            <Text category="s1">Making Sure you are not a Robot</Text>
            <Input
                  placeholder='memer@meme.com'
                  textContentType="email"
                  value={this.state.email}
                  onChangeText={val => {
                    this.setState({email: val})
                  }}
                  style={{width: "90%", marginVertical: 10, marginTop: 20, borderColor: 'white', backgroundColor: 'white', borderRadius: 20,
                  paddingHorizontal: 10}}
                  textStyle={{fontSize: 20, height: 60,  textAlign: 'center'}}
                /> 
             <Button onPress={() => {
                const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if(re.test(String(this.state.email).toLowerCase())){

                  var code = Math.random().toString().substr(2, 6)
                  this.setState({ secretCode: code }, () => {
                    fetch('https://lishup.com/app/confirmEmail.php', {
                        method: 'POST',
                        headers: {
                          Accept: 'application/json',
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ 
                          email: this.state.email,
                          code: this.state.secretCode
                        }),
                      })
                  })
                  this.setState({screen: 'emailVerify'})
                  ToastAndroid.show('Check Inbox for Verification Code', ToastAndroid.SHORT)
                }else{
                  ToastAndroid.show('Your Email is not Valid', ToastAndroid.SHORT)
                }
              }}  style={{width: "70%", borderColor: 'transparent',
            backgroundColor: '#00BBFF', borderRadius: 20,  elevation: 2}} size="giant" >Next</Button>  
            <TouchableOpacity onPress={() => this.setState({screen: 'phone'})} style={{position: 'absolute', bottom: 30,}}>
               <Text style={{ fontSize: 20, fontWeight: 'bold'}}>Join with Phone # Instead</Text>
            </TouchableOpacity>
            </Layout>
          </ApplicationProvider>
          )
    }else if(this.state.screen == 'emailVerify'){
      return(
        <ApplicationProvider
          {...eva}
          theme={eva.light }> 
            <Layout style={{flex: 1, paddingTop: 50, alignItems: 'center', backgroundColor: '#FFD362'}}>
            <Text category="h4" style={{fontWeight: 'bold'}}>Enter Code</Text>
            <Text category="s1">Still Making Sure you are not a Robot</Text>
            <Input
                placeholder='888888'
                style={{width: "90%", marginVertical: 10, marginTop: 20, borderColor: 'white', backgroundColor: 'white', borderRadius: 20,
                padding: 20}}
                textStyle={{fontSize: 30, height: 90, textAlign: 'center'}}
                maxLength={6}
                textContentType="oneTimeCode"
                onChangeText={val => {
                  if(this.state.secretCode == val){
                    this.setState({screen: 'register1'})
                  }
                }}
              />
          </Layout>
          </ApplicationProvider>
      )  
    }else if(this.state.screen == 'register2'){
      return (      
        <ApplicationProvider
          {...eva}
          theme={eva.light }> 
            <Layout style={{flex: 1, paddingTop: 50, alignItems: 'center', backgroundColor: '#FFD362'}}>
            <Text category="h4" style={{fontWeight: 'bold', marginTop: 20}}>Create Password</Text>
            <Input
                  placeholder='********'
                  textContentType="newPassword"
                  secureTextEntry={true}
                  onChangeText={val => this.setState({passcode: val})}
                  style={{width: "90%", marginVertical: 10, marginTop: 20, borderColor: 'white', backgroundColor: 'white', borderRadius: 20,
                  paddingHorizontal: 20}}
                  textStyle={{fontSize: 20, height: 60,  textAlign: 'center'}}
                /> 
                <Text category="h5" style={{fontWeight: 'bold', marginTop: 20}}>Re-enter Password</Text>
                <Input
                  placeholder='********'
                  textContentType="password"
                  secureTextEntry={true}
                  onChangeText={val => this.setState({passcodetwo: val})}
                  style={{width: "90%", marginVertical: 10, marginTop: 20, borderColor: 'white', backgroundColor: 'white', borderRadius: 20,
                   paddingHorizontal: 20}}
                  textStyle={{fontSize: 20, height: 60, textAlign: 'center'}}
                  accessoryRight={this.state.passcode == this.state.passcodetwo && this.state.passcode != ""
                  && this.state.passcode.length > 7 ? evaProps => 
                   <Svg height="20" viewBox="0 0 512 512" width="20" xmlns="http://www.w3.org/2000/svg">
                    <Path d="m512 268c0 17.9-4.3 34.5-12.9 49.7s-20.1 27.1-34.6 35.4c.4 2.7.6 6.9.6 12.6 0 27.1-9.1 50.1-27.1 69.1-18.1 19.1-39.9 28.6-65.4 28.6-11.4 0-22.3-2.1-32.6-6.3-8 16.4-19.5 29.6-34.6 39.7-15 10.2-31.5 15.2-49.4 15.2-18.3 0-34.9-4.9-49.7-14.9-14.9-9.9-26.3-23.2-34.3-40-10.3 4.2-21.1 6.3-32.6 6.3-25.5 0-47.4-9.5-65.7-28.6-18.3-19-27.4-42.1-27.4-69.1 0-3 .4-7.2 1.1-12.6-14.5-8.4-26-20.2-34.6-35.4-8.5-15.2-12.8-31.8-12.8-49.7 0-19 4.8-36.5 14.3-52.3s22.3-27.5 38.3-35.1c-4.2-11.4-6.3-22.9-6.3-34.3 0-27 9.1-50.1 27.4-69.1s40.2-28.6 65.7-28.6c11.4 0 22.3 2.1 32.6 6.3 8-16.4 19.5-29.6 34.6-39.7 15-10.1 31.5-15.2 49.4-15.2s34.4 5.1 49.4 15.1c15 10.1 26.6 23.3 34.6 39.7 10.3-4.2 21.1-6.3 32.6-6.3 25.5 0 47.3 9.5 65.4 28.6s27.1 42.1 27.1 69.1c0 12.6-1.9 24-5.7 34.3 16 7.6 28.8 19.3 38.3 35.1 9.5 15.9 14.3 33.4 14.3 52.4zm-266.9 77.1 105.7-158.3c2.7-4.2 3.5-8.8 2.6-13.7-1-4.9-3.5-8.8-7.7-11.4-4.2-2.7-8.8-3.6-13.7-2.9-5 .8-9 3.2-12 7.4l-93.1 140-42.9-42.8c-3.8-3.8-8.2-5.6-13.1-5.4-5 .2-9.3 2-13.1 5.4-3.4 3.4-5.1 7.7-5.1 12.9 0 5.1 1.7 9.4 5.1 12.9l58.9 58.9 2.9 2.3c3.4 2.3 6.9 3.4 10.3 3.4 6.7-.1 11.8-2.9 15.2-8.7z" fill="#1da1f2"/>
                  </Svg>  : evaProps => <Icon name="information-circle" color="red" size={25} onPress={() => 
                  ToastAndroid.show('Your Passwords must match and contain at least 8 characters', ToastAndroid.LONG)} /> }
                /> 
                  <Button disabled={!this.state.passcode && !this.state.passcodetwo} onPress={() => {
                    if(this.state.passcode && this.state.passcodetwo){
                      if(this.state.email && !this.state.phone){
                        this.register('native')
                      }else{
                        this.register('phone')
                      }
                    }
                  }} style={{width: "80%", borderColor: 'transparent',
                  backgroundColor: '#00BBFF', borderRadius: 20,  elevation: 2, marginTop: 20}} size="giant">Next</Button>
            </Layout>
          </ApplicationProvider>
          )
    }else if(this.state.screen == 'pic'){
      return (      
        <ApplicationProvider
          {...eva}
          theme={eva.light }> 
            <Layout style={{flex: 1, paddingTop: 50, alignItems: 'center', backgroundColor: '#FFD362'}}>
             {this.state.newAvatar ? <Image source={{uri: this.state.newAvatar}} 
                  style={{width: 200, height: 200, borderRadius: 200/2}} /> : <TouchableOpacity
                     style={{backgroundColor: 'white', width: 200, height: 200, justifyContent: 'center', borderRadius: 100}}
                     onPress={() => this.takepic()}>
                      <Text category="h5" style={{textAlign: 'center', width: '90%', alignSelf: 'center'}}>Tap to add Photo</Text>
                    </TouchableOpacity>}
              <Text category="h4" style={{textAlign: 'center', fontWeight: 'bold', marginTop: 20}}>Add Profile Photo</Text>
              {this.state.newAvatar ? <Button onPress={() => this.uploadpic()} style={{width: "80%", borderColor: 'transparent',
                  backgroundColor: '#00BBFF', borderRadius: 20,  elevation: 2, marginTop: 30}} size="giant">Upload Photo</Button> : null}
             <TouchableOpacity onPress={() => {
               ToastAndroid.show('Please Wait...', ToastAndroid.SHORT)
               this.updateRandomProfile()
               }} style={{position: 'absolute', bottom: 30,}}>
               <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Skip</Text>
            </TouchableOpacity>
            </Layout>
          </ApplicationProvider>
          )
    }else if(this.state.screen == 'register1'){
      return (      
        <ApplicationProvider
          {...eva}
          theme={eva.light }> 
            <Layout style={{flex: 1, paddingTop: 50, alignItems: 'center', backgroundColor: '#FFD362'}}>
              <Text category="h4" style={{fontWeight: 'bold'}}>Put Your Name</Text>
              <Input
                  placeholder='e.g. Albert Einstein'
                  textContentType="name"
                  value={this.state.name}
                  onChangeText={val => this.setState({name: val})}
                  style={{width: "90%", marginVertical: 10, marginTop: 20, borderColor: 'white', backgroundColor: 'white', borderRadius: 20,
                  paddingHorizontal: 20}}
                  textStyle={{fontSize: 20, height: 60,  textAlign: 'center'}}
                /> 
                <Text category="h4" style={{fontWeight: 'bold', marginTop: 20}}>Create Username</Text>
                <Input
                  placeholder='e.g. TastyMeme'
                  textContentType="username"
                  value={this.state.username}
                  onChangeText={val => {
                     var correct = val.replace(/[^a-z0-9]/gi,'')
                     this.setState({username: correct})
                     this.searchUser(correct)
                  }}
                  style={{width: "90%", marginVertical: 10, marginTop: 20, borderColor: 'white', backgroundColor: 'white', borderRadius: 20,
                   paddingHorizontal: 20}}
                  textStyle={{fontSize: 20, height: 60, textAlign: 'center'}}
                  accessoryRight={this.state.username != "" && this.state.isAvailableUser ? evaProps => 
                   <Svg height="20" viewBox="0 0 512 512" width="20" xmlns="http://www.w3.org/2000/svg">
                    <Path d="m512 268c0 17.9-4.3 34.5-12.9 49.7s-20.1 27.1-34.6 35.4c.4 2.7.6 6.9.6 12.6 0 27.1-9.1 50.1-27.1 69.1-18.1 19.1-39.9 28.6-65.4 28.6-11.4 0-22.3-2.1-32.6-6.3-8 16.4-19.5 29.6-34.6 39.7-15 10.2-31.5 15.2-49.4 15.2-18.3 0-34.9-4.9-49.7-14.9-14.9-9.9-26.3-23.2-34.3-40-10.3 4.2-21.1 6.3-32.6 6.3-25.5 0-47.4-9.5-65.7-28.6-18.3-19-27.4-42.1-27.4-69.1 0-3 .4-7.2 1.1-12.6-14.5-8.4-26-20.2-34.6-35.4-8.5-15.2-12.8-31.8-12.8-49.7 0-19 4.8-36.5 14.3-52.3s22.3-27.5 38.3-35.1c-4.2-11.4-6.3-22.9-6.3-34.3 0-27 9.1-50.1 27.4-69.1s40.2-28.6 65.7-28.6c11.4 0 22.3 2.1 32.6 6.3 8-16.4 19.5-29.6 34.6-39.7 15-10.1 31.5-15.2 49.4-15.2s34.4 5.1 49.4 15.1c15 10.1 26.6 23.3 34.6 39.7 10.3-4.2 21.1-6.3 32.6-6.3 25.5 0 47.3 9.5 65.4 28.6s27.1 42.1 27.1 69.1c0 12.6-1.9 24-5.7 34.3 16 7.6 28.8 19.3 38.3 35.1 9.5 15.9 14.3 33.4 14.3 52.4zm-266.9 77.1 105.7-158.3c2.7-4.2 3.5-8.8 2.6-13.7-1-4.9-3.5-8.8-7.7-11.4-4.2-2.7-8.8-3.6-13.7-2.9-5 .8-9 3.2-12 7.4l-93.1 140-42.9-42.8c-3.8-3.8-8.2-5.6-13.1-5.4-5 .2-9.3 2-13.1 5.4-3.4 3.4-5.1 7.7-5.1 12.9 0 5.1 1.7 9.4 5.1 12.9l58.9 58.9 2.9 2.3c3.4 2.3 6.9 3.4 10.3 3.4 6.7-.1 11.8-2.9 15.2-8.7z" fill="#1da1f2"/>
                  </Svg>  : evaProps => <Icon name="information-circle" color="red" size={25} onPress={() => 
                  ToastAndroid.show('Please Choose a Unique Username', ToastAndroid.LONG)} /> }
                  maxLength={20}
                /> 
                 <Button disabled={!this.state.name && !this.state.username} onPress={() => {
                    if(this.state.name && this.state.username){
                      if(this.state.isAvailableUser){
                      this.setState({screen: 'register2'})
                      }else{
                        ToastAndroid.show('This Username already Exists, Please choose a different One', ToastAndroid.LONG)
                      }
                    }
                  }} style={{width: "80%", borderColor: 'transparent',
                  backgroundColor: '#00BBFF', borderRadius: 20,  elevation: 2, marginTop: 20}} size="giant">Next</Button>
            </Layout>
          </ApplicationProvider>
          )
    }else if(this.state.screen == 'login'){
      return (      
        <ApplicationProvider
          {...eva}
          theme={eva.light }> 
            <Layout style={{flex: 1, paddingTop: 20, alignItems: 'center', backgroundColor: '#FFD362'}}>
            <View style={{alignSelf: 'center', width: "90%"}}> 
                  <Text category="h4" style={{fontWeight: 'bold', marginTop: 20, textAlign: 'center'}}>Sign In:</Text>
                  <Text category="h5" style={{fontWeight: 'bold', marginTop: 20, textAlign: 'center'}}>Enter Email/ Phone #</Text>
            <Input
                  textContentType="username"
                  onChangeText={val => this.setState({username: val})}
                  style={{width: "90%", marginVertical: 10, marginTop: 20, borderColor: 'white', backgroundColor: 'white', borderRadius: 20,
                  paddingHorizontal: 20, alignSelf: 'center'}}
                  textStyle={{fontSize: 20, height: 60,  textAlign: 'center'}}
                /> 
                <Text category="h5" style={{fontWeight: 'bold', marginTop: 20, textAlign: 'center'}}>Enter Password</Text>
                <Input
                  placeholder='********'
                  textContentType="password"
                  secureTextEntry={true}
                  onChangeText={val => this.setState({passcode: val})}
                  style={{width: "90%", marginVertical: 10, marginTop: 20, borderColor: 'white', backgroundColor: 'white', borderRadius: 20,
                   paddingHorizontal: 20, alignSelf: 'center'}}
                  textStyle={{fontSize: 20, height: 60, textAlign: 'center'}}
                /> 
                  <Button disabled={!this.state.username && !this.state.passcode} onPress={() => this.fetchlogin('native')} 
                  style={{width: "80%", borderColor: 'transparent', alignSelf: 'center',
                  backgroundColor: '#00BBFF', borderRadius: 20,  elevation: 2, marginTop: 20}} size="giant">Sign In</Button>
              </View>
            </Layout>
          </ApplicationProvider>
          )
    }else if(this.state.screen == 'welcome'){
      return(
        <ApplicationProvider
      {...eva}
      theme={eva.light }> 
        <Layout style={{flex: 1, paddingTop: '20%', alignItems: 'center', padding: 20, backgroundColor: '#FFD362'}}>
           <FastImage source={require('./GemsIcons/welcome.png')} style={{height: '50%', width: '100%'}} resizeMode='contain' />
            <TouchableOpacity style={{backgroundColor: '#00BBFF', marginTop: 40, width: 100, height: 100,
             borderRadius: 50, justifyContent: 'center', alignItems: 'center'}}  onPress={() => this.state.username ? this.login(this.state.username) :
              ToastAndroid.show('Could not find any logged in User', ToastAndroid.SHORT)}>
              <Icon name="arrow-forward-circle" size={50} color="white" />
            </TouchableOpacity>  
        </Layout>
      </ApplicationProvider>
      )
      
    }else{
    return(
      <ApplicationProvider
      {...eva}
      theme={eva.light }> 
        <Layout style={{flex: 1, paddingTop: '20%', alignItems: 'center', padding: 20, backgroundColor: '#FFD362'}}>
           <FastImage source={require('./GemsIcons/logo.png')} style={{height: '50%', width: '100%'}} resizeMode='contain' />
           <Button onPress={() => this.setState({screen: 'phone'})} 
           style={{ elevation: 5, width: "90%", padding: 10, marginBottom:10, backgroundColor: '#00BBFF', borderColor: 'white', borderRadius: 20, borderWidth: 4 }}>
              {evaProps => <Text {...evaProps} style={{fontSize: 20, color: 'white', fontWeight: 'bold', }}>Join</Text>}</Button>
            <TouchableOpacity  onPress={() => this.setState({screen: 'login'})}>
              <Text style={{fontWeight: 'bold'}}>Already Have an Account? Sign In</Text>
            </TouchableOpacity>
            
            <Button onPress={() => this.onGoogleButtonPress().then(data => {
              ToastAndroid.show('Please wait', ToastAndroid.SHORT)
              if(data.additionalUserInfo.isNewUser){
                this.setState({userData: data, screen: 'register1', email: data.additionalUserInfo.profile.email,
                 name: data.additionalUserInfo.profile.given_name})
                console.log(data)
              }else{
                console.log(data)
                fetch('https://lishup.com/app/getUsername.php', {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ 
                    email: data.additionalUserInfo.profile.email,
                    key: 'idkwhat2'
                  }),
                })
                  .then((response) => response.json())
                  .then((responseJson) => {
                      if(responseJson == 'register'){
                        this.setState({screen: 'register1'})
                    }else{
                      this.login(responseJson)
                    }
                  })
              }
            })}
            style={{ width: "90%", height: 48, position: 'absolute', bottom: 30, backgroundColor: 'white', borderRadius: 20, borderColor: 'white' }}
               accessoryLeft={evaProps => <NativeImage {...evaProps} source={require('./GemsIcons/google.png')} style={{height: 22, width: 22}} />}>
              {evaProps => <Text {...evaProps} style={{color: 'black', fontWeight: 'bold'}}> Sign in with Google</Text>}
           </Button>   
        </Layout>
      </ApplicationProvider>
    )
  }
}
}
class HomeScreen extends React.PureComponent{
  static navigationOptions = ({navigation,screenProps}) => {
    return {
      tabBarVisible: true,
      tabBarIcon: ({ tintColor }) => (
        <FIcon name="home" size={28} color={tintColor ? tintColor : 'black'} />
      ),
      tabBarLabel: ({ focused, tintColor }) => {
        return null
      }
    }
  }

  constructor(props){
    super(props)
    this.state = {
      dark: false,
      user: '',
      data: [],
      imageUrls: [],
      comments: [],
      newcomment: '',
      loading: true,
      loadingComments: true,
      showComments: false,
      showAwards: false,
      showLoves: false,
      currentPostId: '',
      currentPostIdx: 0,
      currentAwardUser: '',
      awardAmount: 0,
      showCongrats: false,
      feedOrder: 'date_time',
      currentPostAuthor: '',\
      moreLoading: false,
      loves: [],
      language: 'en',
      isOffline: false,
      replyingTo: 0,
      replyingPerson: '',
      memeBtnvisible: true,
      showLoveSuggestion: false,
      showMoreOptions: false,
      reportPost: false,
      reportReason: '',
    }
    this.socket = io.connect('https://lishup.com:3000', {secure: true}, { transports: ['websocket'] })
    this.socket.on('connect', function (data) {
     //console.log('connected to socket')
    })
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(nextState.currentPostId != this.state.currentPostId || nextState.currentPostAuthor != this.state.currentPostAuthor){
      return false
    }

    return true
  }
  async componentDidMount(){
    const { params } = this.props.navigation.state
    const user = params ? params.user : null
    const lan = params ? params.language : null

    this.fetch('', 'date_time')
    messaging()
      .getToken()
      .then(token => {
        console.log(token)
        this.socket.emit('device', {
          user: user,
          token: token,
          appName: 'meme'
        })
      })
    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
          'Notification caused app to open from background state:',
          remoteMessage.notification,
        )
        if(remoteMessage.data.type == 'follow'){
          this.props.navigation.navigate('Profile', {
            user: remoteMessage.data.user,
            dark: this.state.dark
          })
        }else if(remoteMessage.data.type == 'comment'){
          this.props.navigation.navigate('ViewPost', {
            id: remoteMessage.data.postId,
            dark: this.state.dark
          })
        }else if(remoteMessage.data.type == 'love'){
          this.props.navigation.navigate('ViewPost', {
            id: remoteMessage.data.postId,
            dark: this.state.dark
          })
        }else if(remoteMessage.data.type == 'message'){
          this.props.navigation.navigate('Conversations', {
            dark: this.state.dark
          })
        }
      })  
     
    this.setupStarting()
    TranslatorConfiguration.setConfig(ProviderTypes.Google, 'AIzaSyBu1Mz7yL95Y1G0tUn_jtdc2GTuJQY7zto', lan ? lan : 'en')
    

    this.socket.on('newComment', data => {

      if(Object.keys(this.state.data).length > 0){
        for (var i = 0; i < Object.keys(this.state.data).length; i++) {
          if (this.state.data[i].id == data.id) {
              let result = this.state.data
              result[i].comments = result[i].comments + 1
              this.setState({data: result})
          }
        }
    }

      if(this.state.showComments){
      if(this.state.currentPostId == data.id){
        let newcomment = {id: data.id, user: data.user, text: data.text, time: data.time, image: data.url, replyId: data.replyId}
        this.setState({ comments: [newcomment, ...this.state.comments]  })
      }
    }
  })
  StatusBar.setBackgroundColor("rgba(0,0,0,0)")
  StatusBar.setBarStyle("light-content")
  StatusBar.setTranslucent(true)
  BackHandler.addEventListener('hardwareBackPress', () => {
    BackHandler.exitApp()
    return true
  })
  this.fetchFirstTime()
  this.checkReceivedContent()
  NetInfo.fetch().then(state => {
    this.setState({isOffline: !state.isInternetReachable})
  })
}
 //end of componentdidmount
  componentWillUnmount(){
    Linking.removeEventListener('url', url => {
      console.log(url)
    })
    BackHandler.removeEventListener('hardwareBackPress', () => {
      BackHandler.exitApp()
      return true
    })
  }
  fetchFirstTime = async() => {
    try {
      var theme = await AsyncStorage.getItem('first')
      console.log(theme)
      if(theme != 'true') {
        await AsyncStorage.setItem('first', 'true')
        this.props.start()
        this.props.copilotEvents.on("stop", () => {
          this.setState({showLoveSuggestion: true})
        })
      }else{
        await AsyncStorage.setItem('first', 'true')
      }
    } catch(er) {
      ToastAndroid.show('Having hard time to help you to get started', ToastAndroid.SHORT)
      console.log(er)
    }
  }
  checkReceivedContent(){
    Linking.getInitialURL().then((url) => {
      Linking.addEventListener('url', url => {
        console.log(url)
      })
      if (url) {
        console.log('shared string/text is ', url)
        if(url.substr(0, 27) == "lishup://meme/profile?user="){
        this.props.navigation.navigate('Profile', {
          user: url.substr(27, url.length),
          dark: this.state.dark
        })
      }
      }
    }).catch(err => console.error('An error occurred', err))
    ReceiveSharingIntent.getReceivedFiles(files => {
      console.log(files)
      if(files[0].contentUri){
        this.props.navigation.navigate('Create', {
          user: this.state.user,
          dark: this.state.dark,
          mixContent: files[0].contentUri
        })
      }
    }, 
    (error) =>{
      console.log(error);
    })
    ReceiveSharingIntent.clearReceivedFiles()
  }
   async setupStarting(){
    const { params } = this.props.navigation.state
    const user = params ? params.user : null
    const isnew = params ? params.newMeme : null
    const lan = params ? params.language : null
    const theme = params ? params.dark : null

    this.props.navigation.setParams({showOr: true})

    if(theme == 'true'){
      this.setState({dark: true})
    }
    this.setState({user: user, language: lan ? lan : 'en'})
    if(isnew){
      this.fetch()
    }
    try {
      var openCount = await AsyncStorage.getItem('opens')
      await AsyncStorage.setItem('opens', ((openCount ? parseInt(openCount) : 0) + 1).toString())
      if(((openCount ? parseInt(openCount) : 0) + 1).toString() > 5 && ((openCount ? parseInt(openCount) : 0) + 1).toString() < 8){
        Alert.alert('What\'s up!', 'Having any Issues with App?', [
          {text: 'Yes, It has Issues', onPress: () => Linking.openURL('https://abrarfairuj.typeform.com/to/fcdjrCPL')},
          {text: "No, It's good", onPress: () => this.showReviewPanel()}
        ])
      }
      if(((openCount ? parseInt(openCount) : 0)) % 5 == 0 && ((openCount ? parseInt(openCount) : 0)) > 0){
        setTimeout(() => {
          this.setState({showLoveSuggestion: true})
        }, 2000)
      }
    } catch(er) {
      //ToastAndroid.show('Having hard time to help you to get started', ToastAndroid.SHORT)
    }
  }
  showReviewPanel(){
    Alert.alert('Thanks!', 'Would you like to rate it Please?', [
      {text: 'Alerady Done', onPress: () => ToastAndroid.show('Thanks a lot!', ToastAndroid.SHORT)},
      {text: 'Sure!', onPress: () => Linking.openURL("market://details?id=com.meme.lishup")}
    ],
    {cancelable: true})
  }
  fetch(user, changeFeed){
    const { params } = this.props.navigation.state
    const userFromhere = params ? params.user : null

    if(changeFeed){
      this.setState({feedOrder: changeFeed})
    }
    fetch('https://lishup.com/app/getcommunity.php', {
         method: 'POST',
         headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: userFromhere,
          id: 46,
          orderBy: changeFeed
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        this.seperateLoves(responseJson)
         this.setState({
            data: responseJson,
            loading: false,
            isOffline: false
         })
          incBadge(parseInt(this.state.data[0].unreadN))
          incBadgem(parseInt(this.state.data[0].unreadM))
         console.log('Unread notifications', notifyBadge)
         Promise.all(
          responseJson.map(({ images }) => this.fetchImage(images))
        ).then((imageUrls) => {this.setState({ imageUrls })
         })
      })
      .catch((error) => {
         console.log(error)
         ToastAndroid.show('Something Went Wrong', ToastAndroid.SHORT)
      })
  }
  fetchImage(image) {
    return fetch('https://lishup.com/app/fetch-image.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson.filter(({ url }) => url).map(({ url }) => url)
      })
  }
  fetchComments(id) {
    fetch('https://lishup.com/app/getcomments.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lid: id }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson){
          this.setState({comments: responseJson, loadingComments: false})
          console.log(this.state.comments)
        }else{
          this.setState({loadingComments: false})
        }
      })
  }
  seperateLoves(data){
    var newArray = []
    for(var i in data){
      newArray = [...newArray, {id: data[i].id, isliked: data[i].isliked, loves: data[i].loves}]
    }
    this.setState({loves: newArray})
  }
  award(){
    if(this.state.awardAmount < 2){
      Alert.alert('Uh!', 'The minimum amount is 2 Gems')
    }else{
      fetch('https://lishup.com/app/awardUser.php', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: this.state.currentAwardUser, me: this.state.user, amount: this.state.awardAmount }),
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson == 'sent'){
          Vibration.vibrate()
          this.setState({showCongrats: true})
          setTimeout(() => {this.setState({showCongrats: false})}, 4000)
          Alert.alert('Congrats!', 'You just gifted this creator ' + this.state.awardAmount + 'Gems', [
            {
              text: 'UwU'
            }
          ])
        }else{
          Alert.alert('Oops', responseJson)
        }
        this.setState({awardAmount: 0, currentAwardUser: '', showAwards: false})
      })
  }
  }
  formatText(string){
    return string.split(/((?:^|\s)(?:#[a-z\d-]+))/gi).filter(Boolean).map((v,i)=>{
      if(v.includes('#')){
        return <Text  style={{fontWeight: 'bold', color: this.state.dark ? "white" : '#565656', 
          elevation: 7, zIndex: 7,}} onPress={() => this.props.navigation.navigate('Contests')}>{v}</Text>
      }   else{
        return this.state.language == 'en' ? <Text 
        key={i} style={{ elevation: 10, zIndex: 10, color: this.state.dark ? "white" : '#565656'}}>{v}</Text> : 
        <PowerTranslator text={v} key={i} style={{ elevation: 10, zIndex: 10, color: this.state.dark ? "white" : '#565656'}} target={this.state.language} />
      }
    })
  }
  renderPosts = ({item, index}) => (
    <View style={{ marginVertical: 10, 
      padding: 10, backgroundColor: 'white', borderRadius: 30, elevation: 2}} 
        key={item.id}>
        <View>
          <ListItem
            title={props => <Text style={{ fontSize:15, left: 10, elevation: 5, zIndex: 5, color: this.state.dark ? "white" : '#A7A7A7', fontWeight: 'bold'}}>
            {item.user}  {this.state.language == 'en' ? <Text style={{fontSize: 12, elevation: 5, zIndex: 5, color: this.state.dark ? "#f2f2f2" : '#ababab'}}>
              {item.time}</Text> : <PowerTranslator text={item.time} 
            style={{fontSize: 12, elevation: 5, zIndex: 5, color: this.state.dark ? "#f2f2f2" : '#ababab'}} target={this.state.language}/>}
            </Text>}
            accessoryLeft={evaProps => 
              <Avatar source={{uri: item.userpic}} style={{width: 38, height: 38, borderRadius: 38/2, marginTop: 2}} />}
            onPress={() => this.props.navigation.navigate('Profile', {user: item.user, dark: this.state.dark })}
            style={{backgroundColor: 'transparent', elevation: 5, zIndex: 5, }}
            description={props => 
            <NativeText style={{left: 8, elevation: 4, zIndex: 4}}>{item.reUser ? 
              <View style={{flexDirection: 'row'}}>
              <Svg width="20" height="18" viewBox="0 0 36 31" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginTop: 5}}>
              <G filter="url(#filter0_i)">
              <Path fill-rule="evenodd" clip-rule="evenodd" d="M28.2224 9.757L28.1384 9.75854C27.9372 9.76407 27.7371 9.78532 27.5395 9.82402C26.8557 9.95801 26.2236 10.2854 25.6529 10.6763C25.5441 10.7509 25.4371 10.8281 25.3319 10.9075C24.7196 11.3695 24.1625 11.9024 23.6368 12.4597C23.0073 13.1272 22.4211 13.8346 21.8536 14.5551L21.0575 15.5974L20.682 16.0891C20.1268 16.8341 19.5774 17.5834 19.0232 18.3291C18.6087 18.8848 18.1916 19.4385 17.7646 19.9847L17.4273 20.4028L16.7782 21.2075C16.5259 21.5093 16.2692 21.8074 16.0067 22.1005C15.8026 22.3285 15.5951 22.5534 15.3835 22.7745C14.1349 24.08 12.7337 25.2716 11.115 26.0931C10.9121 26.196 10.7061 26.2929 10.4972 26.3833C10.222 26.5023 9.94186 26.6099 9.65741 26.7048C9.27818 26.8313 8.89139 26.9352 8.49954 27.0145C8.12246 27.0908 7.74076 27.1443 7.35718 27.1742C7.16216 27.1894 6.96686 27.1977 6.7713 27.2015C6.70025 27.2024 6.7004 27.2024 6.62928 27.2027C6.62928 27.2027 3.24749 27.2027 1.63932 27.2027C1.419 27.2027 1.2077 27.1151 1.05191 26.9594C0.896117 26.8036 0.808594 26.5923 0.808594 26.372C0.808594 25.2673 0.808594 23.3259 0.808594 22.2202C0.808595 21.9995 0.89645 21.7878 1.05276 21.632C1.20908 21.4761 1.421 21.3889 1.64174 21.3895C3.33311 21.3967 5.01392 21.4196 6.70913 21.3866C6.76543 21.3851 6.82161 21.3825 6.87781 21.3787C7.04448 21.3664 7.21001 21.3437 7.37359 21.3093C8.06915 21.1632 8.71065 20.8235 9.29004 20.4206C9.42274 20.3284 9.55273 20.2322 9.68031 20.133C10.2978 19.6528 10.8603 19.1041 11.392 18.5315C12.0232 17.8516 12.6124 17.1333 13.1837 16.4027L13.799 15.5911L14.5072 14.6569C14.9612 14.0438 15.4134 13.4294 15.8683 12.817C16.282 12.2618 16.6982 11.7085 17.1242 11.1626L17.4301 10.7836L18.1915 9.84037C18.4439 9.53963 18.7008 9.24268 18.9635 8.95088C19.1678 8.72395 19.3755 8.50011 19.5872 8.28015C20.8376 6.9813 22.2431 5.79893 23.8667 4.9944C24.0704 4.89344 24.2772 4.79867 24.4868 4.71062C24.7631 4.59454 25.0444 4.49019 25.3299 4.39875C25.7105 4.27682 26.0986 4.1779 26.4915 4.104C27.0605 3.99696 27.6378 3.94478 28.2166 3.94251H28.2223V0.619629L35.2835 6.85003L28.2223 13.0804V9.75701L28.2224 9.757ZM28.2224 21.3876V18.0647L35.2835 24.2951L28.2224 30.5255V27.2027H28.2167C27.6367 27.2004 27.0583 27.1484 26.488 27.0417C26.0943 26.968 25.7053 26.8693 25.3236 26.7477C25.0375 26.6564 24.7555 26.5523 24.4783 26.4364C24.2681 26.3485 24.0607 26.2539 23.8563 26.1531C22.2674 25.3692 20.885 24.2243 19.6534 22.9622C19.4398 22.7433 19.2303 22.5204 19.0243 22.2942L18.5104 21.7081L19.0734 21.0081C19.5085 20.4517 19.9335 19.8875 20.3558 19.3213C20.8608 18.6418 21.3619 17.9594 21.8667 17.2798L22.1157 16.9602C22.6662 17.6429 23.2204 18.2913 23.8152 18.9009C24.3183 19.4165 24.8517 19.9072 25.4358 20.3303C26.0625 20.7841 26.764 21.1712 27.5305 21.3206C27.7493 21.3633 27.9711 21.3849 28.1939 21.3875L28.2223 21.3876H28.2224ZM12.741 14.2297L11.7126 13.0008C11.1165 12.3277 10.4854 11.679 9.78491 11.1135C9.65677 11.01 9.52623 10.9095 9.39296 10.8128C9.28852 10.737 9.1824 10.6634 9.07447 10.5926C8.51352 10.2247 7.89381 9.92389 7.22811 9.80926C7.03763 9.77646 6.8451 9.75995 6.65188 9.75768L6.61797 9.75755C6.61797 9.75755 3.24504 9.75755 1.63935 9.75755C1.18056 9.75755 0.808637 9.38562 0.808633 8.92683C0.808633 7.82139 0.808633 5.8781 0.808633 4.77286C0.808631 4.31425 1.18027 3.9424 1.63888 3.94214C3.32505 3.94073 5.01123 3.93619 6.69738 3.94279C6.77091 3.94366 6.84438 3.94509 6.91789 3.94711C7.11243 3.95396 7.30664 3.96534 7.50047 3.98356C7.8817 4.01938 8.26068 4.07872 8.63472 4.16063C9.00076 4.24079 9.362 4.34256 9.71643 4.46411C9.99909 4.56105 10.2774 4.67055 10.5507 4.79139C10.7787 4.89222 11.0032 5.00092 11.224 5.11675C12.7098 5.89629 14.0096 6.98776 15.1757 8.18507C15.3889 8.40393 15.5979 8.62679 15.8034 8.85285L16.3483 9.4752L15.8144 10.1405C15.3806 10.6964 14.9567 11.2598 14.5353 11.8252C14.0312 12.504 13.5308 13.1855 13.0264 13.8641L12.741 14.2297L12.741 14.2297Z" fill="white"/>
              <Path fill-rule="evenodd" clip-rule="evenodd" d="M28.2224 9.757L28.1384 9.75854C27.9372 9.76407 27.7371 9.78532 27.5395 9.82402C26.8557 9.95801 26.2236 10.2854 25.6529 10.6763C25.5441 10.7509 25.4371 10.8281 25.3319 10.9075C24.7196 11.3695 24.1625 11.9024 23.6368 12.4597C23.0073 13.1272 22.4211 13.8346 21.8536 14.5551L21.0575 15.5974L20.682 16.0891C20.1268 16.8341 19.5774 17.5834 19.0232 18.3291C18.6087 18.8848 18.1916 19.4385 17.7646 19.9847L17.4273 20.4028L16.7782 21.2075C16.5259 21.5093 16.2692 21.8074 16.0067 22.1005C15.8026 22.3285 15.5951 22.5534 15.3835 22.7745C14.1349 24.08 12.7337 25.2716 11.115 26.0931C10.9121 26.196 10.7061 26.2929 10.4972 26.3833C10.222 26.5023 9.94186 26.6099 9.65741 26.7048C9.27818 26.8313 8.89139 26.9352 8.49954 27.0145C8.12246 27.0908 7.74076 27.1443 7.35718 27.1742C7.16216 27.1894 6.96686 27.1977 6.7713 27.2015C6.70025 27.2024 6.7004 27.2024 6.62928 27.2027C6.62928 27.2027 3.24749 27.2027 1.63932 27.2027C1.419 27.2027 1.2077 27.1151 1.05191 26.9594C0.896117 26.8036 0.808594 26.5923 0.808594 26.372C0.808594 25.2673 0.808594 23.3259 0.808594 22.2202C0.808595 21.9995 0.89645 21.7878 1.05276 21.632C1.20908 21.4761 1.421 21.3889 1.64174 21.3895C3.33311 21.3967 5.01392 21.4196 6.70913 21.3866C6.76543 21.3851 6.82161 21.3825 6.87781 21.3787C7.04448 21.3664 7.21001 21.3437 7.37359 21.3093C8.06915 21.1632 8.71065 20.8235 9.29004 20.4206C9.42274 20.3284 9.55273 20.2322 9.68031 20.133C10.2978 19.6528 10.8603 19.1041 11.392 18.5315C12.0232 17.8516 12.6124 17.1333 13.1837 16.4027L13.799 15.5911L14.5072 14.6569C14.9612 14.0438 15.4134 13.4294 15.8683 12.817C16.282 12.2618 16.6982 11.7085 17.1242 11.1626L17.4301 10.7836L18.1915 9.84037C18.4439 9.53963 18.7008 9.24268 18.9635 8.95088C19.1678 8.72395 19.3755 8.50011 19.5872 8.28015C20.8376 6.9813 22.2431 5.79893 23.8667 4.9944C24.0704 4.89344 24.2772 4.79867 24.4868 4.71062C24.7631 4.59454 25.0444 4.49019 25.3299 4.39875C25.7105 4.27682 26.0986 4.1779 26.4915 4.104C27.0605 3.99696 27.6378 3.94478 28.2166 3.94251H28.2223V0.619629L35.2835 6.85003L28.2223 13.0804V9.75701L28.2224 9.757ZM28.2224 21.3876V18.0647L35.2835 24.2951L28.2224 30.5255V27.2027H28.2167C27.6367 27.2004 27.0583 27.1484 26.488 27.0417C26.0943 26.968 25.7053 26.8693 25.3236 26.7477C25.0375 26.6564 24.7555 26.5523 24.4783 26.4364C24.2681 26.3485 24.0607 26.2539 23.8563 26.1531C22.2674 25.3692 20.885 24.2243 19.6534 22.9622C19.4398 22.7433 19.2303 22.5204 19.0243 22.2942L18.5104 21.7081L19.0734 21.0081C19.5085 20.4517 19.9335 19.8875 20.3558 19.3213C20.8608 18.6418 21.3619 17.9594 21.8667 17.2798L22.1157 16.9602C22.6662 17.6429 23.2204 18.2913 23.8152 18.9009C24.3183 19.4165 24.8517 19.9072 25.4358 20.3303C26.0625 20.7841 26.764 21.1712 27.5305 21.3206C27.7493 21.3633 27.9711 21.3849 28.1939 21.3875L28.2223 21.3876H28.2224ZM12.741 14.2297L11.7126 13.0008C11.1165 12.3277 10.4854 11.679 9.78491 11.1135C9.65677 11.01 9.52623 10.9095 9.39296 10.8128C9.28852 10.737 9.1824 10.6634 9.07447 10.5926C8.51352 10.2247 7.89381 9.92389 7.22811 9.80926C7.03763 9.77646 6.8451 9.75995 6.65188 9.75768L6.61797 9.75755C6.61797 9.75755 3.24504 9.75755 1.63935 9.75755C1.18056 9.75755 0.808637 9.38562 0.808633 8.92683C0.808633 7.82139 0.808633 5.8781 0.808633 4.77286C0.808631 4.31425 1.18027 3.9424 1.63888 3.94214C3.32505 3.94073 5.01123 3.93619 6.69738 3.94279C6.77091 3.94366 6.84438 3.94509 6.91789 3.94711C7.11243 3.95396 7.30664 3.96534 7.50047 3.98356C7.8817 4.01938 8.26068 4.07872 8.63472 4.16063C9.00076 4.24079 9.362 4.34256 9.71643 4.46411C9.99909 4.56105 10.2774 4.67055 10.5507 4.79139C10.7787 4.89222 11.0032 5.00092 11.224 5.11675C12.7098 5.89629 14.0096 6.98776 15.1757 8.18507C15.3889 8.40393 15.5979 8.62679 15.8034 8.85285L16.3483 9.4752L15.8144 10.1405C15.3806 10.6964 14.9567 11.2598 14.5353 11.8252C14.0312 12.504 13.5308 13.1855 13.0264 13.8641L12.741 14.2297L12.741 14.2297Z" fill="#00E0FF"/>
              </G>
            </Svg>
            <NativeText 
            onPress={() => this.props.navigation.navigate('Profile', {user: item.reUser, dark: this.state.dark})} 
            style={{backgroundColor: '#C4C4C4', padding: 2}}> {item.reUser} </NativeText>
            </View> : null} {item.text ? this.formatText(item.text) : '...'}</NativeText>}
            accessoryRight={evaProps => <TouchableOpacity onPress={() => 
              this.setState({showMoreOptions: true, currentPostIdx: index}) }>
              <EnIcon name="dots-three-horizontal" color="#ABABAB" size={25} />
              </TouchableOpacity>}
          />
        </View>
        <View style={{ borderRadius: 5, padding: 0}}>
        {item.remixUri ? 
        this.state.imageUrls[index] && this.state.imageUrls[index].length
          ? this.state.imageUrls[index].map((uri) => (
        <Carousel
              data={[
                {uri: item.remixUri, id: item.id},
                {uri: uri, id: item.id},
              ]}
              renderItem={({item, idx}) => (
                <TouchableWithoutFeedback onPress={() => 
                  this.props.navigation.navigate('ViewPost', {id: parseInt(item.id), dark: this.state.dark })}>
                  <FastImage
                  source={{uri: item.uri}}
                  style={{width: '95%', height: (Dimensions.get('window').height * 50) / 100, marginLeft: '2.5%'}}
                /></TouchableWithoutFeedback>
              )}
              sliderWidth={Dimensions.get('window').width}
              itemWidth={Dimensions.get('screen').width}
              layout={'stack'} layoutCardOffset={`18`}
              firstItem={1}
              inactiveSlideOpacity={1}
            />
          )) :  <FastImage source={require('./GemsIcons/loader.png')} style={{alignSelf: 'center', marginTop: 10, width: Dimensions.get('window').width, height: Dimensions.get('window').width}} />
        :
        this.state.imageUrls[index] && this.state.imageUrls[index].length
          ? this.state.imageUrls[index].map((uri) => (
            <ScaledImage
              source={{uri: uri}} key={uri}
              style={{ alignSelf: 'center',
               marginBottom: 0, marginLeft: '2.5%', borderRadius: 10, resizeMode: 'contain' }}
              width={(Dimensions.get('window').width * 100)/95}
              onPress={() => this.props.navigation.navigate('ViewPost', {id: item.id, dark: this.state.dark })}
             />
            ))
          : <FastImage source={require('./GemsIcons/loader.png')} style={{alignSelf: 'center', marginTop: 10, width: Dimensions.get('window').width, height: Dimensions.get('window').width}} />

         }
        <View style={{ flexDirection: 'row', backgroundColor: 'transparent', marginVertical: 10, paddingLeft: 10}}>
        <View>
        <TouchableOpacity style={{ borderRadius: 35, elevation: 3, shadowColor: '#f2f2f2', marginHorizontal: 9,
          backgroundColor: 'white', paddingTop: 16, paddingHorizontal: 14, paddingBottom: 12, marginTop: 4}}
          onPress={() => this.lovePosts(item.id, item.user)}> 
             {this.state.loves[index].isliked ? 
             <Svg width="27" height="27" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
             <Path d="M31.2601 6.91501C30.4939 6.14851 29.5843 5.54048 28.5831 5.12563C27.5819 4.71079 26.5088 4.49727 25.4251 4.49727C24.3413 4.49727 23.2682 4.71079 22.267 5.12563C21.2658 5.54048 20.3562 6.14851 19.5901 6.91501L18.0001 8.50501L16.4101 6.91501C14.8625 5.36747 12.7636 4.49807 10.5751 4.49807C8.38651 4.49807 6.28759 5.36747 4.74006 6.91501C3.19252 8.46255 2.32312 10.5615 2.32312 12.75C2.32312 14.9386 3.19252 17.0375 4.74006 18.585L6.33006 20.175L18.0001 31.845L29.6701 20.175L31.2601 18.585C32.0265 17.8189 32.6346 16.9092 33.0494 15.908C33.4643 14.9069 33.6778 13.8337 33.6778 12.75C33.6778 11.6663 33.4643 10.5932 33.0494 9.59197C32.6346 8.59079 32.0265 7.68114 31.2601 6.91501Z" fill="#FF007A" stroke="#FF007A" stroke-width="3.75" stroke-linecap="round" stroke-linejoin="round"/>
             </Svg>
              :
              <Svg width="27" height="27" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <Path fill-rule="evenodd" clip-rule="evenodd" d="M21.5493 3.39344C22.778 2.88432 24.095 2.62227 25.4251 2.62227C26.7551 2.62227 28.0721 2.88432 29.3008 3.39344C30.5293 3.90246 31.6454 4.64847 32.5856 5.58887C33.5263 6.52913 34.2725 7.64551 34.7816 8.87424C35.2907 10.103 35.5528 11.42 35.5528 12.75C35.5528 14.08 35.2907 15.397 34.7816 16.6258C34.2725 17.8544 33.5264 18.9706 32.5859 19.9108C32.5858 19.9109 32.586 19.9107 32.5859 19.9108L19.3259 33.1708C18.5936 33.9031 17.4065 33.9031 16.6742 33.1708L3.41423 19.9108C1.51506 18.0117 0.44812 15.4358 0.44812 12.75C0.44812 10.0642 1.51506 7.48835 3.41423 5.58918C5.3134 3.69001 7.88923 2.62307 10.5751 2.62307C13.2609 2.62307 15.8367 3.69001 17.7359 5.58918L16.4101 6.91501M17.7359 5.58918L18.0001 5.85336L18.2639 5.58949C18.264 5.58939 18.2638 5.5896 18.2639 5.58949C19.2041 4.64894 20.3207 3.90251 21.5493 3.39344M29.9339 8.24052C29.3419 7.64823 28.639 7.17838 27.8654 6.85782C27.0917 6.53726 26.2625 6.37227 25.4251 6.37227C24.5876 6.37227 23.7584 6.53726 22.9848 6.85782C22.2111 7.17838 21.5082 7.64823 20.9162 8.24052L19.3259 9.83083C18.5936 10.5631 17.4065 10.5631 16.6742 9.83083L15.0842 8.24083C13.8883 7.04492 12.2663 6.37307 10.5751 6.37307C8.88379 6.37307 7.26179 7.04492 6.06588 8.24083C4.86997 9.43674 4.19812 11.0587 4.19812 12.75C4.19812 14.4413 4.86997 16.0633 6.06588 17.2592L18.0001 29.1934L29.9342 17.2592C30.5265 16.6672 30.9967 15.964 31.3172 15.1903C31.6378 14.4167 31.8028 13.5874 31.8028 12.75C31.8028 11.9126 31.6378 11.0834 31.3172 10.3097C30.9967 9.53606 30.5262 8.83253 29.9339 8.24052Z" fill="#ABABAB"/>
              </Svg>
              }
        </TouchableOpacity>
        {this.state.loves[index].loves > 0 ?
        <Text style={{textAlign: 'center', color: this.state.loves[index].isliked ? 
        '#FF007A' : this.state.dark ? "white" : '#ABABAB', }}>{this.state.loves[index].loves}</Text> : null}
        </View>
        <View>
        <TouchableOpacity style={{borderRadius: 5, elevation: 3, shadowColor: '#f2f2f2', marginHorizontal: 10,
          backgroundColor: 'white', paddingTop: 13, paddingHorizontal: 12, paddingLeft: 14, paddingBottom: 11, marginTop: 4}}
        onPress={() => {
          this.state.imageUrls[index] && this.state.imageUrls[index].length
          ? this.state.imageUrls[index].map((uri) => (
            this.props.navigation.navigate('Create', {mixContent: uri, mixId: item.id, dark: this.state.dark, user: this.state.user})
          )) : ToastAndroid.show('Please Try Again', ToastAndroid.SHORT)
        }}>
           <Svg width="30" height="31" viewBox="0 0 36 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <G filter="url(#filter0_i)">
            <Path fill-rule="evenodd" clip-rule="evenodd" d="M28.2224 9.757L28.1384 9.75854C27.9372 9.76407 27.7371 9.78532 27.5395 9.82402C26.8557 9.95801 26.2236 10.2854 25.6529 10.6763C25.5441 10.7509 25.4371 10.8281 25.3319 10.9075C24.7196 11.3695 24.1625 11.9024 23.6368 12.4597C23.0073 13.1272 22.4211 13.8346 21.8536 14.5551L21.0575 15.5974L20.682 16.0891C20.1268 16.8341 19.5774 17.5834 19.0232 18.3291C18.6087 18.8848 18.1916 19.4385 17.7646 19.9847L17.4273 20.4028L16.7782 21.2075C16.5259 21.5093 16.2692 21.8074 16.0067 22.1005C15.8026 22.3285 15.5951 22.5534 15.3835 22.7745C14.1349 24.08 12.7337 25.2716 11.115 26.0931C10.9121 26.196 10.7061 26.2929 10.4972 26.3833C10.222 26.5023 9.94186 26.6099 9.65741 26.7048C9.27818 26.8313 8.89139 26.9352 8.49954 27.0145C8.12246 27.0908 7.74076 27.1443 7.35718 27.1742C7.16216 27.1894 6.96686 27.1977 6.7713 27.2015C6.70025 27.2024 6.7004 27.2024 6.62928 27.2027C6.62928 27.2027 3.24749 27.2027 1.63932 27.2027C1.419 27.2027 1.2077 27.1151 1.05191 26.9594C0.896117 26.8036 0.808594 26.5923 0.808594 26.372C0.808594 25.2673 0.808594 23.3259 0.808594 22.2202C0.808595 21.9995 0.89645 21.7878 1.05276 21.632C1.20908 21.4761 1.421 21.3889 1.64174 21.3895C3.33311 21.3967 5.01392 21.4196 6.70913 21.3866C6.76543 21.3851 6.82161 21.3825 6.87781 21.3787C7.04448 21.3664 7.21001 21.3437 7.37359 21.3093C8.06915 21.1632 8.71065 20.8235 9.29004 20.4206C9.42274 20.3284 9.55273 20.2322 9.68031 20.133C10.2978 19.6528 10.8603 19.1041 11.392 18.5315C12.0232 17.8516 12.6124 17.1333 13.1837 16.4027L13.799 15.5911L14.5072 14.6569C14.9612 14.0438 15.4134 13.4294 15.8683 12.817C16.282 12.2618 16.6982 11.7085 17.1242 11.1626L17.4301 10.7836L18.1915 9.84037C18.4439 9.53963 18.7008 9.24268 18.9635 8.95088C19.1678 8.72395 19.3755 8.50011 19.5872 8.28015C20.8376 6.9813 22.2431 5.79893 23.8667 4.9944C24.0704 4.89344 24.2772 4.79867 24.4868 4.71062C24.7631 4.59454 25.0444 4.49019 25.3299 4.39875C25.7105 4.27682 26.0986 4.1779 26.4915 4.104C27.0605 3.99696 27.6378 3.94478 28.2166 3.94251H28.2223V0.619629L35.2835 6.85003L28.2223 13.0804V9.75701L28.2224 9.757ZM28.2224 21.3876V18.0647L35.2835 24.2951L28.2224 30.5255V27.2027H28.2167C27.6367 27.2004 27.0583 27.1484 26.488 27.0417C26.0943 26.968 25.7053 26.8693 25.3236 26.7477C25.0375 26.6564 24.7555 26.5523 24.4783 26.4364C24.2681 26.3485 24.0607 26.2539 23.8563 26.1531C22.2674 25.3692 20.885 24.2243 19.6534 22.9622C19.4398 22.7433 19.2303 22.5204 19.0243 22.2942L18.5104 21.7081L19.0734 21.0081C19.5085 20.4517 19.9335 19.8875 20.3558 19.3213C20.8608 18.6418 21.3619 17.9594 21.8667 17.2798L22.1157 16.9602C22.6662 17.6429 23.2204 18.2913 23.8152 18.9009C24.3183 19.4165 24.8517 19.9072 25.4358 20.3303C26.0625 20.7841 26.764 21.1712 27.5305 21.3206C27.7493 21.3633 27.9711 21.3849 28.1939 21.3875L28.2223 21.3876H28.2224ZM12.741 14.2297L11.7126 13.0008C11.1165 12.3277 10.4854 11.679 9.78491 11.1135C9.65677 11.01 9.52623 10.9095 9.39296 10.8128C9.28852 10.737 9.1824 10.6634 9.07447 10.5926C8.51352 10.2247 7.89381 9.92389 7.22811 9.80926C7.03763 9.77646 6.8451 9.75995 6.65188 9.75768L6.61797 9.75755C6.61797 9.75755 3.24504 9.75755 1.63935 9.75755C1.18056 9.75755 0.808637 9.38562 0.808633 8.92683C0.808633 7.82139 0.808633 5.8781 0.808633 4.77286C0.808631 4.31425 1.18027 3.9424 1.63888 3.94214C3.32505 3.94073 5.01123 3.93619 6.69738 3.94279C6.77091 3.94366 6.84438 3.94509 6.91789 3.94711C7.11243 3.95396 7.30664 3.96534 7.50047 3.98356C7.8817 4.01938 8.26068 4.07872 8.63472 4.16063C9.00076 4.24079 9.362 4.34256 9.71643 4.46411C9.99909 4.56105 10.2774 4.67055 10.5507 4.79139C10.7787 4.89222 11.0032 5.00092 11.224 5.11675C12.7098 5.89629 14.0096 6.98776 15.1757 8.18507C15.3889 8.40393 15.5979 8.62679 15.8034 8.85285L16.3483 9.4752L15.8144 10.1405C15.3806 10.6964 14.9567 11.2598 14.5353 11.8252C14.0312 12.504 13.5308 13.1855 13.0264 13.8641L12.741 14.2297L12.741 14.2297Z" fill="white"/>
            <Path fill-rule="evenodd" clip-rule="evenodd" d="M28.2224 9.757L28.1384 9.75854C27.9372 9.76407 27.7371 9.78532 27.5395 9.82402C26.8557 9.95801 26.2236 10.2854 25.6529 10.6763C25.5441 10.7509 25.4371 10.8281 25.3319 10.9075C24.7196 11.3695 24.1625 11.9024 23.6368 12.4597C23.0073 13.1272 22.4211 13.8346 21.8536 14.5551L21.0575 15.5974L20.682 16.0891C20.1268 16.8341 19.5774 17.5834 19.0232 18.3291C18.6087 18.8848 18.1916 19.4385 17.7646 19.9847L17.4273 20.4028L16.7782 21.2075C16.5259 21.5093 16.2692 21.8074 16.0067 22.1005C15.8026 22.3285 15.5951 22.5534 15.3835 22.7745C14.1349 24.08 12.7337 25.2716 11.115 26.0931C10.9121 26.196 10.7061 26.2929 10.4972 26.3833C10.222 26.5023 9.94186 26.6099 9.65741 26.7048C9.27818 26.8313 8.89139 26.9352 8.49954 27.0145C8.12246 27.0908 7.74076 27.1443 7.35718 27.1742C7.16216 27.1894 6.96686 27.1977 6.7713 27.2015C6.70025 27.2024 6.7004 27.2024 6.62928 27.2027C6.62928 27.2027 3.24749 27.2027 1.63932 27.2027C1.419 27.2027 1.2077 27.1151 1.05191 26.9594C0.896117 26.8036 0.808594 26.5923 0.808594 26.372C0.808594 25.2673 0.808594 23.3259 0.808594 22.2202C0.808595 21.9995 0.89645 21.7878 1.05276 21.632C1.20908 21.4761 1.421 21.3889 1.64174 21.3895C3.33311 21.3967 5.01392 21.4196 6.70913 21.3866C6.76543 21.3851 6.82161 21.3825 6.87781 21.3787C7.04448 21.3664 7.21001 21.3437 7.37359 21.3093C8.06915 21.1632 8.71065 20.8235 9.29004 20.4206C9.42274 20.3284 9.55273 20.2322 9.68031 20.133C10.2978 19.6528 10.8603 19.1041 11.392 18.5315C12.0232 17.8516 12.6124 17.1333 13.1837 16.4027L13.799 15.5911L14.5072 14.6569C14.9612 14.0438 15.4134 13.4294 15.8683 12.817C16.282 12.2618 16.6982 11.7085 17.1242 11.1626L17.4301 10.7836L18.1915 9.84037C18.4439 9.53963 18.7008 9.24268 18.9635 8.95088C19.1678 8.72395 19.3755 8.50011 19.5872 8.28015C20.8376 6.9813 22.2431 5.79893 23.8667 4.9944C24.0704 4.89344 24.2772 4.79867 24.4868 4.71062C24.7631 4.59454 25.0444 4.49019 25.3299 4.39875C25.7105 4.27682 26.0986 4.1779 26.4915 4.104C27.0605 3.99696 27.6378 3.94478 28.2166 3.94251H28.2223V0.619629L35.2835 6.85003L28.2223 13.0804V9.75701L28.2224 9.757ZM28.2224 21.3876V18.0647L35.2835 24.2951L28.2224 30.5255V27.2027H28.2167C27.6367 27.2004 27.0583 27.1484 26.488 27.0417C26.0943 26.968 25.7053 26.8693 25.3236 26.7477C25.0375 26.6564 24.7555 26.5523 24.4783 26.4364C24.2681 26.3485 24.0607 26.2539 23.8563 26.1531C22.2674 25.3692 20.885 24.2243 19.6534 22.9622C19.4398 22.7433 19.2303 22.5204 19.0243 22.2942L18.5104 21.7081L19.0734 21.0081C19.5085 20.4517 19.9335 19.8875 20.3558 19.3213C20.8608 18.6418 21.3619 17.9594 21.8667 17.2798L22.1157 16.9602C22.6662 17.6429 23.2204 18.2913 23.8152 18.9009C24.3183 19.4165 24.8517 19.9072 25.4358 20.3303C26.0625 20.7841 26.764 21.1712 27.5305 21.3206C27.7493 21.3633 27.9711 21.3849 28.1939 21.3875L28.2223 21.3876H28.2224ZM12.741 14.2297L11.7126 13.0008C11.1165 12.3277 10.4854 11.679 9.78491 11.1135C9.65677 11.01 9.52623 10.9095 9.39296 10.8128C9.28852 10.737 9.1824 10.6634 9.07447 10.5926C8.51352 10.2247 7.89381 9.92389 7.22811 9.80926C7.03763 9.77646 6.8451 9.75995 6.65188 9.75768L6.61797 9.75755C6.61797 9.75755 3.24504 9.75755 1.63935 9.75755C1.18056 9.75755 0.808637 9.38562 0.808633 8.92683C0.808633 7.82139 0.808633 5.8781 0.808633 4.77286C0.808631 4.31425 1.18027 3.9424 1.63888 3.94214C3.32505 3.94073 5.01123 3.93619 6.69738 3.94279C6.77091 3.94366 6.84438 3.94509 6.91789 3.94711C7.11243 3.95396 7.30664 3.96534 7.50047 3.98356C7.8817 4.01938 8.26068 4.07872 8.63472 4.16063C9.00076 4.24079 9.362 4.34256 9.71643 4.46411C9.99909 4.56105 10.2774 4.67055 10.5507 4.79139C10.7787 4.89222 11.0032 5.00092 11.224 5.11675C12.7098 5.89629 14.0096 6.98776 15.1757 8.18507C15.3889 8.40393 15.5979 8.62679 15.8034 8.85285L16.3483 9.4752L15.8144 10.1405C15.3806 10.6964 14.9567 11.2598 14.5353 11.8252C14.0312 12.504 13.5308 13.1855 13.0264 13.8641L12.741 14.2297L12.741 14.2297Z" fill="#00E0FF"/>
            </G>
          </Svg>
        </TouchableOpacity>
        {parseInt(item.remixCount) > 0 ?
        <Text style={{textAlign: 'center', color: '#00E0FF' }}>{item.remixCount}</Text> : null}
        </View>
        <View>
        <TouchableOpacity style={{ marginLeft: 5, paddingTop: 0, alignItems: 'center', justifyContent: 'center'}}
            onPress={() => {
                this.state.imageUrls[index] && this.state.imageUrls[index].length
                ? this.state.imageUrls[index].map((uri) => (
                  Share.share({
                    message:
                    'Check the Awesome Meme in Meme app ' + uri,
                  })
                )) : null
              }}>
          <FIcon name="triangle" size={63} color='white' style={{shadowOpacity: 0.4, textShadowRadius: 5, 
            textShadowOffset:{width: -1, height: 1}, letterSpacing: 10, textShadowColor: 'rgba(0, 0, 0, 0.3)'}} />      
           <Icon name="triangle" size={63} color='white' style={{position: 'absolute', alignSelf: 'center'}} />          
           <Svg width="32" height="33" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg"
           style={{position: 'absolute', top: 20, right: 23}}>
            <Path d="M28.625 22.7505C27.3003 22.7505 26.0828 23.2086 25.1217 23.9748L19.1166 20.2216C19.2945 19.4172 19.2945 18.5837 19.1166 17.7793L25.1217 14.0261C26.0828 14.7923 27.3003 15.2505 28.625 15.2505C31.7316 15.2505 34.25 12.7321 34.25 9.62549C34.25 6.51891 31.7316 4.00049 28.625 4.00049C25.5184 4.00049 23 6.51891 23 9.62549C23 10.0449 23.0463 10.4534 23.1334 10.8466L17.1283 14.5998C16.1672 13.8336 14.9497 13.3755 13.625 13.3755C10.5184 13.3755 8 15.8939 8 19.0005C8 22.1071 10.5184 24.6255 13.625 24.6255C14.9497 24.6255 16.1672 24.1673 17.1283 23.4012L23.1334 27.1543C23.0446 27.5553 22.9999 27.9648 23 28.3755C23 31.4821 25.5184 34.0005 28.625 34.0005C31.7316 34.0005 34.25 31.4821 34.25 28.3755C34.25 25.2689 31.7316 22.7505 28.625 22.7505Z" fill="#8000FE"/>
           </Svg>
          </TouchableOpacity>
        </View> 
        <TouchableOpacity style={{marginHorizontal: 10, alignItems: 'flex-end', position: 'absolute', right: 23, top: 18,
           alignSelf: 'flex-end'}}
                onPress={() => this.setState({showAwards: true, currentAwardUser: item.user})}>
             <FIcon name="gift" size={29} color='#ababab' />      
           </TouchableOpacity>
        </View>   
          <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'space-between', width: '95%', alignItems: 'center'}}
          onPress={() =>  {
            this.setState({showComments: true, currentPostId: item.id, currentPostAuthor: item.user})
            this.fetchComments(item.id)
          }}>
            <TouchableOpacity style={{marginTop: 20, marginBottom: 25, marginLeft: 25, alignSelf: 'center'}}
               onPress={() => {
                this.setState({showComments: true, currentPostId: item.id, currentPostAuthor: item.user})
                this.fetchComments(item.id)
               }}>
              <Text style={{color: '#dbdbdb'}}>type a comment</Text></TouchableOpacity>
              <View style={{height: 30, marginHorizontal: 10, marginRight: 16, flexDirection: 'row'}}>
                <FIcon name='message-circle' size={30} color="#ababab" />
              <Text style={{fontWeight: 'bold', color: this.state.dark ?'white' : '#5c5c5c', marginLeft: 3,
                position: 'absolute', left: 31 }}>{parseInt(item.comments) > 0 ? item.comments : null}</Text>
              </View>
          </TouchableOpacity>
          </View>
        </View>
  )
    renderComments = ({item, idx}) => (
      parseInt(item.replyId) > 0 ? null :
      <> 
      <NativeText style={{fontWeight: 'bold', marginLeft : 5,
       color: '#6D6D6D'}}>{item.user} {this.state.language == 'en' ? <NativeText style={{color: '#BABABA', fontSize: 12, fontWeight: 'normal'}}>
         {item.time}</NativeText> : <PowerTranslator style={{color: '#BABABA', fontSize: 12, fontWeight: 'normal'}} text={item.time} target={this.state.language}  />}</NativeText>
      
      <TouchableOpacity onPress={() => {
        this.setState({replyingTo: parseInt(item.id), replyingPerson: item.user})
        this.commentBox.focus()
      }} >
      <View style={{flexDirection :'row', marginVertical: 10, backgroundColor: '#fff', borderRadius: 30, alignSelf: 'flex-start',
       maxWidth: '80%'}}>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', {user: item.user, dark: this.state.dark})}
        ><Avatar size='medium' style={{marginRight: 5, height: 45, width: 45}}
             source={{uri: item.userpic}} /></TouchableOpacity>
         {item.image ? <FastImage source={{uri: item.image}} style={{
          width: 100, height: 100}}/> : <View 
          style={{backgroundColor: this.state.dark ? '#151a30' : '#fff', padding: 10, borderRadius: 20,}}>
                <Text style={{fontWeight: 'bold', marginHorizontal: 10}}>{this.state.language == 'en' ? 
                <Text style={{elevation: 6, zIndex: 6, fontWeight: 'bold'}}>{item.text}</Text> :
        <PowerTranslator text={item.text} style={{elevation: 6, zIndex: 6, color: this.state.dark ? 'white' : 'black', fontWeight: 'bold'}} target={this.state.language} />}</Text>
           </View>}
      </View>
      </TouchableOpacity>
     {this.state.comments.some(e => e.replyId === item.id)?
      <View style={{marginLeft: '10%', alignSelf: 'flex-start', backgroundColor: '#fff', borderRadius: 30, padding: 15, maxWidth: '90%'}}>
          {this.state.comments.map(itm => {
            if(itm.replyId == item.id){
              return  <View style={{flexDirection :'row', backgroundColor: '#fff', borderRadius: 30, alignSelf: 'flex-start', 
              width: '100%', marginVertical: 10}}>
               <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', {user: itm.user, dark: this.state.dark})}
               ><Avatar size='medium' style={{marginRight: 5}}
                    source={{uri: itm.userpic}} /></TouchableOpacity>

                {itm.image ? 
                <FastImage source={{uri: itm.image}} style={{
                 width: 100, height: 100}}/> : 
                <View style={{backgroundColor: this.state.dark ? '#151a30' : '#fff', padding: 10, borderRadius: 20,}}>
                <NativeText style={{marginHorizontal: 10}}>{this.state.language == 'en' ? 
                <NativeText style={{elevation: 6, zIndex: 6, textAlign: 'left'}}>
                  {itm.text} <NativeText style={{color: '#BABABA', fontSize: 12, fontWeight: 'normal'}}>{itm.time}</NativeText>
                </NativeText> 
                : <PowerTranslator text={itm.text} style={{elevation: 6, zIndex: 6, color: this.state.dark ? 'white' : 'black'}} target={this.state.language} />}</NativeText>
                  </View>}

             </View>
            }
          })}
      </View> : null}
      </>
    )
    newComment (item) {
      this.setState({newcomment: ''})
      if(this.state.newcomment){
        this.socket.emit('newComment', {
          lid: item.id,
          user: this.state.user,
          text: this.state.newcomment,
          url: '',
          to: item.user
        })
      }else { alert('Comment Field is Empty!') }
     }
    Empty(){
      return (
            <Layout style={{justifyContent: 'center', flex: 1, backgroundColor: 'transparent'}}>
            <ScaledImage uri='https://monophy.com/media/idRGkOxrjQtucjh8GA/monophy.gif'
            width={100}/>
          <Text style={{fontSize:18,
           fontWeight:'bold', color:'grey', textAlign: 'center'}}>
          None said a word 
          </Text>
          </Layout>
      )
    }
    Loading(){
      return (
        <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent'}}>
        <FastImage source={{uri: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/35771931234507.564a1d2403b3a.gif', 
        priority: FastImage.priority.high,}} style={{
          width: 200, height: 200
        }}/>
        </Layout>
      )
    }
    lovePosts(id, author){
      this.setState((state) => {
        const loves = state.loves.map((el) => {
          if (el.id === id) {
            if (el.isliked == true) {
              el.loves = parseInt(el.loves) - 1
              el.isliked = !el.isliked
            } else {
              el.loves = parseInt(el.loves) + 1
              el.isliked = !el.isliked
            }
          }
          return el
        });
        const isPress = !state.isPress
        return { loves, isPress }
      })
      fetch('https://lishup.com/app/love.php', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          user: this.state.user,
          author: author,
        }),
      })

    }
    reportPost(){
      if(this.state.reportReason){
      fetch('https://lishup.com/app/newreport.php', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: this.state.user, lid: this.state.data[this.state.currentPostIdx].id, reason: this.state.reportReason}),
      })
      .catch((error) => {
        console.log(error)
        ToastAndroid.show('Something went wrong. Retry later', ToastAndroid.SHORT)
      })
      ToastAndroid.show('Reported Successfully', ToastAndroid.SHORT)
      }else{
        Alert.alert('Be specific', 'Please explain what is wrong, this will help us to take effective actions faster')
      }
    }
    deleteMeme(){
      fetch('https://lishup.com/app/deletepost.php', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: this.state.data[this.state.currentPostIdx].id, key: 'idkMeme'}),
      })
      .then(data => {
        ToastAndroid.show('Deleted Meme Successfully', ToastAndroid.SHORT)
        this.props.navigation.navigate('Home')
      })
      .catch((error) => {
        console.log(error)
        ToastAndroid.show('Something went wrong. Retry later', ToastAndroid.SHORT)
      })
          
      }

      addtoBookMarks = async() => {
        var id = this.state.data[this.state.currentPostIdx].id
        try {
          var previous = await AsyncStorage.getItem('bookmarks')
          console.log(JSON.parse(previous))
          if(previous == null) {
            await AsyncStorage.setItem('bookmarks', JSON.stringify([{
              id: this.state.data[this.state.currentPostIdx].id,
              uri: this.state.imageUrls[this.state.currentPostIdx][0]
            }]))
          }else{
            let newAdd = [{ id: id, uri: this.state.imageUrls[this.state.currentPostIdx][0] }]
            let previousData = JSON.parse(previous)
                if(!this.contains(previousData, "id", id)){
                  previousData = previousData.concat(newAdd)
                  await AsyncStorage.setItem('bookmarks', JSON.stringify(previousData))
                  ToastAndroid.show('Bookmarked this Meme', ToastAndroid.SHORT)
                }else{
                  previousData.splice(previousData.findIndex(item => item.id === id), 1)
                  await AsyncStorage.setItem('bookmarks', JSON.stringify(previousData))
                  ToastAndroid.show('Removed Bookmark', ToastAndroid.SHORT)
                }
          }
        } catch(e) {
          ToastAndroid.show('Unable to Bookmark', ToastAndroid.SHORT)
          console.log(e)
        }
      }

    render(){
    if(this.state.isOffline){
      return (
        <ScrollView contentContainerStyle={{justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}
         style={{flex: 1, backgroundColor: 'white'}}>
          <ScaledImage source={require('./noCon.png')}
           width={(Dimensions.get('window').width * 90) / 100}
           style={{marginTop: 20}}
           onPress={() => Linking.openURL('https://dribbble.com/shots/7063712-No-connection')}
           />
          <NativeText style={{fontSize: 35, textAlign: 'center', fontFamily: 'impact',
             margin: 15}}>It seems you are not Online :(</NativeText>
          <TouchableOpacity style={{backgroundColor: 'black', padding: 15, paddingHorizontal: 25}} onPress={() => this.fetch('', 'date_time')}>
              <NativeText style={{color: 'white', fontSize: 20, fontFamily: 'impact', fontWeight: '100'}}>Reload</NativeText>
          </TouchableOpacity>   

        <View style={{height: 2, backgroundColor: 'black', opacity: 0.5, width: '80%', marginVertical: 30}} />
        <TouchableOpacity style={{backgroundColor: 'yellow', padding: 15, paddingHorizontal: 25, borderColor: 'black', borderWidth: 2}}
          onPress={() => this.props.navigation.navigate('Create', {dark: this.state.dark, user: this.state.user})}>
              <NativeText style={{color: 'black', fontSize: 20, fontFamily: 'impact', fontWeight: '100'}}>Create Meme Offline</NativeText>
        </TouchableOpacity> 
        </ScrollView>
      )
    }else{
    if(this.state.loading){
      return(
        <ApplicationProvider
    {...eva}
    theme={eva.light }>
     
        <Layout level="2" style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Create', {dark: this.state.dark, user: this.state.user})} 
        style={{position: 'absolute', zIndex: 100, elevation: 100, bottom: 20, right: 20}}>
        <Svg width="80" height="80" viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
          <Circle cx="65" cy="69" r="51.597" fill="#FF00F5" stroke="#FF00F5" stroke-width="0.806011"/>
          <Path d="M64.9712 88.5652C63.2247 88.5652 61.9148 87.1461 61.9148 85.5088V52.4338C61.9148 50.6873 63.3339 49.3774 64.9712 49.3774C66.6086 49.3774 68.0277 50.7964 68.0277 52.4338V85.5088C68.0277 87.1461 66.7178 88.5652 64.9712 88.5652Z" fill="#FFF"/>
          <Path d="M81.522 71.8629H48.5562C46.8097 71.8629 45.4998 70.4438 45.4998 68.8064C45.4998 67.1691 46.9188 65.75 48.5562 65.75H81.6311C83.3776 65.75 84.6875 67.1691 84.6875 68.8064C84.6875 70.4438 83.2685 71.8629 81.522 71.8629Z" fill="#FFF"/>
          </Svg>
        </TouchableOpacity>
          <FastImage source={{uri: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/35771931234507.564a1d2403b3a.gif', 
          priority: FastImage.priority.high,}} style={{
            width: 100, height: 100
          }}/>
          </Layout>
      </ApplicationProvider>
      )
    }else{
      return(
        <ApplicationProvider {...eva}
        theme={eva.light }>
       <Layout level="2" style={{  flex: 1, margin: 0, padding: 0, backgroundColor: '#F4F4F4'  }}>    
        <FlatList
              ref={(c) => { this._carousel = c; }}
              data={this.state.data}
              renderItem={this.renderPosts}
              extraData={this.state}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              refreshControl={<RefreshControl refreshing={this.state.loading} onRefresh={() => {
                  const { params } = this.props.navigation.state
                  const user = params ? params.user : null

                  this.fetch(user, this.state.feedOrder)
                } } />}
               
           />
            
        
        <Overlay
        animationType="slide"
        transparent={true}
        visible={this.state.showAwards}
        onDismiss={() => {
          this.setState({showAwards: !this.state.showAwards})
        }}
        onBackdropPress={() => {
          this.setState({showAwards: !this.state.showAwards})
        }} overlayStyle={{position: 'absolute', bottom: 0, width: Dimensions.get('window').width, height: "45%"}}>
          <Layout style={{ justifyContent: 'center', alignItems: 'center',
           borderRadius: 0, backgroundColor: this.state.dark ? '#101426' : '#fff', width: "100%", height: "100%", border: 0, margin: 0 }}>
            {this.state.language == 'en' ? <Text category="h6" style={{textAlign: 'center', marginVertical: 10}}>Award User</Text>
            : <PowerTranslator text={'Award User'} style={{textAlign: 'center', marginVertical: 10, color: 
            this.state.dark ? 'white' : 'black'}} target={this.state.language} />}
            <Divider />
            <ButtonGroup status="basic">
              <Button onPress={() => this.setState({awardAmount: 5})} style={{backgroundColor: this.state.dark ? 'transparent' : 'rgba(51, 102, 255, 0.16)'}}><Text style={{fontWeight: 'bold', fontSize: 20}}>5</Text> 
              <Svg width="20" height="15" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Path d="M19.1358 4.50423L9.87037 12.9787L0.604947 4.50423L3.37217 0.459825H16.3686L19.1358 4.50423Z" fill="#ED0063" stroke="#ED0063" stroke-width="0.91965"/>
                </Svg></Button>
              <Button style={{backgroundColor: this.state.dark ? 'transparent' : 'rgba(51, 102, 255, 0.16)'}} onPress={() => this.setState({awardAmount: 10})}><Text style={{fontWeight: 'bold', fontSize: 20}}>10</Text> 
              <Svg width="20" height="15" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Path d="M19.1358 4.50423L9.87037 12.9787L0.604947 4.50423L3.37217 0.459825H16.3686L19.1358 4.50423Z" fill="#ED0063" stroke="#ED0063" stroke-width="0.91965"/>
                </Svg></Button>
              <Button style={{backgroundColor: this.state.dark ? 'transparent' : 'rgba(51, 102, 255, 0.16)'}} onPress={() => this.setState({awardAmount: 20})}><Text style={{fontWeight: 'bold', fontSize: 20}}>20</Text> 
              <Svg width="20" height="15" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Path d="M19.1358 4.50423L9.87037 12.9787L0.604947 4.50423L3.37217 0.459825H16.3686L19.1358 4.50423Z" fill="#ED0063" stroke="#ED0063" stroke-width="0.91965"/>
                </Svg></Button>
            </ButtonGroup>
            <Input keyboardType="numeric" style={{borderColor: 'transparent', borderBottomColor: this.state.dark ? 'white' : 'black', padding: 10, backgroundColor: 'transparent', textAlign: 'center', margin: 10,
              opacity: this.state.awardAmount ? 1 : 0.5}} 
            placeholder="10 Gems" onChangeText={val => this.setState({awardAmount: val})} value={this.state.awardAmount.toString()}
            textStyle={{fontSize: 25, textAlign: 'center'}} accessoryRight={props => <Svg width="25" height="19" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M19.1358 4.50423L9.87037 12.9787L0.604947 4.50423L3.37217 0.459825H16.3686L19.1358 4.50423Z" fill="#ED0063" stroke="#ED0063" stroke-width="0.91965"/>
            </Svg>}/>
            <Button onPress={() => this.award()} style={{backgroundColor: '#F10063', borderRadius: 20, borderColor: 'white'}}>Award Gems</Button>     
          </Layout>
        </Overlay>   

        <CopilotStep
          text="Remix Memes and make your own Version!"
          order={2}
          name="remix"
        >
          <CopilotView style={{position: 'absolute', bottom: 180, left: 120}} />
        </CopilotStep>
        <CopilotStep
          text="Tap to Watch Meeeme Story!"
          order={3}
          name="story"
        >
          <CopilotView style={{position: 'absolute', bottom: 300, left: 120}} />
        </CopilotStep>
        <CopilotStep
          text="Find and Join Contests! Check LeaderBoards!"
          order={4}
          name="contests"
        >
          <CopilotView style={{position: 'absolute', top: 10, left: 100}} />
        </CopilotStep>
        <CopilotStep
          text="Check your Profile! Buy Profile Backgrounds and Sunglasses!!"
          order={5}
          name="profile"
        >
          <CopilotView style={{position: 'absolute', top: 10, left: 20}} />
        </CopilotStep>
        <CopilotStep
          text="Gift Gems to your favourite Memers!"
          order={6}
          name="gift"
        >
          <CopilotView style={{position: 'absolute', bottom: 180, right: 50}} />
        </CopilotStep>
        <CopilotStep
          text="Comment on Memes with 1B+ animated GIF, Stickers and Emoji!"
          order={7}
          name="comments"
        >
          <CopilotView style={{position: 'absolute', bottom: 120, right: 50}} />
        </CopilotStep>
        {!this.state.showComments ? 
        <CopilotStep
          text="Create and Post new Memes!"
          order={1}
          name="create"
        >
          <CopilotTouchableOpacity onPress={() => this.props.navigation.navigate('Create', {dark: this.state.dark, user: this.state.user})} 
        style={{position: 'absolute', zIndex: 100, elevation: 100, bottom: 20, right: 20}}>
        <Svg width="80" height="80" viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
          <Circle cx="65" cy="69" r="51.597" fill="#FF00F5" stroke="#FF00F5" stroke-width="0.806011"/>
          <Path d="M64.9712 88.5652C63.2247 88.5652 61.9148 87.1461 61.9148 85.5088V52.4338C61.9148 50.6873 63.3339 49.3774 64.9712 49.3774C66.6086 49.3774 68.0277 50.7964 68.0277 52.4338V85.5088C68.0277 87.1461 66.7178 88.5652 64.9712 88.5652Z" fill="#FFF"/>
          <Path d="M81.522 71.8629H48.5562C46.8097 71.8629 45.4998 70.4438 45.4998 68.8064C45.4998 67.1691 46.9188 65.75 48.5562 65.75H81.6311C83.3776 65.75 84.6875 67.1691 84.6875 68.8064C84.6875 70.4438 83.2685 71.8629 81.522 71.8629Z" fill="#FFF"/>
          </Svg>
        </CopilotTouchableOpacity></CopilotStep> : null}
        <Overlay
        animationType="slide"
        transparent={true}
        isVisible={this.state.showComments}
        onDismiss={() => {
          this.setState({showComments: !this.state.showComments, comments: [], loadingComments: true, replyingTo: 0, replyingPerson: ''})
        }}
        onBackdropPress={() => {
          this.setState({showComments: !this.state.showComments, comments: [], loadingComments: true, replyingTo: 0, replyingPerson: ''})
        }}
        overlayStyle={{bottom: 0, position: 'absolute', height: '80%', backgroundColor: this.state.dark ? '#101426' : '#F0F0F0', width: "100%"}}
      >
         <Text 
         style={{textAlign: 'center', marginVertical: 10, color: '#ababab'}} category="h6">
           {Object.keys(this.state.comments).length} <Svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 25 25">
          <Path d="M3.12775 18.8879C3.19186 18.6519 3.05016 18.3238 2.91492 18.0873C2.87281 18.0168 2.82714 17.9484 2.77807 17.8825C1.61819 16.1235 0.999979 14.0628 1.00005 11.9558C0.981195 5.90787 5.99628 1 12.1978 1C17.6062 1 22.1207 4.74677 23.1757 9.72037C23.3338 10.4578 23.4136 11.2098 23.4138 11.9639C23.4138 18.0205 18.5922 23.0054 12.3907 23.0054C11.4047 23.0054 10.0739 22.7575 9.34811 22.5544C8.62236 22.3513 7.89768 22.0819 7.71072 22.0097C7.51951 21.9362 7.31643 21.8984 7.11158 21.8982C6.88783 21.8973 6.66623 21.9419 6.46018 22.0291L2.80555 23.3481C2.72548 23.3826 2.64065 23.4047 2.55393 23.4138C2.4855 23.4136 2.4178 23.3998 2.35473 23.3732C2.29167 23.3467 2.2345 23.3079 2.18654 23.2591C2.13858 23.2103 2.10079 23.1524 2.07534 23.0889C2.0499 23.0254 2.03731 22.9574 2.03831 22.889C2.0428 22.8289 2.05364 22.7695 2.07064 22.7117L3.12775 18.8879Z" 
          stroke={this.state.dark ?'white' : '#ababab'} stroke-width="4" stroke-miterlimit="10" stroke-linecap="round"></Path>
          </Svg>
          </Text>
          <TouchableOpacity style={{position: 'absolute', right: 10, top: 10}} onPress={() => this.setState({showComments: false, comments: [], loadingComments: true, replyingTo: 0, replyingPerson: ''})}>
            <Svg width="37" height="46" viewBox="0 0 37 46" fill="none" xmlns="http://www.w3.org/2000/svg">
            <G opacity="0.13">
            <Path fill-rule="evenodd" clip-rule="evenodd" d="M28.4359 12.5691C27.5918 11.7251 26.2233 11.7252 25.3791 12.5694L18.2491 19.6994L11.2559 12.7061C10.4118 11.862 9.04327 11.8621 8.1991 12.7063C7.35493 13.5505 7.35482 14.9191 8.19885 15.7631L15.1921 22.7564L8.06335 29.8852C7.21917 30.7293 7.21906 32.0979 8.06309 32.9419C8.90712 33.786 10.2757 33.7859 11.1198 32.9417L18.2486 25.8129L25.2412 32.8055C26.0853 33.6495 27.4538 33.6494 28.298 32.8052C29.1422 31.9611 29.1423 30.5925 28.2983 29.7485L21.3056 22.7559L28.4356 15.6259C29.2798 14.7817 29.2799 13.4132 28.4359 12.5691Z" fill="black"/>
            </G>
          </Svg></TouchableOpacity>
           {this.state.loadingComments ? this.Loading : <FlatList
            data={this.state.comments}
            keyExtractor={(item, idx) => idx}
            renderItem={this.renderComments}
            style={{width: "100%"}}
            ListEmptyComponent={this.state.loadingComments ? this.Loading : this.Empty}
            />}
            <View style={{flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', bottom: 0, right: 0, left: 0,
            alignItems: 'center'}}>
            <TextInput
              value={this.state.newcomment}
              placeholder={this.state.replyingTo == 0 ? 'Type a Comment...' : 'Reply To ' + this.state.replyingPerson}
              onChangeText={val => this.setState({newcomment: val})}
              maxLength={100}
              ref={(r) => { this.commentBox = r; }}
              style={{backgroundColor: '#fff', borderWidth: 0, width: '100%', borderColor: '#fff', flex: 1, padding: 20, fontSize: 15,
            }}
            multiline={true}
            />
            { this.state.newcomment ?
                <TouchableOpacity onPress={() => {
                  if(this.state.newcomment){
                        this.socket.emit('newComment', {
                          lid: this.state.currentPostId,
                          user: this.state.user,
                          text: this.state.newcomment,
                          url: '',
                          to: this.state.currentPostAuthor,
                          replyId: this.state.replyingTo
                        })
                        this.setState({newcomment: ''})
                      }else { alert('Comment Field is Empty!') }
                    }} style={{ position: 'absolute', right: 10 }}><Icon
                    size={35}
                    color={this.state.dark ?'white' : '#00BBFF'}
                    name='ios-arrow-redo-circle-sharp'
                  /></TouchableOpacity>
                :  <TouchableOpacity style={{ position: 'absolute', right: 10 }} onPress={() => {
                  GiphyUi.present(
                    {
                      theme: this.state.dark ? 'dark' : 'light',
                      layout: 'waterfall',
                      showConfirmationScreen: true,
                      mediaTypes: ['gifs', 'stickers', 'emoji', 'text'],
                    },
                    selectedMedia => {
                      this.socket.emit('newComment', {
                        lid: this.state.currentPostId,
                        user: this.state.user,
                        text: '',
                        image: selectedMedia.images.downsized.url,
                        to: this.state.currentPostAuthor,
                        replyId: this.state.replyingTo
                      })
                    }
                  )
                }} >
                <EnIcon name="emoji-happy" size={35} color='#ABABAB'/>
                </TouchableOpacity>}
            </View>
      </Overlay>
      <Overlay
        transparent={true} 
        isVisible={this.state.showLoveSuggestion}
        onDismiss={() => {
          this.setState({showLoveSuggestion: false})
        }}
        onBackdropPress={() => {
          this.setState({showLoveSuggestion: false})
        }}
        overlayStyle={{bottom: 0, position: 'absolute', height: '40%', backgroundColor: this.state.dark ? '#101426' : '#F0F0F0', width: "100%"}}
      >
         <Text style={{textAlign: 'center', marginVertical: 15}} category="h2">Spread Some Loves?</Text>
         <Text style={{textAlign: 'center', marginVertical: 10}} appearance="hint">Love some memes, it takes just a tap</Text>
         <TouchableOpacity style={{marginTop: 20, padding: 20, alignSelf: 'center', backgroundColor: '#FF007A', borderRadius: 5}}
           onPress={() => {
             this.setState({showLoveSuggestion: false})
             this.state.data.map((i, v) => {
               if( v < 6){
                 this.lovePosts(i.id, i.user)
               }
             })
           }}>
           <Text style={{color: 'white', fontSize: 20}}>Love Memes!</Text>
         </TouchableOpacity>
      </Overlay>
      <Overlay
        animationType="slide"
        transparent={true}
        visible={this.state.showAwards}
        onDismiss={() => {
          this.setState({showAwards: !this.state.showAwards})
        }}
        onBackdropPress={() => {
          this.setState({showAwards: !this.state.showAwards})
        }} overlayStyle={{position: 'absolute', bottom: 0, width: Dimensions.get('window').width, height: "45%"}}>
        <Layout style={{ justifyContent: 'center', alignItems: 'center',
           borderRadius: 0, backgroundColor: '#fff', width: "100%", height: "100%", border: 0, margin: 0 }}>
            {this.state.language == 'en' ? <Text category="h6" style={{textAlign: 'center', marginVertical: 10, color: 'black'}}>Award User</Text>
            : <PowerTranslator text={'Award User'} style={{textAlign: 'center', marginVertical: 10, color: 
            this.state.dark ? 'white' : 'black'}} target={this.state.language} />}
            <Divider />
            <ButtonGroup status="basic">
              <Button onPress={() => this.setState({awardAmount: 5})} style={{backgroundColor: 'rgba(51, 102, 255, 0.16)'}}><NativeText style={{fontWeight: 'bold', fontSize: 20}}>5</NativeText> 
              <Svg width="20" height="15" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Path d="M19.1358 4.50423L9.87037 12.9787L0.604947 4.50423L3.37217 0.459825H16.3686L19.1358 4.50423Z" fill="#ED0063" stroke="#ED0063" stroke-width="0.91965"/>
                </Svg></Button>
              <Button style={{backgroundColor: 'rgba(51, 102, 255, 0.16)'}} onPress={() => this.setState({awardAmount: 10})}><NativeText style={{fontWeight: 'bold', fontSize: 20}}>10</NativeText> 
              <Svg width="20" height="15" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Path d="M19.1358 4.50423L9.87037 12.9787L0.604947 4.50423L3.37217 0.459825H16.3686L19.1358 4.50423Z" fill="#ED0063" stroke="#ED0063" stroke-width="0.91965"/>
                </Svg></Button>
              <Button style={{backgroundColor: 'rgba(51, 102, 255, 0.16)' }} onPress={() => this.setState({awardAmount: 20})}><NativeText style={{fontWeight: 'bold', fontSize: 20}}>20</NativeText> 
              <Svg width="20" height="15" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Path d="M19.1358 4.50423L9.87037 12.9787L0.604947 4.50423L3.37217 0.459825H16.3686L19.1358 4.50423Z" fill="#ED0063" stroke="#ED0063" stroke-width="0.91965"/>
                </Svg></Button>
            </ButtonGroup>
            <Input keyboardType="numeric" style={{borderColor: 'transparent', borderBottomColor: 'black', padding: 10, backgroundColor: 'transparent', textAlign: 'center', margin: 10,
              opacity: this.state.awardAmount ? 1 : 0.5}} 
            placeholder="10 Gems" onChangeText={val => this.setState({awardAmount: val})} value={this.state.awardAmount.toString()}
            textStyle={{fontSize: 25, textAlign: 'center', color: 'black'}} accessoryRight={props =><Svg width="20" height="15" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M19.1358 4.50423L9.87037 12.9787L0.604947 4.50423L3.37217 0.459825H16.3686L19.1358 4.50423Z" fill="#ED0063" stroke="#ED0063" stroke-width="0.91965"/>
            </Svg>}/>
            <Button onPress={() => this.award()} style={{backgroundColor: '#F10063', borderRadius: 20, borderColor: 'white'}}>Award Gems</Button>     
          </Layout>
        </Overlay>  

        <Overlay isVisible={this.state.showMoreOptions} onBackdropPress={() => this.setState({showMoreOptions: !this.state.showMoreOptions})}
         overlayStyle={{width: "80%", minHeight: "30%", borderRadius: 50, backgroundColor: '#fff', paddingHorizontal: 30 }}  animationType="fade">
          <Layout level="4" style={{flex: 1, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', backgroundColor: '#fff'}}>
          {this.state.data[0] ? this.state.user == this.state.data[0].user ? null : <TouchableOpacity onPress={() => this.setState({reportPost: true})}><Icon name="alert-circle" size={50} color='#2E3A59' /></TouchableOpacity>
           : null}
           <TouchableOpacity
             onPress={() => this.addtoBookMarks()}><Icon name="bookmark" size={50} color='#2E3A59' /></TouchableOpacity>
           <TouchableOpacity 
              onPress={() => {
                this.state.imageUrls[this.state.currentPostIdx] && this.state.imageUrls[this.state.currentPostIdx].length
                    ? this.state.imageUrls[this.state.currentPostIdx].map((uri) => (
                      Clipboard.setString(uri)
                    )) : null
                ToastAndroid.show('Copied Meme Link', ToastAndroid.SHORT)
              }}><Icon name="copy" size={50} color='#2E3A59' /></TouchableOpacity>
          {this.state.user == this.state.data[0].user ? <TouchableOpacity 
              onPress={() => {  this.deleteMeme()
              }}><Icon name="ios-trash-bin" size={50} color='#2E3A59' /></TouchableOpacity>    : null}
          </Layout>
          </Overlay>
          <Overlay isVisible={this.state.reportPost} onBackdropPress={() => this.setState({reportPost: !this.state.reportPost})}
         overlayStyle={{width: "80%",  height: "50%", borderRadius: 50, backgroundColor:'#fff', paddingHorizontal: 30 }}  animationType="fade">
          <Layout level="4" style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor:'#fff'}}>
           <Input placeholder="Let us know what is wrong" maxLength={100} textStyle={{minHeight: 60, color: 'black'}} style={{backgroundColor: 'transparent'}}
           multiline={true}  onChangeText={val => this.setState({reportReason: val})} />
           <Button status="danger" style={{margin: 10, alignSelf: 'flex-end'}}
           onPress={() => this.reportPost()}>Report</Button>
          </Layout>
          </Overlay>

          {this.state.showCongrats ? <FastImage source={{uri: 'https://media.giphy.com/media/58FB1ly2YjmVzcaOYv/giphy.gif', 
          priority: FastImage.priority.high}} style={{
            width:"100%", height: "100%", top: 0, position: 'absolute', alignSelf: 'center'
          }} /> : null}
        </Layout>
        </ApplicationProvider>
      )
    }
  }
}
}
class ViewPost extends React.Component{

  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      header: null
    };
  };

  constructor(props){
    super(props)
    this.state = {
      dark: false,
      data: [],
      user: '',
      loading: true,
      imageUrls: [],
      comments: [],
      showLoves: false,
      showCongrats: false,
      showAwards: false,
      currentAwardUser: '',
      awardAmount: 0,
      moreOptions: false,
      reportPost: false,
      reportReason: '',
      language: 'en',
      activeStory: 'main',
      showComments: false,
      x: new Animated.Value(0)
    }
    this.socket = io.connect('https://lishup.com:3000', {secure: true}, { transports: ['websocket'] })
    this.socket.on('connect', function (data) {
    console.log('connected to socket on post')
    })
  }
  componentDidMount(){
    const { params } = this.props.navigation.state
    const id = params ? params.id : null
    const dark = params ? params.dark : null

    this.setState({dark: dark})
    this.props.navigation.setParams({darktheme: dark})

    this.fetchUser(id)
    this.fetchComments(id)
    
    this.socket.on('newComment', data => {
      if(id == data.id){
        let newcomment = {id: data.id, user: data.user, text: data.text, time: data.time, image: data.url}
        this.setState({ comments: [newcomment, ...this.state.comments]  });
      }
  })
  BackHandler.addEventListener('hardwareBackPress', () => {
    this.props.navigation.goBack()
    return true
  })
  }
  componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack()
      return true
    })
  }
  fetchUser = async(id) => {
    try {
      var user = await AsyncStorage.getItem('user')
      var lan = await AsyncStorage.getItem('language')
      if(user !== null) {
        this.setState({user: user, language: lan ? lan : 'en'})
        this.fetch(id)
      }
    } catch(e) {
      ToastAndroid.show('Could Not Get User', ToastAndroid.SHORT)
      console.log(e)
    }
  }
  contains(arr, key, val) {
    for (var i = 0; i < arr.length; i++) {
        if(arr[i][key] === val) return true;
    }
    return false;
  }
  addtoBookMarks = async() => {
    const { params } = this.props.navigation.state
    const id = params ? params.id : null
    try {
      var previous = await AsyncStorage.getItem('bookmarks')
      console.log(JSON.parse(previous))
      if(previous == null) {
        await AsyncStorage.setItem('bookmarks', JSON.stringify([{
          id: id,
          uri: this.state.imageUrls[0][0]
        }]))
        ToastAndroid.show('Bookmarked this Meme', ToastAndroid.SHORT)
      }else{
        let newAdd = [{ id: id, uri: this.state.imageUrls[0][0] }]
        let previousData = JSON.parse(previous)
            if(!this.contains(previousData, "id", id)){
              previousData = previousData.concat(newAdd)
              await AsyncStorage.setItem('bookmarks', JSON.stringify(previousData))
              ToastAndroid.show('Bookmarked this Meme', ToastAndroid.SHORT)
            }else{
              previousData.splice(previousData.findIndex(item => item.id === id), 1)
              await AsyncStorage.setItem('bookmarks', JSON.stringify(previousData))
              ToastAndroid.show('Removed Bookmark', ToastAndroid.SHORT)
            }
      }
    } catch(e) {
      ToastAndroid.show('Unable to Bookmark', ToastAndroid.SHORT)
      console.log(e)
    }
  }
  fetch(id){
    fetch('https://lishup.com/app/getpost.php', {
         method: 'POST',
         headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: this.state.user,
          id: id
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
         this.setState({
            data: responseJson,
            loading: false
         })
         console.log(responseJson[0])
         Promise.all(
          responseJson.map(({ images }) => this.fetchImage(images))
        ).then((imageUrls) => { this.setState({ imageUrls })  } );
      })
      .catch((error) => {
         console.error(error);
      });
  }
  nextPost(type){
    if(type == 'next'){
      this.state.x.setValue(200)
      Animated.spring(this.state.x, {
        toValue: 0,
        useNativeDriver: false
      }).start()
    }else{
      this.state.x.setValue(-200)
      Animated.spring(this.state.x, {
        toValue: 0,
        useNativeDriver: false
      }).start()
    }
    fetch('https://lishup.com/app/getNextPost.php', {
         method: 'POST',
         headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: this.state.user,
          id: this.state.data[0].id,
          type: type
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        if(responseJson[0]){
          this.setState({activeStory: 'remix'})
         this.setState({
            data: responseJson,
            loading: false,
            imageUrls: []
         })
          console.log(responseJson[0])
          setTimeout(() => {
            this.setState({activeStory: 'main'})
          }, 1000)
          Promise.all(
           responseJson.map(({ images }) => this.fetchImage(images))
         ).then((imageUrls) => { this.setState({ imageUrls }) } );
         }else {
           ToastAndroid.show('End of Story', ToastAndroid.SHORT)
         }
      })
      .catch((error) => {
         console.error(error);
      });
  }
  fetchImage(image) {
    return fetch('https://lishup.com/app/fetch-image.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image }),
    })
      .then((response) => response.json())
      .then((responseJson) =>
        responseJson.filter(({ url }) => url).map(({ url }) => url)
      );
  }
  fetchComments(id) {
    return fetch('https://lishup.com/app/getcomments.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lid: id }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson){
          this.setState({comments: responseJson })
          console.log(this.state.comments)
        }
      })
  }
  formatMention(string){
    return string.split(/((?:^|\s)(?:@[a-z\d-]+))/gi).filter(Boolean).map((v,i)=>{
      if(v.includes('@')){
        return <Text key={i} style={{fontWeight: 'bold', elevation: 10, zIndex: 10, }} onPress={() => this.props.navigation.navigate('Profile', { 
            user: v.substring(2),
            dark: this.state.dark
            }) }>
          {v}</Text>
      }else{
  
        return this.state.language == 'en' ? <Text style={{elevation: 6, zIndex: 6}}>{v}</Text> :
        <PowerTranslator text={v} style={{elevation: 6, zIndex: 6, color: this.state.dark ? 'white' : 'black'}} target={this.state.language} />
      }
    })
  }
  award(){
    if(this.state.awardAmount < 2){
      Alert.alert('Uh!', 'The minimum amount is 2 Gems')
    }else{
      fetch('https://lishup.com/app/awardUser.php', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: this.state.currentAwardUser, me: this.state.user, amount: this.state.awardAmount }),
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson == 'sent'){
          Vibration.vibrate()
          this.setState({showCongrats: true})
          setTimeout(() => {this.setState({showCongrats: false})}, 4000)
          Alert.alert('Congrats!', 'You just gifted this creator ' + this.state.awardAmount + 'Gems', [
            {
              text: 'Thanks'
            }
          ])
        }else{
          Alert.alert('Oops', responseJson)
        }
        this.setState({awardAmount: 0, currentAwardUser: '', showAwards: false})
      })
  }
  }
  lovePosts(id, author){
    this.setState((state) => {
      const data = state.data.map((el) => {
        if (el.id === id) {
          if (el.isliked == true) {
            el.loves = parseInt(el.loves) - 1
            el.isliked = !el.isliked
          } else {
            el.loves = parseInt(el.loves) + 1
            el.isliked = !el.isliked
            this.setState({showLoves: true})
            setTimeout(() => {this.setState({showLoves: false})}, 2000)
          }
        }
        return el
      });
      const isPress = !state.isPress
      return { data, isPress }
    });

    fetch('https://lishup.com/app/love.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        user: this.state.user,
        author: author,
      }),
    })

  }
  formatText(string){
    return string.split(/((?:^|\s)(?:#[a-z\d-]+))/gi).filter(Boolean).map((v,i)=>{
      if(v.includes('#')){
        return <TouchableOpacity onPress={() => this.props.navigation.navigate('Contests')} style={{elevation: 10, zIndex: 10}}>
          <Text key={i} style={{fontWeight: 'bold', }}>
            {v}</Text>
            </TouchableOpacity>
      }   else{
        return this.state.language == 'en' ? <Text key={i} style={{ elevation: 5, zIndex: 5}}>{v}</Text> : 
        <PowerTranslator text={v} target={this.state.language} style={{ elevation: 5, zIndex: 5}} />
      }
    })
  }
  renderPost = ({item, index}) => (
    <Animated.View style={{flex: 1, width: "100%", margin: 0, padding: 0, backgroundColor: 'transparent', height: '100%',
    transform: [
      {
        translateX: this.state.x
      }
    ]}} key={index}>
        <View style={{width: '100%', marginTop: '5%', alignSelf: 'center', alignContent: 'center', }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center'}}>
          {item.reUser ?
            <><View style={{height: 2.5, width: Dimensions.get('window').width/3, backgroundColor:  '#fff', 
            opacity: this.state.activeStory == 'main' ? 1 : 0.5}} />
            <View style={{height: 2.5, width: Dimensions.get('window').width/3, backgroundColor:'#fff', 
            opacity: this.state.activeStory == 'remix' ? 1 : 0.5}} />
            </> 
            : <TouchableOpacity style={{height: 2.5, width: Dimensions.get('window').width/1.5, backgroundColor:'#fff'}}></TouchableOpacity>}

           <FIcon name="x" color="white" size={40} onPress={() => this.props.navigation.goBack()} style={{alignSelf: 'flex-end'}} />       
        </View> 
        <View>
        <ListItem
            title={props => <Text style={{ fontSize:15, left: 10, elevation: 5, zIndex: 5, color: this.state.dark ? "white" : '#A7A7A7', fontWeight: 'bold'}}>
            {item.user}  {this.state.language == 'en' ? <Text style={{fontSize: 12, elevation: 5, zIndex: 5, color: this.state.dark ? "#f2f2f2" : '#ababab'}}>
              {item.time}</Text> : <PowerTranslator text={item.time} 
            style={{fontSize: 12, elevation: 5, zIndex: 5, color: this.state.dark ? "#f2f2f2" : '#ababab'}} target={this.state.language}/>}
            </Text>}
            accessoryLeft={evaProps => 
              <Avatar source={{uri: item.userpic}} style={{width: 38, height: 38, borderRadius: 38/2, marginTop: 2}} />}
            onPress={() => this.props.navigation.navigate('Profile', {user: item.user, dark: this.state.dark })}
            style={{backgroundColor: 'transparent', elevation: 5, zIndex: 5, }}
            description={props => 
            <NativeText style={{left: 8, elevation: 4, zIndex: 4}}>{item.reUser ? 
              <View style={{flexDirection: 'row'}}>
              <Svg width="20" height="18" viewBox="0 0 36 31" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginTop: 5}}>
              <G filter="url(#filter0_i)">
              <Path fill-rule="evenodd" clip-rule="evenodd" d="M28.2224 9.757L28.1384 9.75854C27.9372 9.76407 27.7371 9.78532 27.5395 9.82402C26.8557 9.95801 26.2236 10.2854 25.6529 10.6763C25.5441 10.7509 25.4371 10.8281 25.3319 10.9075C24.7196 11.3695 24.1625 11.9024 23.6368 12.4597C23.0073 13.1272 22.4211 13.8346 21.8536 14.5551L21.0575 15.5974L20.682 16.0891C20.1268 16.8341 19.5774 17.5834 19.0232 18.3291C18.6087 18.8848 18.1916 19.4385 17.7646 19.9847L17.4273 20.4028L16.7782 21.2075C16.5259 21.5093 16.2692 21.8074 16.0067 22.1005C15.8026 22.3285 15.5951 22.5534 15.3835 22.7745C14.1349 24.08 12.7337 25.2716 11.115 26.0931C10.9121 26.196 10.7061 26.2929 10.4972 26.3833C10.222 26.5023 9.94186 26.6099 9.65741 26.7048C9.27818 26.8313 8.89139 26.9352 8.49954 27.0145C8.12246 27.0908 7.74076 27.1443 7.35718 27.1742C7.16216 27.1894 6.96686 27.1977 6.7713 27.2015C6.70025 27.2024 6.7004 27.2024 6.62928 27.2027C6.62928 27.2027 3.24749 27.2027 1.63932 27.2027C1.419 27.2027 1.2077 27.1151 1.05191 26.9594C0.896117 26.8036 0.808594 26.5923 0.808594 26.372C0.808594 25.2673 0.808594 23.3259 0.808594 22.2202C0.808595 21.9995 0.89645 21.7878 1.05276 21.632C1.20908 21.4761 1.421 21.3889 1.64174 21.3895C3.33311 21.3967 5.01392 21.4196 6.70913 21.3866C6.76543 21.3851 6.82161 21.3825 6.87781 21.3787C7.04448 21.3664 7.21001 21.3437 7.37359 21.3093C8.06915 21.1632 8.71065 20.8235 9.29004 20.4206C9.42274 20.3284 9.55273 20.2322 9.68031 20.133C10.2978 19.6528 10.8603 19.1041 11.392 18.5315C12.0232 17.8516 12.6124 17.1333 13.1837 16.4027L13.799 15.5911L14.5072 14.6569C14.9612 14.0438 15.4134 13.4294 15.8683 12.817C16.282 12.2618 16.6982 11.7085 17.1242 11.1626L17.4301 10.7836L18.1915 9.84037C18.4439 9.53963 18.7008 9.24268 18.9635 8.95088C19.1678 8.72395 19.3755 8.50011 19.5872 8.28015C20.8376 6.9813 22.2431 5.79893 23.8667 4.9944C24.0704 4.89344 24.2772 4.79867 24.4868 4.71062C24.7631 4.59454 25.0444 4.49019 25.3299 4.39875C25.7105 4.27682 26.0986 4.1779 26.4915 4.104C27.0605 3.99696 27.6378 3.94478 28.2166 3.94251H28.2223V0.619629L35.2835 6.85003L28.2223 13.0804V9.75701L28.2224 9.757ZM28.2224 21.3876V18.0647L35.2835 24.2951L28.2224 30.5255V27.2027H28.2167C27.6367 27.2004 27.0583 27.1484 26.488 27.0417C26.0943 26.968 25.7053 26.8693 25.3236 26.7477C25.0375 26.6564 24.7555 26.5523 24.4783 26.4364C24.2681 26.3485 24.0607 26.2539 23.8563 26.1531C22.2674 25.3692 20.885 24.2243 19.6534 22.9622C19.4398 22.7433 19.2303 22.5204 19.0243 22.2942L18.5104 21.7081L19.0734 21.0081C19.5085 20.4517 19.9335 19.8875 20.3558 19.3213C20.8608 18.6418 21.3619 17.9594 21.8667 17.2798L22.1157 16.9602C22.6662 17.6429 23.2204 18.2913 23.8152 18.9009C24.3183 19.4165 24.8517 19.9072 25.4358 20.3303C26.0625 20.7841 26.764 21.1712 27.5305 21.3206C27.7493 21.3633 27.9711 21.3849 28.1939 21.3875L28.2223 21.3876H28.2224ZM12.741 14.2297L11.7126 13.0008C11.1165 12.3277 10.4854 11.679 9.78491 11.1135C9.65677 11.01 9.52623 10.9095 9.39296 10.8128C9.28852 10.737 9.1824 10.6634 9.07447 10.5926C8.51352 10.2247 7.89381 9.92389 7.22811 9.80926C7.03763 9.77646 6.8451 9.75995 6.65188 9.75768L6.61797 9.75755C6.61797 9.75755 3.24504 9.75755 1.63935 9.75755C1.18056 9.75755 0.808637 9.38562 0.808633 8.92683C0.808633 7.82139 0.808633 5.8781 0.808633 4.77286C0.808631 4.31425 1.18027 3.9424 1.63888 3.94214C3.32505 3.94073 5.01123 3.93619 6.69738 3.94279C6.77091 3.94366 6.84438 3.94509 6.91789 3.94711C7.11243 3.95396 7.30664 3.96534 7.50047 3.98356C7.8817 4.01938 8.26068 4.07872 8.63472 4.16063C9.00076 4.24079 9.362 4.34256 9.71643 4.46411C9.99909 4.56105 10.2774 4.67055 10.5507 4.79139C10.7787 4.89222 11.0032 5.00092 11.224 5.11675C12.7098 5.89629 14.0096 6.98776 15.1757 8.18507C15.3889 8.40393 15.5979 8.62679 15.8034 8.85285L16.3483 9.4752L15.8144 10.1405C15.3806 10.6964 14.9567 11.2598 14.5353 11.8252C14.0312 12.504 13.5308 13.1855 13.0264 13.8641L12.741 14.2297L12.741 14.2297Z" fill="white"/>
              <Path fill-rule="evenodd" clip-rule="evenodd" d="M28.2224 9.757L28.1384 9.75854C27.9372 9.76407 27.7371 9.78532 27.5395 9.82402C26.8557 9.95801 26.2236 10.2854 25.6529 10.6763C25.5441 10.7509 25.4371 10.8281 25.3319 10.9075C24.7196 11.3695 24.1625 11.9024 23.6368 12.4597C23.0073 13.1272 22.4211 13.8346 21.8536 14.5551L21.0575 15.5974L20.682 16.0891C20.1268 16.8341 19.5774 17.5834 19.0232 18.3291C18.6087 18.8848 18.1916 19.4385 17.7646 19.9847L17.4273 20.4028L16.7782 21.2075C16.5259 21.5093 16.2692 21.8074 16.0067 22.1005C15.8026 22.3285 15.5951 22.5534 15.3835 22.7745C14.1349 24.08 12.7337 25.2716 11.115 26.0931C10.9121 26.196 10.7061 26.2929 10.4972 26.3833C10.222 26.5023 9.94186 26.6099 9.65741 26.7048C9.27818 26.8313 8.89139 26.9352 8.49954 27.0145C8.12246 27.0908 7.74076 27.1443 7.35718 27.1742C7.16216 27.1894 6.96686 27.1977 6.7713 27.2015C6.70025 27.2024 6.7004 27.2024 6.62928 27.2027C6.62928 27.2027 3.24749 27.2027 1.63932 27.2027C1.419 27.2027 1.2077 27.1151 1.05191 26.9594C0.896117 26.8036 0.808594 26.5923 0.808594 26.372C0.808594 25.2673 0.808594 23.3259 0.808594 22.2202C0.808595 21.9995 0.89645 21.7878 1.05276 21.632C1.20908 21.4761 1.421 21.3889 1.64174 21.3895C3.33311 21.3967 5.01392 21.4196 6.70913 21.3866C6.76543 21.3851 6.82161 21.3825 6.87781 21.3787C7.04448 21.3664 7.21001 21.3437 7.37359 21.3093C8.06915 21.1632 8.71065 20.8235 9.29004 20.4206C9.42274 20.3284 9.55273 20.2322 9.68031 20.133C10.2978 19.6528 10.8603 19.1041 11.392 18.5315C12.0232 17.8516 12.6124 17.1333 13.1837 16.4027L13.799 15.5911L14.5072 14.6569C14.9612 14.0438 15.4134 13.4294 15.8683 12.817C16.282 12.2618 16.6982 11.7085 17.1242 11.1626L17.4301 10.7836L18.1915 9.84037C18.4439 9.53963 18.7008 9.24268 18.9635 8.95088C19.1678 8.72395 19.3755 8.50011 19.5872 8.28015C20.8376 6.9813 22.2431 5.79893 23.8667 4.9944C24.0704 4.89344 24.2772 4.79867 24.4868 4.71062C24.7631 4.59454 25.0444 4.49019 25.3299 4.39875C25.7105 4.27682 26.0986 4.1779 26.4915 4.104C27.0605 3.99696 27.6378 3.94478 28.2166 3.94251H28.2223V0.619629L35.2835 6.85003L28.2223 13.0804V9.75701L28.2224 9.757ZM28.2224 21.3876V18.0647L35.2835 24.2951L28.2224 30.5255V27.2027H28.2167C27.6367 27.2004 27.0583 27.1484 26.488 27.0417C26.0943 26.968 25.7053 26.8693 25.3236 26.7477C25.0375 26.6564 24.7555 26.5523 24.4783 26.4364C24.2681 26.3485 24.0607 26.2539 23.8563 26.1531C22.2674 25.3692 20.885 24.2243 19.6534 22.9622C19.4398 22.7433 19.2303 22.5204 19.0243 22.2942L18.5104 21.7081L19.0734 21.0081C19.5085 20.4517 19.9335 19.8875 20.3558 19.3213C20.8608 18.6418 21.3619 17.9594 21.8667 17.2798L22.1157 16.9602C22.6662 17.6429 23.2204 18.2913 23.8152 18.9009C24.3183 19.4165 24.8517 19.9072 25.4358 20.3303C26.0625 20.7841 26.764 21.1712 27.5305 21.3206C27.7493 21.3633 27.9711 21.3849 28.1939 21.3875L28.2223 21.3876H28.2224ZM12.741 14.2297L11.7126 13.0008C11.1165 12.3277 10.4854 11.679 9.78491 11.1135C9.65677 11.01 9.52623 10.9095 9.39296 10.8128C9.28852 10.737 9.1824 10.6634 9.07447 10.5926C8.51352 10.2247 7.89381 9.92389 7.22811 9.80926C7.03763 9.77646 6.8451 9.75995 6.65188 9.75768L6.61797 9.75755C6.61797 9.75755 3.24504 9.75755 1.63935 9.75755C1.18056 9.75755 0.808637 9.38562 0.808633 8.92683C0.808633 7.82139 0.808633 5.8781 0.808633 4.77286C0.808631 4.31425 1.18027 3.9424 1.63888 3.94214C3.32505 3.94073 5.01123 3.93619 6.69738 3.94279C6.77091 3.94366 6.84438 3.94509 6.91789 3.94711C7.11243 3.95396 7.30664 3.96534 7.50047 3.98356C7.8817 4.01938 8.26068 4.07872 8.63472 4.16063C9.00076 4.24079 9.362 4.34256 9.71643 4.46411C9.99909 4.56105 10.2774 4.67055 10.5507 4.79139C10.7787 4.89222 11.0032 5.00092 11.224 5.11675C12.7098 5.89629 14.0096 6.98776 15.1757 8.18507C15.3889 8.40393 15.5979 8.62679 15.8034 8.85285L16.3483 9.4752L15.8144 10.1405C15.3806 10.6964 14.9567 11.2598 14.5353 11.8252C14.0312 12.504 13.5308 13.1855 13.0264 13.8641L12.741 14.2297L12.741 14.2297Z" fill="#00E0FF"/>
              </G>
            </Svg>
            <NativeText 
            onPress={() => this.props.navigation.navigate('Profile', {user: item.reUser, dark: this.state.dark})} 
            style={{backgroundColor: '#C4C4C4', padding: 2}}> {item.reUser} </NativeText>
            </View> : null} {item.text ? this.formatText(item.text) : '...'}</NativeText>}
            accessoryRight={evaProps => <EnIcon name="dots-three-horizontal" color="#ABABAB" size={25} style={{marginBottom: 30,
               marginRight: 20}}
            onPress={() => this.setState({moreOptions: true}) }/>}
          />
        </View>
        <View style={{ borderRadius: 5, padding: 0, marginTop: 0}}>
        {item.remixUri ?
        this.state.imageUrls[index] && this.state.imageUrls[index].length
          ? this.state.imageUrls[index].map((uri) => (
              <ScaledImage
          source={{uri: this.state.activeStory == 'main' ? uri : item.remixUri }}
          width={Dimensions.get('window').width}
      />
        )) : null 
        :
        this.state.imageUrls[index] && this.state.imageUrls[index].length
          ? this.state.imageUrls[index].map((uri) => (
            <ScaledImage
              source={{uri: uri}}
              style={{width: '95%', height: (Dimensions.get('window').height * 50) / 100, alignSelf: 'center',
               marginBottom: 0, marginLeft: '2.5%', borderRadius: 10  }}
              
              width={Dimensions.get('window').width}
             />
            ))
          : <FastImage source={require('./GemsIcons/loader.png')} style={{alignSelf: 'center', marginTop: 10, width: Dimensions.get('window').width, 
              height: Dimensions.get('window').width}} />

         }  
        </View>
       </View>
      </Animated.View>
  )
  renderComments = ({item, idx}) => (
    parseInt(item.replyId) > 0 ? null :
    <> 
    <NativeText style={{fontWeight: 'bold', marginLeft : 5,
     color: '#6D6D6D'}}>{item.user} {this.state.language == 'en' ? <NativeText style={{color: '#BABABA', fontSize: 12, fontWeight: 'normal'}}>
       {item.time}</NativeText> : <PowerTranslator style={{color: '#BABABA', fontSize: 12, fontWeight: 'normal'}} text={item.time} target={this.state.language}  />}</NativeText>
    
    <TouchableOpacity onPress={() => {
      this.setState({replyingTo: parseInt(item.id), replyingPerson: item.user})
      this.commentBox.focus()
    }} >
    <View style={{flexDirection :'row', marginVertical: 10, backgroundColor: '#fff', borderRadius: 30, alignSelf: 'flex-start',
     maxWidth: '80%'}}>
      <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', {user: item.user, dark: this.state.dark})}
      ><Avatar size='medium' style={{marginRight: 5, height: 45, width: 45}}
           source={{uri: item.userpic}} /></TouchableOpacity>
       {item.image ? <FastImage source={{uri: item.image}} style={{
        width: 100, height: 100}}/> : <View 
        style={{backgroundColor: this.state.dark ? '#151a30' : '#fff', padding: 10, borderRadius: 20,}}>
              <Text style={{fontWeight: 'bold', marginHorizontal: 10}}>{this.state.language == 'en' ? 
              <Text style={{elevation: 6, zIndex: 6, fontWeight: 'bold'}}>{item.text}</Text> :
      <PowerTranslator text={item.text} style={{elevation: 6, zIndex: 6, color: this.state.dark ? 'white' : 'black', fontWeight: 'bold'}} target={this.state.language} />}</Text>
         </View>}
    </View>
    </TouchableOpacity>
   {this.state.comments.some(e => e.replyId === item.id)?
    <View style={{marginLeft: '10%', alignSelf: 'flex-start', backgroundColor: '#fff', borderRadius: 30, padding: 15, maxWidth: '90%'}}>
        {this.state.comments.map(itm => {
          if(itm.replyId == item.id){
            return  <View style={{flexDirection :'row', backgroundColor: '#fff', borderRadius: 30, alignSelf: 'flex-start', 
            width: '100%', marginVertical: 10}}>
             <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', {user: itm.user, dark: this.state.dark})}
             ><Avatar size='medium' style={{marginRight: 5}}
                  source={{uri: itm.userpic}} /></TouchableOpacity>

              {itm.image ? 
              <FastImage source={{uri: itm.image}} style={{
               width: 100, height: 100}}/> : 
              <View style={{backgroundColor: this.state.dark ? '#151a30' : '#fff', padding: 10, borderRadius: 20,}}>
              <NativeText style={{marginHorizontal: 10}}>{this.state.language == 'en' ? 
              <NativeText style={{elevation: 6, zIndex: 6, textAlign: 'left'}}>
                {itm.text} <NativeText style={{color: '#BABABA', fontSize: 12, fontWeight: 'normal'}}>{itm.time}</NativeText>
              </NativeText> 
              : <PowerTranslator text={itm.text} style={{elevation: 6, zIndex: 6, color: this.state.dark ? 'white' : 'black'}} target={this.state.language} />}</NativeText>
                </View>}

           </View>
          }
        })}
    </View> : null}
    </>
  )
  newComment (item) {
    this.setState({newcomment: ''})
    if(this.state.newcomment){
      this.socket.emit('newComment', {
        lid: item.id,
        user: this.state.user,
        text: this.state.newcomment,
        url: '',
        to: item.user
      })
    }else { alert('Comment Field is Empty!') }
   }
  Empty(){
    return (
          <Layout style={{justifyContent: 'center', flex: 1, backgroundColor: 'black'}}>
          <ScaledImage uri='https://monophy.com/media/idRGkOxrjQtucjh8GA/monophy.gif'
          width={100}/>
        <Text style={{fontSize:18,
         fontWeight:'bold', color:'grey', textAlign: 'center'}}>
        None said a word 
        </Text>
        </Layout>
    )
  }
  reportPost(){
    if(this.state.reportReason){
    const { params } = this.props.navigation.state
    const id = params ? params.id : null 

    fetch('https://lishup.com/app/newreport.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: this.state.user, lid: id, reason: this.state.reportReason}),
    })
    .catch((error) => {
      console.log(error)
      ToastAndroid.show('Something went wrong. Retry later', ToastAndroid.SHORT)
    })
    ToastAndroid.show('Reported Successfully', ToastAndroid.SHORT)
    }else{
      Alert.alert('Be specific', 'Please explain what is wrong, this will help us to take effective actions faster')
    }
  }
  deleteMeme(){
    const { params } = this.props.navigation.state
    const id = params ? params.id : null 
    
    fetch('https://lishup.com/app/deletepost.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id, key: 'idkMeme'}),
    })
    .then(data => {
      ToastAndroid.show('Deleted Meme Successfully', ToastAndroid.SHORT)
      this.props.navigation.navigate('Home')
    })
    .catch((error) => {
      console.log(error)
      ToastAndroid.show('Something went wrong. Retry later', ToastAndroid.SHORT)
    })
        
    }
  slide = async(type) => {
    if(type == 'next'){
      if(this.state.data[0].reUser && this.state.activeStory == 'main'){
        this.setState({activeStory: 'remix'})
      }else{
        this.nextPost('next')
      }
        Animated.timing(this.state.x, {
          toValue: -(Dimensions.get('window').width),
          useNativeDriver: false,
          duration: 500,
          easing: Easing.linear()
        }).start(() => {
            this.state.x.setValue(300)
            Animated.spring(this.state.x, {
              toValue: 0,
              useNativeDriver: false
            }).start()
        })
    }else{
      if(this.state.data[0].reUser && this.state.activeStory == 'remix'){
        this.setState({activeStory: 'main'})
      }else{
        this.nextPost('previous')
      }
      Animated.timing(this.state.x, {
        toValue: Dimensions.get('window').width,
        useNativeDriver: false
      }).start(() => {
          this.state.x.setValue(-200)
          Animated.spring(this.state.x, {
            toValue: 0,
            useNativeDriver: false
          }).start()
      })
    }
  }  
  render(){
    const { params } = this.props.navigation.state
    const id = params ? params.id : null 

    if(this.state.loading){
      return(
        <ApplicationProvider
    {...eva}
    theme={eva.dark}>
      
        <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black'}}>
          <FastImage source={{uri: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/35771931234507.564a1d2403b3a.gif', 
          priority: FastImage.priority.high,}} style={{
            width: 100, height: 100
          }}/>
          </Layout>
      </ApplicationProvider>
      )
    }else{
      var uri = this.state.imageUrls[0]
    return(
      <ApplicationProvider {...eva}
    theme={eva.dark}>
        <Layout style={{flex: 1, backgroundColor: 'black'}}>
          <ScrollView style={{  flex: 1, paddingTop: 30 }}>
           <TouchableWithoutFeedback onPress={() => this.state.data[0].reUser ? this.state.activeStory == 'remix' ? this.slide('next') : this.setState({activeStory: 'remix'}) : this.slide('next')}>
             <View  style={{height: Dimensions.get('window').height/2, width: 100, position: 'absolute', zIndex: 100, right: 0, top: 100
            }} /></TouchableWithoutFeedback> 
          <TouchableWithoutFeedback onPress={() => this.state.data[0].reUser ? this.state.activeStory == 'main' ? this.slide('previous') : this.setState({activeStory: 'main'}) : this.slide('previous')}>
             <View  style={{height: Dimensions.get('window').height/2, width: 100, position: 'absolute', zIndex: 100, left: 0, top: 100
            }} /></TouchableWithoutFeedback>    
        <FlatList
            data={this.state.data}
            keyExtractor={(item, idx) => idx}
            renderItem={this.renderPost}
          />
          <Overlay
        animationType="slide"
        transparent={true}
        visible={this.state.showAwards}
        onDismiss={() => {
          this.setState({showAwards: !this.state.showAwards})
        }}
        onBackdropPress={() => {
          this.setState({showAwards: !this.state.showAwards})
        }} overlayStyle={{position: 'absolute', bottom: 0, width: Dimensions.get('window').width, height: "45%"}}>
        <Layout style={{ justifyContent: 'center', alignItems: 'center',
           borderRadius: 0, backgroundColor: '#fff', width: "100%", height: "100%", border: 0, margin: 0 }}>
            {this.state.language == 'en' ? <Text category="h6" style={{textAlign: 'center', marginVertical: 10, color: 'black'}}>Award User</Text>
            : <PowerTranslator text={'Award User'} style={{textAlign: 'center', marginVertical: 10, color: 
            this.state.dark ? 'white' : 'black'}} target={this.state.language} />}
            <Divider />
            <ButtonGroup status="basic">
              <Button onPress={() => this.setState({awardAmount: 5})} style={{backgroundColor: 'rgba(51, 102, 255, 0.16)'}}><NativeText style={{fontWeight: 'bold', fontSize: 20}}>5</NativeText> 
              <Svg width="20" height="15" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Path d="M19.1358 4.50423L9.87037 12.9787L0.604947 4.50423L3.37217 0.459825H16.3686L19.1358 4.50423Z" fill="#ED0063" stroke="#ED0063" stroke-width="0.91965"/>
                </Svg></Button>
              <Button style={{backgroundColor: 'rgba(51, 102, 255, 0.16)'}} onPress={() => this.setState({awardAmount: 10})}><NativeText style={{fontWeight: 'bold', fontSize: 20}}>10</NativeText> 
              <Svg width="20" height="15" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Path d="M19.1358 4.50423L9.87037 12.9787L0.604947 4.50423L3.37217 0.459825H16.3686L19.1358 4.50423Z" fill="#ED0063" stroke="#ED0063" stroke-width="0.91965"/>
                </Svg></Button>
              <Button style={{backgroundColor: 'rgba(51, 102, 255, 0.16)' }} onPress={() => this.setState({awardAmount: 20})}><NativeText style={{fontWeight: 'bold', fontSize: 20}}>20</NativeText> 
              <Svg width="20" height="15" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Path d="M19.1358 4.50423L9.87037 12.9787L0.604947 4.50423L3.37217 0.459825H16.3686L19.1358 4.50423Z" fill="#ED0063" stroke="#ED0063" stroke-width="0.91965"/>
                </Svg></Button>
            </ButtonGroup>
            <Input keyboardType="numeric" style={{borderColor: 'transparent', borderBottomColor: 'black', padding: 10, backgroundColor: 'transparent', textAlign: 'center', margin: 10,
              opacity: this.state.awardAmount ? 1 : 0.5}} 
            placeholder="10 Gems" onChangeText={val => this.setState({awardAmount: val})} value={this.state.awardAmount.toString()}
            textStyle={{fontSize: 25, textAlign: 'center', color: 'black'}} accessoryRight={props =><Svg width="20" height="15" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M19.1358 4.50423L9.87037 12.9787L0.604947 4.50423L3.37217 0.459825H16.3686L19.1358 4.50423Z" fill="#ED0063" stroke="#ED0063" stroke-width="0.91965"/>
            </Svg>}/>
            <Button onPress={() => this.award()} style={{backgroundColor: '#F10063', borderRadius: 20, borderColor: 'white'}}>Award Gems</Button>     
          </Layout>
        </Overlay>  
        <Overlay isVisible={this.state.moreOptions} onBackdropPress={() => this.setState({moreOptions: !this.state.moreOptions})}
         overlayStyle={{width: "80%", minHeight: "30%", borderRadius: 50, backgroundColor: this.state.dark ? '#101426' : '#fff', paddingHorizontal: 30 }}  animationType="fade">
          <Layout level="4" style={{flex: 1, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', backgroundColor: this.state.dark ? '#101426' : '#fff'}}>
          {this.state.user == this.state.data[0].user ? null : <TouchableOpacity onPress={() => this.setState({reportPost: true})}><Icon name="alert-circle" size={50} color={this.state.dark ? '#fff' : '#2E3A59'} /></TouchableOpacity>}
           <TouchableOpacity
             onPress={() => this.addtoBookMarks()}><Icon name="bookmark" size={50} color={this.state.dark ? '#fff' : '#2E3A59'} /></TouchableOpacity>
           <TouchableOpacity 
              onPress={() => {
                this.state.imageUrls[0] && this.state.imageUrls[0].length
                    ? this.state.imageUrls[0].map((uri) => (
                      Clipboard.setString(uri)
                    )) : null
                ToastAndroid.show('Copied Meme Link', ToastAndroid.SHORT)
              }}><Icon name="copy" size={50} color={this.state.dark ? '#fff' : '#2E3A59'} /></TouchableOpacity>
          {this.state.user == this.state.data[0].user ? <TouchableOpacity 
              onPress={() => {  this.deleteMeme()
              }}><Icon name="ios-trash-bin" size={50} color={this.state.dark ? '#fff' : '#2E3A59'} /></TouchableOpacity>    : null}
          </Layout>
          </Overlay>

          <Overlay isVisible={this.state.reportPost} onBackdropPress={() => this.setState({reportPost: !this.state.reportPost})}
         overlayStyle={{width: "80%",  height: "50%", borderRadius: 50, backgroundColor: this.state.dark ? '#101426' : '#fff', paddingHorizontal: 30 }}  animationType="fade">
          <Layout level="4" style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: this.state.dark ? '#101426' : '#fff'}}>
           <Input placeholder="Let us know what is wrong" maxLength={100} textStyle={{minHeight: 60, color: 'black'}} style={{backgroundColor: 'transparent'}}
           multiline={true}  onChangeText={val => this.setState({reportReason: val})} />
           <Button status="danger" style={{margin: 10, alignSelf: 'flex-end'}}
           onPress={() => this.reportPost()}>Report</Button>
          </Layout>
          </Overlay>

          </ScrollView>
          <Overlay
        animationType="slide"
        transparent={true}
        isVisible={this.state.showComments}
        onDismiss={() => {
          this.setState({showComments: !this.state.showComments, comments: [], loadingComments: true, replyingTo: 0, replyingPerson: ''})
        }}
        onBackdropPress={() => {
          this.setState({showComments: !this.state.showComments, comments: [], loadingComments: true, replyingTo: 0, replyingPerson: ''})
        }}
        overlayStyle={{bottom: 0, position: 'absolute', height: '80%', backgroundColor: this.state.dark ? '#101426' : '#F0F0F0', width: "100%"}}
      >
         <Text 
         style={{textAlign: 'center', marginVertical: 10, color: '#ababab'}} category="h6">
           {Object.keys(this.state.comments).length} <Svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 25 25">
          <Path d="M3.12775 18.8879C3.19186 18.6519 3.05016 18.3238 2.91492 18.0873C2.87281 18.0168 2.82714 17.9484 2.77807 17.8825C1.61819 16.1235 0.999979 14.0628 1.00005 11.9558C0.981195 5.90787 5.99628 1 12.1978 1C17.6062 1 22.1207 4.74677 23.1757 9.72037C23.3338 10.4578 23.4136 11.2098 23.4138 11.9639C23.4138 18.0205 18.5922 23.0054 12.3907 23.0054C11.4047 23.0054 10.0739 22.7575 9.34811 22.5544C8.62236 22.3513 7.89768 22.0819 7.71072 22.0097C7.51951 21.9362 7.31643 21.8984 7.11158 21.8982C6.88783 21.8973 6.66623 21.9419 6.46018 22.0291L2.80555 23.3481C2.72548 23.3826 2.64065 23.4047 2.55393 23.4138C2.4855 23.4136 2.4178 23.3998 2.35473 23.3732C2.29167 23.3467 2.2345 23.3079 2.18654 23.2591C2.13858 23.2103 2.10079 23.1524 2.07534 23.0889C2.0499 23.0254 2.03731 22.9574 2.03831 22.889C2.0428 22.8289 2.05364 22.7695 2.07064 22.7117L3.12775 18.8879Z" 
          stroke={this.state.dark ?'white' : '#ababab'} stroke-width="4" stroke-miterlimit="10" stroke-linecap="round"></Path>
          </Svg>
          </Text>
          <TouchableOpacity style={{position: 'absolute', right: 10, top: 10}} onPress={() => this.setState({showComments: false, comments: [], loadingComments: true, replyingTo: 0, replyingPerson: ''})}>
            <Svg width="37" height="46" viewBox="0 0 37 46" fill="none" xmlns="http://www.w3.org/2000/svg">
            <G opacity="0.13">
            <Path fill-rule="evenodd" clip-rule="evenodd" d="M28.4359 12.5691C27.5918 11.7251 26.2233 11.7252 25.3791 12.5694L18.2491 19.6994L11.2559 12.7061C10.4118 11.862 9.04327 11.8621 8.1991 12.7063C7.35493 13.5505 7.35482 14.9191 8.19885 15.7631L15.1921 22.7564L8.06335 29.8852C7.21917 30.7293 7.21906 32.0979 8.06309 32.9419C8.90712 33.786 10.2757 33.7859 11.1198 32.9417L18.2486 25.8129L25.2412 32.8055C26.0853 33.6495 27.4538 33.6494 28.298 32.8052C29.1422 31.9611 29.1423 30.5925 28.2983 29.7485L21.3056 22.7559L28.4356 15.6259C29.2798 14.7817 29.2799 13.4132 28.4359 12.5691Z" fill="black"/>
            </G>
          </Svg></TouchableOpacity>
           {this.state.loadingComments ? this.Loading : <FlatList
            data={this.state.comments}
            keyExtractor={(item, idx) => idx}
            renderItem={this.renderComments}
            style={{width: "100%"}}
            ListEmptyComponent={this.state.loadingComments ? this.Loading : this.Empty}
            />}
            <View style={{flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', bottom: 0, right: 0, left: 0,
            alignItems: 'center'}}>
            <TextInput
              value={this.state.newcomment}
              placeholder={this.state.replyingTo == 0 ? 'Type a Comment...' : 'Reply To ' + this.state.replyingPerson}
              onChangeText={val => this.setState({newcomment: val})}
              maxLength={100}
              ref={(r) => { this.commentBox = r; }}
              style={{backgroundColor: '#fff', borderWidth: 0, width: '100%', borderColor: '#fff', flex: 1, padding: 20, fontSize: 15,
            }}
            multiline={true}
            />
            { this.state.newcomment ?
                <TouchableOpacity onPress={() => {
                  if(this.state.newcomment){
                        this.socket.emit('newComment', {
                          lid: this.state.currentPostId,
                          user: this.state.user,
                          text: this.state.newcomment,
                          url: '',
                          to: this.state.currentPostAuthor,
                          replyId: this.state.replyingTo
                        })
                        this.setState({newcomment: ''})
                      }else { alert('Comment Field is Empty!') }
                    }} style={{ position: 'absolute', right: 10 }}><Icon
                    size={35}
                    color={this.state.dark ?'white' : '#00BBFF'}
                    name='ios-arrow-redo-circle-sharp'
                  /></TouchableOpacity>
                :  <TouchableOpacity style={{ position: 'absolute', right: 10 }} onPress={() => {
                  GiphyUi.present(
                    {
                      theme: this.state.dark ? 'dark' : 'light',
                      layout: 'waterfall',
                      showConfirmationScreen: true,
                      mediaTypes: ['gifs', 'stickers', 'emoji', 'text'],
                    },
                    selectedMedia => {
                      this.socket.emit('newComment', {
                        lid: this.state.currentPostId,
                        user: this.state.user,
                        text: '',
                        image: selectedMedia.images.downsized.url,
                        to: this.state.currentPostAuthor,
                        replyId: this.state.replyingTo
                      })
                    }
                  )
                }} >
                <EnIcon name="emoji-happy" size={35} color='#ABABAB'/>
                </TouchableOpacity>}
            </View>
      </Overlay>
          {this.state.showLoves ? <FastImage source={{uri: 'https://media0.giphy.com/media/3oKIPqM8BJ0ofNQOzK/giphy.gif?cid=ecf05e47t2sbc7eivk8udcfb8szs557jx17bl9t3atewvoe4&rid=giphy.gif', 
          priority: FastImage.priority.high,}} style={{
            width:465, height: 465, position: 'absolute', bottom: 10, alignSelf: 'center'
          }} /> : null}
          {this.state.showCongrats ? <FastImage source={{uri: 'https://media.giphy.com/media/58FB1ly2YjmVzcaOYv/giphy.gif', 
          priority: FastImage.priority.high}} style={{
            width:"100%", height: "100%", top: 0, position: 'absolute', alignSelf: 'center'
          }} /> : null}

         <Animated.View style={{position: 'absolute', bottom: 0, zIndex: 20, width: Dimensions.get('window').width, 
        transform: [
          {
            translateX: this.state.x
          }
        ]}}>
         <View style={{ flexDirection: 'row', backgroundColor: 'transparent', marginVertical: 10, paddingLeft: 10}}>
        <View>
        <TouchableOpacity style={{ borderRadius: 35, elevation: 3, shadowColor: '#f2f2f2', marginHorizontal: 9,
          backgroundColor: 'transparent', paddingTop: 16, paddingHorizontal: 14, paddingBottom: 12, marginTop: 4}}
          onPress={() => this.lovePosts(this.state.data[0].id, this.state.data[0].user)}> 
             {this.state.data[0].isliked ? 
             <Svg width="27" height="27" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
             <Path d="M31.2601 6.91501C30.4939 6.14851 29.5843 5.54048 28.5831 5.12563C27.5819 4.71079 26.5088 4.49727 25.4251 4.49727C24.3413 4.49727 23.2682 4.71079 22.267 5.12563C21.2658 5.54048 20.3562 6.14851 19.5901 6.91501L18.0001 8.50501L16.4101 6.91501C14.8625 5.36747 12.7636 4.49807 10.5751 4.49807C8.38651 4.49807 6.28759 5.36747 4.74006 6.91501C3.19252 8.46255 2.32312 10.5615 2.32312 12.75C2.32312 14.9386 3.19252 17.0375 4.74006 18.585L6.33006 20.175L18.0001 31.845L29.6701 20.175L31.2601 18.585C32.0265 17.8189 32.6346 16.9092 33.0494 15.908C33.4643 14.9069 33.6778 13.8337 33.6778 12.75C33.6778 11.6663 33.4643 10.5932 33.0494 9.59197C32.6346 8.59079 32.0265 7.68114 31.2601 6.91501Z" fill="#FF007A" stroke="#FF007A" stroke-width="3.75" stroke-linecap="round" stroke-linejoin="round"/>
             </Svg>
              :
              <Svg width="27" height="27" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <Path fill-rule="evenodd" clip-rule="evenodd" d="M21.5493 3.39344C22.778 2.88432 24.095 2.62227 25.4251 2.62227C26.7551 2.62227 28.0721 2.88432 29.3008 3.39344C30.5293 3.90246 31.6454 4.64847 32.5856 5.58887C33.5263 6.52913 34.2725 7.64551 34.7816 8.87424C35.2907 10.103 35.5528 11.42 35.5528 12.75C35.5528 14.08 35.2907 15.397 34.7816 16.6258C34.2725 17.8544 33.5264 18.9706 32.5859 19.9108C32.5858 19.9109 32.586 19.9107 32.5859 19.9108L19.3259 33.1708C18.5936 33.9031 17.4065 33.9031 16.6742 33.1708L3.41423 19.9108C1.51506 18.0117 0.44812 15.4358 0.44812 12.75C0.44812 10.0642 1.51506 7.48835 3.41423 5.58918C5.3134 3.69001 7.88923 2.62307 10.5751 2.62307C13.2609 2.62307 15.8367 3.69001 17.7359 5.58918L16.4101 6.91501M17.7359 5.58918L18.0001 5.85336L18.2639 5.58949C18.264 5.58939 18.2638 5.5896 18.2639 5.58949C19.2041 4.64894 20.3207 3.90251 21.5493 3.39344M29.9339 8.24052C29.3419 7.64823 28.639 7.17838 27.8654 6.85782C27.0917 6.53726 26.2625 6.37227 25.4251 6.37227C24.5876 6.37227 23.7584 6.53726 22.9848 6.85782C22.2111 7.17838 21.5082 7.64823 20.9162 8.24052L19.3259 9.83083C18.5936 10.5631 17.4065 10.5631 16.6742 9.83083L15.0842 8.24083C13.8883 7.04492 12.2663 6.37307 10.5751 6.37307C8.88379 6.37307 7.26179 7.04492 6.06588 8.24083C4.86997 9.43674 4.19812 11.0587 4.19812 12.75C4.19812 14.4413 4.86997 16.0633 6.06588 17.2592L18.0001 29.1934L29.9342 17.2592C30.5265 16.6672 30.9967 15.964 31.3172 15.1903C31.6378 14.4167 31.8028 13.5874 31.8028 12.75C31.8028 11.9126 31.6378 11.0834 31.3172 10.3097C30.9967 9.53606 30.5262 8.83253 29.9339 8.24052Z" fill="#ABABAB"/>
              </Svg>
              }
        </TouchableOpacity>
        {this.state.data[0].loves > 0 ?
        <Text style={{textAlign: 'center', color: this.state.data[0].isliked ? 
        '#FF007A' : this.state.dark ? "white" : '#ABABAB', }}>{this.state.data[0].loves}</Text> : null}
        </View>
        <View>
        <TouchableOpacity style={{borderRadius: 5, elevation: 3, shadowColor: '#f2f2f2', marginHorizontal: 10,
        backgroundColor: 'transparent', paddingTop: 13, paddingHorizontal: 12, paddingLeft: 14, paddingBottom: 11, marginTop: 4}}
        onPress={() => {
          this.state.imageUrls[0] && this.state.imageUrls[0].length
          ? this.state.imageUrls[0].map((uri) => (
            this.props.navigation.navigate('Create', {mixContent: uri, mixId: this.state.data[0].id, dark: this.state.dark, user: this.state.user})
          )) : ToastAndroid.show('Please Try Again', ToastAndroid.SHORT)
        }}>
           <Svg width="30" height="31" viewBox="0 0 36 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <G filter="url(#filter0_i)">
            <Path fill-rule="evenodd" clip-rule="evenodd" d="M28.2224 9.757L28.1384 9.75854C27.9372 9.76407 27.7371 9.78532 27.5395 9.82402C26.8557 9.95801 26.2236 10.2854 25.6529 10.6763C25.5441 10.7509 25.4371 10.8281 25.3319 10.9075C24.7196 11.3695 24.1625 11.9024 23.6368 12.4597C23.0073 13.1272 22.4211 13.8346 21.8536 14.5551L21.0575 15.5974L20.682 16.0891C20.1268 16.8341 19.5774 17.5834 19.0232 18.3291C18.6087 18.8848 18.1916 19.4385 17.7646 19.9847L17.4273 20.4028L16.7782 21.2075C16.5259 21.5093 16.2692 21.8074 16.0067 22.1005C15.8026 22.3285 15.5951 22.5534 15.3835 22.7745C14.1349 24.08 12.7337 25.2716 11.115 26.0931C10.9121 26.196 10.7061 26.2929 10.4972 26.3833C10.222 26.5023 9.94186 26.6099 9.65741 26.7048C9.27818 26.8313 8.89139 26.9352 8.49954 27.0145C8.12246 27.0908 7.74076 27.1443 7.35718 27.1742C7.16216 27.1894 6.96686 27.1977 6.7713 27.2015C6.70025 27.2024 6.7004 27.2024 6.62928 27.2027C6.62928 27.2027 3.24749 27.2027 1.63932 27.2027C1.419 27.2027 1.2077 27.1151 1.05191 26.9594C0.896117 26.8036 0.808594 26.5923 0.808594 26.372C0.808594 25.2673 0.808594 23.3259 0.808594 22.2202C0.808595 21.9995 0.89645 21.7878 1.05276 21.632C1.20908 21.4761 1.421 21.3889 1.64174 21.3895C3.33311 21.3967 5.01392 21.4196 6.70913 21.3866C6.76543 21.3851 6.82161 21.3825 6.87781 21.3787C7.04448 21.3664 7.21001 21.3437 7.37359 21.3093C8.06915 21.1632 8.71065 20.8235 9.29004 20.4206C9.42274 20.3284 9.55273 20.2322 9.68031 20.133C10.2978 19.6528 10.8603 19.1041 11.392 18.5315C12.0232 17.8516 12.6124 17.1333 13.1837 16.4027L13.799 15.5911L14.5072 14.6569C14.9612 14.0438 15.4134 13.4294 15.8683 12.817C16.282 12.2618 16.6982 11.7085 17.1242 11.1626L17.4301 10.7836L18.1915 9.84037C18.4439 9.53963 18.7008 9.24268 18.9635 8.95088C19.1678 8.72395 19.3755 8.50011 19.5872 8.28015C20.8376 6.9813 22.2431 5.79893 23.8667 4.9944C24.0704 4.89344 24.2772 4.79867 24.4868 4.71062C24.7631 4.59454 25.0444 4.49019 25.3299 4.39875C25.7105 4.27682 26.0986 4.1779 26.4915 4.104C27.0605 3.99696 27.6378 3.94478 28.2166 3.94251H28.2223V0.619629L35.2835 6.85003L28.2223 13.0804V9.75701L28.2224 9.757ZM28.2224 21.3876V18.0647L35.2835 24.2951L28.2224 30.5255V27.2027H28.2167C27.6367 27.2004 27.0583 27.1484 26.488 27.0417C26.0943 26.968 25.7053 26.8693 25.3236 26.7477C25.0375 26.6564 24.7555 26.5523 24.4783 26.4364C24.2681 26.3485 24.0607 26.2539 23.8563 26.1531C22.2674 25.3692 20.885 24.2243 19.6534 22.9622C19.4398 22.7433 19.2303 22.5204 19.0243 22.2942L18.5104 21.7081L19.0734 21.0081C19.5085 20.4517 19.9335 19.8875 20.3558 19.3213C20.8608 18.6418 21.3619 17.9594 21.8667 17.2798L22.1157 16.9602C22.6662 17.6429 23.2204 18.2913 23.8152 18.9009C24.3183 19.4165 24.8517 19.9072 25.4358 20.3303C26.0625 20.7841 26.764 21.1712 27.5305 21.3206C27.7493 21.3633 27.9711 21.3849 28.1939 21.3875L28.2223 21.3876H28.2224ZM12.741 14.2297L11.7126 13.0008C11.1165 12.3277 10.4854 11.679 9.78491 11.1135C9.65677 11.01 9.52623 10.9095 9.39296 10.8128C9.28852 10.737 9.1824 10.6634 9.07447 10.5926C8.51352 10.2247 7.89381 9.92389 7.22811 9.80926C7.03763 9.77646 6.8451 9.75995 6.65188 9.75768L6.61797 9.75755C6.61797 9.75755 3.24504 9.75755 1.63935 9.75755C1.18056 9.75755 0.808637 9.38562 0.808633 8.92683C0.808633 7.82139 0.808633 5.8781 0.808633 4.77286C0.808631 4.31425 1.18027 3.9424 1.63888 3.94214C3.32505 3.94073 5.01123 3.93619 6.69738 3.94279C6.77091 3.94366 6.84438 3.94509 6.91789 3.94711C7.11243 3.95396 7.30664 3.96534 7.50047 3.98356C7.8817 4.01938 8.26068 4.07872 8.63472 4.16063C9.00076 4.24079 9.362 4.34256 9.71643 4.46411C9.99909 4.56105 10.2774 4.67055 10.5507 4.79139C10.7787 4.89222 11.0032 5.00092 11.224 5.11675C12.7098 5.89629 14.0096 6.98776 15.1757 8.18507C15.3889 8.40393 15.5979 8.62679 15.8034 8.85285L16.3483 9.4752L15.8144 10.1405C15.3806 10.6964 14.9567 11.2598 14.5353 11.8252C14.0312 12.504 13.5308 13.1855 13.0264 13.8641L12.741 14.2297L12.741 14.2297Z" fill="white"/>
            <Path fill-rule="evenodd" clip-rule="evenodd" d="M28.2224 9.757L28.1384 9.75854C27.9372 9.76407 27.7371 9.78532 27.5395 9.82402C26.8557 9.95801 26.2236 10.2854 25.6529 10.6763C25.5441 10.7509 25.4371 10.8281 25.3319 10.9075C24.7196 11.3695 24.1625 11.9024 23.6368 12.4597C23.0073 13.1272 22.4211 13.8346 21.8536 14.5551L21.0575 15.5974L20.682 16.0891C20.1268 16.8341 19.5774 17.5834 19.0232 18.3291C18.6087 18.8848 18.1916 19.4385 17.7646 19.9847L17.4273 20.4028L16.7782 21.2075C16.5259 21.5093 16.2692 21.8074 16.0067 22.1005C15.8026 22.3285 15.5951 22.5534 15.3835 22.7745C14.1349 24.08 12.7337 25.2716 11.115 26.0931C10.9121 26.196 10.7061 26.2929 10.4972 26.3833C10.222 26.5023 9.94186 26.6099 9.65741 26.7048C9.27818 26.8313 8.89139 26.9352 8.49954 27.0145C8.12246 27.0908 7.74076 27.1443 7.35718 27.1742C7.16216 27.1894 6.96686 27.1977 6.7713 27.2015C6.70025 27.2024 6.7004 27.2024 6.62928 27.2027C6.62928 27.2027 3.24749 27.2027 1.63932 27.2027C1.419 27.2027 1.2077 27.1151 1.05191 26.9594C0.896117 26.8036 0.808594 26.5923 0.808594 26.372C0.808594 25.2673 0.808594 23.3259 0.808594 22.2202C0.808595 21.9995 0.89645 21.7878 1.05276 21.632C1.20908 21.4761 1.421 21.3889 1.64174 21.3895C3.33311 21.3967 5.01392 21.4196 6.70913 21.3866C6.76543 21.3851 6.82161 21.3825 6.87781 21.3787C7.04448 21.3664 7.21001 21.3437 7.37359 21.3093C8.06915 21.1632 8.71065 20.8235 9.29004 20.4206C9.42274 20.3284 9.55273 20.2322 9.68031 20.133C10.2978 19.6528 10.8603 19.1041 11.392 18.5315C12.0232 17.8516 12.6124 17.1333 13.1837 16.4027L13.799 15.5911L14.5072 14.6569C14.9612 14.0438 15.4134 13.4294 15.8683 12.817C16.282 12.2618 16.6982 11.7085 17.1242 11.1626L17.4301 10.7836L18.1915 9.84037C18.4439 9.53963 18.7008 9.24268 18.9635 8.95088C19.1678 8.72395 19.3755 8.50011 19.5872 8.28015C20.8376 6.9813 22.2431 5.79893 23.8667 4.9944C24.0704 4.89344 24.2772 4.79867 24.4868 4.71062C24.7631 4.59454 25.0444 4.49019 25.3299 4.39875C25.7105 4.27682 26.0986 4.1779 26.4915 4.104C27.0605 3.99696 27.6378 3.94478 28.2166 3.94251H28.2223V0.619629L35.2835 6.85003L28.2223 13.0804V9.75701L28.2224 9.757ZM28.2224 21.3876V18.0647L35.2835 24.2951L28.2224 30.5255V27.2027H28.2167C27.6367 27.2004 27.0583 27.1484 26.488 27.0417C26.0943 26.968 25.7053 26.8693 25.3236 26.7477C25.0375 26.6564 24.7555 26.5523 24.4783 26.4364C24.2681 26.3485 24.0607 26.2539 23.8563 26.1531C22.2674 25.3692 20.885 24.2243 19.6534 22.9622C19.4398 22.7433 19.2303 22.5204 19.0243 22.2942L18.5104 21.7081L19.0734 21.0081C19.5085 20.4517 19.9335 19.8875 20.3558 19.3213C20.8608 18.6418 21.3619 17.9594 21.8667 17.2798L22.1157 16.9602C22.6662 17.6429 23.2204 18.2913 23.8152 18.9009C24.3183 19.4165 24.8517 19.9072 25.4358 20.3303C26.0625 20.7841 26.764 21.1712 27.5305 21.3206C27.7493 21.3633 27.9711 21.3849 28.1939 21.3875L28.2223 21.3876H28.2224ZM12.741 14.2297L11.7126 13.0008C11.1165 12.3277 10.4854 11.679 9.78491 11.1135C9.65677 11.01 9.52623 10.9095 9.39296 10.8128C9.28852 10.737 9.1824 10.6634 9.07447 10.5926C8.51352 10.2247 7.89381 9.92389 7.22811 9.80926C7.03763 9.77646 6.8451 9.75995 6.65188 9.75768L6.61797 9.75755C6.61797 9.75755 3.24504 9.75755 1.63935 9.75755C1.18056 9.75755 0.808637 9.38562 0.808633 8.92683C0.808633 7.82139 0.808633 5.8781 0.808633 4.77286C0.808631 4.31425 1.18027 3.9424 1.63888 3.94214C3.32505 3.94073 5.01123 3.93619 6.69738 3.94279C6.77091 3.94366 6.84438 3.94509 6.91789 3.94711C7.11243 3.95396 7.30664 3.96534 7.50047 3.98356C7.8817 4.01938 8.26068 4.07872 8.63472 4.16063C9.00076 4.24079 9.362 4.34256 9.71643 4.46411C9.99909 4.56105 10.2774 4.67055 10.5507 4.79139C10.7787 4.89222 11.0032 5.00092 11.224 5.11675C12.7098 5.89629 14.0096 6.98776 15.1757 8.18507C15.3889 8.40393 15.5979 8.62679 15.8034 8.85285L16.3483 9.4752L15.8144 10.1405C15.3806 10.6964 14.9567 11.2598 14.5353 11.8252C14.0312 12.504 13.5308 13.1855 13.0264 13.8641L12.741 14.2297L12.741 14.2297Z" fill="#00E0FF"/>
            </G>
          </Svg>
        </TouchableOpacity>
        {parseInt(this.state.data[0].remixCount) > 0 ?
        <Text style={{textAlign: 'center', color: '#00E0FF' }}>{this.state.data[0].remixCount}</Text> : null}
        </View>
        <View>
        <TouchableOpacity style={{ marginLeft: 5, paddingTop: 0, alignItems: 'center', justifyContent: 'center'}}
            onPress={() => {
                this.state.imageUrls[0] && this.state.imageUrls[0].length
                ? this.state.imageUrls[0].map((uri) => (
                  Share.share({
                    message:
                    'Check the Awesome Meme in Meme app ' + uri,
                  })
                )) : null
              }}>
          <FIcon name="triangle" size={63} color='black' style={{shadowOpacity: 1}} />      
           <Icon name="triangle" size={63} color='transparent' style={{position: 'absolute', alignSelf: 'center'}} />          
           <Svg width="32" height="33" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg"
           style={{position: 'absolute', top: 20, right: 23}}>
            <Path d="M28.625 22.7505C27.3003 22.7505 26.0828 23.2086 25.1217 23.9748L19.1166 20.2216C19.2945 19.4172 19.2945 18.5837 19.1166 17.7793L25.1217 14.0261C26.0828 14.7923 27.3003 15.2505 28.625 15.2505C31.7316 15.2505 34.25 12.7321 34.25 9.62549C34.25 6.51891 31.7316 4.00049 28.625 4.00049C25.5184 4.00049 23 6.51891 23 9.62549C23 10.0449 23.0463 10.4534 23.1334 10.8466L17.1283 14.5998C16.1672 13.8336 14.9497 13.3755 13.625 13.3755C10.5184 13.3755 8 15.8939 8 19.0005C8 22.1071 10.5184 24.6255 13.625 24.6255C14.9497 24.6255 16.1672 24.1673 17.1283 23.4012L23.1334 27.1543C23.0446 27.5553 22.9999 27.9648 23 28.3755C23 31.4821 25.5184 34.0005 28.625 34.0005C31.7316 34.0005 34.25 31.4821 34.25 28.3755C34.25 25.2689 31.7316 22.7505 28.625 22.7505Z" fill="#8000FE"/>
           </Svg>
          </TouchableOpacity>
        </View> 
        <TouchableOpacity style={{marginHorizontal: 10, alignItems: 'flex-end', position: 'absolute', right: 23, top: 18,
           alignSelf: 'flex-end'}}
                onPress={() => this.setState({showAwards: true, currentAwardUser: this.state.data[0].user})}>
             <FIcon name="gift" size={29} color='#ababab' />      
           </TouchableOpacity>
        </View>   
          <Input placeholder="type a comment" style={{
           backgroundColor: '#484848', marginTop: 25, borderWidth: 0, borderColor: '#484848', width: '100%', marginBottom: 0,
            alignSelf: 'center', marginHorizontal: 10, 
          }} textStyle={{color: this.state.dark ?'white' : '#dbdbdb'}} placeholderTextColor={this.state.dark ?'white' : '#dbdbdb'} size="large"
           accessoryRight={props =>  <TouchableOpacity style={{height: 30, marginHorizontal: 10, marginRight: 16, flexDirection: 'row'}}
          onPress={() =>  {
            this.setState({showComments: true, currentPostId: this.state.data[0].id, currentPostAuthor: this.state.data[0].user})
            this.fetchComments(this.state.data[0].id)
          }}>
            <FIcon name='message-circle' size={30} color="#ababab" />
           <Text style={{fontWeight: 'bold', color: this.state.dark ?'white' : '#5c5c5c', marginLeft: 3,
             position: 'absolute', left: 31 }}>{parseInt(this.state.data[0].comments) > 0 ? this.state.data[0].comments : null}</Text>
          </TouchableOpacity>}
          onFocus={() => {
            this.setState({showComments: true, currentPostId: this.state.data[0].id, currentPostAuthor: this.state.data[0].user})
            this.fetchComments(this.state.data[0].id)
          }} 
          multiline={true}/></Animated.View>
        </Layout>
      </ApplicationProvider>
    )
        }
  }
}

var twoMatrix = [[1, 1], [2]]
var threeMatrix = [[3], [2, 1], [1,2]]
var fourMatrix = [[2, 2], [3, 1], [2, 1, 1], [4]]
var colors = [
  {value: 'black'}, {value: 'brown'}, {value: '#FF0000'}, {value: '#FE7E00'}, {value: 'yellow'},
  {value: '#01FF01'}, {value: '#00EFFE'}, {value: '#0000FE'}, {value: '#FF00FE'}, {value: 'white'}, {value: 'grey'}
]
var brushSizes = [40, 30, 25, 20, 15, 12, 10, 8]

class Create extends React.Component{
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      header: null
    };
  };
  constructor(props){
    super(props)
    this.handleBack = this.handleBack.bind(this)
    this.state = {
      user: '',
      photos: [],
      images: [],
      contests: [],
      joinedContest: false,
      showPhotosFrom: 'device',
      selectTemplate: true,
      selectImage: false,
      numImages: 0,
      matrix: [],
      showTextTools: false,
      showStickerTools: false,
      showImageTools: false,
      finalize: false,
      texts: [],
      editingTextID: 0,
      strokeWidth: 15,
      strokeColor: 'black',
      stickers: [],
      currentStickerIdx: 0,
      addOverlay: false,
      showDrawTools: false,
      textArea: false,
      textAtTop: true,
      isResizing: false,
      refreshingPhotos: false,
      enableLabel: false,
      enableDelete: false,
      showConfirmation: false,
      currentTextColor: 'black',
      currentBGColor: 'transparent',
      contestCost: 0,
      Posted: false,
      caption: '',
      remixUri: '',
      removeOutlines: false
    }
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBack)
    this.getPhotos()
    this.fetchUser()
  }
  
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
  }
  handleBack(){
    if(!this.state.selectTemplate && !this.state.finalize && !this.state.Posted){
        Alert.alert('Discard Meme?', 'You will lose your beautiful Meme if you go back :P', [
          {
            text: 'Cancel'
          },
          {
            text: 'Discard',
            onPress: () => this.props.navigation.goBack()
          }
        ], {cancelable: true})
    }else{
      this.props.navigation.goBack()
    }
    return true
  }
  fetchUser = async() => {
    const { params } = this.props.navigation.state
    const user = params ? params.user : null
    const mix = params ? params.mixContent : null
    const dark = params ? params.dark : null
    

    this.setState({user: user, remixUri: mix, dark : dark})
    if(mix){
      this.setState({selectTemplate: false, images: [...this.state.images, this.state.remixUri], numImages: 1})
      console.log(mix)
      console.log(this.state.images)
    }
  }
   hasAndroidPermission = async() => {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
  
    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }
  
    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }
  getPhotos = async(isSelection) => {
    if (Platform.OS === "android" && !(await this.hasAndroidPermission())) {
      return;
    }
    CameraRoll.getPhotos({
      first: 200,
      assetType: 'Photos',
    })
    .then(r => {
      if(isSelection == 'yes'){
        this.setState({ photos: r.edges,  refreshingPhotos: false, showImageTools: true })
      }else{
        this.setState({ photos: r.edges, showPhotosFrom: 'device', images: [r.edges[0].node.image.uri ? r.edges[0].node.image.uri : null], numImages: 1, refreshingPhotos: false })
      }
      this.fetchGemsBalance()
    })
    .catch((err) => {
       //Error Loading Images
       console.log('err:', err)
    })
  }
  getTemplates(){
    fetch('https://lishup.com/app/memeTemplates.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({photos: responseJson, images: [responseJson[0].url], numImages: 1, refreshingPhotos: false, showPhotosFrom: 'templates'})
    })
  }
  renderGallery = ({item, idx}) => (
    <View>
      <TouchableOpacity onPress={() => {
         if(this.state.images.includes(this.state.showPhotosFrom == 'templates' ? item.url : item.node.image.uri)){
          var i = 0;
          while (i < this.state.images.length) {
            if (this.state.images[i] === (this.state.showPhotosFrom == 'templates' ? item.url : item.node.image.uri)) {
              let images = this.state.images
              images.splice(i, 1)
              this.setState({images: images,  numImages: this.state.numImages - 1})
            } else {
              ++i;
            }
          }
         } else{
          this.setState({images: this.state.showPhotosFrom == 'templates' ?
          [item.url] :  [...this.state.images, item.node.image.uri], numImages: this.state.showPhotosFrom == 'templates' ? 1 : this.state.numImages + 1})
         }
      }}
       style={{backgroundColor: 'black', margin: 5/3, }}>
    <Image key={idx} style={{
      width: (Dimensions.get('window').width / 3) - 1.5,
      height: Dimensions.get('window').width / 3,
      resizeMode: 'cover',
      opacity: this.state.images.includes(this.state.showPhotosFrom == 'templates' ? item.url : item.node.image.uri) ? 0.5 : 1
    }}
    source={{ uri: this.state.showPhotosFrom == 'templates' ? item.url : item.node.image.uri}}  />
    </TouchableOpacity>
    </View>
  )
  renderPickerGallery = ({item, idx}) => (
    <View>
      <TouchableOpacity onPress={() => {
          this.setState({stickers: [...this.state.stickers, { url : item.node.image.uri, height: 120, width: 120 }] })
      }}
       style={{backgroundColor: 'black', margin: 5, }}>
      <Image key={idx} style={{
        width: (Dimensions.get('window').width / 2) - 5,
        height: Dimensions.get('window').width / 2,
        resizeMode: 'cover'
      }}
      source={{ uri: item.node.image.uri}}  />
    </TouchableOpacity>
    </View>
  )
  fetchContests(){
      fetch('https://lishup.com/app/fetchContests.php', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      })
      .then((response) => response.json())
      .then((responseJson) => {
          this.setState({contests: responseJson})
      })
      .catch((err) => {
        console.log(err)
        ToastAndroid.show('Request Failed', ToastAndroid.SHORT)
      })
  }
  changeTextSize(val){
    for (var i in this.state.texts) {
      if (this.state.texts[i].id == this.state.editingTextID) {
        let data = this.state.texts
         data[i].FontSize = val
         data[i].LineHeight = val + 5
         this.setState({texts: data})
         break
      }
    }
  }
  changeStickerSize(val){
    var newMarkers = this.state.stickers
    newMarkers[this.state.currentStickerIdx].height = val
    newMarkers[this.state.currentStickerIdx].width = val
    this.setState({ stickers: newMarkers })
    console.log(newMarkers)
  }
  changeTextColor(val){
    for (var i in this.state.texts) {
      if (this.state.texts[i].id == this.state.editingTextID) {
        let data = this.state.texts
         data[i].FontColor = val
         this.setState({texts: data, currentTextColor: val})
         break
      }
    }
  }
  changeText(val){
    for (var i in this.state.texts) {
      if (this.state.texts[i].id == this.state.editingTextID) {
        let data = this.state.texts
         data[i].text = val
         this.setState({texts: data})
         break
      }
    }
  }
  changeTextFont(val){
    for (var i in this.state.texts) {
      if (this.state.texts[i].id == this.state.editingTextID) {
        let data = this.state.texts
         data[i].FontFamily = val
         this.setState({texts: data})
         break
      }
    }
  }
  getText(){
    for (var i in this.state.texts) {
      if (this.state.texts[i].id == this.state.editingTextID) {
        let data = this.state.texts
        return data[i].text
      }
    }
  }
  getTextDetails(dataGiven, typeGiven){
    for (var i in this.state.texts) {
      if (this.state.texts[i].id == this.state.editingTextID) {
        let data = this.state.texts
        if(!dataGiven){
          if(typeGiven == 'text'){
            return data[i].text
          }else if(typeGiven == 'FontSize'){
            return parseInt(data[i].FontSize)
          }else if(typeGiven == 'color'){
            return parseInt(data[i].FontColor)
          }
        }else{
          if(dataGiven == data[i].FontFamily){
            return true
          }else{
            return false
          }
        }
        break
      }
    }
  }
  changeTextBgColor(val){
    for (var i in this.state.texts) {
      if (this.state.texts[i].id == this.state.editingTextID) {
        let data = this.state.texts
         data[i].BackgroundColor = val
         this.adjustTextColor(val)
         this.setState({texts: data, currentBGColor: val})
         break
      }
    }
  }
  adjustTextColor(color){
    var r, g, b, hsp;
    if (color.match(/^rgb/)) {
     color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/)
        r = color[1];
        g = color[2];
        b = color[3];
    } 
    else {
        color = +("0x" + color.slice(1).replace( 
        color.length < 5 && /./g, '$&$&'));

        r = color >> 16;
        g = color >> 8 & 255;
        b = color & 255;
    }
    hsp = Math.sqrt(
    0.299 * (r * r) +
    0.587 * (g * g) +
    0.114 * (b * b)
    );
    if (hsp>127.5) {
        this.changeTextColor('black')
    } 
    else {
      this.changeTextColor('white')
    }
  }
  renderColors = ({item}) => (
    <TouchableOpacity onPress={() => this.changeTextColor(item.value)}>
    <View style={{backgroundColor: item.value, width: 40, height: 40, borderRadius: 20, 
      margin: 10, borderColor: item.value == 'white' ? 'black' : 'white', 
      borderWidth: this.state.currentTextColor == item.value ? 2 : 0}} />
    </TouchableOpacity>
  )
  renderBgColors = ({item}) => (
    <TouchableOpacity onPress={() => this.changeTextBgColor(item.value)}>
    <View style={{backgroundColor: item.value, width: 40, height: 40, borderRadius: 20, 
      margin: 10, borderColor: item.value == 'white' ? 'black' : 'white', borderWidth: this.state.currentBGColor == item.value ? 2 : 0}} />
    </TouchableOpacity>
  )
  renderDrawColors = ({item}) => (
    <TouchableOpacity onPress={() => this.setState({strokeColor: item.value})}>
      <View style={{backgroundColor: item.value, width: 40, 
        height:  40, borderRadius: 20, 
          margin: 10, borderColor: item.value == 'white' ? 'black' : 'white', borderWidth: this.state.strokeColor == item.value ? 2 : 0}} />
    </TouchableOpacity>
  )
  renderBrushes = ({item}) => (
    <TouchableOpacity onPress={() => this.setState({strokeWidth: item})}>
    <View style={{backgroundColor:'black', width: item, height: item, borderRadius: item/2, 
    borderWidth: this.state.strokeWidth == item ? 1 : 0, borderColor: 'white',
      margin: 5, alignSelf: 'center'}} />
    </TouchableOpacity>
  )
  addSticker(){
    GiphyUi.present(
      {
        theme: 'dark',
        layout: 'waterfall',
        rating: 'ratedPG',
        showConfirmationScreen: true,
        mediaTypes: ['gifs', 'stickers', 'emoji', 'text'],
      },
      selectedMedia => {
        this.setState({
          stickers: [...this.state.stickers, {url: selectedMedia.images.downsized.url, height: 120, width: 120}],
          showStickerTools: true,
          currentStickerIdx: Object.keys(this.state.stickers).length,
          showDrawTools: false,
          showTextTools: false,
          resizeMode: false
        })
      }
    )
  }
  addText(){
    if(Object.keys(this.state.texts).length > 0){
      var nid = this.state.texts[Object.keys(this.state.texts).length - 1].id + 1
    } else {
      var nid = 1
    }
   this.setState({
      texts: [...this.state.texts, {id: nid, text: 'Add Text', FontSize: 35, FontFamily: 'impact', FontColor: 'white', TextAlign: 'center', LineHeight: 40, BackgroundColor: 'transparent'}],
      showTextTools: false,
      editingTextID: nid,
      showDrawTools: false,
      showStickerTools: false,
      resizeMode: false
    })
  }
  showSelectedImages = ({item, index}) => (
    this.state.numImages == 1 ? <NativeImage source={{uri: item}} style={{flex: 1}} resizeMode="contain" />
    : this.state.numImages == 2 ? <StaticCollage matrix={twoMatrix[index]} width='100%'
    height='100%'
    images={ 
      this.state.images
    }/> :  this.state.numImages == 3 ? <StaticCollage matrix={threeMatrix[index]} width='100%'
    height='100%'
    images={ 
      this.state.images
    }/> : this.state.numImages == 4 ? <StaticCollage matrix={fourMatrix[index]} width='100%'
    height='100%'
    images={ 
      this.state.images
    }/> : null
  )
  addContest(idx){
    for (var i in this.state.contests) {
      if (this.state.contests[i].title == idx.title) {
        let data = this.state.contests
        if(data[i].isChecked == false){
          this.setState({contestCost: parseInt(this.state.contestCost) +  parseInt(idx.cost), caption: this.state.caption + ' #' + idx.title.replace(/\s/g, '') })

        }else{
          var copy = this.state.caption
          var tag = '#' + idx.title.replace(/\s/g, '')
          var ret = copy.replace(tag,'')
          this.setState({contestCost: parseInt(this.state.contestCost) - parseInt(idx.cost), caption: ret })
        }
         data[i].isChecked = !data[i].isChecked
         this.setState({contests: data,  })
         break
      }
    }
  }
  post(){
    const { params } = this.props.navigation.state
    const mixId = params ? params.mixId : null
    const mix = params ? params.mixContent : null

    ToastAndroid.show('Baking your Ugly Meme', ToastAndroid.SHORT)
    let upload = RNFetchBlob.fetch('POST', 'https://lishup.com/app/upload.php', {
            'Content-Type' : 'multipart/form-data',
            "Accept":"multipart/form-data",
          }, [
            { name : 'image', filename : 'image.jpg', data: RNFetchBlob.wrap(this.state.meme)},
          ])
        setTimeout(()=>{
          upload.uploadProgress({ interval:1 }, (written, total) => {
            let uploaded = (written / total) * 100
            ToastAndroid.show(uploaded.toFixed(1) + '% Uploaded', ToastAndroid.SHORT)
      })
        }, 0)
        
        upload.then((resp) => {
          var check = resp.text()
          if(check != 'error'){
            this.setState({meme: resp.text()})
            fetch('https://lishup.com/app/newpost.php', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                  user: this.state.user, img: resp.text(), 
                  text: this.state.caption, community: 46, 
                  cost: this.state.contestCost,
                  remixed: this.state.remixUri,
                  remixID: mixId }),
              })
              .then((response) => response.json())
              .then((responseJson) => {
                  if(responseJson == 'success'){
                    ToastAndroid.show('Posted Successfully', ToastAndroid.SHORT)
                    this.setState({Posted: true, finalize: false})
                  }else{
                    ToastAndroid.show(responseJson, ToastAndroid.SHORT)
                  }
              })
              .catch((err) => {
                console.log(err)
                ToastAndroid.show('Request Failed. Please Try Again', ToastAndroid.SHORT)
              })
          }else{
            ToastAndroid.show('Request Failed. Please Try Again', ToastAndroid.SHORT)
          }
        })
  }
  joinContest(){
    if(this.state.contestCost > this.state.gems){
      ToastAndroid.show("Uh! You don't have enough Gems", ToastAndroid.LONG)
    }else{
      fetch('https://lishup.com/app/joinContest.php', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          user: this.state.user, 
          text: this.state.caption,
          cost: this.state.contestCost}),
          
      })
      .then((response) => response.json())
      .then((responseJson) => {
          if(responseJson == 'success'){
            ToastAndroid.show('Joined Successfully', ToastAndroid.SHORT)
            this.setState({joinedContest: true})
          }else{
            ToastAndroid.show(responseJson, ToastAndroid.SHORT)
          }
      })
      .catch((err) => {
        console.log(err)
        ToastAndroid.show('Request Failed. Please Try Again', ToastAndroid.SHORT)
      })
    }
  }
  joinedContestYet(){
    if (this.state.contests.some(e => e.isChecked === true)) {
      return true
    }
    return false
  }
  fetchGemsBalance(){
    fetch('https://lishup.com/app/user.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: this.state.user,
        current: this.state.user
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({gems: responseJson.points, userpic: responseJson.pic})
      //console.log(responseJson)
    })
  }
  render(){
    if(this.state.selectTemplate){
      return(
        <View style={{flex: 1, backgroundColor: 'black'}}> 
           <NativeText style={{color: 'white', top: 20, textAlign: 'center', fontSize: 20, marginBottom: 50,
              fontFamily: 'impact'}}>Choose Layout</NativeText>
           <TouchableOpacity style={{ top: 20, position: 'absolute', right: 20}} onPress={() =>{
               if(this.state.numImages > 0 && this.state.numImages < 5){
                this.setState({selectTemplate: false, isResizing: false, showTextTools: false, showStickerTools: false, showImageTools: false,
                  matrix: this.state.numImages > 1 ? this.state.numImages == 2 ? twoMatrix[this._carousel.currentIndex] : this.state.numImages == 3 ?
                  threeMatrix[this._carousel.currentIndex] : fourMatrix[this._carousel.currentIndex] : [] })
                  this.addText()
               }else{
                 ToastAndroid.show('Please choose min 1 and max 4 Photos', ToastAndroid.SHORT)
               }
             }}> 
             <Icon name="arrow-forward-circle" size={40} color="#00BBFF"  
             /></TouchableOpacity>
            <Carousel
              ref={(c) => { this._carousel = c; }}
              data={this.state.images}
              renderItem={this.showSelectedImages}
              sliderWidth={Dimensions.get('window').width}
              sliderHeight={Dimensions.get('window').height / 2}
              itemWidth={Dimensions.get('window').width - 70}
              itemHeight={Dimensions.get('window').height / 2}
              containerCustomStyle={{marginBottom: 10}}
              layout={'default'} layoutCardOffset={18}
            />
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}><CheckBox
                disabled={false}
                value={this.state.textArea}
                onValueChange={(newValue) => this.setState({textArea: !this.state.textArea})}
                tintColors={{true:'#00BBFF', false:'#fff'}}
              /><NativeText style={{color: 'white'}} onPress={() => this.setState({textArea: !this.state.textArea})}>
                Add Text Area</NativeText>
                {this.state.textArea ? 
           <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 5, marginLeft: 20}}>
             <Svg width="21" height="43" viewBox="0 0 21 43" fill="none" xmlns="http://www.w3.org/2000/Svg">
              <Rect x="1" y="0.944336" width="20" height="13.3333" fill="white" fill-opacity="0.2"/>
              <Rect x="1" y="0.944336" width="20" height="13.3333" fill={this.state.textAtTop ? 'white' : 'black'}/>
              <Rect x="1.55556" y="29.2776" width="18.8889" height="12.2222" fill={!this.state.textAtTop ? 'white' : 'black'} fill-opacity="0.2" stroke="#C0C0C0" stroke-width="1.11111" stroke-dasharray="2.22 1.11"/>
              <Path d="M7.74487 8.36212H6.70392V8.11768C6.70392 7.83569 6.73596 7.61871 6.80005 7.46674C6.86597 7.31293 6.99689 7.17743 7.19281 7.06024C7.38873 6.94305 7.64325 6.88446 7.95636 6.88446C8.33173 6.88446 8.61462 6.95129 8.80505 7.08496C8.99548 7.2168 9.10992 7.37976 9.14838 7.57385C9.18683 7.76611 9.20605 8.16345 9.20605 8.76587V10.5951H8.12665V10.271C8.0589 10.401 7.97101 10.499 7.86298 10.5649C7.75677 10.629 7.62952 10.661 7.4812 10.661C7.28711 10.661 7.10858 10.607 6.94562 10.499C6.78448 10.3891 6.70392 10.1501 6.70392 9.7821V9.48273C6.70392 9.2099 6.74695 9.02405 6.83301 8.92517C6.91907 8.82629 7.13239 8.71094 7.47296 8.5791C7.83734 8.43628 8.03235 8.34015 8.05798 8.29071C8.08362 8.24127 8.09644 8.14056 8.09644 7.98859C8.09644 7.79816 8.08179 7.67456 8.05249 7.6178C8.02502 7.5592 7.97833 7.52991 7.91241 7.52991C7.83734 7.52991 7.79065 7.55463 7.77234 7.60407C7.75403 7.65167 7.74487 7.7771 7.74487 7.98035V8.36212ZM8.09644 8.862C7.91882 8.992 7.81537 9.10095 7.78607 9.18884C7.75861 9.27673 7.74487 9.40308 7.74487 9.56787C7.74487 9.75647 7.75677 9.87823 7.78058 9.93317C7.80621 9.9881 7.85565 10.0156 7.92889 10.0156C7.99847 10.0156 8.04333 9.99451 8.06348 9.95239C8.08545 9.90845 8.09644 9.79492 8.09644 9.61182V8.862ZM10.6974 6.14838V7.20032C10.789 7.09412 10.8906 7.01538 11.0023 6.96411C11.1158 6.91101 11.2385 6.88446 11.3704 6.88446C11.5223 6.88446 11.6542 6.90826 11.7659 6.95587C11.8776 7.00348 11.9627 7.07031 12.0213 7.15637C12.0799 7.24243 12.1147 7.32666 12.1257 7.40906C12.1385 7.49146 12.1449 7.66724 12.1449 7.9364V9.57886C12.1449 9.84619 12.1266 10.0458 12.09 10.1776C12.0552 10.3076 11.9719 10.4211 11.84 10.5182C11.7082 10.6134 11.5516 10.661 11.3704 10.661C11.2404 10.661 11.1186 10.6326 11.0051 10.5759C10.8934 10.5191 10.7908 10.434 10.6974 10.3204L10.626 10.5951H9.58783V6.14838H10.6974ZM11.0353 7.98584C11.0353 7.79724 11.0234 7.67456 10.9996 7.6178C10.9758 7.5592 10.9291 7.52991 10.8595 7.52991C10.7917 7.52991 10.7478 7.55554 10.7277 7.60681C10.7075 7.65625 10.6974 7.78259 10.6974 7.98584V9.55688C10.6974 9.75281 10.7084 9.87823 10.7304 9.93317C10.7542 9.9881 10.8 10.0156 10.8677 10.0156C10.9373 10.0156 10.9822 9.98718 11.0023 9.93042C11.0243 9.87366 11.0353 9.73724 11.0353 9.52118V7.98584ZM14.9629 8.32642H13.9164V7.90619C13.9164 7.7597 13.9045 7.66083 13.8807 7.60956C13.8569 7.55646 13.813 7.52991 13.7489 7.52991C13.6848 7.52991 13.6418 7.5528 13.6198 7.59857C13.5978 7.64435 13.5869 7.74689 13.5869 7.90619V9.62555C13.5869 9.75555 13.6033 9.85352 13.6363 9.91943C13.6692 9.98352 13.7178 10.0156 13.7819 10.0156C13.8569 10.0156 13.9073 9.98169 13.9329 9.91394C13.9604 9.84619 13.9741 9.71802 13.9741 9.52942V9.09546H14.9629C14.9611 9.3866 14.9501 9.60541 14.9299 9.75189C14.9116 9.89655 14.8503 10.0458 14.7459 10.1996C14.6434 10.3516 14.5088 10.4669 14.3422 10.5457C14.1755 10.6226 13.9695 10.661 13.7242 10.661C13.4111 10.661 13.163 10.6079 12.9799 10.5017C12.7968 10.3937 12.6667 10.2435 12.5898 10.0513C12.5148 9.85718 12.4772 9.58252 12.4772 9.2273V8.19183C12.4772 7.88239 12.5084 7.64893 12.5706 7.49146C12.6329 7.33398 12.7656 7.19391 12.9689 7.07123C13.1721 6.94672 13.4193 6.88446 13.7104 6.88446C13.9998 6.88446 14.2469 6.9458 14.452 7.06848C14.6571 7.19116 14.7935 7.34589 14.8613 7.53265C14.929 7.71942 14.9629 7.98401 14.9629 8.32642Z" fill="black"/>
              <Path d="M7.74487 36.14H6.70392V35.8955C6.70392 35.6135 6.73596 35.3965 6.80005 35.2446C6.86597 35.0908 6.99689 34.9553 7.19281 34.8381C7.38873 34.7209 7.64325 34.6623 7.95636 34.6623C8.33173 34.6623 8.61462 34.7291 8.80505 34.8628C8.99548 34.9946 9.10992 35.1576 9.14838 35.3517C9.18683 35.5439 9.20605 35.9413 9.20605 36.5437V38.3729H8.12665V38.0488C8.0589 38.1788 7.97101 38.2768 7.86298 38.3427C7.75677 38.4068 7.62952 38.4388 7.4812 38.4388C7.28711 38.4388 7.10858 38.3848 6.94562 38.2768C6.78448 38.1669 6.70392 37.928 6.70392 37.5599V37.2606C6.70392 36.9877 6.74695 36.8019 6.83301 36.703C6.91907 36.6041 7.13239 36.4888 7.47296 36.3569C7.83734 36.2141 8.03235 36.118 8.05798 36.0685C8.08362 36.0191 8.09644 35.9184 8.09644 35.7664C8.09644 35.576 8.08179 35.4524 8.05249 35.3956C8.02502 35.337 7.97833 35.3077 7.91241 35.3077C7.83734 35.3077 7.79065 35.3325 7.77234 35.3819C7.75403 35.4295 7.74487 35.5549 7.74487 35.7582V36.14ZM8.09644 36.6398C7.91882 36.7698 7.81537 36.8788 7.78607 36.9667C7.75861 37.0546 7.74487 37.1809 7.74487 37.3457C7.74487 37.5343 7.75677 37.6561 7.78058 37.711C7.80621 37.7659 7.85565 37.7934 7.92889 37.7934C7.99847 37.7934 8.04333 37.7723 8.06348 37.7302C8.08545 37.6863 8.09644 37.5728 8.09644 37.3896V36.6398ZM10.6974 33.9262V34.9781C10.789 34.8719 10.8906 34.7932 11.0023 34.7419C11.1158 34.6888 11.2385 34.6623 11.3704 34.6623C11.5223 34.6623 11.6542 34.6861 11.7659 34.7337C11.8776 34.7813 11.9627 34.8481 12.0213 34.9342C12.0799 35.0203 12.1147 35.1045 12.1257 35.1869C12.1385 35.2693 12.1449 35.4451 12.1449 35.7142V37.3567C12.1449 37.624 12.1266 37.8236 12.09 37.9554C12.0552 38.0854 11.9719 38.199 11.84 38.296C11.7082 38.3912 11.5516 38.4388 11.3704 38.4388C11.2404 38.4388 11.1186 38.4105 11.0051 38.3537C10.8934 38.2969 10.7908 38.2118 10.6974 38.0983L10.626 38.3729H9.58783V33.9262H10.6974ZM11.0353 35.7637C11.0353 35.5751 11.0234 35.4524 10.9996 35.3956C10.9758 35.337 10.9291 35.3077 10.8595 35.3077C10.7917 35.3077 10.7478 35.3334 10.7277 35.3846C10.7075 35.4341 10.6974 35.5604 10.6974 35.7637V37.3347C10.6974 37.5306 10.7084 37.6561 10.7304 37.711C10.7542 37.7659 10.8 37.7934 10.8677 37.7934C10.9373 37.7934 10.9822 37.765 11.0023 37.7083C11.0243 37.6515 11.0353 37.5151 11.0353 37.299V35.7637ZM14.9629 36.1042H13.9164V35.684C13.9164 35.5375 13.9045 35.4387 13.8807 35.3874C13.8569 35.3343 13.813 35.3077 13.7489 35.3077C13.6848 35.3077 13.6418 35.3306 13.6198 35.3764C13.5978 35.4222 13.5869 35.5247 13.5869 35.684V37.4034C13.5869 37.5334 13.6033 37.6313 13.6363 37.6973C13.6692 37.7614 13.7178 37.7934 13.7819 37.7934C13.8569 37.7934 13.9073 37.7595 13.9329 37.6918C13.9604 37.624 13.9741 37.4958 13.9741 37.3073V36.8733H14.9629C14.9611 37.1644 14.9501 37.3832 14.9299 37.5297C14.9116 37.6744 14.8503 37.8236 14.7459 37.9774C14.6434 38.1294 14.5088 38.2448 14.3422 38.3235C14.1755 38.4004 13.9695 38.4388 13.7242 38.4388C13.4111 38.4388 13.163 38.3857 12.9799 38.2795C12.7968 38.1715 12.6667 38.0214 12.5898 37.8291C12.5148 37.635 12.4772 37.3604 12.4772 37.0051V35.9697C12.4772 35.6602 12.5084 35.4268 12.5706 35.2693C12.6329 35.1118 12.7656 34.9717 12.9689 34.8491C13.1721 34.7245 13.4193 34.6623 13.7104 34.6623C13.9998 34.6623 14.2469 34.7236 14.452 34.8463C14.6571 34.969 14.7935 35.1237 14.8613 35.3105C14.929 35.4973 14.9629 35.7618 14.9629 36.1042Z" fill="black"/>
              <Rect x="1.71429" y="13.8808" width="18.5714" height="15.2381" fill="black" stroke="white" stroke-width="1.42857"/>
              <Path d="M7.58484 24.1313L9.92859 26.9532L13.2098 22.7251L17.4286 28.3501H4.30359L7.58484 24.1313Z" fill="black" stroke="white" stroke-width="1.875"/>
              </Svg>
        <View><CheckBox
           disabled={false}
           value={this.state.textAtTop}
           onValueChange={(newValue) => this.setState({textAtTop: !this.state.textAtTop})}
           tintColors={{true:'#00BBFF', false:'#fff'}}
         />
         <CheckBox
           disabled={false}
           value={!this.state.textAtTop}
           onValueChange={(newValue) => this.setState({textAtTop: !this.state.textAtTop})}
           tintColors={{true:'#00BBFF', false:'#fff'}}
         /></View>
           </View> : null}    
            </View>
              
          <View style={{alignSelf: 'center', width: '100%', marginBottom: 15, justifyContent: 'space-evenly',
             alignItems: 'center', flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => this.getPhotos()}>
            <NativeText style={{color: 'white', opacity: this.state.showPhotosFrom == 'device' ?
              1 : 0.5}} >Camera Roll</NativeText>
              </TouchableOpacity>
            <TouchableOpacity onPress={() => this.getTemplates()}> 
            <NativeText style={{color: 'white', opacity: this.state.showPhotosFrom == 'templates' ?
              1 : 0.5}}>Meme Templates</NativeText></TouchableOpacity>
          </View> 
           <View style={{height: Dimensions.get('window').height / 2.5}}>
          <FlatList 
            data={this.state.photos}
            renderItem={this.renderGallery}
            keyExtractor={(item, idx) => idx}
            numColumns={3}
            refreshControl={<RefreshControl
              colors={["yellow", "orange"]}
              onRefresh={() => {
                this.getPhotos()
                this.setState({refreshingPhotos: true})
              }}
              refreshing={this.state.refreshingPhotos} />}
          /></View>
        </View>
      )
    }else{

    if(!this.state.finalize && !this.state.Posted){
    return(
      <View style={{alignContent: 'center', backgroundColor: 'black', flex: 1}}>
        <Modal visible={this.state.isResizing && this.state.numImages == 1}
        onDismiss={() => {
          this.setState({isResizing: !this.state.isResizing})
        }}
        onRequestClose={() => {
          this.setState({isResizing: !this.state.isResizing})
        }}>
        <View style={{backgroundColor: 'black', justifyContent: 'center', flex: 1}}>
          <TouchableOpacity style={{backgroundColor: '#00BBFF', padding: 10, borderRadius: 15, top: 30, right: 20,
           position: 'absolute', elevation: 10}} 
          onPress={() => this.cropImg.saveImage(true, 90)}><NativeText style={{color: 'white', fontSize: 25}}>Done</NativeText></TouchableOpacity>
          <CropView
            sourceUrl={this.state.images[0]}
            style={{height: (Dimensions.get('window').height * 60) / 100, width: '100%', resizeMode: 'cover'}}
            onImageCrop={(res) => this.setState({images: [res.uri], isResizing: false})}
            ref={ref => this.cropImg = ref}
          />
          <TouchableOpacity style={{bottom: 30, left: 40,
           position: 'absolute', elevation: 10}} 
          onPress={() => this.cropImg.rotateImage(true)}><Icon name="reload-outline" size={40} color="white" /></TouchableOpacity>
          </View>
        </Modal>
        <View style={{height: 100, backgroundColor: 'black', zIndex: 4}} >
        <Icon name="arrow-forward-circle" size={40} color="#00BBFF" style={{ top: 20, position: 'absolute', right: 20}} 
             onPress={() => {
               this.setState({removeOutlines: true})
               this.refs.viewShot.capture().then(uri => {
              console.log("do something with ", uri)
              this.setState({meme: uri, cachedMeme: uri, finalize: true})
              
            })}}/>
        </View>
        <ViewShot ref="viewShot" options={{ format: "jpg", quality: 0.9 }}>
        <View style={{ height: (Dimensions.get('window').height * 60) / 100, width: '100%', flexDirection: 'row', position: 'absolute',
         marginTop: this.state.textAtTop && this.state.textArea ? 70 : 0, backgroundColor: 'transparent' }}>
         <SketchCanvas
            style={{ flex: 1, backgroundColor: 'transparent', zIndex: this.state.isResizing ? -10 : -2,}}
            strokeColor={this.state.strokeColor}
            strokeWidth={this.state.strokeWidth}
            ref={ref => this.canvas = ref}
            touchEnabled={this.state.showDrawTools}
          />
          </View>
          {this.state.texts.map((item, idx) => {
               return (  <DragTextEditor
              minWidth={100}
              minHeight={100}
              w={200}
              h={200}
              x={10}
              y={10}
              FontColor={item.FontColor}
              LineHeight={item.LineHeight}
              TextAlign={item.TextAlign}
              BackgroundColor={item.BackgroundColor}
              TopRightAction={() => { 
                const filtered = [...this.state.texts].filter(x => x.id !== item.id)
                this.setState({
                  texts:filtered, showStickerTools: false, showTextTools: false, showDrawTools: false 
                })
              }}
              PlaceHolder={item.text}
              FontSize={item.FontSize}
              centerPress={() => {
                var copy = this.state.texts
                if(copy[idx].text == 'Add Text'){
                   copy[idx].text = ''
                }
                this.setState({showTextTools: true, editingTextID: item.id, currentTextColor: item.FontColor,
               currentBGColor: item.BackgroundColor, texts: copy })
              }}
              FontFamily={item.FontFamily}
              style={{borderRadius: 8, zIndex: 200 }}
              isStroke={item.FontFamily == 'impact' ? true : false}
              isBorder={!this.state.removeOutlines}
            /> )
               })
            }
           {
             this.state.stickers.map((item, idx) => {
               return ( <Gestures ref={(c) => { this.gestures = c; }} onEnd={(event, styles) => {
                console.log(styles)
                this.setState({enableDelete: false})
                if(styles.top > (Dimensions.get('window').height * 60) / 100){
                  let copy = [...this.state.stickers]
                  copy.splice(idx, 1)
                  this.setState({
                    stickers: copy, showStickerTools: false, showTextTools: false, showDrawTools: false 
                  })
                }
              }}
                onStart={(event, styles) => {
                  this.setState({enableDelete: true})
                }}
                rotatable={false} style={{position: 'absolute', left: 0, right: 0, alignItems: "center"}} scalable={{
                  min: 0.1,
                  max: 5,
                }}>
                 <TouchableOpacity onPress={() => this.setState({showStickerTools: true, currentStickerIdx: idx})}>
                 <FastImage source={{uri: item.url}} style={{height: item.height, width: item.width}} resizeMode="contain"/>
                 </TouchableOpacity>
               </Gestures> )
             })
           } 
        {this.state.textAtTop && this.state.textArea  ?  <NativeImage source={require('./textArea.png')} style={{width: '100%', 
          height: 70,  alignSelf: 'center', zIndex: this.state.isResizing ? 3 : -1}} />   : null}
    { this.state.numImages == 1 ? <NativeImage
        source={{uri: this.state.remixUri ? this.state.remixUri : this.state.images[0]}}
        style={{height: (Dimensions.get('window').height * 60) / 100, width: '100%', zIndex: -10}} resizeMode="contain"
      /> : <DynamicCollage
    width='100%'
    height={(Dimensions.get('window').height * 60) / 100}
    images={this.state.images}
    matrix={ this.state.matrix }
    containerStyle={{borderWidth: 0, borderColor: 'transparent', alignSelf: 'center', zIndex: this.state.isResizing ? 2 : -10}} /> }
    {!this.state.textAtTop && this.state.textArea ?  <NativeImage source={require('./textArea.png')} style={{width: '100%', 
          height: 70,  alignSelf: 'center', zIndex: this.state.isResizing ? 3 : -1}} /> : null}
    </ViewShot>
    
    <View style={{flexDirection: 'row', backgroundColor: 'black', justifyContent: 'space-evenly', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#f2f2f2',
     zIndex: 4, bottom: 0, right: 0, left: 0, position: 'absolute'}}>
      <Icon name="text" size={30} color={this.state.showTextTools ? "#45DAFF" : "white"} 
        onPress={() => { this.addText() }}/>
      <View>
      <Icon name={this.state.showDrawTools ? "md-checkmark-done" : "brush"}
       size={30} color={this.state.showDrawTools ? "#45DAFF" : "white"} onPress={() => {
         if(this.state.showDrawTools){
           this.setState({showDrawTools: false})
         }else{
          this.setState({showDrawTools: true, 
            showTextTools: false, showStickerTools: false, isResizing: false}) 
         }
        }}/>

      </View>
      <View>
        <Icon name="crop" size={30} color={this.state.isResizing ? "#45DAFF" : "white"}
        onPress={() => { 
          if(this.state.showPhotosFrom == 'templates' && this.state.numImages == 1){
            ToastAndroid.show('Loading...', ToastAndroid.SHORT)
            RNFetchBlob
            .config({
              // add this option that makes response data to be stored as a file,
              // this is much more performant.
              fileCache : true,
            })
            .fetch('GET', this.state.images[0], {
              //some headers ..
            })
            .then((res) => {
              console.log(res.path())
              this.setState({images: ['file://' + res.path()]})
              this.setState({isResizing: !this.state.isResizing, 
                showTextTools: false, showStickerTools: false})
            })
          }else{
            this.setState({isResizing: !this.state.isResizing, 
              showTextTools: false, showStickerTools: false})
          }
           }} />
        {this.state.isResizing ? <TouchableOpacity onPress={() => this.setState({isResizing: false}) } 
       style={{backgroundColor: '#05FF00', padding: 3, height: 42, borderRadius: 20, marginTop: 2}}>
        <Icon size={35} name="md-checkmark-done" color="white"  /></TouchableOpacity> : null}
       </View>
      <Icon name="md-happy" size={30} color={this.state.showStickerTools ? "#45DAFF" : "white"} onPress={() => this.addSticker() } />
      <Icon name="image" size={30} color="white" 
        color={this.state.showImageTools ? "#45DAFF" : "white"} onPress={() => {
          this.getPhotos('yes')} } />
    </View>
    {this.state.enableDelete ?
    <Icon name="md-trash-bin" size={50} color="white" style={{position: 'absolute', bottom: 50, zIndex: 20, alignSelf: 'center'}} />
       : null}
    <Modal transparent={true} animationType="slide" visible={this.state.showImageTools}
        onDismiss={() => {
          this.setState({showImageTools: !this.state.showImageTools})
        }}
        onRequestClose={() => {
          this.setState({showImageTools: !this.state.showImageTools})
        }}>
      <View style={{backgroundColor: 'rgba(0, 0, 0, 0.8)', height: Dimensions.get('window').height / 2, bottom: 0, position: 'absolute',
        borderTopLeftRadius: 15, borderTopRightRadius: 15}}>
      <NativeText style={{fontSize: 20, color: 'white', textAlign: 'center', marginVertical: 10}}>Choose a Photo</NativeText>
      <FlatList 
            data={this.state.photos}
            renderItem={this.renderPickerGallery}
            keyExtractor={(item, idx) => idx}
            numColumns={2}
            refreshControl={<RefreshControl
              colors={["#9Bd35A", "#689F38"]}
              onRefresh={() => {
                this.getPhotos('yes')
                this.setState({refreshingPhotos: true})
              }}
              refreshing={this.state.refreshingPhotos} />}
          />
      </View>
    </Modal>
    <Modal transparent={true} visible={this.state.showTextTools}
        onDismiss={() => {
          this.setState({showTextTools: !this.state.showTextTools})
        }}
        onRequestClose={() => {
          this.setState({showTextTools: !this.state.showTextTools})
        }}>
      <View style={{backgroundColor: 'rgba(0, 0, 0, 0.5)', height: Dimensions.get('window').height}}>

        <View style={{position: 'absolute', margin: 0, alignSelf: 'flex-start', top: 100, left: 0, right: 0, alignItems: 'center'}}>
           <Slider minimumValue={15} maximumValue={50} onValueChange={val => this.changeTextSize(val)} style={{width: 200, height: 40}}
            thumbTintColor="white" minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#fff" value={this.getTextDetails(null, 'FontSize')} />
            </View>
        <View style={{position: 'absolute', alignSelf: 'center', top: 0, bottom: 0, justifyContent: 'center'
         }}>
        <TextInput onChangeText={val => this.changeText(val)} value={this.getTextDetails(null, 'text')} placeholder="Aa"
         style={{backgroundColor: 'transparent',  alignSelf: 'center', top: 0, bottom: 0, borderWidth: 0, borderColor: 'transparent',
         color: 'white', fontSize: 25, textAlign: 'center'}} 
           autoFocus={true} multiline={true}  ref={i => i && i.focus()} onSubmitEditing={() => {
            if(this.getTextDetails(null, 'text') == ''){
              this.changeText('Add Text')
            }
            this.setState({showTextTools: false})
          }} />
           <View style={{height: 50, alignSelf: 'center', width: '90%', marginTop: 30}}>
             <FlatList data={[{name: 'impact', title: 'Meme'}, {name: 'Arial', title: 'Classic'},
            {name: 'comicz', title: 'Comic'}, {name: 'Satisfy-Regular', title: 'Fancy'}, {name: 'Jokerman-Regular', title: 'Joker'}]}
            renderItem={({item, idx}) => (
              <NativeText style={{backgroundColor: this.getTextDetails(item.name) ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.5)', color:  'black', 
          borderRadius: 15, padding: 10, paddingVertical: 5, fontSize: 25, marginHorizontal: 2, fontFamily: item.name }}
              onPress={() => this.changeTextFont(item.name)}>{item.title}</NativeText>
            )} horizontal={true} 
            /></View>
         </View>

         <TouchableOpacity style={{backgroundColor: '#00BBFF', padding: 10, borderRadius: 15, top: 30, right: 20,
           position: 'absolute', elevation: 10}} 
          onPress={() => {
            if(this.getTextDetails(null, 'text') == ''){
              this.changeText('Add Text')
            }
            this.setState({showTextTools: false})
          }}><NativeText style={{color: 'white', fontSize: 25}}>Done</NativeText></TouchableOpacity>
      <View style={{ top: 100, height: '80%', alignSelf: 'flex-end'}}> 
        {this.getTextDetails('impact') ? null : <NativeText style={{backgroundColor: this.state.enableLabel ? '#000' : 'transparent', color: this.state.enableLabel ? '#fff' : 'white', 
        borderRadius: 15, marginRight: 8, padding: 10, paddingVertical: 5, fontSize: 25, alignSelf: 'flex-end' }}
            onPress={() =>{ this.setState({enableLabel: !this.state.enableLabel}) }}>Aa</NativeText>}
          {this.state.enableLabel ? <FlatList 
        data={colors}
        renderItem={this.renderBgColors}
        showsVerticalScrollIndicator ={false}
        extraData={this.state}
        />: <FlatList 
        data={colors}
        renderItem={this.renderColors}
        showsVerticalScrollIndicator ={false}
        extraData={this.state}
        />}</View>
        </View>   
    </Modal>
    {this.state.showStickerTools ? 
    <Icon size={40} name="arrow-undo-circle-outline" color="white" 
    style={{marginHorizontal: 10, top:80, elevation: 50, zIndex: 50, right: 30,  position: 'absolute'}}
       onPress={() => this.gestures.reset((prevStyles) => {
        console.log(prevStyles)})} />: null}
   {this.state.showDrawTools ? 
    <View style={{top:0, bottom: 50, position: 'absolute',  left: 0, right: 0}}>
      <View style={{alignSelf: 'flex-start', marginLeft: 5, alignItems: 'center', position: 'absolute',
       borderRadius: 10, alignContent: 'center', top: 150}}>
        <FlatList 
       data={brushSizes}
       renderItem={this.renderBrushes}
       showsVerticalScrollIndicator ={false}
       extraData={this.state}
      /></View>
      <View style={{alignSelf: 'flex-end', marginRight: 5, alignItems: 'center', top: 150, position: 'absolute', height: '50%',
      }}><FlatList 
       data={colors}
       renderItem={this.renderDrawColors}
       showsVerticalScrollIndicator ={false}
       extraData={this.state}
      /></View>
      <View style={{top:80, elevation: 50, zIndex: 50, right: 30,  position: 'absolute', flexDirection: 'row'}}>
      <TouchableOpacity onPress={() => this.canvas.undo() }>
      <Icon size={40} name="arrow-undo-circle-outline" color="white" style={{marginHorizontal: 10}} /></TouchableOpacity>
      <TouchableOpacity onPress={() => this.setState({strokeColor: 'transparent'}) }>
      <EnIcon size={40} name="eraser" color="white" /></TouchableOpacity>  
      </View>
    </View> : null}
    </View>
    )
    }else if(this.state.finalize && !this.state.Posted){
      return(
        <View style={{flex: 1, backgroundColor: 'black'}}> 
         <TouchableOpacity style={{marginTop: 30, marginLeft: 20, position: 'absolute', zIndex: 10}} 
         onPress={() => this.setState({finalize: false, showTextTools: false, showStickerTools: false, showImageTools: false,
            isResizing: false})}>
           <Icon name="arrow-back-circle" color="#00BBFF" size={50}/>
          </TouchableOpacity>
          <NativeText style={{color: 'white', top: 30, textAlign: 'center', fontSize: 25, fontFamily: 'impact', marginBottom: 50}}>Share</NativeText>
          <TextInput style={{backgroundColor:'#747474', color: '#fff', width: '100%',  padding: 15, marginBottom: 0,
          fontSize: 15, 
          textAlign: 'center', margin: 0}}
           placeholder="Add a Tagline" placeholderTextColor="white" maxLength={50}
           onChangeText={val => this.setState({caption: val})} value={this.state.caption} />
          <NativeImage source={{uri: this.state.meme}} style={{height: '50%', width: '99%', alignSelf: 'center',
            marginTop: 0}} resizeMode="contain" />
            <ScrollView>
         <TouchableOpacity style={{backgroundColor: '#00BBFF', padding: 10, paddingHorizontal: 45, borderRadius: 15, marginTop: 10, alignSelf: 'center'}} 
          onPress={() => this.post()}>
            <NativeText style={{color: 'white', fontSize: 30}}>Post</NativeText></TouchableOpacity>
            <TouchableOpacity style={{backgroundColor: '#5200FF', padding: 10, 
     flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25, borderRadius: 15, marginTop: 10, alignSelf: 'center'}} 
          onPress={() => {
                CameraRoll.save(this.state.cachedMeme)
                ToastAndroid.show('Meme Saved to Phone', ToastAndroid.SHORT)
        }}>   
          <Icon name="ios-download" size={25} color="white" />            
     <NativeText style={{color: 'white', fontSize: 25, marginLeft: 5}}>Save to Phone</NativeText></TouchableOpacity>  
         
          </ScrollView>
        </View>   
      )  
    }else if(this.state.Posted && !this.state.finalize){
      return(
      <View style={{flex: 1, backgroundColor: 'black'}}> 
      <NativeText style={{color: 'white', top: 20, textAlign: 'center', fontSize: 25, fontFamily: 'impact', marginBottom: 50}}>Meme Posted</NativeText>
      <NativeImage source={{uri: this.state.meme}} style={{height: '50%', width: '95%', alignSelf: 'center',
        marginTop: 0}} resizeMode="contain" /> 
     <TouchableOpacity style={{backgroundColor: 'transparent', padding: 10, borderColor: 'white', borderWidth: 1, width: '95%', 
     flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25, marginTop: 10, alignSelf: 'center',
       justifyContent: 'center'}} 
          onPress={() => Share.share({message: this.state.meme}) }>  
      <NativeText style={{color: 'white', fontSize: 25, marginLeft: 5, textAlign: 'center', 
      alignContent: 'center', width: '100%'}}>     
          <Icon name="ios-link-outline" size={25} color="white" style={{marginRight: 30}} />  Share</NativeText></TouchableOpacity>
     <View style={{flexDirection: 'row', marginTop: 20, alignContent: 'center', alignItems: 'center', justifyContent: 'center'}}>
      <SwitchWithIcons value={this.state.joinedContest|| this.state.showConfirmation} 
      onValueChange={val => {
        this.fetchContests()
        this.setState({showConfirmation: true})
      }} thumbColor={{true: 'white', false: 'white'}} trackColor={{true: '#35C759', false: '#373737'}}
       style={{alignSelf: 'center', marginTop: 10, transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }} />

       <NativeText style={{color: 'white', fontSize: 25, textAlign:'center', marginLeft: 20, textAlignVertical: 'center'}}>Join Contests</NativeText>
         </View>
         
      <TouchableOpacity style={{backgroundColor: '#00BBFF', padding: 10, justifyContent: 'center',
     flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25, marginTop: 10, bottom: 0, position: 'absolute', left: 0, right: 0}} 
          onPress={() => {this.props.navigation.navigate('Home')}}>          
     <NativeText style={{color: 'white', fontSize: 45, marginLeft: 5, textAlign: 'center', alignContent: 'center',
     width: '100%'}}>Done</NativeText></TouchableOpacity>

     <Overlay overlayStyle={{alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
           height: '100%', width: '100%', backgroundColor: 'rgba(0, 0, 0, 1)'}} backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 1)', flex: 1}}
            isVisible={this.state.showConfirmation}  onBackdropPress={() => this.setState({showConfirmation: false})}>
            <NativeText style={{color: 'white', position: 'absolute', fontSize: 20, top: 10, right: 20}}>
              <NativeImage style={{width: 20, height: 20, borderRadius: 10, marginRight: 10}} source={{uri: this.state.userpic}} />  {this.state.gems} <Svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <Path d="M19.1358 4.50423L9.87037 12.9787L0.604947 4.50423L3.37217 0.459825H16.3686L19.1358 4.50423Z" fill="#ED0063" stroke="#ED0063" stroke-width="0.91965"/>
                   </Svg></NativeText>
                     <NativeText style={{fontSize: 30, textAlign: 'center'}}>👑</NativeText>
                     <NativeText style={{color: 'white', fontSize: 30, fontFamily: 'impact', marginBottom: 5,
                    textAlign: 'center'}}>Choose Contests</NativeText>
            <View style={{alignSelf: 'center', backgroundColor: 'rgba(99, 99, 99, 0.8)', justifyContent: 'center', alignItems: 'center', borderRadius: 20,
           maxHeight: '60%', minHeight: '15%', width: '90%', borderColor: 'white', padding: 0}}>  
            <FlatList data={this.state.contests}
             renderItem={({item, idx}) => (
               <ScrollView style={{ margin: 8}} horizontal={true} contentContainerStyle={{alignItems: 'center', flexDirection: 'row', }}>
                 <SwitchWithIcons value={item.isChecked}
                 trackColor={{true: '#35C759', false: '#373737'}}
                 style={{marginRight: 20}} thumbColor={{true: 'white', false: '#636363'}} onValueChange={() => this.addContest(item)}/>
                 <View>
                 <NativeText style={{color: 'white', textAlign: 'center', fontSize: 15, margin: 5}} >
                   {item.title}</NativeText>
                 <NativeText style={{fontSize: 10,
                   opacity: 0.5, color: 'white'}}>🏆 = {item.prize} Gems   ~  <NativeText style={{fontWeight: 'bold'}}>{item.cost > 0 ? parseInt(item.cost) : 'Free'} {item.cost > 0 ? <Svg width="15" height="10" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <Path d="M19.1358 4.50423L9.87037 12.9787L0.604947 4.50423L3.37217 0.459825H16.3686L19.1358 4.50423Z" fill="#ED0063" stroke="#ED0063" stroke-width="0.91965"/>
                   </Svg> : null}</NativeText></NativeText>
                 </View>
                
                </ScrollView>
             )} keyExtractor={(item, idx) => idx} />
          <TouchableOpacity style={{backgroundColor: this.joinedContestYet() ? this.state.contestCost > 0 ? '#F10065' : '#35C759' : '#373737', padding: 10, paddingHorizontal: 25, borderRadius: 15, marginTop: 10,
          width: '100%', textAlign: 'center', alignItems: 'center', alignContent: 'center', alignSelf: 'center', justifyContent: 'center',
           flexDirection: 'row', borderTopLeftRadius: 0, borderTopRightRadius: 0}} 
          onPress={() => this.joinedContestYet() ? this.joinContest() : this.setState({showConfirmation: false})}>
            <NativeText style={{color: 'white', fontSize: 30, textAlign: 'center', fontFamily: 'impact'}}>
              {this.joinedContestYet() ? 'Join' : 'Cancel'}   </NativeText>
              {this.state.contestCost > 0 ? <NativeText style={{color: '#F10065',
              padding: 5, borderRadius: 10, paddingHorizontal: 10, backgroundColor: 'white', fontSize: 30, fontFamily: 'impact'}}>
                {this.state.contestCost > 0 ? this.state.contestCost : null} <Svg width={this.state.contestCost > 0 ? "25" : "0"} height="19" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Path d="M19.1358 4.50423L9.87037 12.9787L0.604947 4.50423L3.37217 0.459825H16.3686L19.1358 4.50423Z" fill="#F10065" stroke="#fff" stroke-width="0.91965" />
                </Svg></NativeText> : null}</TouchableOpacity>
          </View>
          <EnIcon name="cross" size={100} color="white" style={{marginTop: 20, alignSelf: 'center'}} onPress={() => this.setState({showConfirmation: false})} />
          </Overlay>
    </View>
      )   
    }
  }
  }
}

class Messaging extends React.Component{
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      headerTitle: <HeaderItem containerStyle={{backgroundColor: 'transparent'}}>
          <Image source={{uri: navigation.getParam('otheruserpic')}} style={{height: 40, width: 40, borderRadius: 40/2, 
            borderColor: '#36FF72', borderWidth: params.active ? 2 : 0}} onPress={() => navigation.navigate('Profile', { user: navigation.getParam('otheruser'), dark: navigation.getParam('darktheme')} ) } />
          <HeaderItem.Content>
            <HeaderItem.Title numberOfLines={1} style={{color : params.darktheme ? '#edf1f7' : '#151a30' }}>{navigation.getParam('otheruser')}</HeaderItem.Title>
            <HeaderItem.Subtitle style={{color : params.darktheme ? '#edf1f7' : '#151a30' }}>{params.istyping ? params.istyping : params.active ? 'Active Now' : 'Offline'}</HeaderItem.Subtitle>
          </HeaderItem.Content>
        </HeaderItem>,
      headerStyle: { elevation:0, backgroundColor: params.darktheme ? '#151a30' : '#edf1f7' },
      cardStyle: {backgroundColor: params.darktheme ? '#151a30' : '#edf1f7'},
      headerTintColor : params.darktheme ? '#edf1f7' : '#151a30' 
    };
  };

  constructor(props){
    super(props)
    this.socket = io.connect('https://lishup.com:3000', {secure: true}, { transports: ['websocket'] })
    this.socket.on('connect', function (data) {
     console.log('connected to socket on chat')
    })
  }

  state = {
    messages : [],
    dark : false,
    loading: true,
    chatText: ''
  }
  parseDate(input) {
    var parts = input.match(/(\d+)/g);
    // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(parts[0], parts[1]-1, parts[2]); // months are 0-based
  }
  componentDidMount(){
    this.fetch()
    this.socket.on('messages', mes => {
      const { params } = this.props.navigation.state
      const me = params ? params.current : null
      const other = params ? params.otheruser : null
  
      const arrMes = [{...mes.messages}];
  
      if(arrMes[0].sender == me || arrMes[0].receiver == me) {
  
       if(arrMes[0].receiver == other || arrMes[0].receiver == me){
         console.log(arrMes[0])
         if(arrMes[0].receiver == me){
           arrMes[0].user._id = 2
         }
  
         if(this.state.messages){
          this.setState((previousState) => ({
            messages: GiftedChat.append(previousState.messages, arrMes[0]),
            }));
         }else{
           this.setState({messages: arrMes[0]})
         }
        
       }
  
      }
      })  
    this.socket.on('istyping', data => {
      const { params } = this.props.navigation.state
      const me = params ? params.current : null
      const other = params ? params.otheruser : null
      if(data.user == other){
        if(data.withu == me){
          if(data.is == 'yes'){
            if(this.state.typing != 'no'){
              this.props.navigation.setParams({istyping: 'Typing...'})
            setTimeout( () => {
              this.props.navigation.setParams({istyping: ''})
          }, 5000);
        }
          }
        }
      }
    })  
    const { params } = this.props.navigation.state
    const me = params ? params.current : null
    const other = params ? params.otheruser : null
    const dark = params ? params.dark : null

    this.setState({dark: dark})
    this.props.navigation.setParams({darktheme: dark})

    this.activeEventSource = new RNEventSource('https://lishup.com/app/activity.php?user='+other+'')
    // Grab all events with the type of 'message'
    this.activeEventSource.addEventListener('message', (data) => {
      if(data.data == 'true'){
        this.props.navigation.setParams({
          active: true
        })
      }else{
        this.props.navigation.setParams({
          active: false
        })
      }
    })

  }
  componentWillUnmount(){
    if(this.activeEventSource){
      this.activeEventSource.close()
    }
  }

  fetch(){
    const { params } = this.props.navigation.state
    const user = params ? params.current : null
    const other = params ? params.otheruser : null

    fetch('https://lishup.com/app/getmsg.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: other,
        current: user
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson){
        this.setState({messages: responseJson, loading: false})
      }else{
        this.setState({loading: false})
      }
     })
  }
  updatetxt(text){

    const { params } = this.props.navigation.state;
   const me = params ? params.current : null;
   const other = params ? params.otheruser : null;
    this.setState({chatText:text});

    this.socket.emit('typing', {
     user: me,
     other: other,
     setTo: 'yes'
   })
  }
  handlesend(messages) {
    const { params } = this.props.navigation.state;
   const me = params ? params.current : null;
   const other = params ? params.otheruser : null;

    const mes = messages[0];

    if(Object.keys(this.state.messages).length != 0){
      var id = parseInt(this.state.messages[0]._id) + 1;
    }else{
      var id = 1;
    }
    this.socket.emit('messages', {
      id: id,
      text: this.state.chatText,
      sender: me,
      receiver: other
    })
    if(id == 1){
      this.setState({loading: true})
      this.fetch()
    }
  }
  onLongPress = (context, message) => {
    Clipboard.setString(message.text)
    Alert.alert('Copied!', 'The Text has been Copied to your Clipboard!')
 }
 micBtn = (sendProps) => {
  const { params } = this.props.navigation.state
  const me = params ? params.current : null
  const other = params ? params.otheruser : null

  if(Object.keys(this.state.messages).length != 0){
    var id = parseInt(this.state.messages[0]._id) + 1
  }else{
    var id = 1
}

return (
      <View >
      <View style={{flexDirection:'row'}}>
    <TouchableOpacity style={{
        padding:5, paddingRight:0
      }} activeOpacity={0.5} onPress={()=> {
        GiphyUi.present(
          {
            theme: this.state.dark ? 'dark' : 'light',
            layout: 'waterfall',
            showConfirmationScreen: true,
            mediaTypes: ['gifs', 'stickers', 'emoji', 'text'],
          },
          selectedMedia => {
            this.socket.emit('messages', {
              id: id,
              text: '',
              image: selectedMedia.images.downsized.url,
              sender: me,
              receiver: other
            })
          }
        );
      }}>
      <EnIcon name="emoji-happy" size={28} style={styles.sendingContainer} />
    </TouchableOpacity>
    </View>
    </View> 
  );
}
  render(){
    var theme =this.state.dark

    function renderTime(props){
      if(props.currentMessage.image){
        return <Time {...props} 
        timeTextStyle={{
          left: {
            color: theme ? 'white' : 'black'
          },
          right: {
            color:  theme ? 'white' : 'black'
          }
          }} />
      }else{
         return <Time {...props} />
      }
    }
        function renderBubble(props) {
         if(props.currentMessage.image){
           return(
             <Bubble
            {...props}
            wrapperStyle={{
              right: {
                backgroundColor: 'rgba(255, 255, 255, 0)',
                padding: 10,
                borderRadius: 20,
                maxWidth: "80%"
              },
              left: {
                backgroundColor: 'rgba(255, 255, 255, 0)',
                padding: 10,
                borderRadius: 20,
                maxWidth: "80%"
              }
            }}
            textStyle={{
              opacity: 0
            }}
          />
           )
         }else{
        return (
          <Bubble
            {...props}
            wrapperStyle={{
              right: {
                borderRadius:15,
                paddingTop:3,
                paddingLeft:5,
                paddingRight:3,
                marginLeft: 0,
                marginVertical: 5,
                maxWidth: "80%"
              },
              left: {
                borderRadius:15,
                paddingTop:3,
                paddingLeft:3,
                paddingRight:5,
                marginRight: 0,
                marginVertical: 5,
                maxWidth: "80%"
              }
            }}
            textStyle={{
              right: {
                color: '#fff'
              }
            }}
          />
        );
         }
      }

       function renderMessageVideo(props) {
         return (
           <Text>Video is not Supported in this App. Please use Bubblink Messenger</Text>
         )
         }
      
      function renderMsgimg(props) {
          return(
            <MessageImage {...props} imageStyle={{width: 300,
              height: 300, borderRadius: 20, resizeMode: 'cover'}} />
          )
      }   
     
      function renderSend(props) {
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
          <Icon name='send' size={28} color='#000' />
        </View>
      </Send>
    );
  }
   function renderEmpty() {
     return(
       <View style={{flex:1, 
       transform: [ { scaleY: -1 } ], backgroundColor: theme ? 'black' : 'white'}}>
       <Image source={{uri: 'https://i.pinimg.com/originals/ba/1b/ba/ba1bba349c9b8772806a8fd8de2a86d6.gif'}} 
       style={{height: 300, width: 300,
        alignSelf:'center'}} />
        <Text style={[styles.fullname, {color: theme ? 'white' : 'black', textAlign: 'center', fontSize: 20}]}>
        Send a Message to Start Conversation</Text>
        </View>
     )
     }
  function scrollToBottomComponent() {
    return (
      <View>
        <Icon name='arrow-down-circle' size={36} color='#000' />
      </View>
    );
  }
    if(this.state.loading){
      return(
        <ApplicationProvider
    {...eva}
    theme={eva.light }>
        <Layout level="2" style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <FastImage source={{uri: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/35771931234507.564a1d2403b3a.gif', 
          priority: FastImage.priority.high,}} style={{
            width: 100, height: 100
          }}/>
          </Layout>
      </ApplicationProvider>
      )
    }else{
      const { params } = this.props.navigation.state
    const user = params ? params.current : null
    const other = params ? params.otheruser : null
    return(
      <ApplicationProvider {...eva} theme={eva.light } >
        <Layout style={{flex: 1}}>
          <View  style={{flex: 1}}>
        <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.handlesend(messages)}
        onInputTextChanged={text => this.updatetxt(text)}
        onLongPress={this.onLongPress}
        user={{
          _id: 1,
        }}
        renderChatEmpty={renderEmpty}
        renderBubble={renderBubble}
        renderMessageImage={renderMsgimg}
        renderMessageVideo={renderMessageVideo}
        renderTime={renderTime}
        renderSend={renderSend}
        placeholder='Type your Message here...'
        scrollToBottom={true}
        scrollToBottomComponent={scrollToBottomComponent}
        renderActions={messages => this.micBtn(messages)}
         />
         </View>
        </Layout>
      </ApplicationProvider>
    )
    }
  }
}
class ContestDetails extends React.Component{
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      title: params.hashtag,
      headerTitleStyle: {color: 'white'},
      headerStyle: { elevation:0, backgroundColor: params.darktheme ? '#151a30' : '#7200CB' },
      headerTintColor: 'white'
    };
  };
  state = {
    dark: false,
    data: [],
    imageUrls: [],
    posts: [],
    hashtag: '',
    language: 'en'
  }
  componentDidMount(){
    const { params } = this.props.navigation.state
    const dark = params ? params.dark : null
    this.setState({dark: dark})

    this.fetchUser()
    StatusBar.setBackgroundColor("rgba(0,0,0,0)")
    StatusBar.setBarStyle("light-content")
    StatusBar.setTranslucent(true)
  }
  fetchUser = async() => {
    try {
      var user = await AsyncStorage.getItem('user')
      var lan = await AsyncStorage.getItem('language')
      if(user !== null) {
        this.setState({user: user, language: lan ? lan : 'en'})
        this.fetch(user)
      }
    } catch(e) {
      ToastAndroid.show('Could Not Get User', ToastAndroid.SHORT)
    }
  }
  fetch(user){
    const { params } = this.props.navigation.state
    const id = params ? params.id : null

    fetch('https://lishup.com/app/fetchContests.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        user: user
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson[0])
        this.setState({data: responseJson[0], hashtag: responseJson[0].title.replace(/\s/g, ''), posts: responseJson[0].posts })
        this.props.navigation.setParams({hashtag: '#' + this.state.hashtag})

        Promise.all(
          responseJson[0].posts.map(({ image }) => this.fetchImage(image) )
        ).then((imageUrls) => {this.setState({ imageUrls })
         })
    })
  }
  fetchImage(image) {
    console.log(image)
    return fetch('https://lishup.com/app/fetch-image.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson.filter(({ url }) => url).map(({ url }) => url)
      })
  }
  lovePosts(id, author){
    this.setState((state) => {
      const posts = state.posts.map((el) => {
        if (el.id === id) {
          if (el.isliked == true) {
            el.isliked = !el.isliked
          } else {
            el.isliked = !el.isliked
          }
        }
        return el
      });
      const isPress = !state.isPress
      return { posts, isPress }
    });
    console.log(this.state.data)

    fetch('https://lishup.com/app/love.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        user: this.state.user,
        author: author,
      }),
    })

  }
  renderPosts = ({item, index}) => (
     <TouchableOpacity onPress={() => this.props.navigation.navigate('ViewPost', {id: item.id, dark: this.state.dark})} style={{margin: 10}}
      onLongPress={() => this.lovePosts(item.id, item.user)}>
      <Layout style={{ alignSelf: 'center',
    width: "100%",
    height: Dimensions.get('window').height / 2,
    margin: 10,
    borderRadius: 8,
    elevation: 5, backgroundColor: item.isliked ? '#E3296D' : 'white'}}>
        <View style={styles.imageContainer}>
        {this.state.imageUrls[index] && this.state.imageUrls[index].length
          ? this.state.imageUrls[index].map((uri) => (
         <FastImage
                    source={{ uri: uri }}
                    style={styles.image}
                    resizeMode="cover"
         /> )) : null }
         </View>
       <Text style={{textAlign: 'center', marginVertical: 10, color: item.isliked ? 'white' : 'black' }} category="s1" numberOfLines={2}>
       {this.state.language == 'en' ? item.text : <PowerTranslator text={item.text} target={this.state.language} />}
      </Text>
    </Layout>
    </TouchableOpacity>
  )

  render(){
    return(
      <ApplicationProvider {...eva} theme={eva.light} >
        <Layout style={{flex: 1, }}>
          <ScrollView>
        <LinearGradient colors={['#7200CB', '#5100CB']} style={{ width: Dimensions.get('window').width, height: 100 }}>
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox={"0 0 1440 320"}
              style={{ position: 'absolute', top: 100, marginBottom: 30 }}
              preserveAspectRatio="none"
            >
               <Path fill="#5000ca" fill-opacity="1" d="M0,224L48,186.7C96,149,192,75,288,85.3C384,96,480,192,576,208C672,224,768,160,864,133.3C960,107,1056,117,1152,122.7C1248,128,1344,128,1392,128L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
            </Svg>
            <Text category="h2" style={{textAlign: 'center', marginVertical: 10, color: 'white'}}>
               {this.state.data.title}</Text>
            <Text category="s1" style={{textAlign: 'center', marginHorizontal: 30, marginBottom: 20, color: 'white'}}>
            {this.state.language == 'en' ? 'Tag Posts with' : <PowerTranslator text='Tag Posts with' target={this.state.language} />} <Text style={{fontWeight: 'bold', color:'white'}}>#{this.state.hashtag ? this.state.hashtag : null}</Text> {this.state.language == 'en' ? 'to Join and Win' : <PowerTranslator text='to Join and Win' target={this.state.language} />}  {this.state.data.prize} gems
            </Text>
            <Button style={{padding: 10, width: 200, alignSelf: 'center', borderRadius: 30, backgroundColor: '#c728b2', borderColor: 'transparent'}}
             onPress={() => this.props.navigation.navigate('Create', {text: '#' + this.state.hashtag, dark: this.state.dark})}>
              Join Now</Button>     
          </LinearGradient>
          <View style={{marginTop: "28%", flex: 1}}>
            <Text category="h6" style={{margin: 10, textAlign: 'center'}}>{this.state.language == 'en' ? 'Top Posts by Love' : <PowerTranslator text='Top Posts by Love' target={this.state.language} />}</Text>
            <Text appearance="hint" style={{margin: 5, textAlign: 'center'}}>{this.state.language == 'en' ? 'Long Press to Love' : <PowerTranslator text='Long Press to Love' target={this.state.language} />}</Text>
            <Carousel
              ref={(c) => { this._postcarousel = c; }}
              data={this.state.posts}
              renderItem={this.renderPosts}
              sliderWidth={Dimensions.get('window').width}
              sliderHeight={Dimensions.get('window').height}
              itemWidth={Dimensions.get('window').width - 20}
              itemHeight={Dimensions.get('window').height}
              extraData={this.state}
              autoplay={true}
              autoplayInterval={5000}
              style={{marginBottom: 20}}
            />
            </View>
          </ScrollView>
        </Layout>
      </ApplicationProvider>
    )
  }
}
class Settings extends React.Component{
  state = {
    dark: false,
    user: '',
    horizontal: false,
    editModal: false,
    changePhoto: false,
    loadingEdit: true,
    name: '',
    description: '',
    email: '',
    phone: '',
    pic: '',
    newAvatar: '',
    balance: 0,
    language: new IndexPath(0)
  }
  componentDidMount(){
    const { params } = this.props.navigation.state
    const dark = params ? params.dark : null
    this.setState({dark: dark})

    this.fetchTheme()
    this.fetchHorizontal()
    this.fetchUser()
    StatusBar.setBackgroundColor("rgba(0,0,0,0)")
    StatusBar.setBarStyle("light-content")
    StatusBar.setTranslucent(true)
  }
  fetchTheme = async() => {
    try {
      var theme = await AsyncStorage.getItem('dark')
      if(theme == 'true') {
        this.setState({dark: true})
        this.props.navigation.setParams({dark: true})
      }else{
        this.setState({dark: false})
        this.props.navigation.setParams({dark: false})
      }
    } catch(er) {
      ToastAndroid.show('Having hard time to get your Theme', ToastAndroid.SHORT)
    }
  }
  fetchHorizontal = async() => {
    try {
      var theme = await AsyncStorage.getItem('style')
      if(theme == 'true') {
        this.setState({horizontal: true})
      }else{
        this.setState({horizontal: false})
      }
    } catch(er) {
      ToastAndroid.show('Having hard time to get your Feed Style', ToastAndroid.SHORT)
    }
  }
  fetchUser = async() => {
    try {
      var user = await AsyncStorage.getItem('user')
      var lan = await AsyncStorage.getItem('language')
      if(user !== null) {
        this.setState({user: user})
      }
      if(lan !== null) {
        this.setState({language: new IndexPath(lan == 'en' ? 0 : lan == 'es' ? 1 : lan == 'tr' ? 2 : lan == 'ar' ? 3 : lan == 'hi' ? 4 : 0), lanInW: lan })
        console.log(this.state.language, lan)
      }
    } catch(e) {
      ToastAndroid.show('Could Not Get User', ToastAndroid.SHORT)
    }
  }
  logout = async() => {
    try {
      Alert.alert('Logout', 'Are you sure to Logout from this Device?', [
        {
          text: 'Logout',
          onPress: async() => {
            await AsyncStorage.setItem('user', '')
            RNRestart.Restart()
          }
        },
      ],
      {cancelable: true})
    } catch(e) {
      ToastAndroid.show('Could Not Get User', ToastAndroid.SHORT)
    }
  }
  switchTheme = async(totheme) => {
    if(totheme){
      this.setState({dark: totheme})
    this.props.navigation.setParams({dark: totheme})
    try {
      await AsyncStorage.setItem('dark', totheme.toString())
      Alert.alert('Switch Theme', 'Reload the App to apply theme and finish the process', [
        {
          text: 'Cancel',
          onPress: () => {this.setState({dark: !totheme})
          this.props.navigation.setParams({dark: !totheme})}
        },
        {
          text: 'Reload',
          onPress: () => RNRestart.Restart()
        },
      ],
      {cancelable: false})
    } catch(e) {
      ToastAndroid.show('Could Not set Theme', ToastAndroid.SHORT)
    }
    }else{
      ToastAndroid.show('Could Not set Theme', ToastAndroid.SHORT)
    }
  }
  switchHorizotal = async(to) => {
    this.setState({horizontal: to})
    try {
      await AsyncStorage.setItem('style', to.toString())
      Alert.alert('Switch Feed Style', 'Reload the App to apply style and finish the process', [
        {
          text: 'Cancel',
          onPress: () => {this.setState({dark: !totheme})
          this.props.navigation.setParams({dark: !totheme})}
        },
        {
          text: 'Reload',
          onPress: () => RNRestart.Restart()
        },
      ],
      {cancelable: false})
    } catch(e) {
      ToastAndroid.show('Could Not set Theme', ToastAndroid.SHORT)
    }
  }
  seeTutorial = async() => {
    try {
      await AsyncStorage.setItem('first', 'false')
      ToastAndroid.show('You will see Tutorial Slides next time you open the App', ToastAndroid.LONG)
    } catch(e) {
      ToastAndroid.show('Something Went Wrong', ToastAndroid.SHORT)
    }
  }
  setLanguage = async(to) => {
    try {
      console.log(to)
      to = to.row
      await AsyncStorage.setItem('language', to == 0 ? 'en' : to == 1 ? 'es' : to == 2 ? 'tr' : to == 3 ? 'ar' : to == 4 ? 'hi' : 'en')
      Alert.alert('Change App Language', 'Reload the App to apply settings. Translation uses Google Translator API', [
        {
          text: 'Cancel',
          onPress: () => {}
        },
        {
          text: 'Reload',
          onPress: () => {
            this.setState({language: new IndexPath(to) })
            RNRestart.Restart()
          }
        },
      ],
      {cancelable: false})
    } catch(e) {
      ToastAndroid.show('Something Went Wrong', ToastAndroid.SHORT)
    }
  }

  fetchDetails(show){
    fetch('https://lishup.com/app/user.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: this.state.user,
        current: this.state.user
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
       this.setState({pic: responseJson.pic, loadingEdit: false, name: responseJson.fullName, description: responseJson.description,
         email: responseJson.email, phone: responseJson.phone, balance: responseJson.points})
       console.log(responseJson)
       if(show == 'show'){
        Alert.alert(this.state.balance, 'You have ' + this.state.balance + ' Gems in your Account :D')
       }
     })
     .catch((e) => {
       console.log(e)
     })
  }
  updateProfile(){
    if(this.state.name == "" || this.state.email == ""){
      Alert.alert('Bad Human', 'You can not make your Name or Email blank!')
    }else{
      this.setState({loadingEdit: true})
      fetch('https://lishup.com/app/updateProfile.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: this.state.user,
        full_name: this.state.name,
        desc: this.state.description,
        email: this.state.email,
        phone: this.state.phone
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
       if(responseJson[0] == "success"){
         this.setState({loadingEdit: false})
         ToastAndroid.show('Successfully Updated Data', ToastAndroid.SHORT)
       }
     })
     .catch((e) => {
       console.log(e)
       this.setState({loadingEdit: false})
         ToastAndroid.show('Something went wrong', ToastAndroid.SHORT)
     })
    }
  }

  takepic(){
    const options = {
      title: 'Choose a Profile Photo',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        console.log('file://' + response.path)
        this.setState({newAvatar: 'file://' + response.path})
      }
    });
  }
  uploadpic (){
    let upload = RNFetchBlob.fetch('POST', 'https://api.imgur.com/3/image.json', {
            Authorization : "Bearer 7bc8d41fd39321de0db0b5cccf5a464dd11b7c49",
            otherHeader : "foo",
          'Content-Type' : 'multipart/form-data',
        }, [
          { name : 'image', filename : 'image.jpg', data: RNFetchBlob.wrap(this.state.newAvatar)},
        ])

      setTimeout(()=>{
        upload.uploadProgress({ interval:1 }, (written, total) => {
          let uploaded = (written / total) * 100
          ToastAndroid.show('Uploading LOL Photo ' + uploaded.toFixed(1) + '%', ToastAndroid.SHORT)
    })
      }, 0)
      
      upload.then((resp) => {
        console.log(resp.json())
        fetch('https://lishup.com/app/uploadprofile.php', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
           link: resp.json().data.link,
           user: this.state.user
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
              if(responseJson == 'success'){
                ToastAndroid.show('Changed Profile Picture', ToastAndroid.SHORT)
                this.fetchDetails()
            }
          })
        })
      upload.catch((err) => {
          console.log(err)
        })
  }
  render(){
    var lan = this.state.lanInW
    return(
      <ApplicationProvider {...eva} theme={eva.light } >
        <Layout style={{flex: 1 }}>
          <ScrollView>
          <ListItem title={props => <Text category="h6" style={{marginLeft: 10}}>{this.state.lanInW == 'en' ? 'Appearance' : <PowerTranslator text='Appearance' target={this.state.lanInW} />}</Text>} />
          <Select placeholder="Select App Language"
          selectedIndex={this.state.lanInW}
          value={this.state.language.row == '0' ? 'English (en)' : this.state.language.row == '1' ? "Spanish (es)" : this.state.language.row == '2' ?
          "Turkish (tr)" : this.state.language.row == '3' ? "Arabic (ar)" : this.state.language.row == '4'
           ? "Hindi (hi)" : 'English (en)'}
          onSelect={index => this.setLanguage(index)}>
          <SelectItem title='English'/>
          <SelectItem title='Spanish'/>
          <SelectItem title='Turkish'/>
          <SelectItem title='Arabic'/>
          <SelectItem title='Hindi'/>
        </Select>
        <ListItem 
          title={props => <Text {...props}>{lan == 'en' ? 'Replay Tutorial' : <PowerTranslator text='Replay Tutorial' target={this.state.lanInW} />}</Text>}
          accessoryRight={props =>  <Icon name="md-help-circle-outline" size={30} color={this.state.dark ? '#fff' : '#000'}/>} 
          onPress={() => { 
            this.seeTutorial() }} />

        <ListItem title={props => <Text category="h6" style={{marginLeft: 10}}>{lan == 'en' ? 'Account Settings' : <PowerTranslator text='Account Settings' target={this.state.language} />}</Text>} />
          <ListItem 
          title={props => <Text {...props}>{lan == 'en' ? 'Edit Details' : <PowerTranslator text='Edit Details' target={this.state.lanInW} />}</Text>}
          accessoryRight={props => <Icon name="chevron-forward" size={30} color={this.state.dark ? '#fff' : '#000'}/>} 
          onPress={() => { 
            this.fetchDetails()
            this.setState({editModal: true}) }} />
        <Divider /> 
        <ListItem 
          title={props => <Text {...props}>{lan == 'en' ? 'Change Profile Photo' : <PowerTranslator text='Change Profile Photo' target={this.state.lanInW} />}</Text>}
          accessoryRight={props => <Icon name="chevron-forward" size={30} color={this.state.dark ? '#fff' : '#000'}/>} 
          onPress={() => { this.setState({changePhoto: true}) 
          this.fetchDetails() }} />

        <ListItem title={props => <Text category="h6" style={{marginLeft: 10}}>{lan == 'en' ? 'App Settings' : <PowerTranslator text='App Settings' target={this.state.lanInW} />}</Text>} />
        <ListItem 
          title={props => <Text {...props}>{lan == 'en' ? 'Push Notifications' : <PowerTranslator text='Push Notifications' target={this.state.lanInW} />}</Text>}
          accessoryRight={props => <EnIcon name="bell" size={30} color={this.state.dark ? '#fff' : '#000'}/>} 
          onPress={() => Linking.openSettings()  } />
        <Divider />  
        <ListItem 
          title={props => <Text {...props}>{lan == 'en' ? 'Gems Balance' : <PowerTranslator text='Gems Balance' target={this.state.lanInW} />}</Text>}
          accessoryRight={props => <Icon name="wallet-outline" size={30} color={this.state.dark ? '#fff' : '#000'}/>} 
          onPress={() => {
            this.fetchDetails('show')
          } } />
        <Divider />  
        <ListItem 
          title={props => <Text {...props}>{lan == 'en' ? 'Rate App' : <PowerTranslator text='Rate App' target={this.state.lanInW} />}</Text>}
          accessoryRight={props => <Icon name="star-outline" size={30} color={this.state.dark ? '#fff' : '#000'}/>} 
          onPress={() => {
            const inapp = InAppReview.isAvailable()
            if(inapp){
              InAppReview.RequestInAppReview()
              Linking.openURL("market://details?id=com.meme.lishup")
            }else {
              Linking.openURL("market://details?id=com.meme.lishup")
            }
          } } />  
        <ListItem title={props => <Text category="h6" style={{marginLeft: 10}}>{lan == 'en' ? 'Privacy' : <PowerTranslator text='Privacy' target={this.state.lanInW} />}</Text>} />
        <ListItem 
          title={props => <Text {...props}>{lan == 'en' ? 'Terms & Conditions' : <PowerTranslator text='Terms & Conditions' target={this.state.lanInW} />}</Text>}
          accessoryRight={props => <Icon name="shield-checkmark" size={30} color={this.state.dark ? '#fff' : '#000'}/>} 
          onPress={() => Linking.openURL('https://lishup.com/guides.php?id=31')  } />
        <Divider />  
        <ListItem 
          title={props => <Text {...props}>{lan == 'en' ? 'Privacy Policy' : <PowerTranslator text='Privacy Policy' target={this.state.lanInW} />}</Text>}
          accessoryRight={props => <Icon name="shield-checkmark" size={30} color={this.state.dark ? '#fff' : '#000'}/>} 
          onPress={() => Linking.openURL('https://lishup.com/guides.php?id=30')  } />  
        <Divider />  
        <ListItem 
          title={props => <Text {...props}>{lan == 'en' ? 'Contact Us' : <PowerTranslator text='Contact Us' target={this.state.lanInW} />}</Text>}
          accessoryRight={props => <Icon name="ios-help-circle" size={30} color={this.state.dark ? '#fff' : '#000'}/>} 
          onPress={() => Linking.openURL('mailto:meeeme@lishup.com')  } />  
        <Divider />  
        <ListItem 
          title={props => <Text {...props}>{lan == 'en' ? 'Logout' : <PowerTranslator text='Logout' target={this.state.lanInW} />}</Text>}
          accessoryRight={props => <Icon name="exit-outline" size={30} color={this.state.dark ? '#fff' : 'red'}/>} 
          onPress={() => this.logout()  } />   
           
          

      <Overlay isVisible={this.state.editModal} onBackdropPress={() => this.setState({editModal: !this.state.editModal, loadingEdit: true})}
         overlayStyle={{width: "80%", height: "70%", backgroundColor: this.state.dark ? '#101426' : '#fff', padding: 20 }}  animationType="slide"> 
        <ScrollView contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}>
            <Text category="h4" style={{marginVertical: 20}}>{lan == 'en' ? 'Edit Profile' : <PowerTranslator text='Edit Profile' target={this.state.lanInW} />}</Text>
            {this.state.loadingEdit ? <FastImage source={{uri: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/dae67631234507.564a1d230a290.gif', priority:'high'}}
               resizeMode="contain" style={{width: "100%", height: 100, marginVertical: 10}} /> : null}
             <Input value={this.state.name} label="Edit your Full Name" onChangeText={text => this.setState({name: text})} 
               style={{marginVertical: 10}}/>
             <Input value={this.state.description} label="Edit your Description" onChangeText={text => this.setState({description: text})}
                multiline={true} textStyle={{ minHeight: 64 }} style={{marginVertical: 10}} />
             <Input value={this.state.email} label="Edit Email" onChangeText={text => this.setState({email: text})}
                 style={{marginVertical: 10}} />
             <Input value={this.state.phone} label="Edit Phone No." onChangeText={text => this.setState({phone: text})}
                 style={{marginVertical: 10}} />   

             <Button status="success" style={{alignSelf: 'flex-end'}} onPress={() => this.updateProfile()}>Update</Button>    
        </ScrollView>
      </Overlay>
          <Overlay isVisible={this.state.changePhoto} onBackdropPress={() => this.setState({changePhoto: !this.state.changePhoto})}
         overlayStyle={{width: "80%", height: "70%", backgroundColor: this.state.dark ? '#101426' : '#fff', padding: 20 }}  animationType="slide">
          <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
             <Avatar source={{uri: this.state.newAvatar ? this.state.newAvatar : this.state.pic}} 
                    size="giant" style={{width: 120, height: 120, borderRadius: 60}} />
             <Button onPress={() => this.takepic()} appearance="outline" style={{margin: 15}}>Choose Photo</Button>
                  {this.state.newAvatar ? <Button onPress={() => this.uploadpic()} style={{marginTop: 35, width: "75%"}}>Upload Photo</Button> : null}
          </Layout>
          </Overlay>
          </ScrollView>
        </Layout>
      </ApplicationProvider>
    )
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    width: "100%",
    maxHeight: "80%",
    top: "10%"
  },
  modalView: {
    width: '90%',
    margin: 20,
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  item: {
    alignSelf: 'center',
    width: "100%",
    height: Dimensions.get('window').height / 2,
    margin: 10,
    borderRadius: 8,
    elevation: 5
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'contain',
  },
  sendingContainer: {
    marginBottom:5,
    marginRight: 10,
    color:'grey'
  },
  badgeIconView:{
    position:'relative',
    padding:5
  },
  badge:{
    color:'#fff',
    position:'absolute',
    zIndex:10,
    top:3,
    right:1,
    padding:1,
    backgroundColor:'#0596FF',
    borderRadius:20
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    width: Dimensions.get('window').width
  },
  Sliderimage: {
    width: 320,
    height: 320,
  },
  Slidertext: {
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  Slidertitle: {
    fontSize: 22,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

const TabNavigator = createMaterialTopTabNavigator({
  
  MyProfile: {
    screen: Profile,
    navigationOptions: {
      tabBarVisible: true,
      tabBarIcon: ({ tintColor }) => (
        <FIcon name="user" size={28} color={tintColor ? tintColor : 'black'}  />
      ),
      tabBarLabel: ({ focused, tintColor }) => {
        return null
      }
    }
  },
  Search: {
    screen: Search,
    navigationOptions: {
      tabBarVisible: true,
      tabBarIcon: ({ tintColor }) => (
        <FIcon name="search" size={28} color={tintColor ? tintColor : 'black'} />
      ),
      tabBarLabel: ({ focused, tintColor }) => {
        return null
      }
    }
  },
  Home: {
    screen: copilot({
      stepNumberComponent: () => { return null },
    })(HomeScreen),
    
  },  
  Notifications : {
    screen: Notifications,
    navigationOptions: ({navigation, screenProps}) => ({
      tabBarVisible: true,
      tabBarIcon: ({ tintColor }) => (
        notifyBadge > 0 ?
        <View style={styles.badgeIconView}>
         <FIcon name='bell' size={28} color={tintColor ? tintColor : 'black'} />
          <NativeText style={styles.badge}> {notifyBadge} </NativeText>
        </View> : <FIcon name='bell' size={28} color={tintColor ? tintColor : 'black'} />
      ),
      tabBarLabel: ({ focused, tintColor }) => {
        return null
      }
    })
  },
  Conversations: {
    screen: Conversations,
    navigationOptions: {
      tabBarVisible: true,
      tabBarIcon: ({ tintColor }) => (
        msgBadge > 0 ?
        <View style={styles.badgeIconView}>
         <FIcon name='message-circle' size={28} color={tintColor ? tintColor : 'black'} />
          <NativeText style={styles.badge}> {msgBadge} </NativeText>
        </View> : <FIcon name='message-circle' size={28} color={tintColor ? tintColor : 'black'} />
      ),
      tabBarLabel: ({ focused, tintColor }) => {
        return null
      }
    }
  },
},
{
  order: ['MyProfile', 'Search', 'Home', 'Notifications',  'Conversations'],
  initialRouteName: 'Home',
  lazy: true,
  swipeEnabled: false,
  tabBarOptions: {
    upperCaseLabel: false,
    activeTintColor: 'black',
    inactiveTintColor: '#CBCBCB',
    style: {
      backgroundColor: 'white',
      elevation: 0
    },
    tabStyle: {flexDirection: 'column', paddingTop: 25, paddingBottom: 20, elevation: 0},
    showIcon: true,
    iconStyle: {width: 35},
    indicatorStyle: {backgroundColor: 'transparent'}
  },
})

const App = createStackNavigator({
  Home: {
    screen: TabNavigator,
    navigationOptions: { header: null }
  },
  New : {
    screen: Create
  },
  ViewPost : {
    screen: ViewPost,
  },
  Create : {
    screen: Create
  },
  Profile: {
    screen: Profile,
  },
  ContestDetails: {
    screen: ContestDetails
  },
  Authentication: {
    screen: Authentication
  },
  Messaging : {
    screen: Messaging
  },
  Settings : {
    screen: Settings,
  }
},
{
  initialRouteName: 'Authentication',
  mode: 'card',
  transitionConfig: () => StackViewTransitionConfigs.SlideFromRightIOS,
})


export default createAppContainer(App)
