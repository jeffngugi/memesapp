import React from 'react'
import {View, Text, TouchableOpacity, TextInput, ScrollView, Dimensions, ActivityIndicator, ToastAndroid} from 'react-native'
import { FlatList, TouchableHighlight } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Feather'
import {Svg, Path} from 'react-native-svg'
import AsyncStorage from '@react-native-async-storage/async-storage'
import FastImage from 'react-native-fast-image'

export default class Search extends React.Component{
    state = {
      dark: false,
      loading: true,
      language: 'en',
      data: [],
      detailsData: [{'deadline': 'abc'}],
      activeOption: 'Contests 🏆',
      imageUrls: [],
      userData:[],
      searchResult: [],
      memeResult: [],
      memePhotos: [],
      isSearching:false,
      activeSearchOption: 'user',
      user: ''
    }
    componentDidMount () {
      const { params } = this.props.navigation.state
      const user = params ? params.user : null
      const dark = params ? params.dark : null

      this.setState({user: user})
  
      this.fetch()
      this.fetchUser()
      this.fetchLanguage()
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
        this.state.data.map(item => this.fetchContestDetails(item.id))
      })
      .catch((err) => {
        console.log(err)
        ToastAndroid.show('Request Failed', ToastAndroid.SHORT)
      })
    }
    fetchContestDetails(id){
        fetch('https://lishup.com/app/fetchContests.php', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            id: id,
            user: this.state.user
        }),
      })
      .then((response) => response.json())
      .then((responseJson) => {
          for(var i =0; i < Object.keys(this.state.data).length; i++){
            if(this.state.data[i].id == id){
              let copy = this.state.data
              copy[i].details = responseJson[0]
              this.setState({data: copy})
            }
          }
          console.log(responseJson[0])
          Promise.all(
            responseJson[0].posts.map(({ image }) => this.fetchImage(image))
          ).then((imageUrls) => {this.setState({ imageUrls })
           })
      })
      .catch((err) => {
        console.log(err)
        ToastAndroid.show('Request Failed', ToastAndroid.SHORT)
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
    fetchUser(){
      fetch('https://lishup.com/app/topUsers.php', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({userData: responseJson.sort((a, b) => {
            if(parseInt(a.points) < parseInt(b.points)) return 1 
            if(parseInt(a.points) > parseInt(b.points)) return -1 
            if(parseInt(a.loves) < parseInt(b.loves)) return 1 
            if(parseInt(a.loves) > parseInt(b.loves)) return -1 
            if(parseInt(a.followers) < parseInt(b.followers)) return 1 
            if(parseInt(a.followers) > parseInt(b.followers)) return -1 
          })})
        })
    }

    countTime(time){
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        const firstDate = new Date()
        const secondDate = new Date(time)

        const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay))
        return diffDays
    }
    searchUser(key){
      if(key == ''){
        this.setState({isSearching: false})
      }else{
      this.setState({isSearching: true})
      fetch('https://lishup.com/app/searchuser.php', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword: key, id: 'gtlishup' }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({searchResult: responseJson})
        })

        fetch('https://lishup.com/app/searchmeme.php', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ keyword: key, id: 'gtlishup' }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            this.setState({memeResult: responseJson})
            console.log(responseJson)
            Promise.all(
              responseJson.map(({ image }) => this.fetchImage(image))
            ).then((imageUrls) => {this.setState({ memePhotos: imageUrls })
             })
          })   
    }
  }
    fetchLanguage =async() => {
      var lan = await AsyncStorage.getItem('language')
      this.setState({language: lan ? lan : 'en'})
  
      console.log(this.state.language)
    }
    renderList = ({item, index}) => (
       <View style={{backgroundColor: 'white'}}>
         <View style={{alignItems: 'center', flexDirection: 'row'}}>
          <Text style={{fontWeight: 'bold', fontSize: 18, alignItems: 'center'}}>#{item.title.replace(/ /g, '')} <Text style={{color: '#ED0064', fontWeight: 'bold', fontSize: 12}}>
               <Svg width="15" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Path d="M2 5.71165L11.0619 14L20.1239 5.71165L17.2506 1.51221H4.8733L2 5.71165Z" fill="#F10065" stroke="#ED0064" stroke-width="0.221023"/>
                </Svg>{item.prize}</Text>
                </Text>
            <Text style={{position: 'absolute', right: 5, color: '#DBDBDB', fontSize: 12}}>
                  {item.details ? this.countTime(item.details.deadline) : null} day(s) remaining</Text>   
          </View>   
          <Text style={{color: '#A7A7A7', fontWeight: 'bold', fontSize: 15}}>
            {item.details ? Object.keys(item.details.posts).length : null} Posts</Text>
          <ScrollView horizontal style={{marginTop: 10}}>
          {item.details ? 
          item.details.posts.map((v, i) => {
            return this.state.imageUrls[i] ?
            <TouchableOpacity onPress={() => this.props.navigation.navigate('ViewPost', {id: v.id, dark: this.state.dark})}>
            <FastImage source={{uri: v.user}} 
              style={{height: 30, width: 30, borderRadius: 15, position: 'absolute', top: 10, left: 10, elevation: 5}} />
            <FastImage source={{uri: this.state.imageUrls[i][0]}}
            style={{width: Dimensions.get('window').width/2.6, height: Dimensions.get('window').width/2.6, borderRadius: 10, marginHorizontal: 5}}
              /></TouchableOpacity>
            : null
          })  : null} 
          </ScrollView>
       </View>   
    )
    Empty(){
      return(
        <Text category="h6" style={{textAlign: 'center'}}>Blah bleh :P</Text>
      )
    }
    renderOptions = ({item, idx}) => (
        <TouchableOpacity style={{backgroundColor: this.state.activeOption == item ? '#0596FF' : '#BCBCBC', padding: 10, margin: 15, marginHorizontal: 8,
           borderRadius: 15, height: 40, paddingHorizontal:15}}
           onPress={() => this.setState({activeOption: item, isSearching: false})} key={idx}>
        <Text style={{color :'white', fontWeight: 'bold'}}>
            {item}
        </Text>
        </TouchableOpacity>
    )
    renderUserList = ({item, idx}) => (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', {user: item.user, dark: this.state.dark})} key={item.id}>
      <View style={{flexDirection: 'row', alignItems: 'center'}} >
        <FastImage source={{uri: 
          item.photo ? item.photo : 'https://i.imgur.com/lhMoU6As.png'}} 
          style={{height: 50, width: 50, borderRadius: 25, margin: 10, marginVertical: 5}} />
        <Text style={{fontWeight: 'bold', fontSize: 15, width: '100%'}}>{item.fullName} <Text style={{fontSize: 12, 
        color: '#BCBCBC'}}>@{item.user}</Text></Text>
      </View>
      </TouchableOpacity>
    )
    renderMemeList = ({item, index}) => (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('ViewPost', {id: item.id, dark: this.state.dark})}
        style={{margin: 5, marginBottom: 10}}>
            <FastImage source={{uri: item.photo}} style={{height: 30, width: 30, position: 'absolute', top: 10, left: 10, 
          borderRadius: 15, elevation: 10}} />
            <FastImage source={{uri: this.state.memePhotos[index][0]}}
               style={{height: (Dimensions.get('window').width/2)-20, width: (Dimensions.get('window').width/2)-20, borderRadius: 20}} 
               resizeMode="cover" />
        <Text style={{color: '#565656', marginLeft: 10, fontSize: 15, width: (Dimensions.get('window').width/2)-20}}>{item.text}</Text>       
        {parseInt(item.loves) > 0 ? <Text style={{color: '#ababab', marginLeft: 10}}><Icon name="heart" color="#ababab"/> {item.loves}</Text>  : null} 
       </TouchableOpacity>
    )
    render(){
      return(
          <View style={{flex: 1, backgroundColor:'white'}}>
            <View style={{flexDirection: 'row', alignItems: 'center', }}>
                <Icon name="search" color="#D3D3D3" size={30} style={{position: 'absolute', zIndex: 5, left: 10}} />
            <TextInput placeholder="Search Meeeme" ref={input => { this.textInput = input }} style={{backgroundColor: '#F3F3F3', padding: 10,
            paddingLeft: 45, fontSize: 15, paddingVertical: 15,
        width: Dimensions.get("window").width}} onChangeText={val => this.searchUser(val) }/>
              {this.state.isSearching ? <Icon name="x" color="#D3D3D3" size={30} style={{position: 'absolute', zIndex: 5, right: 10}}
                  onPress={() =>{
                    this.setState({isSearching: false})
                    this.textInput.clear()
                  } } /> : null}
            </View>
           {this.state.isSearching ? null :  <View>
            <FlatList
               data={['Contests 🏆', 'Top Users']}
               renderItem={this.renderOptions}
               keyExtractor={({item, idx}) => idx}
               horizontal
             />
           </View> } 
           <View style={{paddingLeft: 10}}>
            {this.state.isSearching ?
              <>
              <View style={{width: Dimensions.get('window').width, flexDirection: 'row', marginBottom: 10}}>
                  <TouchableOpacity onPress={() => this.setState({activeSearchOption: 'user'})}
                  style={{width: Dimensions.get('window').width/2, backgroundColor: this.state.activeSearchOption == 'user' ? '#EBEBEB' : '#fff', padding: 10}}>
                    <Text style={{textAlign: 'center', fontWeight: 'bold',
                  color: this.state.activeSearchOption == 'user' ? 'black' : '#BCBCBC'}}>Users</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.setState({activeSearchOption: 'meme'})} 
                  style={{width: Dimensions.get('window').width/2, backgroundColor: this.state.activeSearchOption == 'meme' ? '#EBEBEB' : '#fff', padding: 10}}>
                    <Text  style={{textAlign: 'center', fontWeight: 'bold',
                    color: this.state.activeSearchOption == 'meme' ? 'black' : '#BCBCBC' }}>Memes</Text>
                  </TouchableOpacity>
                </View>
               {this.state.activeSearchOption == 'user' ? 
                  <FlatList
                  key={'#'}
                  data={this.state.searchResult}
                  renderItem={this.renderUserList}
                  extraData={this.state}
                /> : 
                Object.keys(this.state.memePhotos).length > 0 ?
                <FlatList
                   key={'_'}
                        data={this.state.memeResult}
                        renderItem={this.renderMemeList}
                        extraData={this.state.imageUrls}
                        numColumns={2}
                        ListFooterComponent={<View style={{height: 100}} />}
                    /> : null} 
              </>
            : this.state.activeOption == 'Contests 🏆' ? 
               this.state.loading ? <ActivityIndicator size="large" color="#0000ff" /> :
               <FlatList
                    data={this.state.data}
                    renderItem={this.renderList}
                    keyExtractor={({item, idx}) => idx}
                    extraData={this.state}
                 /> : Object.keys(this.state.userData) == 0 ? <ActivityIndicator size="large" color="#0000ff" /> :
                 <FlatList
                      data={this.state.userData}
                      renderItem={this.renderUserList}
                   /> }
            </View>
          </View>
      )
    }
  }