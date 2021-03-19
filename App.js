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
  ImageBackground, Image as NativeImage, Slider, CheckBox, PermissionsAndroid, TextInput, Picker, Switch
} from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import 'react-native-gesture-handler'
import { createAppContainer, StackActions, StackNavigator, NavigationActions } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { createBottomTabNavigator } from 'react-navigation-tabs'

import * as eva from '@eva-design/eva'
import { ApplicationProvider, Layout, Button, ButtonGroup,
   Input, Avatar, List, ListItem, Toggle, Text, Select, SelectItem, IndexPath } from '@ui-kitten/components'
import {Card, Divider, Overlay, ListItem as ElementList} from 'react-native-elements'  
import Icon from 'react-native-vector-icons/Ionicons'
import Carousel, {ParallaxImage} from 'react-native-snap-carousel'
import Svg, {
 Path, Circle, Rect, G, Defs, Filter
} from 'react-native-svg'
import LinearGradient from 'react-native-linear-gradient'

import FastImage from 'react-native-fast-image'
import ScaledImage from './ScalableImage'
import {Image, Badge, ListItem as HeaderItem} from 'react-native-elements'
import ImageViewer from 'react-native-image-zoom-viewer'

import io from 'socket.io-client'
import RNEventSource from 'react-native-event-source'


import {
  GiphyUi
} from 'react-native-giphy-ui'
import RNFS from 'react-native-fs'
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
import CameraRoll from "@react-native-community/cameraroll"

import { GiftedChat, Bubble, Send, MessageStatusIndicator, Composer, MessageImage, Time } from 'react-native-gifted-chat'

import { GoogleSignin, GoogleSigninButton } from '@react-native-community/google-signin'
import auth from '@react-native-firebase/auth'
import PhoneInput from '@sesamsolutions/phone-input'
import AppIntroSlider from 'react-native-tutorial-slider'
import RNIap, {
  InAppPurchase,
  PurchaseError,
  SubscriptionPurchase,
  acknowledgePurchaseAndroid,
  consumePurchaseAndroid,
  finishTransaction,
  finishTransactionIOS,
  purchaseErrorListener,
  purchaseUpdatedListener,
} from 'react-native-iap'
import InAppReview from 'react-native-in-app-review'
import RNRestart from 'react-native-restart'
import messaging from '@react-native-firebase/messaging'
import ReceiveSharingIntent from 'react-native-receive-sharing-intent'
import {PowerTranslator, ProviderTypes, TranslatorConfiguration} from 'react-native-power-translator'
import SwitchWithIcons from "react-native-switch-with-icons"

GiphyUi.configure('Qo2dUHUdpctbPSuRhDIile6Gr6cOn96H')
const itemSkus = Platform.select({
  ios: [
    'com.example.coins100'
  ],
  android: [
    '300.pearl.meme',
    '300.gems.meme',
    '500.gems.meme',
    '1000.gems.meme'
  ]
})
let purchaseUpdateSubscription
let purchaseErrorSubscription


const slides = [
  {
    key: 'somethun',
    title: 'Visit your Profile',
    text: 'Press this Icon at top to visit your Profile. Do you know, you can add background and sunglass in it?',
    icon: 'face-profile',
    colors: ['#63E2FF', '#B066FE'],
  },
  {
    key: 'somethun1',
    title: 'Freedom in Feed Style',
    text: 'Press this Icon at top to change Feed Order. Your Own Feed > Latest Memes > Top Memes',
    icon: 'sticker-emoji',
    colors: ['#A3A1FF', '#3A3897'],
  },
  {
    key: 'somethun2',
    title: 'Join Contests!',
    text: 'Tap this Icon at top to see running contests and join them!',
    icon: 'trophy',
    colors: ['#29ABE2', '#4F00BC'],
  },
  {
    key: 'somethun3',
    title: 'Create Meme!',
    text: 'Tap this Icon at bottom left to explore meme creating tools!',
    icon: 'add-circle',
    colors: ['#DA4453', '#89216B'],
  },
  {
    key: 'somethun4',
    title: 'Interactive Notifications!',
    text: 'Tap this Icon at top to see your latest Notifications!',
    icon: 'bell',
    colors: ['#ad5389', '#3c1053'],
  },
  {
    key: 'somethun5',
    title: 'Chat with People!',
    text: 'Press this Icon at top to see your Conversations with Memers!',
    icon: 'chat',
    colors: ['#bc4e9c', '#f80759'],
  },
  {
    key: 'somethun6',
    title: 'Swipe Up to See Next Memes!',
    text: 'We have introduced vertical swipe able feed!!',
    icon: 'swap-vertical-outline',
    colors: ['#36D1DC', '#5B86E5'],
  },
  {
    key: 'somethun7',
    title: "Let's Start!",
    text: 'Show your Meme Creativity!',
    icon: 'md-arrow-forward-circle',
    colors: ['#fc4a1a', '#f7b733'],
  },
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
    isAvailableUser: false
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
      }else{
        ToastAndroid.show('No user is logged in', ToastAndroid.SHORT)
      }
    } catch(e) {
      ToastAndroid.show('Could Not Get User', ToastAndroid.SHORT)
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
        theme={this.state.dark ? eva.dark : eva.light }> 
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
          theme={this.state.dark ? eva.dark : eva.light }> 
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
                  this.setState({screen: 'register1'})
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
    }else if(this.state.screen == 'register2'){
      return (      
        <ApplicationProvider
          {...eva}
          theme={this.state.dark ? eva.dark : eva.light }> 
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
          theme={this.state.dark ? eva.dark : eva.light }> 
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
          theme={this.state.dark ? eva.dark : eva.light }> 
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
          theme={this.state.dark ? eva.dark : eva.light }> 
            <Layout style={{flex: 1, paddingTop: 30, alignItems: 'center', backgroundColor: '#FFD362'}}>
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
      theme={this.state.dark ? eva.dark : eva.light }> 
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
      theme={this.state.dark ? eva.dark : eva.light }> 
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
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      header: false
    };
  };

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
      currentAwardUser: '',
      showShare: false,
      sharePost: [],
      awardAmount: 0,
      showCongrats: false,
      feedOrder: 'date_time',
      vertical: true,
      currentPostAuthor: '',
      helpUser: false,
      count: 0,
      moreLoading: false,
      loves: [],
      language: 'en',
      isOffline: false,
      replyingTo: 0,
      replyingPerson: ''
    }
    this.socket = io.connect('https://lishup.com:3000', {secure: true}, { transports: ['websocket'] })
    this.socket.on('connect', function (data) {
     //console.log('connected to socket')
    })
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
        this.setState({helpUser: true})
      }else{
        await AsyncStorage.setItem('first', 'true')
      }
    } catch(er) {
      ToastAndroid.show('Having hard time to help you to get started', ToastAndroid.SHORT)
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
    } catch(er) {
      //ToastAndroid.show('Having hard time to help you to get started', ToastAndroid.SHORT)
    }
  }
  showReviewPanel(){
    Alert.alert('Thanks!', 'Would you like to rate it Please?', [
      {text: 'Alerady Done', onPress: () => ToastAndroid.show('Thanks a lot!')},
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

  _renderItem =  props => (
    <LinearGradient
      style={[styles.mainContent, {
        paddingTop: props.topSpacer,
        paddingBottom: props.bottomSpacer,
      }]}
      colors={props.colors}
      start={{x: 0, y: .1}} end={{x: .1, y: 1}}
    >
     {props.icon == 'face-profile' ? 
         <Svg width="100" height="100" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
          <Path d="M19.1999 9.80312L19.2009 9.80313C20.2913 9.80527 21.3364 10.2394 22.1074 11.0104C22.8784 11.7814 23.3125 12.8265 23.3147 13.9169V13.9179C23.3147 14.7317 23.0733 15.5272 22.6212 16.2039C22.1691 16.8806 21.5264 17.408 20.7745 17.7194C20.4942 17.8355 20.2034 17.9197 19.9075 17.9713C20.1645 17.9955 20.4209 18.0328 20.6757 18.0835C22.143 18.3753 23.4908 19.0956 24.5488 20.1533C25.2536 20.8543 25.8124 21.6881 26.1929 22.6065C26.5735 23.5251 26.7681 24.5101 26.7655 25.5044L26.7642 26.0031H26.2655H12.1343H11.6342L11.6343 25.5031C11.6344 24.0068 12.0782 22.5442 12.9095 21.3002C13.7409 20.0562 14.9224 19.0866 16.3048 18.514C17.0066 18.2233 17.7442 18.0416 18.4924 17.9713C18.4606 17.9658 18.4288 17.9599 18.3972 17.9536C17.599 17.7948 16.8658 17.4029 16.2903 16.8274C15.7149 16.252 15.323 15.5188 15.1642 14.7206C15.0054 13.9224 15.0869 13.0951 15.3984 12.3432C15.7098 11.5914 16.2372 10.9487 16.9139 10.4966C17.5905 10.0445 18.3861 9.80312 19.1999 9.80312ZM4.4999 18.2C4.4999 26.3183 11.0816 32.9 19.1999 32.9C27.3182 32.9 33.8999 26.3183 33.8999 18.2C33.8999 10.0817 27.3182 3.5 19.1999 3.5C11.0816 3.5 4.4999 10.0817 4.4999 18.2Z" 
          stroke='white'/>
         </Svg> : props.icon == 'sticker-emoji' ? 
         <Svg width="100" height="100" viewBox="0 0 38 39" fill="none" xmlns="http://www.w3.org/2000/svg">
         <Path d="M26.9119 6.86136C27.8442 10.8911 30.9757 14.0565 35.0086 14.9906C31.0096 15.9232 27.8456 19.0549 26.9118 23.087C25.9791 19.0879 22.8474 15.924 18.8153 14.9902C22.8161 14.0559 25.9783 10.8921 26.9119 6.86136Z" stroke='white' stroke-opacity="0.36"/>
         <Path d="M21.1661 24.3088C18.2457 25.1412 15.9544 27.4325 15.122 30.3529C14.2896 27.4325 11.9982 25.1412 9.07783 24.3088C11.9987 23.4761 14.2897 21.1827 15.122 18.2371C15.9542 21.1827 18.2452 23.4761 21.1661 24.3088Z" stroke='white' stroke-opacity="0.36"/>
         <Path d="M16.9719 9.84639C14.0128 10.6322 11.5999 13.0125 10.8124 16.0055C9.99698 13.0173 7.61759 10.6335 4.655 9.84639C7.67798 9.03114 9.99916 6.67587 10.8124 3.6573C11.5977 6.68066 13.9524 9.03239 16.9719 9.84639Z" stroke='white' stroke-opacity="0.36"/>
         </Svg> : props.icon == 'trophy' ? 
         <Svg width="100" height="100" viewBox="0 0 38 39" fill="none" xmlns="http://www.w3.org/2000/svg">
         <Path fill-rule="evenodd" clip-rule="evenodd" d="M28.3129 5.44349H32.21C32.8338 5.44349 33.079 5.68839 33.0787 6.31218V6.38416C32.8765 11.4771 29.4789 15.7823 24.3467 17.5548C23.2658 19.1396 21.9473 20.5353 20.3494 21.6823C20.5509 24.7207 21.6228 26.8366 23.3178 28.8109C23.448 28.9625 23.4542 29.0834 23.1945 29.0834H13.7643C13.5042 29.0834 13.5104 28.9621 13.6406 28.8109C15.3353 26.8366 16.4072 24.72 16.6087 21.6823C14.9929 20.5219 13.6623 19.1083 12.5746 17.5008C7.52986 15.6952 4.19978 11.4251 4 6.38416V6.31218C4 5.68839 4.2449 5.44349 4.86869 5.44349H8.64483V3.90485C8.64483 3.25489 8.90006 3 9.54969 3H27.4084C28.0581 3 28.3133 3.25489 28.3129 3.90485V5.44349ZM6.07114 7.2532C5.9282 7.2532 5.90064 7.33345 5.9158 7.43231C6.38424 10.4968 8.25664 13.1425 11.046 14.7945C9.97542 12.5049 9.26827 9.95088 8.84254 7.2532H6.07114ZM25.8688 14.8895C28.748 13.2448 30.6848 10.5564 31.1625 7.43231C31.178 7.3338 31.1505 7.25354 31.0072 7.25354H28.1152C27.6843 9.98843 26.9641 12.5762 25.8688 14.8895ZM11.2391 29.988H25.7188C26.3185 29.988 26.6237 30.2935 26.6237 30.8929V33.0952C26.6237 33.6949 26.3189 34.0001 25.7188 34.0001H11.2391C10.6394 34.0001 10.3342 33.6949 10.3342 33.0952V30.8929C10.3342 30.2939 10.6391 29.988 11.2391 29.988Z" 
         fill='white' />
         </Svg> : props.icon == 'bell' ? 
         <Svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 30 34">
         <Path d="M18.2244 25.0801V24.6827H24.359H25.109V23.9327V22.7853V22.4746L24.8893 22.2549L22.8141 20.1797V14.7532C22.8141 11.17 20.9821 8.00531 17.6506 6.93265V6.72115C17.6506 5.35457 16.5461 4.25 15.1795 4.25C13.8129 4.25 12.7083 5.35457 12.7083 6.72115V6.93202C9.36664 8.00324 7.54487 11.1593 7.54487 14.7532V20.1797L5.46967 22.2549L5.25 22.4746V22.7853V23.9327V24.6827H6H12.1346V25.0801C12.1346 26.7541 13.4892 28.125 15.1795 28.125C16.8559 28.125 18.2244 26.7565 18.2244 25.0801Z" stroke='white' stroke-opacity="0.36" stroke-width="1.5"/>
         </Svg>
         : props.icon == 'chat' ?
             <Svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 25 25">
           <Path d="M3.12775 18.8879C3.19186 18.6519 3.05016 18.3238 2.91492 18.0873C2.87281 18.0168 2.82714 17.9484 2.77807 17.8825C1.61819 16.1235 0.999979 14.0628 1.00005 11.9558C0.981195 5.90787 5.99628 1 12.1978 1C17.6062 1 22.1207 4.74677 23.1757 9.72037C23.3338 10.4578 23.4136 11.2098 23.4138 11.9639C23.4138 18.0205 18.5922 23.0054 12.3907 23.0054C11.4047 23.0054 10.0739 22.7575 9.34811 22.5544C8.62236 22.3513 7.89768 22.0819 7.71072 22.0097C7.51951 21.9362 7.31643 21.8984 7.11158 21.8982C6.88783 21.8973 6.66623 21.9419 6.46018 22.0291L2.80555 23.3481C2.72548 23.3826 2.64065 23.4047 2.55393 23.4138C2.4855 23.4136 2.4178 23.3998 2.35473 23.3732C2.29167 23.3467 2.2345 23.3079 2.18654 23.2591C2.13858 23.2103 2.10079 23.1524 2.07534 23.0889C2.0499 23.0254 2.03731 22.9574 2.03831 22.889C2.0428 22.8289 2.05364 22.7695 2.07064 22.7117L3.12775 18.8879Z" 
           stroke='white' stroke-width="4" stroke-miterlimit="10" stroke-linecap="round" fillOpacity={0.6}></Path>
           </Svg> : <Icon name={props.icon} size={100} color="white" />
      }
      <View>
        <Text style={styles.Slidertitle}>{props.title}</Text>
        <Text style={styles.Slidertext}>{props.text}</Text>
      </View>
    </LinearGradient>
  )
  formatText(string){
    return string.split(/((?:^|\s)(?:#[a-z\d-]+))/gi).filter(Boolean).map((v,i)=>{
      if(v.includes('#')){
        return <TouchableOpacity onPress={() => this.props.navigation.navigate('Contests')} key={i}>
          <Text  style={{fontWeight: 'bold', elevation: 10, zIndex: 10, color: this.state.dark ? "white" : 'black'}}
            >{v}</Text>
            </TouchableOpacity>
      }   else{
        return this.state.language == 'en' ? <Text 
        key={i} style={{ elevation: 10, zIndex: 10, color: this.state.dark ? "white" : 'black'}}>{v}</Text> : 
        <PowerTranslator text={v} key={i} style={{ elevation: 10, zIndex: 10, color: this.state.dark ? "white" : 'black'}} target={this.state.language} />
      }
    })
  }
  renderPosts = ({item, index}) => (
    <View style={{flex: 1, width: "100%", height: Dimensions.get('window').height, margin: 0, padding: 0, backgroundColor: 'transparent'}} 
        key={index}>
       <View style={{position: 'absolute', bottom: 0, left: 0, right: 0, elevation: 5, zIndex: 5 }}>
        
        </View>
        <View style={{width: '100%', height: '100%', justifyContent: 'center', alignSelf: 'center', alignContent: 'center'}}>
        <View>
          <ListItem
            title={props => <Text style={{ fontSize:18, left: 10, elevation: 5, zIndex: 5, color: this.state.dark ? "white" : 'black'}}>
            {item.user}  {this.state.language == 'en' ? <Text style={{fontSize: 12, elevation: 5, zIndex: 5, color: this.state.dark ? "#f2f2f2" : '#ababab'}}>
              {item.time}</Text> : <PowerTranslator text={item.time} 
            style={{fontSize: 12, elevation: 5, zIndex: 5, color: this.state.dark ? "#f2f2f2" : '#ababab'}} target={this.state.language}/>}
            </Text>}
            accessoryLeft={evaProps => 
              <Avatar size='giant' source={{uri: item.userpic}}/>}
              accessoryRight={evaProps => 
                <TouchableOpacity style={{backgroundColor: 'transparent', borderColor: 'transparent', marginHorizontal: 10, alignItems: 'center'}}
                onPress={() => this.setState({showAwards: true, currentAwardUser: item.user})}>
               <Svg width="25" height="25" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
               <G><Path 
               d="M37.7 7.8H31.7759C32.2244 7.0317 32.5 6.1516 32.5 5.2C32.5 0.676 29.2422 0 27.3 0C24.973 0 21.4019 3.1317 19.5 5.9657C17.5981 3.1317 14.027 0 11.7 0C9.7578 0 6.5 0.676 6.5 5.2C6.5 6.1516 6.7756 7.0317 7.2241 7.8H1.3C0.5824 7.8 0 8.3824 0 9.1V16.9C0 17.6176 0.5824 18.2 1.3 18.2H2.6V37.7C2.6 38.4176 3.1824 39 3.9 39H35.1C35.8189 39 36.4 38.4176 36.4 37.7V18.2H37.7C38.4189 18.2 39 17.6176 39 16.9V9.1C39 8.3824 38.4189 7.8 37.7 7.8ZM27.3 2.6C29.4866 2.6 29.9 3.5139 29.9 5.2C29.9 6.6339 28.7339 7.8 27.3 7.8H21.3408C22.6278 5.759 25.8661 2.6 27.3 2.6ZM22.1 15.6H16.9V10.4H19.5H22.1V15.6ZM9.1 5.2C9.1 3.5139 9.5147 2.6 11.7 2.6C13.1339 2.6 16.3722 5.759 17.6579 7.8H11.7C10.2661 7.8 9.1 6.6339 9.1 5.2ZM2.6 10.4H14.3V15.6H2.6V10.4ZM5.2 18.2H14.3V36.4H5.2V18.2ZM16.9 36.4V18.2H22.1V36.4H16.9ZM33.8 36.4H24.7V18.2H33.8V36.4ZM36.4 15.6H24.7V10.4H36.4V15.6Z"
               fill={this.state.dark ?'white' : 'black'}/></G>
               </Svg>
           </TouchableOpacity>}
            onPress={() => this.props.navigation.navigate('Profile', {user: item.user, dark: this.state.dark })}
            style={{backgroundColor: 'transparent', elevation: 5, zIndex: 5}}
          />
        </View>
        <View style={{ width: '90%', alignSelf: 'center', marginBottom: 10}}>
          <Text>{this.formatText(item.text)}</Text>
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
                  <NativeImage
                  source={{uri: item.uri}}
                  style={{width: '95%', height: (Dimensions.get('window').height * 50) / 100, marginLeft: '2.5%'}}
                  loadingIndicatorSource={{uri: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/f1055231234507.564a1d234bfb6.gif', priority: 'high'}}
                /></TouchableWithoutFeedback>
              )}
              sliderWidth={Dimensions.get('window').width}
              itemWidth={Dimensions.get('screen').width}
              layout={'stack'} layoutCardOffset={`18`}
              firstItem={1}
              inactiveSlideOpacity={1}
            />
          )) : null
        :
        this.state.imageUrls[index] && this.state.imageUrls[index].length
          ? this.state.imageUrls[index].map((uri) => (
            <Image
              source={{uri: uri}} key={uri}
              style={{width: '95%', height: (Dimensions.get('window').height * 50) / 100, alignSelf: 'center',
               marginBottom: 0, marginLeft: '2.5%', borderTopLeftRadius: 10, borderTopRightRadius: 10  }}
               containerStyle={{borderRadius: 10}}
              onPress={() => this.props.navigation.navigate('ViewPost', {id: item.id, dark: this.state.dark })}
              PlaceholderContent={<FastImage source={{uri: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/f1055231234507.564a1d234bfb6.gif', priority: 'high'}} style={{alignSelf: 'center', marginTop: "40%", width: 100, height: 100}} />}
             />
            ))
          : <FastImage source={{uri: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/f1055231234507.564a1d234bfb6.gif', priority: 'high'}} style={{alignSelf: 'center', marginTop: "40%", width: 100, height: 100}} />

         }  
        <Input placeholder="Type a Comment..." style={{
           backgroundColor: this.state.dark ? '#393939' : 'white', borderWidth: 0, borderColor: 'transparent', borderRadius: 0, width: '95%', marginBottom: 0,
            alignSelf: 'center', borderBottomEndRadius: 10, borderBottomStartRadius: 10, elevation: 2
           }} textStyle={{color: this.state.dark ?'white' : '#ababab'}} placeholderTextColor={this.state.dark ?'white' : '#ababab'} size="large"
           accessoryRight={props =>  <TouchableOpacity style={{height: 30, marginHorizontal: 10, flexDirection: 'row'}}
          onPress={() =>  {
            this.setState({showComments: !this.state.showComments, currentPostId: item.id, currentPostAuthor: item.user})
            this.fetchComments(item.id)
          }}>
            <Svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 25 25">
          <Path d="M3.12775 18.8879C3.19186 18.6519 3.05016 18.3238 2.91492 18.0873C2.87281 18.0168 2.82714 17.9484 2.77807 17.8825C1.61819 16.1235 0.999979 14.0628 1.00005 11.9558C0.981195 5.90787 5.99628 1 12.1978 1C17.6062 1 22.1207 4.74677 23.1757 9.72037C23.3338 10.4578 23.4136 11.2098 23.4138 11.9639C23.4138 18.0205 18.5922 23.0054 12.3907 23.0054C11.4047 23.0054 10.0739 22.7575 9.34811 22.5544C8.62236 22.3513 7.89768 22.0819 7.71072 22.0097C7.51951 21.9362 7.31643 21.8984 7.11158 21.8982C6.88783 21.8973 6.66623 21.9419 6.46018 22.0291L2.80555 23.3481C2.72548 23.3826 2.64065 23.4047 2.55393 23.4138C2.4855 23.4136 2.4178 23.3998 2.35473 23.3732C2.29167 23.3467 2.2345 23.3079 2.18654 23.2591C2.13858 23.2103 2.10079 23.1524 2.07534 23.0889C2.0499 23.0254 2.03731 22.9574 2.03831 22.889C2.0428 22.8289 2.05364 22.7695 2.07064 22.7117L3.12775 18.8879Z" 
          stroke={this.state.dark ?'white' : '#ababab'} stroke-width="4" stroke-miterlimit="10" stroke-linecap="round"></Path>
          </Svg>
           <Text style={{fontWeight: 'bold', color: this.state.dark ?'white' : '#5c5c5c', marginLeft: 3 }}>{parseInt(item.comments) > 0 ? item.comments : null}</Text>
          </TouchableOpacity>}
          onFocus={() => {
            this.setState({showComments: !this.state.showComments, currentPostId: item.id, currentPostAuthor: item.user})
            this.fetchComments(item.id)
          }} /></View>
       </View>
       <View style={{flexDirection: 'row', bottom:"15%", left: 20, marginTop: 30}}>
       <Layout style={{ alignSelf: 'flex-end', flexDirection: 'row',
        backgroundColor: 'transparent', borderWidth: 0, position: 'absolute', right: '10%'}}>
        <TouchableOpacity style={{ borderColor: 'transparent', borderRadius: 30, marginHorizontal: 10}}
          onPress={() => this.lovePosts(item.id, item.user)}> 
             {this.state.loves[index].isliked ? <Svg width="35" height="31" viewBox="0 0 391.837 391.837" fill="none" xmlns="http://www.w3.org/2000/svg">
             <Path fill="#FF007A" d="M285.257,35.528c58.743,0.286,106.294,47.836,106.58,106.58
             c0,107.624-195.918,214.204-195.918,214.204S0,248.165,0,142.108c0-58.862,47.717-106.58,106.58-106.58l0,0
             c36.032-0.281,69.718,17.842,89.339,48.065C215.674,53.517,249.273,35.441,285.257,35.528z"/>
             </Svg> : 
             <Svg width="40" height="40" viewBox="0 0 35 31" fill="none" xmlns="http://www.w3.org/2000/svg">
              <Path fill-rule="evenodd" clip-rule="evenodd" d="M17.5 24L17.0666 23.6604C7.57162 16.219 5 13.5995 5 9.34448C5 5.84613 7.95777 3 11.5933 3C14.6316 3 16.3489 4.66036 17.5 5.90936C18.6511 4.66036 20.3684 3 23.4067 3C27.0422 3 30 5.84613 30 9.34448C30 13.5995 27.4284 16.219 17.9334 23.6604L17.5 24ZM11.5933 4.32147C8.7153 4.32147 6.3733 6.57507 6.3733 9.34448C6.3733 12.9899 8.75738 15.4268 17.5 22.2949C26.2426 15.4268 28.6267 12.9899 28.6267 9.34448C28.6267 6.57507 26.2847 4.32147 23.4067 4.32147C20.7708 4.32147 19.3953 5.83121 18.2908 7.04469L17.5 7.89938L16.7092 7.04469C15.6047 5.83121 14.2292 4.32147 11.5933 4.32147Z" fill="black"/>
                <Path fill-rule="evenodd" clip-rule="evenodd" d="M17.5 24L17.0666 23.6604C7.57162 16.219 5 13.5995 5 9.34448C5 5.84613 7.95777 3 11.5933 3C14.6316 3 16.3489 4.66036 17.5 5.90936C18.6511 4.66036 20.3684 3 23.4067 3C27.0422 3 30 5.84613 30 9.34448C30 13.5995 27.4284 16.219 17.9334 23.6604L17.5 24ZM11.5933 4.32147C8.7153 4.32147 6.3733 6.57507 6.3733 9.34448C6.3733 12.9899 8.75738 15.4268 17.5 22.2949C26.2426 15.4268 28.6267 12.9899 28.6267 9.34448C28.6267 6.57507 26.2847 4.32147 23.4067 4.32147C20.7708 4.32147 19.3953 5.83121 18.2908 7.04469L17.5 7.89938L16.7092 7.04469C15.6047 5.83121 14.2292 4.32147 11.5933 4.32147Z" fill="white" />
                <Path fill-rule="evenodd" clip-rule="evenodd" d="M17.5 24L17.0666 23.6604C7.57162 16.219 5 13.5995 5 9.34448C5 5.84613 7.95777 3 11.5933 3C14.6316 3 16.3489 4.66036 17.5 5.90936C18.6511 4.66036 20.3684 3 23.4067 3C27.0422 3 30 5.84613 30 9.34448C30 13.5995 27.4284 16.219 17.9334 23.6604L17.5 24ZM11.5933 4.32147C8.7153 4.32147 6.3733 6.57507 6.3733 9.34448C6.3733 12.9899 8.75738 15.4268 17.5 22.2949C26.2426 15.4268 28.6267 12.9899 28.6267 9.34448C28.6267 6.57507 26.2847 4.32147 23.4067 4.32147C20.7708 4.32147 19.3953 5.83121 18.2908 7.04469L17.5 7.89938L16.7092 7.04469C15.6047 5.83121 14.2292 4.32147 11.5933 4.32147Z" fill="#FF007A"/>
                <Path d="M17.3458 24.1968L17.5 24.3176L17.6542 24.1968L18.0876 23.8572L18.0876 23.8572C22.8312 20.1395 25.868 17.6095 27.7165 15.471C29.5785 13.3167 30.25 11.5419 30.25 9.34448C30.25 5.69908 27.1712 2.75 23.4067 2.75C20.4206 2.75 18.665 4.30564 17.5 5.54248C16.335 4.30564 14.5794 2.75 11.5933 2.75C7.82885 2.75 4.75 5.69908 4.75 9.34448C4.75 11.5419 5.4215 13.3167 7.28354 15.471C9.13199 17.6095 12.1688 20.1395 16.9124 23.8572L16.9124 23.8572L17.3458 24.1968ZM18.4743 7.21447L18.4743 7.21448L18.4756 7.21298C19.5795 6.00021 20.8891 4.57147 23.4067 4.57147C26.1558 4.57147 28.3767 6.72212 28.3767 9.34448C28.3767 11.0926 27.813 12.5568 26.154 14.4462C24.5028 16.3268 21.7855 18.6069 17.5 21.9769C13.2145 18.6069 10.4972 16.3268 8.84603 14.4462C7.18704 12.5568 6.6233 11.0926 6.6233 9.34448C6.6233 6.72212 8.84422 4.57147 11.5933 4.57147C14.1109 4.57147 15.4205 6.00021 16.5244 7.21298L16.5244 7.21298L16.5257 7.21447L17.3165 8.06916L17.5 8.26751L17.6835 8.06916L18.4743 7.21447Z" 
                stroke="#FF007A" stroke-width="0.5"/> 
              </Svg>}
          <Text style={{textAlign: 'center', color: this.state.dark ? "white" : 'black', }}>{this.state.loves[index].loves}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{backgroundColor: 'transparent', borderColor: 'transparent', marginHorizontal: 10}}
        onPress={() => {
          this.state.imageUrls[index] && this.state.imageUrls[index].length
          ? this.state.imageUrls[index].map((uri) => (
            this.props.navigation.navigate('Create', {mixContent: uri, dark: this.state.dark, user: this.state.user})
          )) : ToastAndroid.show('Please Try Again', ToastAndroid.SHORT)
        }}>
           <Svg width="43" height="40" viewBox="0 0 33 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <G filter="url(#filter0_d)">
            <Path fill-rule="evenodd" clip-rule="evenodd" d="M23.8796 8.62612L23.8187 8.62724C23.6728 8.63125 23.5277 8.64666 23.3844 8.67472C22.8885 8.77189 22.4301 9.00929 22.0163 9.29278C21.9374 9.34684 21.8598 9.40284 21.7835 9.46045C21.3394 9.79548 20.9355 10.1819 20.5543 10.586C20.0978 11.0701 19.6727 11.5831 19.2611 12.1056L18.6839 12.8614L18.4115 13.218C18.0089 13.7582 17.6105 14.3016 17.2086 14.8423C16.9081 15.2453 16.6056 15.6469 16.2959 16.0429L16.0514 16.3461L15.5807 16.9296C15.3977 17.1485 15.2115 17.3647 15.0212 17.5772C14.8732 17.7425 14.7227 17.9057 14.5693 18.066C13.6638 19.0127 12.6477 19.8768 11.4739 20.4725C11.3267 20.5472 11.1773 20.6174 11.0259 20.683C10.8263 20.7693 10.6231 20.8473 10.4169 20.9161C10.1419 21.0078 9.86138 21.0832 9.57723 21.1407C9.30377 21.1961 9.02698 21.2348 8.74882 21.2565C8.6074 21.2675 8.46577 21.2736 8.32396 21.2763C8.27244 21.2769 8.27255 21.277 8.22097 21.2772C8.22097 21.2772 5.76861 21.2772 4.60241 21.2772C4.44264 21.2772 4.28942 21.2137 4.17644 21.1007C4.06347 20.9877 4 20.8345 4 20.6747C4 19.8737 4 18.4658 4 17.6641C4 17.504 4.06371 17.3505 4.17706 17.2375C4.29042 17.1245 4.4441 17.0612 4.60417 17.0617C5.8307 17.0668 7.04957 17.0835 8.27887 17.0595C8.3197 17.0584 8.36045 17.0565 8.4012 17.0538C8.52206 17.0449 8.6421 17.0284 8.76072 17.0035C9.26512 16.8975 9.73031 16.6512 10.1505 16.359C10.2467 16.2921 10.341 16.2224 10.4335 16.1505C10.8813 15.8022 11.2892 15.4043 11.6747 14.9891C12.1325 14.496 12.5597 13.9752 12.974 13.4454L13.4202 12.8568L13.9338 12.1794C14.263 11.7348 14.5909 11.2892 14.9208 10.8451C15.2208 10.4425 15.5226 10.0413 15.8315 9.64545L16.0534 9.37059L16.6055 8.68658C16.7885 8.46849 16.9748 8.25315 17.1653 8.04155C17.3135 7.87699 17.4641 7.71467 17.6177 7.55516C18.5244 6.61328 19.5436 5.75586 20.721 5.17244C20.8687 5.09923 21.0186 5.0305 21.1707 4.96665C21.371 4.88248 21.575 4.8068 21.782 4.7405C22.0581 4.65208 22.3395 4.58034 22.6244 4.52675C23.037 4.44913 23.4556 4.41129 23.8754 4.40964H23.8796V2L29 6.51808L23.8796 11.0362V8.62613L23.8796 8.62612ZM23.8796 17.0603V14.6506L29.0001 19.1687L23.8796 23.6868V21.2772H23.8755C23.4548 21.2755 23.0354 21.2378 22.6219 21.1604C22.3363 21.107 22.0543 21.0354 21.7775 20.9472C21.57 20.881 21.3655 20.8055 21.1645 20.7215C21.0121 20.6577 20.8617 20.5891 20.7135 20.516C19.5612 19.9476 18.5588 19.1173 17.6656 18.2021C17.5107 18.0434 17.3588 17.8817 17.2095 17.7177L16.8367 17.2927L17.245 16.7851C17.5606 16.3815 17.8688 15.9724 18.175 15.5618C18.5412 15.0691 18.9046 14.5742 19.2707 14.0814L19.4513 13.8496C19.8504 14.3447 20.2523 14.8149 20.6837 15.257C21.0485 15.6309 21.4353 15.9868 21.8589 16.2935C22.3133 16.6226 22.822 16.9033 23.3778 17.0117C23.5365 17.0426 23.6974 17.0583 23.859 17.0602L23.8796 17.0603L23.8796 17.0603ZM12.653 11.8696L11.9073 10.9784C11.4749 10.4903 11.0173 10.0199 10.5093 9.6098C10.4164 9.53478 10.3217 9.46191 10.2251 9.39175C10.1494 9.33676 10.0724 9.28343 9.99415 9.23209C9.58736 8.96532 9.13797 8.74715 8.65522 8.66402C8.51709 8.64024 8.37748 8.62826 8.23736 8.62662L8.21277 8.62652C8.21277 8.62652 5.76683 8.62652 4.60244 8.62652C4.26974 8.62652 4.00003 8.35681 4.00003 8.02411C4.00003 7.22248 4.00003 5.81327 4.00003 5.01179C4.00003 4.67922 4.26953 4.40957 4.6021 4.40938C5.82485 4.40836 7.04761 4.40506 8.27035 4.40985C8.32368 4.41048 8.37695 4.41152 8.43026 4.41298C8.57133 4.41795 8.71217 4.4262 8.85273 4.43941C9.12919 4.46539 9.40401 4.50842 9.67525 4.56782C9.94069 4.62595 10.2027 4.69975 10.4597 4.78789C10.6646 4.85819 10.8665 4.93759 11.0647 5.02522C11.23 5.09834 11.3928 5.17717 11.5529 5.26117C12.6304 5.82646 13.573 6.61796 14.4186 7.48621C14.5731 7.64492 14.7247 7.80653 14.8737 7.97046L15.2689 8.42177L14.8818 8.9042C14.5671 9.30731 14.2597 9.71593 13.9542 10.1259C13.5886 10.6181 13.2257 11.1124 12.8599 11.6045L12.653 11.8696L12.653 11.8696Z" fill="white"/>
            <Path fill-rule="evenodd" clip-rule="evenodd" d="M23.8796 8.62612L23.8187 8.62724C23.6728 8.63125 23.5277 8.64666 23.3844 8.67472C22.8885 8.77189 22.4301 9.00929 22.0163 9.29278C21.9374 9.34684 21.8598 9.40284 21.7835 9.46045C21.3394 9.79548 20.9355 10.1819 20.5543 10.586C20.0978 11.0701 19.6727 11.5831 19.2611 12.1056L18.6839 12.8614L18.4115 13.218C18.0089 13.7582 17.6105 14.3016 17.2086 14.8423C16.9081 15.2453 16.6056 15.6469 16.2959 16.0429L16.0514 16.3461L15.5807 16.9296C15.3977 17.1485 15.2115 17.3647 15.0212 17.5772C14.8732 17.7425 14.7227 17.9057 14.5693 18.066C13.6638 19.0127 12.6477 19.8768 11.4739 20.4725C11.3267 20.5472 11.1773 20.6174 11.0259 20.683C10.8263 20.7693 10.6231 20.8473 10.4169 20.9161C10.1419 21.0078 9.86138 21.0832 9.57723 21.1407C9.30377 21.1961 9.02698 21.2348 8.74882 21.2565C8.6074 21.2675 8.46577 21.2736 8.32396 21.2763C8.27244 21.2769 8.27255 21.277 8.22097 21.2772C8.22097 21.2772 5.76861 21.2772 4.60241 21.2772C4.44264 21.2772 4.28942 21.2137 4.17644 21.1007C4.06347 20.9877 4 20.8345 4 20.6747C4 19.8737 4 18.4658 4 17.6641C4 17.504 4.06371 17.3505 4.17706 17.2375C4.29042 17.1245 4.4441 17.0612 4.60417 17.0617C5.8307 17.0668 7.04957 17.0835 8.27887 17.0595C8.3197 17.0584 8.36045 17.0565 8.4012 17.0538C8.52206 17.0449 8.6421 17.0284 8.76072 17.0035C9.26512 16.8975 9.73031 16.6512 10.1505 16.359C10.2467 16.2921 10.341 16.2224 10.4335 16.1505C10.8813 15.8022 11.2892 15.4043 11.6747 14.9891C12.1325 14.496 12.5597 13.9752 12.974 13.4454L13.4202 12.8568L13.9338 12.1794C14.263 11.7348 14.5909 11.2892 14.9208 10.8451C15.2208 10.4425 15.5226 10.0413 15.8315 9.64545L16.0534 9.37059L16.6055 8.68658C16.7885 8.46849 16.9748 8.25315 17.1653 8.04155C17.3135 7.87699 17.4641 7.71467 17.6177 7.55516C18.5244 6.61328 19.5436 5.75586 20.721 5.17244C20.8687 5.09923 21.0186 5.0305 21.1707 4.96665C21.371 4.88248 21.575 4.8068 21.782 4.7405C22.0581 4.65208 22.3395 4.58034 22.6244 4.52675C23.037 4.44913 23.4556 4.41129 23.8754 4.40964H23.8796V2L29 6.51808L23.8796 11.0362V8.62613L23.8796 8.62612ZM23.8796 17.0603V14.6506L29.0001 19.1687L23.8796 23.6868V21.2772H23.8755C23.4548 21.2755 23.0354 21.2378 22.6219 21.1604C22.3363 21.107 22.0543 21.0354 21.7775 20.9472C21.57 20.881 21.3655 20.8055 21.1645 20.7215C21.0121 20.6577 20.8617 20.5891 20.7135 20.516C19.5612 19.9476 18.5588 19.1173 17.6656 18.2021C17.5107 18.0434 17.3588 17.8817 17.2095 17.7177L16.8367 17.2927L17.245 16.7851C17.5606 16.3815 17.8688 15.9724 18.175 15.5618C18.5412 15.0691 18.9046 14.5742 19.2707 14.0814L19.4513 13.8496C19.8504 14.3447 20.2523 14.8149 20.6837 15.257C21.0485 15.6309 21.4353 15.9868 21.8589 16.2935C22.3133 16.6226 22.822 16.9033 23.3778 17.0117C23.5365 17.0426 23.6974 17.0583 23.859 17.0602L23.8796 17.0603L23.8796 17.0603ZM12.653 11.8696L11.9073 10.9784C11.4749 10.4903 11.0173 10.0199 10.5093 9.6098C10.4164 9.53478 10.3217 9.46191 10.2251 9.39175C10.1494 9.33676 10.0724 9.28343 9.99415 9.23209C9.58736 8.96532 9.13797 8.74715 8.65522 8.66402C8.51709 8.64024 8.37748 8.62826 8.23736 8.62662L8.21277 8.62652C8.21277 8.62652 5.76683 8.62652 4.60244 8.62652C4.26974 8.62652 4.00003 8.35681 4.00003 8.02411C4.00003 7.22248 4.00003 5.81327 4.00003 5.01179C4.00003 4.67922 4.26953 4.40957 4.6021 4.40938C5.82485 4.40836 7.04761 4.40506 8.27035 4.40985C8.32368 4.41048 8.37695 4.41152 8.43026 4.41298C8.57133 4.41795 8.71217 4.4262 8.85273 4.43941C9.12919 4.46539 9.40401 4.50842 9.67525 4.56782C9.94069 4.62595 10.2027 4.69975 10.4597 4.78789C10.6646 4.85819 10.8665 4.93759 11.0647 5.02522C11.23 5.09834 11.3928 5.17717 11.5529 5.26117C12.6304 5.82646 13.573 6.61796 14.4186 7.48621C14.5731 7.64492 14.7247 7.80653 14.8737 7.97046L15.2689 8.42177L14.8818 8.9042C14.5671 9.30731 14.2597 9.71593 13.9542 10.1259C13.5886 10.6181 13.2257 11.1124 12.8599 11.6045L12.653 11.8696L12.653 11.8696Z" fill="#00E0FF"/>
            </G>
            </Svg>
        </TouchableOpacity>
        <TouchableOpacity style={{backgroundColor: 'transparent', borderColor: 'transparent', marginHorizontal: 10}}
        onPress={() => {
          this.state.imageUrls[index] && this.state.imageUrls[index].length
          ? this.state.imageUrls[index].map((uri) => (
            Share.share({
              message:
              'Check the Awesome Meme in Meme app ' + uri,
            })
          )) : null
        }}>
           <Svg width="40" height="37" viewBox="0 0 35 33" fill="none" xmlns="http://www.w3.org/2000/svg">
            <G filter="url(#filter0_d)">
            <Path d="M19.6712 10.335V5L29.0073 14.3362L19.6712 23.6723V18.204C13.0025 18.204 8.33437 20.338 5.00002 25.0061C6.33376 18.3374 10.335 11.6687 19.6712 10.335Z" stroke="white" stroke-width="2"/>
            <Path d="M19.6712 10.335V5L29.0073 14.3362L19.6712 23.6723V18.204C13.0025 18.204 8.33437 20.338 5.00002 25.0061C6.33376 18.3374 10.335 11.6687 19.6712 10.335Z" stroke="#FFF500" stroke-width="2"/>
            <Path d="M19.6712 10.335V5L29.0073 14.3362L19.6712 23.6723V18.204C13.0025 18.204 8.33437 20.338 5.00002 25.0061C6.33376 18.3374 10.335 11.6687 19.6712 10.335Z" stroke="#8000FF" stroke-width="2"/>
            </G>
            </Svg>
        </TouchableOpacity>
        </Layout>
        </View>
        </View>
  )
    renderComments = ({item, idx}) => (
      parseInt(item.replyId) > 0 ? null :
      <> 
      <Text style={{fontWeight: 'bold', marginLeft : 5,
       color: '#6D6D6D'}}>{item.user} {this.state.language == 'en' ? <Text style={{color: '#BABABA', fontSize: 12, fontWeight: 'normal'}}>
         {item.time}</Text> : <PowerTranslator style={{color: '#BABABA', fontSize: 12, fontWeight: 'normal'}} text={item.time} target={this.state.language}  />}</Text>
      
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
      <View style={{marginLeft: '10%', alignSelf: 'flex-start', backgroundColor: '#fff', borderRadius: 30, padding: 15, maxWidth: '80%'}}>
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
                <Text style={{marginHorizontal: 10}}>{this.state.language == 'en' ? 
                <Text style={{elevation: 6, zIndex: 6, textAlign: 'left'}}>
                  {itm.text} <Text style={{color: '#BABABA', fontSize: 12, fontWeight: 'normal'}}>{itm.time}</Text>
                </Text> 
                : <PowerTranslator text={itm.text} style={{elevation: 6, zIndex: 6, color: this.state.dark ? 'white' : 'black'}} target={this.state.language} />}</Text>
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
            <ScaledImage uri='https://static.wixstatic.com/media/bf112e_439a048dd6e645c28c76882795d06735~mv2.gif'
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
    currentFeed(){
      if(this.state.feedOrder == 'date_time'){
        return 'new-box'
      }else if(this.state.feedOrder == 'loved'){
        return 'ios-arrow-up-circle'
      }
    }
    changeFeed(){
      if(this.state.feedOrder == 'date_time'){
        this.fetch(null, 'loved')
        ToastAndroid.show('Showing Top Memes', ToastAndroid.SHORT)
      }else if(this.state.feedOrder == 'loved'){
        this.fetch(null, 'date_time')
        ToastAndroid.show('Showing the Latest Memes', ToastAndroid.SHORT)
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
    theme={this.state.dark ? eva.dark : eva.light }>
     
        <Layout level="2" style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View style={{flexDirection:'row', zIndex: 20,
              justifyContent: 'space-between', alignItems: 'center', paddingTop: 30, top: 0, position: 'absolute', paddingRight: 15, paddingLeft: 15,
                left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0)'}}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', {user: this.state.user, dark: this.state.dark})}>
            <Svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
              <Path d="M19.1999 9.80312L19.2009 9.80313C20.2913 9.80527 21.3364 10.2394 22.1074 11.0104C22.8784 11.7814 23.3125 12.8265 23.3147 13.9169V13.9179C23.3147 14.7317 23.0733 15.5272 22.6212 16.2039C22.1691 16.8806 21.5264 17.408 20.7745 17.7194C20.4942 17.8355 20.2034 17.9197 19.9075 17.9713C20.1645 17.9955 20.4209 18.0328 20.6757 18.0835C22.143 18.3753 23.4908 19.0956 24.5488 20.1533C25.2536 20.8543 25.8124 21.6881 26.1929 22.6065C26.5735 23.5251 26.7681 24.5101 26.7655 25.5044L26.7642 26.0031H26.2655H12.1343H11.6342L11.6343 25.5031C11.6344 24.0068 12.0782 22.5442 12.9095 21.3002C13.7409 20.0562 14.9224 19.0866 16.3048 18.514C17.0066 18.2233 17.7442 18.0416 18.4924 17.9713C18.4606 17.9658 18.4288 17.9599 18.3972 17.9536C17.599 17.7948 16.8658 17.4029 16.2903 16.8274C15.7149 16.252 15.323 15.5188 15.1642 14.7206C15.0054 13.9224 15.0869 13.0951 15.3984 12.3432C15.7098 11.5914 16.2372 10.9487 16.9139 10.4966C17.5905 10.0445 18.3861 9.80312 19.1999 9.80312ZM4.4999 18.2C4.4999 26.3183 11.0816 32.9 19.1999 32.9C27.3182 32.9 33.8999 26.3183 33.8999 18.2C33.8999 10.0817 27.3182 3.5 19.1999 3.5C11.0816 3.5 4.4999 10.0817 4.4999 18.2Z" stroke={this.state.dark ? "white" : "black"} stroke-opacity="0.36"/>
             </Svg>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Contests', {user: this.state.user, dark: this.state.dark})}>
              <Icon name='ios-trophy-outline' size={35} color={this.state.dark ? "white" : "black"} />
            </TouchableOpacity> 

            <TouchableOpacity onPress={() => this.fetch('', 'date_time')} >
             <Icon name='ios-home' size={35} color={this.state.dark ? "white" : "#000"} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.props.navigation.navigate('Notifications', {user: this.state.user, dark: this.state.dark})}>
             <Icon name='notifications-outline' size={35} color={this.state.dark ? "white" : "black"} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Conversations', {user: this.state.user, dark: this.state.dark})}
            >
                <Svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 25 25">
              <Path d="M3.12775 18.8879C3.19186 18.6519 3.05016 18.3238 2.91492 18.0873C2.87281 18.0168 2.82714 17.9484 2.77807 17.8825C1.61819 16.1235 0.999979 14.0628 1.00005 11.9558C0.981195 5.90787 5.99628 1 12.1978 1C17.6062 1 22.1207 4.74677 23.1757 9.72037C23.3338 10.4578 23.4136 11.2098 23.4138 11.9639C23.4138 18.0205 18.5922 23.0054 12.3907 23.0054C11.4047 23.0054 10.0739 22.7575 9.34811 22.5544C8.62236 22.3513 7.89768 22.0819 7.71072 22.0097C7.51951 21.9362 7.31643 21.8984 7.11158 21.8982C6.88783 21.8973 6.66623 21.9419 6.46018 22.0291L2.80555 23.3481C2.72548 23.3826 2.64065 23.4047 2.55393 23.4138C2.4855 23.4136 2.4178 23.3998 2.35473 23.3732C2.29167 23.3467 2.2345 23.3079 2.18654 23.2591C2.13858 23.2103 2.10079 23.1524 2.07534 23.0889C2.0499 23.0254 2.03731 22.9574 2.03831 22.889C2.0428 22.8289 2.05364 22.7695 2.07064 22.7117L3.12775 18.8879Z" 
              stroke={this.state.dark ? "white" : "black"} stroke-width="4" stroke-miterlimit="10" stroke-linecap="round" fillOpacity={0.6}></Path>
              </Svg>
            </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Create', {dark: this.state.dark, user: this.state.user})} 
        style={{position: 'absolute', zIndex: 100, elevation: 100, bottom: 20, left: 20}}>
        <Svg width="135" height="60" viewBox="0 0 135 63" fill="none" xmlns="http://www.w3.org/2000/svg">
          <G filter="url(#filter0_d)">
          <Path d="M28 8C16.9714 8 8 16.9714 8 28C8 39.0286 16.9714 48 28 48C39.0286 48 48 39.0286 48 28C48 16.9714 39.0286 8 28 8Z" fill="white"/>
          <Path d="M28 8C16.9714 8 8 16.9714 8 28C8 39.0286 16.9714 48 28 48C39.0286 48 48 39.0286 48 28C48 16.9714 39.0286 8 28 8Z" fill="#FF00A8"/>
          <Rect x="4" width="127" height="56" rx="28" fill="#FF00A8"/>
          <Path d="M30.9884 41.999C29.7432 41.999 28.8092 40.9872 28.8092 39.8198V16.2375C28.8092 14.9922 29.821 14.0582 30.9884 14.0582C32.1559 14.0582 33.1677 15.07 33.1677 16.2375V39.8198C33.1677 40.9872 32.2337 41.999 30.9884 41.999Z" fill="black"/>
          <Path d="M30.9884 41.999C29.7432 41.999 28.8092 40.9872 28.8092 39.8198V16.2375C28.8092 14.9922 29.821 14.0582 30.9884 14.0582C32.1559 14.0582 33.1677 15.07 33.1677 16.2375V39.8198C33.1677 40.9872 32.2337 41.999 30.9884 41.999Z" fill="white"/>
          <Path d="M42.7429 30.1691H19.2384C17.9932 30.1691 17.0592 29.1573 17.0592 27.9898C17.0592 26.8224 18.071 25.8106 19.2384 25.8106H42.8208C44.066 25.8106 45 26.8224 45 27.9898C45 29.1573 43.9882 30.1691 42.7429 30.1691Z" fill="black"/>
          <Path d="M42.7429 30.1691H19.2384C17.9932 30.1691 17.0592 29.1573 17.0592 27.9898C17.0592 26.8224 18.071 25.8106 19.2384 25.8106H42.8208C44.066 25.8106 45 26.8224 45 27.9898C45 29.1573 43.9882 30.1691 42.7429 30.1691Z" fill="white"/>
          <Path d="M66.4521 24H64.2285L58.5244 14.9209V24H56.3008V11.2031H58.5244L64.2461 20.3174V11.2031H66.4521V24ZM73.0615 24.1758C71.708 24.1758 70.6094 23.751 69.7656 22.9014C68.9277 22.0459 68.5088 20.9092 68.5088 19.4912V19.2275C68.5088 18.2783 68.6904 17.4316 69.0537 16.6875C69.4229 15.9375 69.9385 15.3545 70.6006 14.9385C71.2627 14.5225 72.001 14.3145 72.8154 14.3145C74.1104 14.3145 75.1094 14.7275 75.8125 15.5537C76.5215 16.3799 76.876 17.5488 76.876 19.0605V19.9219H70.6621C70.7266 20.707 70.9873 21.3281 71.4443 21.7852C71.9072 22.2422 72.4873 22.4707 73.1846 22.4707C74.1631 22.4707 74.96 22.0752 75.5752 21.2842L76.7266 22.3828C76.3457 22.9512 75.8359 23.3936 75.1973 23.71C74.5645 24.0205 73.8525 24.1758 73.0615 24.1758ZM72.8066 16.0283C72.2207 16.0283 71.7461 16.2334 71.3828 16.6436C71.0254 17.0537 70.7969 17.625 70.6973 18.3574H74.7666V18.1992C74.7197 17.4844 74.5293 16.9453 74.1953 16.582C73.8613 16.2129 73.3984 16.0283 72.8066 16.0283ZM86.8955 21.0557L88.4072 14.4902H90.4902L87.8975 24H86.1396L84.1006 17.4697L82.0967 24H80.3389L77.7373 14.4902H79.8203L81.3584 20.9854L83.3096 14.4902H84.918L86.8955 21.0557ZM59.1836 31.2031L62.875 41.0117L66.5576 31.2031H69.4316V44H67.2168V39.7812L67.4365 34.1387L63.6572 44H62.0664L58.2959 34.1475L58.5156 39.7812V44H56.3008V31.2031H59.1836ZM76.0498 44.1758C74.6963 44.1758 73.5977 43.751 72.7539 42.9014C71.916 42.0459 71.4971 40.9092 71.4971 39.4912V39.2275C71.4971 38.2783 71.6787 37.4316 72.042 36.6875C72.4111 35.9375 72.9268 35.3545 73.5889 34.9385C74.251 34.5225 74.9893 34.3145 75.8037 34.3145C77.0986 34.3145 78.0977 34.7275 78.8008 35.5537C79.5098 36.3799 79.8643 37.5488 79.8643 39.0605V39.9219H73.6504C73.7148 40.707 73.9756 41.3281 74.4326 41.7852C74.8955 42.2422 75.4756 42.4707 76.1729 42.4707C77.1514 42.4707 77.9482 42.0752 78.5635 41.2842L79.7148 42.3828C79.334 42.9512 78.8242 43.3936 78.1855 43.71C77.5527 44.0205 76.8408 44.1758 76.0498 44.1758ZM75.7949 36.0283C75.209 36.0283 74.7344 36.2334 74.3711 36.6436C74.0137 37.0537 73.7852 37.625 73.6855 38.3574H77.7549V38.1992C77.708 37.4844 77.5176 36.9453 77.1836 36.582C76.8496 36.2129 76.3867 36.0283 75.7949 36.0283ZM83.5381 34.4902L83.5996 35.4834C84.2676 34.7041 85.1816 34.3145 86.3418 34.3145C87.6133 34.3145 88.4834 34.8008 88.9521 35.7734C89.6436 34.8008 90.6162 34.3145 91.8701 34.3145C92.9189 34.3145 93.6982 34.6045 94.208 35.1846C94.7236 35.7646 94.9873 36.6201 94.999 37.751V44H92.8633V37.8125C92.8633 37.209 92.7314 36.7666 92.4678 36.4854C92.2041 36.2041 91.7676 36.0635 91.1582 36.0635C90.6719 36.0635 90.2734 36.1953 89.9629 36.459C89.6582 36.7168 89.4443 37.0566 89.3213 37.4785L89.3301 44H87.1943V37.7422C87.165 36.623 86.5938 36.0635 85.4805 36.0635C84.625 36.0635 84.0186 36.4121 83.6611 37.1094V44H81.5254V34.4902H83.5381ZM101.38 44.1758C100.026 44.1758 98.9277 43.751 98.084 42.9014C97.2461 42.0459 96.8271 40.9092 96.8271 39.4912V39.2275C96.8271 38.2783 97.0088 37.4316 97.3721 36.6875C97.7412 35.9375 98.2568 35.3545 98.9189 34.9385C99.5811 34.5225 100.319 34.3145 101.134 34.3145C102.429 34.3145 103.428 34.7275 104.131 35.5537C104.84 36.3799 105.194 37.5488 105.194 39.0605V39.9219H98.9805C99.0449 40.707 99.3057 41.3281 99.7627 41.7852C100.226 42.2422 100.806 42.4707 101.503 42.4707C102.481 42.4707 103.278 42.0752 103.894 41.2842L105.045 42.3828C104.664 42.9512 104.154 43.3936 103.516 43.71C102.883 44.0205 102.171 44.1758 101.38 44.1758ZM101.125 36.0283C100.539 36.0283 100.064 36.2334 99.7012 36.6436C99.3438 37.0537 99.1152 37.625 99.0156 38.3574H103.085V38.1992C103.038 37.4844 102.848 36.9453 102.514 36.582C102.18 36.2129 101.717 36.0283 101.125 36.0283Z" fill="black"/>
          <Path d="M66.4521 24H64.2285L58.5244 14.9209V24H56.3008V11.2031H58.5244L64.2461 20.3174V11.2031H66.4521V24ZM73.0615 24.1758C71.708 24.1758 70.6094 23.751 69.7656 22.9014C68.9277 22.0459 68.5088 20.9092 68.5088 19.4912V19.2275C68.5088 18.2783 68.6904 17.4316 69.0537 16.6875C69.4229 15.9375 69.9385 15.3545 70.6006 14.9385C71.2627 14.5225 72.001 14.3145 72.8154 14.3145C74.1104 14.3145 75.1094 14.7275 75.8125 15.5537C76.5215 16.3799 76.876 17.5488 76.876 19.0605V19.9219H70.6621C70.7266 20.707 70.9873 21.3281 71.4443 21.7852C71.9072 22.2422 72.4873 22.4707 73.1846 22.4707C74.1631 22.4707 74.96 22.0752 75.5752 21.2842L76.7266 22.3828C76.3457 22.9512 75.8359 23.3936 75.1973 23.71C74.5645 24.0205 73.8525 24.1758 73.0615 24.1758ZM72.8066 16.0283C72.2207 16.0283 71.7461 16.2334 71.3828 16.6436C71.0254 17.0537 70.7969 17.625 70.6973 18.3574H74.7666V18.1992C74.7197 17.4844 74.5293 16.9453 74.1953 16.582C73.8613 16.2129 73.3984 16.0283 72.8066 16.0283ZM86.8955 21.0557L88.4072 14.4902H90.4902L87.8975 24H86.1396L84.1006 17.4697L82.0967 24H80.3389L77.7373 14.4902H79.8203L81.3584 20.9854L83.3096 14.4902H84.918L86.8955 21.0557ZM59.1836 31.2031L62.875 41.0117L66.5576 31.2031H69.4316V44H67.2168V39.7812L67.4365 34.1387L63.6572 44H62.0664L58.2959 34.1475L58.5156 39.7812V44H56.3008V31.2031H59.1836ZM76.0498 44.1758C74.6963 44.1758 73.5977 43.751 72.7539 42.9014C71.916 42.0459 71.4971 40.9092 71.4971 39.4912V39.2275C71.4971 38.2783 71.6787 37.4316 72.042 36.6875C72.4111 35.9375 72.9268 35.3545 73.5889 34.9385C74.251 34.5225 74.9893 34.3145 75.8037 34.3145C77.0986 34.3145 78.0977 34.7275 78.8008 35.5537C79.5098 36.3799 79.8643 37.5488 79.8643 39.0605V39.9219H73.6504C73.7148 40.707 73.9756 41.3281 74.4326 41.7852C74.8955 42.2422 75.4756 42.4707 76.1729 42.4707C77.1514 42.4707 77.9482 42.0752 78.5635 41.2842L79.7148 42.3828C79.334 42.9512 78.8242 43.3936 78.1855 43.71C77.5527 44.0205 76.8408 44.1758 76.0498 44.1758ZM75.7949 36.0283C75.209 36.0283 74.7344 36.2334 74.3711 36.6436C74.0137 37.0537 73.7852 37.625 73.6855 38.3574H77.7549V38.1992C77.708 37.4844 77.5176 36.9453 77.1836 36.582C76.8496 36.2129 76.3867 36.0283 75.7949 36.0283ZM83.5381 34.4902L83.5996 35.4834C84.2676 34.7041 85.1816 34.3145 86.3418 34.3145C87.6133 34.3145 88.4834 34.8008 88.9521 35.7734C89.6436 34.8008 90.6162 34.3145 91.8701 34.3145C92.9189 34.3145 93.6982 34.6045 94.208 35.1846C94.7236 35.7646 94.9873 36.6201 94.999 37.751V44H92.8633V37.8125C92.8633 37.209 92.7314 36.7666 92.4678 36.4854C92.2041 36.2041 91.7676 36.0635 91.1582 36.0635C90.6719 36.0635 90.2734 36.1953 89.9629 36.459C89.6582 36.7168 89.4443 37.0566 89.3213 37.4785L89.3301 44H87.1943V37.7422C87.165 36.623 86.5938 36.0635 85.4805 36.0635C84.625 36.0635 84.0186 36.4121 83.6611 37.1094V44H81.5254V34.4902H83.5381ZM101.38 44.1758C100.026 44.1758 98.9277 43.751 98.084 42.9014C97.2461 42.0459 96.8271 40.9092 96.8271 39.4912V39.2275C96.8271 38.2783 97.0088 37.4316 97.3721 36.6875C97.7412 35.9375 98.2568 35.3545 98.9189 34.9385C99.5811 34.5225 100.319 34.3145 101.134 34.3145C102.429 34.3145 103.428 34.7275 104.131 35.5537C104.84 36.3799 105.194 37.5488 105.194 39.0605V39.9219H98.9805C99.0449 40.707 99.3057 41.3281 99.7627 41.7852C100.226 42.2422 100.806 42.4707 101.503 42.4707C102.481 42.4707 103.278 42.0752 103.894 41.2842L105.045 42.3828C104.664 42.9512 104.154 43.3936 103.516 43.71C102.883 44.0205 102.171 44.1758 101.38 44.1758ZM101.125 36.0283C100.539 36.0283 100.064 36.2334 99.7012 36.6436C99.3438 37.0537 99.1152 37.625 99.0156 38.3574H103.085V38.1992C103.038 37.4844 102.848 36.9453 102.514 36.582C102.18 36.2129 101.717 36.0283 101.125 36.0283Z" fill="white"/>
          </G>
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
    theme={this.state.dark ? eva.dark : eva.light}>
       <Layout level="2" style={{  flex: 1, margin: 0, padding: 0  }}>
       <View style={{flexDirection:'row', zIndex: 20,
              justifyContent: 'space-between', alignItems: 'center', paddingTop: 30, top: 0, position: 'absolute', paddingRight: 15, paddingLeft: 15,
                left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0)'}}>
             <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', {user: this.state.user, dark: this.state.dark})}>
             <Svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
              <Path d="M19.1999 9.80312L19.2009 9.80313C20.2913 9.80527 21.3364 10.2394 22.1074 11.0104C22.8784 11.7814 23.3125 12.8265 23.3147 13.9169V13.9179C23.3147 14.7317 23.0733 15.5272 22.6212 16.2039C22.1691 16.8806 21.5264 17.408 20.7745 17.7194C20.4942 17.8355 20.2034 17.9197 19.9075 17.9713C20.1645 17.9955 20.4209 18.0328 20.6757 18.0835C22.143 18.3753 23.4908 19.0956 24.5488 20.1533C25.2536 20.8543 25.8124 21.6881 26.1929 22.6065C26.5735 23.5251 26.7681 24.5101 26.7655 25.5044L26.7642 26.0031H26.2655H12.1343H11.6342L11.6343 25.5031C11.6344 24.0068 12.0782 22.5442 12.9095 21.3002C13.7409 20.0562 14.9224 19.0866 16.3048 18.514C17.0066 18.2233 17.7442 18.0416 18.4924 17.9713C18.4606 17.9658 18.4288 17.9599 18.3972 17.9536C17.599 17.7948 16.8658 17.4029 16.2903 16.8274C15.7149 16.252 15.323 15.5188 15.1642 14.7206C15.0054 13.9224 15.0869 13.0951 15.3984 12.3432C15.7098 11.5914 16.2372 10.9487 16.9139 10.4966C17.5905 10.0445 18.3861 9.80312 19.1999 9.80312ZM4.4999 18.2C4.4999 26.3183 11.0816 32.9 19.1999 32.9C27.3182 32.9 33.8999 26.3183 33.8999 18.2C33.8999 10.0817 27.3182 3.5 19.1999 3.5C11.0816 3.5 4.4999 10.0817 4.4999 18.2Z" stroke={this.state.dark ? "white" : "black"} stroke-opacity="0.36"/>
             </Svg>
             </TouchableOpacity>
             <TouchableOpacity onPress={() => this.props.navigation.navigate('Contests', {user: this.state.user, dark: this.state.dark})}>
              <Icon name='ios-trophy-outline' size={35} color={this.state.dark ? "white" : "black"} />
            </TouchableOpacity> 

            <TouchableOpacity onPress={() => this.fetch('', 'date_time')} >
             <Icon name='ios-home' size={35} color={this.state.dark ? "white" : "#000"} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.props.navigation.navigate('Notifications', {user: this.state.user, dark: this.state.dark})}>
             <Icon name='notifications-outline' size={35} color={this.state.dark ? "white" : "black"} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Conversations', {user: this.state.user, dark: this.state.dark})}>
            <View style={styles.badgeIconView}>
             <Svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 25 25">
              <Path d="M3.12775 18.8879C3.19186 18.6519 3.05016 18.3238 2.91492 18.0873C2.87281 18.0168 2.82714 17.9484 2.77807 17.8825C1.61819 16.1235 0.999979 14.0628 1.00005 11.9558C0.981195 5.90787 5.99628 1 12.1978 1C17.6062 1 22.1207 4.74677 23.1757 9.72037C23.3338 10.4578 23.4136 11.2098 23.4138 11.9639C23.4138 18.0205 18.5922 23.0054 12.3907 23.0054C11.4047 23.0054 10.0739 22.7575 9.34811 22.5544C8.62236 22.3513 7.89768 22.0819 7.71072 22.0097C7.51951 21.9362 7.31643 21.8984 7.11158 21.8982C6.88783 21.8973 6.66623 21.9419 6.46018 22.0291L2.80555 23.3481C2.72548 23.3826 2.64065 23.4047 2.55393 23.4138C2.4855 23.4136 2.4178 23.3998 2.35473 23.3732C2.29167 23.3467 2.2345 23.3079 2.18654 23.2591C2.13858 23.2103 2.10079 23.1524 2.07534 23.0889C2.0499 23.0254 2.03731 22.9574 2.03831 22.889C2.0428 22.8289 2.05364 22.7695 2.07064 22.7117L3.12775 18.8879Z" 
              stroke={this.state.dark ? "white" : "black"} stroke-width="4" stroke-miterlimit="10" stroke-linecap="round" fillOpacity={0.6}></Path>
              </Svg>
              {Object.keys(this.state.data).length > 0 ? this.state.data[0].unreadM > 0 ? <Text style={styles.badge}> {this.state.data[0].unreadM} </Text> : null : null}
            </View>
            </TouchableOpacity>
        </View>
        { this.state.helpUser ? <AppIntroSlider
        slides={slides}
        renderItem={this._renderItem}
        onDone={() => this.setState({helpUser: false})}
        bottomButton
      />  :     
        <FlatList
              ref={(c) => { this._carousel = c; }}
              data={this.state.data}
              renderItem={this.renderPosts}
              snapToAlignment={'center'}
              snapToInterval={Dimensions.get('window').height}
              decelerationRate={'normal'}
              pagingEnabled
              extraData={this.state}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              refreshControl={<RefreshControl refreshing={this.state.loading} onRefresh={() => {
                  const { params } = this.props.navigation.state
                  const user = params ? params.user : null

                  this.fetch(user, this.state.feedOrder)
                  this.setState({data: []})
                } } />}
            />}
            
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

        <TouchableOpacity onPress={() => this.props.navigation.navigate('Create', {dark: this.state.dark, user: this.state.user})} 
        style={{position: 'absolute', zIndex: 100, elevation: 100, bottom: 20, left: 20}}>
        <Svg width="135" height="60" viewBox="0 0 135 63" fill="none" xmlns="http://www.w3.org/2000/svg">
          <G filter="url(#filter0_d)">
          <Path d="M28 8C16.9714 8 8 16.9714 8 28C8 39.0286 16.9714 48 28 48C39.0286 48 48 39.0286 48 28C48 16.9714 39.0286 8 28 8Z" fill="white"/>
          <Path d="M28 8C16.9714 8 8 16.9714 8 28C8 39.0286 16.9714 48 28 48C39.0286 48 48 39.0286 48 28C48 16.9714 39.0286 8 28 8Z" fill="#FF00A8"/>
          <Rect x="4" width="127" height="56" rx="28" fill="#FF00A8"/>
          <Path d="M30.9884 41.999C29.7432 41.999 28.8092 40.9872 28.8092 39.8198V16.2375C28.8092 14.9922 29.821 14.0582 30.9884 14.0582C32.1559 14.0582 33.1677 15.07 33.1677 16.2375V39.8198C33.1677 40.9872 32.2337 41.999 30.9884 41.999Z" fill="black"/>
          <Path d="M30.9884 41.999C29.7432 41.999 28.8092 40.9872 28.8092 39.8198V16.2375C28.8092 14.9922 29.821 14.0582 30.9884 14.0582C32.1559 14.0582 33.1677 15.07 33.1677 16.2375V39.8198C33.1677 40.9872 32.2337 41.999 30.9884 41.999Z" fill="white"/>
          <Path d="M42.7429 30.1691H19.2384C17.9932 30.1691 17.0592 29.1573 17.0592 27.9898C17.0592 26.8224 18.071 25.8106 19.2384 25.8106H42.8208C44.066 25.8106 45 26.8224 45 27.9898C45 29.1573 43.9882 30.1691 42.7429 30.1691Z" fill="black"/>
          <Path d="M42.7429 30.1691H19.2384C17.9932 30.1691 17.0592 29.1573 17.0592 27.9898C17.0592 26.8224 18.071 25.8106 19.2384 25.8106H42.8208C44.066 25.8106 45 26.8224 45 27.9898C45 29.1573 43.9882 30.1691 42.7429 30.1691Z" fill="white"/>
          <Path d="M66.4521 24H64.2285L58.5244 14.9209V24H56.3008V11.2031H58.5244L64.2461 20.3174V11.2031H66.4521V24ZM73.0615 24.1758C71.708 24.1758 70.6094 23.751 69.7656 22.9014C68.9277 22.0459 68.5088 20.9092 68.5088 19.4912V19.2275C68.5088 18.2783 68.6904 17.4316 69.0537 16.6875C69.4229 15.9375 69.9385 15.3545 70.6006 14.9385C71.2627 14.5225 72.001 14.3145 72.8154 14.3145C74.1104 14.3145 75.1094 14.7275 75.8125 15.5537C76.5215 16.3799 76.876 17.5488 76.876 19.0605V19.9219H70.6621C70.7266 20.707 70.9873 21.3281 71.4443 21.7852C71.9072 22.2422 72.4873 22.4707 73.1846 22.4707C74.1631 22.4707 74.96 22.0752 75.5752 21.2842L76.7266 22.3828C76.3457 22.9512 75.8359 23.3936 75.1973 23.71C74.5645 24.0205 73.8525 24.1758 73.0615 24.1758ZM72.8066 16.0283C72.2207 16.0283 71.7461 16.2334 71.3828 16.6436C71.0254 17.0537 70.7969 17.625 70.6973 18.3574H74.7666V18.1992C74.7197 17.4844 74.5293 16.9453 74.1953 16.582C73.8613 16.2129 73.3984 16.0283 72.8066 16.0283ZM86.8955 21.0557L88.4072 14.4902H90.4902L87.8975 24H86.1396L84.1006 17.4697L82.0967 24H80.3389L77.7373 14.4902H79.8203L81.3584 20.9854L83.3096 14.4902H84.918L86.8955 21.0557ZM59.1836 31.2031L62.875 41.0117L66.5576 31.2031H69.4316V44H67.2168V39.7812L67.4365 34.1387L63.6572 44H62.0664L58.2959 34.1475L58.5156 39.7812V44H56.3008V31.2031H59.1836ZM76.0498 44.1758C74.6963 44.1758 73.5977 43.751 72.7539 42.9014C71.916 42.0459 71.4971 40.9092 71.4971 39.4912V39.2275C71.4971 38.2783 71.6787 37.4316 72.042 36.6875C72.4111 35.9375 72.9268 35.3545 73.5889 34.9385C74.251 34.5225 74.9893 34.3145 75.8037 34.3145C77.0986 34.3145 78.0977 34.7275 78.8008 35.5537C79.5098 36.3799 79.8643 37.5488 79.8643 39.0605V39.9219H73.6504C73.7148 40.707 73.9756 41.3281 74.4326 41.7852C74.8955 42.2422 75.4756 42.4707 76.1729 42.4707C77.1514 42.4707 77.9482 42.0752 78.5635 41.2842L79.7148 42.3828C79.334 42.9512 78.8242 43.3936 78.1855 43.71C77.5527 44.0205 76.8408 44.1758 76.0498 44.1758ZM75.7949 36.0283C75.209 36.0283 74.7344 36.2334 74.3711 36.6436C74.0137 37.0537 73.7852 37.625 73.6855 38.3574H77.7549V38.1992C77.708 37.4844 77.5176 36.9453 77.1836 36.582C76.8496 36.2129 76.3867 36.0283 75.7949 36.0283ZM83.5381 34.4902L83.5996 35.4834C84.2676 34.7041 85.1816 34.3145 86.3418 34.3145C87.6133 34.3145 88.4834 34.8008 88.9521 35.7734C89.6436 34.8008 90.6162 34.3145 91.8701 34.3145C92.9189 34.3145 93.6982 34.6045 94.208 35.1846C94.7236 35.7646 94.9873 36.6201 94.999 37.751V44H92.8633V37.8125C92.8633 37.209 92.7314 36.7666 92.4678 36.4854C92.2041 36.2041 91.7676 36.0635 91.1582 36.0635C90.6719 36.0635 90.2734 36.1953 89.9629 36.459C89.6582 36.7168 89.4443 37.0566 89.3213 37.4785L89.3301 44H87.1943V37.7422C87.165 36.623 86.5938 36.0635 85.4805 36.0635C84.625 36.0635 84.0186 36.4121 83.6611 37.1094V44H81.5254V34.4902H83.5381ZM101.38 44.1758C100.026 44.1758 98.9277 43.751 98.084 42.9014C97.2461 42.0459 96.8271 40.9092 96.8271 39.4912V39.2275C96.8271 38.2783 97.0088 37.4316 97.3721 36.6875C97.7412 35.9375 98.2568 35.3545 98.9189 34.9385C99.5811 34.5225 100.319 34.3145 101.134 34.3145C102.429 34.3145 103.428 34.7275 104.131 35.5537C104.84 36.3799 105.194 37.5488 105.194 39.0605V39.9219H98.9805C99.0449 40.707 99.3057 41.3281 99.7627 41.7852C100.226 42.2422 100.806 42.4707 101.503 42.4707C102.481 42.4707 103.278 42.0752 103.894 41.2842L105.045 42.3828C104.664 42.9512 104.154 43.3936 103.516 43.71C102.883 44.0205 102.171 44.1758 101.38 44.1758ZM101.125 36.0283C100.539 36.0283 100.064 36.2334 99.7012 36.6436C99.3438 37.0537 99.1152 37.625 99.0156 38.3574H103.085V38.1992C103.038 37.4844 102.848 36.9453 102.514 36.582C102.18 36.2129 101.717 36.0283 101.125 36.0283Z" fill="black"/>
          <Path d="M66.4521 24H64.2285L58.5244 14.9209V24H56.3008V11.2031H58.5244L64.2461 20.3174V11.2031H66.4521V24ZM73.0615 24.1758C71.708 24.1758 70.6094 23.751 69.7656 22.9014C68.9277 22.0459 68.5088 20.9092 68.5088 19.4912V19.2275C68.5088 18.2783 68.6904 17.4316 69.0537 16.6875C69.4229 15.9375 69.9385 15.3545 70.6006 14.9385C71.2627 14.5225 72.001 14.3145 72.8154 14.3145C74.1104 14.3145 75.1094 14.7275 75.8125 15.5537C76.5215 16.3799 76.876 17.5488 76.876 19.0605V19.9219H70.6621C70.7266 20.707 70.9873 21.3281 71.4443 21.7852C71.9072 22.2422 72.4873 22.4707 73.1846 22.4707C74.1631 22.4707 74.96 22.0752 75.5752 21.2842L76.7266 22.3828C76.3457 22.9512 75.8359 23.3936 75.1973 23.71C74.5645 24.0205 73.8525 24.1758 73.0615 24.1758ZM72.8066 16.0283C72.2207 16.0283 71.7461 16.2334 71.3828 16.6436C71.0254 17.0537 70.7969 17.625 70.6973 18.3574H74.7666V18.1992C74.7197 17.4844 74.5293 16.9453 74.1953 16.582C73.8613 16.2129 73.3984 16.0283 72.8066 16.0283ZM86.8955 21.0557L88.4072 14.4902H90.4902L87.8975 24H86.1396L84.1006 17.4697L82.0967 24H80.3389L77.7373 14.4902H79.8203L81.3584 20.9854L83.3096 14.4902H84.918L86.8955 21.0557ZM59.1836 31.2031L62.875 41.0117L66.5576 31.2031H69.4316V44H67.2168V39.7812L67.4365 34.1387L63.6572 44H62.0664L58.2959 34.1475L58.5156 39.7812V44H56.3008V31.2031H59.1836ZM76.0498 44.1758C74.6963 44.1758 73.5977 43.751 72.7539 42.9014C71.916 42.0459 71.4971 40.9092 71.4971 39.4912V39.2275C71.4971 38.2783 71.6787 37.4316 72.042 36.6875C72.4111 35.9375 72.9268 35.3545 73.5889 34.9385C74.251 34.5225 74.9893 34.3145 75.8037 34.3145C77.0986 34.3145 78.0977 34.7275 78.8008 35.5537C79.5098 36.3799 79.8643 37.5488 79.8643 39.0605V39.9219H73.6504C73.7148 40.707 73.9756 41.3281 74.4326 41.7852C74.8955 42.2422 75.4756 42.4707 76.1729 42.4707C77.1514 42.4707 77.9482 42.0752 78.5635 41.2842L79.7148 42.3828C79.334 42.9512 78.8242 43.3936 78.1855 43.71C77.5527 44.0205 76.8408 44.1758 76.0498 44.1758ZM75.7949 36.0283C75.209 36.0283 74.7344 36.2334 74.3711 36.6436C74.0137 37.0537 73.7852 37.625 73.6855 38.3574H77.7549V38.1992C77.708 37.4844 77.5176 36.9453 77.1836 36.582C76.8496 36.2129 76.3867 36.0283 75.7949 36.0283ZM83.5381 34.4902L83.5996 35.4834C84.2676 34.7041 85.1816 34.3145 86.3418 34.3145C87.6133 34.3145 88.4834 34.8008 88.9521 35.7734C89.6436 34.8008 90.6162 34.3145 91.8701 34.3145C92.9189 34.3145 93.6982 34.6045 94.208 35.1846C94.7236 35.7646 94.9873 36.6201 94.999 37.751V44H92.8633V37.8125C92.8633 37.209 92.7314 36.7666 92.4678 36.4854C92.2041 36.2041 91.7676 36.0635 91.1582 36.0635C90.6719 36.0635 90.2734 36.1953 89.9629 36.459C89.6582 36.7168 89.4443 37.0566 89.3213 37.4785L89.3301 44H87.1943V37.7422C87.165 36.623 86.5938 36.0635 85.4805 36.0635C84.625 36.0635 84.0186 36.4121 83.6611 37.1094V44H81.5254V34.4902H83.5381ZM101.38 44.1758C100.026 44.1758 98.9277 43.751 98.084 42.9014C97.2461 42.0459 96.8271 40.9092 96.8271 39.4912V39.2275C96.8271 38.2783 97.0088 37.4316 97.3721 36.6875C97.7412 35.9375 98.2568 35.3545 98.9189 34.9385C99.5811 34.5225 100.319 34.3145 101.134 34.3145C102.429 34.3145 103.428 34.7275 104.131 35.5537C104.84 36.3799 105.194 37.5488 105.194 39.0605V39.9219H98.9805C99.0449 40.707 99.3057 41.3281 99.7627 41.7852C100.226 42.2422 100.806 42.4707 101.503 42.4707C102.481 42.4707 103.278 42.0752 103.894 41.2842L105.045 42.3828C104.664 42.9512 104.154 43.3936 103.516 43.71C102.883 44.0205 102.171 44.1758 101.38 44.1758ZM101.125 36.0283C100.539 36.0283 100.064 36.2334 99.7012 36.6436C99.3438 37.0537 99.1152 37.625 99.0156 38.3574H103.085V38.1992C103.038 37.4844 102.848 36.9453 102.514 36.582C102.18 36.2129 101.717 36.0283 101.125 36.0283Z" fill="white"/>
          </G>
          </Svg>
        </TouchableOpacity>

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
          <TouchableOpacity style={{position: 'absolute', right: 10, top: 10}} onPress={() => this.setState({showComments: false, loadingComments: true})}>
            <Svg width="37" height="46" viewBox="0 0 37 46" fill="none" xmlns="http://www.w3.org/2000/svg">
            <G opacity="0.13">
            <Path fill-rule="evenodd" clip-rule="evenodd" d="M28.4359 12.5691C27.5918 11.7251 26.2233 11.7252 25.3791 12.5694L18.2491 19.6994L11.2559 12.7061C10.4118 11.862 9.04327 11.8621 8.1991 12.7063C7.35493 13.5505 7.35482 14.9191 8.19885 15.7631L15.1921 22.7564L8.06335 29.8852C7.21917 30.7293 7.21906 32.0979 8.06309 32.9419C8.90712 33.786 10.2757 33.7859 11.1198 32.9417L18.2486 25.8129L25.2412 32.8055C26.0853 33.6495 27.4538 33.6494 28.298 32.8052C29.1422 31.9611 29.1423 30.5925 28.2983 29.7485L21.3056 22.7559L28.4356 15.6259C29.2798 14.7817 29.2799 13.4132 28.4359 12.5691Z" fill="black"/>
            </G>
          </Svg></TouchableOpacity>
            <FlatList
            data={this.state.comments}
            keyExtractor={(item, idx) => idx}
            renderItem={this.renderComments}
            style={{width: "100%"}}
            ListEmptyComponent={this.state.loadingComments ? this.Loading : this.Empty}
            />
            <View style={{flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', bottom: 0, right: 0, left: 0,
            alignItems: 'center'}}>
            <TextInput
              value={this.state.newcomment}
              placeholder={this.state.replyingTo == 0 ? 'Type a Comment...' : 'Reply To ' + this.state.replyingPerson}
              onChangeText={val => this.setState({newcomment: val})}
              maxLength={100}
              ref={r => this.commentBox = r}
              style={{backgroundColor: '#fff', borderWidth: 0, width: '100%', borderColor: '#fff', flex: 1, padding: 20, fontSize: 15,
            }}
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
      title: '',
      headerStyle: { elevation:0, backgroundColor: params.darktheme ? '#151a30' : '#fff' },
      headerTintColor : params.darktheme ? '#fff' :  '#151a30'
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
      zoomImage: false,
      zoomUri: '',
      language: 'en'
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
         Promise.all(
          responseJson.map(({ images }) => this.fetchImage(images))
        ).then((imageUrls) => { this.setState({ imageUrls })  } );
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
        return <TouchableOpacity onPress={() => this.props.navigation.navigate('Contests')}>
          <Text key={i} style={{fontWeight: 'bold', elevation: 10, zIndex: 10}}>
            {v}</Text>
            </TouchableOpacity>
      }   else{
        return this.state.language == 'en' ? <Text key={i} style={{ elevation: 5, zIndex: 5}}>{v}</Text> : 
        <PowerTranslator text={v} target={this.state.language} style={{ elevation: 5, zIndex: 5}} />
      }
    })
  }
  renderPost = ({item, index}) => (
    <View style={{flex: 1, width: "100%", margin: 0, padding: 0, backgroundColor: 'transparent'}} key={index}>
        <View style={{width: '100%', marginTop: '5%', alignSelf: 'center', alignContent: 'center'}}>
        <View>
          <ListItem
            title={props => <Text style={{ fontSize:18, left: 10, elevation: 5, zIndex: 5, color: this.state.dark ? "white" : 'black'}}>
            {item.user}  {this.state.language == 'en' ? <Text style={{fontSize: 12, elevation: 5, zIndex: 5, color: this.state.dark ? "#f2f2f2" : '#ababab'}}>
              {item.time}</Text> : <PowerTranslator text={item.time} 
            style={{fontSize: 12, elevation: 5, zIndex: 5, color: this.state.dark ? "#f2f2f2" : '#ababab'}} target={this.state.language}/>}
            </Text>}
            accessoryLeft={evaProps => 
              <Avatar size='giant' source={{uri: item.userpic}}/>}
              accessoryRight={evaProps => <View style={{flexDirection: 'row'}}>
                <TouchableOpacity style={{backgroundColor: 'transparent', borderColor: 'transparent', marginHorizontal: 10, alignItems: 'center'}}
                onPress={() => this.setState({showAwards: true, currentAwardUser: item.user})}>
               <Svg width="25" height="25" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
               <G><Path 
               d="M37.7 7.8H31.7759C32.2244 7.0317 32.5 6.1516 32.5 5.2C32.5 0.676 29.2422 0 27.3 0C24.973 0 21.4019 3.1317 19.5 5.9657C17.5981 3.1317 14.027 0 11.7 0C9.7578 0 6.5 0.676 6.5 5.2C6.5 6.1516 6.7756 7.0317 7.2241 7.8H1.3C0.5824 7.8 0 8.3824 0 9.1V16.9C0 17.6176 0.5824 18.2 1.3 18.2H2.6V37.7C2.6 38.4176 3.1824 39 3.9 39H35.1C35.8189 39 36.4 38.4176 36.4 37.7V18.2H37.7C38.4189 18.2 39 17.6176 39 16.9V9.1C39 8.3824 38.4189 7.8 37.7 7.8ZM27.3 2.6C29.4866 2.6 29.9 3.5139 29.9 5.2C29.9 6.6339 28.7339 7.8 27.3 7.8H21.3408C22.6278 5.759 25.8661 2.6 27.3 2.6ZM22.1 15.6H16.9V10.4H19.5H22.1V15.6ZM9.1 5.2C9.1 3.5139 9.5147 2.6 11.7 2.6C13.1339 2.6 16.3722 5.759 17.6579 7.8H11.7C10.2661 7.8 9.1 6.6339 9.1 5.2ZM2.6 10.4H14.3V15.6H2.6V10.4ZM5.2 18.2H14.3V36.4H5.2V18.2ZM16.9 36.4V18.2H22.1V36.4H16.9ZM33.8 36.4H24.7V18.2H33.8V36.4ZM36.4 15.6H24.7V10.4H36.4V15.6Z"
               fill={this.state.dark ?'white' : 'black'}/></G>
               </Svg>
           </TouchableOpacity>
           <TouchableOpacity style={{marginHorizontal: 10}} onPress={() => this.setState({moreOptions: true})}>
             <EnIcon name="dots-three-horizontal" size={33} color={this.state.dark ? 'white' : 'black'}/>
           </TouchableOpacity></View>}
            onPress={() => this.props.navigation.navigate('Profile', {user: item.user, dark: this.state.dark })}
            style={{backgroundColor: 'transparent', elevation: 5, zIndex: 5}}
          />
        </View>
        <View style={{ width: '90%', alignSelf: 'center', marginBottom: 10}}>
          <Text>{this.formatText(item.text)}</Text>
        </View>
        <View style={{ borderRadius: 5, padding: 0}}>
        {item.remixUri ? 
        this.state.imageUrls[index] && this.state.imageUrls[index].length
          ? this.state.imageUrls[index].map((uri) => (
        <Carousel
              data={[
                {uri: item.remixUri},
                {uri: uri},
              ]}
              renderItem={({item, idx}) => (
                <TouchableWithoutFeedback onPress={() => 
                  this.setState({zoomImage: true, zoomUri: item.uri})}>
                  <NativeImage
                  source={{uri: item.uri}}
                  style={{width: '95%', height: (Dimensions.get('window').height * 50) / 100, marginLeft: '2.5%'}}
                  loadingIndicatorSource={{uri: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/f1055231234507.564a1d234bfb6.gif', priority: 'high'}}
                /></TouchableWithoutFeedback>
              )}
              sliderWidth={Dimensions.get('window').width}
              itemWidth={Dimensions.get('screen').width}
              layout={'stack'} layoutCardOffset={`18`}
              firstItem={1}
              inactiveSlideOpacity={1}
            />
          )) : null
        :
        this.state.imageUrls[index] && this.state.imageUrls[index].length
          ? this.state.imageUrls[index].map((uri) => (
            <Image
              source={{uri: uri}}
              style={{width: '95%', height: (Dimensions.get('window').height * 50) / 100, alignSelf: 'center',
               marginBottom: 0, marginLeft: '2.5%', borderRadius: 10  }}
               containerStyle={{borderRadius: 10}}
              onPress={() => this.setState({zoomImage: true, zoomUri: uri})}
              PlaceholderContent={<FastImage source={{uri: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/f1055231234507.564a1d234bfb6.gif', priority: 'high'}} style={{alignSelf: 'center', marginTop: "40%", width: 100, height: 100}} />}
             />
            ))
          : <FastImage source={{uri: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/f1055231234507.564a1d234bfb6.gif', priority: 'high'}} style={{alignSelf: 'center', marginTop: "40%", width: 100, height: 100}} />

         }  
        </View>
       </View>
       <View style={{ alignSelf: 'flex-end', flexDirection: 'row', borderWidth: 0, marginTop: 20}}>
        <TouchableOpacity style={{ borderColor: 'transparent', borderRadius: 30, marginHorizontal: 10}}
          onPress={() => this.lovePosts(item.id, item.user)}> 
             {item.isliked ? <Svg width="35" height="31" viewBox="0 0 391.837 391.837" fill="none" xmlns="http://www.w3.org/2000/svg">
             <Path fill="#FF007A" d="M285.257,35.528c58.743,0.286,106.294,47.836,106.58,106.58
             c0,107.624-195.918,214.204-195.918,214.204S0,248.165,0,142.108c0-58.862,47.717-106.58,106.58-106.58l0,0
             c36.032-0.281,69.718,17.842,89.339,48.065C215.674,53.517,249.273,35.441,285.257,35.528z"/>
             </Svg> : 
             <Svg width="40" height="40" viewBox="0 0 35 31" fill="none" xmlns="http://www.w3.org/2000/svg">
              <Path fill-rule="evenodd" clip-rule="evenodd" d="M17.5 24L17.0666 23.6604C7.57162 16.219 5 13.5995 5 9.34448C5 5.84613 7.95777 3 11.5933 3C14.6316 3 16.3489 4.66036 17.5 5.90936C18.6511 4.66036 20.3684 3 23.4067 3C27.0422 3 30 5.84613 30 9.34448C30 13.5995 27.4284 16.219 17.9334 23.6604L17.5 24ZM11.5933 4.32147C8.7153 4.32147 6.3733 6.57507 6.3733 9.34448C6.3733 12.9899 8.75738 15.4268 17.5 22.2949C26.2426 15.4268 28.6267 12.9899 28.6267 9.34448C28.6267 6.57507 26.2847 4.32147 23.4067 4.32147C20.7708 4.32147 19.3953 5.83121 18.2908 7.04469L17.5 7.89938L16.7092 7.04469C15.6047 5.83121 14.2292 4.32147 11.5933 4.32147Z" fill="black"/>
                <Path fill-rule="evenodd" clip-rule="evenodd" d="M17.5 24L17.0666 23.6604C7.57162 16.219 5 13.5995 5 9.34448C5 5.84613 7.95777 3 11.5933 3C14.6316 3 16.3489 4.66036 17.5 5.90936C18.6511 4.66036 20.3684 3 23.4067 3C27.0422 3 30 5.84613 30 9.34448C30 13.5995 27.4284 16.219 17.9334 23.6604L17.5 24ZM11.5933 4.32147C8.7153 4.32147 6.3733 6.57507 6.3733 9.34448C6.3733 12.9899 8.75738 15.4268 17.5 22.2949C26.2426 15.4268 28.6267 12.9899 28.6267 9.34448C28.6267 6.57507 26.2847 4.32147 23.4067 4.32147C20.7708 4.32147 19.3953 5.83121 18.2908 7.04469L17.5 7.89938L16.7092 7.04469C15.6047 5.83121 14.2292 4.32147 11.5933 4.32147Z" fill="white" />
                <Path fill-rule="evenodd" clip-rule="evenodd" d="M17.5 24L17.0666 23.6604C7.57162 16.219 5 13.5995 5 9.34448C5 5.84613 7.95777 3 11.5933 3C14.6316 3 16.3489 4.66036 17.5 5.90936C18.6511 4.66036 20.3684 3 23.4067 3C27.0422 3 30 5.84613 30 9.34448C30 13.5995 27.4284 16.219 17.9334 23.6604L17.5 24ZM11.5933 4.32147C8.7153 4.32147 6.3733 6.57507 6.3733 9.34448C6.3733 12.9899 8.75738 15.4268 17.5 22.2949C26.2426 15.4268 28.6267 12.9899 28.6267 9.34448C28.6267 6.57507 26.2847 4.32147 23.4067 4.32147C20.7708 4.32147 19.3953 5.83121 18.2908 7.04469L17.5 7.89938L16.7092 7.04469C15.6047 5.83121 14.2292 4.32147 11.5933 4.32147Z" fill="#FF007A"/>
                <Path d="M17.3458 24.1968L17.5 24.3176L17.6542 24.1968L18.0876 23.8572L18.0876 23.8572C22.8312 20.1395 25.868 17.6095 27.7165 15.471C29.5785 13.3167 30.25 11.5419 30.25 9.34448C30.25 5.69908 27.1712 2.75 23.4067 2.75C20.4206 2.75 18.665 4.30564 17.5 5.54248C16.335 4.30564 14.5794 2.75 11.5933 2.75C7.82885 2.75 4.75 5.69908 4.75 9.34448C4.75 11.5419 5.4215 13.3167 7.28354 15.471C9.13199 17.6095 12.1688 20.1395 16.9124 23.8572L16.9124 23.8572L17.3458 24.1968ZM18.4743 7.21447L18.4743 7.21448L18.4756 7.21298C19.5795 6.00021 20.8891 4.57147 23.4067 4.57147C26.1558 4.57147 28.3767 6.72212 28.3767 9.34448C28.3767 11.0926 27.813 12.5568 26.154 14.4462C24.5028 16.3268 21.7855 18.6069 17.5 21.9769C13.2145 18.6069 10.4972 16.3268 8.84603 14.4462C7.18704 12.5568 6.6233 11.0926 6.6233 9.34448C6.6233 6.72212 8.84422 4.57147 11.5933 4.57147C14.1109 4.57147 15.4205 6.00021 16.5244 7.21298L16.5244 7.21298L16.5257 7.21447L17.3165 8.06916L17.5 8.26751L17.6835 8.06916L18.4743 7.21447Z" 
                stroke="#FF007A" stroke-width="0.5"/> 
              </Svg>}
          <Text style={{textAlign: 'center', color: this.state.dark ? "white" : 'black', }}>{item.loves}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{backgroundColor: 'transparent', borderColor: 'transparent', marginHorizontal: 10}}
        onPress={() => {
          this.state.imageUrls[index] && this.state.imageUrls[index].length
          ? this.state.imageUrls[index].map((uri) => (
            this.props.navigation.navigate('Create', {mixContent: uri, dark: this.state.dark, user: this.state.user})
          )) : ToastAndroid.show('Please Try Again', ToastAndroid.SHORT)
        }}>
           <Svg width="43" height="40" viewBox="0 0 33 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <G filter="url(#filter0_d)">
            <Path fill-rule="evenodd" clip-rule="evenodd" d="M23.8796 8.62612L23.8187 8.62724C23.6728 8.63125 23.5277 8.64666 23.3844 8.67472C22.8885 8.77189 22.4301 9.00929 22.0163 9.29278C21.9374 9.34684 21.8598 9.40284 21.7835 9.46045C21.3394 9.79548 20.9355 10.1819 20.5543 10.586C20.0978 11.0701 19.6727 11.5831 19.2611 12.1056L18.6839 12.8614L18.4115 13.218C18.0089 13.7582 17.6105 14.3016 17.2086 14.8423C16.9081 15.2453 16.6056 15.6469 16.2959 16.0429L16.0514 16.3461L15.5807 16.9296C15.3977 17.1485 15.2115 17.3647 15.0212 17.5772C14.8732 17.7425 14.7227 17.9057 14.5693 18.066C13.6638 19.0127 12.6477 19.8768 11.4739 20.4725C11.3267 20.5472 11.1773 20.6174 11.0259 20.683C10.8263 20.7693 10.6231 20.8473 10.4169 20.9161C10.1419 21.0078 9.86138 21.0832 9.57723 21.1407C9.30377 21.1961 9.02698 21.2348 8.74882 21.2565C8.6074 21.2675 8.46577 21.2736 8.32396 21.2763C8.27244 21.2769 8.27255 21.277 8.22097 21.2772C8.22097 21.2772 5.76861 21.2772 4.60241 21.2772C4.44264 21.2772 4.28942 21.2137 4.17644 21.1007C4.06347 20.9877 4 20.8345 4 20.6747C4 19.8737 4 18.4658 4 17.6641C4 17.504 4.06371 17.3505 4.17706 17.2375C4.29042 17.1245 4.4441 17.0612 4.60417 17.0617C5.8307 17.0668 7.04957 17.0835 8.27887 17.0595C8.3197 17.0584 8.36045 17.0565 8.4012 17.0538C8.52206 17.0449 8.6421 17.0284 8.76072 17.0035C9.26512 16.8975 9.73031 16.6512 10.1505 16.359C10.2467 16.2921 10.341 16.2224 10.4335 16.1505C10.8813 15.8022 11.2892 15.4043 11.6747 14.9891C12.1325 14.496 12.5597 13.9752 12.974 13.4454L13.4202 12.8568L13.9338 12.1794C14.263 11.7348 14.5909 11.2892 14.9208 10.8451C15.2208 10.4425 15.5226 10.0413 15.8315 9.64545L16.0534 9.37059L16.6055 8.68658C16.7885 8.46849 16.9748 8.25315 17.1653 8.04155C17.3135 7.87699 17.4641 7.71467 17.6177 7.55516C18.5244 6.61328 19.5436 5.75586 20.721 5.17244C20.8687 5.09923 21.0186 5.0305 21.1707 4.96665C21.371 4.88248 21.575 4.8068 21.782 4.7405C22.0581 4.65208 22.3395 4.58034 22.6244 4.52675C23.037 4.44913 23.4556 4.41129 23.8754 4.40964H23.8796V2L29 6.51808L23.8796 11.0362V8.62613L23.8796 8.62612ZM23.8796 17.0603V14.6506L29.0001 19.1687L23.8796 23.6868V21.2772H23.8755C23.4548 21.2755 23.0354 21.2378 22.6219 21.1604C22.3363 21.107 22.0543 21.0354 21.7775 20.9472C21.57 20.881 21.3655 20.8055 21.1645 20.7215C21.0121 20.6577 20.8617 20.5891 20.7135 20.516C19.5612 19.9476 18.5588 19.1173 17.6656 18.2021C17.5107 18.0434 17.3588 17.8817 17.2095 17.7177L16.8367 17.2927L17.245 16.7851C17.5606 16.3815 17.8688 15.9724 18.175 15.5618C18.5412 15.0691 18.9046 14.5742 19.2707 14.0814L19.4513 13.8496C19.8504 14.3447 20.2523 14.8149 20.6837 15.257C21.0485 15.6309 21.4353 15.9868 21.8589 16.2935C22.3133 16.6226 22.822 16.9033 23.3778 17.0117C23.5365 17.0426 23.6974 17.0583 23.859 17.0602L23.8796 17.0603L23.8796 17.0603ZM12.653 11.8696L11.9073 10.9784C11.4749 10.4903 11.0173 10.0199 10.5093 9.6098C10.4164 9.53478 10.3217 9.46191 10.2251 9.39175C10.1494 9.33676 10.0724 9.28343 9.99415 9.23209C9.58736 8.96532 9.13797 8.74715 8.65522 8.66402C8.51709 8.64024 8.37748 8.62826 8.23736 8.62662L8.21277 8.62652C8.21277 8.62652 5.76683 8.62652 4.60244 8.62652C4.26974 8.62652 4.00003 8.35681 4.00003 8.02411C4.00003 7.22248 4.00003 5.81327 4.00003 5.01179C4.00003 4.67922 4.26953 4.40957 4.6021 4.40938C5.82485 4.40836 7.04761 4.40506 8.27035 4.40985C8.32368 4.41048 8.37695 4.41152 8.43026 4.41298C8.57133 4.41795 8.71217 4.4262 8.85273 4.43941C9.12919 4.46539 9.40401 4.50842 9.67525 4.56782C9.94069 4.62595 10.2027 4.69975 10.4597 4.78789C10.6646 4.85819 10.8665 4.93759 11.0647 5.02522C11.23 5.09834 11.3928 5.17717 11.5529 5.26117C12.6304 5.82646 13.573 6.61796 14.4186 7.48621C14.5731 7.64492 14.7247 7.80653 14.8737 7.97046L15.2689 8.42177L14.8818 8.9042C14.5671 9.30731 14.2597 9.71593 13.9542 10.1259C13.5886 10.6181 13.2257 11.1124 12.8599 11.6045L12.653 11.8696L12.653 11.8696Z" fill="white"/>
            <Path fill-rule="evenodd" clip-rule="evenodd" d="M23.8796 8.62612L23.8187 8.62724C23.6728 8.63125 23.5277 8.64666 23.3844 8.67472C22.8885 8.77189 22.4301 9.00929 22.0163 9.29278C21.9374 9.34684 21.8598 9.40284 21.7835 9.46045C21.3394 9.79548 20.9355 10.1819 20.5543 10.586C20.0978 11.0701 19.6727 11.5831 19.2611 12.1056L18.6839 12.8614L18.4115 13.218C18.0089 13.7582 17.6105 14.3016 17.2086 14.8423C16.9081 15.2453 16.6056 15.6469 16.2959 16.0429L16.0514 16.3461L15.5807 16.9296C15.3977 17.1485 15.2115 17.3647 15.0212 17.5772C14.8732 17.7425 14.7227 17.9057 14.5693 18.066C13.6638 19.0127 12.6477 19.8768 11.4739 20.4725C11.3267 20.5472 11.1773 20.6174 11.0259 20.683C10.8263 20.7693 10.6231 20.8473 10.4169 20.9161C10.1419 21.0078 9.86138 21.0832 9.57723 21.1407C9.30377 21.1961 9.02698 21.2348 8.74882 21.2565C8.6074 21.2675 8.46577 21.2736 8.32396 21.2763C8.27244 21.2769 8.27255 21.277 8.22097 21.2772C8.22097 21.2772 5.76861 21.2772 4.60241 21.2772C4.44264 21.2772 4.28942 21.2137 4.17644 21.1007C4.06347 20.9877 4 20.8345 4 20.6747C4 19.8737 4 18.4658 4 17.6641C4 17.504 4.06371 17.3505 4.17706 17.2375C4.29042 17.1245 4.4441 17.0612 4.60417 17.0617C5.8307 17.0668 7.04957 17.0835 8.27887 17.0595C8.3197 17.0584 8.36045 17.0565 8.4012 17.0538C8.52206 17.0449 8.6421 17.0284 8.76072 17.0035C9.26512 16.8975 9.73031 16.6512 10.1505 16.359C10.2467 16.2921 10.341 16.2224 10.4335 16.1505C10.8813 15.8022 11.2892 15.4043 11.6747 14.9891C12.1325 14.496 12.5597 13.9752 12.974 13.4454L13.4202 12.8568L13.9338 12.1794C14.263 11.7348 14.5909 11.2892 14.9208 10.8451C15.2208 10.4425 15.5226 10.0413 15.8315 9.64545L16.0534 9.37059L16.6055 8.68658C16.7885 8.46849 16.9748 8.25315 17.1653 8.04155C17.3135 7.87699 17.4641 7.71467 17.6177 7.55516C18.5244 6.61328 19.5436 5.75586 20.721 5.17244C20.8687 5.09923 21.0186 5.0305 21.1707 4.96665C21.371 4.88248 21.575 4.8068 21.782 4.7405C22.0581 4.65208 22.3395 4.58034 22.6244 4.52675C23.037 4.44913 23.4556 4.41129 23.8754 4.40964H23.8796V2L29 6.51808L23.8796 11.0362V8.62613L23.8796 8.62612ZM23.8796 17.0603V14.6506L29.0001 19.1687L23.8796 23.6868V21.2772H23.8755C23.4548 21.2755 23.0354 21.2378 22.6219 21.1604C22.3363 21.107 22.0543 21.0354 21.7775 20.9472C21.57 20.881 21.3655 20.8055 21.1645 20.7215C21.0121 20.6577 20.8617 20.5891 20.7135 20.516C19.5612 19.9476 18.5588 19.1173 17.6656 18.2021C17.5107 18.0434 17.3588 17.8817 17.2095 17.7177L16.8367 17.2927L17.245 16.7851C17.5606 16.3815 17.8688 15.9724 18.175 15.5618C18.5412 15.0691 18.9046 14.5742 19.2707 14.0814L19.4513 13.8496C19.8504 14.3447 20.2523 14.8149 20.6837 15.257C21.0485 15.6309 21.4353 15.9868 21.8589 16.2935C22.3133 16.6226 22.822 16.9033 23.3778 17.0117C23.5365 17.0426 23.6974 17.0583 23.859 17.0602L23.8796 17.0603L23.8796 17.0603ZM12.653 11.8696L11.9073 10.9784C11.4749 10.4903 11.0173 10.0199 10.5093 9.6098C10.4164 9.53478 10.3217 9.46191 10.2251 9.39175C10.1494 9.33676 10.0724 9.28343 9.99415 9.23209C9.58736 8.96532 9.13797 8.74715 8.65522 8.66402C8.51709 8.64024 8.37748 8.62826 8.23736 8.62662L8.21277 8.62652C8.21277 8.62652 5.76683 8.62652 4.60244 8.62652C4.26974 8.62652 4.00003 8.35681 4.00003 8.02411C4.00003 7.22248 4.00003 5.81327 4.00003 5.01179C4.00003 4.67922 4.26953 4.40957 4.6021 4.40938C5.82485 4.40836 7.04761 4.40506 8.27035 4.40985C8.32368 4.41048 8.37695 4.41152 8.43026 4.41298C8.57133 4.41795 8.71217 4.4262 8.85273 4.43941C9.12919 4.46539 9.40401 4.50842 9.67525 4.56782C9.94069 4.62595 10.2027 4.69975 10.4597 4.78789C10.6646 4.85819 10.8665 4.93759 11.0647 5.02522C11.23 5.09834 11.3928 5.17717 11.5529 5.26117C12.6304 5.82646 13.573 6.61796 14.4186 7.48621C14.5731 7.64492 14.7247 7.80653 14.8737 7.97046L15.2689 8.42177L14.8818 8.9042C14.5671 9.30731 14.2597 9.71593 13.9542 10.1259C13.5886 10.6181 13.2257 11.1124 12.8599 11.6045L12.653 11.8696L12.653 11.8696Z" fill="#00E0FF"/>
            </G>
            </Svg>
        </TouchableOpacity>
        <TouchableOpacity style={{backgroundColor: 'transparent', borderColor: 'transparent', marginHorizontal: 10}}
        onPress={() => {
          this.state.imageUrls[index] && this.state.imageUrls[index].length
          ? this.state.imageUrls[index].map((uri) => (
            Share.share({
              message:
              'Check the Awesome Meme in Meme app ' + uri,
            })
          )) : null
        }}>
           <Svg width="40" height="37" viewBox="0 0 35 33" fill="none" xmlns="http://www.w3.org/2000/svg">
            <G filter="url(#filter0_d)">
            <Path d="M19.6712 10.335V5L29.0073 14.3362L19.6712 23.6723V18.204C13.0025 18.204 8.33437 20.338 5.00002 25.0061C6.33376 18.3374 10.335 11.6687 19.6712 10.335Z" stroke="white" stroke-width="2"/>
            <Path d="M19.6712 10.335V5L29.0073 14.3362L19.6712 23.6723V18.204C13.0025 18.204 8.33437 20.338 5.00002 25.0061C6.33376 18.3374 10.335 11.6687 19.6712 10.335Z" stroke="#FFF500" stroke-width="2"/>
            <Path d="M19.6712 10.335V5L29.0073 14.3362L19.6712 23.6723V18.204C13.0025 18.204 8.33437 20.338 5.00002 25.0061C6.33376 18.3374 10.335 11.6687 19.6712 10.335Z" stroke="#8000FF" stroke-width="2"/>
            </G>
            </Svg>
        </TouchableOpacity>
        </View>
      </View>
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
   renderComments = ({item, idx}) => (
    parseInt(item.replyId) > 0 ? null :
      <> 
      <Text style={{fontWeight: 'bold', marginLeft : 5,
       color: '#6D6D6D'}}>{item.user} {this.state.language == 'en' ? <Text style={{color: '#BABABA', fontSize: 12, fontWeight: 'normal'}}>
         {item.time}</Text> : <PowerTranslator style={{color: '#BABABA', fontSize: 12, fontWeight: 'normal'}} text={item.time} target={this.state.language}  />}</Text>
      
      <TouchableOpacity onPress={() => {
        this.setState({replyingTo: parseInt(item.id), replyingPerson: item.user})
        this.commentBox.focus()
      }} >
      <View style={{flexDirection :'row', marginVertical: 10, backgroundColor: '#fff', borderRadius: 30, alignSelf: 'flex-start',
       maxWidth: '95%'}}>
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
                <Text style={{marginHorizontal: 10}}>{this.state.language == 'en' ? 
                <Text style={{elevation: 6, zIndex: 6, textAlign: 'left'}}>
                  {itm.text} <Text style={{color: '#BABABA', fontSize: 12, fontWeight: 'normal'}}>{itm.time}</Text>
                </Text> 
                : <PowerTranslator text={itm.text} style={{elevation: 6, zIndex: 6, color: this.state.dark ? 'white' : 'black'}} target={this.state.language} />}</Text>
                  </View>}

             </View>
            }
          })}
      </View> : null}
      </>
  )
  Empty(){
    return (
          <Layout style={{justifyContent: 'center', flex: 1}}>
          <ScaledImage uri='https://static.wixstatic.com/media/bf112e_439a048dd6e645c28c76882795d06735~mv2.gif'
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
  render(){
    const { params } = this.props.navigation.state
    const id = params ? params.id : null 

    if(this.state.loading){
      return(
        <ApplicationProvider
    {...eva}
    theme={this.state.dark ? eva.dark : eva.light }>
      
        <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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
    theme={this.state.dark ? eva.dark : eva.light}>
        <Layout style={{flex: 1}}>
          <ScrollView style={{  flex: 1 }}>
        <FlatList
            data={this.state.data}
            keyExtractor={(item, idx) => idx}
            renderItem={this.renderPost}
          />
          
          <Layout style={{ width: "100%", justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F0F0', alignSelf:'center',
          padding: 10, marginTop: 20}}>
            {this.state.comments ? 
            <FlatList
            data={this.state.comments}
            keyExtractor={(item, idx) => idx}
            renderItem={this.renderComments}
            style={{width: "100%", alignSelf: 'center'}}
            ListEmptyComponent={this.Empty}
            /> : null}
             <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', left: 0, right: 0}}>
            <TextInput
              value={this.state.newcomment}
              placeholder='Type a Comment...'
              onChangeText={val => this.setState({newcomment: val})}
              maxLength={100}
              ref={r => this.commentBox = r}
              style={{backgroundColor: '#fff', borderWidth: 0, width: '100%', borderColor: '#fff', flex: 1, padding: 20, fontSize: 15,
            }}
            />
            { this.state.newcomment ?
                <TouchableOpacity onPress={() => {
                  if(this.state.newcomment){
                        this.socket.emit('newComment', {
                          lid: id,
                          user: this.state.user,
                          text: this.state.newcomment,
                          url: '',
                          to: this.state.data[0].user
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
                        lid: id,
                        user: this.state.user,
                        text: '',
                        image: selectedMedia.images.downsized.url,
                        to: this.state.data[0].user
                      })
                    }
                  )
                }} >
                <EnIcon name="emoji-happy" size={35} color='#ABABAB'/>
                </TouchableOpacity>}
            </View>
          </Layout>
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
            textStyle={{fontSize: 25, textAlign: 'center'}} accessoryRight={props =><Svg width="20" height="15" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M19.1358 4.50423L9.87037 12.9787L0.604947 4.50423L3.37217 0.459825H16.3686L19.1358 4.50423Z" fill="#ED0063" stroke="#ED0063" stroke-width="0.91965"/>
            </Svg>}/>
            <Button onPress={() => this.award()} style={{backgroundColor: '#F10063', borderRadius: 20, borderColor: 'white'}}>Award Gems</Button>     
          </Layout>
        </Overlay>  
        <Overlay visible={this.state.zoomImage} transparent={true}
        onDismiss={() => {
          this.setState({zoomImage: !this.state.zoomImage})
        }}
        onBackdropPress={() => {
          this.setState({zoomImage: !this.state.zoomImage})
        }} overlayStyle={{position: 'absolute', width: Dimensions.get('window').width, height: Dimensions.get('window').height}}>
            <ImageViewer imageUrls={[{url: this.state.zoomUri}]}/>
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
           <Input placeholder="Let us know what is wrong" maxLength={100} textStyle={{minHeight: 60}}
           multiline={true}  onChangeText={val => this.setState({reportReason: val})} />
           <Button status="danger" style={{margin: 10, alignSelf: 'flex-end'}}
           onPress={() => this.reportPost()}>Report</Button>
          </Layout>
          </Overlay>

          </ScrollView>
          {this.state.showLoves ? <FastImage source={{uri: 'https://media0.giphy.com/media/3oKIPqM8BJ0ofNQOzK/giphy.gif?cid=ecf05e47t2sbc7eivk8udcfb8szs557jx17bl9t3atewvoe4&rid=giphy.gif', 
          priority: FastImage.priority.high,}} style={{
            width:465, height: 465, position: 'absolute', bottom: 10, alignSelf: 'center'
          }} /> : null}
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
class Notifications extends React.Component{

  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      title: 'Notifications',
      headerTitleStyle: { textAlign: 'center', color: params.darktheme ? 'white' : 'black', fontSize: 22},
      headerTintColor: params.darktheme ? 'white' : 'black',
      headerStyle: { elevation:0, backgroundColor: params.darktheme ? '#151a30' : 'white' }
    };
  };

  state = {
    loading: true,
    dark: false,
    data: []
  }
  componentDidMount(){
    const { params } = this.props.navigation.state
    const user = params ? params.user : null
    const dark = params ? params.dark : null

    this.setState({dark: dark})
    this.props.navigation.setParams({darktheme: dark})

    this.fetch(user)
    this.props.navigation.setParams({darktheme: this.state.dark})
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
  fetch(user){
    fetch('https://lishup.com/app/notifications.php', {
         method: 'POST',
         headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: user
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
         this.setState({
            data: responseJson,
            loading: false
         })
      });
  }
  Divider(){
    return(
      <Divider />
    )
  }
  title(txt){
    if(txt.substring(0, 36) == '<i class="fa fa-comments"></i>      '){
      return <Text style={{fontSize: 16}}>{txt.substring(36, txt.length)}</Text>
    }else{
      return <Text style={{fontSize: 16}}>{txt}</Text>
    }
  }
  right(props, txt){
      if(txt.substring(txt.length - 17, txt.length) == "Loved your Leash!"){
        return <Icon {...props} name="heart" color="red" size={20} />
      }else if(txt.substring(txt.length - 23, txt.length) == " Mentioned You in his Reaction to this Leash!"){
        return <Icon {...props} name="at" color={this.state.dark ? '#fff' : '#000'} size={20} />
      }else if(txt.substring(0, 36) == '<i class="fa fa-comments"></i>      '){
        return <Icon {...props} name="at" color={this.state.dark ? '#fff' : '#000'} size={20} />
      }else if(txt.substring(txt.length - 16, txt.length) == "Loved your Post!"){
        return <Icon {...props} name="heart" color="red" size={20} />
      }else if(txt.substring(txt.length - 5, txt.length) == "Gems!"){
        return <Svg width="20" height="15" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Path d="M19.1358 4.50423L9.87037 12.9787L0.604947 4.50423L3.37217 0.459825H16.3686L19.1358 4.50423Z" fill="#ED0063" stroke="#ED0063" stroke-width="0.91965"/>
        </Svg>
      }else{
        return <Icon {...props} name="eye" color={this.state.dark ? '#fff' : '#4DA6FF'} size={20} />
      }
  }
  navigate(txt, extra){
    if(txt.substring(txt.length - 17, txt.length) == "Loved your Leash!" || txt.substring(txt.length - 17, txt.length) == "Loved your Post!"){
      this.props.navigation.navigate('ViewPost', {id: extra.substring(6, extra.length), dark: this.state.dark })
    }else if(txt.substring(txt.length - 23, txt.length) == " Mentioned You in his Reaction to this Leash!"){
      this.props.navigation.navigate('ViewPost', {id: extra, dark: this.state.dark })
    }else if(txt.substring(0, 36) == '<i class="fa fa-comments"></i>      '){
      this.props.navigation.navigate('ViewPost', {id: extra, dark: this.state.dark })
    }else  if(txt.substring(txt.length - 23, txt.length) == " Started Following You!"){
      this.props.navigation.navigate('Profile', {user: txt.substring(0, txt.length - 23), dark: this.state.dark })
    }else if(txt.substring(txt.length - 16, txt.length) == "Loved your Post!"){
      this.props.navigation.navigate('ViewPost', {id: extra.substring(6, extra.length), dark: this.state.dark })
    }
  }
  renderItem = ({item}) => (
    <ListItem
      title={this.title(item.text)}
      description={item.time}
      onPress={() => this.navigate(item.text, item.extra)}
      accessoryLeft={props => <Avatar source={{uri: item.avatar}} size="giant" />}
      accessoryRight={props => this.right(props, item.text)}
    />
  )
 render(){
  if(this.state.loading){
    return(
      <ApplicationProvider
  {...eva}
  theme={this.state.dark ? eva.dark : eva.light }>
      <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: this.state.dark ? '#151a30' : 'white' }}>
        <FastImage source={{uri: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/35771931234507.564a1d2403b3a.gif', 
        priority: FastImage.priority.high,}} style={{
          width: 100, height: 100
        }}/>
        </Layout>
    </ApplicationProvider>
    )
  }else{
   return(
    <ApplicationProvider
    {...eva}
    theme={this.state.dark ? eva.dark : eva.light}>
       <Layout style={{  flex: 1, alignContent: 'center', backgroundColor: this.state.dark ? '#151a30' : 'white' }}>
       <List
          data={this.state.data}
          ItemSeparatorComponent={this.Divider}
          renderItem={this.renderItem}
          refreshControl={<RefreshControl refreshing={this.state.loading} onRefresh={() => {
            const { params } = this.props.navigation.state
            const user = params ? params.user : null

            this.fetch(user)
            this.setState({data: [], loading: true})
          } } />}
        />
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
          this.setState({images: [...this.state.images, this.state.showPhotosFrom == 'templates' ? item.url : item.node.image.uri], numImages: this.state.numImages + 1})
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
                  remixed: this.state.remixUri }),
                  
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
            style={{ flex: 1, backgroundColor: 'transparent', zIndex: this.state.isResizing ? -10 : -2 }}
            strokeColor={this.state.strokeColor}
            strokeWidth={this.state.strokeWidth}
            ref={ref => this.canvas = ref}
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
              centerPress={() => this.setState({showTextTools: true, editingTextID: item.id, currentTextColor: item.FontColor,
               currentBGColor: item.BackgroundColor })}
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
      <Icon name="brush" size={30} color={this.state.showDrawTools ? "#45DAFF" : "white"} onPress={() => this.setState({showDrawTools: true, 
        showTextTools: false, showStickerTools: false, isResizing: false}) }/>
      {this.state.showDrawTools ? <TouchableOpacity onPress={() => this.setState({showDrawTools: false}) } 
       style={{backgroundColor: '#05FF00', padding: 3, height: 42, borderRadius: 20, marginTop: 2}}>
        <Icon size={35} name="md-checkmark-done" color="white"  /></TouchableOpacity> : null} 
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
           autoFocus={true} multiline={true} />
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
          onPress={() => this.setState({showTextTools: false})}><NativeText style={{color: 'white', fontSize: 25}}>Done</NativeText></TouchableOpacity>
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
    style={{marginHorizontal: 10, top:50, elevation: 50, zIndex: 50, right: 30,  position: 'absolute'}}
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
      <View style={{top:50, elevation: 50, zIndex: 50, right: 30,  position: 'absolute', flexDirection: 'row'}}>
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
          <NativeText style={{color: 'white', top: 20, textAlign: 'center', fontSize: 25, fontFamily: 'impact', marginBottom: 50}}>Share</NativeText>
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
      <NativeImage source={{uri: this.state.meme}} style={{height: '50%', width: '99%', alignSelf: 'center',
        marginTop: 0}} resizeMode="contain" /> 
      <TouchableOpacity style={{backgroundColor: '#00BBFF', padding: 10, flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: 25, borderRadius: 15, marginTop: 10, alignSelf: 'center'}} 
          onPress={() => this.props.navigation.navigate('Profile', {
            user: this.state.user,
            dark: this.state.dark
          })}>
            <Icon name="eye" size={25} color="white" />  
     <NativeText style={{color: 'white', fontSize: 25, marginLeft: 5}}>View Post</NativeText></TouchableOpacity>
     <TouchableOpacity style={{backgroundColor: '#5200FF', padding: 10, 
     flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25, borderRadius: 15, marginTop: 10, alignSelf: 'center'}} 
          onPress={() => {Clipboard.setString(this.state.meme)
          ToastAndroid.show('Link to Meme Copied', ToastAndroid.SHORT)}}>   
          <Icon name="copy" size={25} color="white" />            
     <NativeText style={{color: 'white', fontSize: 25, marginLeft: 5}}>Copy Link</NativeText></TouchableOpacity>
    
     <View style={{flexDirection: 'row', marginTop: 20, alignContent: 'center', alignItems: 'center', justifyContent: 'center'}}>
      <SwitchWithIcons value={this.state.joinedContest|| this.state.showConfirmation} 
      onValueChange={val => {
        this.fetchContests()
        this.setState({showConfirmation: true})
      }} thumbColor={{true: 'white', false: 'white'}} trackColor={{true: '#35C759', false: '#373737'}}
       style={{alignSelf: 'center', marginTop: 10, transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }} />

       <NativeText style={{color: 'white', fontSize: 25, textAlign:'center', marginLeft: 20, textAlignVertical: 'center'}}>Join Contests</NativeText>
         </View>

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
          </View></Overlay>
    </View>
      )   
    }
  }
  }
}
var sunglasses = [
  {sgURL: 'https://cdn.discordapp.com/attachments/770876582415171604/778510919139196948/noun_Sunglasses_29025973x.png', flairPrice: 80},
  {sgURL: 'https://cdn.discordapp.com/attachments/770876582415171604/778510914323349534/noun_mask_2845555_13x.png', flairPrice: 150},
  {sgURL: 'https://cdn.discordapp.com/attachments/770876582415171604/778510910296686612/noun_fancy_glasses_35715303x.png', flairPrice: 150},
  {sgURL: 'https://cdn.discordapp.com/attachments/770876582415171604/778510915556474880/noun_Sunglasses_10062153x.png', flairPrice: 180},
  {sgURL: 'https://cdn.discordapp.com/attachments/770876582415171604/778510916747526154/noun_Sunglasses_11582603x.png', flairPrice: 180},
  {sgURL: 'https://cdn.discordapp.com/attachments/770876582415171604/778510917692293150/noun_Sunglasses_18565193x.png', flairPrice: 180}
]
var flairs = [
  {flairURL: 'https://media.giphy.com/media/aRZ4vTsHnyW6A/giphy.gif', flairPrice: 0},
  {flairURL: 'https://media.tenor.com/images/b168b139c01a69e19e14bc609666ef2b/tenor.gif', flairPrice: 0},
  {flairURL: 'https://media.giphy.com/media/l378wcSfS7eXWQgla/giphy.gif', flairPrice: 0},
  {flairURL: 'https://media.giphy.com/media/zNbqGADAp9bSU/giphy.gif', flairPrice: 0},
  {flairURL: 'https://media.giphy.com/media/3og0IMh7rRNPtNSK9q/giphy.gif', flairPrice: 100},
  {flairURL: 'https://media.giphy.com/media/3o6ZtgnmZDZeAshxYY/giphy.gif', flairPrice: 100},
  {flairURL: 'https://media.giphy.com/media/YWf50NNii3r4k/giphy.gif', flairPrice: 150},
  {flairURL: 'https://media.giphy.com/media/l3q2Dh5BA4zRFSwak/giphy.gif', flairPrice: 150}
]
class Profile extends React.Component{

  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      title: '',
      headerStyle: { elevation:0, backgroundColor: params.darktheme ? '#222B45' : '#fff' },
      cardStyle: {backgroundColor: params.darktheme ? '#222B45' : '#edf1f7'},
      headerRight: 
        params.showStore ? ( <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={navigation.getParam("changeProfile")} style={{marginHorizontal: 20}}>
          <Icon name="ios-pencil" size={30} color={ params.darktheme ? '#edf1f7' : '#151a30' } />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Settings', {dark: params.darktheme})} style={{marginHorizontal: 20}}>
          <Svg width="27" height="28" viewBox="0 0 27 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <Path d="M23.8277 15.365C23.8798 14.9275 23.9145 14.4725 23.9145 14C23.9145 13.5275 23.8798 13.0725 23.8104 12.635L26.7438 10.325C27.0042 10.115 27.0736 9.73 26.9174 9.4325L24.1402 4.585C23.9666 4.27 23.6021 4.165 23.2897 4.27L19.8355 5.67C19.1065 5.11 18.3428 4.655 17.4922 4.305L16.9715 0.595C16.9194 0.245 16.6244 0 16.2772 0H10.7228C10.3756 0 10.0979 0.245 10.0458 0.595L9.52512 4.305C8.6746 4.655 7.89351 5.1275 7.18185 5.67L3.7277 4.27C3.41526 4.1475 3.05076 4.27 2.87718 4.585L0.0999714 9.4325C-0.0736041 9.7475 -0.00417364 10.115 0.273547 10.325L3.20697 12.635C3.13754 13.0725 3.08547 13.545 3.08547 14C3.08547 14.455 3.12019 14.9275 3.18962 15.365L0.256189 17.675C-0.00417406 17.885 -0.0736041 18.27 0.0826139 18.5675L2.85982 23.415C3.0334 23.73 3.39791 23.835 3.71034 23.73L7.16449 22.33C7.89351 22.89 8.65724 23.345 9.50776 23.695L10.0285 27.405C10.0979 27.755 10.3756 28 10.7228 28H16.2772C16.6244 28 16.9194 27.755 16.9542 27.405L17.4749 23.695C18.3254 23.345 19.1065 22.8725 19.8181 22.33L23.2723 23.73C23.5847 23.8525 23.9492 23.73 24.1228 23.415L26.9 18.5675C27.0736 18.2525 27.0042 17.885 26.7265 17.675L23.8277 15.365ZM13.5 19.25C10.636 19.25 8.29274 16.8875 8.29274 14C8.29274 11.1125 10.636 8.75 13.5 8.75C16.364 8.75 18.7073 11.1125 18.7073 14C18.7073 16.8875 16.364 19.25 13.5 19.25Z" fill={ params.darktheme ? '#edf1f7' : '#151a30' }/>
          </Svg>
        </TouchableOpacity></View>
        ) : navigation.getParam("btns"),
        headerTintColor: params.darktheme ? 'white' : 'black'
    };
  };

  state = {
    dark: false,
    loading: true,
    data: [],
    user: '',
    profileUser: '',
    showContent: 'posts',
    bookmarks: [],
    purchaseToken: '',
    changePhoto: false,
    newAvatar: '',
    previewFlair: false,
    previewIndex: 0,
    previewSunglass: false,
    follows: false,
    moreOptions: false,
    reportUser: false,
    reportReason: '',
    followtype: 'following',
    followData: [],
    language: 'en'
  }
  constructor(props){
    super(props)
    this.newSocket = io.connect('https://lishup.com:3000', {secure: true}, { transports: ['websocket'] })
    this.newSocket.on('connect', (data) => {
      console.log('connected to socket in store')
    })
    this.handleResult = this.handleResult.bind(this)
  }
  componentDidMount(){
    this.fetchUser()
    RNIap.initConnection()
    .then(() => RNIap.flushFailedPurchasesCachedAsPendingAndroid())
    .then(() => {
      RNIap.getProducts(itemSkus).then((products) => {
        this.setState({productList: products})
       }).catch((error) => {
         console.log(error.message);
       })
    })
    .catch((e) => {
      ToastAndroid.show('Something went wrong while getting the products', ToastAndroid.SHORT)
    })
    this.newSocket.on('validationResult', data => this.handleResult)
    purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase: InAppPurchase | SubscriptionPurchase) => {
        var receipt = JSON.parse(purchase.transactionReceipt)
        var amountToadd
        if(receipt.productId == '300.pearl.meme'){
          amountToadd = 100
        }  else if(receipt.productId == '300.gems.meme') {
          amountToadd = 300
        } else if(receipt.productId == '500.gems.meme') {
          amountToadd = 500
        }else if(receipt.productId == '1000.gems.meme') {
          amountToadd = 1000
        }
        if (receipt.purchaseToken) {
          if(this.state.purchaseToken != receipt.purchaseToken){
          console.log(receipt)
          this.setState({purchaseToken: receipt.purchaseToken})
            this.newSocket.emit('validateReceipt', {
              user: this.state.user,
              productId: receipt.productId,
              purchaseToken: receipt.purchaseToken,
              amount: amountToadd
            })
          let data = this.state.data
          data.points = parseInt(data.points) + amountToadd
          this.setState({data: data})
          setTimeout(() => {this.setState({showCongrats: false})}, 4000)
          console.log('sent')
          try {
            await RNIap.finishTransaction(purchase, true)
          } catch(e) {
            console.log(e)
            ToastAndroid.show('Something went wrong with payment', ToastAndroid.SHORT)
          }
        }
        }
      },
    )

    this.props.navigation.setParams({btns: ()=> this.followbtn()})
    this.props.navigation.setParams({changeProfile: ()=> this.setState({changePhoto: true})})
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
    if (purchaseUpdateSubscription) {
      purchaseUpdateSubscription.remove()
      purchaseUpdateSubscription = null
    }
    if (purchaseErrorSubscription) {
      purchaseErrorSubscription.remove()
      purchaseErrorSubscription = null
    }
    RNIap.endConnection()
  }
  handleResult(data){
    if(data.msg == 'success'){
      if(data.user == this.state.user){
        ToastAndroid.show('Sent you the Credit! Total Gems ' + this.state.balance, ToastAndroid.SHORT)
    }
  }else{
    if(data.user == this.state.user){
       ToastAndroid.show('Invalid Request', ToastAndroid.SHORT)
    }
  }
 }
  fetchUser = async() => {
    const { params } = this.props.navigation.state
    const user = params ? params.user : null
    const dark = params ? params.dark : null

    this.setState({dark: dark})
    this.props.navigation.setParams({darktheme: dark, userName: user})

    try {
      var me = await AsyncStorage.getItem('user')
      var lan = await AsyncStorage.getItem('language')
      var bookmarks = await AsyncStorage.getItem('bookmarks')
      
      if(bookmarks){
        let bposts = JSON.parse(bookmarks)
        this.setState({bookmarks: bposts})
      }

      if(user !== null) {
        this.setState({user: me})
        this.fetch(user)
      }
      this.setState({language: lan ? lan : 'en'})
    } catch(e) {
      ToastAndroid.show('Could Not Get User', ToastAndroid.SHORT)
    }
  }
  fetch(user){
    fetch('https://lishup.com/app/user.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: user,
        current: this.state.user
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson){
        this.setState({data: responseJson, loading: false, profileUser: user})
       this.props.navigation.setParams({fullName: responseJson.fullName})
       if(responseJson.isfollowing == 'yes'){
         this.props.navigation.setParams({ isfollowing :  'yes' })
       }else{
        this.props.navigation.setParams({ isfollowing :  'no' })
       }
       if(user == this.state.user){
        this.props.navigation.setParams({showStore: 'true', balance: responseJson.points})
       }
      }else{
        ToastAndroid.show('Could not find User :(', ToastAndroid.SHORT)
        this.props.navigation.goBack()
      }
       
     })
  }
  follow(user, type){
    if(type == "list"){
        for (var i in this.state.followData) {
          if (this.state.followData[i].user == user) {
            let data = this.state.followData
             data[i].isfollowing = data[i].isfollowing > 0 ? 0 : 1
             this.setState({followData: data})
             break
          }
        }
    }else{
      if(this.state.data.isfollowing == 'no'){
        let data = this.state.data
        data.isfollowing = 'yes'
        data.followers = data.followers + 1
        this.setState({data: data})
        this.props.navigation.setParams({ isfollowing :  'yes' })
       }else{
        let data = this.state.data
        data.isfollowing = 'no'
        data.followers = data.followers - 1
        this.setState({data: data})
        this.props.navigation.setParams({ isfollowing :  'no' })
       }
    }

    fetch('https://lishup.com/app/newfollow.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: user,
        user: this.state.user
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson)
     })
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
                this.fetch(this.state.user)
            }
          })
        })
      upload.catch((err) => {
          console.log(err)
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
  renderPosts = ({item}) => (
      <Image source={{uri: item.url}} 
       style={{width: (Dimensions.get('window').width /2) - 5, height: (Dimensions.get('window').width /2)- 5, resizeMode: 'cover', margin:2.5 }} 
       onPress={() => this.props.navigation.navigate('ViewPost', {id: item.id, dark: this.state.dark})}/>
  )
  renderBookMarkedPosts = ({item}) => (
    <Image source={{uri: item.uri}} 
       style={{width: (Dimensions.get('window').width /2) - 5, height: (Dimensions.get('window').width /2)- 5, resizeMode: 'cover', margin:2.5 }} 
       onPress={() => this.props.navigation.navigate('ViewPost', {id: item.id, dark: this.state.dark})}/>
  )
  me(){
    if(this.state.user == this.state.profileUser){
      return (
        <View style={{flexDirection: 'row', alignSelf: 'center', marginVertical: 30}}>
            <Button appearance='ghost' style={{backgroundColor: 'transparent', borderRadius: 30}}
             onPress={async() => {
               await Share.share({
                 message: '<a href="lishup://meme/profile?user=' + this.state.profileUser + '">Visit My Profile in Meme</a>'
               })
             }}><Icon name="ios-share-social" size={25} /></Button>
        </View>
      )
    }else{
      return (
        <View style={{flexDirection: 'row', alignSelf: 'center', marginVertical: 30}}>
            <Button appearance='ghost' style={{backgroundColor: 'transparent', borderRadius: 30 }}
            onPress={() => this.props.navigation.navigate('Messaging', {
              current: this.state.user,
              otheruser: this.state.profileUser,
              otheruserpic: this.state.data.pic,
              dark: this.state.dark
            })}><Svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M3.12775 18.8879C3.19186 18.6519 3.05016 18.3238 2.91492 18.0873C2.87281 18.0168 2.82714 17.9484 2.77807 17.8825C1.61819 16.1235 0.999979 14.0628 1.00005 11.9558C0.981195 5.90787 5.99628 1 12.1978 1C17.6062 1 22.1207 4.74677 23.1757 9.72037C23.3338 10.4578 23.4136 11.2098 23.4138 11.9639C23.4138 18.0205 18.5922 23.0054 12.3907 23.0054C11.4047 23.0054 10.0739 22.7575 9.34811 22.5544C8.62236 22.3513 7.89768 22.0819 7.71072 22.0097C7.51951 21.9362 7.31643 21.8984 7.11158 21.8982C6.88783 21.8973 6.66623 21.9419 6.46018 22.0291L2.80555 23.3481C2.72548 23.3826 2.64065 23.4047 2.55393 23.4138C2.4855 23.4136 2.4178 23.3998 2.35473 23.3732C2.29167 23.3467 2.2345 23.3079 2.18654 23.2591C2.13858 23.2103 2.10079 23.1524 2.07534 23.0889C2.0499 23.0254 2.03731 22.9574 2.03831 22.889C2.0428 22.8289 2.05364 22.7695 2.07064 22.7117L3.12775 18.8879Z" stroke="#0094FF" stroke-width="1.72414" stroke-miterlimit="10" stroke-linecap="round"/>
            </Svg></Button>
            <Button appearance='ghost' style={{backgroundColor: 'transparent', borderRadius: 30}}
             onPress={async() => {
               await Share.share({
                 message: 'lishup://meme/profile?user=' + this.state.profileUser
               })
             }}><Icon name="ios-share-social" size={25} /></Button>
        </View>
      )
    }
  }
  buyFlair(type, index){

    ToastAndroid.show('Changing to your awesome Flair', ToastAndroid.SHORT)
    let data = this.state.data
    if(type == 'profile_flair'){
      data.flair = flairs[index].flairURL
      var flairURL = flairs[index].flairURL
    }else{
      data.sunglass = sunglasses[index].sgURL
      var flairURL = sunglasses[index].sgURL
    }
    data.points = data.points - flairs[index].flairPrice
    this.setState({data: data})
    fetch('https://lishup.com/app/updateFlair.php', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
           flair: flairURL,
           cost: flairs[index].flairPrice,
           user: this.state.user,
           type: type
          }),
        })
        .then((response) => response.json())
          .then((responseJson) => {
              if(responseJson == 'success'){
                ToastAndroid.show('Changed Profile Flair', ToastAndroid.SHORT)
            }else{
              ToastAndroid.show(responseJson, ToastAndroid.SHORT)
            }
          })
  }
  removeFlair(type){
   var data = this.state.data
    if(type == 'profile_flair'){
      data.flair = ''
    }else{
      data.sunglass = ''
    }
    this.setState({data: data})
    fetch('https://lishup.com/app/updateFlair.php', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
           flair: '',
           cost: 0,
           user: this.state.user,
           type: type
          }),
        })
        .then((response) => response.json())
          .then((responseJson) => {
              if(responseJson == 'success'){
                ToastAndroid.show('Removed Profile Flair', ToastAndroid.SHORT)
            }
          })
  }
  fetchFollows(type){
    this.setState({follows: true, followtype: type})
    fetch('https://lishup.com/app/getFollows.php', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
           user: this.state.profileUser,
           type: type
          }),
        })
        .then((response) => response.json())
          .then((responseJson) => {
                this.setState({followData: responseJson})
       })
  }
  followbtn(){
    if(this.state.user != this.state.profileUser){
    if(this.props.navigation.getParam('isfollowing') == 'no'){
        return (
          <ApplicationProvider
        {...eva}
        theme={this.state.dark ? eva.dark : eva.light }>
          <View style={{flexDirection: 'row'}}>
          <EnIcon name="dots-three-horizontal" size={20} color="black" onPress={() => this.setState({moreOptions: true})}/>
          <Button style={{ borderColor: 'transparent',
          marginHorizontal: 20, borderRadius: 30, elevation: 10, width: "80%"}}
          onPress={() => this.follow(this.state.profileUser)}>
            Follow</Button>
            </View></ApplicationProvider>
        )
      } else if(this.props.navigation.getParam('isfollowing') == 'yes') { 
      return <ApplicationProvider
      {...eva}
      theme={this.state.dark ? eva.dark : eva.light }>
        <View style={{flexDirection: 'row'}}>
          <EnIcon name="dots-three-horizontal" size={20} color="black" style={{marginTop: 10}} onPress={() => this.setState({moreOptions: true})} />
          <Button appearance="outline" style={{
      marginHorizontal: 20, borderRadius: 30, width: "80%"}}
      onPress={() => this.follow(this.state.profileUser)}>
        UnFollow</Button>
        </View></ApplicationProvider>
    }
  }else{
    return null
  }
  }
  reportUser(){
    if(this.state.reportReason){
    fetch('https://lishup.com/app/newUserReport.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: this.state.user, reportedUser: this.state.profileUser, reason: this.state.reportReason}),
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
  showCase(){
    if(this.state.showContent == 'posts'){
        return <FlatList
        contenContainerstyle={{alignItems: 'center'}}
        data={this.state.data.post_list}
        renderItem={this.renderPosts}
        keyExtractor={(item, index) => index}
        numColumns={2}
      />
    }else if(this.state.showContent == 'bookmarks'){
      return <FlatList
      contenContainerstyle={{alignItems: 'center'}}
      data={this.state.bookmarks.sort((a, b) => parseInt(b.id) - parseInt(a.id))}
      renderItem={this.renderBookMarkedPosts}
      keyExtractor={(item, index) => index}
      numColumns={2}
     />
    }else if(this.state.showContent == 'store'){
      return (
        <View>
        <Text category="h6" style={{marginLeft: 10}}>Gems</Text>
        <ScrollView style={{backgroundColor: this.state.dark ? '#101426' : '#fff', width: "100%" }}
             horizontal={true}>
             <View style={{width: Dimensions.get('window').width / 2, alignContent: 'center', marginVertical: 10}}>
                <FastImage source={require('./GemsIcons/1.png')} style={{height: 100, width: 100, alignSelf: 'center'}} resizeMode="contain"/>
                <Text category="s1" style={{textAlign: 'center', marginTop: 5}}>Gems Bundle</Text>
                <Text category="h5" style={{textAlign: 'center', marginBottom: 5}}>100 <Svg width="25" height="19" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Path d="M19.1358 4.50423L9.87037 12.9787L0.604947 4.50423L3.37217 0.459825H16.3686L19.1358 4.50423Z" fill="#ED0063" stroke="#ED0063" stroke-width="0.91965"/>
                </Svg></Text>
                <Button onPress={() => {
                try {
                  RNIap.requestPurchase(this.state.productList[2].productId)
                } catch (err) {
                  console.warn(err.code, err.message)
                }
              }} style={{borderRadius: 20, borderColor: 'transparent',
              padding: 10, alignSelf: 'center', fontSize: 20}} status="danger">Buy 1$</Button>
            </View>
            <View style={{width: Dimensions.get('window').width / 2, alignContent: 'center', marginVertical: 10}}>
                <FastImage source={require('./GemsIcons/2.png')} style={{height: 100, width: 100, alignSelf: 'center'}} resizeMode="contain"/>
                <Text category="s1" style={{textAlign: 'center', marginTop: 5}}>Gems Piggy Bank</Text>
                <Text category="h5" style={{textAlign: 'center', marginBottom: 5}}>300 <Svg width="25" height="19" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Path d="M19.1358 4.50423L9.87037 12.9787L0.604947 4.50423L3.37217 0.459825H16.3686L19.1358 4.50423Z" fill="#ED0063" stroke="#ED0063" stroke-width="0.91965"/>
                </Svg></Text>
                <Button onPress={() => {
                try {
                  RNIap.requestPurchase(this.state.productList[1].productId)
                } catch (err) {
                  console.warn(err.code, err.message)
                }
              }} style={{borderRadius: 20, borderColor: 'transparent',
              padding: 10, alignSelf: 'center', fontSize: 20}} status="danger">Buy 2.99$</Button>
            </View>
            <View style={{width: Dimensions.get('window').width / 2, alignContent: 'center', marginVertical: 10}}>
                <FastImage source={require('./GemsIcons/3.png')} style={{height: 100, width: 100, alignSelf: 'center'}} resizeMode="contain"/>
                <Text category="s1" style={{textAlign: 'center', marginTop: 5}}>Gems Box</Text>
                <Text category="h5" style={{textAlign: 'center', marginBottom: 5}}>500 <Svg width="25" height="19" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Path d="M19.1358 4.50423L9.87037 12.9787L0.604947 4.50423L3.37217 0.459825H16.3686L19.1358 4.50423Z" fill="#ED0063" stroke="#ED0063" stroke-width="0.91965"/>
                </Svg></Text>
                <Button onPress={() => {
                try {
                  RNIap.requestPurchase(this.state.productList[3].productId)
                } catch (err) {
                  console.warn(err.code, err.message)
                }
              }} style={{borderRadius: 20, borderColor: 'transparent',
              padding: 10, alignSelf: 'center', fontSize: 20}} status="danger">Buy 4.99$</Button>
            </View>
            <View style={{width: Dimensions.get('window').width / 2, alignContent: 'center', marginVertical: 10}}>
                <FastImage source={require('./GemsIcons/5.png')} style={{height: 100, width: 100, alignSelf: 'center'}} resizeMode="contain"/>
                <Text category="s1" style={{textAlign: 'center', marginTop: 5}}>Gems Palace</Text>
                <Text category="h5" style={{textAlign: 'center', marginBottom: 5}}>1K <Svg width="25" height="19" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Path d="M19.1358 4.50423L9.87037 12.9787L0.604947 4.50423L3.37217 0.459825H16.3686L19.1358 4.50423Z" fill="#ED0063" stroke="#ED0063" stroke-width="0.91965"/>
                </Svg></Text>
                <Button onPress={() => {
                try {
                  RNIap.requestPurchase(this.state.productList[0].productId)
                } catch (err) {
                  console.warn(err.code, err.message)
                }
              }} style={{borderRadius: 20, borderColor: 'transparent',
               padding: 10, alignSelf: 'center', fontSize: 20}} status="danger">Buy 9.99$</Button>
            </View>
          </ScrollView>
          <Text category="h6" style={{marginLeft: 10, marginVertical: 10}}>{this.state.language == 'en' ? 'Backgrounds' : 
            <PowerTranslator text="Backgrounds" 
                      target={this.state.language} />}</Text>
            <ScrollView style={{backgroundColor: this.state.dark ? '#101426' : '#fff', width: "100%" }}
             horizontal={true}>
               <TouchableOpacity onPress={() =>  this.removeFlair('profile_flair') } style={{backgroundColor: 'rgba(0, 0, 0, 0.1)', borderRadius: 10, height: 200, width: 200,
                 margin: 10, justifyContent: 'center'}}>
                   <Text style={{alignSelf: 'center', fontSize: 20}}>{this.state.language == 'en' ? 'None' : 
            <PowerTranslator text="None" 
                      target={this.state.language} />}</Text>
              </TouchableOpacity>
               <TouchableOpacity onPress={() =>  this.setState({previewFlair: true, previewIndex: 0})  }>
              <FastImage source={{uri: 'https://media.giphy.com/media/aRZ4vTsHnyW6A/giphy.gif'}} style={{height: 200, width: 200, borderRadius: 10, alignSelf: 'center', margin: 10}} resizeMode="cover"
                 /></TouchableOpacity>
               <TouchableOpacity onPress={() => this.setState({previewFlair: true, previewIndex: 1})  }>
              <FastImage source={{uri: 'https://media.tenor.com/images/b168b139c01a69e19e14bc609666ef2b/tenor.gif'}} style={{height: 200, width: 200, borderRadius: 10, alignSelf: 'center', margin: 10}} resizeMode="cover"/>
              </TouchableOpacity>   
              <TouchableOpacity onPress={() => this.setState({previewFlair: true, previewIndex: 2}) }>
              <FastImage source={{uri: 'https://media.giphy.com/media/l378wcSfS7eXWQgla/giphy.gif'}} style={{height: 200, width: 200, borderRadius: 10, alignSelf: 'center', margin: 10}} resizeMode="cover"/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({previewFlair: true, previewIndex: 3 }) }>
              <FastImage source={{uri: 'https://media.giphy.com/media/zNbqGADAp9bSU/giphy.gif'}} style={{height: 200, width: 200, borderRadius: 10, alignSelf: 'center', margin: 10}} resizeMode="cover"/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({previewFlair: true, previewIndex: 4 }) }>
              <FastImage source={{uri: 'https://media.giphy.com/media/3og0IMh7rRNPtNSK9q/giphy.gif'}} style={{height: 200, width: 200, borderRadius: 10, alignSelf: 'center', margin: 10}} resizeMode="cover"/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({previewFlair: true, previewIndex: 5 }) }>
              <FastImage source={{uri: 'https://media.giphy.com/media/3o6ZtgnmZDZeAshxYY/giphy.gif'}} style={{height: 200, width: 200, borderRadius: 10, alignSelf: 'center', margin: 10}} resizeMode="cover"/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({previewFlair: true, previewIndex: 6 }) }>
              <FastImage source={{uri: 'https://media.giphy.com/media/YWf50NNii3r4k/giphy.gif'}} style={{height: 200, width: 200, borderRadius: 10, alignSelf: 'center', margin: 10}} resizeMode="cover"/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({previewFlair: true, previewIndex: 7 }) }>
              <FastImage source={{uri: 'https://media.giphy.com/media/l3q2Dh5BA4zRFSwak/giphy.gif'}} style={{height: 200, width: 200, borderRadius: 10, alignSelf: 'center', margin: 10}} resizeMode="cover"/>
              </TouchableOpacity>
            </ScrollView>
            <Text category="h6" style={{marginLeft: 10, marginVertical: 10}}>{this.state.language == 'en' ? 'Sunglasses' : 
            <PowerTranslator text="Sunglasses" 
                      target={this.state.language} />}</Text>
            <ScrollView style={{backgroundColor: this.state.dark ? '#101426' : '#fff', width: "100%" }}
             horizontal={true}>
               <TouchableOpacity onPress={() => this.removeFlair('profile_sunglass') } style={{height: 100, width: 100, borderRadius: 10, margin: 10,
                 justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.1)'}}>
              <Text style={{alignSelf: 'center', fontSize: 20}} 
                 >{this.state.language == 'en' ? 'None' : 
                 <PowerTranslator text="None" 
                           target={this.state.language} />}</Text></TouchableOpacity>
               <TouchableOpacity onPress={() => this.setState({previewSunglass: true, previewIndex: 0}) }>
              <FastImage source={{uri: 'https://cdn.discordapp.com/attachments/770876582415171604/778510919139196948/noun_Sunglasses_29025973x.png'}} style={{height: 100, width: 100, borderRadius: 10, alignSelf: 'center', margin: 10}} resizeMode="contain"
                 /></TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({previewSunglass: true, previewIndex: 1}) }>
              <FastImage source={{uri: 'https://cdn.discordapp.com/attachments/770876582415171604/778510914323349534/noun_mask_2845555_13x.png'}} style={{height: 100, width: 100, borderRadius: 10, alignSelf: 'center', margin: 10}} resizeMode="contain"
                 /></TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({previewSunglass: true, previewIndex: 2}) }>
              <FastImage source={{uri: 'https://cdn.discordapp.com/attachments/770876582415171604/778510910296686612/noun_fancy_glasses_35715303x.png'}} style={{height: 100, width: 100, borderRadius: 10, alignSelf: 'center', margin: 10}} resizeMode="contain"
                 /></TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({previewSunglass: true, previewIndex: 3}) }>
              <FastImage source={{uri: 'https://cdn.discordapp.com/attachments/770876582415171604/778510915556474880/noun_Sunglasses_10062153x.png'}} style={{height: 100, width: 100, borderRadius: 10, alignSelf: 'center', margin: 10}} resizeMode="contain"
                 /></TouchableOpacity>     
              <TouchableOpacity onPress={() => this.setState({previewSunglass: true, previewIndex: 4}) }>
              <FastImage source={{uri: 'https://cdn.discordapp.com/attachments/770876582415171604/778510916747526154/noun_Sunglasses_11582603x.png'}} style={{height: 100, width: 100, borderRadius: 10, alignSelf: 'center', margin: 10}} resizeMode="contain"
                 /></TouchableOpacity>      
              <TouchableOpacity onPress={() => this.setState({previewSunglass: true, previewIndex: 5}) }>
              <FastImage source={{uri: 'https://cdn.discordapp.com/attachments/770876582415171604/778510917692293150/noun_Sunglasses_18565193x.png'}} style={{height: 100, width: 100, borderRadius: 10, alignSelf: 'center', margin: 10}} resizeMode="contain"
                 /></TouchableOpacity>       
            </ScrollView>
          </View>
      )
    }
  }
  renderPreviewFlair = ({item, index}) => (
    <View style={{width: "90%", height: "90%", justifyContent: 'center',
    borderRadius: 30, margin: "5%" }}>
  <ImageBackground source={{uri: item.flairURL}} style={{flex: 1,
    borderRadius: 30, alignContent: 'center', justifyContent: 'center', overflow: 'hidden', marginVertical: 20}} 
    imageStyle={{borderRadius: 30}}>
    <Avatar 
         style={{alignSelf: 'center', elevation: 20, backgroundColor: '#0000', width: 100, 
           height: 100}}
         source={{uri: this.state.data.pic}} 
      />
  </ImageBackground>    
  <Button onPress={() => this.buyFlair('profile_flair', index)}>Grab it {item.flairPrice} Gems</Button>
  </View>
  )
  renderPreviewSg = ({item, index}) => (
    <View style={{width: "90%", height: "90%", justifyContent: 'center',
    borderRadius: 30, margin: "5%" }}>
       <ImageBackground source={{uri: this.state.data.flair}} style={{flex: 1,
            borderRadius: 30, alignContent: 'center', justifyContent: 'center', overflow: 'hidden', marginVertical: 20}} 
             imageStyle={{borderRadius: 30}}>
         <Avatar 
            style={{alignSelf: 'center', elevation: 20, backgroundColor: '#0000', width: 100, 
              height: 100}}
            source={{uri: this.state.data.pic}} 
          />
          <FastImage source={{uri: item.sgURL }} 
            style={{height: 80, width: 80, position: 'absolute', elevation: 25, alignSelf: 'center'}} resizeMode="contain" />
       </ImageBackground>    
       <Button onPress={() => this.buyFlair('profile_sunglass', index)}>Snatch it {item.flairPrice} Gems</Button>
    </View>
  )
  getShowCase(which){
    if(which == this.state.showContent){
      return 1
    }else{
      return 0.5
    }
  }
   m(num){
      if (num >= 1000000000) {
         return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G'
      }
      if (num >= 1000000) {
         return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
      }
      if (num >= 1000) {
         return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
      }
      return num
  }
  render(){
    if(this.state.loading){
      return(
        <ApplicationProvider
    {...eva}
    theme={this.state.dark ? eva.dark : eva.light }>
        <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <FastImage source={{uri: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/35771931234507.564a1d2403b3a.gif', 
          priority: FastImage.priority.high,}} style={{
            width: 100, height: 100
          }}/>
          </Layout>
      </ApplicationProvider>
      )
    }else{
    return(
      <ApplicationProvider {...eva} theme={this.state.dark ? eva.dark : eva.light}>
        <Layout style={{flex: 1}}>
        <ScrollView style={{flex: 1}}>
           <Text category="h5" style={{ textAlign: 'center', marginTop: 10}}>{this.state.data.fullName}</Text>
           <Text style={{opacity: 0.6}} style={{ textAlign: 'center'}}>@{this.state.profileUser}</Text>
            <View style={{flexDirection: 'row'}}> 
              <View style={{ alignContent: 'flex-end', width: "60%"}}>
              <View style={{ width: "100%", height: (Dimensions.get('window').width * 80) / 100}}>
              <View style={{width: "90%", height: "100%", justifyContent: 'center', alignSelf: 'flex-end', alignContent: 'flex-end',
                  borderRadius: 30, marginLeft: "10%" }}>
                <ImageBackground source={{uri: this.state.data.flair}} style={{flex: 1,
                  borderRadius: 30, alignContent: 'center', justifyContent: 'center', overflow: 'hidden', marginVertical: 20,
                   borderColor: this.state.dark ? 'white' : 'black', borderWidth: this.state.flair ? 0 : 1 }} 
                  imageStyle={{borderRadius: 30}}>
                  <Avatar 
                       style={{alignSelf: 'center', elevation: 20, backgroundColor: '#0000', width: 100, 
                         height: 100}}
                       source={{uri: this.state.data.pic}} 
                    />
                  <FastImage source={{uri: this.state.data.sunglass }} 
                   style={{height: 80, width: 80, position: 'absolute', elevation: 25, alignSelf: 'center'}} resizeMode="contain" />
                </ImageBackground>    
                </View>
                </View>
              <Text appearance="hint" style={{textAlign: 'left', marginHorizontal: 10, marginLeft: 20, alignSelf: 'center'}}
                >{this.state.language == 'en' ? this.state.data.description : <PowerTranslator text={this.state.data.description}
                target={this.state.language} />}</Text>
              </View>     
                  <View style={{  justifyContent: 'center', alignContent: 'center', width: "40%", paddingTop: 20, paddingLeft: 10}}>
                    <TouchableOpacity style={{alignItems: 'flex-start', textAlign: 'left', marginVertical: 5, marginHorizontal: 20}}
                    onPress={() => this.fetchFollows('following')}>
                      <Text category="h5">{this.m(this.state.data.follows)}</Text>
                      <Text category="s2" appearance="hint">{this.state.language == 'en' ? 'Following' : <PowerTranslator text="Following" 
                      target={this.state.language} />}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{alignItems: 'flex-start', textAlign: 'left', marginVertical: 5, marginHorizontal: 20}}
                    onPress={() => this.fetchFollows('follower')}>
                      <Text category="h5">{this.m(this.state.data.followers)}</Text>
                      <Text category="s2" appearance="hint">{this.state.language == 'en' ? 'Followers' : <PowerTranslator text="Followers" 
                      target={this.state.language} />}</Text>
                    </TouchableOpacity>
                    <View style={{alignItems: 'flex-start', textAlign: 'left', marginVertical: 5, marginHorizontal: 20}}>
                      <Text category="h5">{this.m(this.state.data.posts)}</Text>
                      <Text category="s2" appearance="hint">{this.state.language == 'en' ? 'Loves' : <PowerTranslator text="Loves" 
                      target={this.state.language} />}</Text>
                    </View>
                    <View style={{alignItems: 'flex-start', textAlign: 'left', marginVertical: 5, marginHorizontal: 20}}>
                        <Text category="h5">{this.m(this.state.data.points)} <Svg width="25" height="19" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg" 
                        style={{marginHorizontal: 10}}>
                <Path d="M19.1358 4.50423L9.87037 12.9787L0.604947 4.50423L3.37217 0.459825H16.3686L19.1358 4.50423Z" fill="#ED0063" stroke="#ED0063" stroke-width="0.91965"/>
                </Svg></Text>
                        <Text category="s2" appearance="hint">{this.state.language == 'en' ? 'Gems' : <PowerTranslator text="Gems" 
                      target={this.state.language} />}</Text>
                    </View>
                    {this.me()}
                  </View>
              </View>  
            <View style={{flexDirection: 'row', backgroundColor: 'transparent', borderTopColor: '#ababab', justifyContent: 'space-evenly',
               borderTopWidth: 1, borderBottomWidth: 1, padding: 10, marginVertical: 20, borderBottomColor: '#ababab'}}>
              {this.state.profileUser == this.state.user ? <TouchableOpacity onPress={() => this.setState({showContent: 'store'})}>
                <EnIcon name="shopping-cart" color= { this.state.dark ? '#fff' : '#424E60' } style={{opacity: this.getShowCase('store')}} size={35} />
              </TouchableOpacity> : null }
              <TouchableOpacity onPress={() => this.setState({showContent: 'posts'})}>
                <Icon name="grid" color= { this.state.dark ? '#fff' : '#424E60' } style={{opacity: this.getShowCase('posts')}} size={35} />
              </TouchableOpacity>
              {this.state.profileUser == this.state.user ? <TouchableOpacity onPress={() => this.setState({showContent: 'bookmarks'})}>         
                 <Icon name="bookmark" color= { this.state.dark ? '#fff' : '#424E60' } style={{opacity: this.getShowCase('bookmarks')}} size={35} />
              </TouchableOpacity> : null}
            </View>
            <Layout style={{width: "100%", padding: 10}}>
               {this.showCase()}
            </Layout>
          </ScrollView>
          <Overlay isVisible={this.state.changePhoto} onBackdropPress={() => this.setState({changePhoto: !this.state.changePhoto})}
         overlayStyle={{width: "80%", height: "70%", backgroundColor: this.state.dark ? '#101426' : '#fff', padding: 20 }}  animationType="slide">
          <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
             <Avatar source={{uri: this.state.newAvatar ? this.state.newAvatar : this.state.data.pic}} 
                    size="giant" style={{width: 120, height: 120, borderRadius: 60}} />
             <Button onPress={() => this.takepic()} appearance="outline" style={{margin: 15}}>Choose Photo</Button>
                  {this.state.newAvatar ? <Button onPress={() => this.uploadpic()} style={{marginTop: 35, width: "75%"}}>Upload Photo</Button> : null}
          </Layout>
          </Overlay>

          <Overlay isVisible={this.state.moreOptions} onBackdropPress={() => this.setState({moreOptions: !this.state.moreOptions})}
         overlayStyle={{width: "80%", height: 200, backgroundColor: this.state.dark ? '#101426' : '#fff', padding: 20,
         borderRadius: 20 }}  animationType="slide">
          <Layout style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
           <TouchableOpacity
             onPress={() => this.setState({moreOptions: false, reportUser: true})}><Icon name="alert-circle" size={50} color={this.state.dark ? '#fff' : '#2E3A59'} /></TouchableOpacity>
          <TouchableOpacity 
              onPress={() => {  Clipboard.setString('lishup://meme/profile?user=' + this.state.profileUser)
              ToastAndroid.show('Copied Profile Link', ToastAndroid.SHORT)
              }}><Icon name="copy" size={50} color={this.state.dark ? '#fff' : '#2E3A59'} /></TouchableOpacity>
          </Layout>
          </Overlay>

          <Overlay isVisible={this.state.reportUser} onBackdropPress={() => this.setState({reportUser: !this.state.reportUser})}
         overlayStyle={{width: "80%",  height: "50%", borderRadius: 50, backgroundColor: this.state.dark ? '#101426' : '#fff', paddingHorizontal: 30 }}  animationType="fade">
          <Layout level="4" style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: this.state.dark ? '#101426' : '#fff'}}>
           <Input placeholder="Let us know what is wrong" maxLength={100} textStyle={{minHeight: 60}}
           multiline={true}  onChangeText={val => this.setState({reportReason: val})} />
           <Button status="danger" style={{margin: 10, alignSelf: 'flex-end'}}
           onPress={() => this.reportUser()}>Report</Button>
          </Layout>
          </Overlay>

          <Overlay isVisible={this.state.previewFlair} onBackdropPress={() => this.setState({previewFlair: !this.state.previewFlair})}
         overlayStyle={{width: "80%", height: "60%", backgroundColor: 'transparent', elevation: 0, zIndex: 30 }}  animationType="slide">
             <Carousel
              ref={(c) => { this._PreviewCarousel = c; }}
              data={flairs}
              renderItem={this.renderPreviewFlair}
              sliderWidth={(Dimensions.get('window').width * 80) / 100}
              sliderHeight={(Dimensions.get('window').height * 50) / 100}
              itemWidth={(Dimensions.get('window').width * 80) / 100}
              firstItem={this.state.previewIndex}
            />
          </Overlay>
          <Overlay isVisible={this.state.follows} onBackdropPress={() => this.setState({follows: !this.state.follows})}
         overlayStyle={{width: "100%", height: "90%", backgroundColor: 'rgba(0, 0, 0, 0.9)', bottom: 0, position: 'absolute', padding: 20,
          borderTopLeftRadius: 10, borderTopRightRadius: 10, alignContent: 'center', alignItems: 'center'}}  
         backdropStyle={{opacity: 0.5}} animationType="slide">
           <Avatar style={{alignSelf: 'center', width: 50, height: 50}} source={{uri: this.state.data.pic}} />
           <Icon name="close" color="white" size={30} style={{position: 'absolute', alignSelf: 'flex-end', top: 30, right: 30}}
             onPress={() => this.setState({follows: false})} />
           <View style={{flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 20}}>
             <Text style={{color: 'white', margin: 10,fontWeight: 'bold',
               opacity: this.state.followtype == 'following' ? 1 : 0.6}} 
               onPress={() => this.fetchFollows('following')}>{this.state.language == 'en' ? 'Following' : <PowerTranslator text="Following" 
               target={this.state.language} />} {this.m(this.state.data.follows)}</Text>
             <Text style={{color: 'white', margin: 10,fontWeight: 'bold',
            opacity: this.state.followtype == 'follower' ? 1 : 0.6}}
            onPress={() => this.fetchFollows('follower')}>{this.state.language == 'en' ? 'Followers' : <PowerTranslator text="Followers" 
            target={this.state.language} />} {this.m(this.state.data.followers)}</Text>
           </View>
           <FlatList data={this.state.followData}
           renderItem={({item, idx}) => (
             <View style={{width: '90%', flexDirection: 'row', alignItems: 'center', marginVertical: 7}}>
               <TouchableOpacity
               onPress={() => {
                this.fetch(item.user)
                this.setState({follows: false, loading: true})
              }}><Avatar style={{alignSelf: 'center', width: 50, height: 50, marginHorizontal: 5}} source={{uri:item.profile}} 
                 /></TouchableOpacity>
               <View>
               <Text style={{color: 'white', fontWeight: 'bold', textAlign: 'left', maxWidth: '70%'}}
               numberOfLines={1}>{item.fullName}</Text>
               <Text style={{color: 'white', textAlign: 'left', opacity: 0.5, maxWidth: '70%'}}
               numberOfLines={1}>@{item.user}</Text></View>
              {item.user != this.state.user ?
              <Button appearance="outline" style={{padding: 2, borderColor: 'white',
                right: 0, alignSelf: 'flex-end'}} size="small" onPress={() => this.follow(item.user, 'list')}>
                 {evaProps => <Text {...evaProps} style={{fontSize: 12, color: 'white'}}>
                 {this.state.language == 'en' ? item.isfollowing > 0 ? 'Unfollow' : 'Follow' : <PowerTranslator text={item.isfollowing > 0 ? 'Unfollow' : 'Follow'} 
                      target={this.state.language} />}</Text>}
               </Button> : null}
             </View>
           )} />
          </Overlay>

          <Overlay isVisible={this.state.previewSunglass} onBackdropPress={() => this.setState({previewSunglass: !this.state.previewSunglass})}
         overlayStyle={{width: "80%", height: "60%", backgroundColor: 'transparent', elevation: 0, zIndex: 30 }}  animationType="slide">
             <Carousel
              ref={(c) => { this._sgPreviewCarousel = c; }}
              data={sunglasses}
              renderItem={this.renderPreviewSg}
              sliderWidth={(Dimensions.get('window').width * 80) / 100}
              sliderHeight={(Dimensions.get('window').height * 50) / 100}
              itemWidth={(Dimensions.get('window').width * 80) / 100}
              firstItem={this.state.previewIndex}
            />
          </Overlay>
          </Layout>
      </ApplicationProvider>
    )
    }
  }
}
class Conversations extends React.Component{
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      title: 'Chats',
      headerTitleStyle: { textAlign: 'center', color: params.darktheme ? 'white' : 'black', fontSize: 22},
      headerStyle: { elevation:0, backgroundColor: params.darktheme ? '#151a30' : '#fff' },
      headerTintColor : params.darktheme ? '#edf1f7' : '#151a30' 
    };
  };

  state = {
    data : [],
    user: '',
    Loading: true,
    dark: false
  }
  componentDidMount(){
    this.fetchUser()
    const { params } = this.props.navigation.state
    const dark = params ? params.dark : null
    this.setState({dark: dark})
    this.props.navigation.setParams({darktheme: dark})
  }
  fetchUser = async(id) => {
    try {
      var user = await AsyncStorage.getItem('user')
      if(user !== null) {
        this.setState({user: user})
        this.fetchmsg(user)
        this.setActive(user)
      }
    } catch(e) {
      ToastAndroid.show('Could Not Get User', ToastAndroid.SHORT)
    }
  }
  componentWillUnmount(){
    if(this.eventSource){
      this.eventSource.close()
    }
  }
  fetchmsg(me) {
    return fetch('https://lishup.com/app/allmsg.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: me }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson){
          this.setState({ data: responseJson, Loading: false })
          this.getUpdate()
        }else {
          this.setState({ Loading: false })
        }
    })
  .catch((error) => {
    ToastAndroid.show('Network Error', ToastAndroid.LONG)
  })
  
  }
  getUpdate(){
    this.eventSource = new RNEventSource('https://lishup.com/app/checkallmsg.php?id='+this.state.data[0].id+ '&read='+this.state.data[0].read+'&me=LishUp'); 
 
    // Grab all events with the type of 'message'
    this.eventSource.addEventListener('message', (data) => {
      //console.log(data.type); // message
      if(data.data == "yes"){
       this.fetchmsg(this.state.user)
       this.eventSource.close()
      }
    })
  }

  setActive(me){
    fetch('https://lishup.com/app/setactivity.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: me }),
    })
  }
    renderList = ({ item }) => (
      <TouchableOpacity>
          <ListItem
      title={props => <Text {...props} numberOfLines={1} style={{fontSize: 20, marginHorizontal: 15}}>{item.user}</Text>} 
      description={props => <Text {...props} numberOfLines={1} style={{opacity: item.read ? 1 : 0.7 , fontWeight: item.read ? 'bold' : 'light', fontSize: 15, marginHorizontal: 15}}>
        {item.text ? item.text : '...'}</Text>}
        style={{backgroundColor: this.state.dark ? '#151a30' : '#fff'}}
      accessoryLeft={props=> <Avatar
      style={{borderWidth:2, borderColor: 'yellow', elevation: 10, height: 70, width: 70, }} 
      source={{ uri: item.userpic }} />}
      accessoryRight={props => this.checkread(item.read,  item.time)}
      onPress={() => {
        this.props.navigation.navigate('Messaging', {
          current: this.state.user,
          otheruser: item.user,
          otheruserpic: item.userpic,
          dark: this.state.dark
        })
       }}
      />
      </TouchableOpacity>
  );
  checkread(read, time){
    if(read){
      return <Badge status="success"
     badgeStyle={{height: 25, width: 25, borderRadius: 25/2}} />
    }else{
     return <Text style={{marginTop: 15, opacity: 0.7}}>{time}</Text>
    }
  }
  renderempty(){
    return ( 
      <View style={{justifyContent: 'center', alignItems: 'center', padding: 10}}>
    <Image source={{uri: 'https://thumbs.gfycat.com/DiligentCompleteBunny-small.gif'}} 
      style={{height:300, width:300, alignSelf:'center', marginVertical: 10, borderRadius: 10}}/>
    <Text style={{fontSize:18,
     fontWeight:'bold', textAlign:'center', color:'grey'}}>
    Empty Inbox! 
    </Text>
    <Text style={{fontSize:20,
     fontWeight:'bold', textAlign:'center', marginVertical: 10}}>
     Invite friends to let them join with you!!</Text>
     <Button onPress={() => Share.share({
              message:
                'Use Bubblink Messenger for safer chatting. I am using it too. Join with me: https://play.google.com/store/apps/details?id=com.bubblink.lishup',
            })}>Share the App</Button>
    </View>
     );
  }

  render(){
    if(this.state.Loading){
      return(
        <ApplicationProvider
    {...eva}
    theme={this.state.dark ? eva.dark : eva.light }>
        <Layout level="2" style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <FastImage source={{uri: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/35771931234507.564a1d2403b3a.gif', 
          priority: FastImage.priority.high,}} style={{
            width: 100, height: 100
          }}/>
          </Layout>
      </ApplicationProvider>
      )
    }else{
      if(this.state.data){
        var output = [...new Map(this.state.data.map(o => [o.user, o])).values()]
      }else{
        var output = this.state.data
      }
    return(
      <ApplicationProvider {...eva} theme={this.state.dark ? eva.dark : eva.light} >
        <Layout style={{flex: 1, backgroundColor: this.state.dark ? '#151a30' : '#fff'}} >
          <Button style={{alignSelf: 'center', marginVertical: 10}} 
            appearance="ghost" onPress={() => Linking.openURL("market://details?id=com.bubblink.lishup")}>Get Bubblink Messenger for better Chatting</Button>
        <FlatList
            data={output}
            keyExtractor={(item, idx) => idx}
            renderItem={this.renderList}
            ListEmptyComponent={this.renderempty}
            refreshControl={<RefreshControl refreshing={this.state.Loading} onRefresh={() => {
              const { params } = this.props.navigation.state;
              const me = params ? params.user : null;
              this.fetchmsg(me)
              this.setState({data: [], Loading: true})
            } } />}
          />
        </Layout>
        </ApplicationProvider>
    )
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
    theme={this.state.dark ? eva.dark : eva.light }>
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
      <ApplicationProvider {...eva} theme={this.state.dark ? eva.dark : eva.light} >
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
class Contests extends React.Component{
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      headerTitleStyle: {color: 'white'},
      headerStyle: { elevation:0, backgroundColor: params.darktheme ? '#151a30' : '#5000ca' },
      headerTintColor: 'white'
    };
  };
  state = {
    dark: false,
    loading: true,
    language: 'en',
    data: []
  }
  componentDidMount () {
    const { params } = this.props.navigation.state
    const dark = params ? params.dark : null

    

    this.fetch()
    this.fetchLanguage()
    StatusBar.setBackgroundColor("rgba(0,0,0,0)")
    StatusBar.setBarStyle("light-content")
    StatusBar.setTranslucent(true)
  }
  fetch(){
    fetch('https://lishup.com/app/fetchContests.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      
      this.setState({data: responseJson, loading: false})
    })
    .catch((err) => {
      console.log(err)
      ToastAndroid.show('Request Failed', ToastAndroid.SHORT)
    })
  }
  fetchLanguage =async() => {
    var lan = await AsyncStorage.getItem('language')
    this.setState({language: lan ? lan : 'en'})

    console.log(this.state.language)
  }
  renderList = ({item, index}) => (
      <LinearGradient colors={['#396afc', '#2948ff']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} 
         style={{width: "90%", padding: 20, alignSelf: 'center', borderRadius: 20, elevation: 8, marginVertical: 10}}
         onTouchStart={() => this.props.navigation.navigate('ContestDetails', {id: item.id, dark: this.state.dark})}
         >
         <ListItem
            title={evaProps => <Text category="h6" style={{color: 'white', marginHorizontal: 20}}>{item.title}</Text>}
            description={evaProps => <Text category="s2" style={{color: 'white', marginHorizontal: 20}}>{item.prize} GEMS</Text>}
            accessoryRight={evaProps => 
        <View>
           <EnIcon name="users" size={20} color="white" style={{marginRight: 10}} />
            <Text category="p1" style={{color: 'white'}}>{item.participants}</Text>
        </View>}
        accessoryLeft={evaProps => 
          <Image source={{uri: 'https://image.freepik.com/free-vector/abstract-wallpaper_23-2148663179.jpg' }}
               style={{width: 60, height: 60, borderRadius: 20}} />}  
            style={{backgroundColor: 'transparent'}}  
        />
      </LinearGradient> 
  )
  Empty(){
    return(
      <Text category="h6" style={{textAlign: 'center'}}>Nah, No Contest is running now :(</Text>
    )
  }

  render(){
    if(this.state.loading){
      return(
        <ApplicationProvider
    {...eva}
    theme={this.state.dark ? eva.dark : eva.light }>
        <Layout style={{flex: 1 }}>
        <View style={{ backgroundColor: '#5000ca', width: Dimensions.get('window').width, height: 100 }}>
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox={"0 0 1440 320"}
              style={{ position: 'absolute', top: 100, marginBottom: 30 }}
              preserveAspectRatio="none"
            >
               <Path fill="#5000ca" fill-opacity="1" d="M0,224L48,186.7C96,149,192,75,288,85.3C384,96,480,192,576,208C672,224,768,160,864,133.3C960,107,1056,117,1152,122.7C1248,128,1344,128,1392,128L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
            </Svg>
            <Text category="h2" style={{textAlign: 'center', marginVertical: 10, marginTop: 30, color: 'white'}}>
            {this.state.language == 'en' ? "Join Contests, Win Prizes" : <PowerTranslator text="Join Contests, Win Prizes" target={this.state.language} />}</Text>
          </View>
          <FastImage source={{uri: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/35771931234507.564a1d2403b3a.gif', 
          priority: FastImage.priority.high,}} style={{
            width: 100, height: 100, marginTop: "24%"
          }}/>
          </Layout>
      </ApplicationProvider>
      )
    }else{
    return(
      <ApplicationProvider {...eva} theme={this.state.dark ? eva.dark : eva.light} >
        <Layout style={{flex: 1 }}>
          <ScrollView>
            <View style={{ backgroundColor: '#5000ca', width: Dimensions.get('window').width, height: 100 }}>
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox={"0 0 1440 320"}
              style={{ position: 'absolute', top: 100, marginBottom: 30 }}
              preserveAspectRatio="none"
            >
               <Path fill="#5000ca" fill-opacity="1" d="M0,224L48,186.7C96,149,192,75,288,85.3C384,96,480,192,576,208C672,224,768,160,864,133.3C960,107,1056,117,1152,122.7C1248,128,1344,128,1392,128L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
            </Svg>
            <Text category="h2" style={{textAlign: 'center', marginVertical: 10, marginTop: 30, color: 'white'}}>
            {this.state.language == 'en' ? "Join Contests, Win Prizes" : <PowerTranslator text="Join Contests, Win Prizes" target={this.state.language} />}</Text>
          </View>
          <View style={{marginTop: "30%", backgroundColor: 'transparent'}}>
          <List
            data={this.state.data}
            contentContainerStyle={{backgroundColor: 'transparent'}}
            keyExtractor={(item, idx) => idx}
            renderItem={this.renderList}
            ListEmptyComponent={this.Empty}
          />
          </View>
          </ScrollView>
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
      <ApplicationProvider {...eva} theme={this.state.dark ? eva.dark : eva.light} >
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
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      title: params.hashtag,
      headerTitleStyle: {color: params.dark ? '#fff' : '#000'},
      headerStyle: { elevation:0, backgroundColor: params.dark ? '#151a30' : '#fff' },
      headerTintColor: params.dark ? '#fff' : '#000'
    };
  };
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
    this.props.navigation.setParams({dark: dark})

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
      <ApplicationProvider {...eva} theme={this.state.dark ? eva.dark : eva.light} >
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
          title={props => <Text {...props}>{lan == 'en' ? 'Dark Theme' : <PowerTranslator text='Dark Theme' target={this.state.lanInW} />}</Text>}
          accessoryRight={props => <Toggle checked={this.state.dark} onChange={isChecked => this.switchTheme(isChecked)} status="success">
        </Toggle>} />
        <Divider />
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
  }
})

const App = createStackNavigator({
  Home: {
    screen: HomeScreen,
  },
  New : {
    screen: Create
  },
  ViewPost : {
    screen: ViewPost
  },
  Notifications : {
    screen: Notifications
  },
  Create : {
    screen: Create
  },
  Profile: {
    screen: Profile
  },
  Contests: {
    screen: Contests
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
  Conversations: {
    screen: Conversations
  },
  Settings : {
    screen: Settings
  }
},
{
  initialRouteName: 'Authentication',
})


export default createAppContainer(App)
