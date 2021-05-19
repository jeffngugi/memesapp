import React from 'react'
import {View, Text, TouchableOpacity, FlatList, ToastAndroid, Button, RefreshControl, Dimensions} from 'react-native'
import FastImage from 'react-native-fast-image'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default class Conversations extends React.Component{
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
        console.log(e)
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
        <TouchableOpacity style={{flexDirection: 'row', marginVertical: 10, alignItems: 'center'}} onPress={() => {
            this.props.navigation.navigate('Messaging', {
              current: this.state.user,
              otheruser: item.user,
              otheruserpic: item.userpic,
              dark: this.state.dark
            })
           }}>
        <FastImage style={{borderRadius: 50/2, height: 50, width: 50, }} 
        source={{ uri: item.userpic }}/>
        <View>
        <Text numberOfLines={1} style={{fontSize: 15, marginHorizontal: 15, fontWeight: 'bold', color: '#A7A7A7'}}>
            {item.user} <Text style={{fontWeight: 'normal', fontSize: 13}}>{item.time}</Text></Text>
        <Text style={{ fontSize: 18, marginLeft: 15, color: item.read ? 'black' : '#565656'}}>
          {item.text ? item.text.substring(0, 20) : '...'}</Text>
         </View>  
          {this.checkread(item.read,  item.time)}
        </TouchableOpacity>
    );
    checkread(read, time){
      if(read){
        return <View
       style={{height: 20, width: 20, borderRadius: 20/2, backgroundColor: '#0094FF', position: 'absolute', right :10}} />
      }
    }
    renderempty(){
      return ( 
        <View style={{justifyContent: 'center', alignItems: 'center', padding: 10}}>
      <FastImage source={{uri: 'https://thumbs.gfycat.com/DiligentCompleteBunny-small.gif'}} 
        style={{height:300, width:300, alignSelf:'center', marginVertical: 10, borderRadius: 10}}/>
      <Text style={{fontSize:18,
       fontWeight:'bold', textAlign:'center', color:'grey'}}>
      Empty Inbox! 
      </Text>
      <Text style={{fontSize:20,
       fontWeight:'bold', textAlign:'center', marginVertical: 10}}>
       Invite friends and let them join with you!!</Text>
       <Button title="Share the App" onPress={() => Share.share({
                message:
                  'Join me in Meeeme. Install now! https://play.google.com/store/apps/details?id=com.meme.lishup',
              })} />
      </View>
       );
    }
  
    render(){
      if(this.state.Loading){
        return(
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
            <FastImage source={{uri: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/35771931234507.564a1d2403b3a.gif', 
            priority: FastImage.priority.high,}} style={{
              width: 100, height: 100
            }}/>
            </View>
        )
      }else{
        if(this.state.data){
          var output = [...new Map(this.state.data.map(o => [o.user, o])).values()]
        }else{
          var output = this.state.data
        }
      return(
        <View style={{flex: 1, backgroundColor: 'white', padding: 10}} >
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
              ListHeaderComponent={<Text style={{margin: 10, marginLeft: 15, fontWeight: 'bold', fontSize: 20}}>Chats</Text>}
            />
          </View>
      )
    }
  }
  }