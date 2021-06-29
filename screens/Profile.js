import React from 'react'
import {View, TouchableOpacity, FlatList, ScrollView, Text as NativeText, ImageBackground, BackHandler, Dimensions, Share, 
   ToastAndroid} from 'react-native'
import * as eva from '@eva-design/eva'
import { ApplicationProvider, Layout, Button, ButtonGroup,
   Input, Avatar, List, ListItem, Toggle, Text, Select, SelectItem, IndexPath } from '@ui-kitten/components'
import {Card, Divider, Overlay, ListItem as ElementList, Image} from 'react-native-elements' 
import Carousel, {ParallaxImage} from 'react-native-snap-carousel'
import FastImage from 'react-native-fast-image'
import {Svg, Path} from 'react-native-svg'
import EnIcon from 'react-native-vector-icons/Entypo'
import FIcon from 'react-native-vector-icons/Feather'
import Icon from 'react-native-vector-icons/Ionicons'
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
import {PowerTranslator, ProviderTypes, TranslatorConfiguration} from 'react-native-power-translator'
import AsyncStorage from '@react-native-async-storage/async-storage'
import io from 'socket.io-client'
import ImagePicker from 'react-native-image-picker'
import RNFetchBlob from 'rn-fetch-blob'

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

  export default class Profile extends React.Component{
  
    static navigationOptions = ({navigation}) => {
      const { params = {} } = navigation.state
      return {
        header: null
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
      language: 'en',
      flairs: [],
      sunglasses: []
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
          this.getFlairs('flairs')
          this.getFlairs('sunglasses')
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
    getFlairs(type){
      fetch('https://lishup.com/app/profileFlairs.php?type=' + type, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(responseJson => {
        if(type == "flairs"){
          this.setState({flairs: responseJson})
        }else{
          this.setState({sunglasses: responseJson})
        }
        console.log(responseJson)
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
          <View style={{flexDirection: 'row', alignSelf: 'center', marginVertical: 30, marginTop: 40}}>
              <TouchableOpacity style={{backgroundColor: 'transparent', borderRadius: 30}}
               onPress={async() => {
                 await Share.share({
                   message: '<a href="lishup://meme/profile?user=' + this.state.profileUser + '">Visit My Profile in Meme</a>'
                 })
               }}><FIcon color="#424E60" name="share-2" size={25} /></TouchableOpacity>
          </View>
        )
      }else{
        return (
          <View style={{flexDirection: 'row', alignSelf: 'center', marginVertical: 30, marginTop: 40}}>
              <Button appearance='ghost' style={{backgroundColor: 'transparent', borderRadius: 30 }}
              onPress={() => this.props.navigation.navigate('Messaging', {
                current: this.state.user,
                otheruser: this.state.profileUser,
                otheruserpic: this.state.data.pic,
                dark: this.state.dark
              })}><FIcon name="message-circle" color="#0094ff" size={25} /></Button>
              <Button appearance='ghost' style={{backgroundColor: 'transparent', borderRadius: 30}}
               onPress={async() => {
                 await Share.share({
                   message: 'lishup://meme/profile?user=' + this.state.profileUser
                 })
               }}><FIcon name="share-2" color="#424E60" size={25} /></Button>
          </View>
        )
      }
    }
    buyFlair(type, index){
  
      ToastAndroid.show('Changing to your awesome Flair', ToastAndroid.SHORT)
      let data = this.state.data
      if(type == 'profile_flair'){
        data.flair = this.state.flairs[index].url
        var flairURL = this.state.flairs[index].url
        var flairPrice = this.state.flairs[index].price
      }else{
        data.sunglass = this.state.sunglasses[index].url
        var flairURL = this.state.sunglasses[index].url
        var flairPrice = this.state.sunglasses[index].price
      }
      data.points = data.points - parseInt(flairPrice)
      this.setState({data: data})
      fetch('https://lishup.com/app/updateFlair.php', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
             flair: flairURL,
             cost: flairPrice,
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
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <FIcon name="arrow-left" size={25} style={{margin: 20}} onPress={() => this.props.navigation.goBack()} />
          <View style={{flexDirection: 'row', alignItems:'center', marginTop: 0, alignSelf: 'flex-end'}}>
            <TouchableOpacity style={{zIndex: 5}} onPress={() => this.setState({moreOptions: true})}>
              <EnIcon name="dots-three-horizontal" size={20} color="black" />
            </TouchableOpacity>  
            <TouchableOpacity style={{ borderColor: 'transparent', backgroundColor: '#0094FF', padding: 15, paddingHorizontal: 20,
            marginHorizontal: 20, borderRadius: 12}}
            onPress={() => this.follow(this.state.profileUser)}>
              <Text style={{fontSize: 15, color: 'white'}}>Follow</Text></TouchableOpacity>
              </View></View>)
          
        } else if(this.props.navigation.getParam('isfollowing') == 'yes') { 
        return <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <FIcon name="arrow-left" size={25} style={{margin: 20}} onPress={() => this.props.navigation.goBack()} />
        <View style={{flexDirection: 'row', alignItems:'center', marginTop: 0, alignSelf: 'flex-end'}}>
        <TouchableOpacity style={{zIndex: 5}} onPress={() => this.setState({moreOptions: true})}>
              <EnIcon name="dots-three-horizontal" size={20} color="black" />
            </TouchableOpacity>
        <TouchableOpacity style={{ borderWidth: 2, borderColor: '#0094FF', padding: 5, paddingHorizontal: 10,
        marginHorizontal: 20, borderRadius: 12, backgroundColor: '#0094FF'}}
        onPress={() => this.follow(this.state.profileUser)}>
          <FIcon name="check" color="white" size={30} /></TouchableOpacity>
        </View></View>
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
          <ScrollView style={{backgroundColor: '#fff', width: "100%" }}
               horizontal={true}>
               <View style={{width: Dimensions.get('window').width / 2, alignContent: 'center', marginVertical: 10}}>
                  <FastImage source={require('../GemsIcons/1.png')} style={{height: 100, width: 100, alignSelf: 'center'}} resizeMode="contain"/>
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
                  <FastImage source={require('../GemsIcons/2.png')} style={{height: 100, width: 100, alignSelf: 'center'}} resizeMode="contain"/>
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
                  <FastImage source={require('../GemsIcons/3.png')} style={{height: 100, width: 100, alignSelf: 'center'}} resizeMode="contain"/>
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
                  <FastImage source={require('../GemsIcons/5.png')} style={{height: 100, width: 100, alignSelf: 'center'}} resizeMode="contain"/>
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
              <ScrollView style={{backgroundColor: '#fff', width: "100%" }}
               horizontal={true}>
                 <TouchableOpacity onPress={() =>  this.removeFlair('profile_flair') } style={{backgroundColor: 'rgba(0, 0, 0, 0.1)', borderRadius: 10, height: 200, width: 200,
                   margin: 10, justifyContent: 'center'}}>
                     <Text style={{alignSelf: 'center', fontSize: 20}}>{this.state.language == 'en' ? 'None' : 
              <PowerTranslator text="None" 
                        target={this.state.language} />}</Text>
                </TouchableOpacity>
                <FlatList
                data={this.state.flairs}
                renderItem={({item, index}) => (
                 <TouchableOpacity onPress={() => {
                  this.setState({previewFlair: true}) 
                  setTimeout(() => this._previewCarousel.snapToItem(index), 500)
                 }  }>
                <FastImage source={{uri: item.url}} style={{height: 200, width: 200, borderRadius: 10, alignSelf: 'center', margin: 10}} resizeMode="cover"
                   /></TouchableOpacity>
                )}
                horizontal
                />
              </ScrollView>
              <Text category="h6" style={{marginLeft: 10, marginVertical: 10}}>{this.state.language == 'en' ? 'Sunglasses' : 
              <PowerTranslator text="Sunglasses" 
                        target={this.state.language} />}</Text>
              <ScrollView style={{backgroundColor:'#fff', width: "100%", paddingBottom: 50}}
               horizontal={true}>
                 <TouchableOpacity onPress={() => this.removeFlair('profile_sunglass') } style={{height: 100, width: 100, borderRadius: 10, margin: 10,
                   justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.1)'}}>
                <Text style={{alignSelf: 'center', fontSize: 20}} 
                   >{this.state.language == 'en' ? 'None' : 
                   <PowerTranslator text="None" 
                             target={this.state.language} />}</Text></TouchableOpacity>
                   <FlatList
                data={this.state.sunglasses}
                renderItem={({item, index}) => (
                  <TouchableOpacity onPress={() => {
                    this.setState({previewSunglass: true}) 
                    setTimeout(() => this._sgPreviewCarousel.snapToItem(index), 500)
                  }}>
                  <FastImage source={{uri: item.url}} style={{height: 100, width: 100, borderRadius: 10, alignSelf: 'center', margin: 10}} resizeMode="contain"
                     /></TouchableOpacity>  
                )}
                horizontal
                />    
              </ScrollView>
            </View>
        )
      }
    }
    renderPreviewFlair = ({item, index}) => (
      <View style={{width: "90%", height: "90%", justifyContent: 'center',
      borderRadius: 30, margin: "5%" }}>
    <ImageBackground source={{uri: item.url}} style={{flex: 1,
      borderRadius: 30, alignContent: 'center', justifyContent: 'center', overflow: 'hidden', marginVertical: 20}} 
      imageStyle={{borderRadius: 30}}>
      <Avatar 
           style={{alignSelf: 'center', elevation: 20, backgroundColor: '#0000', width: 100, 
             height: 100}}
           source={{uri: this.state.data.pic}} 
        />
    </ImageBackground>    
    <Button onPress={() => this.buyFlair('profile_flair', index)}>Grab it {item.price} Gems</Button>
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
            <FastImage source={{uri: item.url }} 
              style={{height: 80, width: 80, position: 'absolute', elevation: 25, alignSelf: 'center'}} resizeMode="contain" />
         </ImageBackground>    
         <Button onPress={() => this.buyFlair('profile_sunglass', index)}>Snatch it {item.price} Gems</Button>
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
    chooseColor(){
      const array = ['#00D2EF', '#FE007A', '#8000FE', '#FFC700', '#00FF29', '#FF0000']
      const randomElement = array[Math.floor(Math.random() * array.length)]
      return randomElement
    }
    render(){
      if(this.state.loading){
        return(
          <ApplicationProvider
      {...eva}
      theme={eva.light }>
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
        <ApplicationProvider {...eva} theme={eva.light}>
          <Layout style={{flex: 1}}>
          <ScrollView style={{flex: 1, paddingTop: 40}} showsVerticalScrollIndicator={false}>
          {this.state.user == this.state.profileUser ? (
             <View style={{flexDirection: 'row', paddingBottom: 5, alignSelf: 'flex-end'}}>
              <TouchableOpacity onPress={() => this.setState({changePhoto: true})} style={{marginHorizontal: 20, marginRight:15}}>
                <FIcon name="edit" size={30} color='#424E60' />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Settings', {dark: this.state.dark})} style={{
                 marginHorizontal: 20}}>
                <FIcon name="settings" size={30} color='#424E60' />
              </TouchableOpacity></View> 
          ) : this.followbtn() } 
              <View style={{alignSelf: 'flex-start', marginLeft: 50}}>
               <Text category="h5" style={{ textAlign: 'left', marginTop: 10}}>{this.state.data.fullName}</Text>
               <Text style={{opacity: 0.6}} style={{ textAlign: 'left', color: '#5B5B5B'}}>@{this.state.profileUser}</Text>
              </View>
              <View style={{flexDirection: 'row'}}> 
                <View style={{ alignContent: 'flex-end', width: "60%"}}>
                <View style={{ width: "100%", height: (Dimensions.get('window').width * 80) / 100}}>
                <View style={{width: "90%", height: "100%", justifyContent: 'center', alignSelf: 'flex-end', alignContent: 'flex-end',
                    borderRadius: 30, marginLeft: "10%" }}>
                  <ImageBackground source={{uri: this.state.data.flair}} style={{flex: 1,
                    borderRadius: 30, alignContent: 'center', justifyContent: 'center', overflow: 'hidden', marginVertical: 20,
                     borderColor: this.state.dark ? 'white' : 'black', borderWidth: this.state.flair ? 0 : 1, backgroundColor: this.state.flair ? 'transparent' : this.chooseColor() }} 
                    imageStyle={{borderRadius: 30}}>
                    <Avatar 
                         style={{alignSelf: 'center', elevation: 20, backgroundColor: '#0000', width: 100, 
                           height: 100, borderWidth: this.state.flair ? 1 : 0, borderColor: 'black'}}
                         source={{uri: this.state.data.pic}} 
                      />
                    <FastImage source={{uri: this.state.data.sunglass }} 
                     style={{height: 80, width: 80, position: 'absolute', elevation: 25, alignSelf: 'center'}} resizeMode="contain" />
                  </ImageBackground>    
                  </View>
                  </View>
                <Text style={{textAlign: 'left', marginHorizontal: 10, marginLeft: 30, alignSelf: 'center'}}
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
              <View style={{flexDirection: 'row', backgroundColor: 'transparent', borderTopColor: '#D8DADE', justifyContent: 'space-evenly',
                 borderTopWidth: 1, padding: 10, marginVertical: 20, marginTop: 50}}>
                {this.state.profileUser == this.state.user ? <TouchableOpacity onPress={() => this.setState({showContent: 'store'})}>
                  <FIcon name="shopping-bag" color= '#424E60'  style={{opacity: this.getShowCase('store')}} size={35} />
                </TouchableOpacity> : null }
                <TouchableOpacity onPress={() => this.setState({showContent: 'posts'})}>
                  <Icon name="reorder-four-outline" color='#424E60'  style={{opacity: this.getShowCase('posts')}} size={35} />
                </TouchableOpacity>
                {this.state.profileUser == this.state.user ? <TouchableOpacity onPress={() => this.setState({showContent: 'bookmarks'})}>         
                   <FIcon name="bookmark" color='#424E60'  style={{opacity: this.getShowCase('bookmarks')}} size={35} />
                </TouchableOpacity> : null}
              </View>
              <Layout style={{width: "100%", padding: 10}}>
                 {this.showCase()}
              </Layout>
            </ScrollView>
            <Overlay isVisible={this.state.changePhoto} onBackdropPress={() => this.setState({changePhoto: !this.state.changePhoto})}
           overlayStyle={{width: "80%", height: "70%", backgroundColor: this.chooseColor(), padding: 20 }}  animationType="slide">
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
               <Avatar source={{uri: this.state.newAvatar ? this.state.newAvatar : this.state.data.pic}} 
                      size="giant" style={{width: 120, height: 120, borderRadius: 60}} />
               <Button onPress={() => this.takepic()} style={{margin: 15}}
               >Choose Photo</Button>
                    {this.state.newAvatar ? <Button onPress={() => this.uploadpic()} style={{marginTop: 35, width: "75%"}}>Upload Photo</Button> : null}
            </View>
            </Overlay>
  
            <Overlay isVisible={this.state.moreOptions} onBackdropPress={() => this.setState({moreOptions: !this.state.moreOptions})}
           overlayStyle={{width: "80%", height: 200, padding: 20,
           borderRadius: 20 }}  animationType="slide">
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
             <TouchableOpacity
               onPress={() => this.setState({moreOptions: false, reportUser: true})}><Icon name="alert-circle" size={50} color={this.state.dark ? '#fff' : '#2E3A59'} /></TouchableOpacity>
            <TouchableOpacity 
                onPress={() => {  Clipboard.setString('lishup://meme/profile?user=' + this.state.profileUser)
                ToastAndroid.show('Copied Profile Link', ToastAndroid.SHORT)
                }}><Icon name="copy" size={50} color={this.state.dark ? '#fff' : '#2E3A59'} /></TouchableOpacity>
            </View>
            </Overlay>
  
            <Overlay isVisible={this.state.reportUser} onBackdropPress={() => this.setState({reportUser: !this.state.reportUser})}
           overlayStyle={{width: "80%",  height: "50%", borderRadius: 50, paddingHorizontal: 30 }}  animationType="fade">
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: this.state.dark ? '#101426' : '#fff'}}>
             <Input placeholder="Let us know what is wrong" maxLength={100} textStyle={{minHeight: 60}}
             multiline={true}  onChangeText={val => this.setState({reportReason: val})} />
             <Button status="danger" style={{margin: 10, alignSelf: 'flex-end'}}
             onPress={() => this.reportUser()}>Report</Button>
            </View>
            </Overlay>
  
            <Overlay isVisible={this.state.previewFlair} onBackdropPress={() => this.setState({previewFlair: !this.state.previewFlair})}
           overlayStyle={{width: "80%", height: "60%", backgroundColor: 'transparent', elevation: 0, zIndex: 30 }}  animationType="slide">
               <Carousel
                ref={(ref) => this._previewCarousel = ref}
                data={this.state.flairs}
                renderItem={this.renderPreviewFlair}
                sliderWidth={(Dimensions.get('window').width * 80) / 100}
                sliderHeight={(Dimensions.get('window').height * 50) / 100}
                itemWidth={(Dimensions.get('window').width * 80) / 100}
                enableMomentum={true}
              />
              <View style={{flexDirection: 'row-reverse', justifyContent: 'space-between'}}>
              <TouchableOpacity style={{backgroundColor: '#00BBFF', borderRadius: 25, height: 50, width: 50, 
                justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-end'}}
                onPress={() => this._previewCarousel.snapToNext()}>
                <FIcon name="arrow-right" size={30} color="white"/>
              </TouchableOpacity>
              <TouchableOpacity style={{backgroundColor: '#00BBFF', borderRadius: 25, height: 50, width: 50, 
                justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-start'}}
                onPress={() => this._previewCarousel.snapToPrev()}>
                <FIcon name="arrow-left" size={30} color="white"/>
              </TouchableOpacity>
              </View>
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
                data={this.state.sunglasses}
                renderItem={this.renderPreviewSg}
                sliderWidth={(Dimensions.get('window').width * 80) / 100}
                sliderHeight={(Dimensions.get('window').height * 50) / 100}
                itemWidth={(Dimensions.get('window').width * 80) / 100}
                enableMomentum={true}
              />
            </Overlay>
            </Layout>
        </ApplicationProvider>
      )
      }
    }
  }