import React from 'react'
import {
  ScrollView, 
  ToastAndroid,
  View,
  TouchableOpacity,
  Dimensions,
  Modal,
  FlatList,
  Alert, RefreshControl, Share, BackHandler, Text as NativeText, 
  Image as NativeImage, Slider, PermissionsAndroid, TextInput,
} from 'react-native'
import CheckBox from '@react-native-community/checkbox'
import firestore from '@react-native-firebase/firestore'
import 'react-native-gesture-handler'
import {Overlay,} from 'react-native-elements'  
import Icon from 'react-native-vector-icons/Ionicons'
import Carousel from 'react-native-snap-carousel'
import Svg, {
 Path, Circle, Rect, G, Defs, Filter
} from 'react-native-svg'

import FastImage from 'react-native-fast-image'
import {Image} from 'react-native-elements'
import Marker from "react-native-image-marker"
import {
  GiphyUi
} from 'react-native-giphy-ui'
import ImagePicker from 'react-native-image-picker'
import RNFetchBlob from 'rn-fetch-blob'
import { DynamicCollage, StaticCollage } from 'react-native-images-collage'
import { CropView } from 'react-native-image-crop-tools'
import ViewShot from 'react-native-view-shot'
import Gestures from 'react-native-easy-gestures'
import { DragTextEditor } from 'react-native-drag-text-editor'
import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas'
import EnIcon from 'react-native-vector-icons/Entypo'
import CameraRoll from "@react-native-community/cameraroll"
import SwitchWithIcons from "react-native-switch-with-icons"

GiphyUi.configure('Qo2dUHUdpctbPSuRhDIile6Gr6cOn96H')

const twoMatrix = [[1, 1], [2]]
const threeMatrix = [[3], [2, 1], [1,2]]
const fourMatrix = [[2, 2], [3, 1], [2, 1, 1], [4]]
const colors = [
  {value: 'black'}, {value: 'brown'}, {value: '#FF0000'}, {value: '#FE7E00'}, {value: 'yellow'},
  {value: '#01FF01'}, {value: '#00EFFE'}, {value: '#0000FE'}, {value: '#FF00FE'}, {value: 'white'}, {value: 'grey'}
]
const brushSizes = [40, 30, 25, 20, 15, 12, 10, 8]

export default class Create extends React.Component{
  static navigationOptions = ({navigation}) => {
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
      redditTemplates: [],
      templates: [],
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
      captionScreen: false,
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
    this.getRedditTemplates()
    this.getTemplates()
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
    firestore()
     .collection('assets')
     .doc('templates')
     .onSnapshot(querySnapshot => {
       this.setState({templates: querySnapshot._data.list})
     })
  }
  renderGallery = ({item, idx}) => (
    <View>
      <TouchableOpacity onPress={() => this.selectPhotos(item)}
       style={{backgroundColor: 'black', margin: 5/3, }}>
    <Image key={idx} style={{
      width: (Dimensions.get('window').width / 3) - 1.5,
      height: Dimensions.get('window').width / 3,
      resizeMode: 'cover',
      opacity: this.state.images.includes(this.state.showPhotosFrom == 'templates' ? item.url :  item.node.image.uri) ? 0.5 : 1
    }}
    source={{ uri: this.state.showPhotosFrom == 'templates' ? item.url :  item.node.image.uri}}  />
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
  selectPhotos(item){
    if(this.state.showPhotosFrom != 'templates' && item.node.image.uri.split('.').pop() == 'gif'){
      if(this.state.images.includes(item.node.image.uri)){
        this.setState({images: [], numImages: 0})
      }else this.setState({images: [item.node.image.uri], numImages: 1})
     }else{
      if(this.state.images.includes(this.state.showPhotosFrom == 'templates' ? item.url : item.node.image.uri)){
        var i = 0;
        while (i < this.state.images.length) {
          if (this.state.images[i] === (this.state.showPhotosFrom == 'templates' ? item.url  : item.node.image.uri)) {
            let images = this.state.images
            images.splice(i, 1)
            this.setState({images: images,  numImages: this.state.numImages - 1})
          } else {
            ++i;
          }
        }
       } else{
        this.setState({images: this.state.showPhotosFrom == 'templates' ?
        [item.url]  : [...this.state.images, item.node.image.uri], numImages: this.state.showPhotosFrom == 'templates' ? 1 : this.state.numImages + 1})
       }
     }
  }
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
    const formData = new FormData()
    formData.append('image', {
       uri : this.state.meme,
       type: 'image/jpeg',
       name: this.state.meme.substring(this.state.meme.lastIndexOf('/') + 1)
    })
     const config = {
       method: 'POST',
       headers: {
           'Accept': 'application/json',
           'Content-Type': 'multipart/form-data',
        },
      body: formData,
     }
     fetch('https://storage.lishup.com/upload_files', config)
      .then(response => response.json())
      .then(responseJson => {
          if(responseJson.message == "successful"){
            let filename = this.state.meme.substring(this.state.meme.lastIndexOf('/') + 1)
            const name = filename.split('.').slice(0, -1).join('.')
            const url = 'https://storage.lishup.com/files/' + name + '.webp'
            this.setState({meme: url})
            fetch('https://lishup.com/app/newpost.php', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                  user: this.state.user, img: url, 
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
  searchTemplates(txt){
    if(txt.length > 2){
      const results = this.state.templates.filter(item => {
        return item.keyword.toLowerCase().match(txt.toLowerCase())
      })
      console.log(results, txt)
      this.setState({templates: results})
    }else if(txt.length == 0){
      this.getTemplates()
    }
  }
  getRedditTemplates(){
    fetch('http://34.133.61.41/', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      responseJson.shift()
      responseJson.shift()
      console.log(responseJson[0].preview.images[0].source.url)
      this.setState({redditTemplates: responseJson})
    })
  }
  render(){
    if(this.state.selectTemplate){
      return(
        <View style={{flex: 1, backgroundColor: 'black'}}> 
           <NativeText style={{color: 'white', top: 20, textAlign: 'center', fontSize: 20, marginBottom: 50,
              fontFamily: 'impact'}}>Choose Layout</NativeText>
           <TouchableOpacity style={{ top: 20, position: 'absolute', right: 20}} onPress={() =>{
             if(this.state.images[0].substring(this.state.images[0].length - 3, this.state.images[0].length) == 'gif'){
               this.setState({finalize: true, selectTemplate: false, meme: this.state.images[0], cachedMeme: this.state.images[0]})
             }else{
              if(this.state.numImages > 0 && this.state.numImages < 5){
                this.setState({selectTemplate: false, isResizing: false, showTextTools: false, showStickerTools: false, showImageTools: false,
                  matrix: this.state.numImages > 1 ? this.state.numImages == 2 ? twoMatrix[this._carousel.currentIndex] : this.state.numImages == 3 ?
                  threeMatrix[this._carousel.currentIndex] : fourMatrix[this._carousel.currentIndex] : [] })
                  this.addText()
               }else{
                 ToastAndroid.show('Please choose min 1 and max 4 Photos', ToastAndroid.SHORT)
               }
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
              
          <View style={{alignSelf: 'center', width: '100%', marginBottom: 15}} >
            <ScrollView horizontal>
            <TouchableOpacity onPress={() => this.getPhotos()}>
            <NativeText style={{color: 'white', opacity: this.state.showPhotosFrom == 'device' ?
              1 : 0.5, marginHorizontal: 10, fontSize: 15}} >Camera Roll</NativeText>
              </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({showPhotosFrom: 'templates'})}> 
            <NativeText style={{color: 'white', opacity: this.state.showPhotosFrom == 'templates' ?
              1 : 0.5, marginHorizontal: 10, fontSize: 15}}>Meme Templates</NativeText></TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({showPhotosFrom: 'redditTemp'})}> 
           <NativeText style={{color: 'white', opacity: this.state.showPhotosFrom == 'redditTemp' ?
              1 : 0.5, marginHorizontal: 10, fontSize: 15}}>Reddit Templates</NativeText></TouchableOpacity>
           <TouchableOpacity onPress={() => this.setState({showPhotosFrom: 'fromLink'})}> 
           <NativeText style={{color: 'white', opacity: this.state.showPhotosFrom == 'fromLink' ?
              1 : 0.5, marginHorizontal: 10, fontSize: 15}}>Add Template</NativeText></TouchableOpacity>
            </ScrollView>
          </View> 
          <View style={{height: Dimensions.get('window').height / 2.5}}>
          {this.state.showPhotosFrom == 'redditTemp' ?
          <FlatList
            data={this.state.redditTemplates}
            renderItem={({item, index}) => (
              <TouchableOpacity onPress={() => {
                if(this.state.images.includes(item.preview ? item.preview.images[0].source.url : '')){
                 var i = 0;
                 while (i < this.state.images.length) {
                   if (this.state.images[i] === (item.preview ? item.preview.images[0].source.url : '')) {
                     let images = this.state.images
                     images.splice(i, 1)
                     this.setState({images: images,  numImages: this.state.numImages - 1})
                   } else {
                     ++i;
                   }
                 }
                } else{
                 this.setState({images: [item.preview ? item.preview.images[0].source.url : ''], numImages: 1})
                }
             }}
              style={{backgroundColor: 'black', margin: 5/3, }}>
              <Image 
              style={{
                width: (Dimensions.get('window').width / 3) - 1.5,
                height: Dimensions.get('window').width / 3,
                resizeMode: 'cover',
                opacity: this.state.images.includes(item.preview ? item.preview.images[0].source.url : '') ? 0.5 : 1
              }}
              source={{uri: item.preview ? item.preview.images[0].source.url : ''}}/>
              </TouchableOpacity>
            )}
            numColumns={3}
             />
          : this.state.showPhotosFrom == 'fromLink' ? 
          <View>
            <TextInput 
            style={{backgroundColor: 'white', padding: 10, marginVertical: 10}} placeholder="Paste Link to use Template"
            onChangeText={url => this.setState({fromURL: url})}
            onEndEditing={() => this.setState({images: [this.state.fromURL], numImages: 1, selectTemplate: false})}
            keyboardType="url" />
          {this.state.fromURL ? <Icon name="arrow-forward-circle" size={40} color="#00BBFF"
            style={{ position: 'absolute', right: 10, }} 
            onPress={() => this.setState({images: [this.state.fromURL], numImages: 1, selectTemplate: false})} /> : null}
          </View>
          :<FlatList 
            data={this.state.showPhotosFrom == 'templates' ? this.state.templates : this.state.photos}
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
             ListHeaderComponent={this.state.showPhotosFrom == 'templates' ? <>
              <TextInput 
              style={{backgroundColor: 'white', padding: 10}} placeholder="Search Templates" onChangeText={val => this.searchTemplates(val)} /></> : null}
          />}</View>
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
         marginTop: this.state.textAtTop && this.state.textArea ? 70 : 0, backgroundColor: 'transparent', alignSelf: 'flex-start' }}>
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
        {this.state.textAtTop && this.state.textArea  ?  <NativeImage source={require('../../textArea.png')} style={{width: '100%', 
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
    {!this.state.textAtTop && this.state.textArea ?  <NativeImage source={require('../../textArea.png')} style={{width: '100%', 
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
    }else if(this.state.finalize && !this.state.Posted && !this.state.captionScreen){
      return(
        <View style={{flex: 1, backgroundColor: 'black'}}> 
         <TouchableOpacity style={{marginTop: 30, marginLeft: 20, position: 'absolute', zIndex: 10}} 
         onPress={() => this.setState({finalize: false, showTextTools: false, showStickerTools: false, showImageTools: false,
            isResizing: false})}>
           <Icon name="arrow-back-circle" color="#00BBFF" size={50}/>
          </TouchableOpacity>
          <NativeText style={{color: 'white', top: 30, textAlign: 'center', fontSize: 25, fontFamily: 'impact', marginBottom: 50}}>Share</NativeText>

          <NativeImage source={{uri: this.state.meme}} style={{height: '50%', width: '99%', alignSelf: 'center',
            marginTop: 0}} resizeMode="contain" />
            <ScrollView>
         <TouchableOpacity style={{backgroundColor: '#00BBFF', padding: 10, paddingHorizontal: 45, borderRadius: 15, marginTop: 30, alignSelf: 'center'}} 
          onPress={() => this.setState({captionScreen: true})}>
            <NativeText style={{color: 'white', fontSize: 30}}>Next</NativeText></TouchableOpacity>
            <TouchableOpacity style={{backgroundColor: '#5200FF', padding: 10, 
     flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25, borderRadius: 15, marginTop: 10, alignSelf: 'center'}} 
          onPress={() => {
            Marker.markImage({
              src: this.state.cachedMeme, 
              markerSrc: 'https://cdn.discordapp.com/attachments/802689859822420028/859712706268233784/watermark_1.png', 
              position: 'bottomRight', 
              scale: 1, 
              markerScale: 0.5, 
              quality: 100
           }).then((path) => {
              CameraRoll.save('file://' + path)
              ToastAndroid.show('Meme Saved to Phone', ToastAndroid.SHORT)  
           })
        }}>   
          <Icon name="ios-download" size={25} color="white" />            
          <NativeText style={{color: 'white', fontSize: 25, marginLeft: 5}}>Save to Phone</NativeText></TouchableOpacity>  
         
          </ScrollView>
        </View>   
      )  
    } if(this.state.finalize && !this.state.Posted && this.state.captionScreen){
      return (
        <View style={{flex: 1, backgroundColor: 'black'}}> 
            <TouchableOpacity style={{marginTop: 30, marginLeft: 20, position: 'absolute', zIndex: 10}} 
            onPress={() => this.setState({captionScreen: false})}>
              <Icon name="arrow-back-circle" color="#00BBFF" size={50}/>
            </TouchableOpacity>
            <NativeText style={{color: 'white', top: 30, textAlign: 'center', fontSize: 25, fontFamily: 'impact', marginBottom: 50}}>
              Add Caption</NativeText>
            <NativeImage source={{uri: this.state.meme}} style={{height: '50%', width: '99%', alignSelf: 'center',
               marginTop: 0}} resizeMode="contain" />
            <TextInput style={{backgroundColor:'#f2f2f2', width: '90%',  padding: 15, marginBottom: 0,
            fontSize: 15, 
            textAlign: 'center', margin: 0, fontSize: 25, marginTop: 50, borderRadius: 20, alignSelf: 'center'}}
            placeholder="Add a Caption" maxLength={50}
            onChangeText={val => this.setState({caption: val})} value={this.state.caption} />
            <TouchableOpacity style={{backgroundColor: '#00BBFF', padding: 10, paddingHorizontal: 45, borderRadius: 15, marginTop: 30, alignSelf: 'center'}} 
              onPress={() => this.post()}>
            <NativeText style={{color: 'white', fontSize: 30}}>Post</NativeText></TouchableOpacity>
          </View>
      )
    } else if(this.state.Posted && !this.state.finalize){
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