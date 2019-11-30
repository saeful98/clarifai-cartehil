import React from "react";
import { View, Text, StyleSheet,ScrollView, TouchableOpacity, SafeAreaView, TextInput,Picker, Image  ,ActivityIndicator} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import Fire from "../Fire";
import * as ImagePicker from "expo-image-picker";
import { Notifications } from 'expo'

const firebase = require("firebase");
require("firebase/firestore");


export default class PostScreen extends React.Component {
    
    state = {
        email_p:"",
        nama: "",
        email:"",
        alamat: "",
        jk: "l",
        umur: "",
        lokasi: "",
        kronologi: "",
        image: null,
        id_u:Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),

        token: '',
  data: null,
  origin: null,

    };

    askPermissions = async () => {
        const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          return false;
        }
        return true;
      };
      
static navigationOptions = {
  header: null,
  };

  registerForPushNotifications = async () => {
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = status
    
      if (status !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus=status
      }
      if (status !== 'granted') {
        return;
      }
      const token = await Notifications.getExpoPushTokenAsync();
    
      this.subscription = Notifications.addListener(this.handleNotification);
    
      this.setState({
        token,
      });

      this.setState({id_u: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) })
        
      
      console.log(token,"token, reg")
      console.log(this.state.token,"this.state, reg")
    
          };
    
          enablePushNotifications = async () => {
            let token = await this.registerForPushNotifications();
            if (token) {
              Clipboard.setString(token);
              this.setState({ token });
            }
            console.log(token)
            console.log(this.state.token)
          };
    

    rubah=()=> {
        let id_u=this.state.value
        this.setState({id_u: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) })
        
    }
    
    componentDidMount() {
        this.getPhotoPermission();
        const { email } = firebase.auth().currentUser;
        this.setState({ email });
        this.registerForPushNotifications()
        //const id_m = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) ;
    }
    
    // atas dan bawah untuk cek permission 
    
    getPhotoPermission = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

            if (status != "granted") {
                alert("We need permission to use your camera roll if you'd like to incude a photo.");
            }
        }
    };

    pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true
        });

        if (!result.cancelled) {
            this.setState({ image: result.uri });
        }
    };
   
    handlePost = () => {
        const { navigate } = this.props.navigation;
        
        //memasukan id_u untuk id clarifai
        Fire.shared
            .addId({ 
                id_u: this.state.id_u.trim()
                 })
            .then(ref => {
                
                this.setState({  id_u: "" });
            })
            .catch(error => {
                alert(error);
            }),


        //memasukan seluruh data        
        Fire.shared
            .addPost({ 
                email_p: this.state.email.trim(),
                nama: this.state.nama.trim(),
                alamat: this.state.alamat.trim(),
                jk: this.state.jk.trim(),
                umur: this.state.umur.trim(),
                lokasi: this.state.lokasi.trim(),
                kronologi: this.state.kronologi.trim(),
                token: this.state.token.trim(),
                id_u: this.state.id_u.trim(),
                image: null,
                localUri: this.state.image })
            .then(ref => {
                
                this.setState({ 
                    nama: "",
                    alamat: "",
                    jk: "", 
                    umur: "",
                    lokasi: "",
                    kronologi: "",
                    id_u: "",
                    image: null });
                    navigate('App')
            })
            .catch(error => {
                alert(error);
            });

    };


    render() {
    
         let id_u=this.state.id_u
        // this.rubah()
        // console.log(id_u)

        const { navigate } = this.props.navigation;
       
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() =>navigate('App')}>
                        <Ionicons name="md-home" size={24} color="#D8D9DB"></Ionicons>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.handlePost}>
                        <Text style={{ fontWeight: "500",color: 'white' }}>Post Tahap Pertama</Text>
                    </TouchableOpacity>
                </View>

            <ScrollView>
            <View style={styles.inputContainerss}>
                <Text>Masukan Gambar terlebih dahulu</Text>
                </View>
                <View style={styles.inputContainerss}>

                <TouchableOpacity style={styles.photo} onPress={this.pickImage}>
                    <Ionicons name="md-camera" size={32} color="#D8D9DB"></Ionicons>
                </TouchableOpacity>

                </View>
                <View style={{ marginHorizontal: 32, marginTop: 32, height: 150 }}>
                    <Image source={{ uri: this.state.image }} style={{ width: "100%", height: "100%" }}></Image>
                </View>

                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flexDirection: "row",
        alignItems: 'baseline',
        backgroundColor :'#b0003a',
        justifyContent: 'space-between',
        paddingHorizontal: 32,
            paddingVertical: 12,
        borderBottomColor: "#D8D9DB",
        marginBottom: 10,
    },
    inputContainer: {
        marginBottom: 8,
        marginHorizontal: 12,
        paddingVertical: 22,
        //margin: 32,
        //flexDirection: "row"
    },
    inputContainerss: {
        marginBottom: 8,
        marginHorizontal: 12,
        paddingHorizontal: 32,
        alignItems: 'center',
        backgroundColor :'gray',
        justifyContent: 'center',
    },
    inputTitle: {
        //color: "#8A8F9E",
        fontSize: 20,
        paddingVertical: 5,
    },
    input:{
        borderColor: "#8A8F9E",
        borderWidth: StyleSheet.hairlineWidth,
        height: 40,
        fontSize: 15,
        color: "#161F3D"
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 16
    },
    photo: {
        alignItems: "flex-end",
        marginHorizontal: 32
    }
});

