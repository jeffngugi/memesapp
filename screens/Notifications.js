import React from 'react'
import {View, Text, TouchableOpacity, FlatList, RefreshControl} from 'react-native'
import FastImage from 'react-native-fast-image'
import Icon from 'react-native-vector-icons/Feather'
import {Svg, Path} from 'react-native-svg'

export default class Notifications extends React.Component{

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
    title(txt){
      if(txt.substring(0, 36) == '<i class="fa fa-comments"></i>      '){
        return <Text style={{fontSize: 16}}>{txt.substring(36, txt.length)}</Text>
      }else{
        return <Text style={{fontSize: 16}}>{txt}</Text>
      }
    }
    right(txt){
        if(txt.substring(txt.length - 17, txt.length) == "Loved your Leash!"){
          return <Icon name="heart" color="red" size={30} />
        }else if(txt.substring(txt.length - 23, txt.length) == " Mentioned You in his Reaction to this Leash!"){
          return <Icon  name="at-sign" color='black' size={30} />
        }else if(txt.substring(0, 36) == '<i class="fa fa-comments"></i>      '){
          return <Icon  name="at-sign" color='black' size={25} />
        }else if(txt.substring(txt.length - 16, txt.length) == "Loved your Post!"){
          return <Icon name="heart" color="red" size={30} />
        }else if(txt.substring(txt.length - 5, txt.length) == "Gems!"){
          return <Svg width="30" height="25" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <Path d="M19.1358 4.50423L9.87037 12.9787L0.604947 4.50423L3.37217 0.459825H16.3686L19.1358 4.50423Z" fill="#ED0063" stroke="#ED0063" stroke-width="0.91965"/>
          </Svg>
        }else{
          return <Icon name="eye" color='#4DA6FF' size={25} />
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
       <TouchableOpacity onPress={() => this.navigate(item.text, item.extra)} style={{flexDirection: 'row', alignItems: 'center',
         padding: 10}}>
           <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', {user: item.user, dark: this.state.dark })}>
             <FastImage source={{uri: item.avatar}} style={{height: 50, width: 50 ,borderRadius: 25, zIndex: 10}}/>
            </TouchableOpacity>
           <View>
              <Text style={{fontSize: 14, color: '#A7A7A7', fontWeight: 'bold', marginLeft: 5}}>
                {item.user} <Text style={{color: '#cdcdcd', marginLeft: 5, fontWeight: 'normal'}}>{item.time}</Text></Text>
              <Text style={{fontSize: 15, color: '#565656', margin: 5, width: '95%'}}>{this.title(item.text)}</Text>
            </View>
           <View style={{position: 'absolute', right: 10}}>{this.right(item.text)}</View>
       </TouchableOpacity>
    )
   render(){
    if(this.state.loading){
      return(
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
          <FastImage source={{uri: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/35771931234507.564a1d2403b3a.gif', 
          priority: FastImage.priority.high,}} style={{
            width: 100, height: 100
          }}/>
        </View>
      )
    }else{
     return(
         <View style={{  flex: 1, alignContent: 'center', backgroundColor: 'white'}}>
         <FlatList
            data={this.state.data}
            renderItem={this.renderItem}
            refreshControl={<RefreshControl refreshing={this.state.loading} onRefresh={() => {
              const { params } = this.props.navigation.state
              const user = params ? params.user : null
  
              this.fetch(user)
              this.setState({data: [], loading: true})
            } } 
            />}
            ListHeaderComponent={<Text style={{margin: 10, marginLeft: 15, fontWeight: 'bold', fontSize: 20}}>Notifications</Text>}
          />
         </View>
     )
    }
   }
  }